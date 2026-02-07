// Config
export { createFhevmConfig, type FhevmConfig, type FhevmConfigOptions, type ConfigChainId } from "./config/index.js";

// Transports
export { http, custom, fallback } from "./transports/index.js";

// Re-export from shared (chains, types, utils, ABIs)
export {
  // Chains
  sepolia,
  hardhatLocal,
  defineChain,
  defineMockChain,
  defineProductionChain,
  // Types
  type FhevmChain,
  type FhevmMockChain,
  type FhevmProductionChain,
  type FheTypeName,
  type EncryptInput,
  type EncryptedOutput,
  type EncryptResult,
  type DecryptRequest,
  type SignatureData,
  type EIP712TypedData,
  type DecryptResults,
  // Utils
  FhevmError,
  FhevmConfigError,
  FhevmInstanceError,
  FhevmEncryptionError,
  FhevmDecryptionError,
  FhevmSignatureError,
  FhevmAbortError,
  FhevmProviderError,
  FhevmTransactionError,
  isAddress,
  assertAddress,
  isBigInt,
  isValidChainId,
  assertChainId,
  isMockChain,
  isProductionChain,
  // ABIs
  ERC7984_ABI,
} from "@zama-fhe/shared";

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
export type {
  Transport,
  TransportMap,
  HttpTransportConfig,
  CustomTransportConfig,
  FallbackTransportConfig,
} from "./types/index.js";

// Providers
export {
  detectAndWrapProvider,
  createEthersProvider,
  createViemProvider,
  isEthersProvider,
  isViemProvider,
  type UnifiedProvider,
  type ProviderType,
  type TransactionRequest,
  type ReadContractParams,
  type Eip1193Provider,
} from "./providers/index.js";
