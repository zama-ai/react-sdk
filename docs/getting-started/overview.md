# Getting Started Overview

Welcome to the Zama FHE SDK! This guide will help you choose the right package and get started quickly.

## Which Package Should I Use?

### @zama-fhe/react-sdk
**Use this if you're building a React application**

✅ **Perfect for:**
- React frontends
- Next.js applications
- React Native apps
- Any React-based framework

✨ **Features:**
- Wagmi-style hooks (`useEncrypt`, `useConfidentialTransfer`, etc.)
- TanStack Query integration for caching
- Auto-initialization of FHEVM instance
- React Suspense support

📖 **[React SDK Documentation](../react-sdk/README.md)**

---

### @zama-fhe/core-sdk
**Use this for everything else**

✅ **Perfect for:**
- Node.js backends
- CLI tools
- Vue/Svelte/Angular frontends
- Vanilla JavaScript applications
- Express/Fastify servers
- Serverless functions

✨ **Features:**
- Framework-agnostic
- Works with ethers.js or viem
- Lightweight (no UI dependencies)
- Full TypeScript support

📖 **[Core SDK Documentation](../core-sdk/README.md)**

---

## Quick Decision Tree

```
Are you building with React?
├─ Yes → Use @zama-fhe/react-sdk
└─ No  → Use @zama-fhe/core-sdk
```

---

## Installation

### React SDK

```bash
npm install @zama-fhe/react-sdk wagmi viem @tanstack/react-query
```

### Core SDK

```bash
npm install @zama-fhe/core-sdk ethers
# or
npm install @zama-fhe/core-sdk viem
```

---

## Next Steps

- **[Installation Guide](installation.md)** - Detailed installation instructions
- **[Core SDK Quick Start](core-sdk-quickstart.md)** - Get started with core-sdk
- **[React SDK Quick Start](react-sdk-quickstart.md)** - Get started with react-sdk
