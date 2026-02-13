# Function: fallback()

```ts
function fallback(transports: Transport[]): Transport;
```

Defined in: [core-sdk/src/transports/fallback.ts:17](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/transports/fallback.ts#L17)

Create a fallback transport that tries multiple transports in order.

If the first transport fails, it will try the next one, and so on.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `transports` | `Transport`[] |

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
