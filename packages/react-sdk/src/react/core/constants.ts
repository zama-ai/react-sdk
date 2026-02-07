/**
 * Constants for FHEVM React SDK
 *
 * Centralizes magic numbers, function signatures, and common values
 * for consistency and easier maintenance.
 */

/**
 * Default query configuration for FHEVM operations.
 *
 * These values control TanStack Query's caching and refetching behavior.
 */
export const FHEVM_QUERY_DEFAULTS = {
  /** Stale time for balance queries (30 seconds) */
  BALANCE_STALE_TIME: 30_000,

  /** Stale time for allowance queries (5 seconds) */
  ALLOWANCE_STALE_TIME: 5_000,

  /** Stale time for signatures (never stale once created) */
  SIGNATURE_STALE_TIME: Infinity,

  /** Stale time for underlying token address (never changes) */
  UNDERLYING_STALE_TIME: Infinity,

  /** Garbage collection time for instance cache (5 minutes) */
  INSTANCE_GC_TIME: 5 * 60 * 1000,

  /** Garbage collection time for signatures (30 minutes) */
  SIGNATURE_GC_TIME: 30 * 60 * 1000,

  /** Garbage collection time for balances (5 minutes) */
  BALANCE_GC_TIME: 5 * 60 * 1000,

  /** Number of retries for instance initialization */
  INSTANCE_RETRY_COUNT: 2,

  /** Default initialization timeout (30 seconds) */
  DEFAULT_INIT_TIMEOUT: 30_000,

  /** Delay for exponential backoff between retries */
  RETRY_DELAY_BASE: 1000,

  /** Maximum retry delay (10 seconds) */
  RETRY_DELAY_MAX: 10_000,
} as const;

/**
 * ERC7984 (Confidential Token) function signatures.
 *
 * These are the full function signatures required by ethers.js
 * to avoid overload ambiguity when calling contract methods.
 */
export const ERC7984_FUNCTIONS = {
  /** Confidential transfer: confidentialTransfer(address,bytes32,bytes) */
  TRANSFER: "confidentialTransfer(address,bytes32,bytes)",

  /** Get confidential balance: confidentialBalanceOf(address) */
  BALANCE_OF: "confidentialBalanceOf(address)",

  /** Wrap ERC20 to ERC7984: wrap(address,uint256) */
  WRAP: "wrap(address,uint256)",

  /** Unwrap ERC7984 to ERC20: unwrap(address) */
  UNWRAP: "unwrap(address)",

  /** Request decryption: requestDecryption(bytes32) */
  REQUEST_DECRYPTION: "requestDecryption(bytes32)",

  /** Finalize unwrap: finalizeUnwrap(address) */
  FINALIZE_UNWRAP: "finalizeUnwrap(address)",

  /** Get underlying token: underlying() */
  UNDERLYING: "underlying()",
} as const;

/**
 * ERC20 function signatures.
 */
export const ERC20_FUNCTIONS = {
  /** Get allowance: allowance(address,address) */
  ALLOWANCE: "allowance(address,address)",

  /** Approve spender: approve(address,uint256) */
  APPROVE: "approve(address,uint256)",

  /** Get balance: balanceOf(address) */
  BALANCE_OF: "balanceOf(address)",
} as const;

/**
 * Common contract addresses and constants.
 */
export const CONTRACT_CONSTANTS = {
  /** Zero address (0x0000...0000) */
  ZERO_ADDRESS: "0x0000000000000000000000000000000000000000" as const,

  /** Max uint256 value for approvals */
  MAX_UINT256: 2n ** 256n - 1n,
} as const;

/**
 * Re-export for convenience
 */
export const ZERO_ADDRESS = CONTRACT_CONSTANTS.ZERO_ADDRESS;
export const MAX_UINT256 = CONTRACT_CONSTANTS.MAX_UINT256;
