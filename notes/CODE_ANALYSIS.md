# Code Analysis & Refactoring Recommendations

**Date:** 2026-02-03
**Codebase:** `@zama-fhe/sdk` React SDK
**Total Files:** 56 TypeScript files
**Total Lines:** ~8,585 lines

---

## Executive Summary

The codebase is **well-structured** with excellent TanStack Query integration recently completed. However, there are opportunities for improvement in:

1. **Code Organization** - Group related files into subdirectories
2. **Type Safety** - Consolidate scattered type definitions
3. **Error Handling** - Standardize error patterns
4. **Code Duplication** - Extract common patterns
5. **Documentation** - Add architecture decision records (ADRs)

**Overall Quality Rating:** 7.5/10 (Good, with room for improvement)

---

## 1. Directory Structure Analysis

### Current Structure (Flat)

```
src/react/
├── FhevmProvider.tsx (291 lines)
├── context.ts
├── queryClient.ts
├── queryKeys.ts
├── index.ts
├── useConfidentialBalances.ts (289 lines)
├── useConfidentialTransfer.ts (209 lines)
├── useEncrypt.ts (222 lines)
├── useEthersSigner.ts
├── useFHEDecrypt.ts (211 lines) [DEPRECATED]
├── useFHEEncryption.ts (187 lines) [DEPRECATED]
├── useFhevm.tsx [DEPRECATED]
├── useFhevmClient.ts
├── useFhevmContext.ts
├── useFhevmInstance.ts (214 lines)
├── useFhevmStatus.ts
├── useInMemoryStorage.tsx
├── usePublicDecrypt.ts (255 lines)
├── useShield.ts (248 lines)
├── useSignature.ts
├── useUnshield.ts (260 lines)
├── useUserDecrypt.ts (292 lines)
└── useUserDecryptedValue.ts
```

### Issues Identified

1. **Flat structure** - 22 files in a single directory is hard to navigate
2. **Mixed concerns** - Provider, hooks, context, and utilities all together
3. **Deprecated code** - Legacy hooks still present, increasing cognitive load
4. **No clear feature grouping** - Hard to find related functionality

---

## 2. Proposed Directory Structure (Feature-Based)

### Recommended Structure

```
src/react/
├── core/                           # Core provider & context
│   ├── FhevmProvider.tsx
│   ├── context.ts
│   ├── queryClient.ts
│   ├── queryKeys.ts
│   └── index.ts
│
├── hooks/                          # Modern hooks (TanStack Query)
│   ├── encryption/
│   │   ├── useEncrypt.ts
│   │   └── index.ts
│   ├── decryption/
│   │   ├── useUserDecrypt.ts
│   │   ├── usePublicDecrypt.ts
│   │   ├── useUserDecryptedValue.ts
│   │   ├── useSignature.ts
│   │   └── index.ts
│   ├── transactions/
│   │   ├── useConfidentialTransfer.ts
│   │   ├── useShield.ts
│   │   ├── useUnshield.ts
│   │   └── index.ts
│   ├── balances/
│   │   ├── useConfidentialBalances.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── useEthersSigner.ts
│   │   ├── useFhevmClient.ts
│   │   ├── useFhevmStatus.ts
│   │   ├── useFhevmInstance.ts
│   │   └── index.ts
│   └── index.ts
│
├── legacy/                         # Deprecated hooks (to be removed)
│   ├── useFhevm.tsx
│   ├── useFHEEncryption.ts
│   ├── useFHEDecrypt.ts
│   ├── useInMemoryStorage.tsx
│   └── index.ts
│
└── index.ts                        # Main export
```

### Benefits

✅ **Clear feature grouping** - Related hooks are co-located
✅ **Better discoverability** - New developers can find hooks faster
✅ **Isolation of legacy code** - Clear deprecation path
✅ **Scalability** - Easy to add new features without bloating directories
✅ **Reduced cognitive load** - Smaller, focused directories

---

## 3. Code Duplication Analysis

### Pattern 1: Mutation Wrapper Boilerplate

**Found in:** `useConfidentialTransfer.ts`, `useShield.ts`, `useUnshield.ts`

```typescript
// ❌ DUPLICATED CODE (appears 3+ times)
const transfer = useCallback(
  async (to: `0x${string}`, amount: bigint): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      mutation.mutate(
        { to, amount },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        }
      );
    });
  },
  [mutation.mutate]
);
```

**Recommendation:** Extract into a shared utility

```typescript
// ✅ PROPOSED: src/react/hooks/utils/useMutationWrapper.ts

/**
 * Wraps useMutation's mutate function to return a Promise.
 * Maintains backward compatibility with async/await patterns.
 */
export function useMutationWrapper<TData, TError, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables, unknown>
) {
  return useCallback(
    async (variables: TVariables): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        mutation.mutate(variables, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error),
        });
      });
    },
    [mutation.mutate]
  );
}
```

**Usage:**

```typescript
// In useConfidentialTransfer.ts
const mutation = useMutation<TransferResult, Error, TransferParams>({ ... });
const transfer = useMutationWrapper(mutation);
```

**Impact:** Removes ~10 lines × 3 hooks = **30 lines saved**

---

### Pattern 2: User Rejection Error Handling

**Found in:** `useConfidentialTransfer.ts`, `useShield.ts`, `useUnshield.ts`

```typescript
// ❌ DUPLICATED CODE (appears 3+ times)
onError: (err) => {
  let error = err;
  if (
    err.message.includes("User rejected") ||
    err.message.includes("user rejected") ||
    err.message.includes("ACTION_REJECTED")
  ) {
    error = new Error("Transaction rejected by user");
  }
  onError?.(error);
}
```

**Recommendation:** Create a shared error normalizer

```typescript
// ✅ PROPOSED: src/react/hooks/utils/errorHandling.ts

/**
 * Checks if an error represents a user rejection.
 */
export function isUserRejection(error: Error): boolean {
  return (
    error.message.includes("User rejected") ||
    error.message.includes("user rejected") ||
    error.message.includes("ACTION_REJECTED") ||
    error.message.includes("User denied") ||
    error.message.includes("User cancelled")
  );
}

/**
 * Normalizes transaction errors into user-friendly messages.
 */
export function normalizeTransactionError(error: Error): Error {
  if (isUserRejection(error)) {
    return new Error("Transaction rejected by user");
  }

  if (error.message.includes("insufficient funds")) {
    return new Error("Insufficient funds for transaction");
  }

  if (error.message.includes("nonce too low")) {
    return new Error("Transaction nonce conflict. Please try again.");
  }

  return error;
}
```

**Usage:**

```typescript
onError: (err) => {
  const normalizedError = normalizeTransactionError(err);
  onError?.(normalizedError);
}
```

**Impact:** Removes ~8 lines × 3 hooks = **24 lines saved** + **better error messages**

---

### Pattern 3: Status Derivation Logic

**Found in:** All mutation hooks

```typescript
// ❌ DUPLICATED CODE
const status = useMemo<TransferStatus>(() => {
  if (mutation.isPending) return "signing";
  if (mutation.isSuccess) return "success";
  if (mutation.isError) return "error";
  return "idle";
}, [mutation.isPending, mutation.isSuccess, mutation.isError]);
```

**Recommendation:** Create a status derivation utility

```typescript
// ✅ PROPOSED: src/react/hooks/utils/useMutationStatus.ts

type MutationStatusMap<T extends string> = {
  pending: T;
  success: T;
  error: T;
  idle: T;
};

/**
 * Derives a custom status from mutation state.
 */
export function useMutationStatus<T extends string>(
  mutation: Pick<UseMutationResult, "isPending" | "isSuccess" | "isError">,
  statusMap: MutationStatusMap<T>
): T {
  return useMemo(() => {
    if (mutation.isPending) return statusMap.pending;
    if (mutation.isSuccess) return statusMap.success;
    if (mutation.isError) return statusMap.error;
    return statusMap.idle;
  }, [mutation.isPending, mutation.isSuccess, mutation.isError, statusMap]);
}
```

**Usage:**

```typescript
const status = useMutationStatus(mutation, {
  pending: "signing",
  success: "success",
  error: "error",
  idle: "idle",
});
```

**Impact:** Removes ~5 lines × 3 hooks = **15 lines saved**

---

## 4. Type System Improvements

### Issue 1: Scattered Type Definitions

Types are defined in multiple locations:

```
src/types/
├── balance.ts
├── encryption.ts
├── shield.ts
└── transfer.ts

src/react/
├── useEncrypt.ts (defines EncryptInput, EncryptResult)
├── context.ts (defines FhevmStatus, FhevmContextValue)
└── queryKeys.ts (defines FhevmQueryKey)
```

**Recommendation:** Consolidate into a single types directory

```typescript
// ✅ PROPOSED STRUCTURE
src/types/
├── core.ts              // FhevmConfig, FhevmInstance, FhevmStatus
├── context.ts           // FhevmContextValue
├── encryption.ts        // EncryptInput, EncryptResult, EncryptedOutput
├── decryption.ts        // DecryptRequest, DecryptParams, DecryptResult
├── transactions.ts      // TransferStatus, ShieldStatus, UnshieldStatus
├── balances.ts          // ConfidentialBalanceResult, DecryptedValue
├── queries.ts           // FhevmQueryKey (from queryKeys.ts)
├── errors.ts            // NEW: Standardized error types
└── index.ts             // Re-export all
```

### Issue 2: Missing Error Types

No standardized error types exist. Errors are handled as generic `Error` objects.

**Recommendation:** Add custom error classes

```typescript
// ✅ PROPOSED: src/types/errors.ts

export class FhevmError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "FhevmError";
  }
}

export class FhevmNotReadyError extends FhevmError {
  constructor(message = "FHEVM not ready. Please wait for initialization.") {
    super(message, "FHEVM_NOT_READY");
    this.name = "FhevmNotReadyError";
  }
}

export class WalletNotConnectedError extends FhevmError {
  constructor(message = "Wallet not connected. Please connect your wallet.") {
    super(message, "WALLET_NOT_CONNECTED");
    this.name = "WalletNotConnectedError";
  }
}

export class EncryptionFailedError extends FhevmError {
  constructor(message = "Encryption failed") {
    super(message, "ENCRYPTION_FAILED");
    this.name = "EncryptionFailedError";
  }
}

export class TransactionRejectedError extends FhevmError {
  constructor(message = "Transaction rejected by user") {
    super(message, "TRANSACTION_REJECTED");
    this.name = "TransactionRejectedError";
  }
}

export class DecryptionFailedError extends FhevmError {
  constructor(message: string, public readonly handle: string) {
    super(message, "DECRYPTION_FAILED");
    this.name = "DecryptionFailedError";
  }
}
```

**Usage:**

```typescript
// In hooks
if (!signerReady || !signer) {
  throw new WalletNotConnectedError();
}

if (!encryptResult) {
  throw new EncryptionFailedError("No result returned");
}

// In error handling
onError: (err) => {
  if (err instanceof TransactionRejectedError) {
    // Handle specifically
  }
  onError?.(err);
}
```

**Benefits:**
- ✅ Type-safe error handling
- ✅ Easier error categorization
- ✅ Better error messages
- ✅ Improved debugging

---

## 5. Configuration & Constants

### Issue: Magic Numbers and Strings Scattered

```typescript
// ❌ FOUND IN MULTIPLE FILES
staleTime: 30_000  // useConfidentialBalances.ts
staleTime: 5000    // useShield.ts (allowance)
staleTime: Infinity // useSignature.ts

gcTime: 5 * 60 * 1000  // useFhevmInstance.ts
gcTime: 30 * 60 * 1000 // useSignature.ts

retry: 2  // useFhevmInstance.ts
```

**Recommendation:** Centralize configuration

```typescript
// ✅ PROPOSED: src/react/core/constants.ts

/**
 * Default query configuration for FHEVM operations.
 */
export const FHEVM_QUERY_DEFAULTS = {
  /** Stale time for balance queries (30 seconds) */
  BALANCE_STALE_TIME: 30_000,

  /** Stale time for allowance queries (5 seconds) */
  ALLOWANCE_STALE_TIME: 5_000,

  /** Stale time for signatures (never stale) */
  SIGNATURE_STALE_TIME: Infinity,

  /** Garbage collection time for instance cache (5 minutes) */
  INSTANCE_GC_TIME: 5 * 60 * 1000,

  /** Garbage collection time for signatures (30 minutes) */
  SIGNATURE_GC_TIME: 30 * 60 * 1000,

  /** Number of retries for instance initialization */
  INSTANCE_RETRY_COUNT: 2,

  /** Default initialization timeout (30 seconds) */
  DEFAULT_INIT_TIMEOUT: 30_000,
} as const;

/**
 * ERC7984 function signatures.
 */
export const ERC7984_FUNCTIONS = {
  TRANSFER: "confidentialTransfer(address,bytes32,bytes)",
  BALANCE_OF: "confidentialBalanceOf(address)",
  WRAP: "wrap(address,uint256)",
  UNWRAP: "unwrap(address)",
} as const;

/**
 * Common contract addresses.
 */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
```

**Usage:**

```typescript
import { FHEVM_QUERY_DEFAULTS, ZERO_ADDRESS } from "../core/constants";

const balanceQuery = useQuery({
  queryKey: fhevmKeys.balances(chainId, contractAddresses, account),
  queryFn: async () => { ... },
  staleTime: FHEVM_QUERY_DEFAULTS.BALANCE_STALE_TIME,
  gcTime: FHEVM_QUERY_DEFAULTS.INSTANCE_GC_TIME,
});
```

---

## 6. Testing Improvements

### Issue: Test Code Contains Duplication

From previous context, tests have repeated patterns for TanStack Query testing.

**Recommendation:** Create test utilities

```typescript
// ✅ PROPOSED: test/utils/queryTestHelpers.ts

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

/**
 * Creates a wrapper with a fresh QueryClient for testing.
 */
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Waits for a mutation to complete (success or error).
 */
export async function waitForMutation(
  result: { current: { isPending: boolean } }
) {
  await waitFor(() => {
    expect(result.current.isPending).toBe(false);
  });
}

/**
 * Waits for a query to complete loading.
 */
export async function waitForQuery(
  result: { current: { isLoading: boolean } }
) {
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
}
```

---

## 7. Documentation Improvements

### Missing Documentation

1. **Architecture Decision Records (ADRs)** - Why TanStack Query? Why this hook structure?
2. **Migration guide** - How to upgrade from legacy hooks
3. **Performance guide** - Query key invalidation strategies
4. **Error handling guide** - How to handle errors in applications

**Recommendation:** Add documentation directory

```
notes/
├── TANSTACK_QUERY_PLAN.md (existing)
├── CODE_ANALYSIS.md (this file)
├── ADR_001_TANSTACK_QUERY.md (new)
├── ADR_002_HOOK_ARCHITECTURE.md (new)
├── MIGRATION_GUIDE.md (new)
├── PERFORMANCE_GUIDE.md (new)
└── ERROR_HANDLING_GUIDE.md (new)
```

---

## 8. Code Quality Metrics

### Current State

| Metric | Score | Notes |
|--------|-------|-------|
| **Code Organization** | 6/10 | Flat structure, mixed concerns |
| **Type Safety** | 8/10 | Good types, but scattered |
| **Error Handling** | 6/10 | Inconsistent, no custom errors |
| **Code Duplication** | 6/10 | ~70 lines of duplicated patterns |
| **Documentation** | 7/10 | Good JSDoc, missing ADRs |
| **Test Coverage** | 9/10 | 420 tests, excellent coverage |
| **Performance** | 8/10 | TanStack Query optimized |
| **Maintainability** | 7/10 | Good, but could be better |

**Overall:** 7.2/10 (Good, with clear improvement path)

### After Refactoring (Projected)

| Metric | Score | Improvement |
|--------|-------|-------------|
| **Code Organization** | 9/10 | +3 (feature-based structure) |
| **Type Safety** | 9/10 | +1 (consolidated types) |
| **Error Handling** | 9/10 | +3 (custom error classes) |
| **Code Duplication** | 9/10 | +3 (extracted utilities) |
| **Documentation** | 9/10 | +2 (ADRs + guides) |
| **Test Coverage** | 9/10 | +0 (already excellent) |
| **Performance** | 8/10 | +0 (already optimized) |
| **Maintainability** | 9/10 | +2 (better structure) |

**Projected Overall:** 8.9/10 (Excellent)

---

## 9. Implementation Roadmap

### Phase 1: Low-Hanging Fruit (1-2 days)

1. ✅ Extract `useMutationWrapper` utility
2. ✅ Extract `normalizeTransactionError` utility
3. ✅ Extract `useMutationStatus` utility
4. ✅ Create `constants.ts` with shared configuration
5. ✅ Add custom error classes

**Impact:** -70 lines of duplication, better error handling

### Phase 2: Restructuring (2-3 days)

1. ✅ Reorganize into feature-based directory structure
2. ✅ Consolidate type definitions
3. ✅ Move legacy hooks to `legacy/` directory
4. ✅ Update all imports

**Impact:** Better discoverability, clear deprecation path

### Phase 3: Testing & Documentation (1-2 days)

1. ✅ Create test utilities
2. ✅ Write ADRs
3. ✅ Write migration guide
4. ✅ Write error handling guide

**Impact:** Better developer experience, easier onboarding

### Phase 4: Advanced (Future)

1. ❌ Implement query invalidation strategies (post-mutation)
2. ❌ Add optimistic updates for transfers
3. ❌ Implement request batching for batch decryption
4. ❌ Add telemetry/analytics hooks

**Impact:** Enhanced performance, better UX

---

## 10. Specific Code Smells

### Smell 1: Provider Nested Contexts

```typescript
// ❌ CURRENT: FhevmProvider.tsx
return (
  <FhevmContext.Provider value={contextValue}>
    <QueryClientProvider client={fhevmQueryClient}>
      <InMemoryStorageProvider>{children}</InMemoryStorageProvider>
    </QueryClientProvider>
  </FhevmContext.Provider>
);
```

**Issue:** Multiple nested providers, hard to test in isolation.

**Recommendation:** Extract composition to a separate component

```typescript
// ✅ PROPOSED: src/react/core/FhevmProviderInternal.tsx

function FhevmProviderInternal({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={fhevmQueryClient}>
      <InMemoryStorageProvider>
        {children}
      </InMemoryStorageProvider>
    </QueryClientProvider>
  );
}

// In FhevmProvider.tsx
return (
  <FhevmContext.Provider value={contextValue}>
    <FhevmProviderInternal>{children}</FhevmProviderInternal>
  </FhevmContext.Provider>
);
```

---

### Smell 2: useEffect for Async Data Fetching

```typescript
// ❌ CURRENT: useShield.ts lines 96-118
useEffect(() => {
  if (providedUnderlying || !provider || !wrapperAddress) return;

  let cancelled = false;
  const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, provider);

  wrapper
    .underlying()
    .then((addr: string) => {
      if (!cancelled) setUnderlyingAddress(addr as `0x${string}`);
    })
    .catch((err: unknown) => {
      console.error("[useShield] Failed to fetch underlying address:", err);
    });

  return () => {
    cancelled = true;
  };
}, [providedUnderlying, provider, wrapperAddress]);
```

**Issue:** Manual async state management with useEffect. This should use `useQuery`!

**Recommendation:** Convert to useQuery

```typescript
// ✅ PROPOSED
const underlyingQuery = useQuery({
  queryKey: ["underlyingToken", wrapperAddress],
  queryFn: async (): Promise<`0x${string}`> => {
    if (!provider) throw new Error("Provider not available");
    const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, provider);
    const addr = await wrapper.underlying();
    return addr as `0x${string}`;
  },
  enabled: !providedUnderlying && !!provider && !!wrapperAddress,
  staleTime: Infinity, // Underlying address never changes
});

const underlyingAddress = providedUnderlying ?? underlyingQuery.data;
```

**Benefits:**
- ✅ Automatic error handling
- ✅ Loading states
- ✅ Request deduplication
- ✅ No manual cleanup
- ✅ DevTools visibility

---

### Smell 3: Manual Status Aggregation

```typescript
// ❌ CURRENT: FhevmProvider.tsx
const status: FhevmStatus = useMemo(() => {
  if (scriptStatus === "loading") return "initializing";
  if (scriptStatus === "error") return "error";
  return instanceStatus;
}, [scriptStatus, instanceStatus]);

const error = scriptError ?? instanceError;
```

**Issue:** Manual aggregation logic. Could be extracted.

**Recommendation:** Create a status aggregator utility

```typescript
// ✅ PROPOSED: src/react/hooks/utils/statusAggregator.ts

type StatusInput = {
  status: FhevmStatus;
  error: Error | null;
};

export function aggregateStatuses(...inputs: StatusInput[]): {
  status: FhevmStatus;
  error: Error | null;
} {
  // First error takes precedence
  for (const input of inputs) {
    if (input.status === "error") {
      return { status: "error", error: input.error };
    }
  }

  // Then initializing
  for (const input of inputs) {
    if (input.status === "initializing") {
      return { status: "initializing", error: null };
    }
  }

  // All ready
  if (inputs.every(input => input.status === "ready")) {
    return { status: "ready", error: null };
  }

  // Default to idle
  return { status: "idle", error: null };
}
```

**Usage:**

```typescript
const { status, error } = aggregateStatuses(
  { status: scriptStatus, error: scriptError },
  { status: instanceStatus, error: instanceError }
);
```

---

## 11. Performance Optimizations

### Current State: Good

✅ TanStack Query handles caching
✅ React.memo not needed (hooks are lightweight)
✅ useCallback/useMemo used appropriately

### Potential Improvements

1. **Query key normalization**
   - Addresses should always be lowercased before keys
   - Currently some keys do this, some don't

2. **Batch invalidation strategies**
   - After transfer, invalidate sender + receiver balances
   - Currently no automatic invalidation

```typescript
// ✅ PROPOSED: Add to useConfidentialTransfer
onSuccess: (data, variables) => {
  // Invalidate sender's balance
  queryClient.invalidateQueries({
    queryKey: fhevmKeys.balanceFor(chainId, contractAddress, address),
  });

  // Invalidate receiver's balance
  queryClient.invalidateQueries({
    queryKey: fhevmKeys.balanceFor(chainId, contractAddress, variables.to),
  });

  onSuccess?.(data.txHash);
}
```

---

## 12. Security Considerations

### Current State: Good

✅ No hardcoded secrets
✅ Storage security documented
✅ User signature caching explicit

### Recommendations

1. **Add security documentation**
   - Document when signatures are stored
   - Document clearing cache strategies

2. **Add query cache clearance on wallet disconnect**

```typescript
// ✅ PROPOSED: Add to FhevmProvider
useEffect(() => {
  if (!isConnected) {
    // Clear all sensitive cached data
    queryClient.removeQueries({ queryKey: fhevmKeys.decrypt() });
    queryClient.removeQueries({ queryKey: fhevmKeys.signature() });
  }
}, [isConnected, queryClient]);
```

---

## 13. Summary of Recommendations

### High Priority (Immediate Impact)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 1 | Extract mutation wrapper utility | 2h | High |
| 2 | Standardize error handling | 3h | High |
| 3 | Create constants file | 1h | Medium |
| 4 | Convert useShield's useEffect to useQuery | 1h | High |
| 5 | Add cache invalidation after mutations | 2h | Medium |

**Total:** ~9 hours, **High impact**

### Medium Priority (Code Quality)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 6 | Reorganize into feature-based structure | 4h | Medium |
| 7 | Consolidate type definitions | 3h | Medium |
| 8 | Create custom error classes | 2h | Medium |
| 9 | Move legacy hooks to legacy/ | 1h | Low |

**Total:** ~10 hours, **Medium impact**

### Low Priority (Nice to Have)

| # | Recommendation | Effort | Impact |
|---|----------------|--------|--------|
| 10 | Write ADRs | 3h | Low |
| 11 | Create test utilities | 2h | Low |
| 12 | Add security documentation | 2h | Low |

**Total:** ~7 hours, **Low impact**

---

## 14. Conclusion

The codebase is **in good shape** thanks to the recent TanStack Query migration. The main improvements are:

1. **Organization** - Restructure into feature-based directories
2. **DRY principle** - Extract ~70 lines of duplicated code
3. **Type safety** - Custom error classes and consolidated types
4. **Documentation** - ADRs and migration guides

**Estimated total effort:** ~26 hours (3-4 days)
**Expected quality improvement:** 7.2/10 → 8.9/10

The refactoring is **low-risk** because:
- ✅ All changes are internal (no API breakage)
- ✅ 420 tests provide safety net
- ✅ Can be done incrementally
- ✅ TypeScript catches breaking changes

**Recommendation:** Proceed with Phase 1 (high priority items) first, then reassess based on impact.
