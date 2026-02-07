[**Zama FHE SDK v0.1.0**](../../README.md)

***

[Zama FHE SDK](../../packages.md) / [@zama-fhe/shared](README.md) / types

# types

## Type Aliases

### FhevmChain

> **FhevmChain** = `object`

Defined in: [packages/shared/src/types/chain.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L4)

FhevmChain defines the configuration for an FHE-enabled blockchain network.

#### Properties

##### aclAddress?

> `optional` **aclAddress**: `` `0x${string}` ``

Defined in: [packages/shared/src/types/chain.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L16)

ACL contract address - controls FHE access permissions

##### gatewayUrl?

> `optional` **gatewayUrl**: `string`

Defined in: [packages/shared/src/types/chain.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L18)

Gateway URL for relayer operations (production chains)

##### id

> **id**: `number`

Defined in: [packages/shared/src/types/chain.ts:6](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L6)

Unique chain identifier

##### inputVerifierAddress?

> `optional` **inputVerifierAddress**: `` `0x${string}` ``

Defined in: [packages/shared/src/types/chain.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L22)

Input verifier contract address

##### isMock

> **isMock**: `boolean`

Defined in: [packages/shared/src/types/chain.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L12)

Whether this is a mock/local chain (uses hardhat plugin mock mode)

##### kmsVerifierAddress?

> `optional` **kmsVerifierAddress**: `` `0x${string}` ``

Defined in: [packages/shared/src/types/chain.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L20)

KMS verifier contract address

##### name

> **name**: `string`

Defined in: [packages/shared/src/types/chain.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L8)

Human-readable chain name

##### network

> **network**: `string`

Defined in: [packages/shared/src/types/chain.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L10)

Network identifier (e.g., 'sepolia', 'hardhat')

##### relayerUrl?

> `optional` **relayerUrl**: `string`

Defined in: [packages/shared/src/types/chain.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L24)

Relayer URL for encrypted transaction relay

##### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [packages/shared/src/types/chain.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L14)

RPC URL for the chain (required for mock chains)

***

### FhevmMockChain

> **FhevmMockChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: [packages/shared/src/types/chain.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L30)

Configuration for mock chains that auto-fetch metadata from the node

#### Type Declaration

##### isMock

> **isMock**: `true`

##### rpcUrl

> **rpcUrl**: `string`

***

### FhevmProductionChain

> **FhevmProductionChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: [packages/shared/src/types/chain.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L38)

Configuration for production chains with full FHE infrastructure

#### Type Declaration

##### aclAddress

> **aclAddress**: `` `0x${string}` ``

##### gatewayUrl

> **gatewayUrl**: `string`

##### inputVerifierAddress

> **inputVerifierAddress**: `` `0x${string}` ``

##### isMock

> **isMock**: `false`

##### kmsVerifierAddress

> **kmsVerifierAddress**: `` `0x${string}` ``

##### relayerUrl

> **relayerUrl**: `string`

## Functions

### isMockChain()

> **isMockChain**(`chain`): `chain is FhevmMockChain`

Defined in: [packages/shared/src/types/chain.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L50)

Type guard to check if a chain is a mock chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmMockChain`

***

### isProductionChain()

> **isProductionChain**(`chain`): `chain is FhevmProductionChain`

Defined in: [packages/shared/src/types/chain.ts:57](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/shared/src/types/chain.ts#L57)

Type guard to check if a chain is a production chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmProductionChain`

## References

### DecryptRequest

Re-exports [DecryptRequest](README.md#decryptrequest)

***

### DecryptResults

Re-exports [DecryptResults](README.md#decryptresults)

***

### EIP712TypedData

Re-exports [EIP712TypedData](README.md#eip712typeddata)

***

### EncryptedOutput

Re-exports [EncryptedOutput](README.md#encryptedoutput)

***

### EncryptInput

Re-exports [EncryptInput](README.md#encryptinput)

***

### EncryptResult

Re-exports [EncryptResult](README.md#encryptresult)

***

### FheTypeName

Re-exports [FheTypeName](README.md#fhetypename)

***

### SignatureData

Re-exports [SignatureData](README.md#signaturedata)
