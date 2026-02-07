# @zama-fhe/core-sdk Examples

Complete examples showing the wagmi-core style API.

## Basic Configuration

```typescript
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

export const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
    [hardhatLocal.id]: http('http://localhost:8545'),
  },
})
```

## With Fallback Transports

```typescript
import { createFhevmConfig, http, fallback } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'

export const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: fallback([
      http('https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY'),
      http('https://sepolia.infura.io/v3/YOUR_KEY'),
      http('https://rpc.ankr.com/eth_sepolia'),
    ]),
  },
})
```

## With Custom Provider

```typescript
import { createFhevmConfig, http, custom } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'
import { ethers } from 'ethers'

// Create custom ethers provider
const ethersProvider = new ethers.JsonRpcProvider('https://...')

export const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: custom({ provider: ethersProvider }),
  },
})
```

## Browser + Wallet Integration (Ethers)

```typescript
import { createFhevmConfig, http, confidentialTransfer } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'
import { ethers } from 'ethers'

// Configure with public RPC
const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
  },
})

// Use wallet for signing
async function transfer() {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const result = await confidentialTransfer(config, {
    chainId: 11155111,
    contractAddress: '0xToken...',
    to: '0xRecipient...',
    amount: 100n,
    provider: signer, // ← Wallet signer
  })

  console.log('Tx:', result.txHash)
}
```

## Browser + Wallet Integration (Viem)

```typescript
import { createFhevmConfig, http, confidentialTransfer } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'
import { createWalletClient, custom } from 'viem'
import { sepolia as viemSepolia } from 'viem/chains'

// Configure with public RPC
const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
  },
})

// Use wallet for signing
async function transfer() {
  const walletClient = createWalletClient({
    chain: viemSepolia,
    transport: custom(window.ethereum),
  })

  const result = await confidentialTransfer(config, {
    chainId: 11155111,
    contractAddress: '0xToken...',
    to: '0xRecipient...',
    amount: 100n,
    provider: walletClient, // ← Wallet client
  })

  console.log('Tx:', result.txHash)
}
```

## Node.js Server

```typescript
import express from 'express'
import { createFhevmConfig, http, confidentialBalance } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'

const app = express()

// Configure once at startup
const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.RPC_URL),
  },
})

// Read balance endpoint
app.get('/balance/:address', async (req, res) => {
  try {
    const handle = await confidentialBalance(config, {
      chainId: 11155111,
      contractAddress: process.env.TOKEN_ADDRESS as `0x${string}`,
      account: req.params.address as `0x${string}`,
    })

    res.json({ handle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000)
```

## React Integration

```typescript
// config.ts
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'

export const fhevmConfig = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
})

// App.tsx
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { confidentialBalance } from '@zama-fhe/core-sdk'
import { fhevmConfig } from './config'

function BalanceDisplay({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { address } = useAccount()
  const [balance, setBalance] = useState<string>()

  const loadBalance = async () => {
    if (!address) return

    const handle = await confidentialBalance(fhevmConfig, {
      chainId: 11155111,
      contractAddress: tokenAddress,
      account: address,
    })

    setBalance(handle)
  }

  return (
    <div>
      <button onClick={loadBalance}>Load Balance</button>
      {balance && <p>Balance Handle: {balance}</p>}
    </div>
  )
}
```

## Multi-Chain Support

```typescript
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'
import { confidentialBalance } from '@zama-fhe/core-sdk'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
    [hardhatLocal.id]: http('http://localhost:8545'),
  },
})

// Read from Sepolia
const sepoliaBalance = await confidentialBalance(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  account: '0xUser...',
})

// Read from local Hardhat
const localBalance = await confidentialBalance(config, {
  chainId: 31337,
  contractAddress: '0xToken...',
  account: '0xUser...',
})
```

## TypeScript Type Safety

```typescript
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'
import type { ConfigChainId } from '@zama-fhe/core-sdk'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal] as const,
  transports: {
    [sepolia.id]: http('https://...'),
    [hardhatLocal.id]: http('http://localhost:8545'),
  },
})

// Extract valid chain IDs as type
type ValidChainId = ConfigChainId<typeof config>
// ValidChainId = 11155111 | 31337

function processBalance(chainId: ValidChainId) {
  // chainId is type-safe!
  const chain = config.getChain(chainId)
  // ...
}

processBalance(11155111) // ✅ Valid
// processBalance(1) // ❌ Type error
```

## Environment-Based Configuration

```typescript
// config.ts
import { createFhevmConfig, http, fallback } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

const isDev = process.env.NODE_ENV === 'development'

export const config = createFhevmConfig({
  chains: isDev ? [hardhatLocal] : [sepolia],
  transports: isDev
    ? {
        [hardhatLocal.id]: http('http://localhost:8545'),
      }
    : {
        [sepolia.id]: fallback([
          http(process.env.NEXT_PUBLIC_ALCHEMY_URL),
          http(process.env.NEXT_PUBLIC_INFURA_URL),
        ]),
      },
})
```

## Comparison with wagmi

```typescript
// wagmi-core
import { createConfig, http } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// @zama-fhe/core-sdk (same pattern!)
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

const fhevmConfig = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http(),
    [hardhatLocal.id]: http(),
  },
})
```

The API is intentionally identical to wagmi-core for familiarity!
