# Refactoring Progress Report

**Date:** 2026-02-03
**Status:** Phase 1 Partially Complete
**Tests:** ✅ 420 passing, 3 skipped

---

## Completed Work

### ✅ Phase 1.1: Extract useMutationWrapper Utility

**File Created:** `src/react/utils/useMutationWrapper.ts`

**Impact:**
- Removed **~30 lines** of duplicated code
- Updated 3 hooks: `useConfidentialTransfer`, `useShield`, `useUnshield`

**Before (duplicated in 3 files):**
```typescript
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

**After (1 line):**
```typescript
const transfer = useMutationWrapper(mutation);
```

---

### ✅ Phase 1.2: Extract Error Handling Utilities

**File Created:** `src/react/utils/errorHandling.ts`

**Functions:**
- `isUserRejection(error)` - Detects wallet rejection errors
- `isInsufficientFunds(error)` - Detects insufficient balance errors
- `isNonceConflict(error)` - Detects nonce issues
- `isGasEstimationError(error)` - Detects gas estimation failures
- `normalizeTransactionError(error)` - Converts technical errors to user-friendly messages

**Impact:**
- Removed **~24 lines** of duplicated error handling
- Updated 3 hooks: `useConfidentialTransfer`, `useShield`, `useUnshield`
- Better error messages for users

**Before (duplicated in 3 files):**
```typescript
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

**After:**
```typescript
onError: (err) => {
  const normalizedError = normalizeTransactionError(err);
  onError?.(normalizedError);
}
```

---

## Summary

### Code Reduction
- **Total lines removed:** ~54 lines of duplication
- **New utility files:** 2 files (~140 lines of reusable code)
- **Net improvement:** More maintainable, DRY code

### Quality Improvements
- ✅ Eliminated mutation wrapper boilerplate
- ✅ Standardized error handling across all transaction hooks
- ✅ Better error messages for users
- ✅ Single source of truth for error detection logic
- ✅ All 420 tests still passing

---

## Remaining Work

### Phase 1 (High Priority)

- [ ] **Step 1.3:** Extract `useMutationStatus` utility (~15 lines saved)
- [ ] **Step 1.4:** Create constants file (~20 magic numbers centralized)
- [ ] **Step 1.5:** Convert useShield's useEffect to useQuery (better data fetching)
- [ ] **Step 1.6:** Add cache invalidation after mutations (auto-refresh balances)

**Remaining effort:** ~4 hours

### Phase 2 (Medium Priority)

- [ ] Create custom error classes (`FhevmError`, `WalletNotConnectedError`, etc.)
- [ ] Consolidate type definitions into `src/types/`

**Effort:** ~5 hours

### Phase 3 (Medium Priority)

- [ ] Reorganize into feature-based directory structure
- [ ] Move legacy hooks to `legacy/` directory
- [ ] Create index.ts exports for each subdirectory

**Effort:** ~4 hours

### Phase 4 (Low Priority)

- [ ] Write Architecture Decision Records (ADRs)
- [ ] Create migration guide
- [ ] Write error handling guide

**Effort:** ~7 hours

---

## Test Results

```
 Test Files  28 passed (28)
      Tests  420 passed | 3 skipped (423)
   Duration  2.64s
```

**Status:** ✅ All passing, no regressions

---

## Files Modified

### Created
1. `src/react/utils/useMutationWrapper.ts`
2. `src/react/utils/errorHandling.ts`

### Modified
1. `src/react/useConfidentialTransfer.ts`
2. `src/react/useShield.ts`
3. `src/react/useUnshield.ts`

**Total:** 2 new files, 3 files updated

---

## Next Steps

**Option 1:** Continue with Phase 1 (Steps 1.3-1.6)
- Extract status utility
- Create constants
- Fix useShield useEffect → useQuery
- Add cache invalidation

**Option 2:** Skip to Phase 3 (Directory Restructure)
- Feature-based organization
- Move legacy hooks
- Better discoverability

**Option 3:** Stop here and merge
- Already removed ~54 lines of duplication
- Standardized error handling
- All tests passing

---

## Recommendation

**Continue with Phase 1** (Steps 1.3-1.6) to complete the high-priority improvements. The remaining work will:

1. Remove another ~15 lines of duplication (useMutationStatus)
2. Centralize all magic numbers (constants file)
3. Fix a significant code smell (useEffect → useQuery in useShield)
4. Improve UX (auto-refresh balances after transfers)

**Estimated time:** 2-3 hours
**Impact:** High

After Phase 1 is complete, we can decide whether to proceed with Phases 2-4 or stop there.
