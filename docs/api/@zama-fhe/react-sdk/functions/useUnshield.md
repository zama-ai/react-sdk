[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useUnshield

# Function: useUnshield()

> **useUnshield**(`options`): `UseUnshieldReturn`

Defined in: [react/useUnshield.ts:92](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useUnshield.ts#L92)

Hook for unshielding confidential ERC7984 tokens back to ERC20.

Now powered by TanStack Query's `useMutation` for automatic state management.

Handles the complete flow:
1. Encrypt the amount using FHE
2. Call unwrap(from, to, encryptedAmount, inputProof) - burns confidential tokens
3. Wait for transaction confirmation
4. Request public decryption of the burnt amount
5. Call finalizeUnwrap() with the decryption proof - releases ERC20 tokens

## Parameters

### options

`UseUnshieldOptions`

## Returns

`UseUnshieldReturn`

## Example

```tsx
function UnshieldForm({ wrapperAddress }) {
  const [amount, setAmount] = useState("");

  const {
    unshield,
    status,
    isEncrypting,
    isSigning,
    isDecrypting,
    isFinalizing,
    isPending,
    error,
  } = useUnshield({
    wrapperAddress,
    onSuccess: (hash) => console.log("Unshield complete!", hash),
  });

  const handleSubmit = async () => {
    await unshield(BigInt(amount));
  };

  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isEncrypting ? "Encrypting..." :
         isSigning ? "Sign in wallet..." :
         isDecrypting ? "Getting proof..." :
         isFinalizing ? "Finalizing..." :
         "Unshield"}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```
