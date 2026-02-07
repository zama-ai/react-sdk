import { jsx as _jsx } from "react/jsx-runtime";
import React, {} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FhevmContext } from "../../src/react/context";
import { createFhevmConfig, hardhatLocal } from "../../src";
import { createMockFhevmInstance } from "./mockFhevmInstance";
import { createMockEip1193Provider, TEST_ADDRESS, TEST_CHAIN_ID } from "./mockProvider";
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
export function createTestWrapper(options = {}) {
    const { status = "idle", isConnected = false, chainId = TEST_CHAIN_ID, address = TEST_ADDRESS, instance, provider, wallet, rpcUrl, error, contextOverrides, } = options;
    // Create mock instance if not provided and status is ready
    const effectiveInstance = instance ?? (status === "ready" ? createMockFhevmInstance() : undefined);
    // Create mock provider if not provided and connected
    const effectiveProvider = provider ?? (isConnected ? createMockEip1193Provider() : undefined);
    const config = createFhevmConfig({ chains: [hardhatLocal] });
    const contextValue = {
        config,
        instance: effectiveInstance,
        status,
        error,
        chainId: isConnected ? chainId : undefined,
        address: isConnected ? address : undefined,
        isConnected,
        provider: effectiveProvider,
        wallet,
        rpcUrl,
        storage: undefined,
        refresh: () => { },
        ...contextOverrides,
    };
    // Create a fresh query client for each test
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
    return function TestWrapper({ children }) {
        return (_jsx(FhevmContext.Provider, { value: contextValue, children: _jsx(QueryClientProvider, { client: queryClient, children: children }) }));
    };
}
/**
 * Default wrapper with connected state and ready FHEVM.
 */
export const ConnectedWrapper = createTestWrapper({
    status: "ready",
    isConnected: true,
});
/**
 * Default wrapper with disconnected state.
 */
export const DisconnectedWrapper = createTestWrapper({
    status: "idle",
    isConnected: false,
});
/**
 * Default wrapper with initializing state.
 */
export const InitializingWrapper = createTestWrapper({
    status: "initializing",
    isConnected: true,
});
/**
 * Default wrapper with error state.
 */
export const ErrorWrapper = createTestWrapper({
    status: "error",
    isConnected: true,
    error: new Error("Test error"),
});
//# sourceMappingURL=testWrapper.js.map