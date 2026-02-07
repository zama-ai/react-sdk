import { describe, it, expect } from "vitest";
import {
  isAddress,
  assertAddress,
  isBigInt,
  isValidChainId,
  assertChainId,
} from "../../src/utils/validation.js";

describe("isAddress", () => {
  it("should return true for valid addresses", () => {
    expect(isAddress("0x0000000000000000000000000000000000000000")).toBe(true);
    expect(isAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(true);
    expect(isAddress("0xABCDEF1234567890ABCDEF1234567890ABCDEF12")).toBe(true);
  });

  it("should return false for invalid addresses", () => {
    expect(isAddress("0x123")).toBe(false); // Too short
    expect(isAddress("1234567890abcdef1234567890abcdef12345678")).toBe(false); // Missing 0x
    expect(isAddress("0x1234567890abcdef1234567890abcdef1234567g")).toBe(false); // Invalid hex
    expect(isAddress("0x1234567890abcdef1234567890abcdef123456789")).toBe(false); // Too long
    expect(isAddress("")).toBe(false); // Empty string
  });

  it("should return false for non-string values", () => {
    expect(isAddress(null)).toBe(false);
    expect(isAddress(undefined)).toBe(false);
    expect(isAddress(123)).toBe(false);
    expect(isAddress({})).toBe(false);
    expect(isAddress([])).toBe(false);
  });
});

describe("assertAddress", () => {
  it("should not throw for valid addresses", () => {
    expect(() => assertAddress("0x0000000000000000000000000000000000000000")).not.toThrow();
    expect(() => assertAddress("0x1234567890abcdef1234567890abcdef12345678")).not.toThrow();
  });

  it("should throw for invalid addresses", () => {
    expect(() => assertAddress("0x123")).toThrow("Invalid address");
    expect(() => assertAddress("invalid")).toThrow("Invalid address");
    expect(() => assertAddress(null)).toThrow("Invalid address");
  });

  it("should use custom name in error message", () => {
    expect(() => assertAddress("invalid", "contractAddress")).toThrow("Invalid contractAddress");
    expect(() => assertAddress("0x123", "tokenAddress")).toThrow("Invalid tokenAddress");
  });
});

describe("isBigInt", () => {
  it("should return true for bigint values", () => {
    expect(isBigInt(0n)).toBe(true);
    expect(isBigInt(123n)).toBe(true);
    expect(isBigInt(-456n)).toBe(true);
    expect(isBigInt(BigInt(789))).toBe(true);
  });

  it("should return false for non-bigint values", () => {
    expect(isBigInt(123)).toBe(false);
    expect(isBigInt("123")).toBe(false);
    expect(isBigInt(null)).toBe(false);
    expect(isBigInt(undefined)).toBe(false);
    expect(isBigInt({})).toBe(false);
    expect(isBigInt([])).toBe(false);
  });
});

describe("isValidChainId", () => {
  it("should return true for valid chain IDs", () => {
    expect(isValidChainId(1)).toBe(true); // Mainnet
    expect(isValidChainId(11155111)).toBe(true); // Sepolia
    expect(isValidChainId(31337)).toBe(true); // Hardhat
    expect(isValidChainId(999999)).toBe(true);
  });

  it("should return false for invalid chain IDs", () => {
    expect(isValidChainId(0)).toBe(false); // Zero
    expect(isValidChainId(-1)).toBe(false); // Negative
    expect(isValidChainId(1.5)).toBe(false); // Float
    expect(isValidChainId("1")).toBe(false); // String
    expect(isValidChainId(null)).toBe(false);
    expect(isValidChainId(undefined)).toBe(false);
    expect(isValidChainId(NaN)).toBe(false);
    expect(isValidChainId(Infinity)).toBe(false);
  });
});

describe("assertChainId", () => {
  it("should not throw for valid chain IDs", () => {
    expect(() => assertChainId(1)).not.toThrow();
    expect(() => assertChainId(11155111)).not.toThrow();
    expect(() => assertChainId(31337)).not.toThrow();
  });

  it("should throw for invalid chain IDs", () => {
    expect(() => assertChainId(0)).toThrow("Invalid chain ID");
    expect(() => assertChainId(-1)).toThrow("Invalid chain ID");
    expect(() => assertChainId(1.5)).toThrow("Invalid chain ID");
    expect(() => assertChainId("1")).toThrow("Invalid chain ID");
    expect(() => assertChainId(null)).toThrow("Invalid chain ID");
  });
});
