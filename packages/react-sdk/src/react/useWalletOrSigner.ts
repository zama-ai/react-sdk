"use client";

import { useMemo } from "react";
import { encodeFunctionCall, decodeFunctionResult, type SELECTORS } from "../internal/abi";
import { ethCall, waitForReceipt, type TransactionReceipt } from "../internal/rpc";
import { useFhevmContext } from "./context";
import { useEthersSigner } from "./useEthersSigner";

type AbiValue = `0x${string}` | bigint | number | boolean | Uint8Array;

/**
 * Unified wallet actions interface.
 * Abstracts over FhevmWallet (direct) and ethers.js signer (legacy) paths.
 */
export interface WalletActions {
  /** Send a transaction and return the tx hash */
  sendTransaction(tx: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}`>;

  /** Wait for a transaction receipt */
  waitForReceipt(txHash: `0x${string}`): Promise<TransactionReceipt>;

  /** Execute a read-only contract call */
  call(to: `0x${string}`, data: `0x${string}`): Promise<`0x${string}`>;

  /** The wallet address */
  address: `0x${string}`;

  /** Whether the wallet actions are ready to use */
  isReady: boolean;
}

/**
 * Convenience: encode + send a contract write call via wallet actions.
 */
export async function sendContractWrite(
  actions: WalletActions,
  to: `0x${string}`,
  signature: keyof typeof SELECTORS,
  args: AbiValue[]
): Promise<{ txHash: `0x${string}`; receipt: TransactionReceipt }> {
  const data = encodeFunctionCall(signature, args);
  const txHash = await actions.sendTransaction({ to, data });
  const receipt = await actions.waitForReceipt(txHash);
  return { txHash, receipt };
}

/**
 * Convenience: encode + call a contract read via wallet actions.
 */
export async function sendContractRead(
  actions: WalletActions,
  to: `0x${string}`,
  signature: keyof typeof SELECTORS,
  args: AbiValue[],
  returnType: string
): Promise<AbiValue> {
  const data = encodeFunctionCall(signature, args);
  const result = await actions.call(to, data);
  return decodeFunctionResult(returnType, result);
}

/**
 * Bridge hook that returns a unified WalletActions interface.
 *
 * - If `wallet` is available in context → uses wallet directly + RPC for reads/receipts
 * - Otherwise → falls back to useEthersSigner (ethers.js path)
 *
 * This allows hooks to be migrated incrementally without duplicating logic.
 */
export function useWalletOrSigner(): WalletActions {
  const { wallet, rpcUrl, address: contextAddress } = useFhevmContext();
  const { signer, provider: ethersProvider, isReady: signerReady } = useEthersSigner();

  return useMemo<WalletActions>(() => {
    // Path 1: FhevmWallet is available — preferred path
    if (wallet && rpcUrl) {
      return {
        address: wallet.address,
        isReady: true,

        sendTransaction: (tx) => wallet.sendTransaction(tx),

        waitForReceipt: (txHash) => waitForReceipt(rpcUrl, txHash),

        call: (to, data) => ethCall(rpcUrl, to, data),
      };
    }

    // Path 2: FhevmWallet without rpcUrl — can send but needs provider for reads
    if (wallet && ethersProvider) {
      return {
        address: wallet.address,
        isReady: true,

        sendTransaction: (tx) => wallet.sendTransaction(tx),

        waitForReceipt: async (txHash) => {
          const receipt = await ethersProvider.waitForTransaction(txHash);
          if (!receipt) throw new Error(`Receipt not found for ${txHash}`);
          return {
            status: receipt.status ?? 0,
            transactionHash: receipt.hash,
            logs: receipt.logs.map((l) => ({
              address: l.address,
              topics: [...l.topics],
              data: l.data,
            })),
          };
        },

        call: async (to, data) => {
          const result = await ethersProvider.call({ to, data });
          return result as `0x${string}`;
        },
      };
    }

    // Path 3: Legacy ethers.js signer path
    if (signer && signerReady && ethersProvider) {
      const address = (contextAddress ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;
      return {
        address,
        isReady: true,

        sendTransaction: async (tx) => {
          const response = await signer.sendTransaction(tx);
          return response.hash as `0x${string}`;
        },

        waitForReceipt: async (txHash) => {
          const receipt = await ethersProvider.waitForTransaction(txHash);
          if (!receipt) throw new Error(`Receipt not found for ${txHash}`);
          return {
            status: receipt.status ?? 0,
            transactionHash: receipt.hash,
            logs: receipt.logs.map((l) => ({
              address: l.address,
              topics: [...l.topics],
              data: l.data,
            })),
          };
        },

        call: async (to, data) => {
          const result = await ethersProvider.call({ to, data });
          return result as `0x${string}`;
        },
      };
    }

    // Not ready
    const notReadyAddress = (contextAddress ?? "0x0000000000000000000000000000000000000000") as `0x${string}`;
    return {
      address: notReadyAddress,
      isReady: false,
      sendTransaction: () => {
        throw new Error("Wallet not ready. Provide a wallet or provider to FhevmProvider.");
      },
      waitForReceipt: () => {
        throw new Error("Wallet not ready. Provide a wallet or provider to FhevmProvider.");
      },
      call: () => {
        throw new Error("Wallet not ready. Provide a wallet or provider to FhevmProvider.");
      },
    };
  }, [wallet, rpcUrl, signer, signerReady, ethersProvider, contextAddress]);
}
