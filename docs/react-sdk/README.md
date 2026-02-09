# @zama-fhe/react-sdk

React hooks for Fully Homomorphic Encryption (FHE) on EVM chains, with a wagmi-style API. Works with **wagmi, viem, or ethers.js** — pick whichever web3 library you already use.

## Quick Example

```tsx
import { useConfidentialTransfer } from "@zama-fhe/react-sdk";

function Transfer({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { transfer, isEncrypting, isSigning, isSuccess, error } =
    useConfidentialTransfer({ contractAddress });

  return (
    <button onClick={() => transfer("0xRecipient...", 100n)} disabled={isEncrypting || isSigning}>
      Transfer 100 Tokens
    </button>
  );
}
```

---

## Installation

```bash
npm install @zama-fhe/react-sdk @tanstack/react-query
```

| Setup | Extra install | Notes |
|-------|-------------|-------|
| **ethers.js only** | *(nothing)* | ethers is bundled |
| **viem only** | `npm install viem` | Use viem `WalletClient` + `FhevmWallet` |
| **wagmi + viem** | `npm install wagmi viem` | Recommended for React |
| **wagmi + ethers** | `npm install wagmi viem` | wagmi requires viem; SDK uses ethers internally |

---

## Documentation

### Getting Started

- **[Installation](../getting-started/installation.md)**
- **[Quick Start](../getting-started/react-sdk-quickstart.md)** — Setup examples for wagmi, viem, and ethers

### Configuration

- **[Overview](configuration/overview.md)** — Configure FhevmProvider
- **[Chains](configuration/chains.md)** — Mainnet, Sepolia, Hardhat, custom chains
- **[Storage](configuration/storage.md)** — Signature caching (memory, custom)
- **[Threading & Performance](configuration/threading.md)** — Web Workers optimization

### Provider

- **[FhevmProvider](provider/fhevm-provider.md)** — Root provider component and all props

### Hooks API

See the **[API Reference](../api/@zama-fhe/react-sdk/README.md)** for complete hook documentation, parameters, and return types.

### Guides

- **[Security](guides/security.md)** — Storage security and custom implementations
- **[Error Handling](guides/error-handling.md)**
- **[Troubleshooting](guides/troubleshooting.md)**

### Reference

- **[Types](types/overview.md)** — TypeScript type definitions

---

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/zama-ai/fhe-sdk/issues)
- **Discord:** [Join our community](https://discord.fhe.org)
- **Security Issues:** Email security@zama.ai (do not open public issues)
