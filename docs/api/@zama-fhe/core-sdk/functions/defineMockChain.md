# Function: defineMockChain()

```ts
function defineMockChain(chain: Omit<FhevmMockChain, "isMock">): FhevmMockChain;
```

Defined in: shared/dist/chains/defineChain.d.ts:24

Helper to define a mock chain (local development).
Mock chains auto-fetch contract addresses from the hardhat node.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `chain` | `Omit`\<`FhevmMockChain`, `"isMock"`\> |

## Returns

`FhevmMockChain`
