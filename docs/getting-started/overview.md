# Getting Started Overview

Welcome to the Zama FHE SDK! This guide will help you choose the right package and get started quickly.

## Which Package Should I Use?

### @zama-fhe/react-sdk

**Use this if you're building a React application.**

Works with React, Next.js, and React Native. Provides wagmi-style hooks (`useConfidentialTransfer`, `useConfidentialBalances`, etc.) with TanStack Query integration. Supports wagmi, viem, or ethers.js — pick whichever web3 library you already use.

**[React SDK Documentation](../react-sdk/README.md)**

### @zama-fhe/core-sdk

**Use this for everything else.**

Framework-agnostic — works with Node.js backends, CLI tools, Vue/Svelte/Angular frontends, serverless functions, and vanilla JavaScript. Supports ethers.js or viem.

**[Core SDK Documentation](../core-sdk/README.md)**

## Supported Chains

Both SDKs support Ethereum Mainnet, Sepolia testnet, and local Hardhat development chains.

## Quick Decision Tree

```
Are you building with React?
├─ Yes → @zama-fhe/react-sdk
└─ No  → @zama-fhe/core-sdk
```

## Next Steps

- **[Installation Guide](installation.md)** — Detailed installation instructions
- **[Core SDK Quick Start](core-sdk-quickstart.md)** — Get started with core-sdk
- **[React SDK Quick Start](react-sdk-quickstart.md)** — Get started with react-sdk
