[**Zama FHE SDK v0.1.0**](../README.md)

***

[Zama FHE SDK](../packages.md) / @zama-fhe/core-sdk

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

### assertAddress()

> **assertAddress**(`address`, `name?`): `` asserts address is `0x${string}` ``

Defined in: shared/dist/utils/validation.d.ts:8

Validate that a value is a valid address, throw if not.

#### Parameters

##### address

`unknown`

##### name?

`string`

#### Returns

`` asserts address is `0x${string}` ``

***

### assertChainId()

> **assertChainId**(`chainId`): `asserts chainId is number`

Defined in: shared/dist/utils/validation.d.ts:20

Validate chain ID.

#### Parameters

##### chainId

`unknown`

#### Returns

`asserts chainId is number`

***

### confidentialBalance()

> **confidentialBalance**(`config`, `params`): `Promise`\<`` `0x${string}` `` \| `undefined`\>

Defined in: [core-sdk/src/actions/confidentialBalance.ts:67](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L67)

Read an encrypted balance handle from an ERC7984 contract.

Returns the encrypted handle - use decrypt() to get the actual value.

#### Parameters

##### config

[`FhevmConfig`](#fhevmconfig)

##### params

[`ConfidentialBalanceParams`](#confidentialbalanceparams)

#### Returns

`Promise`\<`` `0x${string}` `` \| `undefined`\>

#### Example

```typescript
const handle = await confidentialBalance(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  account: '0xUser...',
  provider: 'https://sepolia.infura.io/v3/...',
})

if (handle) {
  // Decrypt to get actual balance
  const [balance] = await decrypt(config, {
    chainId: 11155111,
    requests: [{ handle, contractAddress: '0xToken...' }],
    userAddress: '0xUser...',
    signature: mySignature,
    provider: window.ethereum,
  })
}
```

***

### confidentialBalances()

> **confidentialBalances**(`config`, `params`): `Promise`\<(`` `0x${string}` `` \| `undefined`)[]\>

Defined in: [core-sdk/src/actions/confidentialBalance.ts:134](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L134)

Read encrypted balance handles from multiple ERC7984 contracts in parallel.

Similar to wagmi's useReadContracts - fetches multiple balances efficiently.

#### Parameters

##### config

[`FhevmConfig`](#fhevmconfig)

##### params

[`ConfidentialBalancesParams`](#confidentialbalancesparams)

#### Returns

`Promise`\<(`` `0x${string}` `` \| `undefined`)[]\>

#### Example

```typescript
const balances = await confidentialBalances(config, {
  chainId: 11155111,
  contracts: [
    { contractAddress: '0xTokenA...', account: '0xUser...' },
    { contractAddress: '0xTokenB...', account: '0xUser...' },
    { contractAddress: '0xTokenC...', account: '0xOther...' },
  ],
  provider: 'https://sepolia.infura.io/v3/...',
})

// balances = ['0xHandle1...', undefined, '0xHandle3...']
```

***

### confidentialTransfer()

> **confidentialTransfer**(`config`, `params`): `Promise`\<[`ConfidentialTransferResult`](#confidentialtransferresult)\>

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:78](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L78)

Execute a confidential ERC7984 token transfer.

Encrypts the amount and sends a transaction to transfer tokens confidentially.

Works with both ethers.js and viem providers.

#### Parameters

##### config

[`FhevmConfig`](#fhevmconfig)

##### params

[`ConfidentialTransferParams`](#confidentialtransferparams)

#### Returns

`Promise`\<[`ConfidentialTransferResult`](#confidentialtransferresult)\>

#### Example

```typescript
// Using ethers.js
import { ethers } from 'ethers'
const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: signer,
})

// Using viem
import { createWalletClient, custom } from 'viem'
const client = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
})

const result = await confidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: '0xToken...',
  to: '0xRecipient...',
  amount: 100n,
  provider: client,
})
```

***

### createEthersProvider()

> **createEthersProvider**(`signerOrProvider`): [`UnifiedProvider`](#unifiedprovider)

Defined in: [core-sdk/src/providers/ethers.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/ethers.ts#L33)

Create a UnifiedProvider from an ethers.js Signer or Provider.

#### Parameters

##### signerOrProvider

`unknown`

#### Returns

[`UnifiedProvider`](#unifiedprovider)

***

### createFhevmConfig()

> **createFhevmConfig**(`options`): [`FhevmConfig`](#fhevmconfig)

Defined in: [core-sdk/src/config/createConfig.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/createConfig.ts#L23)

Create an FhevmConfig for use with SDK actions.
Similar to wagmi's createConfig but for FHE operations.

#### Parameters

##### options

[`FhevmConfigOptions`](#fhevmconfigoptions)

#### Returns

[`FhevmConfig`](#fhevmconfig)

#### Example

```ts
import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
    [hardhatLocal.id]: http('http://localhost:8545'),
  },
})
```

***

### createViemProvider()

> **createViemProvider**(`client`): [`UnifiedProvider`](#unifiedprovider)

Defined in: [core-sdk/src/providers/viem.ts:51](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/viem.ts#L51)

Create a UnifiedProvider from a viem WalletClient or PublicClient.

#### Parameters

##### client

`unknown`

#### Returns

[`UnifiedProvider`](#unifiedprovider)

***

### custom()

> **custom**(`config`): [`Transport`](#transport)

Defined in: [core-sdk/src/transports/custom.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/transports/custom.ts#L22)

Create a custom transport with a provided provider.

Use this when you want to provide your own ethers provider, viem client,
or other custom provider.

#### Parameters

##### config

[`CustomTransportConfig`](#customtransportconfig)

#### Returns

[`Transport`](#transport)

#### Example

```typescript
// With ethers
import { ethers } from 'ethers'
const provider = new ethers.JsonRpcProvider('https://...')
const transport = custom({ provider })

// With viem
import { createPublicClient, http } from 'viem'
const client = createPublicClient({ chain: sepolia, transport: http() })
const transport = custom({ provider: client })
```

***

### defineChain()

> **defineChain**\<`T`\>(`chain`): `T`

Defined in: shared/dist/chains/defineChain.d.ts:19

Helper to define a custom FHE chain configuration.
Similar to wagmi's defineChain but for FHE-enabled networks.

#### Type Parameters

##### T

`T` *extends* [`FhevmChain`](#fhevmchain)

#### Parameters

##### chain

`T`

#### Returns

`T`

#### Example

```ts
const myChain = defineChain({
  id: 12345,
  name: 'My Chain',
  network: 'mychain',
  isMock: false,
  aclAddress: '0x...',
  gatewayUrl: 'https://gateway.mychain.com',
  // ...
})
```

***

### defineMockChain()

> **defineMockChain**(`chain`): [`FhevmMockChain`](#fhevmmockchain)

Defined in: shared/dist/chains/defineChain.d.ts:24

Helper to define a mock chain (local development).
Mock chains auto-fetch contract addresses from the hardhat node.

#### Parameters

##### chain

`Omit`\<[`FhevmMockChain`](#fhevmmockchain), `"isMock"`\>

#### Returns

[`FhevmMockChain`](#fhevmmockchain)

***

### defineProductionChain()

> **defineProductionChain**(`chain`): [`FhevmProductionChain`](#fhevmproductionchain)

Defined in: shared/dist/chains/defineChain.d.ts:28

Helper to define a production chain with full FHE infrastructure.

#### Parameters

##### chain

`Omit`\<[`FhevmProductionChain`](#fhevmproductionchain), `"isMock"`\>

#### Returns

[`FhevmProductionChain`](#fhevmproductionchain)

***

### detectAndWrapProvider()

> **detectAndWrapProvider**(`provider`): [`UnifiedProvider`](#unifiedprovider)

Defined in: [core-sdk/src/providers/detect.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/detect.ts#L18)

Auto-detect provider type and wrap it in a UnifiedProvider.

Supports:
- ethers.js Signer/Provider
- viem WalletClient/PublicClient
- EIP-1193 providers (future)
- RPC URLs (future)

#### Parameters

##### provider

`unknown`

The provider to detect and wrap

#### Returns

[`UnifiedProvider`](#unifiedprovider)

UnifiedProvider instance

#### Throws

Error if provider type cannot be detected

***

### encrypt()

> **encrypt**(`config`, `params`): `Promise`\<`EncryptedOutput`\>

Defined in: [core-sdk/src/actions/encrypt.ts:43](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L43)

Encrypt values for FHE contract calls.

Returns encrypted handles and proof that can be used in contract calls.

#### Parameters

##### config

[`FhevmConfig`](#fhevmconfig)

##### params

[`EncryptParams`](#encryptparams)

#### Returns

`Promise`\<`EncryptedOutput`\>

#### Example

```typescript
const result = await encrypt(config, {
  chainId: 11155111,
  values: [
    { type: 'uint64', value: 100n },
    { type: 'address', value: '0xRecipient...' },
  ],
  contractAddress: '0xContract...',
  userAddress: '0xUser...',
})

// Use in contract call
const [amountHandle, recipientHandle, proof] = [...result.handles, result.proof]
```

***

### fallback()

> **fallback**(`transports`): [`Transport`](#transport)

Defined in: [core-sdk/src/transports/fallback.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/transports/fallback.ts#L17)

Create a fallback transport that tries multiple transports in order.

If the first transport fails, it will try the next one, and so on.

#### Parameters

##### transports

[`Transport`](#transport)[]

#### Returns

[`Transport`](#transport)

#### Example

```typescript
const transport = fallback([
  http('https://eth-mainnet.g.alchemy.com/v2/...'),
  http('https://cloudflare-eth.com'),
  http('https://rpc.ankr.com/eth'),
])
```

***

### http()

> **http**(`config?`): [`Transport`](#transport)

Defined in: [core-sdk/src/transports/http.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/transports/http.ts#L13)

Create an HTTP transport for JSON-RPC connections.

#### Parameters

##### config?

`string` | [`HttpTransportConfig`](#httptransportconfig)

#### Returns

[`Transport`](#transport)

#### Example

```typescript
const transport = http()
const transport = http({ url: 'https://eth.llamarpc.com' })
const transport = http({ timeout: 10_000 })
```

***

### isAddress()

> **isAddress**(`address`): `` address is `0x${string}` ``

Defined in: shared/dist/utils/validation.d.ts:4

Check if a string is a valid Ethereum address.

#### Parameters

##### address

`unknown`

#### Returns

`` address is `0x${string}` ``

***

### isBigInt()

> **isBigInt**(`value`): `value is bigint`

Defined in: shared/dist/utils/validation.d.ts:12

Check if a value is a bigint or can be converted to one.

#### Parameters

##### value

`unknown`

#### Returns

`value is bigint`

***

### isEthersProvider()

> **isEthersProvider**(`obj`): `boolean`

Defined in: [core-sdk/src/providers/ethers.ts:82](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/ethers.ts#L82)

Check if an object is an ethers.js Signer.

#### Parameters

##### obj

`unknown`

#### Returns

`boolean`

***

### isMockChain()

> **isMockChain**(`chain`): `chain is FhevmMockChain`

Defined in: shared/dist/chains/types.d.ts:48

Type guard to check if a chain is a mock chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmMockChain`

***

### isProductionChain()

> **isProductionChain**(`chain`): `chain is FhevmProductionChain`

Defined in: shared/dist/chains/types.d.ts:52

Type guard to check if a chain is a production chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmProductionChain`

***

### isValidChainId()

> **isValidChainId**(`chainId`): `chainId is number`

Defined in: shared/dist/utils/validation.d.ts:16

Check if a value is a valid chain ID.

#### Parameters

##### chainId

`unknown`

#### Returns

`chainId is number`

***

### isViemProvider()

> **isViemProvider**(`obj`): `boolean`

Defined in: [core-sdk/src/providers/viem.ts:100](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/viem.ts#L100)

Check if an object is a viem client.

#### Parameters

##### obj

`unknown`

#### Returns

`boolean`

## Classes

### FhevmAbortError

Defined in: shared/dist/utils/errors.d.ts:41

Error thrown when an operation is aborted.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmAbortError**(`message?`, `options?`): [`FhevmAbortError`](#fhevmaborterror)

Defined in: shared/dist/utils/errors.d.ts:42

###### Parameters

###### message?

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmAbortError`](#fhevmaborterror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

***

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

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

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

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

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

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

***

### FhevmError

Defined in: shared/dist/utils/errors.d.ts:4

Base error class for FHEVM SDK errors.

#### Extends

- `Error`

#### Extended by

- [`FhevmConfigError`](#fhevmconfigerror)
- [`FhevmInstanceError`](#fhevminstanceerror)
- [`FhevmEncryptionError`](#fhevmencryptionerror)
- [`FhevmDecryptionError`](#fhevmdecryptionerror)
- [`FhevmSignatureError`](#fhevmsignatureerror)
- [`FhevmAbortError`](#fhevmaborterror)
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

### FhevmInstanceError

Defined in: shared/dist/utils/errors.d.ts:17

Error thrown when instance creation fails.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmInstanceError**(`message`, `options?`): [`FhevmInstanceError`](#fhevminstanceerror)

Defined in: shared/dist/utils/errors.d.ts:18

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmInstanceError`](#fhevminstanceerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

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

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

***

### FhevmSignatureError

Defined in: shared/dist/utils/errors.d.ts:35

Error thrown when signature operations fail.

#### Extends

- [`FhevmError`](#fhevmerror)

#### Constructors

##### Constructor

> **new FhevmSignatureError**(`message`, `options?`): [`FhevmSignatureError`](#fhevmsignatureerror)

Defined in: shared/dist/utils/errors.d.ts:36

###### Parameters

###### message

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmSignatureError`](#fhevmsignatureerror)

###### Overrides

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

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

[`FhevmError`](#fhevmerror).[`constructor`](#constructor-4)

#### Properties

##### code

> `readonly` **code**: `string`

Defined in: shared/dist/utils/errors.d.ts:5

###### Inherited from

[`FhevmError`](#fhevmerror).[`code`](#code-4)

## Interfaces

### ConfidentialBalanceParams

Defined in: [core-sdk/src/actions/confidentialBalance.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L10)

Parameters for reading a single confidential balance.

#### Properties

##### abi?

> `optional` **abi**: `unknown`[]

Defined in: [core-sdk/src/actions/confidentialBalance.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L20)

Custom ABI (optional)

##### account

> **account**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialBalance.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L16)

Account address to read balance for

##### chainId

> **chainId**: `number`

Defined in: [core-sdk/src/actions/confidentialBalance.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L12)

Chain ID

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialBalance.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L14)

ERC7984 token contract address

##### provider

> **provider**: `unknown`

Defined in: [core-sdk/src/actions/confidentialBalance.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L18)

Provider (ethers Provider, viem PublicClient, or RPC URL)

***

### ConfidentialBalancesParams

Defined in: [core-sdk/src/actions/confidentialBalance.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L26)

Parameters for reading multiple confidential balances.

#### Properties

##### chainId

> **chainId**: `number`

Defined in: [core-sdk/src/actions/confidentialBalance.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L28)

Chain ID

##### contracts

> **contracts**: `object`[]

Defined in: [core-sdk/src/actions/confidentialBalance.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L30)

Array of contract configurations

###### abi?

> `optional` **abi**: `unknown`[]

###### account

> **account**: `` `0x${string}` ``

###### contractAddress

> **contractAddress**: `` `0x${string}` ``

##### provider

> **provider**: `unknown`

Defined in: [core-sdk/src/actions/confidentialBalance.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialBalance.ts#L36)

Provider

***

### ConfidentialTransferParams

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L11)

Parameters for confidential transfer.

#### Properties

##### abi?

> `optional` **abi**: `unknown`[]

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:25](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L25)

Custom ABI (optional)

##### amount

> **amount**: `bigint`

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L19)

Amount to transfer (cleartext)

##### chainId

> **chainId**: `number`

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L13)

Chain ID

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L15)

ERC7984 token contract address

##### functionName?

> `optional` **functionName**: `string`

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:27](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L27)

Custom function name (optional)

##### provider

> **provider**: `unknown`

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L23)

Provider (ethers Signer, viem WalletClient, etc.)

##### to

> **to**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L17)

Recipient address

##### userAddress?

> `optional` **userAddress**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L21)

User address (optional - will use provider's address if not specified)

***

### ConfidentialTransferResult

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L33)

Result from confidential transfer.

#### Properties

##### status

> **status**: `"success"`

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:37](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L37)

Status

##### txHash

> **txHash**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/confidentialTransfer.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/confidentialTransfer.ts#L35)

Transaction hash

***

### CustomTransportConfig

Defined in: [core-sdk/src/types/transport.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L22)

Custom transport configuration.
Allows providing a custom provider (ethers, viem, etc.)

#### Properties

##### provider

> **provider**: `unknown`

Defined in: [core-sdk/src/types/transport.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L24)

Custom provider

***

### DecryptRequest

Defined in: shared/dist/types/decryption.d.ts:4

Request to decrypt a specific handle from a contract.

#### Properties

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: shared/dist/types/decryption.d.ts:8

Contract address that owns this encrypted value

##### handle

> **handle**: `` `0x${string}` ``

Defined in: shared/dist/types/decryption.d.ts:6

The encrypted handle to decrypt

***

### Eip1193Provider

Defined in: [core-sdk/src/providers/types.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L49)

EIP-1193 Provider interface.

#### Methods

##### request()

> **request**(`args`): `Promise`\<`unknown`\>

Defined in: [core-sdk/src/providers/types.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L50)

###### Parameters

###### args

###### method

`string`

###### params?

`unknown`[]

###### Returns

`Promise`\<`unknown`\>

***

### EIP712TypedData

Defined in: shared/dist/types/decryption.d.ts:30

EIP-712 typed data for decryption authorization.

#### Properties

##### domain

> **domain**: `object`

Defined in: shared/dist/types/decryption.d.ts:31

###### chainId

> **chainId**: `number`

###### name

> **name**: `string`

###### verifyingContract

> **verifyingContract**: `` `0x${string}` ``

###### version

> **version**: `string`

##### message

> **message**: `Record`\<`string`, `unknown`\>

Defined in: shared/dist/types/decryption.d.ts:37

##### primaryType

> **primaryType**: `string`

Defined in: shared/dist/types/decryption.d.ts:38

##### types

> **types**: `Record`\<`string`, `object`[]\>

Defined in: shared/dist/types/decryption.d.ts:39

***

### EncryptedOutput

Defined in: shared/dist/types/encryption.d.ts:37

Result from encryption operation.

#### Properties

##### handles

> **handles**: `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: shared/dist/types/encryption.d.ts:39

Array of encrypted handles (one per input value)

##### inputProof

> **inputProof**: `Uint8Array`

Defined in: shared/dist/types/encryption.d.ts:41

Proof of encryption validity

***

### EncryptParams

Defined in: [core-sdk/src/actions/encrypt.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L9)

Parameters for encryption operation.

#### Properties

##### chainId

> **chainId**: `number`

Defined in: [core-sdk/src/actions/encrypt.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L11)

Chain ID to encrypt for

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/encrypt.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L15)

Contract address that will receive the encrypted input

##### provider?

> `optional` **provider**: `unknown`

Defined in: [core-sdk/src/actions/encrypt.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L19)

Provider (not needed for encryption, but kept for API consistency)

##### userAddress

> **userAddress**: `` `0x${string}` ``

Defined in: [core-sdk/src/actions/encrypt.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L17)

User's wallet address

##### values

> **values**: readonly `EncryptInput`[]

Defined in: [core-sdk/src/actions/encrypt.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/actions/encrypt.ts#L13)

Values to encrypt

***

### FallbackTransportConfig

Defined in: [core-sdk/src/types/transport.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L31)

Fallback transport configuration.
Tries multiple transports in order.

#### Properties

##### transports

> **transports**: [`Transport`](#transport)[]

Defined in: [core-sdk/src/types/transport.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L33)

Array of transports to try in order

***

### FhevmConfig

Defined in: [core-sdk/src/config/types.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L33)

FhevmConfig holds the configuration for FHE operations.
Created once at app startup and passed to actions.

#### Methods

##### getChain()

> **getChain**(`chainId`): `FhevmChain` \| `undefined`

Defined in: [core-sdk/src/config/types.ts:44](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L44)

Get a chain by its ID.
Returns undefined if the chain is not configured.

###### Parameters

###### chainId

`number`

###### Returns

`FhevmChain` \| `undefined`

##### getMockRpcUrl()

> **getMockRpcUrl**(`chainId`): `string` \| `undefined`

Defined in: [core-sdk/src/config/types.ts:61](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L61)

Get the RPC URL for a mock chain.
Returns undefined for production chains or if chain is not found.

###### Parameters

###### chainId

`number`

###### Returns

`string` \| `undefined`

##### getTransport()

> **getTransport**(`chainId`): [`Transport`](#transport) \| `undefined`

Defined in: [core-sdk/src/config/types.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L50)

Get a transport for a chain.
Returns undefined if the transport is not configured.

###### Parameters

###### chainId

`number`

###### Returns

[`Transport`](#transport) \| `undefined`

##### isMockChain()

> **isMockChain**(`chainId`): `boolean`

Defined in: [core-sdk/src/config/types.ts:55](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L55)

Check if a chain ID corresponds to a mock chain.

###### Parameters

###### chainId

`number`

###### Returns

`boolean`

#### Properties

##### chains

> `readonly` **chains**: readonly `FhevmChain`[]

Defined in: [core-sdk/src/config/types.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L35)

Configured chains

##### transports

> `readonly` **transports**: [`TransportMap`](#transportmap)

Defined in: [core-sdk/src/config/types.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L38)

Transport configurations

***

### FhevmConfigOptions

Defined in: [core-sdk/src/config/types.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L7)

Options for creating an FhevmConfig.

#### Properties

##### chains

> **chains**: readonly `FhevmChain`[]

Defined in: [core-sdk/src/config/types.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L12)

Array of FHE-enabled chains to support.
At least one chain must be provided.

##### transports

> **transports**: [`TransportMap`](#transportmap)

Defined in: [core-sdk/src/config/types.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L26)

Transports for each chain.
Maps chain ID to transport configuration.

###### Example

```typescript
{
  [sepolia.id]: http('https://sepolia.infura.io/v3/...'),
  [hardhatLocal.id]: http('http://localhost:8545'),
}
```

***

### HttpTransportConfig

Defined in: [core-sdk/src/types/transport.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L9)

HTTP transport configuration.

#### Properties

##### batch?

> `optional` **batch**: `boolean`

Defined in: [core-sdk/src/types/transport.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L15)

Batch JSON-RPC requests

##### timeout?

> `optional` **timeout**: `number`

Defined in: [core-sdk/src/types/transport.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L13)

Request timeout in milliseconds

##### url?

> `optional` **url**: `string`

Defined in: [core-sdk/src/types/transport.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L11)

RPC URL

***

### ReadContractParams

Defined in: [core-sdk/src/providers/types.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L19)

Contract read parameters.

#### Properties

##### abi

> **abi**: `unknown`[]

Defined in: [core-sdk/src/providers/types.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L21)

##### address

> **address**: `` `0x${string}` ``

Defined in: [core-sdk/src/providers/types.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L20)

##### args?

> `optional` **args**: `unknown`[]

Defined in: [core-sdk/src/providers/types.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L23)

##### functionName

> **functionName**: `string`

Defined in: [core-sdk/src/providers/types.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L22)

***

### SignatureData

Defined in: shared/dist/types/decryption.d.ts:13

Signature data required for user decryption.

#### Properties

##### contractAddresses

> **contractAddresses**: `` `0x${string}` ``[]

Defined in: shared/dist/types/decryption.d.ts:21

Contract addresses authorized for decryption

##### durationDays

> **durationDays**: `number`

Defined in: shared/dist/types/decryption.d.ts:25

Number of days the authorization is valid

##### privateKey

> **privateKey**: `string`

Defined in: shared/dist/types/decryption.d.ts:19

User's private key for decryption

##### publicKey

> **publicKey**: `string`

Defined in: shared/dist/types/decryption.d.ts:17

User's public key for decryption

##### signature

> **signature**: `string`

Defined in: shared/dist/types/decryption.d.ts:15

The EIP-712 signature

##### startTimestamp

> **startTimestamp**: `number`

Defined in: shared/dist/types/decryption.d.ts:23

Unix timestamp when authorization starts (seconds)

***

### TransactionRequest

Defined in: [core-sdk/src/providers/types.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L9)

Unified transaction request.

#### Properties

##### data

> **data**: `` `0x${string}` ``

Defined in: [core-sdk/src/providers/types.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L11)

##### gasLimit?

> `optional` **gasLimit**: `bigint`

Defined in: [core-sdk/src/providers/types.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L13)

##### to

> **to**: `` `0x${string}` ``

Defined in: [core-sdk/src/providers/types.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L10)

##### value?

> `optional` **value**: `bigint`

Defined in: [core-sdk/src/providers/types.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L12)

***

### UnifiedProvider

Defined in: [core-sdk/src/providers/types.ts:29](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L29)

Unified provider interface that abstracts ethers.js and viem.

#### Methods

##### getAddress()

> **getAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [core-sdk/src/providers/types.ts:40](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L40)

Get the signer's address

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### getRawProvider()

> **getRawProvider**(): `unknown`

Defined in: [core-sdk/src/providers/types.ts:43](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L43)

Get the original raw provider

###### Returns

`unknown`

##### readContract()

> **readContract**(`params`): `Promise`\<`unknown`\>

Defined in: [core-sdk/src/providers/types.ts:37](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L37)

Read from a contract

###### Parameters

###### params

[`ReadContractParams`](#readcontractparams)

###### Returns

`Promise`\<`unknown`\>

##### sendTransaction()

> **sendTransaction**(`tx`): `Promise`\<`` `0x${string}` ``\>

Defined in: [core-sdk/src/providers/types.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L34)

Send a transaction

###### Parameters

###### tx

[`TransactionRequest`](#transactionrequest)

###### Returns

`Promise`\<`` `0x${string}` ``\>

#### Properties

##### type

> **type**: [`ProviderType`](#providertype)

Defined in: [core-sdk/src/providers/types.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L31)

Provider type

## Type Aliases

### ConfigChainId

> **ConfigChainId**\<`C`\> = `C`\[`"chains"`\]\[`number`\]\[`"id"`\]

Defined in: [core-sdk/src/config/types.ts:76](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/config/types.ts#L76)

Type helper to extract chain IDs from a config.
Useful for type-safe chain selection.

#### Type Parameters

##### C

`C` *extends* [`FhevmConfig`](#fhevmconfig)

***

### DecryptResults

> **DecryptResults** = `Record`\<`string`, `bigint`\>

Defined in: shared/dist/types/decryption.d.ts:48

Result from decryption operation.
Maps handle -> decrypted value.

***

### EncryptInput

> **EncryptInput** = \{ `type`: `"bool"`; `value`: `boolean`; \} \| \{ `type`: `"uint8"`; `value`: `number`; \} \| \{ `type`: `"uint16"`; `value`: `number`; \} \| \{ `type`: `"uint32"`; `value`: `number`; \} \| \{ `type`: `"uint64"`; `value`: `bigint`; \} \| \{ `type`: `"uint128"`; `value`: `bigint`; \} \| \{ `type`: `"uint256"`; `value`: `bigint`; \} \| \{ `type`: `"address"`; `value`: `` `0x${string}` ``; \}

Defined in: shared/dist/types/encryption.d.ts:9

Discriminated union for type-safe encryption inputs.
Each type has its own specific value type.

***

### EncryptResult

> **EncryptResult**\<`T`\> = \[`...{ [K in keyof T]: Uint8Array }`, `Uint8Array`\]

Defined in: shared/dist/types/encryption.d.ts:52

Tuple type for encryption result.
Returns [...handles, proof] for easy destructuring.

#### Type Parameters

##### T

`T` *extends* readonly [`EncryptInput`](#encryptinput)[]

#### Example

```typescript
const [handle1, handle2, proof] = result as EncryptResult<typeof inputs>
```

***

### FheTypeName

> **FheTypeName** = `"bool"` \| `"uint8"` \| `"uint16"` \| `"uint32"` \| `"uint64"` \| `"uint128"` \| `"uint256"` \| `"address"`

Defined in: shared/dist/types/encryption.d.ts:4

Supported FHE type names for encryption.

***

### FhevmChain

> **FhevmChain** = `object`

Defined in: shared/dist/chains/types.d.ts:5

FhevmChain defines the configuration for an FHE-enabled blockchain network.
Similar to wagmi's Chain type but specific to FHE operations.

#### Properties

##### aclAddress?

> `optional` **aclAddress**: `` `0x${string}` ``

Defined in: shared/dist/chains/types.d.ts:17

ACL contract address - controls FHE access permissions

##### gatewayUrl?

> `optional` **gatewayUrl**: `string`

Defined in: shared/dist/chains/types.d.ts:19

Gateway URL for relayer operations (production chains)

##### id

> **id**: `number`

Defined in: shared/dist/chains/types.d.ts:7

Unique chain identifier

##### inputVerifierAddress?

> `optional` **inputVerifierAddress**: `` `0x${string}` ``

Defined in: shared/dist/chains/types.d.ts:23

Input verifier contract address

##### isMock

> **isMock**: `boolean`

Defined in: shared/dist/chains/types.d.ts:13

Whether this is a mock/local chain (uses hardhat plugin mock mode)

##### kmsVerifierAddress?

> `optional` **kmsVerifierAddress**: `` `0x${string}` ``

Defined in: shared/dist/chains/types.d.ts:21

KMS verifier contract address

##### name

> **name**: `string`

Defined in: shared/dist/chains/types.d.ts:9

Human-readable chain name

##### network

> **network**: `string`

Defined in: shared/dist/chains/types.d.ts:11

Network identifier (e.g., 'sepolia', 'hardhat')

##### relayerUrl?

> `optional` **relayerUrl**: `string`

Defined in: shared/dist/chains/types.d.ts:25

Relayer URL for encrypted transaction relay

##### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: shared/dist/chains/types.d.ts:15

RPC URL for the chain (required for mock chains)

***

### FhevmMockChain

> **FhevmMockChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: shared/dist/chains/types.d.ts:30

Configuration for mock chains that auto-fetch metadata from the node

#### Type Declaration

##### isMock

> **isMock**: `true`

##### rpcUrl

> **rpcUrl**: `string`

***

### FhevmProductionChain

> **FhevmProductionChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: shared/dist/chains/types.d.ts:37

Configuration for production chains with full FHE infrastructure

#### Type Declaration

##### aclAddress

> **aclAddress**: `` `0x${string}` ``

##### gatewayUrl

> **gatewayUrl**: `string`

##### inputVerifierAddress

> **inputVerifierAddress**: `` `0x${string}` ``

##### isMock

> **isMock**: `false`

##### kmsVerifierAddress

> **kmsVerifierAddress**: `` `0x${string}` ``

##### relayerUrl

> **relayerUrl**: `string`

***

### ProviderType

> **ProviderType** = `"ethers"` \| `"viem"` \| `"eip1193"` \| `"url"`

Defined in: [core-sdk/src/providers/types.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/providers/types.ts#L4)

Provider type classification.

***

### Transport

> **Transport** = \{ `config`: [`HttpTransportConfig`](#httptransportconfig); `type`: `"http"`; \} \| \{ `config`: [`CustomTransportConfig`](#customtransportconfig); `type`: `"custom"`; \} \| \{ `config`: [`FallbackTransportConfig`](#fallbacktransportconfig); `type`: `"fallback"`; \}

Defined in: [core-sdk/src/types/transport.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L39)

Transport type union.

***

### TransportMap

> **TransportMap** = `Record`\<`number`, [`Transport`](#transport)\>

Defined in: [core-sdk/src/types/transport.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/core-sdk/src/types/transport.ts#L47)

Transport map - maps chain ID to transport.

## Variables

### ERC7984\_ABI

> `const` **ERC7984\_ABI**: readonly \[\{ `inputs`: readonly \[\{ `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"confidentialBalanceOf"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"owner"`; `type`: `"address"`; \}, \{ `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"confidentialAllowance"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"spender"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialApprove"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"from"`; `type`: `"address"`; \}, \{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferFrom"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}\]

Defined in: shared/dist/abi/erc7984.d.ts:4

Full ERC7984 ABI including balance and approval functions.

***

### hardhatLocal

> `const` **hardhatLocal**: [`FhevmMockChain`](#fhevmmockchain)

Defined in: shared/dist/chains/hardhat.d.ts:9

Hardhat local development chain.
Uses the FHEVM hardhat plugin in mock mode.

Contract addresses are automatically fetched from the node
via the `fhevm_relayer_metadata` RPC call.

***

### sepolia

> `const` **sepolia**: [`FhevmProductionChain`](#fhevmproductionchain)

Defined in: shared/dist/chains/sepolia.d.ts:12

Ethereum Sepolia testnet with Zama FHE infrastructure.

This chain uses the Zama relayer SDK for encrypted operations.
Contract addresses are loaded from the SDK at runtime via SepoliaConfig.

Note: The actual addresses are fetched from the relayer SDK at runtime
to ensure they stay in sync with Zama's infrastructure updates.
The placeholder addresses below are overridden during initialization.
