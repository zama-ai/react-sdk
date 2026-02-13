# Function: defineChain()

```ts
function defineChain<T>(chain: T): T;
```

Defined in: shared/dist/chains/defineChain.d.ts:19

Helper to define a custom FHE chain configuration.
Similar to wagmi's defineChain but for FHE-enabled networks.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `FhevmChain` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `chain` | `T` |

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
