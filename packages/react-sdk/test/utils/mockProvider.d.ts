import type { Eip1193Provider } from "../../src/internal/eip1193";
/**
 * Default test address
 */
export declare const TEST_ADDRESS: "0x1234567890123456789012345678901234567890";
/**
 * Default test chain ID (Hardhat local)
 */
export declare const TEST_CHAIN_ID = 31337;
/**
 * Create a mock EIP-1193 provider for testing.
 */
export declare function createMockEip1193Provider(overrides?: Partial<{
    chainId: number;
    accounts: string[];
    signatureResponse: string;
}>): Eip1193Provider;
/**
 * Create a mock provider that fails specific methods.
 */
export declare function createFailingProvider(failingMethods: string[], error?: Error): Eip1193Provider;
/**
 * Create a mock provider with delayed responses.
 */
export declare function createDelayedProvider(delayMs: number): Eip1193Provider;
//# sourceMappingURL=mockProvider.d.ts.map