[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / useWalletOrSigner

# Function: useWalletOrSigner()

> **useWalletOrSigner**(): `WalletActions`

Defined in: [react/useWalletOrSigner.ts:74](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/react/useWalletOrSigner.ts#L74)

Bridge hook that returns a unified WalletActions interface.

- If `wallet` is available in context → uses wallet directly + RPC for reads/receipts
- Otherwise → falls back to useEthersSigner (ethers.js path)

This allows hooks to be migrated incrementally without duplicating logic.

## Returns

`WalletActions`
