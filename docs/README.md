# Zama FHE SDK Documentation

**Complete documentation for building privacy-preserving applications with Fully Homomorphic Encryption (FHE) on EVM chains**

---

## 📚 Documentation Structure

### Getting Started
Choose the right SDK and get up and running quickly.

- **[Overview](getting-started/overview.md)** - Which package should you use?
- **[Installation](getting-started/installation.md)** - Installing SDK packages
- **[Core SDK Quick Start](getting-started/core-sdk-quickstart.md)** - Framework-agnostic usage
- **[React SDK Quick Start](getting-started/react-sdk-quickstart.md)** - React applications

### Package Documentation

#### [@zama-fhe/core-sdk](core-sdk/README.md)
Framework-agnostic core SDK that works with ethers.js and viem.

- **[Actions](core-sdk/actions/)** - Encrypt, transfer, read balances
- **[Configuration](core-sdk/config.md)** - Configure the SDK
- **[Providers](core-sdk/providers.md)** - Ethers and Viem integration
- **[Chains](core-sdk/chains.md)** - Network configuration
- **[Transports](core-sdk/transports.md)** - RPC transport setup

#### [@zama-fhe/react-sdk](react-sdk/README.md)
React hooks for FHE operations with wagmi-style API.

- **[Getting Started](react-sdk/getting-started/)** - Installation and quick start
- **[Configuration](react-sdk/configuration/)** - Chains, storage, threading
- **[Provider](react-sdk/provider/)** - FhevmProvider setup
- **[Hooks](react-sdk/hooks/)** - All available hooks
- **[Guides](react-sdk/guides/)** - Security, error handling, troubleshooting
- **[Migration](react-sdk/migration/)** - Migrate from legacy versions

### API Reference
Auto-generated TypeScript API documentation in Markdown.

- **[API Documentation](api/README.md)** - Complete API reference for all packages
- **[@zama-fhe/core-sdk API](api/@zama-fhe/core-sdk/README.md)** - Core SDK API reference
- **[@zama-fhe/react-sdk API](api/@zama-fhe/react-sdk/README.md)** - React SDK API reference

### Guides
Cross-cutting topics and best practices.

- **[Architecture](guides/architecture.md)** - How the SDK packages work together
- **[Choosing a Package](guides/choosing-a-package.md)** - Decision guide
- **[Security Best Practices](guides/security-best-practices.md)** - Production security
- **[Contributing](guides/contributing.md)** - How to contribute

---

## 🚀 Quick Links

### I want to build...

**React Application**
→ Start with [@zama-fhe/react-sdk](react-sdk/README.md)

**Node.js Backend**
→ Start with [@zama-fhe/core-sdk](core-sdk/README.md)

**Next.js Application**
→ Start with [@zama-fhe/react-sdk](react-sdk/README.md)

**Vue/Svelte Application**
→ Start with [@zama-fhe/core-sdk](core-sdk/README.md)

**CLI Tool**
→ Start with [@zama-fhe/core-sdk](core-sdk/README.md)

---

## 📖 Documentation Formats

This documentation is available in multiple formats:

- **Markdown** - You're reading it! Browse on GitHub or locally
- **API Reference** - TypeDoc-generated Markdown API docs at [api/](api/README.md)
- **GitBook** - Ready to deploy with GitBook for enhanced navigation

---

## 🆘 Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/fhe-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Documentation:** You're here! 📖
- **Security Issues:** Email security@zama.ai (do not open public issues)

---

## 🏗️ Architecture Overview

```
@fhevm/relayer-sdk        ← Low-level FHE primitives (Zama)
        ↓
@zama-fhe/core-sdk        ← Framework-agnostic actions (ethers.js or viem)
        ↓
@zama-fhe/react-sdk       ← React hooks layer
        ↓
Your Application          ← dApps, backends, CLIs
```

---

## 📦 Package Overview

| Package | Use Case | Dependencies |
|---------|----------|--------------|
| **@zama-fhe/core-sdk** | Framework-agnostic FHE | ethers.js or viem |
| **@zama-fhe/react-sdk** | React applications | @tanstack/react-query + ethers/viem/wagmi (flexible) |

---

<div align="center">

**Built with ❤️ by [Zama](https://zama.ai)**

[Website](https://zama.ai) • [GitHub](https://github.com/zama-ai) • [Documentation](https://docs.zama.ai) • [Discord](https://discord.fhe.org)

</div>
