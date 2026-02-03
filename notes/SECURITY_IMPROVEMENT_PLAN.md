# Security Improvement Implementation Plan

**Created:** 2026-02-03
**Related:** [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)
**Status:** Planning Phase

---

## Overview

This document provides a step-by-step implementation plan to address security vulnerabilities identified in the FHEVM React SDK, particularly around private key storage and handling.

---

## Implementation Phases

### Phase 1: Quick Wins (Non-Breaking) - Week 1-2

**Goal:** Improve security without breaking existing APIs

#### Task 1.1: Create Encrypted Storage Adapter

**Priority:** 🔴 HIGH
**Effort:** 3 days
**Breaking:** No

**Implementation:**

```typescript
// File: src/storage/EncryptedStorageAdapter.ts

import type { GenericStringStorage } from './GenericStringStorage';

export interface EncryptionOptions {
  /** Encryption key (must be 256-bit for AES-GCM) */
  key: CryptoKey;
  /** Algorithm (default: AES-GCM) */
  algorithm?: 'AES-GCM';
}

/**
 * Storage adapter that encrypts data before storing.
 * Uses Web Crypto API for AES-GCM encryption.
 *
 * @example
 * ```typescript
 * const key = await deriveKeyFromPassword('user-password');
 * const storage = new EncryptedStorageAdapter(localStorage, { key });
 * ```
 */
export class EncryptedStorageAdapter implements GenericStringStorage {
  #storage: Storage;
  #key: CryptoKey;
  #algorithm: string;
  #prefix: string;

  constructor(
    storage: Storage,
    options: EncryptionOptions,
    prefix = 'fhevm:enc:'
  ) {
    this.#storage = storage;
    this.#key = options.key;
    this.#algorithm = options.algorithm ?? 'AES-GCM';
    this.#prefix = prefix;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      const encrypted = this.#storage.getItem(this.#prefix + key);
      if (!encrypted) return null;

      return await this.#decrypt(encrypted);
    } catch (error) {
      console.error('[EncryptedStorage] Decryption failed:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const encrypted = await this.#encrypt(value);
      this.#storage.setItem(this.#prefix + key, encrypted);
    } catch (error) {
      console.error('[EncryptedStorage] Encryption failed:', error);
      throw error;
    }
  }

  removeItem(key: string): void {
    this.#storage.removeItem(this.#prefix + key);
  }

  private async #encrypt(plaintext: string): Promise<string> {
    // Generate random IV (12 bytes for AES-GCM)
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encode plaintext to bytes
    const encoded = new TextEncoder().encode(plaintext);

    // Encrypt
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: this.#algorithm,
        iv,
      },
      this.#key,
      encoded
    );

    // Combine iv + ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Encode to base64
    return this.#arrayBufferToBase64(combined);
  }

  private async #decrypt(encrypted: string): Promise<string> {
    // Decode from base64
    const combined = this.#base64ToArrayBuffer(encrypted);

    // Split iv and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    // Decrypt
    const plaintext = await crypto.subtle.decrypt(
      {
        name: this.#algorithm,
        iv,
      },
      this.#key,
      ciphertext
    );

    // Decode bytes to string
    return new TextDecoder().decode(plaintext);
  }

  private #arrayBufferToBase64(buffer: Uint8Array): string {
    const binary = String.fromCharCode(...buffer);
    return btoa(binary);
  }

  private #base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

/**
 * Derive an encryption key from a password using PBKDF2.
 *
 * @param password - User's password
 * @param salt - Optional salt (generated if not provided)
 * @param iterations - Number of PBKDF2 iterations (default: 100,000)
 * @returns Encryption key and salt
 */
export async function deriveKeyFromPassword(
  password: string,
  salt?: Uint8Array,
  iterations = 100_000
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  // Generate or use provided salt
  const actualSalt = salt ?? crypto.getRandomValues(new Uint8Array(16));

  // Import password as key material
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive encryption key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: actualSalt,
      iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false, // Not extractable
    ['encrypt', 'decrypt']
  );

  return { key, salt: actualSalt };
}

/**
 * Generate a device-bound encryption key stored in IndexedDB.
 * More secure than password-based encryption for device-local use.
 *
 * @returns Encryption key
 */
export async function generateDeviceKey(): Promise<CryptoKey> {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // Extractable (for storage in IndexedDB)
    ['encrypt', 'decrypt']
  );

  return key;
}
```

**Tests:**

```typescript
// File: test/EncryptedStorageAdapter.test.ts

describe('EncryptedStorageAdapter', () => {
  it('should encrypt data before storing', async () => {
    const key = await generateDeviceKey();
    const storage = new EncryptedStorageAdapter(localStorage, { key });

    await storage.setItem('test', 'sensitive-data');

    const raw = localStorage.getItem('fhevm:enc:test');
    expect(raw).toBeDefined();
    expect(raw).not.toContain('sensitive-data');
  });

  it('should decrypt data when retrieving', async () => {
    const key = await generateDeviceKey();
    const storage = new EncryptedStorageAdapter(localStorage, { key });

    await storage.setItem('test', 'sensitive-data');
    const decrypted = await storage.getItem('test');

    expect(decrypted).toBe('sensitive-data');
  });

  it('should return null for non-existent keys', async () => {
    const key = await generateDeviceKey();
    const storage = new EncryptedStorageAdapter(localStorage, { key });

    const result = await storage.getItem('nonexistent');
    expect(result).toBeNull();
  });

  it('should handle decryption errors gracefully', async () => {
    const key1 = await generateDeviceKey();
    const key2 = await generateDeviceKey();

    const storage1 = new EncryptedStorageAdapter(localStorage, { key: key1 });
    const storage2 = new EncryptedStorageAdapter(localStorage, { key: key2 });

    await storage1.setItem('test', 'data');

    // Try to decrypt with wrong key
    const result = await storage2.getItem('test');
    expect(result).toBeNull();
  });
});
```

**Documentation:**

```markdown
// File: docs/encrypted-storage.md

# Encrypted Storage Adapter

For production applications, use `EncryptedStorageAdapter` to encrypt private keys at rest.

## Usage

### Device-Bound Encryption (Recommended)

```typescript
import {
  EncryptedStorageAdapter,
  generateDeviceKey,
} from '@zama-fhe/react-sdk/storage';

// Generate and store device key (once per device)
const deviceKey = await generateDeviceKey();
// Store key in IndexedDB or secure keychain

// Use encrypted storage
const storage = new EncryptedStorageAdapter(localStorage, {
  key: deviceKey,
});

<FhevmProvider storage={storage} ... />
```

### Password-Based Encryption

```typescript
import {
  EncryptedStorageAdapter,
  deriveKeyFromPassword,
} from '@zama-fhe/react-sdk/storage';

// Prompt user for password
const password = await promptForPassword();

// Derive encryption key
const { key, salt } = await deriveKeyFromPassword(password);
// Store salt for future key derivation

const storage = new EncryptedStorageAdapter(localStorage, { key });
```

## Security Considerations

- **Device-bound keys** are more secure but tied to the device
- **Password-based keys** allow cross-device access but require secure password
- Keys are never stored in plain text
- Uses AES-GCM (authenticated encryption)
```

---

#### Task 1.2: Add Security Event Logging

**Priority:** 🟠 MEDIUM
**Effort:** 2 days
**Breaking:** No

**Implementation:**

```typescript
// File: src/security/SecurityLogger.ts

export enum SecurityEventType {
  KEY_GENERATED = 'key_generated',
  KEY_LOADED = 'key_loaded',
  KEY_EXPIRED = 'key_expired',
  SIGNATURE_CREATED = 'signature_created',
  SIGNATURE_FAILED = 'signature_failed',
  DECRYPT_SUCCESS = 'decrypt_success',
  DECRYPT_FAILED = 'decrypt_failed',
  STORAGE_ERROR = 'storage_error',
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userAddress?: string;
  chainId?: number;
  details?: Record<string, unknown>;
  error?: Error;
}

export interface SecurityLogger {
  log(event: SecurityEvent): void;
  getEvents(filter?: Partial<SecurityEvent>): SecurityEvent[];
  clearEvents(): void;
}

/**
 * In-memory security event logger.
 * Events are lost on page refresh.
 */
export class MemorySecurityLogger implements SecurityLogger {
  #events: SecurityEvent[] = [];
  #maxEvents: number;

  constructor(maxEvents = 1000) {
    this.#maxEvents = maxEvents;
  }

  log(event: SecurityEvent): void {
    this.#events.push(event);

    // Trim old events
    if (this.#events.length > this.#maxEvents) {
      this.#events = this.#events.slice(-this.#maxEvents);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[SecurityEvent]', event);
    }
  }

  getEvents(filter?: Partial<SecurityEvent>): SecurityEvent[] {
    if (!filter) return [...this.#events];

    return this.#events.filter((event) => {
      return Object.entries(filter).every(([key, value]) => {
        return event[key as keyof SecurityEvent] === value;
      });
    });
  }

  clearEvents(): void {
    this.#events = [];
  }
}

/**
 * No-op logger that doesn't record events.
 */
export class NoOpSecurityLogger implements SecurityLogger {
  log(): void {}
  getEvents(): SecurityEvent[] {
    return [];
  }
  clearEvents(): void {}
}

// Global logger instance (can be replaced by users)
let globalSecurityLogger: SecurityLogger = new NoOpSecurityLogger();

export function setSecurityLogger(logger: SecurityLogger): void {
  globalSecurityLogger = logger;
}

export function getSecurityLogger(): SecurityLogger {
  return globalSecurityLogger;
}

export function logSecurityEvent(event: SecurityEvent): void {
  globalSecurityLogger.log(event);
}
```

**Integration:**

```typescript
// File: src/FhevmDecryptionSignature.ts

import { logSecurityEvent, SecurityEventType } from './security/SecurityLogger';

export class FhevmDecryptionSignature {
  static async new(...): Promise<FhevmDecryptionSignature | null> {
    try {
      // ... existing code ...

      logSecurityEvent({
        type: SecurityEventType.SIGNATURE_CREATED,
        timestamp: Date.now(),
        userAddress,
        chainId: instance.getChainId(),
        details: {
          contractAddresses,
          durationDays,
        },
      });

      return signature;
    } catch (error) {
      logSecurityEvent({
        type: SecurityEventType.SIGNATURE_FAILED,
        timestamp: Date.now(),
        userAddress,
        error: error as Error,
      });
      return null;
    }
  }

  static async loadFromGenericStringStorage(...): Promise<FhevmDecryptionSignature | null> {
    try {
      const result = await storage.getItem(storageKey.key);

      if (result) {
        const kps = FhevmDecryptionSignature.fromJSON(result);

        if (!kps.isValid()) {
          logSecurityEvent({
            type: SecurityEventType.KEY_EXPIRED,
            timestamp: Date.now(),
            userAddress,
          });
          return null;
        }

        logSecurityEvent({
          type: SecurityEventType.KEY_LOADED,
          timestamp: Date.now(),
          userAddress,
        });

        return kps;
      }

      return null;
    } catch (error) {
      logSecurityEvent({
        type: SecurityEventType.STORAGE_ERROR,
        timestamp: Date.now(),
        error: error as Error,
      });
      return null;
    }
  }
}
```

---

#### Task 1.3: Add Security Documentation

**Priority:** 🟠 MEDIUM
**Effort:** 1 day
**Breaking:** No

**Files to Create:**

1. `docs/security/README.md` - Security overview
2. `docs/security/storage-options.md` - Storage comparison
3. `docs/security/csp-configuration.md` - CSP headers guide
4. `docs/security/best-practices.md` - Security checklist

**Content Example:**

```markdown
// File: docs/security/best-practices.md

# Security Best Practices

## Pre-Deployment Checklist

### Storage Configuration

- [ ] ✅ **Use encrypted storage in production**
  ```typescript
  const storage = new EncryptedStorageAdapter(localStorage, { key });
  ```

- [ ] ⚠️ **Never use plain localStorage for production**
  ```typescript
  // ❌ Insecure
  <FhevmProvider storage={localStorageAdapter} />

  // ✅ Secure
  <FhevmProvider storage={encryptedStorage} />
  ```

- [ ] ✅ **Use memoryStorage for highest security**
  ```typescript
  // Keys cleared on page refresh
  <FhevmProvider storage={memoryStorage} />
  ```

### Content Security Policy

- [ ] ✅ **Configure CSP headers on your server**
  ```
  Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-eval';
    connect-src 'self' https://gateway.zama.ai;
  ```

### Key Management

- [ ] ✅ **Set short expiration times** (≤24 hours)
- [ ] ✅ **Implement key rotation warnings**
- [ ] ✅ **Clear keys on logout**

### Code Quality

- [ ] ✅ **Never log private keys in production**
  ```typescript
  // ❌ Never do this
  console.log(signature.privateKey);

  // ✅ Safe logging
  console.log({ publicKey: signature.publicKey });
  ```

- [ ] ✅ **Audit dependencies regularly**
  ```bash
  npm audit
  npm audit fix
  ```

### Runtime Security

- [ ] ✅ **Enable security event logging**
  ```typescript
  import { MemorySecurityLogger, setSecurityLogger } from '@zama-fhe/react-sdk';

  setSecurityLogger(new MemorySecurityLogger());
  ```

- [ ] ✅ **Monitor for suspicious activity**
  ```typescript
  const logger = getSecurityLogger();
  const failedDecrypts = logger.getEvents({
    type: SecurityEventType.DECRYPT_FAILED,
  });
  ```
```

---

### Phase 2: API Improvements (Soft Breaking) - Week 3-4

**Goal:** Deprecate insecure patterns with warnings

#### Task 2.1: Deprecate Public Private Key Getter

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** Soft (deprecation warning)

**Implementation:**

```typescript
// File: src/FhevmDecryptionSignature.ts

export class FhevmDecryptionSignature {
  /**
   * @deprecated Direct access to private key will be removed in v2.0.
   * Use decrypt methods instead.
   */
  public get privateKey(): string {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[FHEVM Security Warning] Direct privateKey access is deprecated and will be removed in v2.0. ' +
        'Use decrypt methods instead to avoid exposing sensitive keys.'
      );
    }
    return this.#privateKey;
  }

  // New secure API
  /**
   * Decrypt a handle without exposing the private key.
   * Preferred method for decryption operations.
   */
  async decrypt(
    instance: FhevmInstance,
    handle: string,
    contractAddress: string
  ): Promise<string | bigint | boolean> {
    // Use private key internally only
    const results = await instance.userDecrypt(
      [{ handle, contractAddress }],
      this.#privateKey,
      this.#publicKey,
      this.#signature,
      this.#contractAddresses,
      this.#userAddress,
      this.#startTimestamp,
      this.#durationDays
    );

    return results[handle];
  }
}
```

---

#### Task 2.2: Add Security Level Configuration

**Priority:** 🟠 MEDIUM
**Effort:** 2 days
**Breaking:** Soft (new optional props)

**Implementation:**

```typescript
// File: src/react/FhevmProvider.tsx

export enum SecurityLevel {
  /** Development mode - allows insecure storage */
  DEVELOPMENT = 'development',
  /** Production mode - requires encrypted storage */
  PRODUCTION = 'production',
  /** Maximum security - memory storage only */
  STRICT = 'strict',
}

export interface FhevmProviderProps {
  // ... existing props ...

  /**
   * Security level for key storage validation.
   * - DEVELOPMENT: Allows any storage (default for NODE_ENV=development)
   * - PRODUCTION: Requires encrypted storage or sessionStorage
   * - STRICT: Only allows memoryStorage
   *
   * @default process.env.NODE_ENV === 'production' ? 'production' : 'development'
   */
  securityLevel?: SecurityLevel;

  /**
   * Security event logger.
   * Set to enable security event tracking.
   *
   * @example
   * ```typescript
   * import { MemorySecurityLogger } from '@zama-fhe/react-sdk';
   *
   * <FhevmProvider
   *   securityLogger={new MemorySecurityLogger()}
   *   ...
   * />
   * ```
   */
  securityLogger?: SecurityLogger;
}

export function FhevmProvider({ storage, securityLevel, securityLogger, ...props }: FhevmProviderProps) {
  const effectiveSecurityLevel = securityLevel ?? (
    process.env.NODE_ENV === 'production'
      ? SecurityLevel.PRODUCTION
      : SecurityLevel.DEVELOPMENT
  );

  // Validate storage against security level
  useEffect(() => {
    if (!storage) return;

    const storageType = storage.constructor?.name || 'unknown';

    switch (effectiveSecurityLevel) {
      case SecurityLevel.STRICT:
        if (storageType !== 'MemoryStorage') {
          console.error(
            '[FHEVM Security Error] STRICT security level requires memoryStorage. ' +
            `Current storage: ${storageType}`
          );
          throw new Error('Invalid storage for STRICT security level');
        }
        break;

      case SecurityLevel.PRODUCTION:
        if (storageType === 'LocalStorageAdapter') {
          console.error(
            '[FHEVM Security Error] PRODUCTION security level does not allow plain localStorage. ' +
            'Use EncryptedStorageAdapter or sessionStorageAdapter instead.'
          );
          throw new Error('Invalid storage for PRODUCTION security level');
        }
        break;

      case SecurityLevel.DEVELOPMENT:
        // Allow any storage in development
        if (storageType === 'LocalStorageAdapter') {
          console.warn(
            '[FHEVM Security Warning] Using plain localStorage in development mode. ' +
            'Switch to encrypted storage for production.'
          );
        }
        break;
    }
  }, [storage, effectiveSecurityLevel]);

  // Set global security logger
  useEffect(() => {
    if (securityLogger) {
      setSecurityLogger(securityLogger);
    }
  }, [securityLogger]);

  // ... rest of provider implementation
}
```

---

### Phase 3: Breaking Changes - v2.0 (Month 3-4)

**Goal:** Remove deprecated APIs, enforce security

#### Task 3.1: Remove Private Key Getter

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** Yes

```typescript
// File: src/FhevmDecryptionSignature.ts

export class FhevmDecryptionSignature {
  // ❌ REMOVED in v2.0
  // public get privateKey() { ... }

  // ✅ Keep internal private field
  #privateKey: string;

  // ✅ Expose only through controlled methods
  async decrypt(...) { ... }
}
```

---

#### Task 3.2: Make Encrypted Storage Required in Production

**Priority:** 🟠 MEDIUM
**Effort:** 1 day
**Breaking:** Yes

```typescript
// Default securityLevel to PRODUCTION when NODE_ENV=production
// Throws error if storage is not encrypted
```

---

#### Task 3.3: Remove Private Key from toJSON

**Priority:** 🔴 HIGH
**Effort:** 1 day
**Breaking:** Yes

```typescript
// File: src/FhevmDecryptionSignature.ts

toJSON() {
  return {
    publicKey: this.#publicKey,
    // ❌ privateKey: REMOVED in v2.0
    contractAddresses: this.#contractAddresses,
    expiresAt: this.#startTimestamp + this.#durationDays * 24 * 60 * 60,
  };
}

// Add separate internal method for storage serialization
private toStorageJSON() {
  return {
    publicKey: this.#publicKey,
    privateKey: this.#privateKey, // Only for encrypted storage
    signature: this.#signature,
    // ... all fields
  };
}
```

---

## Testing Strategy

### Security Test Suite

```typescript
// File: test/security/SecurityTests.test.ts

describe('Security Tests', () => {
  describe('Encrypted Storage', () => {
    it('should encrypt private keys at rest', async () => {
      const key = await generateDeviceKey();
      const storage = new EncryptedStorageAdapter(localStorage, { key });

      const sig = await FhevmDecryptionSignature.new(...);
      await sig.saveToGenericStringStorage(storage, instance, true);

      const raw = localStorage.getItem('fhevm:enc:sig:...');
      expect(raw).not.toContain(sig.publicKey);
    });

    it('should fail decryption with wrong key', async () => {
      const key1 = await generateDeviceKey();
      const key2 = await generateDeviceKey();

      const storage1 = new EncryptedStorageAdapter(localStorage, { key: key1 });
      await storage1.setItem('test', 'data');

      const storage2 = new EncryptedStorageAdapter(localStorage, { key: key2 });
      const result = await storage2.getItem('test');

      expect(result).toBeNull();
    });
  });

  describe('Key Exposure Prevention', () => {
    it('should not expose private key via console.log', () => {
      const sig = createMockSignature();
      const logged = JSON.stringify(sig);

      // v2.0: privateKey should not be in output
      expect(logged).not.toContain('"privateKey"');
    });

    it('should warn when accessing private key directly', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn');
      const sig = createMockSignature();

      // v1.x: Should warn
      const _ = sig.privateKey;

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('deprecated')
      );
    });
  });

  describe('Security Level Enforcement', () => {
    it('should reject localStorage in PRODUCTION mode', () => {
      expect(() => {
        render(
          <FhevmProvider
            config={config}
            storage={localStorageAdapter}
            securityLevel={SecurityLevel.PRODUCTION}
          >
            <App />
          </FhevmProvider>
        );
      }).toThrow('Invalid storage for PRODUCTION security level');
    });

    it('should accept encrypted storage in PRODUCTION mode', () => {
      const storage = new EncryptedStorageAdapter(localStorage, { key: mockKey });

      expect(() => {
        render(
          <FhevmProvider
            config={config}
            storage={storage}
            securityLevel={SecurityLevel.PRODUCTION}
          >
            <App />
          </FhevmProvider>
        );
      }).not.toThrow();
    });
  });

  describe('Security Event Logging', () => {
    it('should log key generation events', async () => {
      const logger = new MemorySecurityLogger();
      setSecurityLogger(logger);

      await FhevmDecryptionSignature.new(...);

      const events = logger.getEvents({ type: SecurityEventType.KEY_GENERATED });
      expect(events.length).toBeGreaterThan(0);
    });

    it('should log decryption failures', async () => {
      const logger = new MemorySecurityLogger();
      setSecurityLogger(logger);

      const sig = createExpiredSignature();
      await sig.decrypt(...); // Should fail

      const events = logger.getEvents({ type: SecurityEventType.DECRYPT_FAILED });
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
```

---

## Migration Guide for Users

### v1.x → v2.0 Migration

```typescript
// ❌ v1.x (deprecated)
<FhevmProvider storage={localStorageAdapter} ... />

const sig = await loadSignature();
const privateKey = sig.privateKey; // ⚠️ Warning in v1, error in v2

// ✅ v2.0 (secure)
const encryptedStorage = new EncryptedStorageAdapter(localStorage, { key });
<FhevmProvider
  storage={encryptedStorage}
  securityLevel={SecurityLevel.PRODUCTION}
  securityLogger={new MemorySecurityLogger()}
  ...
/>

const sig = await loadSignature();
const result = await sig.decrypt(instance, handle, contractAddress); // ✅ No key exposure
```

---

## Timeline Summary

| Phase | Duration | Breaking | Key Deliverables |
|-------|----------|----------|------------------|
| **Phase 1** | Weeks 1-2 | No | Encrypted storage, logging, docs |
| **Phase 2** | Weeks 3-4 | Soft | Deprecation warnings, security levels |
| **Phase 3** | Months 3-4 | Yes | Remove deprecated APIs (v2.0) |

**Total Timeline:** ~4 months from start to v2.0 release

---

## Success Metrics

### Code Coverage
- [ ] 90%+ coverage for security-related code
- [ ] 100% coverage for EncryptedStorageAdapter
- [ ] Security test suite with 50+ tests

### Documentation
- [ ] Security documentation complete
- [ ] Migration guide published
- [ ] CSP configuration examples
- [ ] Best practices checklist

### User Adoption
- [ ] 80%+ of users switch to encrypted storage
- [ ] Zero production incidents related to key exposure
- [ ] Positive security audit results

---

## Dependencies

### External Libraries
- ✅ Web Crypto API (built-in, no dependencies)
- ⚠️ Consider: `@noble/ciphers` for additional algorithms (optional)

### Internal Changes
- Update FhevmDecryptionSignature class
- Update FhevmProvider component
- Update storage adapters
- Update documentation

---

## Risk Mitigation

### Backward Compatibility

**Risk:** Breaking changes may disrupt existing users

**Mitigation:**
1. Long deprecation period (6 months)
2. Clear warnings in v1.x
3. Comprehensive migration guide
4. Codemods for automated migration (future)

### Performance Impact

**Risk:** Encryption adds latency

**Mitigation:**
1. Benchmark encryption overhead (<10ms target)
2. Use Web Crypto API (hardware-accelerated)
3. Cache decrypted keys in memory (short TTL)

### Browser Compatibility

**Risk:** Web Crypto API not available in old browsers

**Mitigation:**
1. Feature detection with fallback
2. Polyfills for older browsers (optional)
3. Document minimum browser requirements

---

## Next Steps

1. ✅ **Review and approve** this plan with team
2. ✅ **Prioritize** tasks based on business needs
3. ✅ **Assign** Phase 1 tasks to developers
4. ✅ **Schedule** kickoff meeting for Week 1
5. ✅ **Set up** security test infrastructure
6. ✅ **Communicate** timeline to community

---

**Prepared by:** Claude Code (Security Planning Agent)
**Last Updated:** 2026-02-03
**Status:** Awaiting Approval
