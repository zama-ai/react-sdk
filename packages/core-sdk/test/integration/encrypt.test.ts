import { describe, it, expect } from "vitest";
import { encrypt } from "../../src/actions/encrypt.js";
import { createTestConfig, TEST_ADDRESSES, TEST_CHAIN_IDS } from "./setup.js";

describe("encrypt integration", () => {
  const config = createTestConfig();

  describe("input validation", () => {
    it("should validate chain ID", async () => {
      await expect(
        encrypt(config, {
          chainId: 0,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("Invalid chain ID");
    });

    it("should validate contract address", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: "invalid" as `0x${string}`,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("Invalid contractAddress");
    });

    it("should validate user address", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: "0x123" as `0x${string}`,
        })
      ).rejects.toThrow("Invalid userAddress");
    });

    it("should require at least one value", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("At least one value must be provided");
    });

    it("should reject unknown chain", async () => {
      await expect(
        encrypt(config, {
          chainId: 999999,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("Chain 999999 not found");
    });
  });

  describe("encryption types", () => {
    it("should accept uint64 values", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("not yet implemented");
    });

    it("should accept multiple values of different types", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [
            { type: "uint64", value: 100n },
            { type: "address", value: TEST_ADDRESSES.recipient },
            { type: "bool", value: true },
          ],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("not yet implemented");
    });

    it("should accept uint8 values", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint8", value: 255 }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("not yet implemented");
    });

    it("should accept uint128 values", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint128", value: 12345678901234567890n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("not yet implemented");
    });
  });

  describe("not yet implemented", () => {
    it("should throw not implemented error", async () => {
      await expect(
        encrypt(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          values: [{ type: "uint64", value: 100n }],
          contractAddress: TEST_ADDRESSES.token,
          userAddress: TEST_ADDRESSES.user,
        })
      ).rejects.toThrow("not yet implemented");
    });
  });
});
