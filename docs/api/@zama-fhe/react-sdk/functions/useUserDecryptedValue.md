[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useUserDecryptedValue

# Function: useUserDecryptedValue()

> **useUserDecryptedValue**(`handle`, `contractAddress`): `UseDecryptedValueReturn`

Defined in: [react/useUserDecryptedValue.ts:80](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useUserDecryptedValue.ts#L80)

Hook for reading cached decrypted values without triggering new decryption.

This hook provides a read-only view of the decryption cache populated by
useUserDecrypt. It's useful for:
- Displaying previously decrypted values
- Checking if a value has been decrypted before
- Avoiding redundant decryption operations

Note: This hook does NOT trigger decryption. To decrypt values,
use the useUserDecrypt hook instead.

## Parameters

### handle

The encrypted handle to look up, or undefined

`string` | `undefined`

### contractAddress

The contract address, or undefined

`` `0x${string}` `` | `undefined`

## Returns

`UseDecryptedValueReturn`

## Examples

```tsx
function CachedBalance({ handle, contractAddress }) {
  const { data, isCached } = useUserDecryptedValue(handle, contractAddress)

  if (!isCached) {
    return <p>Value not decrypted yet</p>
  }

  return <p>Cached balance: {data?.toString()}</p>
}
```

```tsx
// Use with useUserDecrypt for a complete flow
function Balance({ handle, contractAddress }) {
  const { data: signer } = useEthersSigner()
  const { isCached, data: cachedValue } = useUserDecryptedValue(handle, contractAddress)
  const { decrypt, isDecrypting, canDecrypt } = useUserDecrypt(
    handle && !isCached ? [{ handle, contractAddress }] : undefined,
    signer
  )

  // Show cached value if available
  if (isCached) {
    return <p>Balance: {cachedValue?.toString()}</p>
  }

  return (
    <div>
      <p>Balance: Encrypted</p>
      <button onClick={decrypt} disabled={!canDecrypt || isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
    </div>
  )
}
```
