import { describe, it, expect, beforeEach } from "vitest";
import { confidentialTransfer } from "../../src/actions/confidentialTransfer.js";
import {
  createTestConfig,
  createMockEthersSigner,
  createMockViemClient,
  TEST_ADDRESSES,
  TEST_CHAIN_IDS,
} from "./setup.js";

describe("confidentialTransfer integration", () => {
  const config = createTestConfig();

  describe("input validation", () => {
    it("should validate chain ID", async () => {
      const mockSigner = createMockEthersSigner();
      await expect(
        confidentialTransfer(config, {
          chainId: 0,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Invalid chain ID");
    });

    it("should validate contract address", async () => {
      const mockSigner = createMockEthersSigner();
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: "invalid" as `0x${string}`,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Invalid contractAddress");
    });

    it("should validate recipient address", async () => {
      const mockSigner = createMockEthersSigner();
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: "0x123" as `0x${string}`,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Invalid to");
    });

    it("should reject negative amounts", async () => {
      const mockSigner = createMockEthersSigner();
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: -100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Amount must be non-negative");
    });

    it("should accept zero amount", async () => {
      const mockSigner = createMockEthersSigner();
      // Will fail on encryption, but passes amount validation
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 0n,
          provider: mockSigner,
        })
      ).rejects.toThrow("not yet implemented");
    });
  });

  describe("transfer with ethers", () => {
    let mockSigner: ReturnType<typeof createMockEthersSigner>;

    beforeEach(() => {
      mockSigner = createMockEthersSigner();
    });

    it("should use signer address when userAddress not provided", async () => {
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("not yet implemented");

      // Should have called getAddress
      expect(mockSigner.getAddress).toHaveBeenCalled();
    });

    it("should use provided userAddress", async () => {
      const customAddress = "0x5555555555555555555555555555555555555555" as `0x${string}`;

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
          userAddress: customAddress,
        })
      ).rejects.toThrow("not yet implemented");

      // Should NOT call getAddress since userAddress was provided
      expect(mockSigner.getAddress).not.toHaveBeenCalled();
    });

    it("should handle large amounts", async () => {
      const largeAmount = 1_000_000_000_000n; // 1 trillion

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: largeAmount,
          provider: mockSigner,
        })
      ).rejects.toThrow("not yet implemented");
    });
  });

  describe("transfer with viem", () => {
    let mockClient: ReturnType<typeof createMockViemClient>;

    beforeEach(() => {
      mockClient = createMockViemClient();
    });

    it("should use client account address when userAddress not provided", async () => {
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockClient,
        })
      ).rejects.toThrow("not yet implemented");

      // Account address should be accessed from client
      expect(mockClient.account?.address).toBe(TEST_ADDRESSES.user);
    });

    it("should accept custom user address with viem", async () => {
      const customAddress = "0x5555555555555555555555555555555555555555" as `0x${string}`;

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockClient,
          userAddress: customAddress,
        })
      ).rejects.toThrow("not yet implemented");
    });
  });

  describe("not yet implemented", () => {
    it("should throw not implemented error (encryption step)", async () => {
      const mockSigner = createMockEthersSigner();

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("not yet implemented");
    });

    it("should wrap encryption error in transfer error", async () => {
      const mockSigner = createMockEthersSigner();

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Confidential transfer failed");
    });
  });

  describe("provider detection", () => {
    it("should work with ethers signer", async () => {
      const mockSigner = createMockEthersSigner();

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Confidential transfer failed");
    });

    it("should work with viem wallet client", async () => {
      const mockClient = createMockViemClient();

      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockClient,
        })
      ).rejects.toThrow("Confidential transfer failed");
    });

    it("should reject invalid providers", async () => {
      await expect(
        confidentialTransfer(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: {},
        })
      ).rejects.toThrow("Unable to detect provider type");
    });
  });
});
