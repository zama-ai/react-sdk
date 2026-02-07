import type { FhevmInstance } from "../../src/fhevmTypes";
/**
 * Default mock handle used in tests
 */
export declare const MOCK_HANDLE: string;
/**
 * Create a mock FHEVM instance for testing.
 *
 * This mock provides sensible defaults for all methods while allowing
 * individual methods to be overridden or spied upon.
 */
export declare function createMockFhevmInstance(overrides?: Partial<FhevmInstance>): FhevmInstance;
/**
 * Create a mock instance that fails specific operations.
 */
export declare function createFailingFhevmInstance(failingMethods: (keyof FhevmInstance)[], error?: Error): FhevmInstance;
/**
 * Create a mock instance with delayed responses.
 */
export declare function createDelayedFhevmInstance(delayMs: number): FhevmInstance;
//# sourceMappingURL=mockFhevmInstance.d.ts.map