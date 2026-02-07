import { describe, it, expect, vi } from "vitest";
import { createEthersProvider, isEthersProvider } from "../../src/providers/ethers.js";

describe("Ethers provider wrapper", () => {
  describe("isEthersProvider", () => {
    it("should return true for ethers Signer-like objects", () => {
      const mockSigner = {
        sendTransaction: vi.fn(),
        getAddress: vi.fn(),
      };
      expect(isEthersProvider(mockSigner)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isEthersProvider(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isEthersProvider(undefined)).toBe(false);
    });

    it("should return false for objects missing sendTransaction", () => {
      const mockObj = { getAddress: vi.fn() };
      expect(isEthersProvider(mockObj)).toBe(false);
    });

    it("should return false for objects missing getAddress", () => {
      const mockObj = { sendTransaction: vi.fn() };
      expect(isEthersProvider(mockObj)).toBe(false);
    });

    it("should return false for objects with non-function sendTransaction", () => {
      const mockObj = {
        sendTransaction: "not a function",
        getAddress: vi.fn(),
      };
      expect(isEthersProvider(mockObj)).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isEthersProvider(123)).toBe(false);
      expect(isEthersProvider("string")).toBe(false);
      expect(isEthersProvider(true)).toBe(false);
    });
  });

  describe("createEthersProvider", () => {
    it("should throw for non-Signer objects", () => {
      expect(() => createEthersProvider({})).toThrow("Ethers provider must be a Signer");
      expect(() => createEthersProvider(null)).toThrow("Ethers provider must be a Signer");
      expect(() => createEthersProvider(undefined)).toThrow(
        "Ethers provider must be a Signer"
      );
    });

    it("should create provider wrapper from Signer", () => {
      const mockSigner = {
        sendTransaction: vi.fn(),
        getAddress: vi.fn(),
      };

      const provider = createEthersProvider(mockSigner);
      expect(provider.type).toBe("ethers");
      expect(provider.sendTransaction).toBeDefined();
      expect(provider.readContract).toBeDefined();
      expect(provider.getAddress).toBeDefined();
      expect(provider.getRawProvider).toBeDefined();
    });

    it("should return raw provider", () => {
      const mockSigner = {
        sendTransaction: vi.fn(),
        getAddress: vi.fn(),
      };

      const provider = createEthersProvider(mockSigner);
      expect(provider.getRawProvider()).toBe(mockSigner);
    });

    describe("sendTransaction", () => {
      it("should call signer sendTransaction with correct params", async () => {
        const mockReceipt = { status: 1 };
        const mockResponse = {
          hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          wait: vi.fn().mockResolvedValue(mockReceipt),
        };

        const mockSigner = {
          sendTransaction: vi.fn().mockResolvedValue(mockResponse),
          getAddress: vi.fn().mockResolvedValue("0x1111111111111111111111111111111111111111"),
        };

        const provider = createEthersProvider(mockSigner);

        const hash = await provider.sendTransaction({
          to: "0x2222222222222222222222222222222222222222" as `0x${string}`,
          data: "0xabcd" as `0x${string}`,
          value: 100n,
          gasLimit: 21000n,
        });

        expect(hash).toBe(
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        );
        expect(mockSigner.sendTransaction).toHaveBeenCalledWith({
          to: "0x2222222222222222222222222222222222222222",
          data: "0xabcd",
          value: 100n,
          gasLimit: 21000n,
        });
      });

      it("should handle transaction without optional params", async () => {
        const mockResponse = {
          hash: "0xabc",
          wait: vi.fn(),
        };

        const mockSigner = {
          sendTransaction: vi.fn().mockResolvedValue(mockResponse),
          getAddress: vi.fn(),
        };

        const provider = createEthersProvider(mockSigner);

        await provider.sendTransaction({
          to: "0x1111111111111111111111111111111111111111" as `0x${string}`,
          data: "0x" as `0x${string}`,
        });

        expect(mockSigner.sendTransaction).toHaveBeenCalledWith({
          to: "0x1111111111111111111111111111111111111111",
          data: "0x",
          value: undefined,
          gasLimit: undefined,
        });
      });
    });

    describe("getAddress", () => {
      it("should call signer getAddress and return result", async () => {
        const mockAddress = "0x1234567890123456789012345678901234567890";
        const mockSigner = {
          sendTransaction: vi.fn(),
          getAddress: vi.fn().mockResolvedValue(mockAddress),
        };

        const provider = createEthersProvider(mockSigner);
        const address = await provider.getAddress();

        expect(address).toBe(mockAddress);
        expect(mockSigner.getAddress).toHaveBeenCalled();
      });
    });
  });
});
