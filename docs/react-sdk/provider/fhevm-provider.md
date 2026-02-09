# FhevmProvider

The FhevmProvider component wraps your application to provide FHEVM context to all hooks.

## Features

- **Automatic script loading** — Loads the Zama Relayer SDK from CDN (no manual script tags)
- **Auto-initialization** — Initializes FHEVM when wallet connects
- **Chain switching** — Reinitializes when chain changes
- **Error handling** — Exposes errors via `useFhevmStatus`
- **Library agnostic** — Works with wagmi, viem, ethers, or raw EIP-1193

## Basic Usage

```tsx
import { FhevmProvider, createFhevmConfig, memoryStorage } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { useAccount, useConnectorClient } from "wagmi";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });

function FhevmWrapper({ children }: { children: React.ReactNode }) {
  const { address, chainId, isConnected } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  return (
    <FhevmProvider
      config={fhevmConfig}
      provider={connectorClient?.transport}
      address={address}
      chainId={chainId}
      isConnected={isConnected}
      storage={memoryStorage}
    >
      {children}
    </FhevmProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
| ------------- | --------------------- | ----------- | -------------------------------------------------------- |
| `config` | `FhevmConfig` | Required | Config from `createFhevmConfig()` |
| `children` | `ReactNode` | Required | Child components |
| `wallet` | `FhevmWallet` | `undefined` | **Preferred.** Direct wallet integration (see below) |
| `provider` | `Eip1193Provider` | `undefined` | Raw EIP-1193 provider (e.g. `window.ethereum`) |
| `address` | `` `0x${string}` `` | `undefined` | Connected wallet address |
| `chainId` | `number` | `undefined` | Current chain ID |
| `isConnected` | `boolean` | `false` | Whether wallet is connected |
| `storage` | `GenericStringStorage` | `undefined` | Storage for caching decryption signatures |
| `autoInit` | `boolean` | `true` | Auto-initialize when wallet connects |
| `apiKey` | `string` | `undefined` | API key for relayer authentication |
| `initTimeout` | `number` | `30000` | Timeout in ms for FHEVM initialization |
| `queryClient` | `QueryClient` | `undefined` | External TanStack QueryClient (avoids creating internal one) |

### `wallet` vs `provider`

The `wallet` prop accepts an `FhevmWallet` object and is the **preferred** way to connect non-wagmi wallets. It gives the SDK direct access to `sendTransaction` and `signTypedData` without going through EIP-1193.

The `provider` prop accepts a raw EIP-1193 provider (like `window.ethereum` or a wagmi connector transport). Use this with wagmi setups.

If both are provided, `wallet` takes precedence.

```typescript
// FhevmWallet interface
interface FhevmWallet {
  address: `0x${string}`;
  sendTransaction: (tx: TransactionRequest) => Promise<`0x${string}`>;
  signTypedData: (typedData: SignTypedDataParams) => Promise<string>;
}
```

### `queryClient`

Pass an external `QueryClient` to share the same TanStack Query cache with the rest of your app. If not provided, FhevmProvider creates its own isolated QueryClient.

```tsx
const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <FhevmProvider config={fhevmConfig} queryClient={queryClient} /* ... */>
    {children}
  </FhevmProvider>
</QueryClientProvider>
```

### `apiKey`

API key for authenticating with the Zama relayer. Required for relayer-sdk v0.4.0+.

```tsx
<FhevmProvider config={fhevmConfig} apiKey="your-api-key" /* ... */>
```

## Provider Hierarchy

Place FhevmProvider after WagmiProvider and QueryClientProvider:

```tsx
<WagmiProvider config={wagmiConfig}>
  <QueryClientProvider client={queryClient}>
    <FhevmProvider config={fhevmConfig} queryClient={queryClient} /* ... */>
      <YourApp />
    </FhevmProvider>
  </QueryClientProvider>
</WagmiProvider>
```

## Integration Examples

### With wagmi

```tsx
function FhevmWrapper({ children }: { children: React.ReactNode }) {
  const { address, chainId, isConnected } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  return (
    <FhevmProvider
      config={fhevmConfig}
      provider={connectorClient?.transport}
      address={address}
      chainId={chainId}
      isConnected={isConnected}
      storage={memoryStorage}
    >
      {children}
    </FhevmProvider>
  );
}
```

### With viem (FhevmWallet)

```tsx
import { createWalletClient, custom } from "viem";
import { sepolia as viemSepolia } from "viem/chains";
import type { FhevmWallet } from "@zama-fhe/react-sdk";

const walletClient = createWalletClient({
  chain: viemSepolia,
  transport: custom(window.ethereum!),
});

const wallet: FhevmWallet = {
  address: walletClient.account!.address,
  sendTransaction: (tx) =>
    walletClient.sendTransaction({ ...tx, account: walletClient.account!, chain: viemSepolia }),
  signTypedData: (td) =>
    walletClient.signTypedData({ ...td, account: walletClient.account! }),
};

<FhevmProvider
  config={fhevmConfig}
  wallet={wallet}
  address={wallet.address}
  chainId={viemSepolia.id}
  isConnected={true}
  storage={memoryStorage}
>
  {children}
</FhevmProvider>
```

### With ethers.js (FhevmWallet)

```tsx
import { BrowserProvider } from "ethers";
import type { FhevmWallet } from "@zama-fhe/react-sdk";

const provider = new BrowserProvider(window.ethereum!);
const signer = await provider.getSigner();

const wallet: FhevmWallet = {
  address: (await signer.getAddress()) as `0x${string}`,
  sendTransaction: async (tx) => {
    const resp = await signer.sendTransaction(tx);
    return resp.hash as `0x${string}`;
  },
  signTypedData: (td) => signer.signTypedData(td.domain, td.types, td.message),
};

<FhevmProvider
  config={fhevmConfig}
  wallet={wallet}
  address={wallet.address}
  chainId={11155111}
  isConnected={true}
  storage={memoryStorage}
>
  {children}
</FhevmProvider>
```

## Manual Initialization

Disable auto-initialization for manual control:

```tsx
<FhevmProvider config={fhevmConfig} autoInit={false}>
  <ManualInit />
</FhevmProvider>

function ManualInit() {
  const { refresh } = useFhevmClient();
  return <button onClick={refresh}>Initialize FHEVM</button>;
}
```

## Context Value

FhevmProvider exposes these values via `useFhevmContext()`:

```typescript
interface FhevmContextValue {
  config: FhevmConfig;
  instance: FhevmInstance | undefined;
  status: FhevmStatus; // 'idle' | 'initializing' | 'ready' | 'error'
  error: Error | undefined;
  chainId: number | undefined;
  address: `0x${string}` | undefined;
  isConnected: boolean;
  provider: Eip1193Provider | undefined;
  wallet: FhevmWallet | undefined;
  storage: GenericStringStorage | undefined;
  refresh: () => void;
}
```

## Error Handling

```tsx
import { useFhevmStatus } from "@zama-fhe/react-sdk";

function FHEStatus() {
  const { status, error, isError } = useFhevmStatus();

  if (isError) {
    return (
      <div>
        <p>Failed to initialize FHE: {error?.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return null;
}
```
