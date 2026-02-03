# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**@zama-fhe/sdk** - React SDK for building applications with Fully Homomorphic Encryption (FHE) on EVM chains.

This is a standalone TypeScript/React library that provides wagmi-style hooks for encrypting, decrypting, and managing FHE operations in React applications. It integrates seamlessly with wagmi and TanStack Query v5.

### Key Information

- **Package Name:** `@zama-fhe/sdk`
- **Version:** 0.1.0
- **License:** BSD-3-Clause-Clear
- **Repository:** https://github.com/zama-ai/react-sdk
- **Main Dependencies:** @zama-fhe/relayer-sdk, ethers, idb
- **Peer Dependencies:** react, @tanstack/react-query

---

## Repository Structure

```
react-sdk/
├── src/                          # Source code
│   ├── react/                    # React hooks and components
│   │   ├── FhevmProvider.tsx     # Main provider component
│   │   ├── context.ts            # React context
│   │   ├── queryKeys.ts          # TanStack Query key factory
│   │   ├── use*.ts               # Individual hooks
│   │   └── utils/                # Shared utilities
│   │       ├── useMutationWrapper.ts
│   │       ├── errorHandling.ts
│   │       └── useMutationStatus.ts
│   │
│   ├── core/                     # Core FHE functionality
│   │   └── constants.ts          # Centralized constants
│   │
│   ├── storage/                  # Storage adapters
│   │   ├── GenericStringStorage.ts
│   │   └── adapters.ts           # localStorage, sessionStorage, memory
│   │
│   ├── chains/                   # Network configurations
│   │   ├── sepolia.ts
│   │   ├── hardhat.ts
│   │   └── types.ts
│   │
│   ├── types/                    # TypeScript type definitions
│   ├── FhevmDecryptionSignature.ts  # Key management
│   ├── config.ts                 # Configuration utilities
│   └── index.ts                  # Main exports
│
├── test/                         # Vitest test files
│   ├── hooks.test.ts
│   ├── FhevmProvider.test.tsx
│   └── ...
│
├── docs/                         # User documentation
│   ├── README.md                 # Main documentation hub
│   ├── getting-started/
│   ├── configuration/
│   ├── hooks/
│   ├── guides/
│   │   └── security.md           # ⭐ Important security guide
│   └── SUMMARY.md                # Table of contents
│
├── notes/                        # Development notes
│   ├── README.md
│   ├── SECURITY_README.md        # ⭐ Security documentation hub
│   ├── SECURITY_ANALYSIS.md
│   ├── SECURITY_QUICK_REFERENCE.md
│   └── ...refactoring docs
│
└── package.json
```

---

## Commands

### Development

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Build in watch mode (for development)
pnpm watch

# Type check without building
pnpm typecheck
pnpm build:check
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e

# Run all test suites
pnpm test:all
```

**Expected:** 373 tests passing (as of 2026-02-03)

### Code Quality

```bash
# Lint TypeScript files
pnpm lint
pnpm lint:fix

# Format code with Prettier
pnpm format
pnpm format:check

# Full CI check (typecheck + lint + test + build)
pnpm ci
```

### Documentation

```bash
# Generate API documentation with TypeDoc
pnpm docs

# Watch mode for docs
pnpm docs:watch

# Serve documentation locally
pnpm docs:serve
```

---

## Development Workflow

### Making Changes

1. **Read existing code** - Check similar hooks/components for patterns
2. **Follow established patterns** - Use wagmi-style API conventions
3. **Write tests first** - All hooks should have comprehensive tests
4. **Run tests** - Ensure all 373+ tests pass
5. **Type check** - No TypeScript errors allowed
6. **Update docs** - Keep user documentation in sync

### Code Patterns to Follow

#### Hook Structure

All hooks should follow this pattern:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFhevmContext } from "./context";

export function useMyHook(params: MyParams) {
  const { instance, status } = useFhevmContext();

  // Use TanStack Query for state management
  const query = useQuery({
    queryKey: ["my-key", params],
    queryFn: async () => {
      // Implementation
    },
    enabled: status === "ready",
  });

  return {
    // Return wagmi-style API
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
```

#### Error Handling

```typescript
import { normalizeTransactionError } from "./utils/errorHandling";

try {
  await someOperation();
} catch (err) {
  throw normalizeTransactionError(err as Error);
}
```

#### Mutation Wrapper

```typescript
import { useMutationWrapper } from "./utils/useMutationWrapper";

const mutation = useMutation({ ... });
const execute = useMutationWrapper(mutation);
```

### Constants

Use centralized constants from `src/react/core/constants.ts`:

```typescript
import { FHEVM_QUERY_DEFAULTS, ERC7984_FUNCTIONS } from "../core/constants";

const query = useQuery({
  staleTime: FHEVM_QUERY_DEFAULTS.BALANCE_STALE_TIME,
  // ...
});
```

---

## Testing Guidelines

### Test File Structure

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

describe("useMyHook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return expected data when ready", async () => {
    const { result } = renderHook(() => useMyHook(params), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

### Coverage Requirements

- Maintain 90%+ code coverage
- All hooks must have tests
- All error paths must be tested
- Integration tests for critical paths

---

## Security Considerations

**⚠️ IMPORTANT:** This SDK handles sensitive cryptographic material (private keys for FHE decryption).

### Before Making Security-Related Changes

1. **Read the security documentation:**
   - [`notes/SECURITY_QUICK_REFERENCE.md`](notes/SECURITY_QUICK_REFERENCE.md) - Quick TL;DR
   - [`notes/SECURITY_ANALYSIS.md`](notes/SECURITY_ANALYSIS.md) - Full analysis
   - [`docs/guides/security.md`](docs/guides/security.md) - User guide

2. **Key Security Principles:**
   - Never log private keys or signatures
   - Always use secure storage (memory or encrypted)
   - Validate all inputs before encryption
   - Handle errors without exposing sensitive data

3. **Storage Security Hierarchy:**
   - 🟢 `memoryStorage` - Highest security (cleared on refresh)
   - 🟢 `sessionStorageAdapter` - High security (cleared on tab close)
   - ⚠️ `localStorageAdapter` - Development only (XSS vulnerable)

4. **Security Checklist for PRs:**
   - [ ] No `console.log` of sensitive data
   - [ ] Storage recommendations not weakened
   - [ ] Error messages don't leak keys
   - [ ] Tests cover security scenarios

---

## Key Files and Their Purpose

### Core Architecture

| File | Purpose | Notes |
|------|---------|-------|
| `src/react/FhevmProvider.tsx` | Main provider component | Manages FHEVM instance lifecycle |
| `src/react/context.ts` | React context | Shares state across hooks |
| `src/FhevmDecryptionSignature.ts` | Key management | ⚠️ Security-critical |
| `src/storage/adapters.ts` | Storage implementations | ⚠️ Security-critical |
| `src/config.ts` | Configuration utilities | Creates FhevmConfig |

### React Hooks (src/react/)

**Encryption:**
- `useEncrypt.ts` - Encrypt values for contract calls

**Transactions:**
- `useConfidentialTransfer.ts` - Transfer ERC7984 tokens
- `useConfidentialBalances.ts` - Fetch and decrypt balances
- `useShield.ts` - Convert ERC20 → ERC7984
- `useUnshield.ts` - Convert ERC7984 → ERC20

**Decryption:**
- `useUserDecrypt.ts` - Decrypt with user authorization
- `usePublicDecrypt.ts` - Decrypt public values
- `useUserDecryptedValue.ts` - Higher-level decryption

**Utilities:**
- `useFhevmStatus.ts` - Check initialization status
- `useFhevmContext.ts` - Access context
- `useFhevmInstance.ts` - Access FHEVM instance
- `useSignature.ts` - Manage decryption signatures

### Utilities (src/react/utils/)

- `useMutationWrapper.ts` - Eliminates Promise wrapper boilerplate
- `errorHandling.ts` - Standardized error detection and normalization
- `useMutationStatus.ts` - Unified status derivation for mutations

### Constants (src/react/core/)

- `constants.ts` - All magic numbers and configuration defaults

---

## Common Tasks

### Adding a New Hook

1. Create file in `src/react/useNewFeature.ts`
2. Follow wagmi-style API pattern
3. Use TanStack Query for state management
4. Export from `src/react/index.ts`
5. Add tests in `test/useNewFeature.test.ts`
6. Document in `docs/hooks/use-new-feature.md`
7. Add to `docs/SUMMARY.md`

### Adding a New Storage Adapter

1. Implement `GenericStringStorage` interface
2. Add to `src/storage/adapters.ts`
3. Export from `src/storage/index.ts`
4. Add security documentation
5. Update `docs/configuration/storage.md`
6. Add tests

### Updating Dependencies

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm update <package-name>

# Update all dependencies
pnpm update --latest

# After updating, run full test suite
pnpm test:all
```

**Important:** Always run `pnpm test:all` after dependency updates.

---

## TypeScript Configuration

### Exports Structure

The SDK uses TypeScript's subpath exports pattern:

```json
{
  ".": "./dist/index.js",
  "./chains": "./dist/chains/index.js",
  "./storage": "./dist/storage/index.js",
  "./types": "./dist/fhevmTypes.js",
  "./react": "./dist/react/index.js"
}
```

Usage:
```typescript
import { FhevmProvider } from "@zama-fhe/sdk";
import { sepolia } from "@zama-fhe/sdk/chains";
import { memoryStorage } from "@zama-fhe/sdk/storage";
```

### Type Definitions

All types are fully exported. Users should have full TypeScript intellisense.

---

## Documentation Structure

### User Documentation (docs/)

- **Target Audience:** SDK users (developers)
- **Format:** Markdown with code examples
- **Style:** Tutorial-first, clear examples
- **Location:** `docs/` directory

### Development Notes (notes/)

- **Target Audience:** SDK contributors
- **Format:** Markdown, technical
- **Style:** Analysis, plans, architecture decisions
- **Location:** `notes/` directory

### API Documentation

Generated with TypeDoc from TSDoc comments:

```typescript
/**
 * Hook for encrypting values for contract calls.
 *
 * @example
 * ```tsx
 * const { encrypt, isReady } = useEncrypt();
 * const [handle, proof] = await encrypt([
 *   { type: "uint64", value: 100n }
 * ], contractAddress);
 * ```
 */
export function useEncrypt() { ... }
```

---

## Git Workflow

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

**Examples:**
```
feat(hooks): add useEncryptBatch for bulk encryption

refactor(storage): extract encryption to separate adapter

docs(security): add XSS attack mitigation guide

fix(decrypt): handle expired signatures gracefully
```

### Commit Message Footer

Always include attribution:

```
🤖 Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)

Co-Authored-By: Claude <noreply@anthropic.com>
Co-Authored-By: Happy <yesreply@happy.engineering>
```

---

## IDE Configuration

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Vitest

### Settings

The repository includes:
- `.vscode/settings.json` (if exists)
- `.editorconfig`
- `.prettierrc`
- `eslint.config.js`

---

## Troubleshooting

### Tests Failing

```bash
# Clear cache
pnpm test --clearCache

# Run specific test file
pnpm test useEncrypt.test.ts

# Debug a test
pnpm test --inspect-brk useEncrypt.test.ts
```

### Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm build

# Check for type errors
pnpm typecheck
```

### Import Errors

The SDK uses subpath exports. Make sure imports match the export structure:

```typescript
// ✅ Correct
import { FhevmProvider } from "@zama-fhe/sdk";
import { sepolia } from "@zama-fhe/sdk/chains";

// ❌ Wrong
import { sepolia } from "@zama-fhe/sdk/chains/sepolia";
```

---

## Release Process

### Pre-release Checklist

- [ ] All tests passing (`pnpm test:all`)
- [ ] TypeScript builds without errors
- [ ] Linter passes (`pnpm lint`)
- [ ] Docs are up to date
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json

### Building for Release

```bash
# Prepare for publish
pnpm prepublishOnly

# This runs:
# - clean
# - build
# - test
```

---

## Environment Variables

This SDK does not use environment variables at runtime. All configuration is done via the `FhevmConfig` object.

For testing, Vitest uses:
- `NODE_ENV=test` (automatically set)
- Test-specific mocks in `test/` directory

---

## External Resources

### Documentation

- **FHEVM Docs:** https://docs.zama.ai
- **TanStack Query:** https://tanstack.com/query/latest
- **Wagmi:** https://wagmi.sh
- **Viem:** https://viem.sh

### Related Repositories

- **@zama-fhe/relayer-sdk:** Core FHE operations (dependency)
- **dApps Examples:** https://github.com/zama-ai/dapps
- **fhEVM:** https://github.com/zama-ai/fhevm

---

## Getting Help

### For SDK Development

1. Check [`notes/`](notes/) for development documentation
2. Review similar hooks for patterns
3. Run tests to understand behavior
4. Check TypeDoc API documentation

### For Security Questions

1. Read [`notes/SECURITY_QUICK_REFERENCE.md`](notes/SECURITY_QUICK_REFERENCE.md)
2. Review [`docs/guides/security.md`](docs/guides/security.md)
3. **For vulnerabilities:** Email security@zama.ai (do NOT create public issues)

### For General Questions

- **GitHub Issues:** https://github.com/zama-ai/react-sdk/issues
- **Discord:** https://discord.fhe.org
- **Discussions:** https://github.com/zama-ai/react-sdk/discussions

---

## Important Notes for Claude Code

### When Working on This Repository

1. **Security First:**
   - Never commit code that logs private keys
   - Always consider XSS attack vectors for storage changes
   - Read security docs before modifying key management code

2. **Testing is Mandatory:**
   - All new code must have tests
   - Run full test suite before committing
   - Maintain 90%+ coverage

3. **Follow Existing Patterns:**
   - Use wagmi-style hooks API
   - Use TanStack Query for state management
   - Extract utilities to avoid duplication
   - Use centralized constants

4. **Documentation:**
   - Update user docs (`docs/`) for user-facing changes
   - Update dev notes (`notes/`) for architecture changes
   - Keep SUMMARY.md in sync

5. **TypeScript:**
   - No `any` types without justification
   - Export all public types
   - Use strict TypeScript settings

---

**Last Updated:** 2026-02-03
**SDK Version:** 0.1.0
**Maintainer:** Zama (@zama-ai)
