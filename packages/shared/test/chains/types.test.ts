import { describe, it, expect } from "vitest";
import { isMockChain, isProductionChain } from "../../src/chains/types.js";
import type { FhevmChain, FhevmMockChain, FhevmProductionChain } from "../../src/chains/types.js";

describe("isMockChain", () => {
  it("should return true for valid mock chains", () => {
    const mockChain: FhevmMockChain = {
      id: 31337,
      name: "Hardhat",
      network: "hardhat",
      isMock: true,
      rpcUrl: "http://127.0.0.1:8545",
    };

    expect(isMockChain(mockChain)).toBe(true);
  });

  it("should return false for production chains", () => {
    const prodChain: FhevmProductionChain = {
      id: 11155111,
      name: "Sepolia",
      network: "sepolia",
      isMock: false,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.example.com",
      kmsVerifierAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      inputVerifierAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
      relayerUrl: "https://relayer.example.com",
    };

    expect(isMockChain(prodChain)).toBe(false);
  });

  it("should return false for chains with isMock=true but missing rpcUrl", () => {
    const invalidChain: FhevmChain = {
      id: 31337,
      name: "Invalid",
      network: "invalid",
      isMock: true,
      // Missing rpcUrl
    };

    expect(isMockChain(invalidChain)).toBe(false);
  });

  it("should return false for chains with isMock=false", () => {
    const chain: FhevmChain = {
      id: 1,
      name: "Test",
      network: "test",
      isMock: false,
      rpcUrl: "http://localhost:8545", // Has rpcUrl but isMock is false
    };

    expect(isMockChain(chain)).toBe(false);
  });
});

describe("isProductionChain", () => {
  it("should return true for valid production chains", () => {
    const prodChain: FhevmProductionChain = {
      id: 11155111,
      name: "Sepolia",
      network: "sepolia",
      isMock: false,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.sepolia.zama.ai",
      kmsVerifierAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      inputVerifierAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
      relayerUrl: "https://relayer.sepolia.zama.ai",
    };

    expect(isProductionChain(prodChain)).toBe(true);
  });

  it("should return false for mock chains", () => {
    const mockChain: FhevmMockChain = {
      id: 31337,
      name: "Hardhat",
      network: "hardhat",
      isMock: true,
      rpcUrl: "http://127.0.0.1:8545",
    };

    expect(isProductionChain(mockChain)).toBe(false);
  });

  it("should return false for chains with isMock=false but missing required fields", () => {
    const invalidChain: FhevmChain = {
      id: 1,
      name: "Invalid",
      network: "invalid",
      isMock: false,
      // Missing aclAddress, gatewayUrl, etc.
    };

    expect(isProductionChain(invalidChain)).toBe(false);
  });

  it("should return false for chains missing aclAddress", () => {
    const chain: FhevmChain = {
      id: 1,
      name: "Test",
      network: "test",
      isMock: false,
      gatewayUrl: "https://gateway.example.com",
      // Missing aclAddress
    };

    expect(isProductionChain(chain)).toBe(false);
  });

  it("should return false for chains missing gatewayUrl", () => {
    const chain: FhevmChain = {
      id: 1,
      name: "Test",
      network: "test",
      isMock: false,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      // Missing gatewayUrl
    };

    expect(isProductionChain(chain)).toBe(false);
  });

  it("should return false for chains with isMock=true", () => {
    const chain: FhevmChain = {
      id: 1,
      name: "Test",
      network: "test",
      isMock: true,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.example.com",
    };

    expect(isProductionChain(chain)).toBe(false);
  });
});

describe("type guards together", () => {
  it("should be mutually exclusive for properly formed chains", () => {
    const mockChain: FhevmMockChain = {
      id: 31337,
      name: "Mock",
      network: "mock",
      isMock: true,
      rpcUrl: "http://localhost:8545",
    };

    const prodChain: FhevmProductionChain = {
      id: 1,
      name: "Prod",
      network: "prod",
      isMock: false,
      aclAddress: "0x1234567890abcdef1234567890abcdef12345678",
      gatewayUrl: "https://gateway.example.com",
      kmsVerifierAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      inputVerifierAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
      relayerUrl: "https://relayer.example.com",
    };

    // Mock chain should only match isMockChain
    expect(isMockChain(mockChain)).toBe(true);
    expect(isProductionChain(mockChain)).toBe(false);

    // Production chain should only match isProductionChain
    expect(isMockChain(prodChain)).toBe(false);
    expect(isProductionChain(prodChain)).toBe(true);
  });
});
