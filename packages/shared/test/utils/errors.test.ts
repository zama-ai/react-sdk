import { describe, it, expect } from "vitest";
import {
  FhevmError,
  FhevmConfigError,
  FhevmInstanceError,
  FhevmEncryptionError,
  FhevmDecryptionError,
  FhevmSignatureError,
  FhevmAbortError,
  FhevmProviderError,
  FhevmTransactionError,
} from "../../src/utils/errors.js";

describe("FhevmError", () => {
  it("should create a base FhevmError with code and message", () => {
    const error = new FhevmError("TEST_CODE", "Test message");
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmError");
    expect(error.code).toBe("TEST_CODE");
    expect(error.message).toBe("Test message");
  });

  it("should support error options", () => {
    const cause = new Error("Original error");
    const error = new FhevmError("TEST_CODE", "Test message", { cause });
    expect(error.cause).toBe(cause);
  });
});

describe("FhevmConfigError", () => {
  it("should create a config error with correct properties", () => {
    const error = new FhevmConfigError("Invalid configuration");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmConfigError");
    expect(error.code).toBe("CONFIG_ERROR");
    expect(error.message).toBe("Invalid configuration");
  });
});

describe("FhevmInstanceError", () => {
  it("should create an instance error with correct properties", () => {
    const error = new FhevmInstanceError("Failed to initialize");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmInstanceError");
    expect(error.code).toBe("INSTANCE_ERROR");
    expect(error.message).toBe("Failed to initialize");
  });
});

describe("FhevmEncryptionError", () => {
  it("should create an encryption error with correct properties", () => {
    const error = new FhevmEncryptionError("Encryption failed");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmEncryptionError");
    expect(error.code).toBe("ENCRYPTION_ERROR");
    expect(error.message).toBe("Encryption failed");
  });
});

describe("FhevmDecryptionError", () => {
  it("should create a decryption error with correct properties", () => {
    const error = new FhevmDecryptionError("Decryption failed");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmDecryptionError");
    expect(error.code).toBe("DECRYPTION_ERROR");
    expect(error.message).toBe("Decryption failed");
  });
});

describe("FhevmSignatureError", () => {
  it("should create a signature error with correct properties", () => {
    const error = new FhevmSignatureError("Signature invalid");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmSignatureError");
    expect(error.code).toBe("SIGNATURE_ERROR");
    expect(error.message).toBe("Signature invalid");
  });
});

describe("FhevmAbortError", () => {
  it("should create an abort error with default message", () => {
    const error = new FhevmAbortError();
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmAbortError");
    expect(error.code).toBe("ABORT_ERROR");
    expect(error.message).toBe("Operation was cancelled");
  });

  it("should accept custom abort message", () => {
    const error = new FhevmAbortError("User cancelled");
    expect(error.message).toBe("User cancelled");
  });
});

describe("FhevmProviderError", () => {
  it("should create a provider error with correct properties", () => {
    const error = new FhevmProviderError("Provider not found");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmProviderError");
    expect(error.code).toBe("PROVIDER_ERROR");
    expect(error.message).toBe("Provider not found");
  });
});

describe("FhevmTransactionError", () => {
  it("should create a transaction error with correct properties", () => {
    const error = new FhevmTransactionError("Transaction reverted");
    expect(error).toBeInstanceOf(FhevmError);
    expect(error.name).toBe("FhevmTransactionError");
    expect(error.code).toBe("TRANSACTION_ERROR");
    expect(error.message).toBe("Transaction reverted");
  });
});

describe("Error inheritance", () => {
  it("should allow catching all FhevmErrors", () => {
    const errors = [
      new FhevmConfigError("Config"),
      new FhevmInstanceError("Instance"),
      new FhevmEncryptionError("Encrypt"),
    ];

    errors.forEach((error) => {
      expect(error).toBeInstanceOf(FhevmError);
      expect(error).toBeInstanceOf(Error);
    });
  });

  it("should distinguish between error types", () => {
    const configError = new FhevmConfigError("Config");
    const instanceError = new FhevmInstanceError("Instance");

    expect(configError).toBeInstanceOf(FhevmConfigError);
    expect(configError).not.toBeInstanceOf(FhevmInstanceError);
    expect(instanceError).toBeInstanceOf(FhevmInstanceError);
    expect(instanceError).not.toBeInstanceOf(FhevmConfigError);
  });
});
