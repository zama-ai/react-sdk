# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@zama-fhe/react-sdk** - React SDK for Fully Homomorphic Encryption (FHE) on EVM chains. Provides wagmi-style hooks for encrypting, decrypting, and managing FHE operations in React applications.

**Dependencies:**
- `@zama-fhe/shared` (workspace) - Internal shared package containing ABIs, chains, types, and utilities
- `@zama-fhe/core-sdk` (workspace) - Framework-agnostic core SDK
- `@zama-fhe/relayer-sdk` (0.4.0) - Zama's FHE relayer SDK

## Commands

### Development
```bash
pnpm install          # Install dependencies
pnpm build            # Build SDK to dist/
pnpm watch            # Build in watch mode
pnpm clean            # Remove dist/ directory
```

### Testing
```bash
# Unit tests (Vitest + React Testing Library)
pnpm test             # Run tests with coverage
pnpm test:watch       # Run tests in watch mode
pnpm test useEncrypt  # Run specific test file by name
pnpm test:coverage    # Generate coverage report
pnpm test:integration # Run integration tests

# E2E tests (Playwright)
pnpm test:e2e         # Run Playwright e2e tests (auto-starts test app)
pnpm test:e2e:ui      # Open Playwright UI mode
pnpm e2e:app          # Manually start test app (localhost:5173)

# Run all tests
pnpm test:all         # Run unit + integration + e2e tests
```

### Linting & Type Checking
```bash
pnpm lint             # ESLint
pnpm lint:fix         # Fix lint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # TypeScript type checking
pnpm ci               # Full CI check (typecheck + lint + test + build)
```

### Documentation
```bash
pnpm docs             # Generate TypeDoc API docs
pnpm docs:watch       # Watch and regenerate docs
pnpm docs:serve       # Generate and serve docs
```

## Architecture

### Core Data Flow

```
FhevmProvider (manages instance lifecycle)
    ↓
FhevmContext (shares state via React context)
    ↓
Hooks (useEncrypt, useUserDecrypt, etc.)
    ↓
FhevmInstanceAdapter (abstracts relayer-sdk)
    ↓
@zama-fhe/relayer-sdk (underlying FHE operations)
```

### Package Structure

```
@zama-fhe/shared (internal)    ← ABIs, chains, types, utilities
    ↓
@zama-fhe/core-sdk             ← Framework-agnostic actions
    ↓
@zama-fhe/react-sdk            ← React hooks layer
```

React-SDK imports from `@zama-fhe/shared`:
- **ABIs**: Contract ABIs (ERC7984, ERC20)
- **Chains**: Chain definitions (sepolia, hardhat)
- **Types**: Shared TypeScript types (EncryptInput, DecryptRequest, etc.)
- **Utils**: Error classes, validation functions, formatting helpers

### Directory Structure

```
src/
├── react/              # React hooks and provider
│   ├── FhevmProvider.tsx
│   ├── context.ts      # FhevmContext definition
│   ├── queryKeys.ts    # TanStack Query key factory
│   ├── use*.ts         # Individual hooks
│   └── utils/          # Hook utilities (useMutationWrapper, etc.)
├── internal/           # Internal implementation (not public API)
│   ├── FhevmInstanceAdapter.ts  # Abstraction over relayer-sdk
│   ├── RelayerSDKLoader.ts      # Dynamic CDN loading
│   ├── PublicKeyStorage.ts      # Public key caching
│   ├── mock/           # Mock FHE for testing
│   └── eip1193.ts      # EIP-1193 provider types
├── storage/            # Storage adapters (memory, localStorage, etc.)
├── chains/             # Chain configurations (sepolia, hardhat)
├── abi/                # Smart contract ABIs (ERC7984, ERC20)
├── types/              # TypeScript type definitions
├── utils/              # Shared utilities
├── config.ts           # createFhevmConfig()
├── fhevmTypes.ts       # FhevmInstance type re-export
└── FhevmDecryptionSignature.ts  # Signature management

test/
├── utils/              # Test helpers
│   ├── testWrapper.tsx     # createTestWrapper()
│   ├── mockFhevmInstance.ts
│   └── mockProvider.ts
├── integration/        # Integration tests
└── *.test.tsx          # Unit tests (mirrors src/)

e2e/
├── test-app/           # Standalone Vite app for e2e testing
├── tests/              # Playwright test files
└── fixtures/           # Test fixtures
```

### Key Architectural Decisions

1. **TanStack Query for state** - All hooks use TanStack Query for caching, deduplication, and state management. Query keys are centralized in `queryKeys.ts`.

2. **Wagmi-style API** - Return shapes match wagmi conventions (`data`, `isLoading`, `error`, `status`)

3. **Subpath exports** - SDK uses TypeScript's subpath exports (defined in package.json):
   ```typescript
   import { FhevmProvider } from "@zama-fhe/react-sdk";
   import { sepolia } from "@zama-fhe/react-sdk/chains";
   import { memoryStorage } from "@zama-fhe/react-sdk/storage";
   import type { EncryptInput } from "@zama-fhe/react-sdk/types";
   ```

4. **FhevmInstanceAdapter** - Abstracts `@zama-fhe/relayer-sdk` to enable mocking and testing. All hooks use the adapter instead of calling relayer-sdk directly.

5. **Storage abstraction** - Storage is pluggable via adapters (`memoryStorage`, `sessionStorageAdapter`, `localStorageAdapter`). This enables testing and different security models.

### Hook Pattern

All hooks follow this structure:

```typescript
export function useMyHook(params: MyParams) {
  const { instance, status } = useFhevmContext();

  const query = useQuery({
    queryKey: fhevmKeys.myKey(params),  // Use queryKeys.ts factory
    queryFn: async () => { /* ... */ },
    enabled: status === "ready",
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
```

**For mutations** (useEncrypt, useConfidentialTransfer, etc.), use `useMutationWrapper` from `src/react/utils/useMutationWrapper.ts`:

```typescript
export function useMyMutation() {
  const mutationFn = async (params: Params) => { /* ... */ };

  // useMutationWrapper converts TanStack mutation to Promise-based API
  const execute = useMutationWrapper(mutationFn, {
    onSuccess: (data) => { /* ... */ },
  });

  return { execute, isLoading, error };
}
```

### Utilities

- **`useMutationWrapper`** (`src/react/utils/`) - Wraps TanStack mutations to return Promises (eliminates boilerplate)
- **`normalizeTransactionError`** (`src/react/utils/`) - Standardizes error handling across hooks
- **`fhevmKeys`** (`src/react/queryKeys.ts`) - TanStack Query key factory (hierarchical, type-safe)
- **`formatConfidentialAmount`** (`src/utils/format.ts`) - Format decrypted values for display
- **`configureLogger`** (`src/internal/logger.ts`) - Enable debug logging for troubleshooting

## Security

**⚠️ This SDK handles cryptographic material (private keys for FHE decryption).**

Before modifying security-critical code (`FhevmDecryptionSignature.ts`, `storage/`):

1. Read `notes/SECURITY_QUICK_REFERENCE.md`
2. Never log private keys or signature objects
3. Storage security hierarchy:
   - 🟢 `memoryStorage` - Highest (cleared on refresh)
   - 🟢 `sessionStorageAdapter` - High (cleared on tab close)
   - ⚠️ `localStorageAdapter` - Dev only (XSS vulnerable)

## Testing

### Unit Tests (Vitest + React Testing Library)

Tests use Vitest with jsdom environment. Test wrappers are in `test/utils/`.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { createTestWrapper } from "./utils/testWrapper";

// Test with connected wallet and ready FHEVM
const { result } = renderHook(() => useMyHook(params), {
  wrapper: createTestWrapper({
    status: "ready",
    isConnected: true,
    chainId: 31337,
  }),
});

await waitFor(() => expect(result.current.data).toBeDefined());
```

**Pre-built wrappers** (in `test/utils/testWrapper.tsx`):
- `ConnectedWrapper` - Ready FHEVM, connected wallet
- `DisconnectedWrapper` - Idle state, no wallet
- `InitializingWrapper` - FHEVM initializing
- `ErrorWrapper` - Error state

**Mocks available:**
- `createMockFhevmInstance()` - Mock FhevmInstance for testing hooks
- `createMockEip1193Provider()` - Mock wallet provider
- `createMockWallet()` - Mock FhevmWallet

### E2E Tests (Playwright)

E2E tests run against a real Vite app (`e2e/test-app/`) with mocked blockchain:

```bash
pnpm test:e2e         # Runs Playwright (auto-starts app on :5173)
pnpm test:e2e:ui      # Open Playwright UI
```

Test files go in `e2e/tests/`. The test app is configured in `e2e/test-app/`.

## Adding a New Hook

1. Create `src/react/useNewFeature.ts` following the hook pattern above
2. Add query key to `src/react/queryKeys.ts` (if needed for caching)
3. Export from `src/react/index.ts` (including types)
4. Add tests in `test/useNewFeature.test.tsx`
5. Add documentation in `docs/hooks/use-new-feature.md`
6. Update `docs/SUMMARY.md` to include new hook

## TypeScript Configuration

**Strict mode is enabled** - The project uses strict TypeScript settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

**Module resolution**: `Bundler` (modern ESM)

**Build output**: `dist/` with declaration files (`.d.ts`)

## ESLint Configuration

Uses flat config (`eslint.config.js`) with:
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `react-hooks` plugin (enforces hooks rules)
- `import` plugin (enforces import ordering)

**Import order**: builtin → external → internal → parent → sibling → index (alphabetized)

**Test files** have relaxed rules (no unused vars warnings, etc.)

## Integration with dApps

This SDK is used by the dApps monorepo at `../dapps/` via file path linking:
```json
"@zama-fhe/react-sdk": "file:../../../react-sdk"
```

**After modifying SDK code**, run `pnpm build` before testing in dApps. The dApps will use the built artifacts from `dist/`.

## Debugging

Enable debug logs to troubleshoot initialization issues:

```typescript
import { configureLogger } from "@zama-fhe/react-sdk";

// Enable debug mode
configureLogger({ debug: true });
```

Logs will show:
- FHEVM initialization steps
- Public key fetching/caching
- Encryption/decryption operations
- TanStack Query cache operations
