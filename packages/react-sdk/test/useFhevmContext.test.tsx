import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFhevmContext } from "../src/react/context";
import {
  createTestWrapper,
  ConnectedWrapper,
  DisconnectedWrapper,
  createMockFhevmInstance,
  createMockEip1193Provider,
  TEST_ADDRESS,
  TEST_CHAIN_ID,
} from "./utils";
import { GenericStringInMemoryStorage } from "../src/storage/GenericStringStorage";

describe("useFhevmContext", () => {
  describe("basic context values", () => {
    it("should provide config", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: DisconnectedWrapper,
      });

      expect(result.current.config).toBeDefined();
      expect(result.current.config.chains).toBeDefined();
    });

    it("should provide status", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({ status: "initializing" }),
      });

      expect(result.current.status).toBe("initializing");
    });

    it("should provide isConnected", () => {
      const { result: disconnected } = renderHook(() => useFhevmContext(), {
        wrapper: DisconnectedWrapper,
      });
      expect(disconnected.current.isConnected).toBe(false);

      const { result: connected } = renderHook(() => useFhevmContext(), {
        wrapper: ConnectedWrapper,
      });
      expect(connected.current.isConnected).toBe(true);
    });
  });

  describe("instance", () => {
    it("should provide instance when ready", () => {
      const mockInstance = createMockFhevmInstance();
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          instance: mockInstance,
        }),
      });

      expect(result.current.instance).toBe(mockInstance);
    });

    it("should have undefined instance when not ready", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "initializing",
          isConnected: true,
        }),
      });

      expect(result.current.instance).toBeUndefined();
    });
  });

  describe("provider", () => {
    it("should provide provider when connected", () => {
      const mockProvider = createMockEip1193Provider();
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          provider: mockProvider,
        }),
      });

      expect(result.current.provider).toBe(mockProvider);
    });

    it("should have undefined provider when not connected", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: DisconnectedWrapper,
      });

      expect(result.current.provider).toBeUndefined();
    });
  });

  describe("address and chainId", () => {
    it("should provide address when connected", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          address: TEST_ADDRESS,
        }),
      });

      expect(result.current.address).toBe(TEST_ADDRESS);
    });

    it("should provide chainId when connected", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          chainId: TEST_CHAIN_ID,
        }),
      });

      expect(result.current.chainId).toBe(TEST_CHAIN_ID);
    });

    it("should have undefined address when not connected", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: DisconnectedWrapper,
      });

      expect(result.current.address).toBeUndefined();
    });
  });

  describe("storage", () => {
    it("should provide storage when configured", () => {
      const storage = new GenericStringInMemoryStorage();
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          contextOverrides: { storage },
        }),
      });

      expect(result.current.storage).toBe(storage);
    });

    it("should have undefined storage by default", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: ConnectedWrapper,
      });

      expect(result.current.storage).toBeUndefined();
    });
  });

  describe("error", () => {
    it("should provide error when in error state", () => {
      const testError = new Error("Connection failed");
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "error",
          isConnected: false,
          error: testError,
        }),
      });

      expect(result.current.error).toBe(testError);
    });

    it("should have undefined error when no error", () => {
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: ConnectedWrapper,
      });

      expect(result.current.error).toBeUndefined();
    });
  });

  describe("refresh", () => {
    it("should provide refresh function", () => {
      const refreshFn = vi.fn();
      const { result } = renderHook(() => useFhevmContext(), {
        wrapper: createTestWrapper({
          status: "ready",
          isConnected: true,
          contextOverrides: { refresh: refreshFn },
        }),
      });

      expect(result.current.refresh).toBe(refreshFn);
      result.current.refresh();
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });
  });
});
