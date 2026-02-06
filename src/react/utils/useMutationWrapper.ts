import type { UseMutationResult } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Wraps useMutation's mutate function to return a Promise.
 * Maintains backward compatibility with async/await patterns.
 *
 * This utility eliminates the need to manually wrap mutation.mutate
 * in a Promise constructor in every hook that uses mutations.
 *
 * @example
 * ```typescript
 * const mutation = useMutation<Result, Error, Params>({ ... });
 * const execute = useMutationWrapper(mutation);
 * await execute(params); // Returns Promise<void>
 * ```
 *
 * @param mutation - The mutation result from useMutation
 * @returns A function that executes the mutation and returns a Promise
 */
export function useMutationWrapper<TData, TError, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables, unknown>
) {
  return useCallback(
    async (variables: TVariables): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        mutation.mutate(variables, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error as TError),
        });
      });
    },
    [mutation]
  );
}
