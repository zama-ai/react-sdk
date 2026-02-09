# Zama FHE SDK Documentation

**Complete documentation for building privacy-preserving applications with Fully Homomorphic Encryption (FHE) on EVM chains**

---

## Documentation Structure

### Getting Started
Choose the right SDK and get up and running quickly.

- **[Overview](getting-started/overview.md)** - Which package should you use?
- **[Installation](getting-started/installation.md)** - Installing SDK packages
- **[Core SDK Quick Start](getting-started/core-sdk-quickstart.md)** - Framework-agnostic usage
- **[React SDK Quick Start](getting-started/react-sdk-quickstart.md)** - React applications

### Package Documentation

#### [@zama-fhe/core-sdk](core-sdk/README.md)
Framework-agnostic core SDK that works with ethers.js and viem.

#### [@zama-fhe/react-sdk](react-sdk/README.md)
React hooks for FHE operations with wagmi-style API.

- **[Configuration](react-sdk/configuration/)** - Chains, storage, threading
- **[Provider](react-sdk/provider/)** - FhevmProvider setup
- **[Hooks](react-sdk/hooks/)** - All available hooks


### API Reference
Auto-generated TypeScript API documentation in Markdown.

- **[API Documentation](api/README.md)** - Complete API reference for all packages
- **[@zama-fhe/core-sdk API](api/@zama-fhe/core-sdk/README.md)** - Core SDK API reference
- **[@zama-fhe/react-sdk API](api/@zama-fhe/react-sdk/README.md)** - React SDK API reference

---

## Quick Links

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

## Architecture Overview

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

## Package Overview

| Package | Use Case | Dependencies |
|---------|----------|--------------|
| **@zama-fhe/core-sdk** | Framework-agnostic FHE | ethers.js or viem |
| **@zama-fhe/react-sdk** | React applications | @tanstack/react-query + ethers/viem/wagmi (flexible) |

---

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/fhe-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Security Issues:** Email security@zama.ai (do not open public issues)
