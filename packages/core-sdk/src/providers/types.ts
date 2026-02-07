/**
 * Provider type classification.
 */
export type ProviderType = "ethers" | "viem" | "eip1193" | "url";

/**
 * Unified transaction request.
 */
export interface TransactionRequest {
  to: `0x${string}`;
  data: `0x${string}`;
  value?: bigint;
  gasLimit?: bigint;
}

/**
 * Contract read parameters.
 */
export interface ReadContractParams {
  address: `0x${string}`;
  abi: unknown[];
  functionName: string;
  args?: unknown[];
}

/**
 * Unified provider interface that abstracts ethers.js and viem.
 */
export interface UnifiedProvider {
  /** Provider type */
  type: ProviderType;

  /** Send a transaction */
  sendTransaction(tx: TransactionRequest): Promise<`0x${string}`>;

  /** Read from a contract */
  readContract(params: ReadContractParams): Promise<unknown>;

  /** Get the signer's address */
  getAddress(): Promise<`0x${string}`>;

  /** Get the original raw provider */
  getRawProvider(): unknown;
}

/**
 * EIP-1193 Provider interface.
 */
export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}
