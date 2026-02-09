# @zama-fhe/core-sdk

> **Framework-agnostic core SDK for Fully Homomorphic Encryption (FHE) on EVM chains**

[![npm version](https://img.shields.io/npm/v/@zama-fhe/core-sdk.svg)](https://www.npmjs.com/package/@zama-fhe/core-sdk)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## Overview

`@zama-fhe/core-sdk` provides **framework-agnostic actions** for encrypting, decrypting, and managing FHE operations. It works with both **ethers.js** and **viem**, making it perfect for Node.js backends, CLI tools, and non-React frontends.

## Features

- **Framework-agnostic** - Works with any JavaScript/TypeScript framework
- **Dual provider support** - Use ethers.js or viem
- **Full TypeScript support** - Completely typed API
- **Multiple chain support** - Sepolia testnet and local Hardhat
- **Flexible encryption** - Support for all FHE types (uint8-256, address, bool)
- **Lightweight** - No React or UI dependencies

## Quick Example

### With ethers.js

```typescript
import { confidentialTransfer, createConfig } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

// Create config
const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

// Create wallet/signer
const wallet = new ethers.Wallet(privateKey, provider);

// Transfer confidential tokens
const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x1234...",
  to: "0x5678...",
  amount: 100n,
  provider: wallet,
});
```

### With viem

```typescript
import { confidentialTransfer, createConfig } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { createWalletClient, http } from "viem";

// Create config
const config = createConfig({
  chains: [sepolia],
  defaultChain: sepolia,
});

// Create wallet client
const client = createWalletClient({
  chain: sepolia,
  transport: http(),
});

// Transfer confidential tokens
const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: "0x1234...",
  to: "0x5678...",
  amount: 100n,
  provider: client,
});
```

---

## Installation

```bash
npm install @zama-fhe/core-sdk ethers
# or
npm install @zama-fhe/core-sdk viem

# Using pnpm
pnpm add @zama-fhe/core-sdk ethers
# or
pnpm add @zama-fhe/core-sdk viem
```

**Note:** You need to install either `ethers` (v6) or `viem` (v2) as a peer dependency.

---

## Configuration

Use `createConfig()` to create a configuration object:

```typescript
import { createConfig } from "@zama-fhe/core-sdk";
import { sepolia, hardhatLocal } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [sepolia, hardhatLocal],
  defaultChain: sepolia,
});
```

### Configuration Options

| Option | Required | Description |
|--------|----------|-------------|
| `chains` | Yes | Array of chain objects defining the networks your app supports |
| `defaultChain` | No | The default chain to use when none is specified in action calls |

Pass the configuration object to all SDK actions:

```typescript
import { confidentialTransfer } from "@zama-fhe/core-sdk";

const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  // ... other params
});
```

---

## Providers

The SDK automatically detects whether you're using ethers.js or viem:

```typescript
// Ethers.js
const wallet = new ethers.Wallet(pk, provider);
await confidentialTransfer(config, { provider: wallet, ... });

// Viem
const client = createWalletClient({ chain, transport: http() });
await confidentialTransfer(config, { provider: client, ... });
```

---

## Chains

### Built-in Chains

| Chain | Chain ID | Mock |
|-------|----------|------|
| **Sepolia Testnet** | 11155111 | No |
| **Hardhat Local** | 31337 | Yes |

```typescript
import { sepolia, hardhatLocal } from "@zama-fhe/core-sdk/chains";
```

### Custom Chains

Define custom chains with `defineChain`:

```typescript
import { defineChain } from "@zama-fhe/core-sdk/chains";

const myChain = defineChain({
  chainId: 1234,
  name: "My Chain",
  // ... other properties
});
```

---

## Transports

### HTTP Transport

```typescript
import { http } from "@zama-fhe/core-sdk/transports";

const transport = http("https://rpc.example.com");
```

### Fallback Transport

Use multiple RPC endpoints with automatic failover:

```typescript
import { fallback, http } from "@zama-fhe/core-sdk/transports";

const transport = fallback([
  http("https://rpc1.example.com"),
  http("https://rpc2.example.com"),
]);
```

---

## Use Cases

### Node.js Backend

```typescript
import { confidentialBalance, createConfig } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

const config = createConfig({ chains: [sepolia] });
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

async function getBalance(address: string) {
  return await confidentialBalance(config, {
    chainId: sepolia.chainId,
    contractAddress: process.env.TOKEN_ADDRESS!,
    account: address,
    provider,
  });
}
```

### CLI Tools

```typescript
#!/usr/bin/env node
import { confidentialTransfer, createConfig } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { ethers } from "ethers";

const config = createConfig({ chains: [sepolia] });
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const [to, amount] = process.argv.slice(2);
await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  contractAddress: process.env.TOKEN_ADDRESS!,
  to,
  amount: BigInt(amount),
  provider: wallet,
});
```

### Non-React Frontends

Use with Vue, Svelte, Angular, or vanilla JavaScript:

```typescript
import { encrypt, createConfig } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";

const config = createConfig({ chains: [sepolia] });

// In your Vue/Svelte component
async function handleSubmit() {
  const encrypted = await encrypt(config, {
    chainId: sepolia.chainId,
    contractAddress: tokenAddress,
    values: [{ type: "uint64", value: 100n }],
  });
  // Send to contract...
}
```

---

## TypeScript Support

The SDK is written in TypeScript and provides complete type definitions:

```typescript
import type {
  FhevmConfig,
  ConfidentialTransferParams,
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

---

## Related Packages

- **[@zama-fhe/react-sdk](../react-sdk/README.md)** - React hooks for FHE operations
