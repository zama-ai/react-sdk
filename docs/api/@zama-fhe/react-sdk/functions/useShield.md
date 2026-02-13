# Function: useShield()

```ts
function useShield(options: UseShieldOptions): UseShieldReturn;
```

Defined in: [react/useShield.ts:83](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useShield.ts#L83)

Hook for shielding ERC20 tokens into confidential ERC7984 tokens.

Now powered by TanStack Query's `useMutation` for automatic state management.

Handles the full flow:
1. Check ERC20 allowance for the wrapper contract
2. Approve if needed (prompts wallet signature)
3. Call wrap() to convert ERC20 → ERC7984
4. Wait for confirmation

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `UseShieldOptions` |

## Returns

`UseShieldReturn`

## Example

```tsx
function ShieldForm({ wrapperAddress }) {
  const [amount, setAmount] = useState("");

  const {
    shield,
    status,
    isApproving,
    isWrapping,
    isPending,
    error,
    allowance,
  } = useShield({
    wrapperAddress,
    onSuccess: (hash) => console.log("Shielded!", hash),
  });

  const handleSubmit = async () => {
    await shield(BigInt(amount));
  };

  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isApproving ? "Approving..." : isWrapping ? "Wrapping..." : "Shield"}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```
