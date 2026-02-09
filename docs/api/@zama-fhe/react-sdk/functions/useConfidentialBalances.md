[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useConfidentialBalances

# Function: useConfidentialBalances()

> **useConfidentialBalances**(`options`): `UseConfidentialBalancesReturn`

Defined in: [react/useConfidentialBalances.ts:77](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useConfidentialBalances.ts#L77)

Hook for reading encrypted balance handles from multiple ERC7984 contracts in parallel.

Follows wagmi's `useReadContracts` pattern — accepts an array of contract configs
and returns per-item results.

When `decrypt: true` is set, automatically composes `useUserDecrypt` and
`useUserDecryptedValues` internally so consumers get cleartext values without
manual wiring.

## Parameters

### options

`UseConfidentialBalancesOptions`

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
