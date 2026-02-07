# Providers

The Core SDK works with both ethers.js and viem providers.

## Ethers.js Providers

```typescript
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// Use wallet as provider in SDK actions
await confidentialTransfer(config, {
  provider: wallet,
  // ...
});
```

## Viem Clients

```typescript
import { createWalletClient, http } from "viem";

const client = createWalletClient({
  chain: sepolia,
  transport: http(),
});

// Use client as provider in SDK actions
await confidentialTransfer(config, {
  provider: client,
  // ...
});
```

See the [API Reference](../api/modules/_zama-fhe_core-sdk.html) for details.
