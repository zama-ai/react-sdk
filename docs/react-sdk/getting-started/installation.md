# Installation

## Requirements

- Node.js >= 18
- React >= 18
- @tanstack/react-query >= 5.0

## Install the Package

```bash
npm install @zama-fhe/react-sdk @tanstack/react-query
```

Or with pnpm:

```bash
pnpm add @zama-fhe/react-sdk @tanstack/react-query
```

Or with yarn:

```bash
yarn add @zama-fhe/react-sdk @tanstack/react-query
```

## Choose Your Web3 Library

`@zama-fhe/react-sdk` works with wagmi, viem, or ethers.js. Pick the setup that matches your project:

### wagmi + viem (recommended for React)

```bash
npm install wagmi viem
```

Best if you're building a React app with wallet connection UI (RainbowKit, ConnectKit, etc.).

### viem only

```bash
npm install viem
```

Use this if you want viem's type-safe APIs without the wagmi React layer.

### ethers.js only

No extra install needed — ethers.js is bundled with `@zama-fhe/react-sdk`.

Best for projects already using ethers.js or migrating from older web3 stacks.

## Next Steps

Once installed, follow the [Quick Start](quick-start.md) guide to set up your first FHE application.

For performance optimization, see [Threading & Performance](../configuration/threading.md) to understand the trade-offs between multi-threaded and single-threaded encryption modes.
