# @zama-fhe/react-sdk

> **React SDK for building applications with Fully Homomorphic Encryption (FHE) on EVM chains**

[![npm version](https://img.shields.io/npm/v/@zama-fhe/react-sdk.svg)](https://www.npmjs.com/package/@zama-fhe/react-sdk)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

---

## 🌟 Overview

`@zama-fhe/react-sdk` provides **wagmi-style React hooks** for encrypting, decrypting, and managing FHE operations in React applications. It integrates seamlessly with wagmi and TanStack Query for a modern, familiar developer experience.

## ✨ Features

- 🎣 **Wagmi-style API** - Familiar patterns for web3 developers
- ⚡ **Auto-initialization** - FHEVM instance managed automatically
- 🔄 **TanStack Query integration** - Built-in caching, refetching, and state management
- 📘 **Full TypeScript support** - Completely typed API with intellisense
- 🌐 **Multiple chain support** - Sepolia testnet and local Hardhat development
- 🔐 **Flexible encryption** - Simple and builder patterns for all FHE types (uint8-256, address, bool)

## Quick Example

```tsx
import { useEncrypt, useFhevmStatus } from "@zama-fhe/react-sdk";
import { useWriteContract } from "wagmi";

function EncryptedTransfer({ contractAddress, tokenAbi }) {
  const { isReady } = useFhevmStatus();
  const { encrypt } = useEncrypt();
  const { writeContract } = useWriteContract();

  const handleTransfer = async (recipient: `0x${string}`, amount: bigint) => {
    // Encrypt values - returns [...handles, proof] for easy destructuring
    const [amountHandle, proof] = await encrypt([
      { type: "uint64", value: amount },
    ], contractAddress);

    if (!amountHandle) return;

    // Send encrypted value to contract
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "transfer",
      args: [recipient, amountHandle, proof],
    });
  };

  return (
    <button
      onClick={() => handleTransfer("0x...", 100n)}
      disabled={!isReady}
    >
      Transfer 100 Tokens
    </button>
  );
}
```

---

## 📦 Installation

```bash
npm install @zama-fhe/react-sdk wagmi viem @tanstack/react-query

# or
pnpm add @zama-fhe/react-sdk wagmi viem @tanstack/react-query

# or
yarn add @zama-fhe/react-sdk wagmi viem @tanstack/react-query
```

---

## 📖 Documentation

### Getting Started

- **[Installation](getting-started/installation.md)** - Set up your project with dependencies
- **[Quick Start](getting-started/quick-start.md)** - Build your first FHE app in 5 minutes

### Configuration

- **[Overview](configuration/overview.md)** - Configure FhevmProvider for your app
- **[Chains](configuration/chains.md)** - Network configuration (Sepolia, Hardhat)
- **[Storage](configuration/storage.md)** ⭐ - Choose storage strategy (localStorage, memory, encrypted)
- **[Threading & Performance](configuration/threading.md)** - Optimize initialization with Web Workers

### Provider

- **[FhevmProvider](provider/fhevm-provider.md)** - Root provider component

### Hooks

**Encryption:**
- [useEncrypt](hooks/use-encrypt.md) - Encrypt values for contract calls

**Transactions:**
- [useConfidentialTransfer](hooks/use-confidential-transfer.md) - Transfer ERC7984 tokens
- [useConfidentialBalances](hooks/use-confidential-balances.md) - Fetch and decrypt balances

**Decryption:**
- [useUserDecrypt](hooks/use-user-decrypt.md) - Decrypt with user authorization
- [usePublicDecrypt](hooks/use-public-decrypt.md) - Decrypt public values
- [useUserDecryptedValue](hooks/use-user-decrypted-value.md) - Higher-level decryption hook

**Utilities:**
- [useFhevmStatus](hooks/use-fhevm-status.md) - Check FHEVM initialization status
- [useFhevmClient](hooks/use-fhevm-client.md) - Access FHEVM instance directly
- [useEthersSigner](hooks/use-ethers-signer.md) - Get ethers.js signer from wagmi *(deprecated)*

### Guides

- **[Security](guides/security.md)** ⭐ - Essential security considerations for production
- **[Error Handling](guides/error-handling.md)** - Handle errors gracefully
- **[Troubleshooting](guides/troubleshooting.md)** - Common issues and solutions

### Reference

- **[Types](types/overview.md)** - TypeScript type definitions
- **[Migration Guide](migration/from-legacy.md)** - Migrate from legacy hooks

---

## 🔒 Security

**Important:** This SDK handles sensitive cryptographic material. Please review the **[Security Guide](guides/security.md)** before deploying to production.

### Quick Security Recommendations

| Environment | Recommended Storage | Security Level |
|-------------|---------------------|----------------|
| **Production** | `sessionStorageAdapter` or `memoryStorage` | ✅ High |
| **Development** | `localStorageAdapter` or `memoryStorage` | ⚠️ Medium |
| **High-Security Apps** | `memoryStorage` or custom encrypted | 🔒 Highest |

**⚠️ Warning:** Both `localStorage` and `sessionStorage` are vulnerable to XSS attacks. For security-critical applications, use `memoryStorage` or implement [encrypted storage](configuration/storage.md#example-encrypted-storage).

---

## 🆘 Support

- **Documentation:** You're reading it! 📖
- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/react-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Security Issues:** Email security@zama.ai (do not open public issues)

---

<div align="center">

**Built with ❤️ by [Zama](https://zama.ai)**

[Website](https://zama.ai) • [GitHub](https://github.com/zama-ai) • [Documentation](https://docs.zama.ai) • [Discord](https://discord.fhe.org)

</div>
