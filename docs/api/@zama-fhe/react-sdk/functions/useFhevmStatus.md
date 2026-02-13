# Function: useFhevmStatus()

```ts
function useFhevmStatus(): UseFhevmStatusReturn;
```

Defined in: [react/useFhevmStatus.ts:45](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useFhevmStatus.ts#L45)

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
