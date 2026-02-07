/**
 * Transport types for connecting to blockchain networks.
 * Similar to wagmi's transport system.
 */

/**
 * HTTP transport configuration.
 */
export interface HttpTransportConfig {
  /** RPC URL */
  url?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Batch JSON-RPC requests */
  batch?: boolean;
}

/**
 * Custom transport configuration.
 * Allows providing a custom provider (ethers, viem, etc.)
 */
export interface CustomTransportConfig {
  /** Custom provider */
  provider: unknown;
}

/**
 * Fallback transport configuration.
 * Tries multiple transports in order.
 */
export interface FallbackTransportConfig {
  /** Array of transports to try in order */
  transports: Transport[];
}

/**
 * Transport type union.
 */
export type Transport =
  | { type: "http"; config: HttpTransportConfig }
  | { type: "custom"; config: CustomTransportConfig }
  | { type: "fallback"; config: FallbackTransportConfig };

/**
 * Transport map - maps chain ID to transport.
 */
export type TransportMap = Record<number, Transport>;
