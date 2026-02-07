import { describe, it, expect } from "vitest";
import {
  encodeFunctionCall,
  decodeFunctionResult,
  SELECTORS,
  ZERO_HASH,
  UNWRAP_REQUESTED_TOPIC,
} from "../src/internal/abi";

describe("abi", () => {
  describe("SELECTORS", () => {
    it("should have correct approve selector", () => {
      // keccak256("approve(address,uint256)") first 4 bytes = 0x095ea7b3
      expect(SELECTORS["approve(address,uint256)"]).toBe("0x095ea7b3");
    });

    it("should have correct allowance selector", () => {
      // keccak256("allowance(address,address)") first 4 bytes = 0xdd62ed3e
      expect(SELECTORS["allowance(address,address)"]).toBe("0xdd62ed3e");
    });

    it("should have correct confidentialTransfer selector", () => {
      expect(SELECTORS["confidentialTransfer(address,bytes32,bytes)"]).toBe("0x2fb74e62");
    });

    it("should have correct confidentialBalanceOf selector", () => {
      expect(SELECTORS["confidentialBalanceOf(address)"]).toBe("0x344ff101");
    });

    it("should have correct underlying selector", () => {
      expect(SELECTORS["underlying()"]).toBe("0x6f307dc3");
    });

    it("should have correct wrap selector", () => {
      expect(SELECTORS["wrap(address,uint256)"]).toBe("0xbf376c7a");
    });

    it("should have correct unwrap selector", () => {
      expect(SELECTORS["unwrap(address,address,bytes32,bytes)"]).toBe("0x5bf4ef06");
    });

    it("should have correct finalizeUnwrap selector", () => {
      expect(SELECTORS["finalizeUnwrap(bytes32,uint64,bytes)"]).toBe("0x5bb67a05");
    });
  });

  describe("ZERO_HASH", () => {
    it("should be 32 zero bytes", () => {
      expect(ZERO_HASH).toBe("0x" + "00".repeat(32));
      expect(ZERO_HASH.length).toBe(66); // 0x + 64 hex chars
    });
  });

  describe("UNWRAP_REQUESTED_TOPIC", () => {
    it("should be a valid 32-byte hex string", () => {
      expect(UNWRAP_REQUESTED_TOPIC).toMatch(/^0x[a-f0-9]{64}$/);
    });
  });

  describe("encodeFunctionCall", () => {
    it("should encode approve(address,uint256)", () => {
      const result = encodeFunctionCall("approve(address,uint256)", [
        "0x1234567890123456789012345678901234567890" as `0x${string}`,
        1000n,
      ]);

      // Should start with the selector
      expect(result.startsWith("0x095ea7b3")).toBe(true);
      // Should have selector (8 chars) + 2 params (64 chars each) = 136 hex chars + 0x = 138
      expect(result.length).toBe(2 + 8 + 128);
    });

    it("should encode allowance(address,address)", () => {
      const result = encodeFunctionCall("allowance(address,address)", [
        "0x1111111111111111111111111111111111111111" as `0x${string}`,
        "0x2222222222222222222222222222222222222222" as `0x${string}`,
      ]);

      expect(result.startsWith("0xdd62ed3e")).toBe(true);
      expect(result.length).toBe(2 + 8 + 128);
    });

    it("should encode underlying() with no args", () => {
      const result = encodeFunctionCall("underlying()", []);
      expect(result).toBe("0x6f307dc3");
    });

    it("should encode confidentialBalanceOf(address)", () => {
      const result = encodeFunctionCall("confidentialBalanceOf(address)", [
        "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd" as `0x${string}`,
      ]);

      expect(result.startsWith("0x344ff101")).toBe(true);
      expect(result.length).toBe(2 + 8 + 64);
    });

    it("should encode wrap(address,uint256)", () => {
      const result = encodeFunctionCall("wrap(address,uint256)", [
        "0x1234567890123456789012345678901234567890" as `0x${string}`,
        10n ** 18n,
      ]);

      expect(result.startsWith("0xbf376c7a")).toBe(true);
      expect(result.length).toBe(2 + 8 + 128);
    });

    it("should encode confidentialTransfer with dynamic bytes", () => {
      const result = encodeFunctionCall("confidentialTransfer(address,bytes32,bytes)", [
        "0x1234567890123456789012345678901234567890" as `0x${string}`,
        ("0x" + "aa".repeat(32)) as `0x${string}`,
        new Uint8Array([1, 2, 3, 4]),
      ]);

      expect(result.startsWith("0x2fb74e62")).toBe(true);
      // Has dynamic bytes, so includes offset + length + padded data
      expect(result.length).toBeGreaterThan(2 + 8 + 192);
    });
  });

  describe("decodeFunctionResult", () => {
    it("should decode address", () => {
      const data = ("0x" + "00".repeat(12) + "abcdefabcdefabcdefabcdefabcdefabcdefabcd") as `0x${string}`;
      const result = decodeFunctionResult("address", data);
      expect(result).toBe("0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");
    });

    it("should decode uint256", () => {
      const data = ("0x" + "00".repeat(31) + "0a") as `0x${string}`;
      const result = decodeFunctionResult("uint256", data);
      expect(result).toBe(10n);
    });

    it("should decode large uint256", () => {
      // 1e18 = 0xDE0B6B3A7640000
      const data = ("0x" + "0".repeat(49) + "DE0B6B3A7640000") as `0x${string}`;
      const result = decodeFunctionResult("uint256", data);
      expect(result).toBe(10n ** 18n);
    });

    it("should decode bytes32", () => {
      const data = ("0x" + "ff".repeat(32)) as `0x${string}`;
      const result = decodeFunctionResult("bytes32", data);
      expect(result).toBe("0x" + "ff".repeat(32));
    });

    it("should decode bool true", () => {
      const data = ("0x" + "00".repeat(31) + "01") as `0x${string}`;
      const result = decodeFunctionResult("bool", data);
      expect(result).toBe(true);
    });

    it("should decode bool false", () => {
      const data = ("0x" + "00".repeat(32)) as `0x${string}`;
      const result = decodeFunctionResult("bool", data);
      expect(result).toBe(false);
    });

    it("should throw on unsupported type", () => {
      const data = "0x00" as `0x${string}`;
      expect(() => decodeFunctionResult("tuple", data)).toThrow("Unsupported return type");
    });
  });
});
