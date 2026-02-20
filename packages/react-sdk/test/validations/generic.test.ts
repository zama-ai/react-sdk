import { describe, it, expect } from "vitest";
import { isAddress, isIdentifier, isSolidityType } from "../../src/internal/validations/generic";

describe("validator/generic", () => {
  describe("isAddress", () => {
    it("should validate a correct address", () => {
      expect(isAddress("0x0000000000000000000000000000000000000001")).toBe(true);
    });
    it("should invalidate an incorrect address", () => {
      expect(isAddress("0x095ea7b3")).toBe(false);
      expect(isAddress("choucroute")).toBe(false);
    });
  });
  describe("isIdentifier", () => {
    it("should validate a correct identifier", () => {
      expect(isIdentifier("myVariable")).toBe(true);
      expect(isIdentifier("$myVariable")).toBe(true);
      expect(isIdentifier("_myVariable")).toBe(true);
    });
    it("should invalidate an incorrect identifier", () => {
      expect(isIdentifier("123abc")).toBe(false);
      expect(isIdentifier("my-variable")).toBe(false);
      expect(isIdentifier("my variable")).toBe(false);
      expect(isIdentifier("hello👋")).toBe(false);
      expect(isIdentifier("café")).toBe(false);
      expect(isIdentifier("good 運")).toBe(false);
      expect(isIdentifier('a"b')).toBe(false);
    });
  });
  describe("isSolidityType", () => {
    it("should validate correct solidity types", () => {
      expect(isSolidityType("address")).toBe(true);
      expect(isSolidityType("uint256")).toBe(true);
      expect(isSolidityType("bytes32")).toBe(true);
      expect(isSolidityType("bytes")).toBe(true);
      expect(isSolidityType("uint")).toBe(true);
    });
    it("should invalidate incorrect solidity types", () => {
      expect(isSolidityType("myType")).toBe(false);
      expect(isSolidityType("myFunction")).toBe(false);
    });
  });
});
