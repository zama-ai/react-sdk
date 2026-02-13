# Function: writeConfidentialTransfer()

```ts
function writeConfidentialTransfer(config: FhevmConfig, params: WriteConfidentialTransferParams): Promise<WriteConfidentialTransferResult>;
```

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:78](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/actions/confidentialTransfer.ts#L78)

Execute a confidential ERC7984 token transfer.

Encrypts the amount and sends a transaction to transfer tokens confidentially.

Works with both ethers.js and viem providers.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `FhevmConfig` |
| `params` | `WriteConfidentialTransferParams` |

## Returns

`Promise`\<`WriteConfidentialTransferResult`\>

## Example

```typescript
// Using ethers.js
import { ethers } from 'ethers'
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const result = await writeConfidentialTransfer(config, {
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

const result = await writeConfidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: client,
})
```
