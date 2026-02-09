[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / custom

# Function: custom()

> **custom**(`config`): `Transport`

Defined in: [core-sdk/src/transports/custom.ts:22](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/transports/custom.ts#L22)

Create a custom transport with a provided provider.

Use this when you want to provide your own ethers provider, viem client,
or other custom provider.

## Parameters

### config

`CustomTransportConfig`

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
