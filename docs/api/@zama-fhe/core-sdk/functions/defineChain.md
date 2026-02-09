[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / defineChain

# Function: defineChain()

> **defineChain**\<`T`\>(`chain`): `T`

Defined in: shared/dist/chains/defineChain.d.ts:19

Helper to define a custom FHE chain configuration.
Similar to wagmi's defineChain but for FHE-enabled networks.

## Type Parameters

### T

`T` *extends* `FhevmChain`

## Parameters

### chain

`T`

## Returns

`T`

## Example

```ts
const myChain = defineChain({
  id: 12345,
  name: 'My Chain',
  network: 'mychain',
  isMock: false,
  aclAddress: '0x...',
  gatewayUrl: 'https://gateway.mychain.com',
  // ...
})
```
