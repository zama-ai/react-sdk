# FhevmWallet Interface

The `FhevmWallet` interface provides a lightweight way to connect any wallet to the FHEVM React SDK. Instead of wrapping your wallet in an EIP-1193 adapter, you pass `sendTransaction` and `signTypedData` directly.

## Why FhevmWallet?

Previously, the SDK required an EIP-1193 `provider` and internally reconstructed wallet capabilities through ethers.js:

```
EIP-1193 → ethers.BrowserProvider → ethers.JsonRpcSigner → ethers.Contract
```

This forced non-wagmi consumers to write 80+ line EIP-1193 adapters. With `FhevmWallet`, both viem and ethers users can integrate in 3-5 lines.

## Interface

```typescript
interface FhevmWallet {
  address: `0x${string}`;
  sendTransaction(tx: {
    to: `0x${string}`;
    data: `0x${string}`;
    value?: bigint;
  }): Promise<`0x${string}`>;
  signTypedData(typedData: {
    domain: Record<string, unknown>;
    types: Record<string, Array<{ name: string; type: string }>>;
    primaryType: string;
    message: Record<string, unknown>;
  }): Promise<`0x${string}`>;
}
```

## Usage

### With viem

```tsx
import { useWalletClient } from 'wagmi'
import { FhevmWallet, FhevmProvider, createFhevmConfig, sepolia } from '@zama-fhe/react-sdk'

const config = createFhevmConfig({ chains: [sepolia] })

function App() {
  const { data: walletClient } = useWalletClient()
  const { address, chainId, isConnected } = useAccount()

  const wallet: FhevmWallet | undefined = walletClient ? {
    address: walletClient.account.address,
    sendTransaction: (tx) => walletClient.sendTransaction({
      ...tx,
      account: walletClient.account,
      chain: walletClient.chain,
    }),
    signTypedData: (td) => walletClient.signTypedData({
      ...td,
      account: walletClient.account,
    }),
  } : undefined

  return (
    <FhevmProvider
      config={config}
      wallet={wallet}
      provider={window.ethereum}  // Still needed for FHEVM instance init
      address={address}
      chainId={chainId}
      isConnected={isConnected}
    >
      <YourApp />
    </FhevmProvider>
  )
}
```

### With ethers.js v6

```tsx
import { BrowserProvider } from 'ethers'
import { FhevmWallet, FhevmProvider, createFhevmConfig, sepolia } from '@zama-fhe/react-sdk'

function App() {
  const [wallet, setWallet] = useState<FhevmWallet>()

  useEffect(() => {
    async function init() {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setWallet({
        address: address as `0x${string}`,
        sendTransaction: async (tx) => {
          const resp = await signer.sendTransaction(tx)
          return resp.hash as `0x${string}`
        },
        signTypedData: async (td) => {
          const sig = await signer.signTypedData(
            td.domain as any,
            td.types as any,
            td.message
          )
          return sig as `0x${string}`
        },
      })
    }
    init()
  }, [])

  return (
    <FhevmProvider
      config={createFhevmConfig({ chains: [sepolia] })}
      wallet={wallet}
      provider={window.ethereum}
      ...
    >
      <YourApp />
    </FhevmProvider>
  )
}
```

### With Turnkey or other embedded wallets

```tsx
const wallet: FhevmWallet = {
  address: turnkeyAccount.address,
  sendTransaction: async (tx) => {
    return await turnkeyClient.sendTransaction(tx)
  },
  signTypedData: async (td) => {
    return await turnkeyClient.signTypedData(td)
  },
}
```

## How it works internally

When `wallet` is provided:
- **Write operations** (`useShield`, `useUnshield`, `useConfidentialTransfer`) use `wallet.sendTransaction()` with ABI-encoded calldata
- **Read operations** (`useConfidentialBalances`, `useShield` allowance checks) use `eth_call` via the chain's RPC URL
- **Signing** (`useUserDecrypt`) uses `wallet.signTypedData()` for EIP-712 decryption signatures
- **Receipt polling** uses `eth_getTransactionReceipt` via the chain's RPC URL

When `wallet` is not provided, all hooks fall back to the existing `provider` → ethers.js path.
