# Function: usePublicDecrypt()

```ts
function usePublicDecrypt(params: PublicDecryptParams | undefined): UsePublicDecryptReturn;
```

Defined in: [react/usePublicDecrypt.ts:149](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/usePublicDecrypt.ts#L149)

Hook for public decryption of FHE encrypted values.

Public decryption reveals values to everyone - use this when:
- The value should be visible on-chain (e.g., auction results)
- You need to pass decrypted values to a contract callback
- No user-specific privacy is required

**Important:** Values must be marked as publicly decryptable on-chain
using `FHE.makePubliclyDecryptable(handle)` before calling this hook.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `params` | `PublicDecryptParams` \| `undefined` |

## Returns

`UsePublicDecryptReturn`

## Examples

```tsx
// Basic usage
function AuctionResult({ handles }) {
  const { decrypt, clearValues, isDecrypting, canDecrypt } = usePublicDecrypt({
    handles
  });

  return (
    <div>
      <p>Winner: {clearValues[handles[0]]?.toString() ?? 'Hidden'}</p>
      <button onClick={decrypt} disabled={!canDecrypt}>
        {isDecrypting ? 'Revealing...' : 'Reveal Result'}
      </button>
    </div>
  );
}
```

```tsx
// With contract callback
function RevealAndCallback({ handles, contractAddress }) {
  const { decryptAsync, canDecrypt } = usePublicDecrypt({ handles });
  const { writeContract } = useWriteContract();

  const handleReveal = async () => {
    const result = await decryptAsync();
    if (!result) return;

    // Call contract with proof
    await writeContract({
      address: contractAddress,
      abi: myContractAbi,
      functionName: 'callbackDecrypt',
      args: [
        handles,
        result.abiEncodedClearValues,
        result.decryptionProof
      ]
    });
  };

  return (
    <button onClick={handleReveal} disabled={!canDecrypt}>
      Reveal & Submit
    </button>
  );
}
```
