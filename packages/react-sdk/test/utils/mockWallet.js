import { vi } from "vitest";
import { TEST_ADDRESS } from "./mockProvider";
const MOCK_TX_HASH = "0x" + "ab".repeat(32);
const MOCK_SIGNATURE = "0x" + "cd".repeat(65);
/**
 * Create a mock FhevmWallet for testing.
 */
export function createMockFhevmWallet(overrides = {}) {
    return {
        address: overrides.address ?? TEST_ADDRESS,
        sendTransaction: vi.fn().mockResolvedValue(overrides.sendTransactionResult ?? MOCK_TX_HASH),
        signTypedData: vi.fn().mockResolvedValue(overrides.signTypedDataResult ?? MOCK_SIGNATURE),
    };
}
//# sourceMappingURL=mockWallet.js.map