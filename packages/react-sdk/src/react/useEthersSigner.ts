"use client";

import { ethers } from "ethers";
import { useEffect, useState, useMemo } from "react";
import { logger } from "../internal/logger";
import { normalizeProviderForEthers } from "../internal/normalizeProvider";
import { useFhevmContext } from "./context";

/**
 * Return type for useEthersSigner hook.
 */
export interface UseEthersSignerReturn {
  /** The ethers signer, or undefined if not available */
  signer: ethers.JsonRpcSigner | undefined;

  /** The ethers provider, or undefined if not available */
  provider: ethers.BrowserProvider | undefined;

  /** Whether the signer is currently being loaded */
  isLoading: boolean;

  /** Error if signer creation failed */
  error: Error | undefined;

  /** Whether the signer is ready to use */
  isReady: boolean;
}

/**
 * Hook to get an ethers signer from the FhevmProvider context provider.
 *
 * Uses the EIP-1193 provider from FhevmContext (falling back to window.ethereum)
 * and the connected wallet address to create an ethers JsonRpcSigner.
 *
 * @example
 * ```tsx
 * function SignMessage() {
 *   const { signer, isReady, isLoading, error } = useEthersSigner()
 *
 *   const handleSign = async () => {
 *     if (!signer) return
 *     const signature = await signer.signMessage('Hello!')
 *     console.log(signature)
 *   }
 *
 *   if (isLoading) return <p>Loading signer...</p>
 *   if (error) return <p>Error: {error.message}</p>
 *   if (!isReady) return <p>Connect your wallet</p>
 *
 *   return <button onClick={handleSign}>Sign Message</button>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Use with ethers contracts
 * function ContractInteraction() {
 *   const { signer, isReady } = useEthersSigner()
 *
 *   const sendTransaction = async () => {
 *     if (!signer) return
 *
 *     const contract = new ethers.Contract(address, abi, signer)
 *     await contract.someFunction()
 *   }
 * }
 * ```
 */
export function useEthersSigner(): UseEthersSignerReturn {
  const { address, isConnected, chainId, provider: contextProvider } = useFhevmContext();

  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    async function initSigner() {
      // Reset state if not connected or no address
      if (!isConnected || !address) {
        setSigner(undefined);
        setProvider(undefined);
        setError(undefined);
        return;
      }

      // Use provider from context first, then fallback to window.ethereum
      const eip1193Provider = contextProvider
        ?? (typeof window !== "undefined" ? (window as any).ethereum : undefined);

      if (!eip1193Provider) {
        setError(new Error(
          "No EIP-1193 provider found. Pass a provider to FhevmProvider or ensure window.ethereum is available."
        ));
        setSigner(undefined);
        setProvider(undefined);
        return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
        const normalizedProvider = normalizeProviderForEthers(eip1193Provider);
        const browserProvider = new ethers.BrowserProvider(normalizedProvider);
        const jsonRpcSigner = await browserProvider.getSigner(address);

        setProvider(browserProvider);
        setSigner(jsonRpcSigner);
      } catch (err) {
        logger.error("[useEthersSigner]", "Failed to create signer:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setSigner(undefined);
        setProvider(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    initSigner();
  }, [address, isConnected, chainId, contextProvider]); // Re-create signer when chain or provider changes

  const isReady = useMemo(
    () => isConnected && signer !== undefined && !isLoading && !error,
    [isConnected, signer, isLoading, error]
  );

  return {
    signer,
    provider,
    isLoading,
    error,
    isReady,
  };
}
