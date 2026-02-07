"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef } from "react";
import type { FhevmConfig } from "../config";
import type { FhevmInstance } from "../fhevmTypes";
import type { Eip1193Provider } from "../internal/eip1193";
import { createFhevmInstance, FhevmAbortError } from "../internal/fhevm";
import { logger } from "../internal/logger";
import { FHEVM_QUERY_DEFAULTS } from "./core/constants";
import { fhevmKeys } from "./queryKeys";

/**
 * Parameters for the FHEVM instance query.
 */
export interface UseFhevmInstanceOptions {
  /** FHEVM configuration */
  config: FhevmConfig;
  /** EIP-1193 provider or RPC URL string for FHEVM instance initialization */
  provider: Eip1193Provider | string | undefined;
  /** Current chain ID */
  chainId: number | undefined;
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Whether relayer script is ready */
  scriptReady: boolean;
  /** Map of mock chain IDs to RPC URLs */
  mockChains: Record<number, string>;
  /** API key for relayer */
  apiKey?: string;
  /** Timeout in milliseconds */
  initTimeout?: number;
  /** Whether to enable auto-initialization */
  enabled?: boolean;
}

/**
 * Return type for useFhevmInstance hook.
 */
export interface UseFhevmInstanceReturn {
  /** The FHEVM instance, or undefined if not ready */
  instance: FhevmInstance | undefined;
  /** Current status */
  status: "idle" | "initializing" | "ready" | "error";
  /** Error if initialization failed */
  error: Error | null;
  /** Whether instance is currently loading */
  isLoading: boolean;
  /** Whether instance is ready */
  isReady: boolean;
  /** Whether instance failed to initialize */
  isError: boolean;
  /** Manually refresh the instance */
  refresh: () => void;
}

/**
 * Hook for managing FHEVM instance with TanStack Query.
 *
 * Provides automatic retry, timeout handling, and request deduplication.
 *
 * @internal This is an internal hook used by FhevmProvider
 */
export function useFhevmInstance(options: UseFhevmInstanceOptions): UseFhevmInstanceReturn {
  const {
    config,
    provider,
    chainId,
    isConnected,
    scriptReady,
    mockChains,
    apiKey,
    initTimeout = 30000,
    enabled = true,
  } = options;

  // Track abort controller for timeout handling
  const abortControllerRef = useRef<AbortController | null>(null);

  // Determine if we should initialize
  const shouldInit = useMemo(() => {
    return (
      enabled &&
      isConnected &&
      chainId !== undefined &&
      provider !== undefined &&
      scriptReady &&
      config.getChain(chainId) !== undefined
    );
  }, [enabled, isConnected, chainId, provider, scriptReady, config]);

  // TanStack Query for instance management
  const query = useQuery({
    queryKey: chainId
      ? fhevmKeys.instanceFor(chainId)
      : ["fhevm", "instance", "disabled"],

    queryFn: async ({ signal }): Promise<FhevmInstance> => {
      if (!provider) {
        throw new Error("No provider available");
      }

      if (chainId === undefined) {
        throw new Error("No chain ID available");
      }

      const chain = config.getChain(chainId);
      if (!chain) {
        throw new Error(`Chain ${chainId} is not configured`);
      }

      logger.debug("[useFhevmInstance]", `Initializing FHEVM for chain ${chainId}`);

      // Create abort controller for timeout
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Forward query abort signal
      signal.addEventListener("abort", () => {
        abortController.abort();
      });

      // Set up timeout
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (initTimeout > 0) {
        timeoutId = setTimeout(() => {
          if (!abortController.signal.aborted) {
            logger.warn(
              "[useFhevmInstance]",
              `Initialization timed out after ${initTimeout}ms for chain ${chainId}`
            );
            abortController.abort();
          }
        }, initTimeout);
      }

      try {
        const instance = await createFhevmInstance({
          provider,
          mockChains,
          signal: abortController.signal,
          onStatusChange: (sdkStatus) => {
            logger.debug("[useFhevmInstance]", `SDK status: ${sdkStatus}`);
          },
          apiKey,
        });

        // Clear timeout on success
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        logger.debug("[useFhevmInstance]", `FHEVM instance ready for chain ${chainId}`);
        return instance;
      } catch (err) {
        // Clear timeout on error
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        if (err instanceof FhevmAbortError) {
          logger.debug("[useFhevmInstance]", "Initialization aborted");
          throw new Error("Initialization aborted");
        }

        if (abortController.signal.aborted) {
          throw new Error(
            `FHEVM initialization timed out after ${initTimeout}ms. ` +
              `This may indicate network issues or an unresponsive relayer.`
          );
        }

        logger.error("[useFhevmInstance]", "Failed to initialize FHEVM:", err);
        throw err instanceof Error ? err : new Error(String(err));
      }
    },

    enabled: shouldInit,

    // Retry configuration
    retry: FHEVM_QUERY_DEFAULTS.INSTANCE_RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    // Cache configuration
    staleTime: FHEVM_QUERY_DEFAULTS.SIGNATURE_STALE_TIME, // Instance doesn't go stale once created
    gcTime: FHEVM_QUERY_DEFAULTS.INSTANCE_GC_TIME,

    // Don't refetch on window focus for instance initialization
    refetchOnWindowFocus: false,
  });

  // Map query status to FHEVM status
  const status = useMemo(() => {
    if (!enabled || !shouldInit) return "idle";
    if (query.isLoading) return "initializing";
    if (query.isError) return "error";
    if (query.isSuccess) return "ready";
    return "idle";
  }, [enabled, shouldInit, query.isLoading, query.isError, query.isSuccess]);

  // Refresh callback
  const refresh = useCallback(() => {
    query.refetch();
  }, [query]);

  return {
    instance: query.data,
    status,
    error: query.error as Error | null,
    isLoading: query.isLoading,
    isReady: query.isSuccess,
    isError: query.isError,
    refresh,
  };
}
