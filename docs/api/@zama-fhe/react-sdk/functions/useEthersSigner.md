[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useEthersSigner

# ~~Function: useEthersSigner()~~

> **useEthersSigner**(): `UseEthersSignerReturn`

Defined in: [react/useEthersSigner.ts:69](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useEthersSigner.ts#L69)

Hook to get an ethers signer from the FhevmProvider context provider.

Uses the EIP-1193 provider from FhevmContext (falling back to window.ethereum)
and the connected wallet address to create an ethers JsonRpcSigner.

## Returns

`UseEthersSignerReturn`

## Examples

```tsx
function SignMessage() {
  const { signer, isReady, isLoading, error } = useEthersSigner()

  const handleSign = async () => {
    if (!signer) return
    const signature = await signer.signMessage('Hello!')
    console.log(signature)
  }

  if (isLoading) return <p>Loading signer...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!isReady) return <p>Connect your wallet</p>

  return <button onClick={handleSign}>Sign Message</button>
}
```

```tsx
// Use with ethers contracts
function ContractInteraction() {
  const { signer, isReady } = useEthersSigner()

  const sendTransaction = async () => {
    if (!signer) return

    const contract = new ethers.Contract(address, abi, signer)
    await contract.someFunction()
  }
}
```
