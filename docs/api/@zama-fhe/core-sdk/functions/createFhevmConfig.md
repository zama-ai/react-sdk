[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / createFhevmConfig

# Function: createFhevmConfig()

> **createFhevmConfig**(`options`): `FhevmConfig`

Defined in: [core-sdk/src/config/createConfig.ts:23](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/config/createConfig.ts#L23)

Create an FhevmConfig for use with SDK actions.
Similar to wagmi's createConfig but for FHE operations.

## Parameters

### options

`FhevmConfigOptions`

## Returns

`FhevmConfig`

## Example

```ts
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
    [hardhatLocal.id]: http('http://localhost:8545'),
  },
})
```
