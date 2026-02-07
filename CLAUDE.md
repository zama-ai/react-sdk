# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **pnpm workspace monorepo** for Fully Homomorphic Encryption (FHE) SDK packages. The project provides framework-agnostic and React-specific SDKs for building FHE-powered applications on EVM chains using Zama's fhEVM technology.

## Package Structure

| Package | Description | Status |
|---------|-------------|--------|
| **packages/shared/** | Internal shared utilities (ABIs, chains, types, utils) | Private |
| **packages/core-sdk/** | Framework-agnostic SDK (works with ethers/viem) | Public |
| **packages/react-sdk/** | React hooks for FHE operations | Public |

### Architecture Layering

```
@zama-fhe/relayer-sdk (external)  ← Low-level FHE primitives from Zama
        ↓
@zama-fhe/shared                  ← Internal shared code (ABIs, chains, utils)
        ↓
@zama-fhe/core-sdk                ← Framework-agnostic actions
        ↓
@zama-fhe/react-sdk               ← React hooks layer
```

## Common Commands

### Root Level (Monorepo)

```bash
# Install all dependencies
pnpm install

# Build all packages (respects dependency order: shared → core → react)
pnpm build

# Build specific packages
pnpm build:shared    # @zama-fhe/shared only
pnpm build:core      # @zama-fhe/core-sdk only
pnpm build:react     # @zama-fhe/react-sdk only

# Watch mode for development
pnpm watch:shared    # Watch shared package
pnpm watch:core      # Watch core-sdk package
pnpm watch:react     # Watch react-sdk package

# Run all tests
pnpm test

# Run tests for specific package
pnpm test:core       # core-sdk tests only
pnpm test:react      # react-sdk tests only

# Linting
pnpm lint            # Lint all packages
pnpm lint:fix        # Lint and fix all packages

# Type checking
pnpm typecheck       # Type check all packages

# Full CI check locally
pnpm ci              # build + typecheck + lint + test

# Clean all build artifacts
pnpm clean

# Documentation
pnpm docs            # Generate unified TypeDoc API docs to docs/api/
pnpm docs:watch      # Watch and rebuild docs
pnpm docs:serve      # Build and serve docs locally
```

### Core SDK (packages/core-sdk/)

```bash
# Build
pnpm build           # Compile TypeScript to dist/
pnpm watch           # Build in watch mode

# Testing
pnpm test            # Run Vitest with coverage
pnpm test:watch      # Watch mode

# Quality checks
pnpm lint            # ESLint
pnpm lint:fix        # ESLint with auto-fix
pnpm typecheck       # TypeScript type checking
```

**Test patterns:**
- Tests located in `test/` directory
- Pattern: `test/**/*.test.ts`
- Framework: Vitest with coverage (v8 provider)

### React SDK (packages/react-sdk/)

```bash
# Build
pnpm build           # Compile TypeScript to dist/
pnpm watch           # Build in watch mode

# Testing
pnpm test            # Run Vitest unit tests with coverage
pnpm test:watch      # Watch mode
pnpm test:coverage   # Generate coverage report
pnpm test:integration # Integration tests (vitest.integration.config.ts)
pnpm test:e2e        # Playwright e2e tests
pnpm test:e2e:ui     # Playwright with UI mode
pnpm test:all        # Run unit + integration + e2e

# E2E test app
pnpm e2e:app         # Start test app at e2e/test-app/

# Quality checks
pnpm lint            # ESLint
pnpm lint:fix        # ESLint with auto-fix
pnpm format          # Prettier format
pnpm format:check    # Prettier check only
pnpm typecheck       # TypeScript type checking
pnpm ci              # Full CI: typecheck + lint + test + build

# Documentation (moved to root docs/)
# See root docs/ directory for all documentation
```

**Test patterns:**
- Unit tests: `test/**/*.test.{ts,tsx}` (jsdom environment)
- Integration tests: `test/integration/*.test.ts`
- E2E tests: Playwright (test app in `e2e/test-app/`)
- Setup file: `vitest.setup.ts`

### Shared Package (packages/shared/)

```bash
# Build
pnpm build           # Compile TypeScript to dist/
pnpm watch           # Build in watch mode

# Testing
pnpm test            # Run Vitest with coverage
pnpm test:watch      # Watch mode

# Clean
pnpm clean           # Remove dist/
```

## Build System

- **Compiler**: TypeScript with `tsconfig.json` (extends `tsconfig.base.json`)
- **Build order**: Dependencies must be built first (shared → core-sdk → react-sdk)
- **Output**: `dist/` directory (excluded from git)
- **Module system**: ES2022 modules with subpath exports

### Subpath Exports

Both core-sdk and react-sdk use package.json subpath exports:

```typescript
// core-sdk
import { confidentialTransfer } from "@zama-fhe/core-sdk/actions";
import { sepolia } from "@zama-fhe/core-sdk/chains";
import { createFhevmConfig } from "@zama-fhe/core-sdk/config";

// react-sdk
import { FhevmProvider, useEncrypt } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { memoryStorage, indexedDbStorage } from "@zama-fhe/react-sdk/storage";
```

## TypeScript Configuration

- **Base config**: `tsconfig.base.json` at root
- **Target**: ES2022
- **Module resolution**: `bundler`
- **Strict mode**: Enabled with extra checks (`noUnusedLocals`, `noUncheckedIndexedAccess`, etc.)
- **Output**: Declaration files (`.d.ts`) with source maps

## Dependencies

### Core SDK
- Peer dependencies: `ethers@^6.0.0` OR `viem@^2.0.0` (both optional)
- Direct dependency: `@zama-fhe/relayer-sdk@0.4.0`
- Internal: `@zama-fhe/shared` (workspace)

### React SDK
- Dependencies: `ethers@^6.16.0`, `idb@^8.0.3`
- Peer dependencies: `react@>=16.8.0`, `@tanstack/react-query@>=5.0.0` (optional), `@fhevm/mock-utils@^0.4.0` (optional)
- Internal: `@zama-fhe/shared`, `@zama-fhe/core-sdk` (workspace)

## Version Management

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
# Create a changeset after making changes
pnpm changeset

# Version packages (bumps versions, updates CHANGELOGs)
pnpm changeset version

# Build and publish to npm
pnpm release
```

## Development Workflow

### Typical Development Session

```bash
# Terminal 1: Install and build everything once
pnpm install && pnpm build

# Terminal 2: Watch mode for package you're working on
cd packages/core-sdk && pnpm watch
# OR
cd packages/react-sdk && pnpm watch

# Terminal 3: Run tests in watch mode
pnpm test:watch
```

### Running a Single Test File

```bash
# From package directory
cd packages/core-sdk
pnpm test test/config/createConfig.test.ts

# From root
pnpm --filter @zama-fhe/core-sdk test test/config/createConfig.test.ts
```

### Working with Workspace Dependencies

Packages reference each other via `workspace:*`:
```json
"dependencies": {
  "@zama-fhe/shared": "workspace:*"
}
```

Always build dependencies before dependent packages:
1. `pnpm build:shared` (must be built first)
2. `pnpm build:core` (depends on shared)
3. `pnpm build:react` (depends on shared + core)

Or use `pnpm build` which handles the order automatically.

## Key Architectural Patterns

### Provider Abstraction (core-sdk)
The core-sdk detects and adapts both ethers.js and viem providers:
- Located in `packages/core-sdk/src/providers/`
- See `detect.ts` for provider type detection
- Actions accept either ethers `Signer` or viem `WalletClient`

### Configuration Pattern (core-sdk)
Configuration is created once and reused:
- `createFhevmConfig()` in `packages/core-sdk/src/config/`
- Manages chains, transports (http/fallback), and chain-specific settings
- Supports mock chains for testing (chainId 31337, 31338)

### React Context Pattern (react-sdk)
- `FhevmProvider` wraps the app and manages FHEVM instance lifecycle
- Context in `packages/react-sdk/src/react/context.ts`
- Hooks access context via `useFhevmContext()`
- Instance initialization is automatic when provider/chainId/address are available

### Storage Abstraction (react-sdk)
Multiple storage adapters for public keys and signatures:
- `memoryStorage`: In-memory (for testing/development)
- `indexedDbStorage`: Browser IndexedDB (production)
- Located in `packages/react-sdk/src/storage/`

## Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Supported Chains

| Chain | Chain ID | Mock |
|-------|----------|------|
| Sepolia Testnet | 11155111 | No |
| Hardhat Local | 31337 | Yes |

Mock chains skip real FHE operations for testing.

## Documentation

All documentation is located in the `docs/` directory at the root of the monorepo.

### Structure

```
docs/
├── README.md                    # Documentation home
├── SUMMARY.md                   # Master table of contents
├── api/                         # TypeDoc-generated API reference (all packages)
├── getting-started/             # Cross-package getting started guides
├── core-sdk/                    # @zama-fhe/core-sdk documentation
├── react-sdk/                   # @zama-fhe/react-sdk documentation
├── shared/                      # @zama-fhe/shared documentation
└── guides/                      # Cross-cutting guides
```

### Generating Documentation

```bash
# From root
pnpm docs            # Generate unified TypeDoc API docs
pnpm docs:watch      # Watch and rebuild
pnpm docs:serve      # Build and serve locally
```

### Documentation Features

- **Unified API Reference**: TypeDoc generates a single API documentation site for all three packages (`shared`, `core-sdk`, `react-sdk`)
- **Narrative Documentation**: Markdown guides for getting started, configuration, best practices
- **Package-Specific Docs**: Each package has its own section with relevant documentation
- **Cross-Cutting Guides**: Architecture overview, security best practices, contributing guidelines

### Key Documentation Files

- `docs/README.md` - Start here for all documentation
- `docs/getting-started/overview.md` - Which package to use
- `docs/core-sdk/README.md` - Core SDK overview and examples
- `docs/react-sdk/README.md` - React SDK overview and examples
- `docs/api/index.html` - TypeScript API reference (generated)
