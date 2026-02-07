import { describe, it, expect } from "vitest";
import { detectAndWrapProvider } from "../../src/providers/detect.js";

describe("detectAndWrapProvider", () => {
  describe("unsupported provider types", () => {
    it("should throw for EIP-1193 providers", () => {
      const mockEip1193 = {
        request: () => Promise.resolve(),
      };

      expect(() => detectAndWrapProvider(mockEip1193)).toThrow(
        "EIP-1193 providers are not yet supported"
      );
    });

    it("should throw for RPC URL strings", () => {
      expect(() => detectAndWrapProvider("https://eth.llamarpc.com")).toThrow(
        "RPC URLs are not yet supported"
      );
    });

    it("should throw for null", () => {
      expect(() => detectAndWrapProvider(null)).toThrow("Unable to detect provider type");
    });

    it("should throw for undefined", () => {
      expect(() => detectAndWrapProvider(undefined)).toThrow("Unable to detect provider type");
    });

    it("should throw for numbers", () => {
      expect(() => detectAndWrapProvider(123)).toThrow("Unable to detect provider type");
    });

    it("should throw for plain objects", () => {
      expect(() => detectAndWrapProvider({})).toThrow("Unable to detect provider type");
    });

    it("should throw for arrays", () => {
      expect(() => detectAndWrapProvider([])).toThrow("Unable to detect provider type");
    });
  });
});
