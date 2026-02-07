import { describe, it, expect } from "vitest";
import {
  defineChain,
  defineMockChain,
  defineProductionChain,
} from "../../src/chains/defineChain.js";
import type { FhevmChain, FhevmMockChain, FhevmProductionChain } from "../../src/chains/types.js";

describe("defineChain", () => {
  it("should return the exact same chain object", () => {
    const chain: FhevmChain = {
      id: 12345,
      name: "Test Chain",
      network: "test",
      isMock: false,
    };

    const result = defineChain(chain);
    expect(result).toBe(chain); // Exact same reference
    expect(result).toEqual(chain);
  });

  it("should preserve all chain properties", () => {
    const chain: FhevmChain = {
      id: 1,
      name: "Ethereum",
      network: "mainnet",
      isMock: false,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.example.com",
    };

    const result = defineChain(chain);
    expect(result.id).toBe(1);
    expect(result.name).toBe("Ethereum");
    expect(result.network).toBe("mainnet");
    expect(result.aclAddress).toBe("0x1234567890abcdef1234567890abcdef12345678");
  });
});

describe("defineMockChain", () => {
  it("should set isMock to true", () => {
    const result = defineMockChain({
      id: 31337,
      name: "Hardhat",
      network: "hardhat",
      rpcUrl: "http://127.0.0.1:8545",
    });

    expect(result.isMock).toBe(true);
  });

  it("should preserve all provided properties", () => {
    const result = defineMockChain({
      id: 31337,
      name: "Hardhat Local",
      network: "hardhat",
      rpcUrl: "http://127.0.0.1:8545",
      aclAddress: "0x0000000000000000000000000000000000000000",
    });

    expect(result.id).toBe(31337);
    expect(result.name).toBe("Hardhat Local");
    expect(result.network).toBe("hardhat");
    expect(result.rpcUrl).toBe("http://127.0.0.1:8545");
    expect(result.aclAddress).toBe("0x0000000000000000000000000000000000000000");
    expect(result.isMock).toBe(true);
  });

  it("should return a valid FhevmMockChain type", () => {
    const result: FhevmMockChain = defineMockChain({
      id: 31337,
      name: "Test",
      network: "test",
      rpcUrl: "http://localhost:8545",
    });

    // TypeScript should enforce these at compile time
    expect(result.isMock).toBe(true);
    expect(typeof result.rpcUrl).toBe("string");
  });
});

describe("defineProductionChain", () => {
  it("should set isMock to false", () => {
    const result = defineProductionChain({
      id: 11155111,
      name: "Sepolia",
      network: "sepolia",
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.sepolia.zama.ai",
      kmsVerifierAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      inputVerifierAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
      relayerUrl: "https://relayer.sepolia.zama.ai",
    });

    expect(result.isMock).toBe(false);
  });

  it("should preserve all required production chain properties", () => {
    const result = defineProductionChain({
      id: 11155111,
      name: "Sepolia Testnet",
      network: "sepolia",
      aclAddress: "0x1111111111111111111111111111111111111111",
      gatewayUrl: "https://gateway.example.com",
      kmsVerifierAddress: "0x2222222222222222222222222222222222222222",
      inputVerifierAddress: "0x3333333333333333333333333333333333333333",
      relayerUrl: "https://relayer.example.com",
    });

    expect(result.id).toBe(11155111);
    expect(result.name).toBe("Sepolia Testnet");
    expect(result.network).toBe("sepolia");
    expect(result.aclAddress).toBe("0x1111111111111111111111111111111111111111");
    expect(result.gatewayUrl).toBe("https://gateway.example.com");
    expect(result.kmsVerifierAddress).toBe("0x2222222222222222222222222222222222222222");
    expect(result.inputVerifierAddress).toBe("0x3333333333333333333333333333333333333333");
    expect(result.relayerUrl).toBe("https://relayer.example.com");
    expect(result.isMock).toBe(false);
  });

  it("should return a valid FhevmProductionChain type", () => {
    const result: FhevmProductionChain = defineProductionChain({
      id: 1,
      name: "Production",
      network: "prod",
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.example.com",
      kmsVerifierAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      inputVerifierAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
      relayerUrl: "https://relayer.example.com",
    });

    // TypeScript should enforce these at compile time
    expect(result.isMock).toBe(false);
    expect(typeof result.aclAddress).toBe("string");
    expect(typeof result.gatewayUrl).toBe("string");
  });
});

describe("chain definition helpers comparison", () => {
  it("should create mock chains with isMock=true", () => {
    const mockChain = defineMockChain({
      id: 31337,
      name: "Mock",
      network: "mock",
      rpcUrl: "http://localhost:8545",
    });

    expect(mockChain.isMock).toBe(true);
  });

  it("should create production chains with isMock=false", () => {
    const prodChain = defineProductionChain({
      id: 1,
      name: "Prod",
      network: "prod",
      aclAddress: "0x0000000000000000000000000000000000000000",
      gatewayUrl: "https://gateway.example.com",
      kmsVerifierAddress: "0x1111111111111111111111111111111111111111",
      inputVerifierAddress: "0x2222222222222222222222222222222222222222",
      relayerUrl: "https://relayer.example.com",
    });

    expect(prodChain.isMock).toBe(false);
  });
});
