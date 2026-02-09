// Config
export { createFhevmConfig, type FhevmConfig, type FhevmConfigOptions, type ConfigChainId } from "./config/index.js";

// Transports
export { http, custom, fallback } from "./transports/index.js";

// Chains
export {
  sepolia,
  hardhatLocal,
  defineChain,
  defineMockChain,
  defineProductionChain,
  type FhevmChain,
  type FhevmMockChain,
  type FhevmProductionChain,
} from "@zama-fhe/shared";

// Types
export type {
  FheTypeName,
  EncryptInput,
  EncryptedOutput,
  EncryptResult,
  DecryptRequest,
  SignatureData,
  EIP712TypedData,
  DecryptResults,
} from "@zama-fhe/shared";

// Error classes
export {
  FhevmError,
  FhevmConfigError,
  FhevmInstanceError,
  FhevmEncryptionError,
  FhevmDecryptionError,
  FhevmSignatureError,
  FhevmAbortError,
  FhevmProviderError,
  FhevmTransactionError,
} from "@zama-fhe/shared";

// ABIs
export { ERC7984_ABI } from "@zama-fhe/shared";

// Actions
export {
  encrypt,
  confidentialTransfer,
  confidentialBalance,
  confidentialBalances,
  type EncryptParams,
  type ConfidentialTransferParams,
  type ConfidentialTransferResult,
  type ConfidentialBalanceParams,
  type ConfidentialBalancesParams,
} from "./actions/index.js";

// Transport types
export type { Transport } from "./types/index.js";

// Providers
export {
  detectAndWrapProvider,
  type UnifiedProvider,
  type TransactionRequest,
  type ReadContractParams,
  type Eip1193Provider,
} from "./providers/index.js";

// -----------------------------------------------------------------------
// Internal exports — kept for backwards compat but hidden from docs.
// These are tagged @internal so TypeDoc (excludeInternal: true) skips them.
// -----------------------------------------------------------------------

/** @internal */
export {
  isAddress,
  assertAddress,
  isBigInt,
  isValidChainId,
  assertChainId,
  isMockChain,
  isProductionChain,
} from "@zama-fhe/shared";

/** @internal */
export {
  createEthersProvider,
  createViemProvider,
  isEthersProvider,
  isViemProvider,
  type ProviderType,
} from "./providers/index.js";

/** @internal */
export type {
  TransportMap,
  HttpTransportConfig,
  CustomTransportConfig,
  FallbackTransportConfig,
} from "./types/index.js";
