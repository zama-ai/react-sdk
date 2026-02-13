# Function: formatConfidentialAmount()

```ts
function formatConfidentialAmount(
   amount: bigint, 
   decimals: number, 
   maxDisplayDecimals?: number): string;
```

Defined in: [utils/format.ts:10](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/utils/format.ts#L10)

Format a bigint token amount with decimals for display.

## Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `amount` | `bigint` | `undefined` |
| `decimals` | `number` | `undefined` |
| `maxDisplayDecimals` | `number` | `6` |

## Returns

`string`

## Example

```ts
formatConfidentialAmount(4000000n, 6)   // "4"
formatConfidentialAmount(1500000n, 6)   // "1.5"
formatConfidentialAmount(123n, 6)       // "0.000123"
formatConfidentialAmount(0n, 6)         // "0"
```
