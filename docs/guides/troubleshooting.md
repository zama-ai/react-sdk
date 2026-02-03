# Troubleshooting

Common issues and solutions when using @zama-fhe/sdk.

## FHEVM Initialization Issues

### Status stays at "initializing"

**Symptoms:** `useFhevmStatus` returns `status: "initializing"` indefinitely.

**Causes & Solutions:**

1. **Network connectivity issues**
   - Check browser console for failed network requests
   - Verify the CDN (cdn.zama.ai) is accessible from your network
   - Try refreshing the page

2. **Wrong chain configuration**
   - Ensure `chainId` passed to FhevmProvider matches a configured chain
   - Check that you've included the chain in `createFhevmConfig({ chains: [...] })`

3. **Provider not ready**
   - Ensure wallet is fully connected before passing to FhevmProvider
   - Check that `isConnected` is `true`

```tsx
// Debug initialization
const { status, error, chainId } = useFhevmStatus();

useEffect(() => {
  console.log("FHEVM Status:", status);
  console.log("Chain ID:", chainId);
  if (error) console.error("Error:", error);
}, [status, chainId, error]);
```

### "Chain not supported" error

**Solution:** Add the chain to your configuration:

```tsx
import { createFhevmConfig, sepolia, hardhatLocal } from "@zama-fhe/sdk";

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal], // Include all chains you need
});
```

### "FHEVM initialization timed out"

**Causes:**
- Slow network connection
- CDN temporarily unavailable

**Solutions:**
1. Check network connectivity
2. Retry by refreshing the page
3. If persistent, check Zama status page

## Wallet Connection Issues

### Wallet popup doesn't appear

**Symptoms:** Calling `decrypt()` does nothing, no wallet popup.

**Solutions:**

1. **Check canDecrypt is true**
   ```tsx
   const { decrypt, canDecrypt } = useUserDecrypt({ handle, contractAddress });
   // Only call decrypt when canDecrypt is true
   if (canDecrypt) decrypt();
   ```

2. **Verify FHEVM is ready**
   ```tsx
   const { isReady } = useFhevmStatus();
   if (!isReady) return <p>Loading FHE...</p>;
   ```

3. **Check browser popup blocker**
   - Ensure popups are allowed for your site
   - Try clicking the button directly (not programmatically)

### "User rejected" errors

**Symptoms:** Error appears after user closes wallet popup without signing.

**Solution:** Handle the rejection gracefully:

```tsx
const { decrypt, error, clearError } = useUserDecrypt({ handle, contractAddress });

if (error?.includes("rejected")) {
  return (
    <div>
      <p>Please approve the signature request to decrypt.</p>
      <button onClick={clearError}>Try Again</button>
    </div>
  );
}
```

## Encryption Issues

### encrypt() returns undefined

**Causes:**
1. FHEVM not ready
2. Invalid input values
3. Missing contract address

**Debug steps:**

```tsx
const { encrypt, isReady } = useEncrypt();

const handleEncrypt = async () => {
  console.log("isReady:", isReady);
  if (!isReady) {
    console.error("FHEVM not ready");
    return;
  }

  try {
    const result = await encrypt([
      { type: "uint64", value: 100n },
    ], contractAddress);

    console.log("Result:", result);
  } catch (err) {
    console.error("Encryption error:", err);
  }
};
```

### "Value out of range" error

**Cause:** Number exceeds the maximum for the specified type.

**Solution:** Check value bounds:

| Type | Maximum Value |
|------|---------------|
| uint8 | 255 |
| uint16 | 65,535 |
| uint32 | 4,294,967,295 |
| uint64 | 18,446,744,073,709,551,615 |

```tsx
// Validate before encrypting
const MAX_UINT64 = 18446744073709551615n;
if (amount > MAX_UINT64) {
  showError("Amount too large");
  return;
}
```

### TypeScript type errors in encrypt()

**Symptoms:** TypeScript complains about value types.

**Solution:** Use correct value types for each FHE type:

```tsx
// uint8, uint16, uint32 → number
encrypt([{ type: "uint32", value: 100 }], contract);

// uint64, uint128, uint256 → bigint
encrypt([{ type: "uint64", value: 100n }], contract);

// address → `0x${string}`
encrypt([{ type: "address", value: "0x..." as `0x${string}` }], contract);

// bool → boolean
encrypt([{ type: "bool", value: true }], contract);
```

## Decryption Issues

### Decrypted value is undefined

**Causes:**
1. Handle doesn't exist on-chain
2. User doesn't have permission to decrypt
3. Signature expired

**Debug steps:**

```tsx
const { results, error, isSuccess } = useUserDecrypt({ handle, contractAddress });

console.log("Handle:", handle);
console.log("Results:", results);
console.log("Error:", error);
console.log("Success:", isSuccess);
```

### "Unauthorized" decryption error

**Cause:** The encrypted value's ACL doesn't grant access to this user.

**Solution:** Ensure the contract calls `FHE.allow(handle, userAddress)` on-chain.

### Signature prompts on every page load

**Causes:**
1. Using `memoryStorage` (expected behavior - clears on refresh)
2. Signature expired (24 hour default)
3. Storage adapter not passed to provider

**Solution:** Use persistent storage if you want to avoid re-signing:

```tsx
import { FhevmProvider, sessionStorageAdapter } from "@zama-fhe/sdk";

<FhevmProvider
  storage={sessionStorageAdapter} // Persists until tab closes
  // ...
>
```

## Storage Issues

### "window is undefined" errors

**Cause:** Code is running during server-side rendering (SSR).

**Solution:** Ensure FhevmProvider only renders on client:

```tsx
// Next.js App Router
"use client";

import { FhevmProvider } from "@zama-fhe/sdk";

export function Providers({ children }) {
  return (
    <FhevmProvider ...>
      {children}
    </FhevmProvider>
  );
}
```

### Storage quota exceeded

**Cause:** Browser localStorage is full.

**Solutions:**
1. Clear old fhevm data:
   ```tsx
   Object.keys(localStorage)
     .filter(key => key.startsWith("fhevm:"))
     .forEach(key => localStorage.removeItem(key));
   ```
2. Use `memoryStorage` instead
3. Implement custom storage with size limits

## Performance Issues

### Slow encryption (6+ seconds)

**Cause:** Running in single-threaded mode.

**Solution:** Enable multi-threading with COOP/COEP headers (see [Threading guide](../configuration/threading.md)).

**Note:** Multi-threading may break wallet browser extensions.

### UI freezes during encryption

**Cause:** Encryption blocking main thread in single-threaded mode.

**Solution:** Show loading state and use async/await:

```tsx
const [isEncrypting, setIsEncrypting] = useState(false);

const handleSubmit = async () => {
  setIsEncrypting(true);
  try {
    const [handle, proof] = await encrypt([
      { type: "uint64", value: amount },
    ], contractAddress);
    // Continue...
  } finally {
    setIsEncrypting(false);
  }
};

return (
  <button disabled={isEncrypting}>
    {isEncrypting ? "Encrypting..." : "Submit"}
  </button>
);
```

## Network-Specific Issues

### Hardhat local chain not working

**Checklist:**
1. Hardhat node running at `http://localhost:8545`
2. Chain ID is `31337`
3. `hardhatLocal` chain included in config
4. Contracts deployed with `pnpm deploy:localhost`

```tsx
import { hardhatLocal } from "@zama-fhe/sdk";

const config = createFhevmConfig({
  chains: [hardhatLocal],
});
```

### Sepolia not connecting

**Checklist:**
1. Wallet connected to Sepolia (chain ID 11155111)
2. RPC endpoint working (check Infura/Alchemy status)
3. Account has Sepolia ETH for gas

## Getting Help

If these solutions don't resolve your issue:

1. **Check the console** - Most errors include helpful messages
2. **Enable debug logging**:
   ```tsx
   import { configureLogger } from "@zama-fhe/sdk";
   configureLogger({ enabled: true, level: "debug" });
   ```
3. **Search existing issues**: [GitHub Issues](https://github.com/zama-ai/react-sdk/issues)
4. **Ask the community**: [Discord](https://discord.fhe.org)
5. **Report a bug**: [Create an issue](https://github.com/zama-ai/react-sdk/issues/new)

**For security issues**: Email security@zama.ai (do not create public issues).
