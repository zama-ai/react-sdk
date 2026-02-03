/**
 * Checks if an error represents a user rejection.
 *
 * Common patterns from MetaMask, WalletConnect, and other wallets:
 * - "User rejected"
 * - "user rejected"
 * - "User denied"
 * - "User cancelled"
 * - "ACTION_REJECTED"
 * - "UserRejectedRequestError"
 */
export function isUserRejection(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("user cancelled") ||
    message.includes("action_rejected") ||
    message.includes("userrejectedrequesterror")
  );
}

/**
 * Checks if an error is due to insufficient funds.
 */
export function isInsufficientFunds(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("insufficient funds") ||
    message.includes("insufficient balance")
  );
}

/**
 * Checks if an error is a nonce conflict.
 */
export function isNonceConflict(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("nonce too low") ||
    message.includes("nonce has already been used") ||
    message.includes("replacement transaction underpriced")
  );
}

/**
 * Checks if an error is a gas estimation failure.
 */
export function isGasEstimationError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("cannot estimate gas") ||
    message.includes("gas required exceeds") ||
    message.includes("transaction may fail")
  );
}

/**
 * Normalizes transaction errors into user-friendly messages.
 *
 * This function transforms technical blockchain errors into
 * messages that are easier for users to understand and act upon.
 *
 * @example
 * ```typescript
 * try {
 *   await contract.transfer(...)
 * } catch (err) {
 *   const normalizedError = normalizeTransactionError(err as Error);
 *   toast.error(normalizedError.message);
 * }
 * ```
 *
 * @param error - The original error from a transaction or contract call
 * @returns A normalized error with a user-friendly message
 */
export function normalizeTransactionError(error: Error): Error {
  // User rejection - most common case
  if (isUserRejection(error)) {
    return new Error("Transaction rejected by user");
  }

  // Insufficient funds
  if (isInsufficientFunds(error)) {
    return new Error("Insufficient funds for transaction");
  }

  // Nonce conflict
  if (isNonceConflict(error)) {
    return new Error("Transaction nonce conflict. Please try again.");
  }

  // Gas estimation error
  if (isGasEstimationError(error)) {
    return new Error(
      "Transaction may fail. This usually means the contract call will revert. " +
        "Check your inputs and balances."
    );
  }

  // Return original error if no normalization applied
  return error;
}
