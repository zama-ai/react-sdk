[**Zama FHE SDK v0.1.0**](../../README.md)

***

[Zama FHE SDK](../../packages.md) / @zama-fhe/core-sdk

# @zama-fhe/core-sdk

**Framework-agnostic core SDK for Fully Homomorphic Encryption (FHE) on EVM chains**

A lightweight, provider-agnostic SDK for building FHE-powered applications. Works seamlessly with both **ethers.js** and **viem**, in **Node.js** and **browsers**.

> ⚠️ **Alpha Software**: This SDK is under active development. APIs may change.

## Features

✅ **Dual Web3 Library Support**: Works with both ethers.js v6 and viem v2
✅ **Framework Agnostic**: Use in Node.js, React, Vue, Svelte, or vanilla JS
✅ **TypeScript First**: Full type safety and IntelliSense support
✅ **Zero State Management**: Pure async functions, no global state
✅ **Tree-Shakeable**: Import only what you need
✅ **Backend Ready**: Perfect for Express APIs, CLIs, workers, and serverless

## Installation

```bash
npm install @zama-fhe/core-sdk

# Install your preferred Web3 library
npm install ethers@^6.0.0
# OR
npm install viem@^2.0.0
```

## Quick Start

### Configuration

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

### Confidential Transfer (Ethers.js)

```typescript
import { ethers } from 'ethers'
import { confidentialTransfer } from '@zama-fhe/core-sdk'

const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xYourToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: signer, // ← Ethers signer
})

console.log('Transaction:', result.txHash)
```

### Confidential Transfer (Viem)

```typescript
import { createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'
import { confidentialTransfer } from '@zama-fhe/core-sdk'

const client = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xYourToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: client, // ← Viem wallet client
})

console.log('Transaction:', result.txHash)
```

### Read Confidential Balance

```typescript
import { confidentialBalance } from '@zama-fhe/core-sdk'

// Uses the transport configured in config
const handle = await confidentialBalance(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  account: '0xUser...',
})

// Returns encrypted handle - use decrypt() to get actual value
```

### Multiple Balances (Parallel)

```typescript
import { confidentialBalances } from '@zama-fhe/core-sdk'

// Automatically uses the configured transport for the chain
const handles = await confidentialBalances(config, {
  chainId: 11155111,
  contracts: [
    { contractAddress: '0xUSDC...', account: userAddress },
    { contractAddress: '0xDAI...', account: userAddress },
    { contractAddress: '0xWETH...', account: userAddress },
  ],
})
```

## Node.js Backend Example

```typescript
import { ethers } from 'ethers'
import { createFhevmConfig, http, confidentialTransfer } from '@zama-fhe/core-sdk'
import { sepolia } from '@zama-fhe/core-sdk/chains'

// Configure with RPC URL
const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.RPC_URL),
  },
})

// Server-side transfer using private key
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

async function serverSideTransfer(to: string, amount: bigint) {
  const result = await confidentialTransfer(config, {
    chainId: 11155111,
    contractAddress: process.env.TOKEN_ADDRESS as `0x${string}`,
    to: to as `0x${string}`,
    amount,
    provider: wallet, // ← Ethers Wallet works in Node.js
  })

  return result.txHash
}
```

## Core Concepts

### 1. Configuration

Create a config once and reuse it throughout your app:

```typescript
import { createFhevmConfig, http, fallback } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    // Single RPC
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),

    // Multiple fallbacks
    [hardhatLocal.id]: fallback([
      http('http://localhost:8545'),
      http('http://127.0.0.1:8545'),
    ]),
  },
})

// Access chain info
const chain = config.getChain(11155111)
const transport = config.getTransport(11155111)
const isMock = config.isMockChain(31337)
```

### 2. Provider Abstraction

The SDK automatically detects whether you're using ethers.js or viem:

```typescript
// Works with ethers
const signer = await provider.getSigner()
await confidentialTransfer(config, { provider: signer, ... })

// Works with viem
const client = createWalletClient({ ... })
await confidentialTransfer(config, { provider: client, ... })
```

### 3. Actions

All operations are pure async functions:

```typescript
import {
  encrypt,
  confidentialTransfer,
  confidentialBalance,
  // decrypt, // Coming soon
  // publicDecrypt, // Coming soon
} from '@zama-fhe/core-sdk/actions'
```

## API Reference

### Configuration

- `createFhevmConfig(options)` - Create SDK configuration
- `sepolia` - Sepolia testnet chain config
- `hardhatLocal` - Local Hardhat chain config
- `defineChain(chain)` - Define custom chain

### Actions

- `encrypt(config, params)` - Encrypt values for contract calls
- `confidentialTransfer(config, params)` - Execute confidential ERC7984 transfer
- `confidentialBalance(config, params)` - Read encrypted balance handle
- `confidentialBalances(config, params)` - Read multiple balances in parallel

### Types

```typescript
import type {
  FhevmConfig,
  FhevmChain,
  EncryptInput,
  EncryptedOutput,
  ConfidentialTransferParams,
  ConfidentialBalanceParams,
} from '@zama-fhe/core-sdk'
```

## Current Limitations

This is an alpha release with the following known limitations:

1. **Encryption Not Implemented**: The `encrypt()` function requires integration with `@zama-fhe/relayer-sdk` (coming soon)
2. **Decryption Not Implemented**: `decrypt()` and `publicDecrypt()` actions are planned
3. **ABI Encoding**: Transaction encoding requires ethers or viem to be installed
4. **No Storage Management**: Users must manage signature storage themselves (by design)

## Roadmap

- [ ] Complete `encrypt()` implementation with relayer-sdk
- [ ] Implement `decrypt()` and `publicDecrypt()` actions
- [ ] Add `createEIP712()` for signature generation
- [ ] Support direct RPC URL providers
- [ ] Support EIP-1193 providers directly
- [ ] Add instance caching and management
- [ ] Comprehensive test coverage
- [ ] React SDK integration

## Architecture

This SDK follows the **wagmi-core** pattern:

- **@fhevm/relayer-sdk** → Low-level FHE primitives
- **@zama-fhe/core-sdk** → Framework-agnostic actions (this package)
- **@zama-fhe/react-sdk** → React hooks layer (coming soon)

## Contributing

This SDK is under active development. Contributions, issues, and feedback are welcome!

## License

BSD-3-Clause-Clear

## Links

- [Documentation](#) (coming soon)
- [GitHub](https://github.com/zama-ai/core-sdk)
- [Zama](https://www.zama.ai/)

## Functions

- [confidentialBalance](functions/confidentialBalance.md)
- [confidentialBalances](functions/confidentialBalances.md)
- [confidentialTransfer](functions/confidentialTransfer.md)
- [createFhevmConfig](functions/createFhevmConfig.md)
- [custom](functions/custom.md)
- [defineChain](functions/defineChain.md)
- [defineMockChain](functions/defineMockChain.md)
- [defineProductionChain](functions/defineProductionChain.md)
- [detectAndWrapProvider](functions/detectAndWrapProvider.md)
- [encrypt](functions/encrypt.md)
- [fallback](functions/fallback.md)
- [http](functions/http.md)

## Classes

### FhevmConfigError

Defined in: shared/dist/utils/errors.d.ts:11

Error thrown when config is invalid.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmConfigError**(`message`, `options?`): [`FhevmConfigError`](#fhevmconfigerror)

Defined in: shared/dist/utils/errors.d.ts:12

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmConfigError`](#fhevmconfigerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-3)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-3)

***

### FhevmDecryptionError

Defined in: shared/dist/utils/errors.d.ts:29

Error thrown when decryption fails.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmDecryptionError**(`message`, `options?`): [`FhevmDecryptionError`](#fhevmdecryptionerror)

Defined in: shared/dist/utils/errors.d.ts:30

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmDecryptionError`](#fhevmdecryptionerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-3)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-3)

***

### FhevmEncryptionError

Defined in: shared/dist/utils/errors.d.ts:23

Error thrown when encryption fails.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmEncryptionError**(`message`, `options?`): [`FhevmEncryptionError`](#fhevmencryptionerror)

Defined in: shared/dist/utils/errors.d.ts:24

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmEncryptionError`](#fhevmencryptionerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-3)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-3)

***

### FhevmError

Defined in: shared/dist/utils/errors.d.ts:4

Base error class for FHEVM SDK errors.

#### Extends

- `Error`

#### Extended by

- [`FhevmConfigError`](#fhevmconfigerror)
- [`FhevmEncryptionError`](#fhevmencryptionerror)
- [`FhevmDecryptionError`](#fhevmdecryptionerror)
- [`FhevmProviderError`](#fhevmprovidererror)
- [`FhevmTransactionError`](#fhevmtransactionerror)

#### Constructors

##### Constructor

> **new FhevmError**(`code`, `message`, `options?`): [`FhevmError`](#fhevmerror)

Defined in: shared/dist/utils/errors.d.ts:6

###### Parameters

###### code

`string`

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmError`](#fhevmerror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

***

### FhevmProviderError

Defined in: shared/dist/utils/errors.d.ts:47

Error thrown when provider is invalid.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmProviderError**(`message`, `options?`): [`FhevmProviderError`](#fhevmprovidererror)

Defined in: shared/dist/utils/errors.d.ts:48

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmProviderError`](#fhevmprovidererror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-3)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-3)

***

### FhevmTransactionError

Defined in: shared/dist/utils/errors.d.ts:53

Error thrown when transaction fails.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmTransactionError**(`message`, `options?`): [`FhevmTransactionError`](#fhevmtransactionerror)

Defined in: shared/dist/utils/errors.d.ts:54

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmTransactionError`](#fhevmtransactionerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-3)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-3)

## Variables

### hardhatLocal

> `const` **hardhatLocal**: `FhevmMockChain`

Defined in: shared/dist/chains/hardhat.d.ts:9

Hardhat local development chain.
Uses the FHEVM hardhat plugin in mock mode.

Contract addresses are automatically fetched from the node
via the `fhevm_relayer_metadata` RPC call.

***

### sepolia

> `const` **sepolia**: `FhevmProductionChain`

Defined in: shared/dist/chains/sepolia.d.ts:12

Ethereum Sepolia testnet with Zama FHE infrastructure.

This chain uses the Zama relayer SDK for encrypted operations.
Contract addresses are loaded from the SDK at runtime via SepoliaConfig.

Note: The actual addresses are fetched from the relayer SDK at runtime
to ensure they stay in sync with Zama's infrastructure updates.
The placeholder addresses below are overridden during initialization.
