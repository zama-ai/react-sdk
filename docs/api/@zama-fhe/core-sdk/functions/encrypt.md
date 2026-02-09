[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / encrypt

# Function: encrypt()

> **encrypt**(`config`, `params`): `Promise`\<`EncryptedOutput`\>

Defined in: [core-sdk/src/actions/encrypt.ts:43](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/actions/encrypt.ts#L43)

Encrypt values for FHE contract calls.

Returns encrypted handles and proof that can be used in contract calls.

## Parameters

### config

`FhevmConfig`

### params

`EncryptParams`

## Returns

`Promise`\<`EncryptedOutput`\>

## Example

```typescript
const result = await encrypt(config, {
  chainId: 11155111,
  values: [
    { type: 'uint64', value: 100n },
    { type: 'address', value: '0xRecipient...' },
  ],
  contractAddress: '0xContract...',
  userAddress: '0xUser...',
})

// Use in contract call
const [amountHandle, recipientHandle, proof] = [...result.handles, result.proof]
```
