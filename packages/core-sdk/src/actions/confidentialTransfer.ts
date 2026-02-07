import type { FhevmConfig } from "../config/types.js";
import { detectAndWrapProvider } from "../providers/detect.js";
import { ERC7984_ABI } from "../abi/index.js";
import { encrypt } from "./encrypt.js";
import { FhevmTransactionError } from "@zama-fhe/shared/utils";
import { assertAddress, assertChainId } from "@zama-fhe/shared/utils";

/**
 * Parameters for confidential transfer.
 */
export interface ConfidentialTransferParams {
  /** Chain ID */
  chainId: number;
  /** ERC7984 token contract address */
  contractAddress: `0x${string}`;
  /** Recipient address */
  to: `0x${string}`;
  /** Amount to transfer (cleartext) */
  amount: bigint;
  /** User address (optional - will use provider's address if not specified) */
  userAddress?: `0x${string}`;
  /** Provider (ethers Signer, viem WalletClient, etc.) */
  provider: unknown;
  /** Custom ABI (optional) */
  abi?: unknown[];
  /** Custom function name (optional) */
  functionName?: string;
}

/**
 * Result from confidential transfer.
 */
export interface ConfidentialTransferResult {
  /** Transaction hash */
  txHash: `0x${string}`;
  /** Status */
  status: "success";
}

/**
 * Execute a confidential ERC7984 token transfer.
 *
 * Encrypts the amount and sends a transaction to transfer tokens confidentially.
 *
 * Works with both ethers.js and viem providers.
 *
 * @example
 * ```typescript
 * // Using ethers.js
 * import { ethers } from 'ethers'
 * const provider = new ethers.BrowserProvider(window.ethereum)
 * const signer = await provider.getSigner()
 *
 * const result = await confidentialTransfer(config, {
 *   chainId: 11155111,
 *   contractAddress: '0xToken...',
 *   to: '0xRecipient...',
 *   amount: 100n,
 *   provider: signer,
 * })
 *
 * // Using viem
 * import { createWalletClient, custom } from 'viem'
 * const client = createWalletClient({
 *   chain: sepolia,
 *   transport: custom(window.ethereum),
 * })
 *
 * const result = await confidentialTransfer(config, {
 *   chainId: 11155111,
 *   contractAddress: '0xToken...',
 *   to: '0xRecipient...',
 *   amount: 100n,
 *   provider: client,
 * })
 * ```
 */
export async function confidentialTransfer(
  config: FhevmConfig,
  params: ConfidentialTransferParams
): Promise<ConfidentialTransferResult> {
  const {
    chainId,
    contractAddress,
    to,
    amount,
    provider: rawProvider,
    // abi = ERC7984_ABI,
    // functionName = "confidentialTransfer",
  } = params;

  // Suppress unused variable warnings
  void ERC7984_ABI;

  // Validate inputs
  assertChainId(chainId);
  assertAddress(contractAddress, "contractAddress");
  assertAddress(to, "to");

  if (amount < 0n) {
    throw new FhevmTransactionError("Amount must be non-negative");
  }

  try {
    // Detect and wrap provider
    const provider = detectAndWrapProvider(rawProvider);

    // Get user address
    const userAddress = params.userAddress ?? (await provider.getAddress());

    // Step 1: Encrypt the amount
    void (await encrypt(config, {
      chainId,
      values: [{ type: "uint64", value: amount }],
      contractAddress,
      userAddress,
    }));

    // TODO: Use encrypted values when ABI encoding is implemented
    // const [amountHandle] = encrypted.handles;
    // const proof = encrypted.inputProof;

    // Step 2: Encode function call
    // TODO: Implement proper ABI encoding
    // For now, we throw an error until ABI encoding is implemented
    throw new Error(
      "confidentialTransfer() not yet fully implemented. Requires ABI encoding support."
    );

    // Future implementation:
    /*
    const data = encodeFunctionData({
      abi,
      functionName,
      args: [to, amountHandle, proof],
    });

    // Step 3: Send transaction
    const txHash = await provider.sendTransaction({
      to: contractAddress,
      data,
    });

    return {
      txHash,
      status: "success",
    };
    */
  } catch (error) {
    throw new FhevmTransactionError(
      `Confidential transfer failed: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
}

// /**
//  * Helper to encode function data.
//  * Will use ethers or viem depending on availability.
//  * @internal
//  */
// async function _encodeFunctionData(params: {
//   abi: unknown[];
//   functionName: string;
//   args: unknown[];
// }): Promise<`0x${string}`> {
//   // Try viem first
//   try {
//     const viem = await import("viem");
//     return viem.encodeFunctionData({
//       abi: params.abi as any,
//       functionName: params.functionName,
//       args: params.args,
//     });
//   } catch {
//     // Viem not available, try ethers
//   }

//   // Try ethers
//   try {
//     const ethers = await import("ethers");
//     const iface = new ethers.Interface(params.abi as any);
//     return iface.encodeFunctionData(params.functionName, params.args) as `0x${string}`;
//   } catch {
//     // Ethers not available
//   }

//   throw new Error(
//     "ABI encoding requires either 'viem' or 'ethers' to be installed as a peer dependency"
//   );
// }
