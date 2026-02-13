# Function: useFhevmClient()

```ts
function useFhevmClient(): UseFhevmClientReturn;
```

Defined in: [react/useFhevmClient.ts:49](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useFhevmClient.ts#L49)

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
