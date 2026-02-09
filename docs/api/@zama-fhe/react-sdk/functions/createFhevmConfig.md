[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / createFhevmConfig

# Function: createFhevmConfig()

> **createFhevmConfig**(`options`): `FhevmConfig`

Defined in: [config.ts:133](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/config.ts#L133)

Create an FhevmConfig for use with FhevmProvider.
Similar to wagmi's createConfig but for FHE operations.

## Parameters

### options

`FhevmConfigOptions`

## Returns

`FhevmConfig`

## Example

```ts
import { createFhevmConfig, sepolia, hardhatLocal } from '@zama-fhe/react-sdk'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
})
```
