// Provider (wagmi-style API)
export { FhevmProvider, type FhevmProviderProps } from "./FhevmProvider";
export { FhevmContext, useFhevmContext, type FhevmContextValue, type FhevmStatus } from "./context";

// Hooks (wagmi-style API)
export {
  useEncrypt,
  type UseEncryptReturn,
  type EncryptInput,
  type EncryptResult,
  type EncryptedOutput,
  type FheTypeName,
} from "./useEncrypt";
export {
  useUserDecrypt,
  type UseDecryptReturn,
  type DecryptRequest,
  type DecryptParams,
} from "./useUserDecrypt";
export {
  usePublicDecrypt,
  type UsePublicDecryptReturn,
  type PublicDecryptResult,
  type PublicDecryptParams,
} from "./usePublicDecrypt";
export { useFhevmStatus, type UseFhevmStatusReturn } from "./useFhevmStatus";
export { useFhevmClient, type UseFhevmClientReturn } from "./useFhevmClient";
/** @deprecated Prefer using the `wallet` prop on FhevmProvider instead of useEthersSigner. */
export { useEthersSigner, type UseEthersSignerReturn } from "./useEthersSigner";
export { useWalletOrSigner, type WalletActions } from "./useWalletOrSigner";
export {
  useConfidentialTransfer,
  type UseConfidentialTransferOptions,
  type UseConfidentialTransferReturn,
  type TransferStatus,
} from "./useConfidentialTransfer";
export {
  useConfidentialBalances,
  type ConfidentialBalanceConfig,
  type ConfidentialBalanceResult,
  type DecryptedValue,
  type UseConfidentialBalancesOptions,
  type UseConfidentialBalancesReturn,
  type BalanceStatus,
} from "./useConfidentialBalances";
export {
  useShield,
  type ShieldStatus,
  type UseShieldOptions,
  type UseShieldReturn,
} from "./useShield";
export {
  useUnshield,
  type UnshieldStatus,
  type UseUnshieldOptions,
  type UseUnshieldReturn,
} from "./useUnshield";

// Cache lookup hooks (TanStack Query powered)
export {
  useUserDecryptedValue,
  useUserDecryptedValues,
  type UseDecryptedValueReturn,
} from "./useUserDecryptedValue";
export {
  useSignature,
  type UseSignatureOptions,
  type UseSignatureReturn,
} from "./useSignature";
export {
  useFhevmInstance,
  type UseFhevmInstanceOptions,
  type UseFhevmInstanceReturn,
} from "./useFhevmInstance";

// TanStack Query utilities
export { fhevmQueryClient, createFhevmQueryClient } from "./queryClient";
export { fhevmKeys, type FhevmQueryKey } from "./queryKeys";

// Utilities
export { formatConfidentialAmount } from "../utils/format";

// Internal utilities (exported for advanced use cases)
export { InMemoryStorageProvider } from "./useInMemoryStorage";
