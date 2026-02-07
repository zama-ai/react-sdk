# Security Implementation TODO

**Created:** 2026-02-03
**Status:** Planning - To Be Implemented Later
**Priority:** HIGH

---

## Overview

This document tracks security improvements identified in the comprehensive security analysis. These items are documented for future implementation and should not be started until explicitly prioritized.

---

## Quick Links

- 📊 **[SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)** - Full analysis (945 lines)
- 🛠️ **[SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md)** - Implementation details (897 lines)
- 📖 **[SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)** - Developer guide (640 lines)

---

## Current Risk Assessment

**Risk Level:** MEDIUM-HIGH
**OWASP Compliance:** 25% (1.5/6 guidelines)

### Critical Issues

1. 🔴 **Private keys stored in plain text** - No encryption at rest
2. 🔴 **Public getter exposes private key** - `signature.privateKey` accessible
3. 🟠 **localStorage vulnerable to XSS** - Plain text accessible to any script
4. 🟡 **No key rotation mechanism** - Keys persist without lifecycle management
5. 🟡 **No security event logging** - No audit trail for security events

---

## Phase 1: Quick Wins (Non-Breaking) - 2 Weeks

### Task 1.1: Create Encrypted Storage Adapter

**Priority:** 🔴 HIGH
**Effort:** 3 days
**Breaking:** No

**What to Build:**
- `src/storage/EncryptedStorageAdapter.ts` - AES-GCM encryption using Web Crypto API
- `deriveKeyFromPassword()` - PBKDF2 key derivation
- `generateDeviceKey()` - Device-bound key generation
- Tests for encryption/decryption
- Documentation with examples

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 1.1 (lines 60-180)

---

### Task 1.2: Add Security Event Logging

**Priority:** 🟠 MEDIUM
**Effort:** 2 days
**Breaking:** No

**What to Build:**
- `src/security/SecurityLogger.ts` - Event logging interface
- `MemorySecurityLogger` - In-memory implementation
- `NoOpSecurityLogger` - No-op for production
- Integration in `FhevmDecryptionSignature`
- Event types: KEY_GENERATED, KEY_LOADED, DECRYPT_SUCCESS, etc.

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 1.2 (lines 232-330)

---

### Task 1.3: Add Security Documentation

**Priority:** 🟠 MEDIUM
**Effort:** 1 day
**Breaking:** No

**What to Create:**
- `docs/security/README.md` - Security overview
- `docs/security/storage-options.md` - Storage comparison
- `docs/security/csp-configuration.md` - CSP headers guide
- `docs/security/best-practices.md` - Security checklist

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 1.3 (lines 332-418)

---

## Phase 2: API Improvements (Soft Breaking) - 2 Weeks

### Task 2.1: Deprecate Public Private Key Getter

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** Soft (warnings only)

**What to Change:**
- Add deprecation warning to `FhevmDecryptionSignature.privateKey` getter
- Add new `decrypt()` method that uses key internally
- Update documentation

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 2.1 (lines 424-468)

---

### Task 2.2: Add Security Level Configuration

**Priority:** 🟠 MEDIUM
**Effort:** 2 days
**Breaking:** Soft (new optional props)

**What to Add:**
- `SecurityLevel` enum (DEVELOPMENT, PRODUCTION, STRICT)
- Validation in `FhevmProvider`
- Error messages for invalid storage choices
- Auto-detect based on NODE_ENV

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 2.2 (lines 470-580)

---

## Phase 3: Breaking Changes (v2.0) - Months Later

### Task 3.1: Remove Private Key Getter

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** YES

**What to Remove:**
- Delete `public get privateKey()` entirely
- Keep `#privateKey` as internal-only
- Update all tests

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 3.1 (lines 590-605)

---

### Task 3.2: Make Encrypted Storage Required in Production

**Priority:** 🟠 MEDIUM
**Effort:** 1 day
**Breaking:** YES

**What to Change:**
- Default `securityLevel` to PRODUCTION when `NODE_ENV=production`
- Throw error if plain localStorage used in production
- Update migration guide

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 3.2 (lines 607-615)

---

### Task 3.3: Remove Private Key from toJSON

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** YES

**What to Change:**
- Remove `privateKey` from `toJSON()` output
- Create internal `toStorageJSON()` for encrypted storage only
- Update serialization tests

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Task 3.3 (lines 617-640)

---

## Testing Requirements

### Security Test Suite

Create `test/security/SecurityTests.test.ts` with:

1. **Encrypted Storage Tests**
   - Private keys encrypted at rest
   - Decryption fails with wrong key
   - IV uniqueness per encryption

2. **Key Exposure Tests**
   - Private key not in JSON.stringify output
   - Console.log doesn't leak keys
   - Deprecation warnings work

3. **Security Level Tests**
   - PRODUCTION rejects plain localStorage
   - STRICT only allows memoryStorage
   - DEVELOPMENT allows all storage types

4. **Event Logging Tests**
   - Key generation logged
   - Decryption failures logged
   - Storage errors logged

**Code Location:** See SECURITY_IMPROVEMENT_PLAN.md, Testing Strategy (lines 650-770)

---

## Migration Guide for Users

### Current (v1.x) → Future (v2.0)

```typescript
// ❌ v1.x (will break in v2.0)
<FhevmProvider storage={localStorageAdapter} ... />
const key = signature.privateKey; // ⚠️ Deprecated

// ✅ v2.0 (secure)
const storage = new EncryptedStorageAdapter(localStorage, { key });
<FhevmProvider
  storage={storage}
  securityLevel={SecurityLevel.PRODUCTION}
  securityLogger={new MemorySecurityLogger()}
/>
const result = await signature.decrypt(instance, handle, contract);
```

**Full Migration Guide:** See SECURITY_IMPROVEMENT_PLAN.md, lines 780-810

---

## Timeline Summary

| Phase | Start | Duration | Breaking | Deliverables |
|-------|-------|----------|----------|--------------|
| **Phase 1** | TBD | 2 weeks | No | Encrypted storage, logging, docs |
| **Phase 2** | +2 weeks | 2 weeks | Soft | Deprecations, security levels |
| **Phase 3** | +3-4 months | 1 week | YES | v2.0 release |

**Total Timeline:** ~4 months from start to v2.0

---

## Success Metrics

### Before Implementation
- ❌ 0% encrypted storage adoption
- ❌ 25% OWASP compliance
- ⚠️ Plain localStorage in examples
- ❌ No security event logging
- ⚠️ Public key exposure via getter

### After Phase 1
- ✅ EncryptedStorageAdapter available
- ✅ 50% OWASP compliance
- ✅ Security logging available
- ✅ Documentation complete
- ⚠️ Still has public getter (deprecated)

### After Phase 3 (v2.0)
- ✅ 75% OWASP compliance
- ✅ No public key exposure
- ✅ Production enforces encryption
- ✅ Zero security incidents
- ✅ Positive security audit

---

## Code Examples Quick Reference

### Encrypted Storage (Phase 1)

```typescript
import {
  EncryptedStorageAdapter,
  generateDeviceKey
} from '@zama-fhe/react-sdk/storage';

const key = await generateDeviceKey();
const storage = new EncryptedStorageAdapter(localStorage, { key });
```

### Security Logging (Phase 1)

```typescript
import {
  MemorySecurityLogger,
  setSecurityLogger
} from '@zama-fhe/react-sdk/security';

const logger = new MemorySecurityLogger(1000);
setSecurityLogger(logger);
```

### Security Levels (Phase 2)

```typescript
import { SecurityLevel } from '@zama-fhe/react-sdk';

<FhevmProvider
  storage={encryptedStorage}
  securityLevel={SecurityLevel.PRODUCTION}
  securityLogger={logger}
/>
```

### Secure Decrypt (Phase 3)

```typescript
// v2.0: No direct key access
const result = await signature.decrypt(
  instance,
  handle,
  contractAddress
);
```

---

## Dependencies

### External
- ✅ Web Crypto API (built-in, no install needed)
- ✅ No additional npm packages required

### Internal Changes Required
- `src/FhevmDecryptionSignature.ts` - Core class modifications
- `src/storage/` - New adapters
- `src/security/` - New directory
- `src/react/FhevmProvider.tsx` - Add security props
- `test/security/` - New test directory
- `docs/security/` - New docs directory

---

## Risks & Mitigation

### Risk 1: Breaking Changes May Disrupt Users

**Impact:** HIGH
**Mitigation:**
- 6-month deprecation period
- Clear warnings in v1.x
- Comprehensive migration guide
- Community communication

### Risk 2: Encryption Performance Overhead

**Impact:** MEDIUM
**Mitigation:**
- Web Crypto API is hardware-accelerated
- Benchmark target: <10ms per operation
- Cache decrypted keys in memory

### Risk 3: Browser Compatibility

**Impact:** LOW
**Mitigation:**
- Web Crypto API supported in all modern browsers
- Feature detection with fallback
- Document minimum requirements

---

## Implementation Checklist

### Before Starting
- [ ] Read all three security documents
- [ ] Review Web Crypto API documentation
- [ ] Set up security test infrastructure
- [ ] Communicate timeline to team
- [ ] Create GitHub issue/milestone

### Phase 1 Checklist
- [ ] Implement EncryptedStorageAdapter
- [ ] Write encryption/decryption tests (90%+ coverage)
- [ ] Implement SecurityLogger
- [ ] Add security event logging to key operations
- [ ] Create security documentation
- [ ] Add CSP configuration examples
- [ ] Review with security team
- [ ] Beta test with select users

### Phase 2 Checklist
- [ ] Add deprecation warning to privateKey getter
- [ ] Implement SecurityLevel enum
- [ ] Add validation in FhevmProvider
- [ ] Update all examples to use secure patterns
- [ ] Write migration guide
- [ ] Announce deprecations to community

### Phase 3 Checklist
- [ ] Remove privateKey getter
- [ ] Remove privateKey from toJSON
- [ ] Enforce production security requirements
- [ ] Update all documentation
- [ ] Run full test suite
- [ ] Security audit (external)
- [ ] Release v2.0

---

## Questions to Answer Before Starting

1. **Encryption Key Management:**
   - Should we support password-based OR device-bound keys?
   - Where should device keys be stored? (IndexedDB?)
   - How to handle cross-device sync?

2. **Migration Strategy:**
   - Should we provide a codemod for automated migration?
   - How to migrate existing localStorage data to encrypted?
   - What's the plan for users who can't upgrade immediately?

3. **Performance:**
   - What's acceptable encryption overhead? (<10ms?)
   - Should we batch encrypt/decrypt operations?
   - Memory limits for cached keys?

4. **Testing:**
   - Do we need end-to-end security tests?
   - Should we add fuzzing tests for encryption?
   - External security audit budget?

---

## Resources

### Documentation
- 📊 [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) - Detailed vulnerability analysis
- 🛠️ [SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md) - Implementation guide with code
- 📖 [SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md) - Developer quick reference

### External References
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712)
- [Content Security Policy](https://www.w3.org/TR/CSP3/)
- [NIST Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)

---

## Notes

- **Do NOT start implementation** until explicitly prioritized
- All code examples are in SECURITY_IMPROVEMENT_PLAN.md
- Phase 1 can start immediately (non-breaking)
- Phase 3 requires major version bump (v2.0)
- Security analysis complete as of 2026-02-03
- Current SDK users can use memoryStorage or sessionStorage safely

---

**Status:** Planning Complete - Awaiting Prioritization
**Next Action:** Review with team and set timeline
**Last Updated:** 2026-02-03
