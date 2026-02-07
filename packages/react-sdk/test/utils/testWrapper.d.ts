import { type ReactNode } from "react";
import { type FhevmContextValue, type FhevmStatus } from "../../src/react/context";
import type { FhevmInstance } from "../../src/fhevmTypes";
import type { Eip1193Provider } from "../../src/internal/eip1193";
import type { FhevmWallet } from "../../src/types/wallet";
/**
 * Options for creating a test wrapper.
 */
export interface TestWrapperOptions {
    /** FHEVM status */
    status?: FhevmStatus;
    /** Whether connected */
    isConnected?: boolean;
    /** Chain ID */
    chainId?: number;
    /** User address */
    address?: `0x${string}`;
    /** FHEVM instance (will create mock if not provided) */
    instance?: FhevmInstance;
    /** Provider (will create mock if not provided) */
    provider?: Eip1193Provider;
    /** FhevmWallet for direct wallet integration */
    wallet?: FhevmWallet;
    /** RPC URL for the current chain */
    rpcUrl?: string;
    /** Error state */
    error?: Error;
    /** Additional context overrides */
    contextOverrides?: Partial<FhevmContextValue>;
}
/**
 * Create a wrapper component for testing hooks.
 *
 * @example
 * ```tsx
 * const { result } = renderHook(() => useFhevmStatus(), {
 *   wrapper: createTestWrapper({ status: "ready", isConnected: true }),
 * });
 * ```
 */
export declare function createTestWrapper(options?: TestWrapperOptions): ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Default wrapper with connected state and ready FHEVM.
 */
export declare const ConnectedWrapper: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Default wrapper with disconnected state.
 */
export declare const DisconnectedWrapper: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Default wrapper with initializing state.
 */
export declare const InitializingWrapper: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Default wrapper with error state.
 */
export declare const ErrorWrapper: ({ children }: {
    children: ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=testWrapper.d.ts.map