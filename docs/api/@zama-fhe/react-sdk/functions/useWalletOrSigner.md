# Function: useWalletOrSigner()

```ts
function useWalletOrSigner(): WalletActions;
```

Defined in: [react/useWalletOrSigner.ts:74](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/react/useWalletOrSigner.ts#L74)

Bridge hook that returns a unified WalletActions interface.

- If `wallet` is available in context → uses wallet directly + RPC for reads/receipts
- Otherwise → falls back to useEthersSigner (ethers.js path)

This allows hooks to be migrated incrementally without duplicating logic.

## Returns

`WalletActions`
