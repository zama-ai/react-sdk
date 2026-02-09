[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / readConfidentialBalances

# Function: readConfidentialBalances()

> **readConfidentialBalances**(`config`, `params`): `Promise`\<(`` `0x${string}` `` \| `undefined`)[]\>

Defined in: [core-sdk/src/actions/confidentialBalance.ts:134](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/actions/confidentialBalance.ts#L134)

Read encrypted balance handles from multiple ERC7984 contracts in parallel.

Similar to wagmi's useReadContracts - fetches multiple balances efficiently.

## Parameters

### config

`FhevmConfig`

### params

`ReadConfidentialBalancesParams`

## Returns

`Promise`\<(`` `0x${string}` `` \| `undefined`)[]\>

## Example

```typescript
const balances = await readConfidentialBalances(config, {
  chainId: 11155111,
  contracts: [
    { contractAddress: '0xTokenA...', account: '0xUser...' },
    { contractAddress: '0xTokenB...', account: '0xUser...' },
    { contractAddress: '0xTokenC...', account: '0xOther...' },
  ],
  provider: 'https://sepolia.infura.io/v3/...',
})

// balances = ['0xHandle1...', undefined, '0xHandle3...']
```
