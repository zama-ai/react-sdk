"use client";

import { useMutation } from "@tanstack/react-query";
import type { RelayerEncryptedInput } from "@zama-fhe/relayer-sdk/web";
import type {
  EncryptInput,
  EncryptResult,
  EncryptedOutput,
  FheTypeName,
} from "@zama-fhe/shared/types";
import { useCallback, useMemo } from "react";
import { useFhevmContext } from "./context";
import { fhevmKeys } from "./queryKeys";

// Re-export types for convenience
export type { EncryptInput, EncryptResult, EncryptedOutput, FheTypeName };

/**
 * Return type for useEncrypt hook.
 */
export interface UseEncryptReturn {
  /**
   * Whether encryption is ready.
   * False if FHEVM is not initialized or wallet not connected.
   */
  isReady: boolean;

  /**
   * Encrypt values for FHE contract calls.
   *
   * Returns a tuple of `[...handles, proof]` for easy destructuring.
   *
   * @param inputs - Array of typed values to encrypt
   * @param contractAddress - Target contract address
   * @returns Tuple of handles followed by proof, or undefined if not ready
   *
   * @example
   * ```ts
   * // Single value
   * const [amountHandle, proof] = await encrypt([
   *   { type: 'uint64', value: 100n },
   * ], contractAddress);
   *
   * // Multiple values
   * const [amountHandle, recipientHandle, proof] = await encrypt([
   *   { type: 'uint64', value: 100n },
   *   { type: 'address', value: '0x...' },
   * ], contractAddress);
   *
   * // Use in contract call
   * writeContract({
   *   args: [amountHandle, recipientHandle, proof],
   * });
   * ```
   */
  encrypt: <T extends readonly EncryptInput[]>(
    inputs: T,
    contractAddress: `0x${string}`
  ) => Promise<EncryptResult<T> | undefined>;
}

/**
 * Add a value to the encryption builder based on its type.
 * Uses type-safe dispatch based on the discriminated union.
 * @internal
 */
function addToBuilder(builder: RelayerEncryptedInput, input: EncryptInput): void {
  // Use discriminated union narrowing for type safety
  switch (input.type) {
    case "bool":
      builder.addBool(input.value);
      break;
    case "uint8":
      // uint8/16/32 accept number, convert to bigint for builder
      builder.add8(BigInt(input.value));
      break;
    case "uint16":
      builder.add16(BigInt(input.value));
      break;
    case "uint32":
      builder.add32(BigInt(input.value));
      break;
    case "uint64":
      builder.add64(input.value);
      break;
    case "uint128":
      builder.add128(input.value);
      break;
    case "uint256":
      builder.add256(input.value);
      break;
    case "address":
      builder.addAddress(input.value);
      break;
    default: {
      // Exhaustive check - TypeScript will error if a case is missed
      const _exhaustive: never = input;
      throw new Error(`Unknown encryption type: ${(_exhaustive as EncryptInput).type}`);
    }
  }
}

/**
 * Parameters for the encryption mutation.
 * @internal
 */
interface EncryptParams {
  inputs: readonly EncryptInput[];
  contractAddress: `0x${string}`;
}

/**
 * Hook for encrypting values for FHE contract calls.
 *
 * Provides type-safe encryption with compile-time checking of value types.
 * Returns a tuple for easy destructuring into handles and proof.
 *
 * Now uses TanStack Query's useMutation internally for DevTools visibility
 * and tracking, while maintaining the same external API.
 *
 * @example
 * ```tsx
 * function TransferForm({ contractAddress }) {
 *   const { encrypt, isReady } = useEncrypt();
 *
 *   const handleTransfer = async (amount: bigint, recipient: `0x${string}`) => {
 *     if (!isReady) return;
 *
 *     const [amountHandle, recipientHandle, proof] = await encrypt([
 *       { type: 'uint64', value: amount },
 *       { type: 'address', value: recipient },
 *     ], contractAddress);
 *
 *     if (!amountHandle) return;
 *
 *     writeContract({
 *       address: contractAddress,
 *       abi: tokenAbi,
 *       functionName: 'transfer',
 *       args: [amountHandle, recipientHandle, proof],
 *     });
 *   };
 *
 *   return (
 *     <button onClick={() => handleTransfer(100n, '0x...')} disabled={!isReady}>
 *       Transfer
 *     </button>
 *   );
 * }
 * ```
 */
export function useEncrypt(): UseEncryptReturn {
  const { instance, status, address, chainId } = useFhevmContext();

  const isReady = useMemo(
    () => status === "ready" && instance !== undefined && address !== undefined,
    [status, instance, address]
  );

  // TanStack Query mutation for encryption (for DevTools visibility)
  const mutation = useMutation<EncryptedOutput, Error, EncryptParams>({
    mutationKey: chainId
      ? fhevmKeys.encrypt()
      : ["fhevm", "encrypt", "disabled"],

    mutationFn: async ({ inputs, contractAddress }: EncryptParams): Promise<EncryptedOutput> => {
      if (!instance || !address) {
        throw new Error("FHEVM instance or address not available");
      }

      const builder = instance.createEncryptedInput(
        contractAddress,
        address
      ) as RelayerEncryptedInput;

      // Add each input to the builder
      for (const input of inputs) {
        addToBuilder(builder, input);
      }

      // Encrypt and get result
      const result: EncryptedOutput = await builder.encrypt();

      // Validate that encryption returned expected number of handles
      if (result.handles.length !== inputs.length) {
        throw new Error(
          `Encryption mismatch: expected ${inputs.length} handles but got ${result.handles.length}. ` +
            `This indicates a bug in the encryption process.`
        );
      }

      return result;
    },
  });

  // Wrapper that maintains the original API signature
  const encrypt = useCallback(
    async <T extends readonly EncryptInput[]>(
      inputs: T,
      contractAddress: `0x${string}`
    ): Promise<EncryptResult<T> | undefined> => {
      if (!instance || !address) return undefined;

      // Trigger mutation and wait for result
      const result = await mutation.mutateAsync({ inputs, contractAddress });

      // Return as tuple: [...handles, proof]
      return [...result.handles, result.inputProof] as unknown as EncryptResult<T>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [instance, address, mutation.mutateAsync]
  );

  return {
    isReady,
    encrypt,
  };
}
