# Function: createFhevmConfig()

```ts
function createFhevmConfig(options: FhevmConfigOptions): FhevmConfig;
```

Defined in: [core-sdk/src/config/createConfig.ts:23](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/config/createConfig.ts#L23)

Create an FhevmConfig for use with SDK actions.
Similar to wagmi's createConfig but for FHE operations.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `FhevmConfigOptions` |

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
