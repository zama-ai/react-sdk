[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useFhevmClient

# Function: useFhevmClient()

> **useFhevmClient**(): `UseFhevmClientReturn`

Defined in: [react/useFhevmClient.ts:49](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useFhevmClient.ts#L49)

Hook to get direct access to the FHEVM instance.

Use this for advanced operations or when building custom hooks.
For most use cases, prefer useEncrypt and useUserDecrypt hooks.

## Returns

`UseFhevmClientReturn`

## Example

```tsx
function MyComponent() {
  const { instance, isReady, refresh } = useFhevmClient()

  if (!isReady) return <div>Not ready</div>

  // Use instance directly for advanced operations
  const publicKey = instance.getPublicKey()

  return (
    <div>
      <button onClick={refresh}>Refresh Instance</button>
    </div>
  )
}
```
