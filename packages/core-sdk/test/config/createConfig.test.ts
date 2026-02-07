import { describe, it, expect } from "vitest";
import { createFhevmConfig } from "../../src/config/createConfig.js";

const mockTransport = { request: async () => {} } as any;

describe("createFhevmConfig", () => {
  describe("basic configuration", () => {
    it("should create config with chain and transport", () => {
      const config = createFhevmConfig({
        chains: [{ id: 1, name: "Ethereum", network: "mainnet", isMock: false }],
        transports: {
          1: mockTransport,
        },
      });

      expect(config.chains).toHaveLength(1);
      expect(config.chains[0].id).toBe(1);
      expect(config.chains[0].name).toBe("Ethereum");
    });

    it("should create config with multiple chains", () => {
      const chains = [
        { id: 1, name: "Ethereum", network: "mainnet", isMock: false },
        { id: 11155111, name: "Sepolia", network: "sepolia", isMock: false },
        { id: 31337, name: "Hardhat", network: "hardhat", isMock: true, rpcUrl: "http://localhost:8545" },
      ];

      const config = createFhevmConfig({
        chains,
        transports: {
          1: mockTransport,
          11155111: mockTransport,
          31337: mockTransport,
        },
      });
      expect(config.chains).toHaveLength(3);
      expect(config.chains[0].id).toBe(1);
      expect(config.chains[1].id).toBe(11155111);
      expect(config.chains[2].id).toBe(31337);
    });
  });

  describe("chain ordering", () => {
    it("should preserve chain order", () => {
      const chains = [
        { id: 3, name: "C", network: "c", isMock: false },
        { id: 1, name: "A", network: "a", isMock: false },
        { id: 2, name: "B", network: "b", isMock: false },
      ];

      const config = createFhevmConfig({
        chains,
        transports: {
          1: mockTransport,
          2: mockTransport,
          3: mockTransport,
        },
      });
      expect(config.chains.map((c) => c.id)).toEqual([3, 1, 2]);
    });
  });

  describe("validation", () => {
    it("should throw error for empty chains array", () => {
      expect(() =>
        createFhevmConfig({ chains: [], transports: {} })
      ).toThrow("At least one chain must be provided");
    });

    it("should throw error for missing transport", () => {
      expect(() =>
        createFhevmConfig({
          chains: [{ id: 1, name: "Test", network: "test", isMock: false }],
          transports: {},
        })
      ).toThrow("No transport configured for chain 1");
    });
  });

  describe("config methods", () => {
    it("should get chain by ID", () => {
      const config = createFhevmConfig({
        chains: [{ id: 1, name: "Ethereum", network: "mainnet", isMock: false }],
        transports: { 1: mockTransport },
      });

      const chain = config.getChain(1);
      expect(chain).toBeDefined();
      expect(chain?.name).toBe("Ethereum");
    });

    it("should return undefined for unknown chain", () => {
      const config = createFhevmConfig({
        chains: [{ id: 1, name: "Ethereum", network: "mainnet", isMock: false }],
        transports: { 1: mockTransport },
      });

      expect(config.getChain(999)).toBeUndefined();
    });

    it("should detect mock chains", () => {
      const config = createFhevmConfig({
        chains: [
          { id: 1, name: "Ethereum", network: "mainnet", isMock: false },
          { id: 31337, name: "Hardhat", network: "hardhat", isMock: true, rpcUrl: "http://localhost:8545" },
        ],
        transports: {
          1: mockTransport,
          31337: mockTransport,
        },
      });

      expect(config.isMockChain(1)).toBe(false);
      expect(config.isMockChain(31337)).toBe(true);
    });

    it("should get mock RPC URL", () => {
      const config = createFhevmConfig({
        chains: [
          { id: 31337, name: "Hardhat", network: "hardhat", isMock: true, rpcUrl: "http://localhost:8545" },
        ],
        transports: {
          31337: mockTransport,
        },
      });

      expect(config.getMockRpcUrl(31337)).toBe("http://localhost:8545");
    });
  });
});
