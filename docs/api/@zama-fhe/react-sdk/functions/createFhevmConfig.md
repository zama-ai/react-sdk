# Function: createFhevmConfig()

```ts
function createFhevmConfig(options: FhevmConfigOptions): FhevmConfig;
```

Defined in: [config.ts:133](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/config.ts#L133)

Create an FhevmConfig for use with FhevmProvider.
Similar to wagmi's createConfig but for FHE operations.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `FhevmConfigOptions` |

## Returns

`FhevmConfig`

## Example

```ts
import { createFhevmConfig, sepolia, hardhatLocal } from '@zama-fhe/react-sdk'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
})
```
