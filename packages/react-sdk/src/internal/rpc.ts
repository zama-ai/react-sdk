/**
 * Simple JSON-RPC client for URL-based providers.
 * Used for RPC calls when we only have a URL (e.g., mock mode).
 * No ethers.js dependency.
 */

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: unknown[];
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export class JsonRpcError extends Error {
  code: number;
  data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = "JsonRpcError";
    this.code = code;
    this.data = data;
  }
}

let requestId = 0;

/**
 * Make a JSON-RPC call to a URL endpoint.
 */
export async function rpcCall<T = unknown>(
  rpcUrl: string,
  method: string,
  params: unknown[] = []
): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: "2.0",
    id: ++requestId,
    method,
    params,
  };

  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new JsonRpcError(`HTTP error: ${response.status} ${response.statusText}`, -32000);
  }

  const json: JsonRpcResponse<T> = await response.json();

  if (json.error) {
    throw new JsonRpcError(json.error.message, json.error.code, json.error.data);
  }

  return json.result as T;
}

/**
 * Get chain ID from an RPC URL.
 */
export async function getChainIdFromUrl(rpcUrl: string): Promise<number> {
  const chainId = await rpcCall<string>(rpcUrl, "eth_chainId");
  return Number.parseInt(chainId, 16);
}

/**
 * Get web3 client version from an RPC URL.
 * Used to detect if we're connected to a Hardhat node.
 */
export async function getWeb3ClientVersion(rpcUrl: string): Promise<string> {
  return rpcCall<string>(rpcUrl, "web3_clientVersion");
}

/**
 * Get FHEVM relayer metadata from a Hardhat node.
 * Returns undefined if not a FHEVM Hardhat node.
 */
export async function getFhevmRelayerMetadata(rpcUrl: string): Promise<
  | {
      ACLAddress: `0x${string}`;
      InputVerifierAddress: `0x${string}`;
      KMSVerifierAddress: `0x${string}`;
    }
  | undefined
> {
  try {
    const metadata = await rpcCall<{
      ACLAddress: string;
      InputVerifierAddress: string;
      KMSVerifierAddress: string;
    }>(rpcUrl, "fhevm_relayer_metadata");

    if (!metadata || typeof metadata !== "object") {
      return undefined;
    }

    if (typeof metadata.ACLAddress !== "string" || !metadata.ACLAddress.startsWith("0x")) {
      return undefined;
    }

    if (
      typeof metadata.InputVerifierAddress !== "string" ||
      !metadata.InputVerifierAddress.startsWith("0x")
    ) {
      return undefined;
    }

    if (
      typeof metadata.KMSVerifierAddress !== "string" ||
      !metadata.KMSVerifierAddress.startsWith("0x")
    ) {
      return undefined;
    }

    return {
      ACLAddress: metadata.ACLAddress as `0x${string}`,
      InputVerifierAddress: metadata.InputVerifierAddress as `0x${string}`,
      KMSVerifierAddress: metadata.KMSVerifierAddress as `0x${string}`,
    };
  } catch {
    return undefined;
  }
}

/**
 * Check if an RPC URL points to a Hardhat node.
 */
export async function isHardhatNode(rpcUrl: string): Promise<boolean> {
  try {
    const version = await getWeb3ClientVersion(rpcUrl);
    return typeof version === "string" && version.toLowerCase().includes("hardhat");
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Transaction receipt polling & eth_call
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal transaction receipt shape (only the fields the SDK needs).
 */
export interface TransactionReceipt {
  status: number;
  transactionHash: string;
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
  }>;
}

/**
 * Wait for a transaction receipt by polling the RPC endpoint.
 *
 * @param rpcUrl - The JSON-RPC endpoint URL
 * @param txHash - The transaction hash to wait for
 * @param timeoutMs - Maximum time to wait (default 120_000ms = 2 minutes)
 * @param pollIntervalMs - Time between polls (default 2000ms)
 * @returns The transaction receipt
 * @throws If the transaction is not found within the timeout
 */
export async function waitForReceipt(
  rpcUrl: string,
  txHash: `0x${string}`,
  timeoutMs = 120_000,
  pollIntervalMs = 2_000
): Promise<TransactionReceipt> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const receipt = await rpcCall<TransactionReceipt | null>(
      rpcUrl,
      "eth_getTransactionReceipt",
      [txHash]
    );

    if (receipt) {
      return {
        status: typeof receipt.status === "string"
          ? Number.parseInt(receipt.status as string, 16)
          : receipt.status,
        transactionHash: receipt.transactionHash,
        logs: receipt.logs ?? [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Transaction ${txHash} not confirmed within ${timeoutMs}ms`);
}

/**
 * Execute a read-only eth_call against a contract.
 *
 * @param rpcUrl - The JSON-RPC endpoint URL
 * @param to - The contract address
 * @param data - The ABI-encoded calldata
 * @returns The hex-encoded return data
 */
export async function ethCall(
  rpcUrl: string,
  to: `0x${string}`,
  data: `0x${string}`
): Promise<`0x${string}`> {
  const result = await rpcCall<string>(rpcUrl, "eth_call", [
    { to, data },
    "latest",
  ]);
  return result as `0x${string}`;
}

/**
 * Check if an RPC URL points to a FHEVM Hardhat node.
 * Returns the metadata if it is, undefined otherwise.
 */
export async function tryGetFhevmHardhatMetadata(rpcUrl: string): Promise<
  | {
      ACLAddress: `0x${string}`;
      InputVerifierAddress: `0x${string}`;
      KMSVerifierAddress: `0x${string}`;
    }
  | undefined
> {
  const isHardhat = await isHardhatNode(rpcUrl);
  if (!isHardhat) {
    return undefined;
  }
  return getFhevmRelayerMetadata(rpcUrl);
}
