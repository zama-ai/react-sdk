# Quick Start

This guide walks you through setting up @zama-fhe/react-sdk in a React application.

## 1. Create Configuration

First, create a configuration with your supported chains:

```tsx
// config/fhevm.ts
import { createFhevmConfig } from "@zama-fhe/react-sdk";
import { sepolia, hardhatLocal } from "@zama-fhe/react-sdk/chains";

export const fhevmConfig = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
});
```

## 2. Set Up Providers

Choose the setup that matches your web3 stack.

### With wagmi (recommended)

Wrap your application with the FhevmProvider inside WagmiProvider:

```tsx
// app/providers.tsx
"use client";

import { FhevmProvider, memoryStorage, type Eip1193Provider } from "@zama-fhe/react-sdk";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccount, useConnectorClient } from "wagmi";
import { fhevmConfig } from "./config/fhevm";
import { wagmiConfig } from "./config/wagmi";

const queryClient = new QueryClient();

function FhevmWrapper({ children }: { children: React.ReactNode }) {
  const { address, chainId, isConnected } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  // Get EIP-1193 provider from wagmi connector
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

### With viem (no wagmi)

Create an `FhevmWallet` from a viem `WalletClient` and pass it directly:

```tsx
import {
  FhevmProvider, createFhevmConfig, memoryStorage,
  type FhevmWallet,
} from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { createWalletClient, custom } from "viem";
import { sepolia as viemSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });
const queryClient = new QueryClient();

function App() {
  // Create viem WalletClient (your connection logic here)
  const walletClient = createWalletClient({
    chain: viemSepolia,
    transport: custom(window.ethereum!),
  });

  // Wrap as FhevmWallet — 3 lines
  const wallet: FhevmWallet = {
    address: walletClient.account!.address,
    sendTransaction: (tx) =>
      walletClient.sendTransaction({
        ...tx,
        account: walletClient.account!,
        chain: viemSepolia,
      }),
    signTypedData: (td) =>
      walletClient.signTypedData({ ...td, account: walletClient.account! }),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FhevmProvider
        config={fhevmConfig}
        wallet={wallet}
        address={wallet.address}
        chainId={viemSepolia.id}
        isConnected={true}
        storage={memoryStorage}
      >
        <YourApp />
      </FhevmProvider>
    </QueryClientProvider>
  );
}
```

### With ethers.js (no wagmi)

Create an `FhevmWallet` from an ethers.js `Signer`:

```tsx
import {
  FhevmProvider, createFhevmConfig, memoryStorage,
  type FhevmWallet,
} from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { BrowserProvider } from "ethers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });
const queryClient = new QueryClient();

function App() {
  const [wallet, setWallet] = useState<FhevmWallet>();

  useEffect(() => {
    async function connect() {
      const provider = new BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();

      // Wrap as FhevmWallet — 3 lines
      setWallet({
        address: (await signer.getAddress()) as `0x${string}`,
        sendTransaction: async (tx) => {
          const resp = await signer.sendTransaction(tx);
          return resp.hash as `0x${string}`;
        },
        signTypedData: (td) =>
          signer.signTypedData(td.domain, td.types, td.message),
      });
    }
    connect();
  }, []);

  if (!wallet) return <p>Connecting...</p>;

  return (
    <QueryClientProvider client={queryClient}>
      <FhevmProvider
        config={fhevmConfig}
        wallet={wallet}
        address={wallet.address}
        chainId={11155111}
        isConnected={true}
        storage={memoryStorage}
      >
        <YourApp />
      </FhevmProvider>
    </QueryClientProvider>
  );
}
```

## 3. Transfer Confidential Tokens

Use the `useConfidentialTransfer` hook — it handles encryption, signing, and confirmation automatically:

```tsx
import { useConfidentialTransfer } from "@zama-fhe/react-sdk";

function TransferForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const {
    transfer, status, isEncrypting, isSigning, isConfirming, isSuccess, error, txHash, reset,
  } = useConfidentialTransfer({ contractAddress });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    transfer(recipient as `0x${string}`, BigInt(amount));
  };

  return (
    <div>
      <input placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleTransfer} disabled={status !== "idle"}>
        Transfer
      </button>

      {isEncrypting && <p>Encrypting amount...</p>}
      {isSigning && <p>Sign the transaction in your wallet...</p>}
      {isConfirming && <p>Waiting for confirmation...</p>}
      {isSuccess && <p>Done! TX: {txHash}</p>}
      {error && <p>Error: {error.message} <button onClick={reset}>Retry</button></p>}
    </div>
  );
}
```

## 4. Read Confidential Balances

Use the `useConfidentialBalances` hook to fetch and decrypt balances:

```tsx
import { useConfidentialBalances } from "@zama-fhe/react-sdk";

function BalanceDisplay({ contractAddress }: { contractAddress: `0x${string}` }) {
  const {
    data, isLoading, decryptAll, isDecrypting, canDecrypt, isAllDecrypted,
  } = useConfidentialBalances({
    contracts: [{ contractAddress }],
    decrypt: true,
  });

  if (isLoading) return <p>Loading...</p>;

  const balance = data[0];

  return (
    <div>
      <p>
        Balance:{" "}
        {balance?.decryptedValue !== undefined
          ? `${balance.decryptedValue} tokens`
          : "Encrypted"}
      </p>
      {canDecrypt && !isAllDecrypted && (
        <button onClick={decryptAll} disabled={isDecrypting}>
          {isDecrypting ? "Decrypting..." : "Reveal Balance"}
        </button>
      )}
    </div>
  );
}
```

## 5. Check Status

Use the `useFhevmStatus` hook for conditional rendering:

```tsx
import { useFhevmStatus } from "@zama-fhe/react-sdk";

function FHEStatus() {
  const { status, isReady, isInitializing, isError, error } = useFhevmStatus();

  if (isInitializing) {
    return <p>Initializing FHE...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  if (!isReady) {
    return <p>Connect your wallet to continue</p>;
  }

  return <p>FHE Ready!</p>;
}
```

## Next Steps

- [FhevmProvider](../provider/fhevm-provider.md) - Learn about provider configuration
- [Wallet Interface](../guides/wallet-interface.md) - FhevmWallet details for viem and ethers.js
- [Storage Configuration](../configuration/storage.md) - Configure signature caching
- [useConfidentialTransfer](../hooks/use-confidential-transfer.md) - Full transfer hook API
- [useConfidentialBalances](../hooks/use-confidential-balances.md) - Full balance hook API
