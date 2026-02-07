# TanStack Query Integration Plan

This document analyzes the current TanStack Query usage in the `@zama-fhe/react-sdk` and outlines opportunities for deeper integration.

---

## Executive Summary

| Category | Current State | Opportunity |
|----------|---------------|-------------|
| Decryption | ✅ Using `useMutation` | Add `useQuery` for automatic refetch |
| Encryption | ❌ Manual state | Migrate to `useMutation` |
| Balances | ❌ Manual `useState`/`useEffect` | Migrate to `useQuery` |
| Shield/Unshield | ❌ Manual state | Migrate to `useMutation` |
| Transfer | ❌ Manual state | Migrate to `useMutation` |
| Caching | ✅ Query key factory | Expand usage |

---

## Current TanStack Query Usage

### 1. Query Client Configuration (`src/react/queryClient.ts`)

```typescript
const fhevmQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      gcTime: 30 * 60 * 1000,    // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

**Assessment:** Well-configured for FHE operations. Decrypted values are stable, so disabling `refetchOnWindowFocus` is correct.

### 2. Query Keys (`src/react/queryKeys.ts`)

Well-structured hierarchical key factory:

```typescript
fhevmKeys.all                        // ["fhevm"]
fhevmKeys.decrypt()                  // ["fhevm", "decrypt"]
fhevmKeys.decryptHandle(chain, h, c) // ["fhevm", "decrypt", chainId, handle, contract]
fhevmKeys.publicDecrypt()            // ["fhevm", "publicDecrypt"]
fhevmKeys.signature()                // ["fhevm", "signature"]
fhevmKeys.encrypt()                  // ["fhevm", "encrypt"]
fhevmKeys.instance()                 // ["fhevm", "instance"]
```

**Assessment:** Excellent foundation. Enables granular cache invalidation.

### 3. Hooks Using TanStack Query

| Hook | Pattern | Notes |
|------|---------|-------|
| `useUserDecrypt` | `useMutation` | Caches results to query cache |
| `usePublicDecrypt` | `useMutation` | Caches results to query cache |
| `useUserDecryptedValue` | `useQueryClient().getQueryData()` | Read-only cache access |
| `useUserDecryptedValues` | `useQueryClient().getQueryData()` | Batch read-only access |

### 4. Hooks NOT Using TanStack Query

| Hook | Current Pattern | Opportunity |
|------|-----------------|-------------|
| `useEncrypt` | `useCallback` | `useMutation` for tracking |
| `useShield` | `useState` + callbacks | `useMutation` |
| `useUnshield` | `useState` + callbacks | `useMutation` |
| `useConfidentialTransfer` | `useState` + callbacks | `useMutation` |
| `useConfidentialBalances` | `useState` + `useEffect` | `useQuery` + `useMutation` |

---

## Improvement Opportunities

### Phase 1: Migrate Transaction Hooks to `useMutation`

#### 1.1 `useConfidentialTransfer`

**Current:**
```typescript
const [status, setStatus] = useState<TransferStatus>("idle");
const [error, setError] = useState<Error | null>(null);
const [txHash, setTxHash] = useState<string | undefined>();

const transfer = useCallback(async (to, amount) => {
  setStatus("encrypting");
  // ... manual state management
}, [...]);
```

**Proposed:**
```typescript
const mutation = useMutation({
  mutationKey: fhevmKeys.transfer(chainId, contractAddress),
  mutationFn: async ({ to, amount }: TransferParams) => {
    // Encrypt → Sign → Confirm
    return { txHash };
  },
  onSuccess: (data) => {
    onSuccess?.(data.txHash);
  },
  onError: (error) => {
    onError?.(error);
  },
});

return {
  transfer: (to, amount) => mutation.mutate({ to, amount }),
  transferAsync: (to, amount) => mutation.mutateAsync({ to, amount }),
  status: mutation.status,
  isPending: mutation.isPending,
  isSuccess: mutation.isSuccess,
  isError: mutation.isError,
  error: mutation.error,
  txHash: mutation.data?.txHash,
  reset: mutation.reset,
};
```

**Benefits:**
- Automatic state management
- Built-in `reset()` function
- Deduplication (prevents double-submits)
- Easy optimistic updates
- Devtools integration

#### 1.2 `useShield` / `useUnshield`

Same pattern as `useConfidentialTransfer`. Multi-step operations can track progress via mutation state + custom status field.

**Proposed query keys:**
```typescript
fhevmKeys.shield: () => [...fhevmKeys.all, "shield"] as const,
fhevmKeys.shieldFor: (chainId, wrapperAddress) =>
  [...fhevmKeys.shield(), chainId, wrapperAddress] as const,

fhevmKeys.unshield: () => [...fhevmKeys.all, "unshield"] as const,
fhevmKeys.unshieldFor: (chainId, wrapperAddress) =>
  [...fhevmKeys.unshield(), chainId, wrapperAddress] as const,
```

### Phase 2: Migrate `useConfidentialBalances` to `useQuery`

**Current:**
```typescript
const [data, setData] = useState<ConfidentialBalanceResult[]>(...);
const [status, setStatus] = useState<BalanceStatus>("idle");

useEffect(() => {
  if (!enabled || !providerReady) return;
  fetchBalances(isRefetch);
}, [enabled, providerReady, ...]);

const refetch = useCallback(async () => {
  await fetchBalances(true);
}, [...]);
```

**Proposed:**
```typescript
const query = useQuery({
  queryKey: fhevmKeys.balances(chainId, contracts, account),
  queryFn: async () => {
    // Fetch all balance handles in parallel
    const results = await Promise.allSettled(
      contracts.map(async (config) => {
        const contract = new ethers.Contract(...);
        return contract.confidentialBalanceOf(account);
      })
    );
    return results.map(...);
  },
  enabled: enabled && providerReady && !!defaultAccount,
  staleTime: 30_000, // 30 seconds for balance data
});

return {
  data: query.data ?? makePendingResults(contracts.length),
  isLoading: query.isLoading,
  isRefetching: query.isRefetching,
  isFetching: query.isFetching,
  isError: query.isError,
  isSuccess: query.isSuccess,
  error: query.error,
  refetch: query.refetch,
  status: query.status,
  // ... decryption fields
};
```

**Benefits:**
- Automatic background refetching
- Configurable `staleTime` / `gcTime`
- Built-in loading/error states
- Request deduplication
- Suspense support (future)

**Proposed query keys:**
```typescript
fhevmKeys.balance: () => [...fhevmKeys.all, "balance"] as const,
fhevmKeys.balanceFor: (chainId, contractAddress, account) =>
  [...fhevmKeys.balance(), chainId, contractAddress, account] as const,
fhevmKeys.balances: (chainId, contracts, account) =>
  [...fhevmKeys.balance(), chainId, "batch", account, contracts.map(c => c.contractAddress).join(",")] as const,
```

### Phase 3: Add Encryption Mutation Tracking

**Current:** `useEncrypt` returns a simple callback with no state tracking.

**Proposed:** Add optional mutation tracking for devtools visibility:

```typescript
const encryptMutation = useMutation({
  mutationKey: fhevmKeys.encryptFor(chainId, contractAddress),
  mutationFn: async ({ inputs, contractAddress }) => {
    // ... existing encryption logic
    return [...handles, proof];
  },
});

// Keep existing API for simplicity
const encrypt = useCallback(async (inputs, contractAddress) => {
  return encryptMutation.mutateAsync({ inputs, contractAddress });
}, [encryptMutation]);
```

### Phase 4: Signature Caching with `useQuery`

Currently, signatures are stored in `GenericStringStorage` and loaded via `FhevmDecryptionSignature.loadOrSign()`.

**Opportunity:** Cache signatures in TanStack Query for reactive updates:

```typescript
const signatureQuery = useQuery({
  queryKey: fhevmKeys.signatureFor(chainId, address),
  queryFn: async () => {
    return FhevmDecryptionSignature.loadFromGenericStringStorage(
      storage, instance, contractAddresses, address
    );
  },
  enabled: !!storage && !!instance && !!address,
  staleTime: Infinity, // Signatures don't change
});
```

**Benefits:**
- Reactive signature availability
- Automatic refresh on invalidation
- Better integration with decryption hooks

### Phase 5: Instance Management with `useQuery`

**Current:** Instance is managed via `useState` in `FhevmProvider`.

**Opportunity:** Use `useQuery` for instance management:

```typescript
const instanceQuery = useQuery({
  queryKey: fhevmKeys.instanceFor(chainId),
  queryFn: async () => {
    return createFhevmInstance({ provider, mockChains, signal, apiKey });
  },
  enabled: isConnected && !!chainId && scriptReady,
  retry: 2,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
});
```

**Benefits:**
- Built-in retry logic
- Automatic cleanup via `gcTime`
- Easy manual refresh via `refetch()`

---

## Proposed Query Key Updates

```typescript
export const fhevmKeys = {
  all: ["fhevm"] as const,

  // Existing keys...

  // New keys for Phase 1-5
  transfer: () => [...fhevmKeys.all, "transfer"] as const,
  transferFor: (chainId: number, contractAddress: string) =>
    [...fhevmKeys.transfer(), chainId, contractAddress] as const,

  shield: () => [...fhevmKeys.all, "shield"] as const,
  shieldFor: (chainId: number, wrapperAddress: string) =>
    [...fhevmKeys.shield(), chainId, wrapperAddress] as const,

  unshield: () => [...fhevmKeys.all, "unshield"] as const,
  unshieldFor: (chainId: number, wrapperAddress: string) =>
    [...fhevmKeys.unshield(), chainId, wrapperAddress] as const,

  balance: () => [...fhevmKeys.all, "balance"] as const,
  balanceFor: (chainId: number, contractAddress: string, account: string) =>
    [...fhevmKeys.balance(), chainId, contractAddress, account] as const,
  balances: (chainId: number, contractAddresses: string[], account: string) =>
    [...fhevmKeys.balance(), chainId, "batch", account, contractAddresses.sort().join(",")] as const,
} as const;
```

---

## Migration Strategy

### Step 1: Add New Query Keys (Non-breaking)
- Extend `queryKeys.ts` with new keys
- No changes to existing hooks

### Step 2: Create New Implementations (Feature flag)
- Create `useConfidentialTransferV2`, etc.
- Export both versions
- Document migration path

### Step 3: Update Existing Hooks (Minor version)
- Replace internals with TanStack Query
- Maintain same return type signature
- Add deprecation warnings if API changes

### Step 4: Remove Legacy Code (Major version)
- Remove manual state management
- Simplify hook implementations

---

## Benefits Summary

| Feature | Before | After |
|---------|--------|-------|
| State Management | Manual `useState` | Automatic |
| Error Handling | Manual | Built-in |
| Loading States | Manual | Built-in |
| Request Deduplication | None | Automatic |
| Cache Invalidation | Manual | `queryClient.invalidateQueries()` |
| Devtools | None | Full visibility |
| Background Refetch | Manual | Configurable |
| Optimistic Updates | N/A | Supported |
| Suspense | N/A | Supported |

---

## Implementation Priority

| Priority | Phase | Effort | Impact |
|----------|-------|--------|--------|
| High | 1.1 `useConfidentialTransfer` | Medium | High |
| High | 1.2 `useShield`/`useUnshield` | Medium | High |
| Medium | 2 `useConfidentialBalances` | High | High |
| Low | 3 Encryption tracking | Low | Low |
| Low | 4 Signature caching | Medium | Medium |
| Low | 5 Instance management | High | Medium |

---

## Testing Considerations

1. **Mock `QueryClient`** - Use `QueryClientProvider` with test client
2. **Test cache behavior** - Verify caching and invalidation
3. **Test mutation states** - Verify `isPending`, `isError`, etc.
4. **Test deduplication** - Verify concurrent requests are deduplicated
5. **Maintain backwards compatibility** - Ensure existing tests pass

---

## References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [wagmi Query Integration](https://wagmi.sh/core/guides/tanstack-query)
