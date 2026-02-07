import { describe, it, expect } from "vitest";
import { formatConfidentialAmount } from "../../src/utils/format.js";

describe("formatConfidentialAmount", () => {
  describe("basic formatting", () => {
    it("should format zero", () => {
      expect(formatConfidentialAmount(0n, 6)).toBe("0");
      expect(formatConfidentialAmount(0n, 18)).toBe("0");
    });

    it("should format whole numbers (no decimals)", () => {
      expect(formatConfidentialAmount(1000000n, 6)).toBe("1");
      expect(formatConfidentialAmount(5000000n, 6)).toBe("5");
      expect(formatConfidentialAmount(1000000000000000000n, 18)).toBe("1");
    });

    it("should format numbers with decimals", () => {
      expect(formatConfidentialAmount(1500000n, 6)).toBe("1.5");
      expect(formatConfidentialAmount(4250000n, 6)).toBe("4.25");
      expect(formatConfidentialAmount(123456n, 6)).toBe("0.123456");
    });
  });

  describe("decimal trimming", () => {
    it("should trim trailing zeros", () => {
      expect(formatConfidentialAmount(1100000n, 6)).toBe("1.1");
      expect(formatConfidentialAmount(2000000n, 6)).toBe("2");
      expect(formatConfidentialAmount(1230000n, 6)).toBe("1.23");
    });

    it("should respect maxDisplayDecimals", () => {
      expect(formatConfidentialAmount(1234567n, 6, 2)).toBe("1.23");
      expect(formatConfidentialAmount(1234567n, 6, 4)).toBe("1.2345");
      expect(formatConfidentialAmount(1999999n, 6, 2)).toBe("1.99");
    });
  });

  describe("small amounts", () => {
    it("should format very small amounts", () => {
      expect(formatConfidentialAmount(1n, 6)).toBe("0.000001");
      expect(formatConfidentialAmount(10n, 6)).toBe("0.00001");
      expect(formatConfidentialAmount(100n, 6)).toBe("0.0001");
    });

    it("should show '<0.00001' for amounts too small to display", () => {
      expect(formatConfidentialAmount(1n, 18, 6)).toBe("<0.000001");
      expect(formatConfidentialAmount(5n, 18, 4)).toBe("<0.0001");
    });
  });

  describe("large amounts", () => {
    it("should format large whole numbers", () => {
      expect(formatConfidentialAmount(1000000000n, 6)).toBe("1000");
      expect(formatConfidentialAmount(1000000000000n, 6)).toBe("1000000");
    });

    it("should format large numbers with decimals", () => {
      expect(formatConfidentialAmount(1234567890n, 6)).toBe("1234.56789");
      expect(formatConfidentialAmount(9876543210n, 6)).toBe("9876.54321");
    });
  });

  describe("different decimal places", () => {
    it("should handle USDC-style (6 decimals)", () => {
      expect(formatConfidentialAmount(4000000n, 6)).toBe("4");
      expect(formatConfidentialAmount(1500000n, 6)).toBe("1.5");
    });

    it("should handle ETH-style (18 decimals)", () => {
      expect(formatConfidentialAmount(1000000000000000000n, 18)).toBe("1");
      expect(formatConfidentialAmount(1500000000000000000n, 18)).toBe("1.5");
      expect(formatConfidentialAmount(123456789012345678n, 18)).toBe("0.123456");
    });

    it("should handle custom decimals", () => {
      expect(formatConfidentialAmount(1000n, 2)).toBe("10");
      expect(formatConfidentialAmount(150n, 2)).toBe("1.5");
      expect(formatConfidentialAmount(100000000n, 8)).toBe("1");
    });
  });

  describe("edge cases", () => {
    it("should handle amounts equal to decimal divisor", () => {
      expect(formatConfidentialAmount(1000000n, 6)).toBe("1");
      expect(formatConfidentialAmount(1000000000000000000n, 18)).toBe("1");
    });

    it("should handle amounts just below decimal divisor", () => {
      expect(formatConfidentialAmount(999999n, 6)).toBe("0.999999");
      expect(formatConfidentialAmount(500000n, 6)).toBe("0.5");
    });

    it("should handle single unit amounts", () => {
      expect(formatConfidentialAmount(1n, 6)).toBe("0.000001");
      expect(formatConfidentialAmount(1n, 18)).toBe("<0.000001"); // Too small with default maxDisplayDecimals
    });
  });

  describe("real-world examples", () => {
    it("should format USDC amounts correctly", () => {
      expect(formatConfidentialAmount(4000000n, 6)).toBe("4"); // $4.00
      expect(formatConfidentialAmount(1500000n, 6)).toBe("1.5"); // $1.50
      expect(formatConfidentialAmount(999999n, 6)).toBe("0.999999"); // $0.999999
    });

    it("should format ETH amounts correctly", () => {
      expect(formatConfidentialAmount(2500000000000000000n, 18)).toBe("2.5"); // 2.5 ETH
      expect(formatConfidentialAmount(100000000000000n, 18)).toBe("0.0001"); // 0.0001 ETH
    });
  });
});
