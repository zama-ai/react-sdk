"use client";

import { useQuery } from "@tanstack/react-query";
import type { FhevmInstance } from "../fhevmTypes";
import { FhevmDecryptionSignature } from "../FhevmDecryptionSignature";
import type { GenericStringStorage } from "../storage/GenericStringStorage";
import { useFhevmContext } from "./context";
import { FHEVM_QUERY_DEFAULTS } from "./core/constants";
import { fhevmKeys } from "./queryKeys";

/**
 * Options for useSignature hook.
 */
export interface UseSignatureOptions {
  /** Contract addresses for which the signature is valid */
  contractAddresses: `0x${string}`[];
  /** User address (optional, will use context address if not provided) */
  userAddress?: `0x${string}`;
  /** Whether to enable the query */
  enabled?: boolean;
}

/**
 * Return type for useSignature hook.
 */
export interface UseSignatureReturn {
  /** The loaded signature, if it exists in storage */
  signature: FhevmDecryptionSignature | null | undefined;
  /** Whether a signature exists in storage */
  isSignatureCached: boolean;
  /** Whether the query is loading */
  isLoading: boolean;
  /** Whether the query encountered an error */
  isError: boolean;
  /** Error if any */
  error: Error | null;
  /** Refetch the signature from storage */
  refetch: () => Promise<void>;
}

/**
 * Hook for querying cached decryption signatures from storage.
 *
 * This hook uses TanStack Query to reactively load and cache decryption signatures
 * from GenericStringStorage. It does NOT create new signatures (that happens during
 * the decrypt mutation). This is useful for:
 *
 * 1. Auto-decryption: Check if signature exists to avoid wallet popup
 * 2. Reactive updates: Know when signature becomes available
 * 3. Cache coordination: Share signature state across components
 *
 * @example
 * ```tsx
 * const { isSignatureCached, signature } = useSignature({
 *   contractAddresses: ['0x123...', '0x456...'],
 * });
 *
 * if (isSignatureCached) {
 *   // Auto-decrypt without wallet popup
 *   decryptAll();
 * }
 * ```
 */
export function useSignature(options: UseSignatureOptions): UseSignatureReturn {
  const { contractAddresses, userAddress: providedAddress, enabled = true } = options;

  const { chainId, address: contextAddress, storage, instance } = useFhevmContext();

  const userAddress = providedAddress ?? contextAddress;

  const signatureQuery = useQuery({
    queryKey: chainId && userAddress
      ? fhevmKeys.signatureFor(chainId, userAddress)
      : ["fhevm", "signature", "disabled"],

    queryFn: async (): Promise<FhevmDecryptionSignature | null> => {
      if (!storage || !instance || !userAddress) {
        return null;
      }

      try {
        const sig = await FhevmDecryptionSignature.loadFromGenericStringStorage(
          storage as GenericStringStorage,
          instance as FhevmInstance,
          contractAddresses,
          userAddress
        );
        return sig;
      } catch (err) {
        // If loading fails, treat as no signature
        console.warn("[useSignature] Failed to load signature:", err);
        return null;
      }
    },

    enabled: enabled && !!storage && !!instance && !!userAddress && contractAddresses.length > 0,
    staleTime: FHEVM_QUERY_DEFAULTS.SIGNATURE_STALE_TIME,
    gcTime: FHEVM_QUERY_DEFAULTS.SIGNATURE_GC_TIME,
  });

  const refetch = async (): Promise<void> => {
    await signatureQuery.refetch();
  };

  return {
    signature: signatureQuery.data,
    isSignatureCached: signatureQuery.data !== null && signatureQuery.data !== undefined,
    isLoading: signatureQuery.isLoading,
    isError: signatureQuery.isError,
    error: signatureQuery.error ?? null,
    refetch,
  };
}
