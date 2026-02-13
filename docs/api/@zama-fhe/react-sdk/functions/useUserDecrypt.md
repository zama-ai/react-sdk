# Function: useUserDecrypt()

```ts
function useUserDecrypt(requestsOrParams: DecryptParams | readonly DecryptRequest[] | undefined): UseDecryptReturn;
```

Defined in: [react/useUserDecrypt.ts:124](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useUserDecrypt.ts#L124)

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

| Parameter | Type |
| ------ | ------ |
| `requestsOrParams` | `DecryptParams` \| readonly `DecryptRequest`[] \| `undefined` |

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
