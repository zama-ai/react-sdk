# Zama FHE SDK Documentation

**Build privacy-preserving applications with Fully Homomorphic Encryption (FHE) on EVM chains.**

---

## Getting Started

- **[Overview](getting-started/overview.md)** — Which package should you use?
- **[Installation](getting-started/installation.md)** — Install SDK packages
- **[Core SDK Quick Start](getting-started/core-sdk-quickstart.md)** — Framework-agnostic usage
- **[React SDK Quick Start](getting-started/react-sdk-quickstart.md)** — React applications

## Package Documentation

### [@zama-fhe/core-sdk](core-sdk/README.md)

Framework-agnostic SDK — works with ethers.js or viem.

### [@zama-fhe/react-sdk](react-sdk/README.md)

React hooks for FHE with wagmi-style API.

- **[Configuration](react-sdk/configuration/overview.md)** — Chains, storage, threading
- **[Provider](react-sdk/provider/fhevm-provider.md)** — FhevmProvider setup
- **[Guides](react-sdk/guides/security.md)** — Security, error handling, troubleshooting

## API Reference

Auto-generated TypeScript API documentation.

- **[@zama-fhe/core-sdk API](api/@zama-fhe/core-sdk/README.md)**
- **[@zama-fhe/react-sdk API](api/@zama-fhe/react-sdk/README.md)**

---

## Quick Links

| I want to build... | Start here |
|---------------------|------------|
| React / Next.js app | [@zama-fhe/react-sdk](react-sdk/README.md) |
| Node.js backend or CLI | [@zama-fhe/core-sdk](core-sdk/README.md) |
| Vue / Svelte / Angular | [@zama-fhe/core-sdk](core-sdk/README.md) |

## Architecture

```
@fhevm/relayer-sdk        ← Low-level FHE primitives (Zama)
        ↓
@zama-fhe/core-sdk        ← Framework-agnostic actions (ethers.js or viem)
        ↓
@zama-fhe/react-sdk       ← React hooks layer
        ↓
Your Application
```

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/fhe-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Security Issues:** Email security@zama.ai (do not open public issues)
