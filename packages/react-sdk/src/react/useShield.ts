"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useCallback, useEffect, useRef, useState } from "react";
import { ERC20TOERC7984_ABI, ERC20_ABI } from "../abi/index";
import { encodeFunctionCall, decodeFunctionResult } from "../internal/abi";
import { ethCall } from "../internal/rpc";
import type { ShieldStatus, UseShieldOptions, UseShieldReturn } from "../types/shield";
import { useFhevmContext } from "./context";
import { FHEVM_QUERY_DEFAULTS, ZERO_ADDRESS } from "./core/constants";
import { fhevmKeys } from "./queryKeys";
import { useEthersSigner } from "./useEthersSigner";
import { useWalletOrSigner } from "./useWalletOrSigner";
import { normalizeTransactionError } from "./utils/errorHandling";
import { useMutationStatus } from "./utils/useMutationStatus";
import { useMutationWrapper } from "./utils/useMutationWrapper";

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

  const { address, chainId, wallet, rpcUrl } = useFhevmContext();
  const { signer, provider, isReady: _isReady } = useEthersSigner();
  const walletActions = useWalletOrSigner();

  const [underlyingAddress, setUnderlyingAddress] = useState<`0x${string}` | undefined>(
    providedUnderlying
  );
  const [internalPhase, setInternalPhase] = useState<"idle" | "approving" | "wrapping">("idle");
  const phaseRef = useRef<"idle" | "approving" | "wrapping">("idle");

  // Sync state when providedUnderlying prop changes
  useEffect(() => {
    if (providedUnderlying) {
      setUnderlyingAddress(providedUnderlying);
    }
  }, [providedUnderlying]);

  // Fetch underlying address from wrapper if not provided
  // Note: walletActions is not in deps to avoid extra renders; we capture it via ref-like closure
  useEffect(() => {
    // Skip if underlying is provided, not ready, or wrapper is zero/empty
    if (providedUnderlying || !wrapperAddress || wrapperAddress === ZERO_ADDRESS) {
      return;
    }

    // Wallet path: use RPC call directly when wallet + rpcUrl available
    if (wallet && rpcUrl) {
      let cancelled = false;
      const data = encodeFunctionCall("underlying()", []);
      ethCall(rpcUrl, wrapperAddress, data)
        .then((result) => {
          if (!cancelled) {
            const addr = decodeFunctionResult("address", result) as `0x${string}`;
            setUnderlyingAddress(addr);
          }
        })
        .catch((err: unknown) => {
          console.error("[useShield] Failed to fetch underlying address:", err);
        });
      return () => { cancelled = true; };
    }

    // Legacy path: use ethers provider
    if (!provider) return;

    let cancelled = false;
    const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, provider);

    wrapper
      .underlying!()
      .then((addr: string) => {
        if (!cancelled) setUnderlyingAddress(addr as `0x${string}`);
      })
      .catch((err: unknown) => {
        console.error("[useShield] Failed to fetch underlying address:", err);
      });

    return () => {
      cancelled = true;
    };
  }, [providedUnderlying, provider, wrapperAddress, wallet, rpcUrl]);

  // Fetch allowance using useQuery (not a mutation, but a read operation)
  const allowanceQuery = useQuery({
    queryKey: ["allowance", wrapperAddress, underlyingAddress, address],
    queryFn: async (): Promise<bigint> => {
      if (!underlyingAddress || !address) {
        throw new Error("Underlying address or account not available");
      }

      // Wallet path: use ABI encoding + call
      if (walletActions.isReady) {
        const data = encodeFunctionCall("allowance(address,address)", [address, wrapperAddress]);
        const result = await walletActions.call(underlyingAddress, data);
        return decodeFunctionResult("uint256", result) as bigint;
      }

      // Legacy path: ethers
      if (!provider) {
        throw new Error("Provider not available");
      }
      const erc20 = new ethers.Contract(underlyingAddress, ERC20_ABI, provider);
      const allowanceValue = await erc20.allowance!(address, wrapperAddress);
      return BigInt(allowanceValue);
    },
    enabled: (walletActions.isReady || !!provider) && !!underlyingAddress && !!address,
    staleTime: FHEVM_QUERY_DEFAULTS.ALLOWANCE_STALE_TIME,
  });

  // TanStack Query mutation for the shield operation
  const mutation = useMutation<ShieldResult, Error, ShieldParams>({
    mutationKey: chainId
      ? fhevmKeys.shieldFor(chainId, wrapperAddress)
      : ["fhevm", "shield", "disabled"],

    mutationFn: async ({ amount, to }: ShieldParams): Promise<ShieldResult> => {
      if (!underlyingAddress || !address) {
        throw new Error("Not ready. Please connect your wallet and wait for initialization.");
      }

      const recipient = to ?? address;

      // ── Wallet path ──
      if (walletActions.isReady) {
        // Step 1: Check allowance
        const allowanceData = encodeFunctionCall("allowance(address,address)", [address, wrapperAddress]);
        const allowanceResult = await walletActions.call(underlyingAddress, allowanceData);
        const currentAllowance = decodeFunctionResult("uint256", allowanceResult) as bigint;

        // Step 2: Approve if needed
        if (currentAllowance < amount) {
          phaseRef.current = "approving";
          setInternalPhase("approving");
          const approveData = encodeFunctionCall("approve(address,uint256)", [wrapperAddress, amount]);
          const approveTxHash = await walletActions.sendTransaction({ to: underlyingAddress, data: approveData });
          const approveReceipt = await walletActions.waitForReceipt(approveTxHash);
          await allowanceQuery.refetch();

          if (approveReceipt.status === 0) {
            phaseRef.current = "idle";
            setInternalPhase("idle");
            throw new Error("Approval transaction reverted");
          }

          // Verify allowance was updated before proceeding
          const updatedResult = await walletActions.call(underlyingAddress, allowanceData);
          const updatedAllowance = decodeFunctionResult("uint256", updatedResult) as bigint;
          if (updatedAllowance < amount) {
            phaseRef.current = "idle";
            setInternalPhase("idle");
            throw new Error("Approval failed - allowance not updated");
          }
        }

        // Step 3: Wrap
        phaseRef.current = "wrapping";
        setInternalPhase("wrapping");
        const wrapData = encodeFunctionCall("wrap(address,uint256)", [recipient, amount]);
        const txHash = await walletActions.sendTransaction({ to: wrapperAddress, data: wrapData });

        // Step 4: Confirm
        const receipt = await walletActions.waitForReceipt(txHash);

        if (receipt.status === 0) {
          phaseRef.current = "idle";
          setInternalPhase("idle");
          throw new Error("Transaction reverted");
        }

        phaseRef.current = "idle";
        setInternalPhase("idle");
        return { txHash, status: "success" };
      }

      // ── Legacy ethers path ──
      if (!signer) {
        throw new Error("Not ready. Please connect your wallet and wait for initialization.");
      }

      // Step 1: Check allowance
      const erc20 = new ethers.Contract(underlyingAddress, ERC20_ABI, signer);
      const currentAllowance = BigInt(await erc20.allowance!(address, wrapperAddress));

      // Step 2: Approve if needed
      if (currentAllowance < amount) {
        phaseRef.current = "approving";
        setInternalPhase("approving");
        const approveTx = await erc20.approve!(wrapperAddress, amount);
        await approveTx.wait();
        // Refetch allowance query to ensure it's updated
        await allowanceQuery.refetch();

        // Verify allowance was updated before proceeding
        const updatedAllowance = BigInt(await erc20.allowance!(address, wrapperAddress));
        if (updatedAllowance < amount) {
          phaseRef.current = "idle";
          setInternalPhase("idle");
          throw new Error("Approval failed - allowance not updated");
        }
      }

      // Step 3: Wrap
      phaseRef.current = "wrapping";
      setInternalPhase("wrapping");
      const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, signer);
      const tx = await wrapper.wrap!(recipient, amount);

      // Step 4: Confirm
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        phaseRef.current = "idle";
        setInternalPhase("idle");
        throw new Error("Transaction reverted");
      }

      phaseRef.current = "idle";
      setInternalPhase("idle");
      return {
        txHash: tx.hash,
        status: "success",
      };
    },

    onSuccess: (data) => {
      // Reset phase on success
      phaseRef.current = "idle";
      setInternalPhase("idle");
      // Refetch allowance after successful shield
      allowanceQuery.refetch();
      onSuccess?.(data.txHash);
    },

    onError: (err) => {
      // Reset phase on error
      phaseRef.current = "idle";
      setInternalPhase("idle");
      // Normalize error to user-friendly message
      const normalizedError = normalizeTransactionError(err);
      onError?.(normalizedError);
    },
  });

  // Convenience wrapper for the mutation (using utility)
  const mutationWrapper = useMutationWrapper(mutation);

  // Create shield function with expected signature (amount, to?) -> Promise<void>
  const shield = useCallback(
    async (amount: bigint, to?: `0x${string}`): Promise<void> => {
      return mutationWrapper({ amount, to });
    },
    [mutationWrapper]
  );

  // Derive status from mutation state (using utility)
  const status = useMutationStatus(mutation, {
    pending: "wrapping",
    success: "success",
    error: "error",
    idle: "idle",
  });

  const isApproving = mutation.isPending && internalPhase === "approving";
  const isWrapping = mutation.isPending && internalPhase === "wrapping";
  const isPending = mutation.isPending;
  const isSuccess = mutation.isSuccess;
  const isError = mutation.isError;

  // Wrap refetch to match expected signature
  const refetchAllowance = useCallback(async (): Promise<void> => {
    await allowanceQuery.refetch();
  }, [allowanceQuery]);

  // Wrap reset to also reset internal phase
  // Use mutation.reset directly (stable reference from TanStack Query)
  const mutationReset = mutation.reset;
  const reset = useCallback(() => {
    phaseRef.current = "idle";
    setInternalPhase("idle");
    mutationReset();
  }, [mutationReset]);

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
    reset,
    allowance: allowanceQuery.data,
    refetchAllowance,
  };
}
