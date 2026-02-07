"use client";

import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { ERC7984_ABI } from "../abi/index";
import { encodeFunctionCall, SELECTORS } from "../internal/abi";
import type {
  TransferStatus,
  UseConfidentialTransferOptions,
  UseConfidentialTransferReturn,
} from "../types/transfer";
import { useFhevmContext } from "./context";
import { fhevmKeys } from "./queryKeys";
import { useEncrypt } from "./useEncrypt";
import { useEthersSigner } from "./useEthersSigner";
import { useWalletOrSigner } from "./useWalletOrSigner";
import { normalizeTransactionError } from "./utils/errorHandling";
import { useMutationWrapper } from "./utils/useMutationWrapper";

// Re-export types for convenience
export type { TransferStatus, UseConfidentialTransferOptions, UseConfidentialTransferReturn };

/**
 * Parameters for the transfer mutation function.
 */
interface TransferParams {
  to: `0x${string}`;
  amount: bigint;
}

/**
 * Result data from a successful transfer.
 */
interface TransferResult {
  txHash: string;
  status: TransferStatus;
}

/**
 * Hook for executing confidential ERC7984 token transfers.
 *
 * Now powered by TanStack Query's `useMutation` for automatic state management,
 * request deduplication, and devtools integration.
 *
 * Encapsulates the full flow of:
 * 1. Encrypting the transfer amount
 * 2. Signing and submitting the transaction
 * 3. Waiting for confirmation
 *
 * @example
 * ```tsx
 * function TransferForm({ tokenAddress }) {
 *   const [to, setTo] = useState("");
 *   const [amount, setAmount] = useState("");
 *
 *   const {
 *     transfer,
 *     status,
 *     isEncrypting,
 *     isPending,
 *     error
 *   } = useConfidentialTransfer({
 *     contractAddress: tokenAddress,
 *     onSuccess: (hash) => {
 *       console.log("Transfer successful:", hash);
 *     },
 *   });
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     await transfer(to as `0x${string}`, BigInt(amount));
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient" />
 *       <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
 *       <button disabled={isPending}>
 *         {isEncrypting ? "Encrypting..." : isPending ? "Transferring..." : "Transfer"}
 *       </button>
 *       {error && <p>{error.message}</p>}
 *     </form>
 *   );
 * }
 * ```
 */
export function useConfidentialTransfer(
  options: UseConfidentialTransferOptions
): UseConfidentialTransferReturn {
  const {
    contractAddress,
    abi = ERC7984_ABI,
    // Use full signature to avoid ethers overload ambiguity.
    functionName = "confidentialTransfer(address,bytes32,bytes)",
    onSuccess,
    onError,
  } = options;

  const { status: fhevmStatus, chainId } = useFhevmContext();
  const { encrypt, isReady: encryptReady } = useEncrypt();
  const { signer, isReady: signerReady } = useEthersSigner();
  const walletActions = useWalletOrSigner();

  // Check if the function signature is a known selector we can encode
  const canUseWalletPath = functionName in SELECTORS;

  // TanStack Query mutation for the transfer operation
  const mutation = useMutation<TransferResult, Error, TransferParams>({
    mutationKey: chainId
      ? fhevmKeys.transferFor(chainId, contractAddress)
      : ["fhevm", "transfer", "disabled"],

    mutationFn: async ({ to, amount }: TransferParams): Promise<TransferResult> => {
      // Validate readiness
      if (fhevmStatus !== "ready" || !encryptReady) {
        throw new Error("FHEVM not ready. Please wait for initialization.");
      }

      if (!walletActions.isReady && (!signerReady || !signer)) {
        throw new Error("Wallet not connected. Please connect your wallet.");
      }

      // Step 1: Encrypt the amount
      const encryptResult = await encrypt([{ type: "uint64", value: amount }], contractAddress);

      if (!encryptResult) {
        throw new Error("Encryption failed - no result returned");
      }

      const amountHandle = encryptResult[0]!;
      const proof = encryptResult[encryptResult.length - 1]!;

      // ── Wallet path (only for known selectors) ──
      if (walletActions.isReady && canUseWalletPath) {
        const data = encodeFunctionCall(
          functionName as keyof typeof SELECTORS,
          [to, amountHandle, proof]
        );
        const txHash = await walletActions.sendTransaction({ to: contractAddress, data });

        const receipt = await walletActions.waitForReceipt(txHash);

        if (receipt.status === 0) {
          throw new Error("Transaction reverted");
        }

        return { txHash, status: "success" };
      }

      // ── Legacy ethers path (custom ABIs / function names) ──
      if (!signer) {
        throw new Error("Wallet not connected. Please connect your wallet.");
      }

      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract[functionName]!(to, amountHandle, proof);

      // Step 3: Wait for confirmation
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction reverted");
      }

      // Return result
      return {
        txHash: tx.hash,
        status: "success",
      };
    },

    onSuccess: (data) => {
      onSuccess?.(data.txHash);
    },

    onError: (err) => {
      // Normalize error to user-friendly message
      const normalizedError = normalizeTransactionError(err);
      onError?.(normalizedError);
    },
  });

  // Convenience wrapper for the mutation (using utility)
  const mutationWrapper = useMutationWrapper(mutation);

  // Create transfer function with expected signature (to, amount) -> Promise<void>
  const transfer = useCallback(
    async (to: `0x${string}`, amount: bigint): Promise<void> => {
      return mutationWrapper({ to, amount });
    },
    [mutationWrapper]
  );

  // Derive detailed status from mutation state
  const status = useMemo<TransferStatus>(() => {
    if (mutation.isPending) return "signing"; // Generic pending state
    if (mutation.isSuccess) return "success";
    if (mutation.isError) return "error";
    return "idle";
  }, [mutation.isPending, mutation.isSuccess, mutation.isError]);

  const isEncrypting = mutation.isPending;
  const isSigning = mutation.isPending;
  const isConfirming = mutation.isPending;
  const isSuccess = mutation.isSuccess;
  const isError = mutation.isError;
  const isPending = mutation.isPending;

  return {
    transfer,
    status,
    isEncrypting,
    isSigning,
    isConfirming,
    isSuccess,
    isError,
    isPending,
    error: mutation.error ?? null,
    txHash: mutation.data?.txHash,
    reset: mutation.reset,
  };
}
