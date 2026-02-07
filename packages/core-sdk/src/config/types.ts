import type { FhevmChain } from "../types/chain.js";
import type { Transport, TransportMap } from "../types/transport.js";

/**
 * Options for creating an FhevmConfig.
 */
export interface FhevmConfigOptions {
  /**
   * Array of FHE-enabled chains to support.
   * At least one chain must be provided.
   */
  chains: readonly FhevmChain[];

  /**
   * Transports for each chain.
   * Maps chain ID to transport configuration.
   *
   * @example
   * ```typescript
   * {
   *   [sepolia.id]: http('https://sepolia.infura.io/v3/...'),
   *   [hardhatLocal.id]: http('http://localhost:8545'),
   * }
   * ```
   */
  transports: TransportMap;
}

/**
 * FhevmConfig holds the configuration for FHE operations.
 * Created once at app startup and passed to actions.
 */
export interface FhevmConfig {
  /** Configured chains */
  readonly chains: readonly FhevmChain[];

  /** Transport configurations */
  readonly transports: TransportMap;

  /**
   * Get a chain by its ID.
   * Returns undefined if the chain is not configured.
   */
  getChain(chainId: number): FhevmChain | undefined;

  /**
   * Get a transport for a chain.
   * Returns undefined if the transport is not configured.
   */
  getTransport(chainId: number): Transport | undefined;

  /**
   * Check if a chain ID corresponds to a mock chain.
   */
  isMockChain(chainId: number): boolean;

  /**
   * Get the RPC URL for a mock chain.
   * Returns undefined for production chains or if chain is not found.
   */
  getMockRpcUrl(chainId: number): string | undefined;

  /**
   * Internal state - not for public use.
   * @internal
   */
  _internal: {
    chainMap: Map<number, FhevmChain>;
  };
}

/**
 * Type helper to extract chain IDs from a config.
 * Useful for type-safe chain selection.
 */
export type ConfigChainId<C extends FhevmConfig> = C["chains"][number]["id"];
