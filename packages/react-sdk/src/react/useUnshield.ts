"use client";

import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { ERC20TOERC7984_ABI } from "../abi/index";
import { encodeFunctionCall, UNWRAP_REQUESTED_TOPIC } from "../internal/abi";
import { logger } from "../internal/logger";
import type { UnshieldStatus, UseUnshieldOptions, UseUnshieldReturn } from "../types/shield";
import { useFhevmContext } from "./context";
import { fhevmKeys } from "./queryKeys";
import { useEncrypt } from "./useEncrypt";
import { useEthersSigner } from "./useEthersSigner";
import { useWalletOrSigner } from "./useWalletOrSigner";
import { normalizeTransactionError } from "./utils/errorHandling";
import { useMutationWrapper } from "./utils/useMutationWrapper";

// Re-export types for convenience
export type { UnshieldStatus, UseUnshieldOptions, UseUnshieldReturn };

// Legacy: ethers event topic (kept for ethers fallback path)
const LEGACY_UNWRAP_REQUESTED_TOPIC = ethers.id("UnwrapRequested(address,bytes32)");

/**
 * Parameters for the unshield mutation function.
 */
interface UnshieldParams {
  amount: bigint;
  to?: `0x${string}`;
}

/**
 * Result data from a successful unshield operation.
 */
interface UnshieldResult {
  txHash: string;
  finalizeTxHash: string;
  status: UnshieldStatus;
}

/**
 * Hook for unshielding confidential ERC7984 tokens back to ERC20.
 *
 * Now powered by TanStack Query's `useMutation` for automatic state management.
 *
 * Handles the complete flow:
 * 1. Encrypt the amount using FHE
 * 2. Call unwrap(from, to, encryptedAmount, inputProof) - burns confidential tokens
 * 3. Wait for transaction confirmation
 * 4. Request public decryption of the burnt amount
 * 5. Call finalizeUnwrap() with the decryption proof - releases ERC20 tokens
 *
 * @example
 * ```tsx
 * function UnshieldForm({ wrapperAddress }) {
 *   const [amount, setAmount] = useState("");
 *
 *   const {
 *     unshield,
 *     status,
 *     isEncrypting,
 *     isSigning,
 *     isDecrypting,
 *     isFinalizing,
 *     isPending,
 *     error,
 *   } = useUnshield({
 *     wrapperAddress,
 *     onSuccess: (hash) => console.log("Unshield complete!", hash),
 *   });
 *
 *   const handleSubmit = async () => {
 *     await unshield(BigInt(amount));
 *   };
 *
 *   return (
 *     <div>
 *       <input value={amount} onChange={e => setAmount(e.target.value)} />
 *       <button onClick={handleSubmit} disabled={isPending}>
 *         {isEncrypting ? "Encrypting..." :
 *          isSigning ? "Sign in wallet..." :
 *          isDecrypting ? "Getting proof..." :
 *          isFinalizing ? "Finalizing..." :
 *          "Unshield"}
 *       </button>
 *       {error && <p>{error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useUnshield(options: UseUnshieldOptions): UseUnshieldReturn {
  const { wrapperAddress, onSuccess, onError } = options;

  const { status: fhevmStatus, address, instance, chainId } = useFhevmContext();
  const { encrypt, isReady: encryptReady } = useEncrypt();
  const { signer, isReady: signerReady } = useEthersSigner();
  const walletActions = useWalletOrSigner();

  // TanStack Query mutation for the unshield operation
  const mutation = useMutation<UnshieldResult, Error, UnshieldParams>({
    mutationKey: chainId
      ? fhevmKeys.unshieldFor(chainId, wrapperAddress)
      : ["fhevm", "unshield", "disabled"],

    mutationFn: async ({ amount, to }: UnshieldParams): Promise<UnshieldResult> => {
      if (fhevmStatus !== "ready" || !encryptReady || !instance) {
        throw new Error("FHEVM not ready. Please wait for initialization.");
      }

      if (!walletActions.isReady && (!signerReady || !signer)) {
        throw new Error("Wallet not connected. Please connect your wallet.");
      }

      if (!address) {
        throw new Error("Wallet not connected. Please connect your wallet.");
      }

      const recipient = to ?? address;

      // Step 1: Encrypt the amount
      const encryptResult = await encrypt([{ type: "uint64", value: amount }], wrapperAddress);

      if (!encryptResult) {
        throw new Error("Encryption failed - no result returned");
      }

      const amountHandle = encryptResult[0]!;
      const proof = encryptResult[encryptResult.length - 1]!;

      let txHash: `0x${string}`;
      let finalizeTxHash: `0x${string}`;

      // ── Wallet path ──
      if (walletActions.isReady) {
        // Step 2: Sign and submit unwrap transaction
        const unwrapData = encodeFunctionCall("unwrap(address,address,bytes32,bytes)", [
          address,
          recipient,
          amountHandle,
          proof,
        ]);
        txHash = await walletActions.sendTransaction({ to: wrapperAddress, data: unwrapData });

        // Step 3: Wait for confirmation and get the burnt amount from event
        const receipt = await walletActions.waitForReceipt(txHash);

        if (receipt.status === 0) {
          throw new Error("Unwrap transaction reverted");
        }

        // Parse UnwrapRequested event
        const unwrapEvent = receipt.logs.find(
          (log) =>
            log.address.toLowerCase() === wrapperAddress.toLowerCase() &&
            log.topics[0] === UNWRAP_REQUESTED_TOPIC
        );

        if (!unwrapEvent) {
          throw new Error("UnwrapRequested event not found in transaction");
        }

        const burntAmountHandle = unwrapEvent.data as `0x${string}`;

        logger.debug("[useUnshield] Unwrap confirmed, burntAmount handle:", burntAmountHandle);

        // Step 4: Request public decryption
        const decryptResult = await instance.publicDecrypt([burntAmountHandle]);

        if (!decryptResult || !decryptResult.clearValues) {
          throw new Error("Public decryption failed - no result returned");
        }

        const cleartextAmount = decryptResult.clearValues[burntAmountHandle];
        if (cleartextAmount === undefined) {
          throw new Error("Decrypted value not found for burnt amount handle");
        }

        logger.debug("[useUnshield] Decrypted amount:", cleartextAmount.toString());

        // Step 5: Finalize the unwrap
        const finalizeData = encodeFunctionCall("finalizeUnwrap(bytes32,uint64,bytes)", [
          burntAmountHandle,
          BigInt(cleartextAmount.toString()),
          decryptResult.decryptionProof,
        ]);
        finalizeTxHash = await walletActions.sendTransaction({ to: wrapperAddress, data: finalizeData });

        const finalizeReceipt = await walletActions.waitForReceipt(finalizeTxHash);

        if (finalizeReceipt.status === 0) {
          throw new Error("Finalize transaction reverted");
        }

        return { txHash, finalizeTxHash, status: "success" };
      }

      // ── Legacy ethers path ──
      // Step 2: Sign and submit unwrap transaction
      const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, signer);

      const tx = await wrapper["unwrap(address,address,bytes32,bytes)"]!(
        address,
        recipient,
        amountHandle,
        proof
      );

      // Step 3: Wait for confirmation and get the burnt amount from event
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Unwrap transaction reverted");
      }

      // Parse UnwrapRequested event to get the burntAmount handle
      const unwrapEvent = receipt.logs.find(
        (log: ethers.Log) =>
          log.address.toLowerCase() === wrapperAddress.toLowerCase() &&
          log.topics[0] === LEGACY_UNWRAP_REQUESTED_TOPIC
      );

      if (!unwrapEvent) {
        throw new Error("UnwrapRequested event not found in transaction");
      }

      const burntAmountHandle = unwrapEvent.data as `0x${string}`;

      logger.debug("[useUnshield] Unwrap confirmed, burntAmount handle:", burntAmountHandle);

      // Step 4: Request public decryption
      const decryptResult = await instance.publicDecrypt([burntAmountHandle]);

      if (!decryptResult || !decryptResult.clearValues) {
        throw new Error("Public decryption failed - no result returned");
      }

      const cleartextAmount = decryptResult.clearValues[burntAmountHandle];
      if (cleartextAmount === undefined) {
        throw new Error("Decrypted value not found for burnt amount handle");
      }

      logger.debug("[useUnshield] Decrypted amount:", cleartextAmount.toString());

      // Step 5: Finalize the unwrap
      const finalizeTx = await wrapper.finalizeUnwrap!(
        burntAmountHandle,
        BigInt(cleartextAmount.toString()),
        decryptResult.decryptionProof
      );

      const finalizeReceipt = await finalizeTx.wait();

      if (finalizeReceipt.status === 0) {
        throw new Error("Finalize transaction reverted");
      }

      // Success - ERC20 tokens have been released
      return {
        txHash: tx.hash,
        finalizeTxHash: finalizeTx.hash,
        status: "success",
      };
    },

    onSuccess: (data) => {
      onSuccess?.(data.finalizeTxHash);
    },

    onError: (err) => {
      // Normalize error to user-friendly message
      const normalizedError = normalizeTransactionError(err);
      onError?.(normalizedError);
    },
  });

  // Convenience wrapper for the mutation (using utility)
  const mutationWrapper = useMutationWrapper(mutation);

  // Create unshield function with expected signature (amount, to?) -> Promise<void>
  const unshield = useCallback(
    async (amount: bigint, to?: `0x${string}`): Promise<void> => {
      return mutationWrapper({ amount, to });
    },
    [mutationWrapper]
  );

  // Derive status from mutation state
  const status = useMemo<UnshieldStatus>(() => {
    if (mutation.isPending) return "signing"; // Generic pending state
    if (mutation.isSuccess) return "success";
    if (mutation.isError) return "error";
    return "idle";
  }, [mutation.isPending, mutation.isSuccess, mutation.isError]);

  const isEncrypting = mutation.isPending;
  const isSigning = mutation.isPending;
  const isDecrypting = mutation.isPending;
  const isFinalizing = mutation.isPending;
  const isPending = mutation.isPending;
  const isSuccess = mutation.isSuccess;
  const isError = mutation.isError;

  return {
    unshield,
    status,
    isPending,
    isEncrypting,
    isSigning,
    isDecrypting,
    isFinalizing,
    isSuccess,
    isError,
    error: mutation.error ?? null,
    txHash: mutation.data?.txHash,
    finalizeTxHash: mutation.data?.finalizeTxHash,
    reset: mutation.reset,
  };
}
