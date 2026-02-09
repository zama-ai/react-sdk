[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / confidentialBalance

# Function: confidentialBalance()

> **confidentialBalance**(`config`, `params`): `Promise`\<`` `0x${string}` `` \| `undefined`\>

Defined in: [core-sdk/src/actions/confidentialBalance.ts:67](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/actions/confidentialBalance.ts#L67)

Read an encrypted balance handle from an ERC7984 contract.

Returns the encrypted handle - use decrypt() to get the actual value.

## Parameters

### config

`FhevmConfig`

### params

`ConfidentialBalanceParams`

## Returns

`Promise`\<`` `0x${string}` `` \| `undefined`\>

## Example

```typescript
const handle = await confidentialBalance(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  account: '0xUser...',
  provider: 'https://sepolia.infura.io/v3/...',
})

if (handle) {
  // Decrypt to get actual balance
  const [balance] = await decrypt(config, {
    chainId: 11155111,
    requests: [{ handle, contractAddress: '0xToken...' }],
    userAddress: '0xUser...',
    signature: mySignature,
    provider: window.ethereum,
  })
}
```
