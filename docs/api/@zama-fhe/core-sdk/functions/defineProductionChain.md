# Function: defineProductionChain()

```ts
function defineProductionChain(chain: Omit<FhevmProductionChain, "isMock">): FhevmProductionChain;
```

Defined in: shared/dist/chains/defineChain.d.ts:28

Helper to define a production chain with full FHE infrastructure.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `chain` | `Omit`\<`FhevmProductionChain`, `"isMock"`\> |

## Returns

`FhevmProductionChain`
