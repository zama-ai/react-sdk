/**
 * Format a bigint token amount with decimals for display.
 *
 * @example
 * formatConfidentialAmount(4000000n, 6)   // "4"
 * formatConfidentialAmount(1500000n, 6)   // "1.5"
 * formatConfidentialAmount(123n, 6)       // "0.000123"
 * formatConfidentialAmount(0n, 6)         // "0"
 */
export function formatConfidentialAmount(
  amount: bigint,
  decimals: number,
  maxDisplayDecimals: number = 6,
): string {
  if (amount === 0n) return "0";

  const divisor = 10n ** BigInt(decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;

  if (remainder === 0n) return whole.toString();

  const remainderStr = remainder.toString().padStart(decimals, "0");
  const trimmed = remainderStr.slice(0, maxDisplayDecimals).replace(/0+$/, "");

  if (whole === 0n && trimmed === "") {
    // Amount is non-zero but too small to display — show minimum precision
    return `<0.${"0".repeat(maxDisplayDecimals - 1)}1`;
  }

  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}
