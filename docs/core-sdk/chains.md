# Chains

Configure networks for the Core SDK.

## Built-in Chains

```typescript
import { sepolia, hardhatLocal } from "@zama-fhe/core-sdk/chains";
```

## Sepolia Testnet

```typescript
import { sepolia } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [sepolia],
});
```

## Hardhat Local

```typescript
import { hardhatLocal } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [hardhatLocal],
});
```

## Custom Chains

```typescript
import { defineChain } from "@zama-fhe/core-sdk/chains";

const myChain = defineChain({
  chainId: 1234,
  name: "My Chain",
  // ... other properties
});
```

See the [API Reference](../api/modules/_zama-fhe_core-sdk.html) for details.
