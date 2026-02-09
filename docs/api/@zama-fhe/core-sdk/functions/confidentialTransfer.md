[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / confidentialTransfer

# Function: confidentialTransfer()

> **confidentialTransfer**(`config`, `params`): `Promise`\<`ConfidentialTransferResult`\>

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:78](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/actions/confidentialTransfer.ts#L78)

Execute a confidential ERC7984 token transfer.

Encrypts the amount and sends a transaction to transfer tokens confidentially.

Works with both ethers.js and viem providers.

## Parameters

### config

`FhevmConfig`

### params

`ConfidentialTransferParams`

## Returns

`Promise`\<`ConfidentialTransferResult`\>

## Example

```typescript
// Using ethers.js
import { ethers } from 'ethers'
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: signer,
})

// Using viem
import { createWalletClient, custom } from 'viem'
const client = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: client,
})
```
