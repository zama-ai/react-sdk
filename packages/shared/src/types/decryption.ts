/**
 * Request to decrypt a specific handle from a contract.
 */
export interface DecryptRequest {
  /** The encrypted handle to decrypt */
  handle: `0x${string}`;
  /** Contract address that owns this encrypted value */
  contractAddress: `0x${string}`;
}

/**
 * Signature data required for user decryption.
 */
export interface SignatureData {
  /** The EIP-712 signature */
  signature: string;
  /** User's public key for decryption */
  publicKey: string;
  /** User's private key for decryption */
  privateKey: string;
  /** Contract addresses authorized for decryption */
  contractAddresses: `0x${string}`[];
  /** Unix timestamp when authorization starts (seconds) */
  startTimestamp: number;
  /** Number of days the authorization is valid */
  durationDays: number;
}

/**
 * EIP-712 typed data for decryption authorization.
 */
export interface EIP712TypedData {
  domain: {
    chainId: number;
    name: string;
    verifyingContract: `0x${string}`;
    version: string;
  };
  message: Record<string, unknown>;
  primaryType: string;
  types: Record<string, { name: string; type: string }[]>;
}

/**
 * Result from decryption operation.
 * Maps handle -> decrypted value.
 */
export type DecryptResults = Record<string, bigint>;
