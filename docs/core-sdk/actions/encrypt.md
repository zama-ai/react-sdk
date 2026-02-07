# encrypt

Encrypt values for use in FHE smart contract calls.

## Usage

```typescript
import { encrypt } from "@zama-fhe/core-sdk";

const result = await encrypt(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x...",
  values: [
    { type: "uint64", value: 100n },
    { type: "address", value: "0x..." },
  ],
});
```

See the [API Reference](../../api/modules/_zama-fhe_core-sdk.html) for details.
