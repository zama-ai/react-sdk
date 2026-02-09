[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useFhevmStatus

# Function: useFhevmStatus()

> **useFhevmStatus**(): `UseFhevmStatusReturn`

Defined in: [react/useFhevmStatus.ts:45](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useFhevmStatus.ts#L45)

Hook to get the current FHEVM status.

## Returns

`UseFhevmStatusReturn`

## Example

```tsx
function MyComponent() {
  const { isReady, isInitializing, error } = useFhevmStatus()

  if (isInitializing) return <div>Initializing FHE...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!isReady) return <div>Connect your wallet</div>

  return <div>FHE Ready!</div>
}
```
