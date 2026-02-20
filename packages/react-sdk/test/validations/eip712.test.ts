import { describe, it, expect } from "vitest";
import {
  isEIP712,
  isEIP712Domain,
  isMessage,
  isTypedDataTypes,
} from "../../src/internal/validations/eip712";

describe("validator/eip712", () => {
  describe("isEIP712", () => {
    // from https://eips.ethereum.org/assets/eip-712/Example.js
    const examplePayload = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
        verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
      },
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    };
    it("should validate a example eip712", () => {
      expect(isEIP712(examplePayload)).toBe(true);
    });
  });
  describe("isMessage", () => {
    it("should validate any message", () => {
      expect(isMessage({ hello: 1 })).toBe(true);
    });
  });

  describe("isEIP712Domain", () => {
    it("should match if any prop", () => {
      expect(isEIP712Domain({ name: "hello" })).toBe(true);
      expect(isEIP712Domain({ version: "1" })).toBe(true);
      expect(isEIP712Domain({ chainId: 42 })).toBe(true);
      expect(
        isEIP712Domain({ verifyingContract: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" })
      ).toBe(true);
      expect(isEIP712Domain({ salt: "0xab" })).toBe(true);
    });
    it("should not match if empty or wrong prop", () => {
      expect(isEIP712Domain({})).toBe(false);
      expect(isEIP712Domain({ anything: false })).toBe(false);
      expect(isEIP712Domain({ version: 42 })).toBe(false); // should be string
      expect(isEIP712Domain({ chainId: "choucroute" })).toBe(false);
    });
  });

  describe("isTypedDataTypes", () => {
    // these tests are inferred from
    // https://github.com/wevm/abitype/blob/main/packages/abitype/src/zod.test.ts
    it("should invalidate incorrect types", () => {
      const selfReference = {
        Name: [
          { name: "first", type: "Name" },
          { name: "last", type: "string" },
        ],
      };

      const circularReference = {
        Foo: [{ name: "bar", type: "Bar" }],
        Bar: [{ name: "foo", type: "Foo" }],
      };

      const unknowType = {
        Name: [
          { name: "first", type: "Foo" },
          { name: "last", type: "string" },
        ],
      };

      expect(isTypedDataTypes(selfReference)).toBe(false);
      expect(isTypedDataTypes(circularReference)).toBe(false);
      expect(isTypedDataTypes(unknowType)).toBe(false);
    });
    it("should validate correct types", () => {
      const single = {
        Contributor: [
          { name: "name", type: "string" },
          { name: "address", type: "address" },
        ],
      };

      const nested = {
        Contributor: [
          { name: "name", type: "string" },
          { name: "address", type: "address" },
        ],
        Website: [
          { name: "domain", type: "string" },
          { name: "webmaster", type: "Contributor" },
        ],
      };

      const deeplyNested = {
        Contributor: [
          { name: "name", type: "string" },
          { name: "address", type: "address" },
        ],
        Website: [
          { name: "domain", type: "string" },
          { name: "webmaster", type: "Contributor" },
        ],
        Project: [
          { name: "name", type: "string" },
          { name: "contributors", type: "Contributor[2]" },
          { name: "website", type: "Website" },
        ],
        Organization: [
          { name: "name", type: "string" },
          { name: "projects", type: "Project[]" },
          { name: "website", type: "Website" },
        ],
      };

      expect(isTypedDataTypes(single)).toBe(true);
      expect(isTypedDataTypes(nested)).toBe(true);
      expect(isTypedDataTypes(deeplyNested)).toBe(true);
    });
  });
});
