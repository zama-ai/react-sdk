# Refactoring Implementation Plan

**Date:** 2026-02-03
**Status:** Proposed
**Priority:** High Priority Items First

---

## Overview

This document outlines a **practical, incremental refactoring plan** based on the code analysis. The plan is divided into **safe, testable iterations** that can be implemented without breaking existing functionality.

---

## Principles

1. **No breaking changes** - All refactoring is internal
2. **Test-driven** - Run tests after each step
3. **Incremental** - Small, mergeable changes
4. **Backward compatible** - Support legacy exports temporarily
5. **Type-safe** - TypeScript catches all breakages

---

## Phase 1: Extract Utilities (High Priority)

**Goal:** Eliminate code duplication (~70 lines)
**Effort:** ~9 hours
**Risk:** Low
**Tests affected:** None (internal refactoring)

### Step 1.1: Create Mutation Utilities

**File:** `src/react/hooks/utils/useMutationWrapper.ts`

```typescript
import { useCallback } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

/**
 * Wraps useMutation's mutate function to return a Promise.
 * Maintains backward compatibility with async/await patterns.
 *
 * @example
 * ```typescript
 * const mutation = useMutation<Result, Error, Params>({ ... });
 * const execute = useMutationWrapper(mutation);
 * await execute(params); // Returns Promise<void>
 * ```
 */
export function useMutationWrapper<TData, TError, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables, unknown>
) {
  return useCallback(
    async (variables: TVariables): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        mutation.mutate(variables, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error as TError),
        });
      });
    },
    [mutation.mutate]
  );
}
```

**Applies to:**
- `useConfidentialTransfer.ts` (lines 162-177)
- `useShield.ts` (lines 198-213)
- `useUnshield.ts` (similar pattern)

**Checklist:**
- [ ] Create file
- [ ] Update `useConfidentialTransfer.ts`
- [ ] Update `useShield.ts`
- [ ] Update `useUnshield.ts`
- [ ] Run tests
- [ ] Commit

---

### Step 1.2: Create Error Handling Utilities

**File:** `src/react/hooks/utils/errorHandling.ts`

```typescript
/**
 * Checks if an error represents a user rejection.
 */
export function isUserRejection(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("user cancelled") ||
    message.includes("action_rejected")
  );
}

/**
 * Checks if an error is due to insufficient funds.
 */
export function isInsufficientFunds(error: Error): boolean {
  return error.message.toLowerCase().includes("insufficient funds");
}

/**
 * Checks if an error is a nonce conflict.
 */
export function isNonceConflict(error: Error): boolean {
  const message = error.message.toLowerCase();
  return message.includes("nonce too low") || message.includes("nonce");
}

/**
 * Normalizes transaction errors into user-friendly messages.
 */
export function normalizeTransactionError(error: Error): Error {
  if (isUserRejection(error)) {
    return new Error("Transaction rejected by user");
  }

  if (isInsufficientFunds(error)) {
    return new Error("Insufficient funds for transaction");
  }

  if (isNonceConflict(error)) {
    return new Error("Transaction nonce conflict. Please try again.");
  }

  // Return original error if no normalization applied
  return error;
}
```

**Applies to:**
- `useConfidentialTransfer.ts` (lines 147-158)
- `useShield.ts` (lines 184-194)
- `useUnshield.ts` (similar pattern)

**Checklist:**
- [ ] Create file
- [ ] Update `useConfidentialTransfer.ts`
- [ ] Update `useShield.ts`
- [ ] Update `useUnshield.ts`
- [ ] Run tests
- [ ] Commit

---

### Step 1.3: Create Status Derivation Utility

**File:** `src/react/hooks/utils/useMutationStatus.ts`

```typescript
import { useMemo } from "react";
import type { UseMutationResult } from "@tanstack/react-query";

type MutationStatusMap<T extends string> = {
  pending: T;
  success: T;
  error: T;
  idle: T;
};

/**
 * Derives a custom status string from mutation state.
 *
 * @example
 * ```typescript
 * const mutation = useMutation({ ... });
 * const status = useMutationStatus(mutation, {
 *   pending: "signing",
 *   success: "success",
 *   error: "error",
 *   idle: "idle",
 * });
 * ```
 */
export function useMutationStatus<T extends string>(
  mutation: Pick<UseMutationResult<any, any, any, any>, "isPending" | "isSuccess" | "isError">,
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

**Applies to:**
- `useConfidentialTransfer.ts` (lines 179-187)
- `useShield.ts` (lines 216-221)
- `useUnshield.ts` (similar pattern)

**Checklist:**
- [ ] Create file
- [ ] Update `useConfidentialTransfer.ts`
- [ ] Update `useShield.ts`
- [ ] Update `useUnshield.ts`
- [ ] Run tests
- [ ] Commit

---

### Step 1.4: Create Constants File

**File:** `src/react/core/constants.ts`

```typescript
/**
 * Default query configuration for FHEVM operations.
 */
export const FHEVM_QUERY_DEFAULTS = {
  /** Stale time for balance queries (30 seconds) */
  BALANCE_STALE_TIME: 30_000,

  /** Stale time for allowance queries (5 seconds) */
  ALLOWANCE_STALE_TIME: 5_000,

  /** Stale time for signatures (never stale once created) */
  SIGNATURE_STALE_TIME: Infinity,

  /** Garbage collection time for instance cache (5 minutes) */
  INSTANCE_GC_TIME: 5 * 60 * 1000,

  /** Garbage collection time for signatures (30 minutes) */
  SIGNATURE_GC_TIME: 30 * 60 * 1000,

  /** Garbage collection time for balances (5 minutes) */
  BALANCE_GC_TIME: 5 * 60 * 1000,

  /** Number of retries for instance initialization */
  INSTANCE_RETRY_COUNT: 2,

  /** Default initialization timeout (30 seconds) */
  DEFAULT_INIT_TIMEOUT: 30_000,
} as const;

/**
 * ERC7984 function signatures.
 */
export const ERC7984_FUNCTIONS = {
  /** Confidential transfer: confidentialTransfer(address,bytes32,bytes) */
  TRANSFER: "confidentialTransfer(address,bytes32,bytes)",

  /** Get confidential balance: confidentialBalanceOf(address) */
  BALANCE_OF: "confidentialBalanceOf(address)",

  /** Wrap ERC20 to ERC7984: wrap(address,uint256) */
  WRAP: "wrap(address,uint256)",

  /** Unwrap ERC7984 to ERC20: unwrap(address) */
  UNWRAP: "unwrap(address)",
} as const;

/**
 * Common contract addresses.
 */
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
```

**Applies to:**
- `useConfidentialBalances.ts` (staleTime: 30_000, gcTime: 5 * 60 * 1000)
- `useShield.ts` (staleTime: 5000, ZERO_ADDRESS)
- `useFhevmInstance.ts` (retry: 2, gcTime: 5 * 60 * 1000)
- `useSignature.ts` (staleTime: Infinity, gcTime: 30 * 60 * 1000)
- `useConfidentialTransfer.ts` (functionName)

**Checklist:**
- [ ] Create file
- [ ] Update all files with magic numbers
- [ ] Export from `src/react/core/index.ts`
- [ ] Run tests
- [ ] Commit

---

### Step 1.5: Convert useShield's useEffect to useQuery

**File:** `src/react/useShield.ts` (lines 96-118)

**Current (bad):**
```typescript
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

  return () => { cancelled = true; };
}, [providedUnderlying, provider, wrapperAddress]);
```

**New (good):**
```typescript
// Query for underlying token address
const underlyingQuery = useQuery({
  queryKey: ["underlyingToken", wrapperAddress],
  queryFn: async (): Promise<`0x${string}`> => {
    if (!provider) {
      throw new Error("Provider not available");
    }
    const wrapper = new ethers.Contract(wrapperAddress, ERC20TOERC7984_ABI, provider);
    const addr = await wrapper.underlying();
    return addr as `0x${string}`;
  },
  enabled: !providedUnderlying && !!provider && !!wrapperAddress && wrapperAddress !== ZERO_ADDRESS,
  staleTime: Infinity, // Underlying address never changes
});

// Use provided underlying address, or fall back to queried value
const underlyingAddress = providedUnderlying ?? underlyingQuery.data;
```

**Changes:**
- Remove `useState` for underlyingAddress
- Remove `useEffect` for fetching
- Add `useQuery` for fetching
- Remove manual error handling (useQuery handles it)

**Checklist:**
- [ ] Update `useShield.ts`
- [ ] Remove `setUnderlyingAddress` state
- [ ] Add `underlyingQuery` useQuery
- [ ] Update `underlyingAddress` derivation
- [ ] Run tests
- [ ] Commit

---

### Step 1.6: Add Cache Invalidation After Mutations

**File:** `src/react/useConfidentialTransfer.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Inside useConfidentialTransfer:
const queryClient = useQueryClient();

const mutation = useMutation<TransferResult, Error, TransferParams>({
  mutationKey: chainId
    ? fhevmKeys.transferFor(chainId, contractAddress)
    : ["fhevm", "transfer", "disabled"],

  mutationFn: async ({ to, amount }: TransferParams): Promise<TransferResult> => {
    // ... existing code
  },

  onSuccess: (data, variables) => {
    // Invalidate sender's balance
    if (chainId && address) {
      queryClient.invalidateQueries({
        queryKey: fhevmKeys.balanceFor(chainId, contractAddress, address),
      });
    }

    // Invalidate receiver's balance
    if (chainId) {
      queryClient.invalidateQueries({
        queryKey: fhevmKeys.balanceFor(chainId, contractAddress, variables.to),
      });
    }

    // Call user's onSuccess
    onSuccess?.(data.txHash);
  },
});
```

**Applies to:**
- `useConfidentialTransfer.ts` - Invalidate sender + receiver balances
- `useShield.ts` - Invalidate wrapper balance (already refetches allowance)
- `useUnshield.ts` - Invalidate wrapper balance

**Checklist:**
- [ ] Update `useConfidentialTransfer.ts`
- [ ] Update `useShield.ts`
- [ ] Update `useUnshield.ts`
- [ ] Run tests
- [ ] Verify cache invalidation works
- [ ] Commit

---

## Phase 2: Type System Improvements (Medium Priority)

**Goal:** Consolidate types, add custom errors
**Effort:** ~5 hours
**Risk:** Low (type-only changes)

### Step 2.1: Create Custom Error Classes

**File:** `src/types/errors.ts`

```typescript
/**
 * Base error class for all FHEVM-related errors.
 */
export class FhevmError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "FhevmError";
  }
}

/**
 * FHEVM instance not ready.
 */
export class FhevmNotReadyError extends FhevmError {
  constructor(message = "FHEVM not ready. Please wait for initialization.") {
    super(message, "FHEVM_NOT_READY");
    this.name = "FhevmNotReadyError";
  }
}

/**
 * Wallet not connected.
 */
export class WalletNotConnectedError extends FhevmError {
  constructor(message = "Wallet not connected. Please connect your wallet.") {
    super(message, "WALLET_NOT_CONNECTED");
    this.name = "WalletNotConnectedError";
  }
}

/**
 * Encryption operation failed.
 */
export class EncryptionFailedError extends FhevmError {
  constructor(message = "Encryption failed") {
    super(message, "ENCRYPTION_FAILED");
    this.name = "EncryptionFailedError";
  }
}

/**
 * User rejected transaction.
 */
export class TransactionRejectedError extends FhevmError {
  constructor(message = "Transaction rejected by user") {
    super(message, "TRANSACTION_REJECTED");
    this.name = "TransactionRejectedError";
  }
}

/**
 * Decryption operation failed.
 */
export class DecryptionFailedError extends FhevmError {
  constructor(
    message: string,
    public readonly handle: string
  ) {
    super(message, "DECRYPTION_FAILED");
    this.name = "DecryptionFailedError";
  }
}

/**
 * Chain not configured.
 */
export class ChainNotConfiguredError extends FhevmError {
  constructor(
    public readonly chainId: number
  ) {
    super(`Chain ${chainId} is not configured`, "CHAIN_NOT_CONFIGURED");
    this.name = "ChainNotConfiguredError";
  }
}
```

**Export from:** `src/types/index.ts`

**Checklist:**
- [ ] Create `src/types/errors.ts`
- [ ] Export from `src/types/index.ts`
- [ ] Export from `src/index.ts`
- [ ] Update hooks to use custom errors
- [ ] Update errorHandling.ts to handle custom errors
- [ ] Run tests
- [ ] Commit

---

### Step 2.2: Consolidate Type Definitions

**Goal:** Move all types to `src/types/`

**Current state:**
```
src/types/
├── balance.ts
├── encryption.ts
├── shield.ts
└── transfer.ts

src/react/
├── useEncrypt.ts (defines types)
├── context.ts (defines types)
└── queryKeys.ts (defines types)
```

**Target state:**
```
src/types/
├── core.ts              # FhevmConfig, FhevmInstance
├── context.ts           # FhevmContextValue, FhevmStatus
├── encryption.ts        # (existing, verify completeness)
├── decryption.ts        # DecryptRequest, DecryptParams, DecryptResult
├── transactions.ts      # (existing as transfer.ts + shield.ts, consolidate)
├── balances.ts          # (existing)
├── queries.ts           # FhevmQueryKey (from queryKeys.ts)
├── errors.ts            # (new from step 2.1)
└── index.ts             # Re-export all
```

**Actions:**

1. **Create `src/types/queries.ts`:**
   - Move `FhevmQueryKey` from `queryKeys.ts`

2. **Create `src/types/context.ts`:**
   - Move `FhevmContextValue`, `FhevmStatus` from `context.ts`

3. **Update `src/types/transactions.ts`:**
   - Consolidate `transfer.ts` and `shield.ts`
   - Add unshield types

4. **Update all imports:**
   - Change `from "../types/transfer"` to `from "../types/transactions"`
   - Change `from "./context"` to `from "../types/context"`

**Checklist:**
- [ ] Create new type files
- [ ] Move type definitions
- [ ] Update all imports
- [ ] Verify no unused exports
- [ ] Run tests
- [ ] Run `pnpm build`
- [ ] Commit

---

## Phase 3: Directory Restructure (Medium Priority)

**Goal:** Organize into feature-based structure
**Effort:** ~4 hours
**Risk:** Medium (many file moves)

### Step 3.1: Create New Directory Structure

```bash
mkdir -p src/react/core
mkdir -p src/react/hooks/encryption
mkdir -p src/react/hooks/decryption
mkdir -p src/react/hooks/transactions
mkdir -p src/react/hooks/balances
mkdir -p src/react/hooks/utils
mkdir -p src/react/legacy
```

### Step 3.2: Move Files to New Structure

**Core:**
```bash
mv src/react/FhevmProvider.tsx src/react/core/
mv src/react/context.ts src/react/core/
mv src/react/queryClient.ts src/react/core/
mv src/react/queryKeys.ts src/react/core/
# constants.ts already in core/
```

**Hooks - Encryption:**
```bash
mv src/react/useEncrypt.ts src/react/hooks/encryption/
```

**Hooks - Decryption:**
```bash
mv src/react/useUserDecrypt.ts src/react/hooks/decryption/
mv src/react/usePublicDecrypt.ts src/react/hooks/decryption/
mv src/react/useUserDecryptedValue.ts src/react/hooks/decryption/
mv src/react/useSignature.ts src/react/hooks/decryption/
```

**Hooks - Transactions:**
```bash
mv src/react/useConfidentialTransfer.ts src/react/hooks/transactions/
mv src/react/useShield.ts src/react/hooks/transactions/
mv src/react/useUnshield.ts src/react/hooks/transactions/
```

**Hooks - Balances:**
```bash
mv src/react/useConfidentialBalances.ts src/react/hooks/balances/
```

**Hooks - Utils:**
```bash
mv src/react/useEthersSigner.ts src/react/hooks/utils/
mv src/react/useFhevmClient.ts src/react/hooks/utils/
mv src/react/useFhevmStatus.ts src/react/hooks/utils/
mv src/react/useFhevmInstance.ts src/react/hooks/utils/
# useMutationWrapper.ts already in utils/
# errorHandling.ts already in utils/
# useMutationStatus.ts already in utils/
```

**Legacy:**
```bash
mv src/react/useFhevm.tsx src/react/legacy/
mv src/react/useFHEEncryption.ts src/react/legacy/
mv src/react/useFHEDecrypt.ts src/react/legacy/
mv src/react/useInMemoryStorage.tsx src/react/legacy/
```

### Step 3.3: Create index.ts Files

Create `index.ts` in each subdirectory to re-export:

**`src/react/core/index.ts`:**
```typescript
export * from "./FhevmProvider";
export * from "./context";
export * from "./queryClient";
export * from "./queryKeys";
export * from "./constants";
```

**`src/react/hooks/encryption/index.ts`:**
```typescript
export * from "./useEncrypt";
```

**`src/react/hooks/decryption/index.ts`:**
```typescript
export * from "./useUserDecrypt";
export * from "./usePublicDecrypt";
export * from "./useUserDecryptedValue";
export * from "./useSignature";
```

**`src/react/hooks/transactions/index.ts`:**
```typescript
export * from "./useConfidentialTransfer";
export * from "./useShield";
export * from "./useUnshield";
```

**`src/react/hooks/balances/index.ts`:**
```typescript
export * from "./useConfidentialBalances";
```

**`src/react/hooks/utils/index.ts`:**
```typescript
export * from "./useEthersSigner";
export * from "./useFhevmClient";
export * from "./useFhevmStatus";
export * from "./useFhevmInstance";
export * from "./useMutationWrapper";
export * from "./errorHandling";
export * from "./useMutationStatus";
```

**`src/react/legacy/index.ts`:**
```typescript
export * from "./useFhevm";
export * from "./useFHEEncryption";
export * from "./useFHEDecrypt";
export * from "./useInMemoryStorage";
```

### Step 3.4: Update Main index.ts

**`src/react/index.ts`:**
```typescript
// Core
export * from "./core";

// Modern hooks
export * from "./hooks/encryption";
export * from "./hooks/decryption";
export * from "./hooks/transactions";
export * from "./hooks/balances";
export * from "./hooks/utils";

// Legacy hooks (deprecated - will be removed in next major version)
export * from "./legacy";
```

### Step 3.5: Update All Internal Imports

Use find-and-replace to update import paths:

```bash
# Example: Update imports in all files
# from "./context" → from "../core/context"
# from "./useEncrypt" → from "../encryption/useEncrypt"
# etc.
```

**Checklist:**
- [ ] Create new directories
- [ ] Move all files
- [ ] Create all index.ts files
- [ ] Update main index.ts
- [ ] Update all internal imports
- [ ] Run tests
- [ ] Run `pnpm build`
- [ ] Verify no import errors
- [ ] Commit

---

## Phase 4: Documentation (Low Priority)

**Goal:** Add ADRs and guides
**Effort:** ~7 hours
**Risk:** None (docs only)

### Step 4.1: Architecture Decision Records

**File:** `notes/ADR_001_TANSTACK_QUERY.md`

Document why TanStack Query was chosen:
- Automatic caching
- Request deduplication
- DevTools integration
- Retry logic
- Industry standard

**File:** `notes/ADR_002_HOOK_ARCHITECTURE.md`

Document hook design patterns:
- useMutation for writes
- useQuery for reads
- Wrapper functions for Promise compatibility
- Status derivation patterns

**Checklist:**
- [ ] Write ADR_001
- [ ] Write ADR_002
- [ ] Commit

---

### Step 4.2: Migration Guide

**File:** `notes/MIGRATION_GUIDE.md`

Guide for migrating from legacy hooks:
- `useFHEEncryption` → `useEncrypt`
- `useFHEDecrypt` → `useUserDecrypt` / `usePublicDecrypt`
- `useFhevm` → `useFhevmContext`

**Checklist:**
- [ ] Write migration guide
- [ ] Include code examples
- [ ] Commit

---

### Step 4.3: Error Handling Guide

**File:** `notes/ERROR_HANDLING_GUIDE.md`

Document error handling patterns:
- Custom error classes
- Error normalization
- User rejection detection
- Best practices

**Checklist:**
- [ ] Write error handling guide
- [ ] Include code examples
- [ ] Commit

---

## Testing Strategy

After **each step**, run:

```bash
cd /Users/aurora/Desktop/aurora/dev-ex/react-sdk
pnpm test
```

Expected result: **420 tests passing, 3 skipped**

If tests fail:
1. Review changes
2. Fix issues
3. Re-run tests
4. Commit only when green

---

## Rollback Plan

If any step causes issues:

1. **Revert the commit:**
   ```bash
   git revert HEAD
   ```

2. **Analyze the issue:**
   - Check TypeScript errors
   - Check test failures
   - Check import paths

3. **Fix and retry:**
   - Make corrections
   - Re-run tests
   - Commit fixed version

---

## Success Criteria

### Phase 1 Success

- [ ] All utilities extracted and working
- [ ] 420 tests passing
- [ ] No code duplication in mutation hooks
- [ ] Cache invalidation working after mutations
- [ ] ~70 lines of code removed

### Phase 2 Success

- [ ] Custom error classes implemented
- [ ] All types consolidated in `src/types/`
- [ ] 420 tests passing
- [ ] Build succeeds

### Phase 3 Success

- [ ] Feature-based directory structure in place
- [ ] All imports updated
- [ ] 420 tests passing
- [ ] Build succeeds
- [ ] No breaking changes to public API

### Phase 4 Success

- [ ] ADRs written
- [ ] Migration guide complete
- [ ] Error handling guide complete

---

## Timeline

### Week 1

- **Day 1:** Phase 1 Steps 1.1-1.3 (utilities)
- **Day 2:** Phase 1 Steps 1.4-1.6 (constants, useQuery conversion, cache invalidation)
- **Day 3:** Phase 2 (type improvements)
- **Day 4:** Phase 3 (directory restructure)
- **Day 5:** Phase 4 (documentation) + Buffer

### Estimated Total Time

- **Phase 1:** 9 hours (1.5 days)
- **Phase 2:** 5 hours (0.5 days)
- **Phase 3:** 4 hours (0.5 days)
- **Phase 4:** 7 hours (1 day)
- **Buffer:** 0.5 days

**Total:** ~4 days

---

## Next Steps

Ready to begin? Let's start with **Phase 1, Step 1.1**: Extract the mutation wrapper utility.

Would you like me to implement this now?
