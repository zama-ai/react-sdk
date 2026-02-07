# confidentialTransfer

Transfer confidential ERC7984 tokens.

## Usage

```typescript
import { confidentialTransfer } from "@zama-fhe/core-sdk";

const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x...",
  to: "0x...",
  amount: 100n,
  provider: wallet,
});
```

See the [API Reference](../../api/modules/_zama-fhe_core-sdk.html) for details.
