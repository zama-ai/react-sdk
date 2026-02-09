# Core SDK Quick Start

Get started with `@zama-fhe/core-sdk` in under 5 minutes.

## Installation

```bash
npm install @zama-fhe/core-sdk ethers
# or
npm install @zama-fhe/core-sdk viem
```

## With ethers.js

### Browser (BrowserProvider)

```typescript
import { createConfig, writeConfidentialTransfer, readConfidentialBalance } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { BrowserProvider } from "ethers";

const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

const provider = new BrowserProvider(window.ethereum!);
const signer = await provider.getSigner();

// Transfer confidential tokens
const result = await writeConfidentialTransfer(config, {
  chainId: sepolia.id,
  contractAddress: "0xTokenContract...",
  to: "0xRecipient...",
  amount: 100n,
  provider: signer,
});

// Read a confidential balance
const balance = await readConfidentialBalance(config, {
  chainId: sepolia.id,
  contractAddress: "0xTokenContract...",
  account: await signer.getAddress(),
  provider: signer,
});
```

### Backend (private key signer)

```typescript
import { createConfig, writeConfidentialTransfer } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const result = await writeConfidentialTransfer(config, {
  chainId: sepolia.id,
  contractAddress: "0xTokenContract...",
  to: "0xRecipient...",
  amount: 100n,
  provider: wallet,
});
```

## With viem

```typescript
import { createConfig, writeConfidentialTransfer, readConfidentialBalance } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia as viemSepolia } from "viem/chains";

const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);
const client = createWalletClient({
  account,
  chain: viemSepolia,
  transport: http(),
});

// Transfer confidential tokens
const result = await writeConfidentialTransfer(config, {
  chainId: sepolia.id,
  contractAddress: "0xTokenContract...",
  to: "0xRecipient...",
  amount: 100n,
  provider: client,
});

// Read a confidential balance
const balance = await readConfidentialBalance(config, {
  chainId: sepolia.id,
  contractAddress: "0xTokenContract...",
  account: account.address,
  provider: client,
});
```

## Next Steps

- [Core SDK Documentation](../core-sdk/README.md)
- [API Reference](../api/@zama-fhe/core-sdk/README.md)
