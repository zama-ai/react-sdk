# Function: useConfidentialBalances()

```ts
function useConfidentialBalances(options: UseConfidentialBalancesOptions): UseConfidentialBalancesReturn;
```

Defined in: [react/useConfidentialBalances.ts:77](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useConfidentialBalances.ts#L77)

Hook for reading encrypted balance handles from multiple ERC7984 contracts in parallel.

Follows wagmi's `useReadContracts` pattern — accepts an array of contract configs
and returns per-item results.

When `decrypt: true` is set, automatically composes `useUserDecrypt` and
`useUserDecryptedValues` internally so consumers get cleartext values without
manual wiring.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `UseConfidentialBalancesOptions` |

## Returns

`UseConfidentialBalancesReturn`

## Examples

```tsx
const { data, isLoading, refetch } = useConfidentialBalances({
  contracts: [
    { contractAddress: tokenA },
    { contractAddress: tokenB },
    { contractAddress: tokenC, account: otherAddress },
  ],
});
// data[0].result — handle for tokenA balance
// data[1].result — handle for tokenB balance
// data[2].result — handle for tokenC balance (for otherAddress)
```

```tsx
// With auto-decryption
const { data, decryptAll, isDecrypting, isAllDecrypted } = useConfidentialBalances({
  contracts: [{ contractAddress: tokenA }],
  decrypt: true,
});
// data[0].decryptedValue — cleartext value after decryptAll() is called
```
