# Function: useEncrypt()

```ts
function useEncrypt(): UseEncryptReturn;
```

Defined in: [react/useEncrypt.ts:152](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useEncrypt.ts#L152)

Hook for encrypting values for FHE contract calls.

Provides type-safe encryption with compile-time checking of value types.
Returns a tuple for easy destructuring into handles and proof.

Now uses TanStack Query's useMutation internally for DevTools visibility
and tracking, while maintaining the same external API.

## Returns

`UseEncryptReturn`

## Example

```tsx
function TransferForm({ contractAddress }) {
  const { encrypt, isReady } = useEncrypt();

  const handleTransfer = async (amount: bigint, recipient: `0x${string}`) => {
    if (!isReady) return;

    const [amountHandle, recipientHandle, proof] = await encrypt([
      { type: 'uint64', value: amount },
      { type: 'address', value: recipient },
    ], contractAddress);

    if (!amountHandle) return;

    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: 'transfer',
      args: [amountHandle, recipientHandle, proof],
    });
  };

  return (
    <button onClick={() => handleTransfer(100n, '0x...')} disabled={!isReady}>
      Transfer
    </button>
  );
}
```
