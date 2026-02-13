# Table of Contents

* [Documentation Home](README.md)

## Getting Started

* [Overview](getting-started/overview.md)
* [Installation](getting-started/installation.md)
* [Core SDK Quick Start](getting-started/core-sdk-quickstart.md)
* [React SDK Quick Start](getting-started/react-sdk-quickstart.md)

## Core SDK

* [Overview](core-sdk/README.md)

## React SDK

* [Overview](react-sdk/README.md)
* Configuration
  * [Overview](react-sdk/configuration/overview.md)
  * [Chains](react-sdk/configuration/chains.md)
  * [Storage](react-sdk/configuration/storage.md)
  * [Threading & Performance](react-sdk/configuration/threading.md)
* Provider
  * [FhevmProvider](react-sdk/provider/fhevm-provider.md)
* Guides
  * [Security](react-sdk/guides/security.md)
  * [Error Handling](react-sdk/guides/error-handling.md)
  * [Troubleshooting](react-sdk/guides/troubleshooting.md)
  * [Wallet Interface](react-sdk/guides/wallet-interface.md)
  * [Linking](react-sdk/guides/linking.md)
* Reference
  * [Types](react-sdk/types/overview.md)

## API Reference

* Core SDK
  * Config
    * [createFhevmConfig](api/@zama-fhe/core-sdk/functions/createFhevmConfig.md)
  * Actions
    * [encrypt](api/@zama-fhe/core-sdk/functions/encrypt.md)
    * [readConfidentialBalance](api/@zama-fhe/core-sdk/functions/readConfidentialBalance.md)
    * [readConfidentialBalances](api/@zama-fhe/core-sdk/functions/readConfidentialBalances.md)
    * [writeConfidentialTransfer](api/@zama-fhe/core-sdk/functions/writeConfidentialTransfer.md)
  * Chains
    * [defineChain](api/@zama-fhe/core-sdk/functions/defineChain.md)
    * [defineMockChain](api/@zama-fhe/core-sdk/functions/defineMockChain.md)
    * [defineProductionChain](api/@zama-fhe/core-sdk/functions/defineProductionChain.md)
  * Transports
    * [custom](api/@zama-fhe/core-sdk/functions/custom.md)
    * [fallback](api/@zama-fhe/core-sdk/functions/fallback.md)
    * [http](api/@zama-fhe/core-sdk/functions/http.md)
  * Providers
    * [detectProvider](api/@zama-fhe/core-sdk/functions/detectProvider.md)
* React SDK
  * Hooks
    * [FhevmProvider](api/@zama-fhe/react-sdk/functions/FhevmProvider.md)
    * [useConfidentialBalances](api/@zama-fhe/react-sdk/functions/useConfidentialBalances.md)
    * [useConfidentialTransfer](api/@zama-fhe/react-sdk/functions/useConfidentialTransfer.md)
    * [useEncrypt](api/@zama-fhe/react-sdk/functions/useEncrypt.md)
    * [useEthersSigner](api/@zama-fhe/react-sdk/functions/useEthersSigner.md)
    * [useFhevmClient](api/@zama-fhe/react-sdk/functions/useFhevmClient.md)
    * [useFhevmStatus](api/@zama-fhe/react-sdk/functions/useFhevmStatus.md)
    * [usePublicDecrypt](api/@zama-fhe/react-sdk/functions/usePublicDecrypt.md)
    * [useShield](api/@zama-fhe/react-sdk/functions/useShield.md)
    * [useSignature](api/@zama-fhe/react-sdk/functions/useSignature.md)
    * [useUnshield](api/@zama-fhe/react-sdk/functions/useUnshield.md)
    * [useUserDecrypt](api/@zama-fhe/react-sdk/functions/useUserDecrypt.md)
    * [useUserDecryptedValue](api/@zama-fhe/react-sdk/functions/useUserDecryptedValue.md)
    * [useUserDecryptedValues](api/@zama-fhe/react-sdk/functions/useUserDecryptedValues.md)
    * [useWalletOrSigner](api/@zama-fhe/react-sdk/functions/useWalletOrSigner.md)
  * Config
    * [createFhevmConfig](api/@zama-fhe/react-sdk/functions/createFhevmConfig.md)
  * Utilities
    * [configureLogger](api/@zama-fhe/react-sdk/functions/configureLogger.md)
    * [formatConfidentialAmount](api/@zama-fhe/react-sdk/functions/formatConfidentialAmount.md)
