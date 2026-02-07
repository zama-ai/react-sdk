# React SDK Development Notes

This directory contains architectural documentation, analysis, and plans for the `@zama-fhe/react-sdk` React SDK.

---

## Documents

### 📋 Planning & Analysis

- **[TANSTACK_QUERY_PLAN.md](./TANSTACK_QUERY_PLAN.md)** - Original TanStack Query integration plan (completed)
- **[CODE_ANALYSIS.md](./CODE_ANALYSIS.md)** - Comprehensive code quality analysis and recommendations
- **[REFACTORING_PLAN.md](./REFACTORING_PLAN.md)** - Detailed implementation plan for refactoring
- **[REFACTORING_PROGRESS.md](./REFACTORING_PROGRESS.md)** - Progress tracking for Phase 1 improvements
- **[REFACTORING_COMPLETE.md](./REFACTORING_COMPLETE.md)** - Phase-by-phase completion report
- **[FINAL_REFACTORING_SUMMARY.md](./FINAL_REFACTORING_SUMMARY.md)** - Complete refactoring summary
- **[LEGACY_REMOVAL_CONFIRMATION.md](./LEGACY_REMOVAL_CONFIRMATION.md)** - Legacy code removal verification

### 🔒 Security Documentation

> **Comprehensive security analysis completed 2026-02-03**

**⭐ Start here:** [SECURITY_README.md](./SECURITY_README.md) - Security documentation hub

- **[SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)** - Quick guide for developers (5-10 min read, TL;DR)
- **[SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)** - Visual diagrams and architecture flows 🎨
- **[SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)** - Comprehensive 945-line security audit
- **[SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md)** - 3-phase implementation roadmap with code examples
- **[SECURITY_TODO.md](./SECURITY_TODO.md)** - Action items checklist (awaiting prioritization)

**Current Status:** Risk Level MEDIUM-HIGH | OWASP Compliance 25% | [Full Details →](./SECURITY_README.md)

### 📚 Architecture Decision Records (Coming Soon)

- **ADR_001_TANSTACK_QUERY.md** - Why we chose TanStack Query
- **ADR_002_HOOK_ARCHITECTURE.md** - Hook design patterns and conventions

### 📖 Guides (Coming Soon)

- **MIGRATION_GUIDE.md** - Migrating from legacy hooks
- **ERROR_HANDLING_GUIDE.md** - Best practices for error handling
- **PERFORMANCE_GUIDE.md** - Query optimization strategies

---

## Status Summary

### ✅ Completed

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Migrate transaction hooks to `useMutation` | ✅ Complete |
| **Phase 2** | Migrate balance hooks to `useQuery` | ✅ Complete |
| **Phase 3** | Add encryption mutation tracking | ✅ Complete |
| **Phase 4** | Implement signature caching | ✅ Complete |
| **Phase 5** | Migrate instance management to `useQuery` | ✅ Complete |

**Result:** All TanStack Query integration phases complete. 420 tests passing.

---

### 🎯 Recommended Next Steps

Based on CODE_ANALYSIS.md, the following improvements are recommended:

#### High Priority (Immediate Impact)

1. **Extract mutation wrapper utility** - Remove ~30 lines of duplication
2. **Standardize error handling** - Create error normalizer utility
3. **Create constants file** - Centralize magic numbers
4. **Convert useShield's useEffect to useQuery** - Better data fetching
5. **Add cache invalidation after mutations** - Automatic balance updates

**Effort:** ~9 hours | **Impact:** High

#### Medium Priority (Code Quality)

6. **Reorganize into feature-based structure** - Better organization
7. **Consolidate type definitions** - Single source of truth
8. **Create custom error classes** - Type-safe error handling
9. **Move legacy hooks to legacy/** - Clear deprecation path

**Effort:** ~10 hours | **Impact:** Medium

#### Low Priority (Nice to Have)

10. **Write ADRs** - Document architectural decisions
11. **Create test utilities** - Reduce test code duplication
12. **Add security documentation** - Cache clearing strategies

**Effort:** ~7 hours | **Impact:** Low

---

## Quality Metrics

### Current State (After Phase 1-5)

| Metric | Score | Notes |
|--------|-------|-------|
| Code Organization | 6/10 | Flat structure, mixed concerns |
| Type Safety | 8/10 | Good types, but scattered |
| Error Handling | 6/10 | Inconsistent patterns |
| Code Duplication | 6/10 | ~70 lines duplicated |
| Documentation | 7/10 | Good JSDoc, missing ADRs |
| Test Coverage | 9/10 | 420 tests, excellent |
| Performance | 8/10 | TanStack Query optimized |
| Maintainability | 7/10 | Good, room for improvement |

**Overall:** 7.2/10 (Good)

### After Refactoring (Projected)

| Metric | Projected Score | Improvement |
|--------|-----------------|-------------|
| Code Organization | 9/10 | +3 |
| Type Safety | 9/10 | +1 |
| Error Handling | 9/10 | +3 |
| Code Duplication | 9/10 | +3 |
| Documentation | 9/10 | +2 |
| Test Coverage | 9/10 | +0 |
| Performance | 8/10 | +0 |
| Maintainability | 9/10 | +2 |

**Overall:** 8.9/10 (Excellent)

---

## Architecture Highlights

### TanStack Query Integration

The SDK now uses TanStack Query v5 for all state management:

- **Mutations** (`useMutation`) for write operations:
  - `useConfidentialTransfer`
  - `useShield`
  - `useUnshield`
  - `useEncrypt` (internal tracking)

- **Queries** (`useQuery`) for read operations:
  - `useConfidentialBalances`
  - `useSignature`
  - `useFhevmInstance`

### Benefits Delivered

✅ **Automatic caching** - No manual state management
✅ **Request deduplication** - Multiple concurrent calls handled
✅ **Built-in retry logic** - Exponential backoff
✅ **DevTools visibility** - Full insight into operations
✅ **Error boundaries** - Consistent error handling
✅ **Background refetch** - Keep data fresh
✅ **Cache invalidation** - Easy to trigger updates

---

## File Structure

```
react-sdk/
├── notes/                          # This directory
│   ├── README.md                   # This file
│   ├── TANSTACK_QUERY_PLAN.md      # Original integration plan
│   ├── CODE_ANALYSIS.md            # Code quality analysis
│   └── REFACTORING_PLAN.md         # Implementation roadmap
│
├── src/
│   ├── react/                      # React hooks (22 files)
│   │   ├── FhevmProvider.tsx       # Main provider (291 lines)
│   │   ├── useConfidentialTransfer.ts
│   │   ├── useShield.ts
│   │   ├── useUnshield.ts
│   │   ├── useConfidentialBalances.ts
│   │   ├── useEncrypt.ts
│   │   ├── useUserDecrypt.ts
│   │   ├── usePublicDecrypt.ts
│   │   ├── useFhevmInstance.ts
│   │   ├── useSignature.ts
│   │   ├── queryKeys.ts            # Query key factory
│   │   └── ...
│   │
│   ├── types/                      # Type definitions
│   │   ├── balance.ts
│   │   ├── encryption.ts
│   │   ├── shield.ts
│   │   └── transfer.ts
│   │
│   └── ...
│
├── test/                           # Tests (420 passing)
└── ...
```

---

## Development Workflow

### Running Tests

```bash
cd react-sdk
pnpm test
```

Expected: **420 tests passing, 3 skipped**

### Building

```bash
pnpm build
```

### Watching for Changes

```bash
pnpm watch
```

---

## Contributing

When adding new features or making changes:

1. **Read the analysis** - Check CODE_ANALYSIS.md for patterns
2. **Follow the plan** - Use REFACTORING_PLAN.md as guide
3. **Write tests** - Maintain 100% test coverage
4. **Run tests** - Ensure 420 tests still pass
5. **Update docs** - Keep this README in sync

---

## Security Overview

### Current State

The SDK has been analyzed for security vulnerabilities, particularly around private key storage and handling. Key findings:

**Risk Level:** MEDIUM-HIGH
**OWASP Compliance:** 25% (1.5/6 guidelines)

### Critical Issues Identified

1. 🔴 **Private keys stored in plain text** - No encryption at rest
2. 🔴 **Public getter exposes private key** - Direct access to sensitive material
3. 🟠 **localStorage accessible to XSS** - Vulnerable to cross-site scripting
4. 🟡 **No key rotation mechanism** - Keys persist without lifecycle management

### Security Recommendations

**For Development:**
- ✅ Use `memoryStorage` (most secure, keys cleared on refresh)
- ✅ Use `sessionStorageAdapter` (keys cleared when tab closes)
- ⚠️ Use `localStorageAdapter` only with explicit warnings

**For Production:**
- ✅ Use `EncryptedStorageAdapter` (coming in Phase 1)
- ✅ Configure CSP headers
- ✅ Implement key rotation
- ✅ Enable security event logging

### Implementation Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| **Phase 1: Quick Wins** | Weeks 1-2 | Planned |
| **Phase 2: API Improvements** | Weeks 3-4 | Planned |
| **Phase 3: Breaking Changes (v2.0)** | Months 3-4 | Planned |

**See [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) for full details.**

---

## Questions?

For architectural decisions, see:
- CODE_ANALYSIS.md - Detailed analysis and recommendations
- REFACTORING_PLAN.md - Step-by-step implementation guide
- TANSTACK_QUERY_PLAN.md - Original integration plan

For security guidance, see:
- **[SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)** - Start here! (TL;DR)
- SECURITY_ANALYSIS.md - Full security analysis
- SECURITY_IMPROVEMENT_PLAN.md - Implementation roadmap

For code patterns, see:
- Query keys: `src/react/queryKeys.ts`
- Hook examples: `src/react/useConfidentialTransfer.ts`
- Provider setup: `src/react/FhevmProvider.tsx`

---

**Last Updated:** 2026-02-03
**SDK Version:** 0.1.0
**Maintainer:** @zama-ai
