import { describe, it, expect, beforeEach } from "vitest";
import { readConfidentialBalance, readConfidentialBalances } from "../../src/actions/confidentialBalance.js";
import {
  createTestConfig,
  createMockViemClient,
  createMockPublicClient,
  TEST_ADDRESSES,
  TEST_CHAIN_IDS,
  MOCK_BALANCE_HANDLE,
  ZERO_HASH,
} from "./setup.js";

describe("readConfidentialBalance integration", () => {
  const config = createTestConfig();

  describe("input validation", () => {
    it("should validate chain ID", async () => {
      const mockClient = createMockPublicClient();
      await expect(
        readConfidentialBalance(config, {
          chainId: 0,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Invalid chain ID");
    });

    it("should validate contract address", async () => {
      const mockClient = createMockPublicClient();
      await expect(
        readConfidentialBalance(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: "invalid" as `0x${string}`,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Invalid contractAddress");
    });

    it("should validate account address", async () => {
      const mockClient = createMockPublicClient();
      await expect(
        readConfidentialBalance(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          account: "0x123" as `0x${string}`,
          provider: mockClient,
        })
      ).rejects.toThrow("Invalid account");
    });

    it("should reject unknown chain", async () => {
      const mockClient = createMockPublicClient();
      await expect(
        readConfidentialBalance(config, {
          chainId: 999999,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Chain 999999 not found");
    });
  });

  describe("reading balance with viem", () => {
    let mockClient: ReturnType<typeof createMockPublicClient>;

    beforeEach(() => {
      mockClient = createMockPublicClient();
    });

    it("should read balance handle", async () => {
      mockClient.readContract.mockResolvedValue(MOCK_BALANCE_HANDLE);

      const handle = await readConfidentialBalance(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: mockClient,
      });

      expect(handle).toBe(MOCK_BALANCE_HANDLE);
      expect(mockClient.readContract).toHaveBeenCalledWith({
        address: TEST_ADDRESSES.token,
        abi: expect.any(Array),
        functionName: "confidentialBalanceOf",
        args: [TEST_ADDRESSES.user],
      });
    });

    it("should return undefined for zero hash", async () => {
      mockClient.readContract.mockResolvedValue(ZERO_HASH);

      const handle = await readConfidentialBalance(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: mockClient,
      });

      expect(handle).toBeUndefined();
    });

    it("should use custom ABI if provided", async () => {
      mockClient.readContract.mockResolvedValue(MOCK_BALANCE_HANDLE);
      const customAbi = [{ name: "customFunction" }];

      await readConfidentialBalance(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: mockClient,
        abi: customAbi,
      });

      expect(mockClient.readContract).toHaveBeenCalledWith({
        address: TEST_ADDRESSES.token,
        abi: customAbi,
        functionName: "confidentialBalanceOf",
        args: [TEST_ADDRESSES.user],
      });
    });

    it("should throw on read error", async () => {
      mockClient.readContract.mockRejectedValue(new Error("Contract call failed"));

      await expect(
        readConfidentialBalance(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Failed to read confidential balance");
    });
  });

  describe("reading balance with RPC URL", () => {
    it("should throw error for RPC URL (not yet implemented)", async () => {
      await expect(
        readConfidentialBalance(config, {
          chainId: TEST_CHAIN_IDS.sepolia,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: "https://sepolia.infura.io/v3/test",
        })
      ).rejects.toThrow("RPC URL support not yet implemented");
    });
  });

  describe("reading multiple balances", () => {
    let mockClient: ReturnType<typeof createMockPublicClient>;

    beforeEach(() => {
      mockClient = createMockPublicClient();
    });

    it("should read multiple balances in parallel", async () => {
      const handle1 = "0x1111111111111111111111111111111111111111111111111111111111111111" as `0x${string}`;
      const handle2 = "0x2222222222222222222222222222222222222222222222222222222222222222" as `0x${string}`;

      mockClient.readContract
        .mockResolvedValueOnce(handle1)
        .mockResolvedValueOnce(handle2)
        .mockResolvedValueOnce(ZERO_HASH);

      const handles = await readConfidentialBalances(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contracts: [
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.recipient },
          { contractAddress: TEST_ADDRESSES.contract, account: TEST_ADDRESSES.user },
        ],
        provider: mockClient,
      });

      expect(handles).toEqual([handle1, handle2, undefined]);
      expect(mockClient.readContract).toHaveBeenCalledTimes(3);
    });

    it("should handle errors gracefully (returns undefined)", async () => {
      mockClient.readContract
        .mockResolvedValueOnce(MOCK_BALANCE_HANDLE)
        .mockRejectedValueOnce(new Error("Contract error"))
        .mockResolvedValueOnce(MOCK_BALANCE_HANDLE);

      const handles = await readConfidentialBalances(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contracts: [
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.recipient },
          { contractAddress: TEST_ADDRESSES.contract, account: TEST_ADDRESSES.user },
        ],
        provider: mockClient,
      });

      expect(handles).toEqual([MOCK_BALANCE_HANDLE, undefined, MOCK_BALANCE_HANDLE]);
    });

    it("should support per-contract custom ABIs", async () => {
      const customAbi1 = [{ name: "custom1" }];
      const customAbi2 = [{ name: "custom2" }];

      mockClient.readContract.mockResolvedValue(MOCK_BALANCE_HANDLE);

      await readConfidentialBalances(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contracts: [
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.user, abi: customAbi1 },
          {
            contractAddress: TEST_ADDRESSES.contract,
            account: TEST_ADDRESSES.user,
            abi: customAbi2,
          },
        ],
        provider: mockClient,
      });

      expect(mockClient.readContract).toHaveBeenNthCalledWith(1, {
        address: TEST_ADDRESSES.token,
        abi: customAbi1,
        functionName: "confidentialBalanceOf",
        args: [TEST_ADDRESSES.user],
      });

      expect(mockClient.readContract).toHaveBeenNthCalledWith(2, {
        address: TEST_ADDRESSES.contract,
        abi: customAbi2,
        functionName: "confidentialBalanceOf",
        args: [TEST_ADDRESSES.user],
      });
    });

    it("should handle empty contracts array", async () => {
      const handles = await readConfidentialBalances(config, {
        chainId: TEST_CHAIN_IDS.sepolia,
        contracts: [],
        provider: mockClient,
      });

      expect(handles).toEqual([]);
      expect(mockClient.readContract).not.toHaveBeenCalled();
    });
  });
});
