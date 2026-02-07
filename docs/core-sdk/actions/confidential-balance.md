# confidentialBalance

Read and decrypt confidential token balances.

## Usage

```typescript
import { confidentialBalance } from "@zama-fhe/core-sdk";

const balance = await confidentialBalance(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x...",
  account: "0x...",
  provider,
});
```

See the [API Reference](../../api/modules/_zama-fhe_core-sdk.html) for details.
