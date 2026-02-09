[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / http

# Function: http()

> **http**(`config?`): `Transport`

Defined in: [core-sdk/src/transports/http.ts:13](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/transports/http.ts#L13)

Create an HTTP transport for JSON-RPC connections.

## Parameters

### config?

`string` | `HttpTransportConfig`

## Returns

`Transport`

## Example

```typescript
const transport = http()
const transport = http({ url: 'https://eth.llamarpc.com' })
const transport = http({ timeout: 10_000 })
```
