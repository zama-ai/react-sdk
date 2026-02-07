import { describe, it, expect, vi } from "vitest";
import { createViemProvider, isViemProvider } from "../../src/providers/viem.js";

describe("Viem provider wrapper", () => {
  describe("isViemProvider", () => {
    it("should return true for viem WalletClient-like objects", () => {
      const mockClient = {
        chain: { id: 1 },
        transport: { type: "http" },
        sendTransaction: vi.fn(),
        account: { address: "0x1234567890123456789012345678901234567890" as `0x${string}` },
      };
      expect(isViemProvider(mockClient)).toBe(true);
    });

    it("should return true for viem PublicClient-like objects", () => {
      const mockClient = {
        chain: { id: 1 },
        transport: { type: "http" },
        readContract: vi.fn(),
      };
      expect(isViemProvider(mockClient)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isViemProvider(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isViemProvider(undefined)).toBe(false);
    });

    it("should return false for objects missing chain", () => {
      const mockObj = {
        transport: { type: "http" },
        sendTransaction: vi.fn(),
      };
      expect(isViemProvider(mockObj)).toBe(false);
    });

    it("should return false for objects missing transport", () => {
      const mockObj = {
        chain: { id: 1 },
        sendTransaction: vi.fn(),
      };
      expect(isViemProvider(mockObj)).toBe(false);
    });

    it("should return false for objects missing both sendTransaction and readContract", () => {
      const mockObj = {
        chain: { id: 1 },
        transport: { type: "http" },
      };
      expect(isViemProvider(mockObj)).toBe(false);
    });

    it("should return false for primitives", () => {
      expect(isViemProvider(123)).toBe(false);
      expect(isViemProvider("string")).toBe(false);
      expect(isViemProvider(true)).toBe(false);
    });
  });

  describe("createViemProvider", () => {
    it("should throw for non-viem objects", () => {
      expect(() => createViemProvider({})).toThrow(
        "Viem provider must be a WalletClient or PublicClient"
      );
      expect(() => createViemProvider(null)).toThrow(
        "Viem provider must be a WalletClient or PublicClient"
      );
    });

    it("should create provider wrapper from WalletClient", () => {
      const mockClient = {
        chain: { id: 1 },
        transport: { type: "http" },
        sendTransaction: vi.fn(),
        readContract: vi.fn(),
        account: { address: "0x1234567890123456789012345678901234567890" as `0x${string}` },
      };

      const provider = createViemProvider(mockClient);
      expect(provider.type).toBe("viem");
      expect(provider.sendTransaction).toBeDefined();
      expect(provider.readContract).toBeDefined();
      expect(provider.getAddress).toBeDefined();
      expect(provider.getRawProvider).toBeDefined();
    });

    it("should return raw provider", () => {
      const mockClient = {
        chain: { id: 1 },
        transport: { type: "http" },
        readContract: vi.fn(),
      };

      const provider = createViemProvider(mockClient);
      expect(provider.getRawProvider()).toBe(mockClient);
    });

    describe("sendTransaction", () => {
      it("should call client sendTransaction with correct params", async () => {
        const mockHash =
          "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" as `0x${string}`;
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          sendTransaction: vi.fn().mockResolvedValue(mockHash),
          readContract: vi.fn(),
          account: { address: "0x1111111111111111111111111111111111111111" as `0x${string}` },
        };

        const provider = createViemProvider(mockClient);

        const hash = await provider.sendTransaction({
          to: "0x2222222222222222222222222222222222222222" as `0x${string}`,
          data: "0xabcd" as `0x${string}`,
          value: 100n,
          gasLimit: 21000n,
        });

        expect(hash).toBe(mockHash);
        expect(mockClient.sendTransaction).toHaveBeenCalledWith({
          to: "0x2222222222222222222222222222222222222222",
          data: "0xabcd",
          value: 100n,
          gas: 21000n,
        });
      });

      it("should throw if client doesn't support sendTransaction", async () => {
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          readContract: vi.fn(),
        };

        const provider = createViemProvider(mockClient);

        await expect(
          provider.sendTransaction({
            to: "0x1111111111111111111111111111111111111111" as `0x${string}`,
            data: "0x" as `0x${string}`,
          })
        ).rejects.toThrow("Viem client must be a WalletClient to send transactions");
      });
    });

    describe("readContract", () => {
      it("should call client readContract with correct params", async () => {
        const mockResult = 12345n;
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          readContract: vi.fn().mockResolvedValue(mockResult),
        };

        const provider = createViemProvider(mockClient);

        const result = await provider.readContract({
          address: "0x1111111111111111111111111111111111111111" as `0x${string}`,
          abi: [],
          functionName: "balanceOf",
          args: ["0x2222222222222222222222222222222222222222"],
        });

        expect(result).toBe(mockResult);
        expect(mockClient.readContract).toHaveBeenCalledWith({
          address: "0x1111111111111111111111111111111111111111",
          abi: [],
          functionName: "balanceOf",
          args: ["0x2222222222222222222222222222222222222222"],
        });
      });

      it("should throw if client doesn't support readContract", async () => {
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          sendTransaction: vi.fn(),
          account: { address: "0x1111111111111111111111111111111111111111" as `0x${string}` },
        };

        const provider = createViemProvider(mockClient);

        await expect(
          provider.readContract({
            address: "0x1111111111111111111111111111111111111111" as `0x${string}`,
            abi: [],
            functionName: "balanceOf",
          })
        ).rejects.toThrow("Viem client must support readContract");
      });
    });

    describe("getAddress", () => {
      it("should return account address", async () => {
        const mockAddress = "0x1234567890123456789012345678901234567890" as `0x${string}`;
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          sendTransaction: vi.fn(),
          readContract: vi.fn(),
          account: { address: mockAddress },
        };

        const provider = createViemProvider(mockClient);
        const address = await provider.getAddress();

        expect(address).toBe(mockAddress);
      });

      it("should throw if client doesn't have account", async () => {
        const mockClient = {
          chain: { id: 1 },
          transport: { type: "http" },
          readContract: vi.fn(),
        };

        const provider = createViemProvider(mockClient);

        await expect(provider.getAddress()).rejects.toThrow(
          "Viem client must have an account to get address"
        );
      });
    });
  });
});
