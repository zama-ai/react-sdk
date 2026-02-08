# Zama FHE SDK Monorepo

**Framework-agnostic SDKs for Fully Homomorphic Encryption (FHE) on EVM chains**

This monorepo contains the core SDK packages for building FHE-powered applications with Zama's fhEVM.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [@zama-fhe/core-sdk](./packages/core-sdk) | 0.1.0 | Framework-agnostic core SDK (works with ethers.js & viem) |
| [@zama-fhe/react-sdk](./packages/react-sdk) | 0.1.0 | React hooks for FHE operations (works with wagmi, viem, or ethers.js) |

## Quick Start

### For React Applications

```bash
npm install @zama-fhe/react-sdk
```

```typescript
import { FhevmProvider, useConfidentialTransfer } from '@zama-fhe/react-sdk'
import { sepolia } from '@zama-fhe/react-sdk/chains'

function App() {
  return (
    <FhevmProvider config={createFhevmConfig({ chains: [sepolia] })}>
      <YourApp />
    </FhevmProvider>
  )
}
```

### For Node.js/Backend/Other Frameworks

```bash
npm install @zama-fhe/core-sdk ethers
# or
npm install @zama-fhe/core-sdk viem
```

```typescript
import { confidentialTransfer } from '@zama-fhe/core-sdk'
import { ethers } from 'ethers'

const wallet = new ethers.Wallet(privateKey, provider)
const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0x...',
  to: '0x...',
  amount: 100n,
  provider: wallet,
})
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Install Dependencies

```bash
pnpm install
```

### Build All Packages

```bash
pnpm build
```

### Run Tests

```bash
pnpm test
```

### Development Workflow

```bash
# Watch mode for core-sdk
pnpm watch:core

# Watch mode for react-sdk
pnpm watch:react

# Run all checks (CI locally)
pnpm ci
```

## Monorepo Structure

```
zama-fhe-sdk/
├── packages/
│   ├── core-sdk/          # @zama-fhe/core-sdk
│   └── react-sdk/         # @zama-fhe/react-sdk
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI
├── .changeset/            # Changesets for versioning
├── pnpm-workspace.yaml    # pnpm workspace config
├── tsconfig.base.json     # Shared TypeScript config
└── package.json           # Root package with scripts
```

## Package Scripts

### Root Level

- `pnpm build` - Build all packages
- `pnpm test` - Run tests in all packages
- `pnpm lint` - Lint all packages
- `pnpm typecheck` - Type check all packages
- `pnpm ci` - Run full CI suite locally

### Per-Package

- `pnpm build:core` - Build only core-sdk
- `pnpm build:react` - Build only react-sdk
- `pnpm test:core` - Test only core-sdk
- `pnpm test:react` - Test only react-sdk

## Versioning & Releases

This monorepo uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Creating a Changeset

When you make changes to a package:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select which packages changed
2. Choose version bump type (major/minor/patch)
3. Write a description of the changes

### Releasing

```bash
# Bump versions and update CHANGELOGs
pnpm changeset version

# Build and publish to npm
pnpm release
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Create a changeset (`pnpm changeset`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Architecture

```
@zama-fhe/relayer-sdk (Zama)  ← Low-level FHE primitives
         ↓
@zama-fhe/core-sdk            ← Framework-agnostic actions
         ↓
@zama-fhe/react-sdk           ← React hooks layer
         ↓
Your Application              ← dApps, backends, CLIs
```

## License

BSD-3-Clause-Clear

## Links

- [Documentation](https://docs.zama.ai/)
- [GitHub](https://github.com/zama-ai/fhe-sdk)
- [Zama](https://www.zama.ai/)
