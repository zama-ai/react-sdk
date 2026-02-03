# @zama-fhe/react-sdk

React SDK for building applications with Fully Homomorphic Encryption (FHE) on EVM chains.

## Features

- **Wagmi-style API** - Familiar patterns for web3 developers
- **Auto-initialization** - FHEVM instance managed automatically
- **TanStack Query integration** - Built-in caching and state management
- **TypeScript support** - Fully typed API
- **Multiple chain support** - Sepolia testnet and local Hardhat development
- **Flexible encryption** - Simple and builder patterns for all FHE types

## Installation

```bash
npm install @zama-fhe/react-sdk
# or
pnpm add @zama-fhe/react-sdk
# or
yarn add @zama-fhe/react-sdk
```

### Peer Dependencies

```bash
npm install react @tanstack/react-query
```

## Quick Start

### 1. Create Configuration

```tsx
import { createFhevmConfig, sepolia, hardhatLocal } from "@zama-fhe/react-sdk";

export const fhevmConfig = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
});
```

### 2. Set Up Providers

```tsx
import { FhevmProvider, memoryStorage, type Eip1193Provider } from "@zama-fhe/react-sdk";
import { WagmiProvider, useAccount, useConnectorClient } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function FhevmWrapper({ children }: { children: React.ReactNode }) {
  const { address, chainId, isConnected } = useAccount();
  const { data: connectorClient } = useConnectorClient();
  const provider = connectorClient?.transport as Eip1193Provider | undefined;

  return (
    <FhevmProvider
      config={fhevmConfig}
      provider={provider}
      address={address}
      chainId={chainId}
      isConnected={isConnected}
      storage={memoryStorage}
    >
      {children}
    </FhevmProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmWrapper>{children}</FhevmWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 3. Encrypt Values

```tsx
import { useEncrypt, useFhevmStatus } from "@zama-fhe/react-sdk";
import { useWriteContract } from "wagmi";

function TransferForm({ contractAddress }) {
  const { isReady } = useFhevmStatus();
  const { encrypt } = useEncrypt();
  const { writeContract } = useWriteContract();

  const handleTransfer = async (recipient: `0x${string}`, amount: bigint) => {
    // Encrypt the amount - returns [handle, proof]
    const [amountHandle, proof] = await encrypt(
      [{ type: "uint64", value: amount }],
      contractAddress
    );

    if (!amountHandle) return;

    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "transfer",
      args: [recipient, amountHandle, proof],
    });
  };

  return (
    <button onClick={() => handleTransfer("0x...", 100n)} disabled={!isReady}>
      Transfer
    </button>
  );
}
```

### 4. Decrypt Values

```tsx
import { useUserDecrypt } from "@zama-fhe/react-sdk";

function BalanceDisplay({ handle, contractAddress }) {
  const { decrypt, results, isDecrypting, canDecrypt } = useUserDecrypt({
    handle,
    contractAddress,
  });

  const balance = handle ? results[handle] : undefined;

  return (
    <div>
      <p>Balance: {balance?.toString() ?? "Encrypted"}</p>
      <button onClick={decrypt} disabled={!canDecrypt}>
        {isDecrypting ? "Decrypting..." : "Decrypt"}
      </button>
    </div>
  );
}
```

## Available Hooks

| Hook | Description |
|------|-------------|
| `useFhevmStatus` | Check FHE initialization status |
| `useEncrypt` | Encrypt values for contract calls |
| `useUserDecrypt` | Decrypt values with user signature |
| `usePublicDecrypt` | Decrypt publicly accessible values |
| `useConfidentialTransfer` | Transfer ERC7984 confidential tokens |
| `useConfidentialBalances` | Fetch and decrypt token balances |
| `useShield` | Convert ERC20 to ERC7984 tokens |
| `useUnshield` | Convert ERC7984 to ERC20 tokens |
| `useFhevmClient` | Access the raw FHEVM client |

## Exports

```tsx
// Main entry - hooks and provider
import { FhevmProvider, useEncrypt, useFhevmStatus } from "@zama-fhe/react-sdk";

// Chain configurations
import { sepolia, hardhatLocal, createFhevmConfig } from "@zama-fhe/react-sdk/chains";

// Storage adapters
import { memoryStorage, indexedDbStorage } from "@zama-fhe/react-sdk/storage";

// TypeScript types
import type { EncryptInput, FhevmConfig } from "@zama-fhe/react-sdk/types";
```

## Supported Chains

| Chain | Chain ID |
|-------|----------|
| Sepolia Testnet | 11155111 |
| Hardhat Local | 31337 |

## Documentation

For full documentation, see the [docs](./docs) folder:

- [Installation](./docs/getting-started/installation.md)
- [Quick Start](./docs/getting-started/quick-start.md)
- [FhevmProvider](./docs/provider/fhevm-provider.md)
- [Hooks API](./docs/hooks/)
- [Configuration](./docs/configuration/)

## Requirements

- Node.js >= 18
- React >= 16.8
- @tanstack/react-query >= 5.0 (optional, for caching)

## License

BSD-3-Clause-Clear - see [LICENSE](./LICENSE) for details.
