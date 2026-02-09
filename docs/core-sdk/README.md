# @zama-fhe/core-sdk

Framework-agnostic SDK for Fully Homomorphic Encryption (FHE) on EVM chains. Works with both **ethers.js** and **viem** — use it for Node.js backends, CLI tools, serverless functions, and non-React frontends.

## Quick Example

```typescript
import { createConfig, writeConfidentialTransfer } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

const config = createConfig({ chains: [sepolia], defaultChain: sepolia });
const wallet = new ethers.Wallet(privateKey, provider);

const result = await writeConfidentialTransfer(config, {
  chainId: sepolia.id,
  contractAddress: "0x1234...",
  to: "0x5678...",
  amount: 100n,
  provider: wallet,
});
```

---

## Installation

```bash
# With ethers.js
npm install @zama-fhe/core-sdk ethers

# With viem
npm install @zama-fhe/core-sdk viem
```

You need either `ethers` (v6) or `viem` (v2) as a peer dependency.

---

## Configuration

```typescript
import { createConfig } from "@zama-fhe/core-sdk";
import { sepolia, mainnet, hardhatLocal } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [sepolia, mainnet, hardhatLocal],
  defaultChain: sepolia,
});
```

| Option | Required | Description |
|--------|----------|-------------|
| `chains` | Yes | Array of chain configurations |
| `defaultChain` | No | Default chain when none is specified in action calls |

---

## Providers

The SDK auto-detects whether you're using ethers.js or viem:

```typescript
// ethers.js — Wallet, Signer, or JsonRpcProvider
const wallet = new ethers.Wallet(pk, provider);
await writeConfidentialTransfer(config, { provider: wallet, ... });

// ethers.js — private key signer for backend use
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, jsonRpcProvider);
await writeConfidentialTransfer(config, { provider: signer, ... });

// viem — WalletClient
const client = createWalletClient({ account, chain, transport: http() });
await writeConfidentialTransfer(config, { provider: client, ... });
```

---

## Chains

### Built-in Chains

| Chain | Chain ID | Import | Mock |
|-------|----------|--------|------|
| **Ethereum Mainnet** | 1 | `mainnet` | No |
| **Sepolia Testnet** | 11155111 | `sepolia` | No |
| **Hardhat Local** | 31337 | `hardhatLocal` | Yes |

```typescript
import { sepolia, mainnet, hardhatLocal } from "@zama-fhe/core-sdk/chains";
```

### Custom Chains

```typescript
import { defineProductionChain } from "@zama-fhe/core-sdk/chains";

const myChain = defineProductionChain({
  id: 1234,
  name: "My Chain",
  network: "mychain",
  aclAddress: "0x...",
  gatewayUrl: "https://gateway.mychain.com",
  kmsVerifierAddress: "0x...",
  inputVerifierAddress: "0x...",
  relayerUrl: "https://relayer.mychain.com",
});
```

---

## Transports

```typescript
import { http, fallback } from "@zama-fhe/core-sdk/transports";

// Single RPC endpoint
const transport = http("https://rpc.example.com");

// Multiple endpoints with automatic failover
const transport = fallback([
  http("https://rpc1.example.com"),
  http("https://rpc2.example.com"),
]);
```

---

## TypeScript Support

```typescript
import type {
  FhevmConfig,
  WriteConfidentialTransferParams,
  EncryptionResult,
} from "@zama-fhe/core-sdk/types";
```

---

## API Reference

See the [TypeScript API Documentation](../api/@zama-fhe/core-sdk/README.md) for the complete API reference.

---

## Support

- **Documentation:** [Full SDK Documentation](../README.md)
- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/fhe-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Security Issues:** Email security@zama.ai (do not open public issues)
