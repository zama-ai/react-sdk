import { QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import type { FhevmConfig } from "../config";
import type { Eip1193Provider } from "../internal/eip1193";
import { logger } from "../internal/logger";
import { useRelayerScript } from "../internal/useRelayerScript";
import type { GenericStringStorage } from "../storage/GenericStringStorage";
import { FhevmContext, type FhevmContextValue, type FhevmStatus } from "./context";
import { fhevmQueryClient } from "./queryClient";
import { useFhevmInstance } from "./useFhevmInstance";
import { InMemoryStorageProvider } from "./useInMemoryStorage";

/**
 * Props for FhevmProvider component.
 */
export interface FhevmProviderProps {
  /** FHEVM configuration created with createFhevmConfig */
  config: FhevmConfig;

  /** React children */
  children: React.ReactNode;

  /**
   * EIP-1193 provider for FHEVM operations.
   * This can be window.ethereum, a wagmi connector, or any EIP-1193 compatible provider.
   * If not provided, will attempt to use window.ethereum.
   */
  provider?: Eip1193Provider;

  /**
   * User's wallet address.
   * Required for encryption and decryption operations.
   */
  address?: `0x${string}`;

  /**
   * Current chain ID.
   * Required for FHEVM initialization.
   */
  chainId?: number;

  /**
   * Whether the wallet is connected.
   * Controls auto-initialization.
   */
  isConnected?: boolean;

  /**
   * Storage for caching decryption signatures.
   *
   * SECURITY NOTE: The SDK does NOT provide a default storage.
   * You must explicitly choose your storage strategy:
   *
   * - `memoryStorage` - Keys cleared on refresh (most secure, re-sign every time)
   * - `sessionStorageAdapter` - Keys cleared when tab closes
   * - `localStorageAdapter` - Persistent (accessible to any JS on the page)
   * - `indexedDBStorage` - Persistent (from config.storage)
   * - Custom storage - Implement GenericStringStorage interface
   * - `undefined` - No caching, re-sign every decrypt operation
   *
   * @example
   * ```tsx
   * import { memoryStorage } from 'fhevm-sdk';
   *
   * <FhevmProvider storage={memoryStorage} ... />
   * ```
   */
  storage?: GenericStringStorage;

  /**
   * @deprecated Use `address`, `chainId`, and `isConnected` props directly instead.
   * This prop will be removed in a future version.
   */
  wagmi?: {
    isConnected: boolean;
    chainId: number | undefined;
    address: `0x${string}` | undefined;
  };

  /**
   * Whether to automatically initialize when wallet connects.
   * Default: true
   */
  autoInit?: boolean;

  /**
   * API key for relayer authentication.
   * Required for relayer-sdk v0.4.0+ when using Zama's hosted relayer.
   *
   * Get your API key from the Zama dashboard.
   *
   * @example
   * ```tsx
   * <FhevmProvider
   *   config={config}
   *   apiKey={process.env.NEXT_PUBLIC_ZAMA_API_KEY}
   *   ...
   * />
   * ```
   */
  apiKey?: string;

  /**
   * Timeout in milliseconds for FHEVM initialization.
   * If initialization takes longer than this, it will be aborted and an error state set.
   * Default: 30000 (30 seconds)
   *
   * @example
   * ```tsx
   * <FhevmProvider
   *   config={config}
   *   initTimeout={60000} // 60 seconds
   *   ...
   * />
   * ```
   */
  initTimeout?: number;
}

/**
 * FhevmProvider initializes and manages the FHEVM instance.
 *
 * Wrap your app with this provider to enable FHE encryption/decryption.
 *
 * @example
 * ```tsx
 * // With wagmi
 * import { createFhevmConfig, FhevmProvider, sepolia, memoryStorage } from 'fhevm-sdk'
 * import { useAccount } from 'wagmi'
 *
 * const config = createFhevmConfig({
 *   chains: [sepolia],
 * })
 *
 * function App() {
 *   const { isConnected, chainId, address } = useAccount()
 *
 *   return (
 *     <FhevmProvider
 *       config={config}
 *       provider={window.ethereum}
 *       address={address}
 *       chainId={chainId}
 *       isConnected={isConnected}
 *       storage={memoryStorage}
 *     >
 *       <YourApp />
 *     </FhevmProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With viem only
 * import { createFhevmConfig, FhevmProvider, sepolia } from 'fhevm-sdk'
 * import { useWallet } from './useWallet' // Custom hook
 *
 * function App() {
 *   const { address, chainId, isConnected } = useWallet()
 *
 *   return (
 *     <FhevmProvider
 *       config={createFhevmConfig({ chains: [sepolia] })}
 *       provider={window.ethereum}
 *       address={address}
 *       chainId={chainId}
 *       isConnected={isConnected}
 *       // No storage = re-sign every time (most secure)
 *     >
 *       <YourApp />
 *     </FhevmProvider>
 *   )
 * }
 * ```
 */
/** Default timeout for FHEVM initialization (30 seconds) */
const DEFAULT_INIT_TIMEOUT = 30000;

export function FhevmProvider({
  config,
  children,
  provider: providerProp,
  address: addressProp,
  chainId: chainIdProp,
  isConnected: isConnectedProp,
  storage,
  wagmi,
  autoInit = true,
  apiKey,
  initTimeout = DEFAULT_INIT_TIMEOUT,
}: FhevmProviderProps): React.ReactElement {
  // Support deprecated wagmi prop for backwards compatibility
  const address = addressProp ?? wagmi?.address;
  const chainId = chainIdProp ?? wagmi?.chainId;
  const isConnected = isConnectedProp ?? wagmi?.isConnected ?? false;

  // Warn about deprecated wagmi prop
  useEffect(() => {
    if (wagmi && process.env.NODE_ENV !== "production") {
      logger.warn(
        "[FhevmProvider]",
        "The 'wagmi' prop is deprecated. " +
          "Use 'address', 'chainId', and 'isConnected' props directly instead."
      );
    }
  }, [wagmi]);

  // Load relayer SDK script automatically
  const { status: scriptStatus, error: scriptError, isReady: scriptReady } = useRelayerScript();

  // Get provider - prefer prop, fallback to window.ethereum
  const provider = useMemo((): Eip1193Provider | undefined => {
    if (providerProp) return providerProp;
    if (typeof window !== "undefined") {
      return (window as any).ethereum;
    }
    return undefined;
  }, [providerProp]);

  // Build mock chains map from config
  const mockChains = useMemo(() => {
    const map: Record<number, string> = {};
    for (const chain of config.chains) {
      if (chain.isMock && chain.rpcUrl) {
        map[chain.id] = chain.rpcUrl;
      }
    }
    return map;
  }, [config.chains]);

  // Check if we should skip initialization in SSR
  const shouldInitialize = useMemo(() => {
    if (!autoInit) return false;
    if (config.ssr && typeof window === "undefined") return false;
    return true;
  }, [autoInit, config.ssr]);

  // Use the new useFhevmInstance hook for instance management
  const {
    instance,
    status: instanceStatus,
    error: instanceError,
    refresh,
  } = useFhevmInstance({
    config,
    provider,
    chainId,
    isConnected,
    scriptReady,
    mockChains,
    apiKey,
    initTimeout,
    enabled: shouldInitialize,
  });

  // Combine script and instance status
  const status: FhevmStatus = useMemo(() => {
    if (scriptStatus === "loading") return "initializing";
    if (scriptStatus === "error") return "error";
    return instanceStatus;
  }, [scriptStatus, instanceStatus]);

  // Combine script and instance errors
  const error = scriptError ?? instanceError;

  // Build context value
  const contextValue = useMemo<FhevmContextValue>(
    () => ({
      config,
      instance,
      status,
      error,
      chainId,
      address,
      isConnected,
      provider,
      storage,
      refresh,
    }),
    [config, instance, status, error, chainId, address, isConnected, provider, storage, refresh]
  );

  return (
    <FhevmContext.Provider value={contextValue}>
      <QueryClientProvider client={fhevmQueryClient}>
        <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
      </QueryClientProvider>
    </FhevmContext.Provider>
  );
}
