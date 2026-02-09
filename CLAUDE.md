# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pnpm workspace monorepo for Zama's FHE (Fully Homomorphic Encryption) SDK packages targeting EVM chains.

```
@zama-fhe/relayer-sdk (external)  ← Low-level FHE primitives from Zama
        ↓
@zama-fhe/shared (private)        ← Internal: ABIs, chain defs, types, utils
        ↓
@zama-fhe/core-sdk (public)       ← Framework-agnostic actions (ethers or viem)
        ↓
@zama-fhe/react-sdk (public)      ← React hooks layer
```

## Commands

All commands run from repo root unless noted. Build order matters: shared must build before core-sdk, core-sdk before react-sdk. `pnpm build` handles this automatically.

```bash
pnpm install              # Install all dependencies
pnpm build                # Build all packages in dependency order
pnpm build:shared         # Build @zama-fhe/shared only
pnpm build:core           # Build @zama-fhe/core-sdk only
pnpm build:react          # Build @zama-fhe/react-sdk only
pnpm test                 # Run all tests
pnpm test:core            # core-sdk tests only
pnpm test:react           # react-sdk tests only
pnpm lint                 # Lint all packages
pnpm typecheck            # Type check all packages
pnpm ci                   # Full CI: build + typecheck + lint + test
pnpm clean                # Remove all dist/ and node_modules
pnpm docs:gen             # Generate TypeDoc API docs to docs/api/
pnpm docs:serve           # Build and serve docs locally
```

### Running a Single Test

```bash
# From package directory
cd packages/core-sdk && pnpm test test/config/createConfig.test.ts

# From root using filter
pnpm --filter @zama-fhe/core-sdk test test/config/createConfig.test.ts
```

### React SDK Extra Test Commands

```bash
cd packages/react-sdk
pnpm test:integration     # Integration tests (10s timeout, sequential)
pnpm test:e2e             # Playwright e2e tests
pnpm test:e2e:ui          # Playwright with UI mode
pnpm test:all             # Unit + integration + e2e
```

### Versioning with Changesets

```bash
pnpm changeset            # Create a changeset after making changes
pnpm changeset version    # Bump versions, update CHANGELOGs
pnpm release              # Build and publish to npm
```

## Subpath Exports

All packages use package.json `exports` field for subpath imports:

```typescript
// core-sdk
import { confidentialTransfer } from "@zama-fhe/core-sdk/actions";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { createFhevmConfig } from "@zama-fhe/core-sdk/config";
import { detectProvider } from "@zama-fhe/core-sdk/providers";

// react-sdk
import { FhevmProvider, useEncrypt } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { memoryStorage, indexedDbStorage } from "@zama-fhe/react-sdk/storage";

// shared (internal only)
import { ERC7984_ABI } from "@zama-fhe/shared/abi";
import { sepolia } from "@zama-fhe/shared/chains";
```

## Key Architectural Patterns

### Provider Abstraction (core-sdk)

`packages/core-sdk/src/providers/` implements a unified provider interface that adapts both ethers.js Signers and viem WalletClients. `detect.ts` auto-detects the provider type (checks viem first, then ethers) and wraps it in a `UnifiedProvider` with a common interface (`sendTransaction`, `readContract`, `getAddress`, `getRawProvider`). Throws descriptive errors for unsupported formats like raw EIP-1193 providers or RPC URLs.

### Configuration (core-sdk)

`createFhevmConfig()` in `packages/core-sdk/src/config/` creates a config object similar to wagmi's pattern. Takes arrays of chains and transports; validates that every chain has a corresponding transport. Config exposes `getChain(chainId)` and `getTransport(chainId)` methods. Mock chains (chainId 31337, 31338) skip real FHE operations for testing.

### React Context (react-sdk)

`FhevmProvider` (`packages/react-sdk/src/react/FhevmProvider.tsx`) wraps the app and manages FHEVM instance lifecycle. Context tracks status (`"idle" | "initializing" | "ready" | "error"`), wallet state, and the FHEVM instance. Hooks access context via `useFhevmContext()`. The context supports two provider patterns: `provider` (raw EIP-1193) and `wallet` (FhevmWallet, preferred).

### Storage Abstraction (react-sdk)

`packages/react-sdk/src/storage/` provides pluggable storage adapters for public keys and signatures:
- `memoryStorage` — in-memory, for testing
- `indexedDbStorage` — browser IndexedDB, for production

## Testing

- **Framework**: Vitest for all packages, Playwright for react-sdk e2e
- **Core-SDK tests**: `test/**/*.test.ts`, v8 coverage provider
- **React-SDK unit tests**: `test/**/*.test.{ts,tsx}`, jsdom environment, setup file `vitest.setup.ts`
- **React-SDK integration tests**: `test/integration/*.test.ts`, 10s timeout, sequential execution
- **React-SDK e2e**: Playwright against test app in `e2e/test-app/`

## TypeScript Configuration

Base config in `tsconfig.base.json`: target ES2022, module ES2022, `bundler` module resolution, strict mode with `noUnusedLocals` and `noUncheckedIndexedAccess`. Each package extends this with its own `tsconfig.json`.

## Dependencies

- **Core SDK peers**: `ethers@^6.0.0` OR `viem@^2.0.0` (both optional). Direct dep: `@zama-fhe/relayer-sdk`.
- **React SDK peers**: `react@>=16.8.0`, `@tanstack/react-query@>=5.0.0` (optional), `@fhevm/mock-utils@^0.4.0` (optional). Direct deps include `ethers`, `idb`.
- **Requirements**: Node.js >= 18.0.0, pnpm >= 8.0.0

## Supported Chains

| Chain | Chain ID | Mock |
|-------|----------|------|
| Sepolia Testnet | 11155111 | No |
| Hardhat Local | 31337 | Yes |

## Documentation

All docs in `docs/` at repo root. Generated API reference via TypeDoc in `docs/api/`. Narrative docs organized by package (`docs/core-sdk/`, `docs/react-sdk/`) with cross-cutting guides in `docs/guides/` and `docs/getting-started/`.
