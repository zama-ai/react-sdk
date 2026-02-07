import { describe, it, expect } from "vitest";
import {
  isAddress,
  assertAddress,
  isBigInt,
  isValidChainId,
  assertChainId,
} from "../../src/utils/validation.js";

describe("Validation utilities", () => {
  describe("isAddress", () => {
    it("should return true for valid addresses", () => {
      expect(isAddress("0x1234567890123456789012345678901234567890")).toBe(true);
      expect(isAddress("0xAbCdEf1234567890123456789012345678901234")).toBe(true);
      expect(isAddress("0x0000000000000000000000000000000000000000")).toBe(true);
      expect(isAddress("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")).toBe(true);
    });

    it("should return false for invalid addresses", () => {
      expect(isAddress("0x123")).toBe(false); // Too short
      expect(isAddress("0x12345678901234567890123456789012345678901")).toBe(false); // Too long
      expect(isAddress("1234567890123456789012345678901234567890")).toBe(false); // Missing 0x
      expect(isAddress("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")).toBe(false); // Invalid hex
      expect(isAddress("")).toBe(false); // Empty string
      expect(isAddress(null)).toBe(false); // Null
      expect(isAddress(undefined)).toBe(false); // Undefined
      expect(isAddress(123)).toBe(false); // Number
      expect(isAddress({})).toBe(false); // Object
      expect(isAddress([])).toBe(false); // Array
    });

    it("should return false for addresses with special characters", () => {
      expect(isAddress("0x1234567890123456789012345678901234567890!")).toBe(false);
      expect(isAddress("0x 1234567890123456789012345678901234567890")).toBe(false);
    });
  });

  describe("assertAddress", () => {
    it("should not throw for valid addresses", () => {
      expect(() => assertAddress("0x1234567890123456789012345678901234567890")).not.toThrow();
    });

    it("should throw for invalid addresses", () => {
      expect(() => assertAddress("0x123")).toThrow("Invalid address");
      expect(() => assertAddress(null)).toThrow("Invalid address");
      expect(() => assertAddress(undefined)).toThrow("Invalid address");
      expect(() => assertAddress(123)).toThrow("Invalid address");
    });

    it("should use custom field name in error message", () => {
      expect(() => assertAddress("invalid", "contractAddress")).toThrow(
        "Invalid contractAddress"
      );
      expect(() => assertAddress("0x123", "recipient")).toThrow("Invalid recipient");
    });

    it("should include the invalid value in error message", () => {
      expect(() => assertAddress("0x123")).toThrow("0x123");
      expect(() => assertAddress(null)).toThrow("null");
    });
  });

  describe("isBigInt", () => {
    it("should return true for bigint values", () => {
      expect(isBigInt(0n)).toBe(true);
      expect(isBigInt(123n)).toBe(true);
      expect(isBigInt(-456n)).toBe(true);
      expect(isBigInt(BigInt(999))).toBe(true);
      expect(isBigInt(BigInt("12345678901234567890"))).toBe(true);
    });

    it("should return false for non-bigint values", () => {
      expect(isBigInt(0)).toBe(false);
      expect(isBigInt(123)).toBe(false);
      expect(isBigInt("123n")).toBe(false);
      expect(isBigInt("123")).toBe(false);
      expect(isBigInt(null)).toBe(false);
      expect(isBigInt(undefined)).toBe(false);
      expect(isBigInt({})).toBe(false);
      expect(isBigInt([])).toBe(false);
      expect(isBigInt(true)).toBe(false);
    });
  });

  describe("isValidChainId", () => {
    it("should return true for valid chain IDs", () => {
      expect(isValidChainId(1)).toBe(true);
      expect(isValidChainId(11155111)).toBe(true);
      expect(isValidChainId(31337)).toBe(true);
      expect(isValidChainId(999999)).toBe(true);
    });

    it("should return false for invalid chain IDs", () => {
      expect(isValidChainId(0)).toBe(false); // Zero
      expect(isValidChainId(-1)).toBe(false); // Negative
      expect(isValidChainId(1.5)).toBe(false); // Decimal
      expect(isValidChainId(NaN)).toBe(false); // NaN
      expect(isValidChainId(Infinity)).toBe(false); // Infinity
      expect(isValidChainId("1")).toBe(false); // String
      expect(isValidChainId(null)).toBe(false); // Null
      expect(isValidChainId(undefined)).toBe(false); // Undefined
      expect(isValidChainId({})).toBe(false); // Object
      expect(isValidChainId([])).toBe(false); // Array
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
      expect(() => assertChainId(undefined)).toThrow("Invalid chain ID");
    });

    it("should include the invalid value in error message", () => {
      expect(() => assertChainId(0)).toThrow("0");
      expect(() => assertChainId(-1)).toThrow("-1");
      expect(() => assertChainId(null)).toThrow("null");
    });
  });
});
