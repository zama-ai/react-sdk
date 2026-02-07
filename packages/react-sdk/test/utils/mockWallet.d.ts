import type { FhevmWallet } from "../../src/types/wallet";
/**
 * Create a mock FhevmWallet for testing.
 */
export declare function createMockFhevmWallet(overrides?: Partial<{
    address: `0x${string}`;
    sendTransactionResult: `0x${string}`;
    signTypedDataResult: `0x${string}`;
}>): FhevmWallet;
//# sourceMappingURL=mockWallet.d.ts.map