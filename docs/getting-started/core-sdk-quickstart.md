# Core SDK Quick Start

Get started with `@zama-fhe/core-sdk` in under 5 minutes.

## Installation

```bash
npm install @zama-fhe/core-sdk ethers
# or
npm install @zama-fhe/core-sdk viem
```

## Basic Setup

### With ethers.js

```typescript
import { createConfig, confidentialTransfer } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

// 1. Create configuration
const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

// 2. Create wallet
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// 3. Transfer confidential tokens
const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x...",
  to: "0x...",
  amount: 100n,
  provider: wallet,
});

console.log("Transfer successful:", result);
```

### With viem

```typescript
import { createConfig, confidentialTransfer } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// 1. Create configuration
const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

// 2. Create wallet client
const account = privateKeyToAccount(process.env.PRIVATE_KEY!);
const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(),
});

// 3. Transfer confidential tokens
const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x...",
  to: "0x...",
  amount: 100n,
  provider: client,
});

console.log("Transfer successful:", result);
```

## Next Steps

- Learn about [Configuration](../core-sdk/config.md)
- Explore [Actions](../core-sdk/actions/)
- Read about [Providers](../core-sdk/providers.md)
