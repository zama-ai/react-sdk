import type { FhevmConfig } from "../config/types.js";
import { detectAndWrapProvider } from "../providers/detect.js";
import { ERC7984_ABI } from "../abi/index.js";
import { FhevmTransactionError } from "@zama-fhe/shared/utils";
import { assertAddress, assertChainId } from "@zama-fhe/shared/utils";

/**
 * Parameters for reading a single confidential balance.
 */
export interface ConfidentialBalanceParams {
  /** Chain ID */
  chainId: number;
  /** ERC7984 token contract address */
  contractAddress: `0x${string}`;
  /** Account address to read balance for */
  account: `0x${string}`;
  /** Provider (ethers Provider, viem PublicClient, or RPC URL) */
  provider: unknown;
  /** Custom ABI (optional) */
  abi?: unknown[];
}

/**
 * Parameters for reading multiple confidential balances.
 */
export interface ConfidentialBalancesParams {
  /** Chain ID */
  chainId: number;
  /** Array of contract configurations */
  contracts: Array<{
    contractAddress: `0x${string}`;
    account: `0x${string}`;
    abi?: unknown[];
  }>;
  /** Provider */
  provider: unknown;
}

const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Read an encrypted balance handle from an ERC7984 contract.
 *
 * Returns the encrypted handle - use decrypt() to get the actual value.
 *
 * @example
 * ```typescript
 * const handle = await confidentialBalance(config, {
 *   chainId: 11155111,
 *   contractAddress: '0xToken...',
 *   account: '0xUser...',
 *   provider: 'https://sepolia.infura.io/v3/...',
 * })
 *
 * if (handle) {
 *   // Decrypt to get actual balance
 *   const [balance] = await decrypt(config, {
 *     chainId: 11155111,
 *     requests: [{ handle, contractAddress: '0xToken...' }],
 *     userAddress: '0xUser...',
 *     signature: mySignature,
 *     provider: window.ethereum,
 *   })
 * }
 * ```
 */
export async function confidentialBalance(
  config: FhevmConfig,
  params: ConfidentialBalanceParams
): Promise<`0x${string}` | undefined> {
  const { chainId, contractAddress, account, provider: rawProvider, abi = ERC7984_ABI } = params;

  // Validate inputs
  assertChainId(chainId);
  assertAddress(contractAddress, "contractAddress");
  assertAddress(account, "account");

  // Verify chain exists
  const chain = config.getChain(chainId);
  if (!chain) {
    throw new FhevmTransactionError(`Chain ${chainId} not found in config`);
  }

  try {
    // Handle RPC URL
    if (typeof rawProvider === "string") {
      // TODO: Create read-only provider from URL
      throw new Error("RPC URL support not yet implemented. Use ethers.JsonRpcProvider or viem.createPublicClient");
    }

    const provider = detectAndWrapProvider(rawProvider);

    const result = await provider.readContract({
      address: contractAddress,
      abi: abi as any,
      functionName: "confidentialBalanceOf",
      args: [account],
    });

    // Check for zero hash (no balance)
    if (result === ZERO_HASH) {
      return undefined;
    }

    return result as `0x${string}`;
  } catch (error) {
    throw new FhevmTransactionError(
      `Failed to read confidential balance: ${error instanceof Error ? error.message : String(error)}`,
      { cause: error }
    );
  }
}

/**
 * Read encrypted balance handles from multiple ERC7984 contracts in parallel.
 *
 * Similar to wagmi's useReadContracts - fetches multiple balances efficiently.
 *
 * @example
 * ```typescript
 * const balances = await confidentialBalances(config, {
 *   chainId: 11155111,
 *   contracts: [
 *     { contractAddress: '0xTokenA...', account: '0xUser...' },
 *     { contractAddress: '0xTokenB...', account: '0xUser...' },
 *     { contractAddress: '0xTokenC...', account: '0xOther...' },
 *   ],
 *   provider: 'https://sepolia.infura.io/v3/...',
 * })
 *
 * // balances = ['0xHandle1...', undefined, '0xHandle3...']
 * ```
 */
export async function confidentialBalances(
  config: FhevmConfig,
  params: ConfidentialBalancesParams
): Promise<Array<`0x${string}` | undefined>> {
  const { contracts } = params;

  // Fetch all balances in parallel
  const results = await Promise.allSettled(
    contracts.map((contract) =>
      confidentialBalance(config, {
        ...params,
        contractAddress: contract.contractAddress,
        account: contract.account,
        abi: contract.abi,
      })
    )
  );

  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    // On error, return undefined
    return undefined;
  });
}
