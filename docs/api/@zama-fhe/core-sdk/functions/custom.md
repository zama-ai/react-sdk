# Function: custom()

```ts
function custom(config: CustomTransportConfig): Transport;
```

Defined in: [core-sdk/src/transports/custom.ts:22](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/transports/custom.ts#L22)

Create a custom transport with a provided provider.

Use this when you want to provide your own ethers provider, viem client,
or other custom provider.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | `CustomTransportConfig` |

## Returns

`Transport`

## Example

```typescript
// With ethers
import { ethers } from 'ethers'
const provider = new ethers.JsonRpcProvider('https://...')
const transport = custom({ provider })

// With viem
import { createPublicClient, http } from 'viem'
const client = createPublicClient({ chain: sepolia, transport: http() })
const transport = custom({ provider: client })
```
