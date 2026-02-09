# React SDK Quick Start

Get started with `@zama-fhe/react-sdk` in under 5 minutes.

## Installation

```bash
npm install @zama-fhe/react-sdk @tanstack/react-query
```

Then install your preferred web3 library (see [Installation](installation.md) for all options).

---

## Setup

Choose the setup that matches your web3 stack.

### With wagmi (recommended)

```tsx
import { FhevmProvider, createFhevmConfig } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { WagmiProvider, useAccount, useConnectorClient } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });
const queryClient = new QueryClient();

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
    >
      {children}
    </FhevmProvider>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmWrapper>
          <YourApp />
        </FhevmWrapper>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### With viem (no wagmi)

```tsx
import { FhevmProvider, createFhevmConfig, type FhevmWallet } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { createWalletClient, custom } from "viem";
import { sepolia as viemSepolia } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });
const queryClient = new QueryClient();

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
      <FhevmProvider
        config={fhevmConfig}
        wallet={wallet}
        address={wallet.address}
        chainId={viemSepolia.id}
        isConnected={true}
      >
        <YourApp />
      </FhevmProvider>
    </QueryClientProvider>
  );
}
```

### With ethers.js (no wagmi)

```tsx
import { FhevmProvider, createFhevmConfig, type FhevmWallet } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { BrowserProvider } from "ethers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fhevmConfig = createFhevmConfig({ chains: [sepolia] });
const queryClient = new QueryClient();

function App() {
  const ethersProvider = new BrowserProvider(window.ethereum!);
  const signer = await ethersProvider.getSigner();

  const wallet: FhevmWallet = {
    address: (await signer.getAddress()) as `0x${string}`,
    sendTransaction: async (tx) => {
      const resp = await signer.sendTransaction(tx);
      return resp.hash as `0x${string}`;
    },
    signTypedData: (td) =>
      signer.signTypedData(td.domain, td.types, td.message),
  };

  return (
    <QueryClientProvider client={queryClient}>
      <FhevmProvider
        config={fhevmConfig}
        wallet={wallet}
        address={wallet.address}
        chainId={11155111}
        isConnected={true}
      >
        <YourApp />
      </FhevmProvider>
    </QueryClientProvider>
  );
}
```

---

## Using Hooks

### Confidential Transfer

`useConfidentialTransfer` handles encryption, signing, and confirmation in a single call:

```tsx
import { useConfidentialTransfer } from "@zama-fhe/react-sdk";

function TransferForm({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { transfer, isEncrypting, isSigning, isSuccess, error, txHash } =
    useConfidentialTransfer({ contractAddress });

  return (
    <div>
      <button onClick={() => transfer("0xRecipient...", 100n)} disabled={isEncrypting || isSigning}>
        Transfer 100 Tokens
      </button>
      {isEncrypting && <p>Encrypting...</p>}
      {isSigning && <p>Sign the transaction in your wallet...</p>}
      {isSuccess && <p>Transfer complete! TX: {txHash}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Confidential Balances

`useConfidentialBalances` fetches encrypted balances and optionally decrypts them:

```tsx
import { useConfidentialBalances } from "@zama-fhe/react-sdk";

function BalanceDisplay({ contractAddress }: { contractAddress: `0x${string}` }) {
  const { data, isLoading, decryptAll, isDecrypting, canDecrypt, isAllDecrypted } =
    useConfidentialBalances({
      contracts: [{ contractAddress }],
      decrypt: true,
    });

  if (isLoading) return <p>Loading balance...</p>;

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

## Next Steps

- [React SDK Documentation](../react-sdk/README.md)
- [Configuration](../react-sdk/configuration/overview.md)
- [API Reference](../api/@zama-fhe/react-sdk/README.md)
