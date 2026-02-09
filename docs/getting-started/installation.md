# Installation

## React SDK

```bash
npm install @zama-fhe/react-sdk @tanstack/react-query
```

Then install your preferred web3 library:

| Setup | Install command | Notes |
|-------|----------------|-------|
| **ethers.js only** | *(nothing extra)* | ethers is bundled with the SDK |
| **viem only** | `npm install viem` | Use viem `WalletClient` + `FhevmWallet` |
| **wagmi + viem** | `npm install wagmi viem` | Recommended for React — use `useAccount` / `useConnectorClient` |
| **wagmi + ethers** | `npm install wagmi viem` | wagmi requires viem; SDK uses ethers internally |

See the [React SDK Quick Start](react-sdk-quickstart.md) for setup examples for each mode.

---

## Core SDK

### With ethers.js

```bash
npm install @zama-fhe/core-sdk ethers
```

### With viem

```bash
npm install @zama-fhe/core-sdk viem
```

**Peer dependencies:** Either `ethers` ^6.0.0 OR `viem` ^2.0.0.

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **pnpm** >= 8.0.0 or **yarn** >= 1.22.0

---

## Next Steps

- **React developers:** [React SDK Quick Start](react-sdk-quickstart.md)
- **Other frameworks:** [Core SDK Quick Start](core-sdk-quickstart.md)
