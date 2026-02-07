import { describe, it, expect } from "vitest";
import { sepolia } from "../../src/chains/sepolia.js";
import { hardhatLocal } from "../../src/chains/hardhat.js";
import {
  defineChain,
  defineMockChain,
  defineProductionChain,
} from "../../src/chains/defineChain.js";

describe("Chain configurations", () => {
  describe("sepolia", () => {
    it("should have correct chain ID", () => {
      expect(sepolia.id).toBe(11155111);
    });

    it("should have correct name", () => {
      expect(sepolia.name).toBe("Sepolia");
    });

    it("should have correct network", () => {
      expect(sepolia.network).toBe("sepolia");
    });

    it("should not be a mock chain", () => {
      expect(sepolia.isMock).toBe(false);
    });

    it("should have ACL address", () => {
      expect(sepolia.aclAddress).toBeDefined();
      expect(sepolia.aclAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    it("should have gateway URL", () => {
      expect(sepolia.gatewayUrl).toBeDefined();
      expect(sepolia.gatewayUrl).toContain("gateway.sepolia.zama.ai");
    });

    it("should have KMS verifier address", () => {
      expect(sepolia.kmsVerifierAddress).toBeDefined();
      expect(sepolia.kmsVerifierAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    it("should have input verifier address", () => {
      expect(sepolia.inputVerifierAddress).toBeDefined();
      expect(sepolia.inputVerifierAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    it("should have relayer URL", () => {
      expect(sepolia.relayerUrl).toBeDefined();
      expect(sepolia.relayerUrl).toContain("relayer.sepolia.zama.ai");
    });
  });

  describe("hardhatLocal", () => {
    it("should have correct chain ID", () => {
      expect(hardhatLocal.id).toBe(31337);
    });

    it("should have correct name", () => {
      expect(hardhatLocal.name).toBe("Hardhat Local");
    });

    it("should have correct network", () => {
      expect(hardhatLocal.network).toBe("hardhat");
    });

    it("should be a mock chain", () => {
      expect(hardhatLocal.isMock).toBe(true);
    });

    it("should have RPC URL", () => {
      expect(hardhatLocal.rpcUrl).toBeDefined();
      expect(hardhatLocal.rpcUrl).toBe("http://127.0.0.1:8545");
    });

    it("should not have production-only fields", () => {
      const mockChain = hardhatLocal as any;
      expect(mockChain.aclAddress).toBeUndefined();
      expect(mockChain.gatewayUrl).toBeUndefined();
      expect(mockChain.kmsVerifierAddress).toBeUndefined();
      expect(mockChain.inputVerifierAddress).toBeUndefined();
      expect(mockChain.relayerUrl).toBeUndefined();
    });
  });

  describe("defineChain", () => {
    it("should return the same chain object", () => {
      const customChain = {
        id: 123,
        name: "Custom Chain",
        network: "custom",
        isMock: false,
        aclAddress: "0x1234567890123456789012345678901234567890",
        gatewayUrl: "https://gateway.custom.com",
        kmsVerifierAddress: "0x2234567890123456789012345678901234567890",
        inputVerifierAddress: "0x3234567890123456789012345678901234567890",
        relayerUrl: "https://relayer.custom.com",
      };

      const result = defineChain(customChain);
      expect(result).toBe(customChain);
      expect(result).toEqual(customChain);
    });

    it("should preserve all chain properties", () => {
      const customChain = {
        id: 456,
        name: "Test Chain",
        network: "test",
        isMock: true,
        rpcUrl: "http://localhost:9545",
      };

      const result = defineChain(customChain);
      expect(result.id).toBe(456);
      expect(result.name).toBe("Test Chain");
      expect(result.network).toBe("test");
      expect(result.isMock).toBe(true);
      expect(result.rpcUrl).toBe("http://localhost:9545");
    });
  });

  describe("defineMockChain", () => {
    it("should add isMock: true to chain", () => {
      const chain = defineMockChain({
        id: 789,
        name: "Mock Test",
        network: "mocktest",
        rpcUrl: "http://localhost:7545",
      });

      expect(chain.isMock).toBe(true);
      expect(chain.id).toBe(789);
      expect(chain.name).toBe("Mock Test");
      expect(chain.network).toBe("mocktest");
      expect(chain.rpcUrl).toBe("http://localhost:7545");
    });

    it("should return a new object", () => {
      const input = {
        id: 100,
        name: "Original",
        network: "original",
        rpcUrl: "http://localhost:8545",
      };

      const result = defineMockChain(input);
      expect(result).not.toBe(input);
      expect(result.id).toBe(input.id);
    });
  });

  describe("defineProductionChain", () => {
    it("should add isMock: false to chain", () => {
      const chain = defineProductionChain({
        id: 999,
        name: "Production Test",
        network: "prodtest",
        aclAddress: "0x1111111111111111111111111111111111111111",
        gatewayUrl: "https://gateway.prod.com",
        kmsVerifierAddress: "0x2222222222222222222222222222222222222222",
        inputVerifierAddress: "0x3333333333333333333333333333333333333333",
        relayerUrl: "https://relayer.prod.com",
      });

      expect(chain.isMock).toBe(false);
      expect(chain.id).toBe(999);
      expect(chain.name).toBe("Production Test");
      expect(chain.aclAddress).toBe("0x1111111111111111111111111111111111111111");
    });

    it("should return a new object", () => {
      const input = {
        id: 200,
        name: "Original Production",
        network: "original-prod",
        aclAddress: "0x4444444444444444444444444444444444444444",
        gatewayUrl: "https://gateway.test.com",
        kmsVerifierAddress: "0x5555555555555555555555555555555555555555",
        inputVerifierAddress: "0x6666666666666666666666666666666666666666",
        relayerUrl: "https://relayer.test.com",
      };

      const result = defineProductionChain(input);
      expect(result).not.toBe(input);
      expect(result.id).toBe(input.id);
    });
  });
});
