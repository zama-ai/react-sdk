# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@zama-fhe/sdk** - React SDK for Fully Homomorphic Encryption (FHE) on EVM chains. Provides wagmi-style hooks for encrypting, decrypting, and managing FHE operations in React applications.

## Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build SDK to dist/
pnpm watch            # Build in watch mode
pnpm test             # Run tests with coverage
pnpm test:watch       # Run tests in watch mode
pnpm test useEncrypt  # Run specific test file
pnpm test:all         # Run unit + integration + e2e tests
pnpm lint             # ESLint
pnpm lint:fix         # Fix lint issues
pnpm typecheck        # TypeScript type checking
pnpm ci               # Full CI check (typecheck + lint + test + build)
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
@zama-fhe/relayer-sdk (underlying FHE operations)
```

### Key Architectural Decisions

1. **TanStack Query for state** - All hooks use TanStack Query for caching, deduplication, and state management
2. **Wagmi-style API** - Return shapes match wagmi conventions (`data`, `isLoading`, `error`, `status`)
3. **Subpath exports** - SDK uses TypeScript's subpath exports:
   ```typescript
   import { FhevmProvider } from "@zama-fhe/sdk";
   import { sepolia } from "@zama-fhe/sdk/chains";
   import { memoryStorage } from "@zama-fhe/sdk/storage";
   ```

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

### Utilities

- **`useMutationWrapper`** - Wraps TanStack mutations to return Promises (eliminates boilerplate)
- **`normalizeTransactionError`** - Standardizes error handling across hooks
- **`src/core/constants.ts`** - All magic numbers (stale times, retry counts, etc.)

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

Tests use Vitest + React Testing Library. Test wrappers are in `test/` directory.

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { createTestWrapper } from "./helpers";

const { result } = renderHook(() => useMyHook(params), {
  wrapper: createTestWrapper(),
});

await waitFor(() => expect(result.current.data).toBeDefined());
```

## Adding a New Hook

1. Create `src/react/useNewFeature.ts` following the hook pattern above
2. Add query key to `src/react/queryKeys.ts`
3. Export from `src/react/index.ts`
4. Add tests in `test/useNewFeature.test.tsx`
5. Add documentation in `docs/hooks/`

## Integration with dApps

This SDK is used by the dApps monorepo at `../dapps/` via file path linking:
```json
"@zama-fhe/sdk": "file:../../../react-sdk"
```

After modifying SDK code, run `pnpm build` before testing in dApps.
