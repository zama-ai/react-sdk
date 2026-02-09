# Storage Configuration

The `storage` prop on FhevmProvider controls how decryption signatures are cached, avoiding repeated signature requests from the user's wallet.

**Important:** No default storage is provided. You must explicitly choose a storage option.

---

> **Security Warning**
>
> Decryption signatures include **private keys** that can decrypt your users' confidential data.
> Both `localStorage` and `sessionStorage` are accessible to any JavaScript running on the page, making them vulnerable to XSS attacks.
>
> **Recommended:** Use `memoryStorage` for built-in options, or implement [custom storage](#custom-storage) with encryption.
>
> See the [Security Guide](../guides/security.md) for details.

---

## Built-in Storage Adapters

### memoryStorage (Recommended)

In-memory storage that clears on page refresh. No data persists to disk.

```tsx
import { FhevmProvider, memoryStorage } from "@zama-fhe/react-sdk";

<FhevmProvider config={fhevmConfig} storage={memoryStorage} /* ...other props */ >
  {children}
</FhevmProvider>
```

- User must re-sign after each page reload
- Most secure built-in option
- Good for security-sensitive applications and development

### noOpStorage

Disables caching entirely. User must sign for every decryption.

```tsx
import { FhevmProvider, noOpStorage } from "@zama-fhe/react-sdk";

<FhevmProvider config={fhevmConfig} storage={noOpStorage} /* ...other props */ >
  {children}
</FhevmProvider>
```

- Maximum security, worst UX
- Use when explicit user consent is required for each decrypt

---

## Custom Storage

For persistent storage that is also secure, implement the `GenericStringStorage` interface with your own encryption layer.

```typescript
interface GenericStringStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}
```

### Example: Encrypted Storage

Encrypt signatures before persisting them. An XSS attacker cannot decrypt the data without the encryption key.

```typescript
import CryptoJS from "crypto-js";

// Derive key from something the attacker can't access
// (e.g., user password hash, hardware key, or secure enclave)
function getEncryptionKey(): string {
  // WARNING: This is a simplified example.
  // In production, derive this from a secure source — not from
  // anything stored in localStorage/sessionStorage.
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

    const encrypted = CryptoJS.AES.encrypt(value, encKey).toString();
    localStorage.setItem(`fhevm-encrypted:${key}`, encrypted);
  },

  removeItem(key) {
    localStorage.removeItem(`fhevm-encrypted:${key}`);
  },
};
```

Use it in FhevmProvider:

```tsx
<FhevmProvider config={fhevmConfig} storage={encryptedStorage} /* ... */ >
  {children}
</FhevmProvider>
```

### Example: IndexedDB Storage

```typescript
import { openDB } from "idb";

const indexedDBStorage: GenericStringStorage = {
  async getItem(key) {
    const db = await openDB("fhevm-store", 1, {
      upgrade(db) { db.createObjectStore("signatures"); },
    });
    return db.get("signatures", key);
  },
  async setItem(key, value) {
    const db = await openDB("fhevm-store", 1);
    await db.put("signatures", value, key);
  },
  async removeItem(key) {
    const db = await openDB("fhevm-store", 1);
    await db.delete("signatures", key);
  },
};
```

### Example: React Native AsyncStorage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStorageAdapter: GenericStringStorage = {
  async getItem(key) { return AsyncStorage.getItem(`fhevm:${key}`); },
  async setItem(key, value) { await AsyncStorage.setItem(`fhevm:${key}`, value); },
  async removeItem(key) { await AsyncStorage.removeItem(`fhevm:${key}`); },
};
```

---

## What's Stored?

The storage persists decryption signatures, which include:

- **Public/private key pairs** for decrypting values
- **EIP-712 signature** from the user's wallet
- **Contract addresses** authorized for decryption
- **Timestamp** and **duration** (validity period, default 24 hours)

## Signature Validity

Signatures are valid for **24 hours** by default. After expiration, the cached signature is ignored and the user is prompted to sign again.

## Clearing Signatures on Logout

Always clear FHE-related storage when users log out:

```typescript
function handleLogout() {
  // If using custom persistent storage, clear it
  Object.keys(localStorage)
    .filter(key => key.startsWith("fhevm"))
    .forEach(key => localStorage.removeItem(key));
}
```

---

## Security Comparison

| Storage | Persistence | XSS Resistant | UX |
|---------|-------------|---------------|-----|
| `memoryStorage` | Page lifetime | Yes | Fair |
| `noOpStorage` | None | Yes | Poor |
| Custom encrypted | Configurable | Yes | Good |
| Custom unencrypted | Configurable | **No** | Best |
