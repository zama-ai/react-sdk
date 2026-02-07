"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { ERC7984_ABI } from "../abi/index";
import { encodeFunctionCall, decodeFunctionResult, ZERO_HASH } from "../internal/abi";
import { logger } from "../internal/logger";
import type {
  BalanceStatus,
  ConfidentialBalanceConfig,
  ConfidentialBalanceResult,
  DecryptedValue,
  UseConfidentialBalancesOptions,
  UseConfidentialBalancesReturn,
} from "../types/balance";
import { useFhevmContext } from "./context";
import { FHEVM_QUERY_DEFAULTS } from "./core/constants";
import { fhevmKeys } from "./queryKeys";
import { useEthersSigner } from "./useEthersSigner";
import { useSignature } from "./useSignature";
import { useUserDecrypt, type DecryptRequest } from "./useUserDecrypt";
import { useUserDecryptedValues } from "./useUserDecryptedValue";
import { useWalletOrSigner } from "./useWalletOrSigner";

export type {
  BalanceStatus,
  ConfidentialBalanceConfig,
  ConfidentialBalanceResult,
  DecryptedValue,
  UseConfidentialBalancesOptions,
  UseConfidentialBalancesReturn,
};

function makePendingResults(length: number): ConfidentialBalanceResult[] {
  return Array.from({ length }, () => ({
    result: undefined,
    status: "pending" as const,
    error: undefined,
  }));
}

/**
 * Hook for reading encrypted balance handles from multiple ERC7984 contracts in parallel.
 *
 * Follows wagmi's `useReadContracts` pattern — accepts an array of contract configs
 * and returns per-item results.
 *
 * When `decrypt: true` is set, automatically composes `useUserDecrypt` and
 * `useUserDecryptedValues` internally so consumers get cleartext values without
 * manual wiring.
 *
 * @example
 * ```tsx
 * const { data, isLoading, refetch } = useConfidentialBalances({
 *   contracts: [
 *     { contractAddress: tokenA },
 *     { contractAddress: tokenB },
 *     { contractAddress: tokenC, account: otherAddress },
 *   ],
 * });
 * // data[0].result — handle for tokenA balance
 * // data[1].result — handle for tokenB balance
 * // data[2].result — handle for tokenC balance (for otherAddress)
 * ```
 *
 * @example
 * ```tsx
 * // With auto-decryption
 * const { data, decryptAll, isDecrypting, isAllDecrypted } = useConfidentialBalances({
 *   contracts: [{ contractAddress: tokenA }],
 *   decrypt: true,
 * });
 * // data[0].decryptedValue — cleartext value after decryptAll() is called
 * ```
 */
export function useConfidentialBalances(
  options: UseConfidentialBalancesOptions
): UseConfidentialBalancesReturn {
  const {
    contracts,
    account: sharedAccount,
    enabled = true,
    decrypt: autoDecrypt = false,
  } = options;

  const { address: contextAddress, chainId } = useFhevmContext();
  const { provider, isReady: providerReady } = useEthersSigner();
  const walletActions = useWalletOrSigner();

  const defaultAccount = sharedAccount ?? contextAddress;

  // Extract contract addresses for query key
  const contractAddresses = useMemo(
    () => contracts.map((c) => c.contractAddress),
    [contracts]
  );

  // TanStack Query for balance fetching
  const balanceQuery = useQuery({
    queryKey: chainId && defaultAccount
      ? fhevmKeys.balances(chainId, contractAddresses, defaultAccount)
      : ["fhevm", "balance", "disabled"],

    queryFn: async (): Promise<ConfidentialBalanceResult[]> => {
      if (!walletActions.isReady && !provider) {
        throw new Error("Provider not available. Please connect your wallet.");
      }

      if (!defaultAccount && contracts.every((c) => !c.account)) {
        throw new Error("No account address available.");
      }

      const settled = await Promise.allSettled(
        contracts.map(async (config) => {
          const account = config.account ?? defaultAccount;
          if (!account) {
            throw new Error(
              "No account address available for contract " + config.contractAddress
            );
          }

          // Wallet path: use ABI encoding + call (no custom ABI support needed for default)
          if (walletActions.isReady && !config.abi) {
            const data = encodeFunctionCall("confidentialBalanceOf(address)", [account]);
            const result = await walletActions.call(config.contractAddress, data);
            const decoded = decodeFunctionResult("bytes32", result) as `0x${string}`;
            logger.debug("[useConfidentialBalances]", "confidentialBalanceOf result:", {
              contractAddress: config.contractAddress,
              account,
              result: decoded,
              isZeroHash: decoded === ZERO_HASH,
            });
            return decoded === ZERO_HASH ? undefined : decoded;
          }

          // Legacy ethers path (or custom ABI)
          if (!provider) {
            throw new Error("Provider not available for contract " + config.contractAddress);
          }
          const abi = config.abi ?? ERC7984_ABI;
          const contract = new ethers.Contract(config.contractAddress, abi, provider);
          const result: string = await contract.confidentialBalanceOf!(account);
          logger.debug("[useConfidentialBalances]", "confidentialBalanceOf result:", {
            contractAddress: config.contractAddress,
            account,
            result,
            isZeroHash: result === ethers.ZeroHash,
          });
          return result === ethers.ZeroHash ? undefined : (result as `0x${string}`);
        })
      );

      const results: ConfidentialBalanceResult[] = settled.map((s) => {
        if (s.status === "fulfilled") {
          return { result: s.value, status: "success" as const, error: undefined };
        }
        const err = s.reason instanceof Error ? s.reason : new Error(String(s.reason));
        return { result: undefined, status: "failure" as const, error: err };
      });

      // If any result failed, throw the first error so the query goes into error state
      const firstFailure = results.find((r) => r.status === "failure");
      if (firstFailure) {
        throw firstFailure.error;
      }

      return results;
    },

    enabled: enabled && (walletActions.isReady || providerReady) && (!!defaultAccount || contracts.some((c) => c.account)),
    staleTime: FHEVM_QUERY_DEFAULTS.BALANCE_STALE_TIME,
    gcTime: FHEVM_QUERY_DEFAULTS.BALANCE_GC_TIME,
  });

  // Derive data with fallback to pending results
  const data = balanceQuery.data ?? makePendingResults(contracts.length);

  // Map TanStack Query states to our custom BalanceStatus
  const status: BalanceStatus = useMemo(() => {
    if (!enabled) return "idle";
    if (balanceQuery.isLoading) return "loading";
    if (balanceQuery.isError) return "error";
    if (balanceQuery.isSuccess) return "success";
    return "idle";
  }, [enabled, balanceQuery.isLoading, balanceQuery.isError, balanceQuery.isSuccess]);

  const isLoading = enabled && balanceQuery.isLoading;
  const isRefetching = enabled && balanceQuery.isRefetching;
  const isFetching = enabled && balanceQuery.isFetching;
  const isError = enabled && balanceQuery.isError;
  const isSuccess = enabled && balanceQuery.isSuccess;
  const error = enabled ? balanceQuery.error ?? null : null;

  // Refetch wrapper
  const refetch = useCallback(async (): Promise<void> => {
    await balanceQuery.refetch();
  }, [balanceQuery]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Auto-decryption: compose useUserDecrypt + useUserDecryptedValues
  // Hooks are called unconditionally (rules of hooks); undefined input = no-op.
  // ─────────────────────────────────────────────────────────────────────────────

  // 1. Build DecryptRequest[] from successfully fetched handles
  const decryptRequests: readonly DecryptRequest[] | undefined = useMemo(() => {
    if (!autoDecrypt) return undefined;
    const reqs: DecryptRequest[] = [];
    data.forEach((item, i) => {
      if (item.status === "success" && item.result) {
        reqs.push({ handle: item.result, contractAddress: contracts[i]!.contractAddress });
      }
    });
    return reqs.length > 0 ? reqs : undefined;
  }, [autoDecrypt, data, contracts]);

  // 2. Always call hooks (rules of hooks), pass undefined when disabled
  const {
    decrypt: triggerDecrypt,
    isDecrypting,
    canDecrypt,
    results: decryptResults,
    error: decryptErrorMsg,
  } = useUserDecrypt(decryptRequests);

  // 3. Read TanStack Query cache for previously decrypted values
  // Reuse decryptRequests as cacheHandles since they have the same structure
  const cacheHandles = useMemo(() => {
    if (!autoDecrypt || !decryptRequests) return undefined;
    // Convert readonly DecryptRequest[] to mutable array for useUserDecryptedValues
    return decryptRequests.map((r) => ({ handle: r.handle, contractAddress: r.contractAddress }));
  }, [autoDecrypt, decryptRequests]);

  const { values: cachedValues, allCached, cachedCount } = useUserDecryptedValues(cacheHandles);

  // 3b. Auto-decrypt: Check if signature is cached using useSignature hook.
  //     If found, trigger decryption automatically (no wallet popup).
  const autoDecryptTriggeredRef = useRef(false);

  // Stable key for the decrypt requests so we can reset the trigger ref
  const decryptRequestsKey = useMemo(
    () => (decryptRequests ? decryptRequests.map((r) => r.handle).join(",") : ""),
    [decryptRequests]
  );

  // Get unique contract addresses for signature query
  const signatureContractAddresses = useMemo(() => {
    if (!decryptRequests) return [];
    return [...new Set(decryptRequests.map((r) => r.contractAddress))];
  }, [decryptRequests]);

  // Use the new useSignature hook to reactively check signature availability
  const { isSignatureCached } = useSignature({
    contractAddresses: signatureContractAddresses,
    userAddress: (sharedAccount ?? contextAddress) as `0x${string}` | undefined,
    enabled: autoDecrypt && !allCached,
  });

  // Reset trigger when the set of handles changes
  useEffect(() => {
    autoDecryptTriggeredRef.current = false;
  }, [decryptRequestsKey]);

  // Auto-trigger decrypt when signature is cached and values aren't already decrypted
  useEffect(() => {
    if (
      autoDecrypt &&
      isSignatureCached &&
      canDecrypt &&
      !isDecrypting &&
      !allCached &&
      !autoDecryptTriggeredRef.current
    ) {
      autoDecryptTriggeredRef.current = true;
      triggerDecrypt();
    }
  }, [autoDecrypt, isSignatureCached, canDecrypt, isDecrypting, allCached, triggerDecrypt]);

  // 4. Merge decrypted values into data array
  const enrichedData = useMemo(() => {
    if (!autoDecrypt) return data;
    let cacheIdx = 0;
    return data.map((item) => {
      if (item.status !== "success" || !item.result) return item;
      // Prefer fresh mutation results, fallback to cache
      const value = decryptResults[item.result] ?? cachedValues[cacheIdx];
      cacheIdx++;
      return value !== undefined ? { ...item, decryptedValue: value } : item;
    });
  }, [autoDecrypt, data, decryptResults, cachedValues]);

  // 5. Return enrichedData + decryption fields with safe defaults
  const noOp = useCallback(() => {}, []);

  return {
    data: enrichedData,
    isLoading,
    isRefetching,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
    status,
    decryptAll: autoDecrypt ? triggerDecrypt : noOp,
    isDecrypting: autoDecrypt ? isDecrypting : false,
    canDecrypt: autoDecrypt ? canDecrypt : false,
    decryptError: autoDecrypt ? decryptErrorMsg : null,
    isAllDecrypted: autoDecrypt && allCached && (cacheHandles?.length ?? 0) > 0,
    decryptedCount: autoDecrypt ? cachedCount : 0,
  };
}
