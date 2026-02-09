import { describe, it, expect } from "vitest";
import { detectProvider } from "../../src/providers/detect.js";

describe("detectProvider", () => {
  describe("unsupported provider types", () => {
    it("should throw for EIP-1193 providers", () => {
      const mockEip1193 = {
        request: () => Promise.resolve(),
      };

      expect(() => detectProvider(mockEip1193)).toThrow(
        "EIP-1193 providers are not yet supported"
      );
    });

    it("should throw for RPC URL strings", () => {
      expect(() => detectProvider("https://eth.llamarpc.com")).toThrow(
        "RPC URLs are not yet supported"
      );
    });

    it("should throw for null", () => {
      expect(() => detectProvider(null)).toThrow("Unable to detect provider type");
    });

    it("should throw for undefined", () => {
      expect(() => detectProvider(undefined)).toThrow("Unable to detect provider type");
    });

    it("should throw for numbers", () => {
      expect(() => detectProvider(123)).toThrow("Unable to detect provider type");
    });

    it("should throw for plain objects", () => {
      expect(() => detectProvider({})).toThrow("Unable to detect provider type");
    });

    it("should throw for arrays", () => {
      expect(() => detectProvider([])).toThrow("Unable to detect provider type");
    });
  });
});
