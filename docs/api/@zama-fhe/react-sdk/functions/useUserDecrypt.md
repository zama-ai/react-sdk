[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useUserDecrypt

# Function: useUserDecrypt()

> **useUserDecrypt**(`requestsOrParams`): `UseDecryptReturn`

Defined in: [react/useUserDecrypt.ts:124](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useUserDecrypt.ts#L124)

Hook for decrypting FHE encrypted values using TanStack Query mutations.

Uses EIP-1193 provider for signing (no ethers.js dependency).
Storage must be provided via FhevmProvider to cache signatures.

Supports two usage patterns:

**Simple single-handle (recommended):**
```tsx
const { decrypt, isDecrypting, results } = useUserDecrypt({
  handle: balanceHandle,
  contractAddress: '0x...'
})
```

**Batch decryption:**
```tsx
const { decrypt, results } = useUserDecrypt([
  { handle: handle1, contractAddress },
  { handle: handle2, contractAddress }
])
```

## Parameters

### requestsOrParams

`DecryptParams` | readonly `DecryptRequest`[] | `undefined`

## Returns

`UseDecryptReturn`

## Example

```tsx
function BalanceDisplay({ handle, contractAddress }) {
  const { results, decrypt, isDecrypting, canDecrypt } = useUserDecrypt({
    handle,
    contractAddress
  })

  const balance = handle ? results[handle] : undefined

  return (
    <div>
      <p>Balance: {balance?.toString() ?? 'Encrypted'}</p>
      <button onClick={decrypt} disabled={!canDecrypt}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
    </div>
  )
}
```
