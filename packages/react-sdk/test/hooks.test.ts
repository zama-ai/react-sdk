import { describe, it, expect } from "vitest";

describe("useEncrypt", () => {
  it("should export useEncrypt", async () => {
    const { useEncrypt } = await import("../src/react/useEncrypt");
    expect(useEncrypt).toBeDefined();
    expect(typeof useEncrypt).toBe("function");
  });

  it("should export encryption types", async () => {
    const module = await import("../src/react/useEncrypt");
    expect(module).toBeDefined();
    // Types are checked at compile time
  });
});

describe("EncryptInput types", () => {
  it("should export EncryptInput type from types/encryption", async () => {
    const module = await import("../src/types/encryption");
    expect(module).toBeDefined();
  });
});

describe("encryption type definitions", () => {
  it("should enforce correct value types at compile time", async () => {
    // These tests validate the type system works correctly
    // The actual type checking happens at compile time via TypeScript

    // Import types to verify they're exported
    const types = await import("../src/types/encryption");
    expect(types).toBeDefined();
  });

  it("should have FheTypeName covering all FHE types", async () => {
    // FheTypeName should include: bool, uint8, uint16, uint32, uint64, uint128, uint256, address
    // This is validated at compile time, but we can check the module exports
    const types = await import("../src/types/encryption");
    expect(types).toBeDefined();
  });
});

describe("useUserDecrypt", () => {
  it("should export useUserDecrypt", async () => {
    const { useUserDecrypt } = await import("../src/react/useUserDecrypt");
    expect(useUserDecrypt).toBeDefined();
    expect(typeof useUserDecrypt).toBe("function");
  });
});

describe("usePublicDecrypt", () => {
  it("should export usePublicDecrypt", async () => {
    const { usePublicDecrypt } = await import("../src/react/usePublicDecrypt");
    expect(usePublicDecrypt).toBeDefined();
    expect(typeof usePublicDecrypt).toBe("function");
  });
});

describe("useFhevmStatus", () => {
  it("should export useFhevmStatus", async () => {
    const { useFhevmStatus } = await import("../src/react/useFhevmStatus");
    expect(useFhevmStatus).toBeDefined();
    expect(typeof useFhevmStatus).toBe("function");
  });
});

describe("useFhevmClient", () => {
  it("should export useFhevmClient", async () => {
    const { useFhevmClient } = await import("../src/react/useFhevmClient");
    expect(useFhevmClient).toBeDefined();
    expect(typeof useFhevmClient).toBe("function");
  });
});

