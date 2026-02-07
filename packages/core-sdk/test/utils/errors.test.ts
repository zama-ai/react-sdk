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

describe("Error classes", () => {
  describe("FhevmError", () => {
    it("should create error with code and message", () => {
      const error = new FhevmError("TEST_CODE", "Test message");
      expect(error.name).toBe("FhevmError");
      expect(error.code).toBe("TEST_CODE");
      expect(error.message).toBe("Test message");
      expect(error).toBeInstanceOf(Error);
    });

    it("should support error options", () => {
      const cause = new Error("Original error");
      const error = new FhevmError("TEST_CODE", "Test message", { cause });
      expect(error.cause).toBe(cause);
    });
  });

  describe("FhevmConfigError", () => {
    it("should create config error with correct properties", () => {
      const error = new FhevmConfigError("Invalid configuration");
      expect(error.name).toBe("FhevmConfigError");
      expect(error.code).toBe("CONFIG_ERROR");
      expect(error.message).toBe("Invalid configuration");
      expect(error).toBeInstanceOf(FhevmError);
    });

    it("should support error options", () => {
      const cause = new Error("Root cause");
      const error = new FhevmConfigError("Config failed", { cause });
      expect(error.cause).toBe(cause);
    });
  });

  describe("FhevmInstanceError", () => {
    it("should create instance error with correct properties", () => {
      const error = new FhevmInstanceError("Failed to create instance");
      expect(error.name).toBe("FhevmInstanceError");
      expect(error.code).toBe("INSTANCE_ERROR");
      expect(error.message).toBe("Failed to create instance");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("FhevmEncryptionError", () => {
    it("should create encryption error with correct properties", () => {
      const error = new FhevmEncryptionError("Encryption failed");
      expect(error.name).toBe("FhevmEncryptionError");
      expect(error.code).toBe("ENCRYPTION_ERROR");
      expect(error.message).toBe("Encryption failed");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("FhevmDecryptionError", () => {
    it("should create decryption error with correct properties", () => {
      const error = new FhevmDecryptionError("Decryption failed");
      expect(error.name).toBe("FhevmDecryptionError");
      expect(error.code).toBe("DECRYPTION_ERROR");
      expect(error.message).toBe("Decryption failed");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("FhevmSignatureError", () => {
    it("should create signature error with correct properties", () => {
      const error = new FhevmSignatureError("Signature verification failed");
      expect(error.name).toBe("FhevmSignatureError");
      expect(error.code).toBe("SIGNATURE_ERROR");
      expect(error.message).toBe("Signature verification failed");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("FhevmAbortError", () => {
    it("should create abort error with default message", () => {
      const error = new FhevmAbortError();
      expect(error.name).toBe("FhevmAbortError");
      expect(error.code).toBe("ABORT_ERROR");
      expect(error.message).toBe("Operation was cancelled");
      expect(error).toBeInstanceOf(FhevmError);
    });

    it("should create abort error with custom message", () => {
      const error = new FhevmAbortError("Custom cancellation message");
      expect(error.message).toBe("Custom cancellation message");
    });
  });

  describe("FhevmProviderError", () => {
    it("should create provider error with correct properties", () => {
      const error = new FhevmProviderError("Invalid provider");
      expect(error.name).toBe("FhevmProviderError");
      expect(error.code).toBe("PROVIDER_ERROR");
      expect(error.message).toBe("Invalid provider");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("FhevmTransactionError", () => {
    it("should create transaction error with correct properties", () => {
      const error = new FhevmTransactionError("Transaction reverted");
      expect(error.name).toBe("FhevmTransactionError");
      expect(error.code).toBe("TRANSACTION_ERROR");
      expect(error.message).toBe("Transaction reverted");
      expect(error).toBeInstanceOf(FhevmError);
    });
  });

  describe("error inheritance", () => {
    it("should allow catching all FHEVM errors as FhevmError", () => {
      const errors = [
        new FhevmConfigError("test"),
        new FhevmInstanceError("test"),
        new FhevmEncryptionError("test"),
        new FhevmDecryptionError("test"),
        new FhevmSignatureError("test"),
        new FhevmAbortError("test"),
        new FhevmProviderError("test"),
        new FhevmTransactionError("test"),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(FhevmError);
        expect(error).toBeInstanceOf(Error);
      });
    });
  });
});
