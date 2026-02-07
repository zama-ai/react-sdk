# React SDK Quick Start

Get started with `@zama-fhe/react-sdk` in under 5 minutes.

For detailed setup instructions, see the [React SDK Quick Start Guide](../react-sdk/getting-started/quick-start.md).

## Installation

```bash
npm install @zama-fhe/react-sdk wagmi viem @tanstack/react-query
```

## Basic Setup

```tsx
import { FhevmProvider, createFhevmConfig } from "@zama-fhe/react-sdk";
import { sepolia } from "@zama-fhe/react-sdk/chains";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Create wagmi config
const wagmiConfig = createConfig({
  chains: [sepolia],
  // ... other wagmi config
});

// 2. Create FHEVM config
const fhevmConfig = createFhevmConfig({
  chains: [sepolia],
});

// 3. Create query client
const queryClient = new QueryClient();

// 4. Wrap your app
function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmProvider config={fhevmConfig}>
          <YourApp />
        </FhevmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Using Hooks

```tsx
import { useEncrypt, useFhevmStatus } from "@zama-fhe/react-sdk";
import { useWriteContract } from "wagmi";

function EncryptedTransfer() {
  const { isReady } = useFhevmStatus();
  const { encrypt } = useEncrypt();
  const { writeContract } = useWriteContract();

  const handleTransfer = async () => {
    // Encrypt the amount
    const [amountHandle, proof] = await encrypt(
      [{ type: "uint64", value: 100n }],
      contractAddress
    );

    // Send to contract
    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: "transfer",
      args: [recipient, amountHandle, proof],
    });
  };

  return (
    <button onClick={handleTransfer} disabled={!isReady}>
      Transfer 100 Tokens
    </button>
  );
}
```

## Next Steps

- Read the full [React SDK Documentation](../react-sdk/README.md)
- Learn about [Configuration](../react-sdk/configuration/overview.md)
- Explore [Hooks](../react-sdk/hooks/)
