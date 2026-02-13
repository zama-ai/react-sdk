# Function: http()

```ts
function http(config?: string | HttpTransportConfig): Transport;
```

Defined in: [core-sdk/src/transports/http.ts:13](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/transports/http.ts#L13)

Create an HTTP transport for JSON-RPC connections.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `config?` | `string` \| `HttpTransportConfig` |

## Returns

`Transport`

## Example

```typescript
const transport = http()
const transport = http({ url: 'https://eth.llamarpc.com' })
const transport = http({ timeout: 10_000 })
```
