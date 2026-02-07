# Installation

This guide covers installation instructions for all Zama FHE SDK packages.

## React SDK

For React applications:

```bash
npm install @zama-fhe/react-sdk wagmi viem @tanstack/react-query

# or using pnpm
pnpm add @zama-fhe/react-sdk wagmi viem @tanstack/react-query

# or using yarn
yarn add @zama-fhe/react-sdk wagmi viem @tanstack/react-query
```

**Required peer dependencies:**
- `wagmi` ^2.0.0
- `viem` ^2.0.0
- `@tanstack/react-query` ^5.0.0

See the [React SDK documentation](../react-sdk/getting-started/installation.md) for detailed setup instructions.

---

## Core SDK

For Node.js, CLI tools, and other frameworks:

### With ethers.js

```bash
npm install @zama-fhe/core-sdk ethers

# or using pnpm
pnpm add @zama-fhe/core-sdk ethers

# or using yarn
yarn add @zama-fhe/core-sdk ethers
```

### With viem

```bash
npm install @zama-fhe/core-sdk viem

# or using pnpm
pnpm add @zama-fhe/core-sdk viem

# or using yarn
yarn add @zama-fhe/core-sdk viem
```

**Required peer dependencies:**
- Either `ethers` ^6.0.0 OR `viem` ^2.0.0

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **pnpm** >= 8.0.0 or **yarn** >= 1.22.0

---

## Verify Installation

After installation, verify the packages are installed correctly:

```bash
npm list @zama-fhe/react-sdk
# or
npm list @zama-fhe/core-sdk
```

---

## Next Steps

- **React developers:** Continue to [React SDK Quick Start](react-sdk-quickstart.md)
- **Other frameworks:** Continue to [Core SDK Quick Start](core-sdk-quickstart.md)
