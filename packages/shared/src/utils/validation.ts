/**
 * Check if a string is a valid Ethereum address.
 */
export function isAddress(address: unknown): address is `0x${string}` {
  if (typeof address !== "string") {
    return false;
  }
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Validate that a value is a valid address, throw if not.
 */
export function assertAddress(address: unknown, name = "address"): asserts address is `0x${string}` {
  if (!isAddress(address)) {
    throw new Error(`Invalid ${name}: ${String(address)}`);
  }
}

/**
 * Check if a value is a bigint.
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}

/**
 * Validate that a value is a bigint, throw if not.
 */
export function assertBigInt(value: unknown, name = "value"): asserts value is bigint {
  if (!isBigInt(value)) {
    throw new Error(`Invalid ${name}: ${String(value)}`);
  }
}

/**
 * Check if a value is a valid chain ID.
 */
export function isValidChainId(chainId: unknown): chainId is number {
  return typeof chainId === "number" && Number.isInteger(chainId) && chainId > 0;
}

/**
 * Validate chain ID.
 */
export function assertChainId(chainId: unknown): asserts chainId is number {
  if (!isValidChainId(chainId)) {
    throw new Error(`Invalid chain ID: ${String(chainId)}`);
  }
}
