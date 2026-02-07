import type { UnifiedProvider, TransactionRequest, ReadContractParams } from "./types.js";

/**
 * Minimal type definitions for ethers.js to avoid hard dependency.
 */
interface EthersSigner {
  sendTransaction(tx: {
    to: string;
    data: string;
    value?: bigint;
    gasLimit?: bigint;
  }): Promise<{ hash: string; wait(): Promise<{ status?: number }> }>;
  getAddress(): Promise<string>;
  provider?: unknown; // Added to satisfy ContractRunner interface
}

/**
 * Check if a value is an ethers.js Signer.
 */
function isEthersSigner(obj: unknown): obj is EthersSigner {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "sendTransaction" in obj &&
    "getAddress" in obj &&
    typeof (obj as EthersSigner).sendTransaction === "function"
  );
}

/**
 * Create a UnifiedProvider from an ethers.js Signer or Provider.
 */
export function createEthersProvider(signerOrProvider: unknown): UnifiedProvider {
  if (!isEthersSigner(signerOrProvider)) {
    throw new Error("Ethers provider must be a Signer");
  }

  return {
    type: "ethers",

    async sendTransaction(tx: TransactionRequest): Promise<`0x${string}`> {
      const response = await signerOrProvider.sendTransaction({
        to: tx.to,
        data: tx.data,
        value: tx.value,
        gasLimit: tx.gasLimit,
      });
      return response.hash as `0x${string}`;
    },

    async readContract({ address, abi, functionName, args = [] }: ReadContractParams): Promise<unknown> {
      try {
        const ethers = await import("ethers");
        // Cast to any to avoid ContractRunner type issues
        const contract = new ethers.Contract(address, abi as any, signerOrProvider as any);
        const fn = contract[functionName];
        if (!fn || typeof fn !== "function") {
          throw new Error(`Function ${functionName} not found on contract`);
        }
        return await fn(...args);
      } catch (error) {
        throw new Error(
          `Failed to read contract. Ensure 'ethers' is installed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },

    async getAddress(): Promise<`0x${string}`> {
      const address = await signerOrProvider.getAddress();
      return address as `0x${string}`;
    },

    getRawProvider() {
      return signerOrProvider;
    },
  };
}

/**
 * Check if an object is an ethers.js Signer.
 */
export function isEthersProvider(obj: unknown): boolean {
  return isEthersSigner(obj);
}
