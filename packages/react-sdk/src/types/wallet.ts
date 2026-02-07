/**
 * Lightweight wallet interface for FHE operations.
 *
 * Accepts `sendTransaction` + `signTypedData` directly so that
 * both viem and ethers users can implement it in 3-5 lines
 * without building an EIP-1193 adapter.
 *
 * @example viem
 * ```ts
 * import { walletClient } from './viem'
 *
 * const wallet: FhevmWallet = {
 *   address: walletClient.account.address,
 *   sendTransaction: (tx) => walletClient.sendTransaction({ ...tx, account: walletClient.account, chain }),
 *   signTypedData: (td) => walletClient.signTypedData({ ...td, account: walletClient.account }),
 * }
 * ```
 *
 * @example ethers
 * ```ts
 * import { signer } from './ethers'
 *
 * const wallet: FhevmWallet = {
 *   address: await signer.getAddress() as `0x${string}`,
 *   sendTransaction: async (tx) => {
 *     const resp = await signer.sendTransaction(tx)
 *     return resp.hash as `0x${string}`
 *   },
 *   signTypedData: (td) => signer.signTypedData(td.domain, td.types, td.message),
 * }
 * ```
 */
export interface FhevmWallet {
  /** The wallet's address */
  address: `0x${string}`;

  /**
   * Send a transaction and return the transaction hash.
   */
  sendTransaction(tx: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}`>;

  /**
   * Sign EIP-712 typed data and return the signature.
   */
  signTypedData(typedData: {
    domain: Record<string, unknown>;
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown>;
  }): Promise<`0x${string}`>;
}
