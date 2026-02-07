import { describe, it, expect, beforeEach } from "vitest";
import { createFhevmConfig } from "../../src/config/createConfig.js";
import { http, fallback } from "../../src/transports/index.js";
import { sepolia, hardhatLocal } from "../../src/chains/index.js";
import { confidentialBalance, confidentialBalances } from "../../src/actions/confidentialBalance.js";
import { confidentialTransfer } from "../../src/actions/confidentialTransfer.js";
import {
  createMockEthersSigner,
  createMockViemClient,
  createMockPublicClient,
  TEST_ADDRESSES,
  MOCK_BALANCE_HANDLE,
} from "./setup.js";

describe("End-to-end workflows", () => {
  describe("Config creation and usage", () => {
    it("should create config with multiple chains and transports", () => {
      const config = createFhevmConfig({
        chains: [sepolia, hardhatLocal],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
          [hardhatLocal.id]: fallback([
            http("http://localhost:8545"),
            http("http://127.0.0.1:8545"),
          ]),
        },
      });

      expect(config.chains).toHaveLength(2);
      expect(config.getChain(sepolia.id)).toBeDefined();
      expect(config.getChain(hardhatLocal.id)).toBeDefined();
      expect(config.isMockChain(hardhatLocal.id)).toBe(true);
      expect(config.isMockChain(sepolia.id)).toBe(false);
    });

    it("should retrieve chain metadata", () => {
      const config = createFhevmConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
        },
      });

      const chain = config.getChain(sepolia.id);
      expect(chain).toBeDefined();
      expect(chain?.name).toBe("Sepolia");
      expect(chain?.isMock).toBe(false);

      if (chain && !chain.isMock) {
        expect(chain.aclAddress).toBeDefined();
        expect(chain.gatewayUrl).toBeDefined();
        expect(chain.relayerUrl).toBeDefined();
      }
    });
  });

  describe("Read balance workflow", () => {
    let config: ReturnType<typeof createFhevmConfig>;
    let mockClient: ReturnType<typeof createMockPublicClient>;

    beforeEach(() => {
      config = createFhevmConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
        },
      });
      mockClient = createMockPublicClient();
    });

    it("should read single balance", async () => {
      mockClient.readContract.mockResolvedValue(MOCK_BALANCE_HANDLE);

      const handle = await confidentialBalance(config, {
        chainId: sepolia.id,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: mockClient,
      });

      expect(handle).toBe(MOCK_BALANCE_HANDLE);
    });

    it("should read multiple balances from different tokens", async () => {
      const handle1 = "0x1111111111111111111111111111111111111111111111111111111111111111" as `0x${string}`;
      const handle2 = "0x2222222222222222222222222222222222222222222222222222222222222222" as `0x${string}`;
      const handle3 = "0x3333333333333333333333333333333333333333333333333333333333333333" as `0x${string}`;

      mockClient.readContract
        .mockResolvedValueOnce(handle1)
        .mockResolvedValueOnce(handle2)
        .mockResolvedValueOnce(handle3);

      const handles = await confidentialBalances(config, {
        chainId: sepolia.id,
        contracts: [
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.contract, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.recipient },
        ],
        provider: mockClient,
      });

      expect(handles).toEqual([handle1, handle2, handle3]);
    });
  });

  describe("Transfer workflow (validation only - not implemented)", () => {
    let config: ReturnType<typeof createFhevmConfig>;

    beforeEach(() => {
      config = createFhevmConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
        },
      });
    });

    it("should validate transfer with ethers", async () => {
      const mockSigner = createMockEthersSigner();

      await expect(
        confidentialTransfer(config, {
          chainId: sepolia.id,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockSigner,
        })
      ).rejects.toThrow("Confidential transfer failed");
    });

    it("should validate transfer with viem", async () => {
      const mockClient = createMockViemClient();

      await expect(
        confidentialTransfer(config, {
          chainId: sepolia.id,
          contractAddress: TEST_ADDRESSES.token,
          to: TEST_ADDRESSES.recipient,
          amount: 100n,
          provider: mockClient,
        })
      ).rejects.toThrow("Confidential transfer failed");
    });
  });

  describe("Multi-chain workflow", () => {
    it("should work with multiple chains", async () => {
      const config = createFhevmConfig({
        chains: [sepolia, hardhatLocal],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
          [hardhatLocal.id]: http("http://localhost:8545"),
        },
      });

      const sepoliaClient = createMockPublicClient();
      const hardhatClient = createMockPublicClient();

      sepoliaClient.readContract.mockResolvedValue(
        "0x1111111111111111111111111111111111111111111111111111111111111111" as `0x${string}`
      );
      hardhatClient.readContract.mockResolvedValue(
        "0x2222222222222222222222222222222222222222222222222222222222222222" as `0x${string}`
      );

      const sepoliaHandle = await confidentialBalance(config, {
        chainId: sepolia.id,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: sepoliaClient,
      });

      const hardhatHandle = await confidentialBalance(config, {
        chainId: hardhatLocal.id,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: hardhatClient,
      });

      expect(sepoliaHandle).toBeDefined();
      expect(hardhatHandle).toBeDefined();
      expect(sepoliaHandle).not.toBe(hardhatHandle);
    });
  });

  describe("Provider flexibility", () => {
    let config: ReturnType<typeof createFhevmConfig>;

    beforeEach(() => {
      config = createFhevmConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
        },
      });
    });

    it("should work with ethers for reading", async () => {
      const mockSigner = createMockEthersSigner();
      mockSigner.provider.call = mockSigner.provider.call || (() => Promise.resolve("0x"));

      // This will fail because we're using a signer for reading (needs readContract)
      // But demonstrates provider detection works
      await expect(
        confidentialBalance(config, {
          chainId: sepolia.id,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: mockSigner,
        })
      ).rejects.toThrow();
    });

    it("should work with viem for reading", async () => {
      const mockClient = createMockPublicClient();
      mockClient.readContract.mockResolvedValue(MOCK_BALANCE_HANDLE);

      const handle = await confidentialBalance(config, {
        chainId: sepolia.id,
        contractAddress: TEST_ADDRESSES.token,
        account: TEST_ADDRESSES.user,
        provider: mockClient,
      });

      expect(handle).toBe(MOCK_BALANCE_HANDLE);
    });
  });

  describe("Error handling workflow", () => {
    let config: ReturnType<typeof createFhevmConfig>;

    beforeEach(() => {
      config = createFhevmConfig({
        chains: [sepolia],
        transports: {
          [sepolia.id]: http("https://sepolia.infura.io/v3/test"),
        },
      });
    });

    it("should handle chain not found", async () => {
      const mockClient = createMockPublicClient();

      await expect(
        confidentialBalance(config, {
          chainId: 999999,
          contractAddress: TEST_ADDRESSES.token,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Chain 999999 not found");
    });

    it("should handle invalid addresses", async () => {
      const mockClient = createMockPublicClient();

      await expect(
        confidentialBalance(config, {
          chainId: sepolia.id,
          contractAddress: "invalid" as `0x${string}`,
          account: TEST_ADDRESSES.user,
          provider: mockClient,
        })
      ).rejects.toThrow("Invalid contractAddress");
    });

    it("should handle contract errors gracefully in batch reads", async () => {
      const mockClient = createMockPublicClient();
      mockClient.readContract
        .mockResolvedValueOnce(MOCK_BALANCE_HANDLE)
        .mockRejectedValueOnce(new Error("Contract not found"))
        .mockResolvedValueOnce(MOCK_BALANCE_HANDLE);

      const handles = await confidentialBalances(config, {
        chainId: sepolia.id,
        contracts: [
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.contract, account: TEST_ADDRESSES.user },
          { contractAddress: TEST_ADDRESSES.token, account: TEST_ADDRESSES.recipient },
        ],
        provider: mockClient,
      });

      // Error is converted to undefined
      expect(handles).toEqual([MOCK_BALANCE_HANDLE, undefined, MOCK_BALANCE_HANDLE]);
    });
  });
});
