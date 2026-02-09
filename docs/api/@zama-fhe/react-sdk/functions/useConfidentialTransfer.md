[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useConfidentialTransfer

# Function: useConfidentialTransfer()

> **useConfidentialTransfer**(`options`): `UseConfidentialTransferReturn`

Defined in: [react/useConfidentialTransfer.ts:88](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useConfidentialTransfer.ts#L88)

Hook for executing confidential ERC7984 token transfers.

Now powered by TanStack Query's `useMutation` for automatic state management,
request deduplication, and devtools integration.

Encapsulates the full flow of:
1. Encrypting the transfer amount
2. Signing and submitting the transaction
3. Waiting for confirmation

## Parameters

### options

`UseConfidentialTransferOptions`

## Returns

`UseConfidentialTransferReturn`

## Example

```tsx
function TransferForm({ tokenAddress }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const {
    transfer,
    status,
    isEncrypting,
    isPending,
    error
  } = useConfidentialTransfer({
    contractAddress: tokenAddress,
    onSuccess: (hash) => {
      console.log("Transfer successful:", hash);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await transfer(to as `0x${string}`, BigInt(amount));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button disabled={isPending}>
        {isEncrypting ? "Encrypting..." : isPending ? "Transferring..." : "Transfer"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```
