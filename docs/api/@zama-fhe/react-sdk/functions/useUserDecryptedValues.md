[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useUserDecryptedValues

# Function: useUserDecryptedValues()

> **useUserDecryptedValues**(`handles`): `object`

Defined in: [react/useUserDecryptedValue.ts:130](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useUserDecryptedValue.ts#L130)

Hook for reading multiple cached decrypted values at once.

## Parameters

### handles

Array of { handle, contractAddress } to look up

readonly `object`[] | `undefined`

## Returns

`object`

### allCached

> **allCached**: `boolean`

### cachedCount

> **cachedCount**: `number`

### values

> **values**: (`string` \| `bigint` \| `boolean` \| `undefined`)[]

## Example

```tsx
function TokenBalances({ tokens }) {
  const cached = useUserDecryptedValues(
    tokens.map(t => ({ handle: t.handle, contractAddress: t.address }))
  )

  return (
    <ul>
      {tokens.map((token, i) => (
        <li key={token.handle}>
          {token.name}: {cached.values[i]?.toString() ?? 'Encrypted'}
        </li>
      ))}
    </ul>
  )
}
```
