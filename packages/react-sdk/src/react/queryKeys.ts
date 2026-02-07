/**
 * Query key factory for FHEVM TanStack Query operations.
 *
 * Following TanStack Query best practices for hierarchical keys:
 * - Keys are arrays for granular invalidation
 * - More specific keys extend from broader ones
 * - Use factory functions for type safety
 *
 * @example
 * ```typescript
 * // Invalidate all FHEVM queries
 * queryClient.invalidateQueries({ queryKey: fhevmKeys.all })
 *
 * // Invalidate all decryption queries
 * queryClient.invalidateQueries({ queryKey: fhevmKeys.decrypt() })
 *
 * // Get cached value for specific handle
 * queryClient.getQueryData(fhevmKeys.decryptHandle(chainId, handle, contract))
 * ```
 */
export const fhevmKeys = {
  /** Root key for all FHEVM queries */
  all: ["fhevm"] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Decryption Queries
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all decryption queries */
  decrypt: () => [...fhevmKeys.all, "decrypt"] as const,

  /** Key for a specific decrypted handle value */
  decryptHandle: (chainId: number, handle: string, contractAddress: string) =>
    [...fhevmKeys.decrypt(), chainId, handle, contractAddress] as const,

  /** Key for batch decryption results */
  decryptBatch: (chainId: number, handles: string[]) =>
    [...fhevmKeys.decrypt(), chainId, "batch", handles.sort().join(",")] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Public Decryption Queries
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all public decryption queries */
  publicDecrypt: () => [...fhevmKeys.all, "publicDecrypt"] as const,

  /** Key for a specific publicly decrypted handle value */
  publicDecryptHandle: (chainId: number, handle: string) =>
    [...fhevmKeys.publicDecrypt(), chainId, handle] as const,

  /** Key for batch public decryption results */
  publicDecryptBatch: (chainId: number, handles: string[]) =>
    [...fhevmKeys.publicDecrypt(), chainId, "batch", handles.sort().join(",")] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Signature Queries
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all signature queries */
  signature: () => [...fhevmKeys.all, "signature"] as const,

  /** Key for a user's decryption signature on a specific chain */
  signatureFor: (chainId: number, address: string) =>
    [...fhevmKeys.signature(), chainId, address.toLowerCase()] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Encryption Mutations (keys useful for tracking/invalidation)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all encryption mutations */
  encrypt: () => [...fhevmKeys.all, "encrypt"] as const,

  /** Key for tracking encryption to a specific contract */
  encryptFor: (chainId: number, contractAddress: string) =>
    [...fhevmKeys.encrypt(), chainId, contractAddress.toLowerCase()] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Instance/Initialization Queries
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for FHEVM instance queries */
  instance: () => [...fhevmKeys.all, "instance"] as const,

  /** Key for instance on a specific chain */
  instanceFor: (chainId: number) => [...fhevmKeys.instance(), chainId] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Transaction Mutations (Phase 1: useConfidentialTransfer, useShield, useUnshield)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all confidential transfer mutations */
  transfer: () => [...fhevmKeys.all, "transfer"] as const,

  /** Key for transfers to a specific ERC7984 contract */
  transferFor: (chainId: number, contractAddress: string) =>
    [...fhevmKeys.transfer(), chainId, contractAddress.toLowerCase()] as const,

  /** Base key for all shield (ERC20 → ERC7984) mutations */
  shield: () => [...fhevmKeys.all, "shield"] as const,

  /** Key for shield operations to a specific wrapper contract */
  shieldFor: (chainId: number, wrapperAddress: string) =>
    [...fhevmKeys.shield(), chainId, wrapperAddress.toLowerCase()] as const,

  /** Base key for all unshield (ERC7984 → ERC20) mutations */
  unshield: () => [...fhevmKeys.all, "unshield"] as const,

  /** Key for unshield operations from a specific wrapper contract */
  unshieldFor: (chainId: number, wrapperAddress: string) =>
    [...fhevmKeys.unshield(), chainId, wrapperAddress.toLowerCase()] as const,

  // ─────────────────────────────────────────────────────────────────────────────
  // Balance Queries (Phase 2: useConfidentialBalances)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Base key for all balance queries */
  balance: () => [...fhevmKeys.all, "balance"] as const,

  /** Key for a single confidential balance */
  balanceFor: (chainId: number, contractAddress: string, account: string) =>
    [...fhevmKeys.balance(), chainId, contractAddress.toLowerCase(), account.toLowerCase()] as const,

  /** Key for batch confidential balance queries */
  balances: (chainId: number, contractAddresses: string[], account: string) =>
    [
      ...fhevmKeys.balance(),
      chainId,
      "batch",
      account.toLowerCase(),
      contractAddresses.map(a => a.toLowerCase()).sort().join(",")
    ] as const,
} as const;

/** Type helper for query key arrays */
export type FhevmQueryKey =
  | typeof fhevmKeys.all
  | ReturnType<typeof fhevmKeys.decrypt>
  | ReturnType<typeof fhevmKeys.decryptHandle>
  | ReturnType<typeof fhevmKeys.decryptBatch>
  | ReturnType<typeof fhevmKeys.publicDecrypt>
  | ReturnType<typeof fhevmKeys.publicDecryptHandle>
  | ReturnType<typeof fhevmKeys.publicDecryptBatch>
  | ReturnType<typeof fhevmKeys.signature>
  | ReturnType<typeof fhevmKeys.signatureFor>
  | ReturnType<typeof fhevmKeys.encrypt>
  | ReturnType<typeof fhevmKeys.encryptFor>
  | ReturnType<typeof fhevmKeys.instance>
  | ReturnType<typeof fhevmKeys.instanceFor>
  | ReturnType<typeof fhevmKeys.transfer>
  | ReturnType<typeof fhevmKeys.transferFor>
  | ReturnType<typeof fhevmKeys.shield>
  | ReturnType<typeof fhevmKeys.shieldFor>
  | ReturnType<typeof fhevmKeys.unshield>
  | ReturnType<typeof fhevmKeys.unshieldFor>
  | ReturnType<typeof fhevmKeys.balance>
  | ReturnType<typeof fhevmKeys.balanceFor>
  | ReturnType<typeof fhevmKeys.balances>;
