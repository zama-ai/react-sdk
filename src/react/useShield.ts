"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ERC20TOERC7984_ABI, ERC20_ABI } from "../abi/index";
import type { ShieldStatus, UseShieldOptions, UseShieldReturn } from "../types/shield";
import { useFhevmContext } from "./context";
import { FHEVM_QUERY_DEFAULTS, ZERO_ADDRESS } from "./core/constants";
import { fhevmKeys } from "./queryKeys";
import { useEthersSigner } from "./useEthersSigner";
import { useMutationWrapper } from "./utils/useMutationWrapper";
import { normalizeTransactionError } from "./utils/errorHandling";
import { useMutationStatus } from "./utils/useMutationStatus";

// Re-export types for convenience
export type { ShieldStatus, UseShieldOptions, UseShieldReturn };

/**
 * Parameters for the shield mutation function.
 */
interface ShieldParams {
  amount: bigint;
  to?: `0x${string}`;
}

/**
 * Result data from a successful shield operation.
 */
interface ShieldResult {
  txHash: string;
  status: ShieldStatus;
}

/**
 * Hook for shielding ERC20 tokens into confidential ERC7984 tokens.
 *
 * Now powered by TanStack Query's `useMutation` for automatic state management.
 *
 * Handles the full flow:
 * 1. Check ERC20 allowance for the wrapper contract
 * 2. Approve if needed (prompts wallet signature)
 * 3. Call wrap() to convert ERC20 → ERC7984
 * 4. Wait for confirmation
 *
 * @example
 * ```tsx
 * function ShieldForm({ wrapperAddress }) {
 *   const [amount, setAmount] = useState("");
 *
 *   const {
 *     shield,
 *     status,
 *     isApproving,
 *     isWrapping,
 *     isPending,
 *     error,
 *     allowance,
 *   } = useShield({
 *     wrapperAddress,
 *     onSuccess: (hash) => console.log("Shielded!", hash),
 *   });
 *
 *   const handleSubmit = async () => {
 *     await shield(BigInt(amount));
 *   };
 *
 *   return (
 *     <div>
 *       <input value={amount} onChange={e => setAmount(e.target.value)} />
 *       <button onClick={handleSubmit} disabled={isPending}>
 *         {isApproving ? "Approving..." : isWrapping ? "Wrapping..." : "Shield"}
 *       </button>
 *       {error && <p>{error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useShield(options: UseShieldOptions): UseShieldReturn {
  const { wrapperAddress, underlyingAddress: providedUnderlying, onSuccess, onError } = options;

  const { address, chainId } = useFhevmContext();
  const { signer, provider, isReady: _isReady } = useEthersSigner();

  const [underlyingAddress, setUnderlyingAddress] = useState<`0x${string}` | undefined>(
    providedUnderlying
  );

  // ZERO_ADDRESS is now imported from constants

  // Sync state when providedUnderlying prop changes
  useEffect(() => {
    if (providedUnderlying) {
      setUnderlyingAddress(providedUnderlying);
    }
  }, [providedUnderlying]);

  // Fetch underlying address from wrapper if not provided
  useEffect(() => {
    // Skip if underlying is provided, provider not ready, or wrapper is zero/empty
    if (providedUnderlying || !provider || !wrapperAddress || wrapperAddress === ZERO_ADDRESS) {
      return;
    }

    let cancelled = false;
    const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, provider);

    wrapper
      .underlying()
      .then((addr: string) => {
        if (!cancelled) setUnderlyingAddress(addr as `0x${string}`);
      })
      .catch((err: unknown) => {
        console.error("[useShield] Failed to fetch underlying address:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [providedUnderlying, provider, wrapperAddress]);

  // Fetch allowance using useQuery (not a mutation, but a read operation)
  const allowanceQuery = useQuery({
    queryKey: ["allowance", wrapperAddress, underlyingAddress, address],
    queryFn: async (): Promise<bigint> => {
      if (!provider || !underlyingAddress || !address) {
        throw new Error("Provider, underlying address, or account not available");
      }
      const erc20 = new ethers.Contract(underlyingAddress, ERC20_ABI, provider);
      const allowanceValue = await erc20.allowance(address, wrapperAddress);
      return BigInt(allowanceValue);
    },
    enabled: !!provider && !!underlyingAddress && !!address,
    staleTime: FHEVM_QUERY_DEFAULTS.ALLOWANCE_STALE_TIME,
  });

  // TanStack Query mutation for the shield operation
  const mutation = useMutation<ShieldResult, Error, ShieldParams>({
    mutationKey: chainId
      ? fhevmKeys.shieldFor(chainId, wrapperAddress)
      : ["fhevm", "shield", "disabled"],

    mutationFn: async ({ amount, to }: ShieldParams): Promise<ShieldResult> => {
      if (!signer || !underlyingAddress || !address) {
        throw new Error("Not ready. Please connect your wallet and wait for initialization.");
      }

      const recipient = to ?? address;

      // Step 1: Check allowance
      const erc20 = new ethers.Contract(underlyingAddress, ERC20_ABI, signer);
      const currentAllowance = BigInt(await erc20.allowance(address, wrapperAddress));

      // Step 2: Approve if needed
      if (currentAllowance < amount) {
        const approveTx = await erc20.approve(wrapperAddress, amount);
        await approveTx.wait();
        // Refetch allowance query
        await allowanceQuery.refetch();
      }

      // Step 3: Wrap
      const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, signer);
      const tx = await wrapper.wrap(recipient, amount);

      // Step 4: Confirm
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }

      return {
        txHash: tx.hash,
        status: "success",
      };
    },

    onSuccess: (data) => {
      // Refetch allowance after successful shield
      allowanceQuery.refetch();
      onSuccess?.(data.txHash);
    },

    onError: (err) => {
      // Normalize error to user-friendly message
      const normalizedError = normalizeTransactionError(err);
      onError?.(normalizedError);
    },
  });

  // Convenience wrapper for the mutation (using utility)
  const shield = useMutationWrapper(mutation);

  // Derive status from mutation state (using utility)
  const status = useMutationStatus(mutation, {
    pending: "wrapping",
    success: "success",
    error: "error",
    idle: "idle",
  });

  const isApproving = mutation.isPending; // Can't distinguish between approving/wrapping
  const isWrapping = mutation.isPending;
  const isPending = mutation.isPending;
  const isSuccess = mutation.isSuccess;
  const isError = mutation.isError;

  // Wrap refetch to match expected signature
  const refetchAllowance = useCallback(async (): Promise<void> => {
    await allowanceQuery.refetch();
  }, [allowanceQuery]);

  return {
    shield,
    status,
    isPending,
    isApproving,
    isWrapping,
    isSuccess,
    isError,
    error: mutation.error ?? null,
    txHash: mutation.data?.txHash,
    reset: mutation.reset,
    allowance: allowanceQuery.data,
    refetchAllowance,
  };
}
