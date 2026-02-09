# Security Guide

`@zama-fhe/react-sdk` handles sensitive cryptographic material. Understanding what's stored and how to protect it is essential for production applications.

## What's Sensitive

When a user decrypts a value, the SDK caches:

- **Decryption private keys** — can decrypt FHE ciphertext
- **EIP-712 signatures** — proves user authorization
- **Contract addresses** — scope of the authorization

If an attacker obtains this data, they can decrypt the user's confidential on-chain values.

## Storage Recommendations

| Use case | Storage | Why |
|----------|---------|-----|
| Most apps | `memoryStorage` | Cleared on refresh, no disk persistence |
| Maximum security | `noOpStorage` | Re-sign every decryption |
| Persistent + secure | Custom encrypted | Data encrypted before persisting |

**Do not** use plain `localStorage` or `sessionStorage` for production applications. Both are accessible to any JavaScript on the page, making them vulnerable to XSS attacks.

## Custom Encrypted Storage

For apps that need persistence without XSS risk, implement the `GenericStringStorage` interface with encryption:

```typescript
import CryptoJS from "crypto-js";

function getEncryptionKey(): string {
  // Derive from a source an XSS attacker cannot access:
  // - User password hash (prompted at login, held in memory)
  // - Hardware key / secure enclave
  // - Server-side session key fetched over authenticated API
  return mySecureKeyDerivation();
}

const encryptedStorage: GenericStringStorage = {
  getItem(key) {
    const encrypted = localStorage.getItem(`fhevm-encrypted:${key}`);
    if (!encrypted) return null;

    const encKey = getEncryptionKey();
    if (!encKey) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, encKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  },

  setItem(key, value) {
    const encKey = getEncryptionKey();
    if (!encKey) return;
    localStorage.setItem(`fhevm-encrypted:${key}`, CryptoJS.AES.encrypt(value, encKey).toString());
  },

  removeItem(key) {
    localStorage.removeItem(`fhevm-encrypted:${key}`);
  },
};
```

The key insight: even if an XSS attacker reads `localStorage`, they get AES-encrypted blobs they cannot decrypt without the encryption key.

See [Storage Configuration](../configuration/storage.md) for the full `GenericStringStorage` interface and more examples.

## Clear Storage on Logout

Always clear FHE data when users disconnect:

```typescript
function handleLogout() {
  Object.keys(localStorage)
    .filter(key => key.startsWith("fhevm"))
    .forEach(key => localStorage.removeItem(key));

  disconnect(); // wagmi disconnect, etc.
}
```

## Content Security Policy

Restrict script sources to prevent XSS injection:

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.zama.ai;
  connect-src 'self' https://*.infura.io https://*.alchemy.com;
```

## Security Checklist

Before deploying to production:

- [ ] Use `memoryStorage` or custom encrypted storage (not plain localStorage/sessionStorage)
- [ ] Implement CSP headers
- [ ] Clear FHE storage on logout/disconnect
- [ ] Disable debug logging in production
- [ ] Test in private browsing mode (IndexedDB fallback)
- [ ] Handle initialization timeouts gracefully
- [ ] Validate user inputs before encryption
- [ ] Use HTTPS

## Reporting Security Issues

If you discover a security vulnerability in @zama-fhe/react-sdk:

1. **Do not** open a public issue
2. Email security@zama.ai with details
3. Include steps to reproduce if possible
4. Allow reasonable time for a fix before disclosure

## Further Reading

- [Storage Configuration](../configuration/storage.md)
- [FhevmProvider](../provider/fhevm-provider.md)
