[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / fallback

# Function: fallback()

> **fallback**(`transports`): `Transport`

Defined in: [core-sdk/src/transports/fallback.ts:17](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/transports/fallback.ts#L17)

Create a fallback transport that tries multiple transports in order.

If the first transport fails, it will try the next one, and so on.

## Parameters

### transports

`Transport`[]

## Returns

`Transport`

## Example

```typescript
const transport = fallback([
  http('https://eth-mainnet.g.alchemy.com/v2/...'),
  http('https://cloudflare-eth.com'),
  http('https://rpc.ankr.com/eth'),
])
```
