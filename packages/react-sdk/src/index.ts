// Config (wagmi-style API)
export {
  createFhevmConfig,
  createStorage,
  createMemoryStorage,
  noopStorage,
  type FhevmConfig,
  type FhevmConfigOptions,
  type FhevmStorage,
  type ConfigChainId,
} from "./config";

// Chains (wagmi-style API)
export {
  type FhevmChain,
  type FhevmMockChain,
  type FhevmProductionChain,
  defineChain,
  defineMockChain,
  defineProductionChain,
  hardhatLocal,
  createHardhatChain,
  sepolia,
  SEPOLIA_CHAIN_ID,
} from "./chains/index";

// Storage adapters
export { type GenericStringStorage } from "./storage/GenericStringStorage";
export {
  memoryStorage,
  localStorageAdapter,
  createLocalStorageAdapter,
  sessionStorageAdapter,
  createSessionStorageAdapter,
  noOpStorage,
} from "./storage/adapters";

// EIP-1193 provider types (for use without ethers/viem/wagmi)
export type {
  Eip1193Provider,
  TypedDataDomain,
  TypedDataField,
  EIP712TypedData,
} from "./internal/validations/index";

// Encryption types
export type { FheTypeName, EncryptInput, EncryptResult, EncryptedOutput } from "./types/encryption";

// Transfer types
export type {
  TransferStatus,
  UseConfidentialTransferOptions,
  UseConfidentialTransferReturn,
} from "./types/transfer";

// Balance types
export type {
  BalanceStatus,
  ConfidentialBalanceConfig,
  ConfidentialBalanceResult,
  DecryptedValue,
  UseConfidentialBalancesOptions,
  UseConfidentialBalancesReturn,
} from "./types/balance";

// Shield/Unshield types
export type {
  ShieldStatus,
  UnshieldStatus,
  UseShieldOptions,
  UseShieldReturn,
  UseUnshieldOptions,
  UseUnshieldReturn,
} from "./types/shield";

// Wallet types
export type { FhevmWallet } from "./types/wallet";

// Relayer-SDK types re-exported for consumers
export type { HandleContractPair, UserDecryptResults } from "./fhevmTypes";

// ABIs
export { ERC7984_ABI, ERC20TOERC7984_ABI, ERC20_ABI } from "./abi/index";

// Logger configuration (for enabling debug mode)
export { configureLogger } from "./internal/logger";

// Provider (wagmi-style API)
export { FhevmProvider, type FhevmProviderProps } from "./react/FhevmProvider";
export { type FhevmStatus } from "./react/context";

// Hooks (wagmi-style API)
export { useEncrypt, type UseEncryptReturn } from "./react/useEncrypt";
export { useUserDecrypt, type UseDecryptReturn, type DecryptRequest, type DecryptParams } from "./react/useUserDecrypt";
export { usePublicDecrypt, type UsePublicDecryptReturn, type PublicDecryptResult, type PublicDecryptParams } from "./react/usePublicDecrypt";
export { useFhevmStatus, type UseFhevmStatusReturn } from "./react/useFhevmStatus";
export { useFhevmClient, type UseFhevmClientReturn } from "./react/useFhevmClient";
/** @deprecated Prefer using the `wallet` prop on FhevmProvider instead of useEthersSigner. */
export { useEthersSigner, type UseEthersSignerReturn } from "./react/useEthersSigner";
export { useWalletOrSigner } from "./react/useWalletOrSigner";
export { useConfidentialTransfer } from "./react/useConfidentialTransfer";
export { useConfidentialBalances } from "./react/useConfidentialBalances";
export { useShield } from "./react/useShield";
export { useUnshield } from "./react/useUnshield";
export { useUserDecryptedValue, useUserDecryptedValues, type UseDecryptedValueReturn } from "./react/useUserDecryptedValue";
export { useSignature, type UseSignatureOptions, type UseSignatureReturn } from "./react/useSignature";

// Utilities
export { formatConfidentialAmount } from "./utils/format";

// -----------------------------------------------------------------------
// Internal exports — kept for backwards compat but hidden from docs.
// These are tagged @internal so TypeDoc (excludeInternal: true) skips them.
// -----------------------------------------------------------------------

/** @internal */
export {
  FhevmInstanceAdapter,
  createFhevmInstanceAdapter,
  isFhevmInstanceAdapter,
  type IFhevmInstanceAdapter,
  type EncryptedInputBuilder,
  type DecryptionEIP712Data,
} from "./internal/FhevmInstanceAdapter";

/** @internal */
export { RelayerSDKLoader, type RelayerSDKLoaderOptions } from "./internal/RelayerSDKLoader";

/** @internal */
export { getPublicKeyStorageType } from "./internal/PublicKeyStorage";

/** @internal */
export { getLoggerConfig } from "./internal/logger";

/** @internal */
export { type SignerParams } from "./FhevmDecryptionSignature";

/** @internal */
export { FhevmContext, useFhevmContext, type FhevmContextValue } from "./react/context";

/** @internal */
export { fhevmQueryClient, createFhevmQueryClient } from "./react/queryClient";

/** @internal */
export { fhevmKeys, type FhevmQueryKey } from "./react/queryKeys";

/** @internal */
export { useFhevmInstance, type UseFhevmInstanceOptions, type UseFhevmInstanceReturn } from "./react/useFhevmInstance";

/** @internal */
export { InMemoryStorageProvider } from "./react/useInMemoryStorage";

/** @internal */
export { type WalletActions } from "./react/useWalletOrSigner";

/** @internal */
export type { FhevmInstance, FhevmInstanceConfig, FhevmDecryptionSignatureType, EIP712MessageValue, EIP712Type } from "./fhevmTypes";

/** @internal */
export { FhevmDecryptionSignature } from "./FhevmDecryptionSignature";

/** @internal */
export { createFhevmInstance } from "./internal/fhevm";

/** @internal */
export { isFhevmWindowType } from "./internal/RelayerSDKLoader";

/** @internal */
export { publicKeyStorageGet, publicKeyStorageSet } from "./internal/PublicKeyStorage";

/** @internal */
export { type TfheInitParams, type KmsInitParams } from "./internal/fhevmTypes";

/** @internal */
export { RELAYER_SDK_VERSION, RELAYER_SDK_URL, RELAYER_SDK_INTEGRITY, RELAYER_SDK_FALLBACK_URL, SDK_CDN_URL } from "./internal/constants";

/** @internal */
export { GenericStringInMemoryStorage } from "./storage/GenericStringStorage";

/** @internal */
export { isMockChain, isProductionChain } from "./chains/index";
