import { useMemo } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

/**
 * Status map for mapping mutation states to custom status strings.
 */
type MutationStatusMap<T extends string> = {
  /** Status when mutation is pending/loading */
  pending: T;
  /** Status when mutation succeeded */
  success: T;
  /** Status when mutation failed */
  error: T;
  /** Status when mutation is idle (not started) */
  idle: T;
};

/**
 * Derives a custom status string from mutation state.
 *
 * This utility eliminates the need to manually create useMemo
 * for status derivation in every hook that uses mutations.
 *
 * @example
 * ```typescript
 * const mutation = useMutation({ ... });
 * const status = useMutationStatus(mutation, {
 *   pending: "signing",
 *   success: "success",
 *   error: "error",
 *   idle: "idle",
 * });
 * ```
 *
 * @param mutation - The mutation result from useMutation (or an object with the same shape)
 * @param statusMap - Map of mutation states to custom status strings
 * @returns The derived status string
 */
export function useMutationStatus<T extends string>(
  mutation: Pick<UseMutationResult<any, any, any, any>, "isPending" | "isSuccess" | "isError">,
  statusMap: MutationStatusMap<T>
): T {
  return useMemo(() => {
    if (mutation.isPending) return statusMap.pending;
    if (mutation.isSuccess) return statusMap.success;
    if (mutation.isError) return statusMap.error;
    return statusMap.idle;
  }, [mutation.isPending, mutation.isSuccess, mutation.isError, statusMap]);
}
