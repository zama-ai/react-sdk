# Function: readConfidentialBalances()

```ts
function readConfidentialBalances(config: FhevmConfig, params: ReadConfidentialBalancesParams): Promise<(`0x${string}` | undefined)[]>;
```

Defined in: [core-sdk/src/actions/confidentialBalance.ts:134](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/actions/confidentialBalance.ts#L134)

Read encrypted balance handles from multiple ERC7984 contracts in parallel.

Similar to wagmi's useReadContracts - fetches multiple balances efficiently.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `FhevmConfig` |
| `params` | `ReadConfidentialBalancesParams` |

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
