import type { UnifiedProvider, TransactionRequest, ReadContractParams } from "./types.js";

/**
 * Minimal type definitions for viem to avoid hard dependency.
 */
interface ViemAccount {
  address: `0x${string}`;
}

interface ViemWalletClient {
  account?: ViemAccount;
  chain?: { id: number };
  transport?: unknown;
  type?: string;
  sendTransaction(args: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
    gas?: bigint;
  }): Promise<`0x${string}`>;
  readContract(args: {
    address: `0x${string}`;
    abi: unknown[];
    functionName: string;
    args?: unknown[];
  }): Promise<unknown>;
}

/**
 * Check if a value is a viem WalletClient or PublicClient.
 *
 * Viem v2 clients have these properties:
 * - chain: the network configuration
 * - transport: the RPC transport
 * - type: client type (e.g., "walletClient", "publicClient")
 * - Either sendTransaction (WalletClient) or readContract (PublicClient)
 */
function isViemClient(obj: unknown): obj is ViemWalletClient {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "chain" in obj &&
    "transport" in obj &&
    ("sendTransaction" in obj || "readContract" in obj)
  );
}

/**
 * Create a UnifiedProvider from a viem WalletClient or PublicClient.
 */
export function createViemProvider(client: unknown): UnifiedProvider {
  if (!isViemClient(client)) {
    throw new Error("Viem provider must be a WalletClient or PublicClient");
  }

  return {
    type: "viem",

    async sendTransaction(tx: TransactionRequest): Promise<`0x${string}`> {
      if (!("sendTransaction" in client)) {
        throw new Error("Viem client must be a WalletClient to send transactions");
      }
      const hash = await client.sendTransaction({
        to: tx.to,
        data: tx.data,
        value: tx.value,
        gas: tx.gasLimit,
      });
      return hash;
    },

    async readContract({ address, abi, functionName, args = [] }: ReadContractParams): Promise<unknown> {
      if (!("readContract" in client)) {
        throw new Error("Viem client must support readContract");
      }
      return await client.readContract({
        address,
        abi,
        functionName,
        args,
      });
    },

    async getAddress(): Promise<`0x${string}`> {
      if (!client.account) {
        throw new Error("Viem client must have an account to get address");
      }
      return client.account.address;
    },

    getRawProvider() {
      return client;
    },
  };
}

/**
 * Check if an object is a viem client.
 */
export function isViemProvider(obj: unknown): boolean {
  return isViemClient(obj);
}
