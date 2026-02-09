[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / formatConfidentialAmount

# Function: formatConfidentialAmount()

> **formatConfidentialAmount**(`amount`, `decimals`, `maxDisplayDecimals?`): `string`

Defined in: [utils/format.ts:10](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/utils/format.ts#L10)

Format a bigint token amount with decimals for display.

## Parameters

### amount

`bigint`

### decimals

`number`

### maxDisplayDecimals?

`number` = `6`

## Returns

`string`

## Example

```ts
formatConfidentialAmount(4000000n, 6)   // "4"
formatConfidentialAmount(1500000n, 6)   // "1.5"
formatConfidentialAmount(123n, 6)       // "0.000123"
formatConfidentialAmount(0n, 6)         // "0"
```
