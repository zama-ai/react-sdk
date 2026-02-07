import { vi } from "vitest";
import type { FhevmWallet } from "../../src/types/wallet";
import { TEST_ADDRESS } from "./mockProvider";

const MOCK_TX_HASH = "0x" + "ab".repeat(32);
const MOCK_SIGNATURE = "0x" + "cd".repeat(65);

/**
 * Create a mock FhevmWallet for testing.
 */
export function createMockFhevmWallet(
  overrides: Partial<{
    address: `0x${string}`;
    sendTransactionResult: `0x${string}`;
    signTypedDataResult: `0x${string}`;
  }> = {}
): FhevmWallet {
  return {
    address: overrides.address ?? TEST_ADDRESS,
    sendTransaction: vi.fn().mockResolvedValue(
      overrides.sendTransactionResult ?? (MOCK_TX_HASH as `0x${string}`)
    ),
    signTypedData: vi.fn().mockResolvedValue(
      overrides.signTypedDataResult ?? (MOCK_SIGNATURE as `0x${string}`)
    ),
  };
}
