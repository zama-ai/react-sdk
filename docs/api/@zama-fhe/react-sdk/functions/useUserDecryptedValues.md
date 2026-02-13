# Function: useUserDecryptedValues()

```ts
function useUserDecryptedValues(handles: readonly object[] | undefined): object;
```

Defined in: [react/useUserDecryptedValue.ts:130](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useUserDecryptedValue.ts#L130)

Hook for reading multiple cached decrypted values at once.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `handles` | readonly `object`[] \| `undefined` | Array of { handle, contractAddress } to look up |

## Returns

`object`

### allCached

```ts
allCached: boolean;
```

### cachedCount

```ts
cachedCount: number;
```

### values

```ts
values: (string | bigint | boolean | undefined)[];
```

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
