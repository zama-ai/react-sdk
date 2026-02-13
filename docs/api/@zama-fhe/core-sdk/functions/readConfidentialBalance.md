# Function: readConfidentialBalance()

```ts
function readConfidentialBalance(config: FhevmConfig, params: ReadConfidentialBalanceParams): Promise<`0x${string}` | undefined>;
```

Defined in: [core-sdk/src/actions/confidentialBalance.ts:67](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/actions/confidentialBalance.ts#L67)

Read an encrypted balance handle from an ERC7984 contract.

Returns the encrypted handle - use decrypt() to get the actual value.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `FhevmConfig` |
| `params` | `ReadConfidentialBalanceParams` |

## Returns

`Promise`\<`` `0x${string}` `` \| `undefined`\>

## Example

```typescript
const handle = await readConfidentialBalance(config, {
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
