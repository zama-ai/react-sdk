/**
 * Base error class for FHEVM SDK errors.
 */
export class FhevmError extends Error {
  public readonly code: string;

  constructor(code: string, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "FhevmError";
    this.code = code;
  }
}

/**
 * Error thrown when config is invalid.
 */
export class FhevmConfigError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("CONFIG_ERROR", message, options);
    this.name = "FhevmConfigError";
  }
}

/**
 * Error thrown when instance creation fails.
 */
export class FhevmInstanceError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("INSTANCE_ERROR", message, options);
    this.name = "FhevmInstanceError";
  }
}

/**
 * Error thrown when encryption fails.
 */
export class FhevmEncryptionError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("ENCRYPTION_ERROR", message, options);
    this.name = "FhevmEncryptionError";
  }
}

/**
 * Error thrown when decryption fails.
 */
export class FhevmDecryptionError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("DECRYPTION_ERROR", message, options);
    this.name = "FhevmDecryptionError";
  }
}

/**
 * Error thrown when signature operations fail.
 */
export class FhevmSignatureError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("SIGNATURE_ERROR", message, options);
    this.name = "FhevmSignatureError";
  }
}

/**
 * Error thrown when an operation is aborted.
 */
export class FhevmAbortError extends FhevmError {
  constructor(message = "Operation was cancelled", options?: ErrorOptions) {
    super("ABORT_ERROR", message, options);
    this.name = "FhevmAbortError";
  }
}

/**
 * Error thrown when provider is invalid.
 */
export class FhevmProviderError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("PROVIDER_ERROR", message, options);
    this.name = "FhevmProviderError";
  }
}

/**
 * Error thrown when transaction fails.
 */
export class FhevmTransactionError extends FhevmError {
  constructor(message: string, options?: ErrorOptions) {
    super("TRANSACTION_ERROR", message, options);
    this.name = "FhevmTransactionError";
  }
}
