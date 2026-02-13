# Function: useSignature()

```ts
function useSignature(options: UseSignatureOptions): UseSignatureReturn;
```

Defined in: [react/useSignature.ts:64](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useSignature.ts#L64)

Hook for querying cached decryption signatures from storage.

This hook uses TanStack Query to reactively load and cache decryption signatures
from GenericStringStorage. It does NOT create new signatures (that happens during
the decrypt mutation). This is useful for:

1. Auto-decryption: Check if signature exists to avoid wallet popup
2. Reactive updates: Know when signature becomes available
3. Cache coordination: Share signature state across components

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `UseSignatureOptions` |

## Returns

`UseSignatureReturn`

## Example

```tsx
const { isSignatureCached, signature } = useSignature({
  contractAddresses: ['0x123...', '0x456...'],
});

if (isSignatureCached) {
  // Auto-decrypt without wallet popup
  decryptAll();
}
```
