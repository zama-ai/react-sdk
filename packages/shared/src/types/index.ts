// Chain types
export type {
  FhevmChain,
  FhevmMockChain,
  FhevmProductionChain,
} from "./chain.js";

export { isMockChain, isProductionChain } from "./chain.js";

// Encryption types
export type {
  FheTypeName,
  EncryptInput,
  EncryptedOutput,
  EncryptResult,
} from "./encryption.js";

// Decryption types
export type {
  DecryptRequest,
  SignatureData,
  EIP712TypedData,
  DecryptResults,
} from "./decryption.js";
