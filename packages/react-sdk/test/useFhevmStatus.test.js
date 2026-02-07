import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useFhevmStatus } from "../src/react/useFhevmStatus";
import { createTestWrapper, ConnectedWrapper, DisconnectedWrapper, InitializingWrapper, ErrorWrapper, } from "./utils";
describe("useFhevmStatus", () => {
    describe("status states", () => {
        it("should return idle status when not connected", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: DisconnectedWrapper,
            });
            expect(result.current.status).toBe("idle");
            expect(result.current.isReady).toBe(false);
            expect(result.current.isInitializing).toBe(false);
            expect(result.current.isError).toBe(false);
        });
        it("should return initializing status during init", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: InitializingWrapper,
            });
            expect(result.current.status).toBe("initializing");
            expect(result.current.isReady).toBe(false);
            expect(result.current.isInitializing).toBe(true);
            expect(result.current.isError).toBe(false);
        });
        it("should return ready status when initialized", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: ConnectedWrapper,
            });
            expect(result.current.status).toBe("ready");
            expect(result.current.isReady).toBe(true);
            expect(result.current.isInitializing).toBe(false);
            expect(result.current.isError).toBe(false);
        });
        it("should return error status on failure", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: ErrorWrapper,
            });
            expect(result.current.status).toBe("error");
            expect(result.current.isReady).toBe(false);
            expect(result.current.isInitializing).toBe(false);
            expect(result.current.isError).toBe(true);
            expect(result.current.error).toBeInstanceOf(Error);
            expect(result.current.error?.message).toBe("Test error");
        });
    });
    describe("chain and connection", () => {
        it("should provide chainId when connected", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: createTestWrapper({
                    status: "ready",
                    isConnected: true,
                    chainId: 11155111,
                }),
            });
            expect(result.current.chainId).toBe(11155111);
        });
        it("should return undefined chainId when not connected", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: DisconnectedWrapper,
            });
            expect(result.current.chainId).toBeUndefined();
        });
        it("should return isConnected true when connected", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: ConnectedWrapper,
            });
            expect(result.current.isConnected).toBe(true);
        });
        it("should return isConnected false when not connected", () => {
            const { result } = renderHook(() => useFhevmStatus(), {
                wrapper: DisconnectedWrapper,
            });
            expect(result.current.isConnected).toBe(false);
        });
    });
});
//# sourceMappingURL=useFhevmStatus.test.js.map