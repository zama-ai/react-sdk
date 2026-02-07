[**Zama FHE SDK v0.1.0**](../README.md)

***

[Zama FHE SDK](../packages.md) / @zama-fhe/react-sdk

# @zama-fhe/react-sdk

## Functions

### configureLogger()

> **configureLogger**(`options`): `void`

Defined in: [internal/logger.ts:69](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/logger.ts#L69)

Configure the logger.

#### Parameters

##### options

`Partial`\<`LoggerConfig`\>

#### Returns

`void`

#### Example

```ts
import { configureLogger } from '@zama-fhe/react-sdk';

// Enable debug logging in production
configureLogger({ enabled: true });

// Change prefix
configureLogger({ prefix: '[my-app]' });
```

***

### createFhevmConfig()

> **createFhevmConfig**(`options`): [`FhevmConfig`](#fhevmconfig)

Defined in: [config.ts:133](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L133)

Create an FhevmConfig for use with FhevmProvider.
Similar to wagmi's createConfig but for FHE operations.

#### Parameters

##### options

[`FhevmConfigOptions`](#fhevmconfigoptions)

#### Returns

[`FhevmConfig`](#fhevmconfig)

#### Example

```ts
import { createFhevmConfig, sepolia, hardhatLocal } from '@zama-fhe/react-sdk'

const config = createFhevmConfig({
  chains: [sepolia, hardhatLocal],
})
```

***

### createFhevmInstance()

> **createFhevmInstance**(`parameters`): `Promise`\<`FhevmInstance`\>

Defined in: [internal/fhevm.ts:152](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L152)

#### Parameters

##### parameters

###### apiKey?

`string`

API key for relayer authentication (required for v0.4.0+)

###### mockChains?

`Record`\<`number`, `string`\>

###### onStatusChange?

(`status`) => `void`

###### provider

`string` \| [`Eip1193Provider`](#eip1193provider)

###### signal

`AbortSignal`

#### Returns

`Promise`\<`FhevmInstance`\>

***

### createFhevmInstanceAdapter()

> **createFhevmInstanceAdapter**(`instance`, `chainId`): [`IFhevmInstanceAdapter`](#ifhevminstanceadapter)

Defined in: [internal/FhevmInstanceAdapter.ts:207](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L207)

Create an adapter from a FhevmInstance.

#### Parameters

##### instance

`FhevmInstance`

The FhevmInstance to wrap

##### chainId

`number`

The chain ID the instance is configured for

#### Returns

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter)

***

### createFhevmQueryClient()

> **createFhevmQueryClient**(`options?`): `QueryClient`

Defined in: [react/queryClient.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/queryClient.ts#L36)

Creates a new QueryClient with custom options.
Use this if you need different caching behavior.

#### Parameters

##### options?

`QueryClientConfig`

#### Returns

`QueryClient`

***

### createHardhatChain()

> **createHardhatChain**(`options`): [`FhevmMockChain`](#fhevmmockchain)

Defined in: [chains/hardhat.ts:29](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/hardhat.ts#L29)

Create a custom hardhat chain with a different RPC URL.
Useful for remote hardhat nodes or custom ports.

#### Parameters

##### options

###### id?

`number`

###### name?

`string`

###### rpcUrl

`string`

#### Returns

[`FhevmMockChain`](#fhevmmockchain)

#### Example

```ts
const customHardhat = createHardhatChain({
  rpcUrl: 'http://192.168.1.100:8545'
})
```

***

### createLocalStorageAdapter()

> **createLocalStorageAdapter**(`prefix`): [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:152](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L152)

Create a custom storage adapter with a prefix.
Useful for isolating different apps or environments.

#### Parameters

##### prefix

`string`

#### Returns

[`GenericStringStorage`](#genericstringstorage)

***

### createMemoryStorage()

> **createMemoryStorage**(): [`FhevmStorage`](#fhevmstorage)

Defined in: [config.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L26)

Create an in-memory storage implementation.
Useful for testing or when localStorage is not available.

#### Returns

[`FhevmStorage`](#fhevmstorage)

***

### createSessionStorageAdapter()

> **createSessionStorageAdapter**(`prefix`): [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:159](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L159)

Create a custom session storage adapter with a prefix.

#### Parameters

##### prefix

`string`

#### Returns

[`GenericStringStorage`](#genericstringstorage)

***

### createStorage()

> **createStorage**(`options?`): [`FhevmStorage`](#fhevmstorage)

Defined in: [config.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L42)

Create a storage wrapper around a Web Storage API compliant object.

#### Parameters

##### options?

###### key?

`string`

###### storage?

`Storage`

#### Returns

[`FhevmStorage`](#fhevmstorage)

***

### defineChain()

> **defineChain**\<`T`\>(`chain`): `T`

Defined in: [chains/defineChain.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/defineChain.ts#L20)

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

Defined in: [chains/defineChain.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/defineChain.ts#L28)

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

Defined in: [chains/defineChain.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/defineChain.ts#L38)

Helper to define a production chain with full FHE infrastructure.

#### Parameters

##### chain

`Omit`\<[`FhevmProductionChain`](#fhevmproductionchain), `"isMock"`\>

#### Returns

[`FhevmProductionChain`](#fhevmproductionchain)

***

### FhevmProvider()

> **FhevmProvider**(`__namedParameters`): `ReactElement`

Defined in: [react/FhevmProvider.tsx:227](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L227)

#### Parameters

##### \_\_namedParameters

[`FhevmProviderProps`](#fhevmproviderprops)

#### Returns

`ReactElement`

***

### formatConfidentialAmount()

> **formatConfidentialAmount**(`amount`, `decimals`, `maxDisplayDecimals?`): `string`

Defined in: [utils/format.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/utils/format.ts#L10)

Format a bigint token amount with decimals for display.

#### Parameters

##### amount

`bigint`

##### decimals

`number`

##### maxDisplayDecimals?

`number` = `6`

#### Returns

`string`

#### Example

```ts
formatConfidentialAmount(4000000n, 6)   // "4"
formatConfidentialAmount(1500000n, 6)   // "1.5"
formatConfidentialAmount(123n, 6)       // "0.000123"
formatConfidentialAmount(0n, 6)         // "0"
```

***

### getLoggerConfig()

> **getLoggerConfig**(): `Readonly`\<`LoggerConfig`\>

Defined in: [internal/logger.ts:76](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/logger.ts#L76)

Get the current logger configuration.

#### Returns

`Readonly`\<`LoggerConfig`\>

***

### getPublicKeyStorageType()

> **getPublicKeyStorageType**(): `StorageType`

Defined in: [internal/PublicKeyStorage.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/PublicKeyStorage.ts#L47)

Get the current storage type being used.

#### Returns

`StorageType`

***

### isFhevmInstanceAdapter()

> **isFhevmInstanceAdapter**(`obj`): `obj is IFhevmInstanceAdapter`

Defined in: [internal/FhevmInstanceAdapter.ts:217](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L217)

Type guard to check if an object implements IFhevmInstanceAdapter.

#### Parameters

##### obj

`unknown`

#### Returns

`obj is IFhevmInstanceAdapter`

***

### isFhevmWindowType()

> **isFhevmWindowType**(`win`, `trace?`): `win is FhevmWindowType`

Defined in: [internal/RelayerSDKLoader.ts:299](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L299)

#### Parameters

##### win

`unknown`

##### trace?

`TraceType`

#### Returns

`win is FhevmWindowType`

***

### isMockChain()

> **isMockChain**(`chain`): `chain is FhevmMockChain`

Defined in: [chains/types.ts:51](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L51)

Type guard to check if a chain is a mock chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmMockChain`

***

### isProductionChain()

> **isProductionChain**(`chain`): `chain is FhevmProductionChain`

Defined in: [chains/types.ts:58](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L58)

Type guard to check if a chain is a production chain

#### Parameters

##### chain

[`FhevmChain`](#fhevmchain)

#### Returns

`chain is FhevmProductionChain`

***

### publicKeyStorageGet()

> **publicKeyStorageGet**(`aclAddress`): `Promise`\<\{ `publicKey?`: `FhevmPublicKeyType`; `publicParams?`: `FhevmPkeCrsByCapacityType`; \}\>

Defined in: [internal/PublicKeyStorage.ts:163](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/PublicKeyStorage.ts#L163)

#### Parameters

##### aclAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{ `publicKey?`: `FhevmPublicKeyType`; `publicParams?`: `FhevmPkeCrsByCapacityType`; \}\>

***

### publicKeyStorageSet()

> **publicKeyStorageSet**(`aclAddress`, `publicKey`, `publicParams`): `Promise`\<`void`\>

Defined in: [internal/PublicKeyStorage.ts:223](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/PublicKeyStorage.ts#L223)

#### Parameters

##### aclAddress

`` `0x${string}` ``

##### publicKey

`FhevmStoredPublicKey` | `null`

##### publicParams

`FhevmStoredPublicParams` | `null`

#### Returns

`Promise`\<`void`\>

***

### useConfidentialBalances()

> **useConfidentialBalances**(`options`): [`UseConfidentialBalancesReturn`](#useconfidentialbalancesreturn)

Defined in: [react/useConfidentialBalances.ts:77](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useConfidentialBalances.ts#L77)

Hook for reading encrypted balance handles from multiple ERC7984 contracts in parallel.

Follows wagmi's `useReadContracts` pattern — accepts an array of contract configs
and returns per-item results.

When `decrypt: true` is set, automatically composes `useUserDecrypt` and
`useUserDecryptedValues` internally so consumers get cleartext values without
manual wiring.

#### Parameters

##### options

[`UseConfidentialBalancesOptions`](#useconfidentialbalancesoptions)

#### Returns

[`UseConfidentialBalancesReturn`](#useconfidentialbalancesreturn)

#### Examples

```tsx
const { data, isLoading, refetch } = useConfidentialBalances({
  contracts: [
    { contractAddress: tokenA },
    { contractAddress: tokenB },
    { contractAddress: tokenC, account: otherAddress },
  ],
});
// data[0].result — handle for tokenA balance
// data[1].result — handle for tokenB balance
// data[2].result — handle for tokenC balance (for otherAddress)
```

```tsx
// With auto-decryption
const { data, decryptAll, isDecrypting, isAllDecrypted } = useConfidentialBalances({
  contracts: [{ contractAddress: tokenA }],
  decrypt: true,
});
// data[0].decryptedValue — cleartext value after decryptAll() is called
```

***

### useConfidentialTransfer()

> **useConfidentialTransfer**(`options`): [`UseConfidentialTransferReturn`](#useconfidentialtransferreturn)

Defined in: [react/useConfidentialTransfer.ts:88](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useConfidentialTransfer.ts#L88)

Hook for executing confidential ERC7984 token transfers.

Now powered by TanStack Query's `useMutation` for automatic state management,
request deduplication, and devtools integration.

Encapsulates the full flow of:
1. Encrypting the transfer amount
2. Signing and submitting the transaction
3. Waiting for confirmation

#### Parameters

##### options

[`UseConfidentialTransferOptions`](#useconfidentialtransferoptions)

#### Returns

[`UseConfidentialTransferReturn`](#useconfidentialtransferreturn)

#### Example

```tsx
function TransferForm({ tokenAddress }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const {
    transfer,
    status,
    isEncrypting,
    isPending,
    error
  } = useConfidentialTransfer({
    contractAddress: tokenAddress,
    onSuccess: (hash) => {
      console.log("Transfer successful:", hash);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await transfer(to as `0x${string}`, BigInt(amount));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={to} onChange={e => setTo(e.target.value)} placeholder="Recipient" />
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
      <button disabled={isPending}>
        {isEncrypting ? "Encrypting..." : isPending ? "Transferring..." : "Transfer"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

***

### useEncrypt()

> **useEncrypt**(): [`UseEncryptReturn`](#useencryptreturn)

Defined in: [react/useEncrypt.ts:152](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEncrypt.ts#L152)

Hook for encrypting values for FHE contract calls.

Provides type-safe encryption with compile-time checking of value types.
Returns a tuple for easy destructuring into handles and proof.

Now uses TanStack Query's useMutation internally for DevTools visibility
and tracking, while maintaining the same external API.

#### Returns

[`UseEncryptReturn`](#useencryptreturn)

#### Example

```tsx
function TransferForm({ contractAddress }) {
  const { encrypt, isReady } = useEncrypt();

  const handleTransfer = async (amount: bigint, recipient: `0x${string}`) => {
    if (!isReady) return;

    const [amountHandle, recipientHandle, proof] = await encrypt([
      { type: 'uint64', value: amount },
      { type: 'address', value: recipient },
    ], contractAddress);

    if (!amountHandle) return;

    writeContract({
      address: contractAddress,
      abi: tokenAbi,
      functionName: 'transfer',
      args: [amountHandle, recipientHandle, proof],
    });
  };

  return (
    <button onClick={() => handleTransfer(100n, '0x...')} disabled={!isReady}>
      Transfer
    </button>
  );
}
```

***

### ~~useEthersSigner()~~

> **useEthersSigner**(): [`UseEthersSignerReturn`](#useetherssignerreturn)

Defined in: [react/useEthersSigner.ts:69](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L69)

Hook to get an ethers signer from the FhevmProvider context provider.

Uses the EIP-1193 provider from FhevmContext (falling back to window.ethereum)
and the connected wallet address to create an ethers JsonRpcSigner.

#### Returns

[`UseEthersSignerReturn`](#useetherssignerreturn)

#### Examples

```tsx
function SignMessage() {
  const { signer, isReady, isLoading, error } = useEthersSigner()

  const handleSign = async () => {
    if (!signer) return
    const signature = await signer.signMessage('Hello!')
    console.log(signature)
  }

  if (isLoading) return <p>Loading signer...</p>
  if (error) return <p>Error: {error.message}</p>
  if (!isReady) return <p>Connect your wallet</p>

  return <button onClick={handleSign}>Sign Message</button>
}
```

```tsx
// Use with ethers contracts
function ContractInteraction() {
  const { signer, isReady } = useEthersSigner()

  const sendTransaction = async () => {
    if (!signer) return

    const contract = new ethers.Contract(address, abi, signer)
    await contract.someFunction()
  }
}
```

***

### useFhevmClient()

> **useFhevmClient**(): [`UseFhevmClientReturn`](#usefhevmclientreturn)

Defined in: [react/useFhevmClient.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L49)

Hook to get direct access to the FHEVM instance.

Use this for advanced operations or when building custom hooks.
For most use cases, prefer useEncrypt and useUserDecrypt hooks.

#### Returns

[`UseFhevmClientReturn`](#usefhevmclientreturn)

#### Example

```tsx
function MyComponent() {
  const { instance, isReady, refresh } = useFhevmClient()

  if (!isReady) return <div>Not ready</div>

  // Use instance directly for advanced operations
  const publicKey = instance.getPublicKey()

  return (
    <div>
      <button onClick={refresh}>Refresh Instance</button>
    </div>
  )
}
```

***

### useFhevmStatus()

> **useFhevmStatus**(): [`UseFhevmStatusReturn`](#usefhevmstatusreturn)

Defined in: [react/useFhevmStatus.ts:45](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L45)

Hook to get the current FHEVM status.

#### Returns

[`UseFhevmStatusReturn`](#usefhevmstatusreturn)

#### Example

```tsx
function MyComponent() {
  const { isReady, isInitializing, error } = useFhevmStatus()

  if (isInitializing) return <div>Initializing FHE...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!isReady) return <div>Connect your wallet</div>

  return <div>FHE Ready!</div>
}
```

***

### usePublicDecrypt()

> **usePublicDecrypt**(`params`): [`UsePublicDecryptReturn`](#usepublicdecryptreturn)

Defined in: [react/usePublicDecrypt.ts:149](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L149)

Hook for public decryption of FHE encrypted values.

Public decryption reveals values to everyone - use this when:
- The value should be visible on-chain (e.g., auction results)
- You need to pass decrypted values to a contract callback
- No user-specific privacy is required

**Important:** Values must be marked as publicly decryptable on-chain
using `FHE.makePubliclyDecryptable(handle)` before calling this hook.

#### Parameters

##### params

[`PublicDecryptParams`](#publicdecryptparams) | `undefined`

#### Returns

[`UsePublicDecryptReturn`](#usepublicdecryptreturn)

#### Examples

```tsx
// Basic usage
function AuctionResult({ handles }) {
  const { decrypt, clearValues, isDecrypting, canDecrypt } = usePublicDecrypt({
    handles
  });

  return (
    <div>
      <p>Winner: {clearValues[handles[0]]?.toString() ?? 'Hidden'}</p>
      <button onClick={decrypt} disabled={!canDecrypt}>
        {isDecrypting ? 'Revealing...' : 'Reveal Result'}
      </button>
    </div>
  );
}
```

```tsx
// With contract callback
function RevealAndCallback({ handles, contractAddress }) {
  const { decryptAsync, canDecrypt } = usePublicDecrypt({ handles });
  const { writeContract } = useWriteContract();

  const handleReveal = async () => {
    const result = await decryptAsync();
    if (!result) return;

    // Call contract with proof
    await writeContract({
      address: contractAddress,
      abi: myContractAbi,
      functionName: 'callbackDecrypt',
      args: [
        handles,
        result.abiEncodedClearValues,
        result.decryptionProof
      ]
    });
  };

  return (
    <button onClick={handleReveal} disabled={!canDecrypt}>
      Reveal & Submit
    </button>
  );
}
```

***

### useShield()

> **useShield**(`options`): [`UseShieldReturn`](#useshieldreturn)

Defined in: [react/useShield.ts:83](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useShield.ts#L83)

Hook for shielding ERC20 tokens into confidential ERC7984 tokens.

Now powered by TanStack Query's `useMutation` for automatic state management.

Handles the full flow:
1. Check ERC20 allowance for the wrapper contract
2. Approve if needed (prompts wallet signature)
3. Call wrap() to convert ERC20 → ERC7984
4. Wait for confirmation

#### Parameters

##### options

[`UseShieldOptions`](#useshieldoptions)

#### Returns

[`UseShieldReturn`](#useshieldreturn)

#### Example

```tsx
function ShieldForm({ wrapperAddress }) {
  const [amount, setAmount] = useState("");

  const {
    shield,
    status,
    isApproving,
    isWrapping,
    isPending,
    error,
    allowance,
  } = useShield({
    wrapperAddress,
    onSuccess: (hash) => console.log("Shielded!", hash),
  });

  const handleSubmit = async () => {
    await shield(BigInt(amount));
  };

  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isApproving ? "Approving..." : isWrapping ? "Wrapping..." : "Shield"}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

***

### useSignature()

> **useSignature**(`options`): [`UseSignatureReturn`](#usesignaturereturn)

Defined in: [react/useSignature.ts:64](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L64)

Hook for querying cached decryption signatures from storage.

This hook uses TanStack Query to reactively load and cache decryption signatures
from GenericStringStorage. It does NOT create new signatures (that happens during
the decrypt mutation). This is useful for:

1. Auto-decryption: Check if signature exists to avoid wallet popup
2. Reactive updates: Know when signature becomes available
3. Cache coordination: Share signature state across components

#### Parameters

##### options

[`UseSignatureOptions`](#usesignatureoptions)

#### Returns

[`UseSignatureReturn`](#usesignaturereturn)

#### Example

```tsx
const { isSignatureCached, signature } = useSignature({
  contractAddresses: ['0x123...', '0x456...'],
});

if (isSignatureCached) {
  // Auto-decrypt without wallet popup
  decryptAll();
}
```

***

### useUnshield()

> **useUnshield**(`options`): [`UseUnshieldReturn`](#useunshieldreturn)

Defined in: [react/useUnshield.ts:92](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUnshield.ts#L92)

Hook for unshielding confidential ERC7984 tokens back to ERC20.

Now powered by TanStack Query's `useMutation` for automatic state management.

Handles the complete flow:
1. Encrypt the amount using FHE
2. Call unwrap(from, to, encryptedAmount, inputProof) - burns confidential tokens
3. Wait for transaction confirmation
4. Request public decryption of the burnt amount
5. Call finalizeUnwrap() with the decryption proof - releases ERC20 tokens

#### Parameters

##### options

[`UseUnshieldOptions`](#useunshieldoptions)

#### Returns

[`UseUnshieldReturn`](#useunshieldreturn)

#### Example

```tsx
function UnshieldForm({ wrapperAddress }) {
  const [amount, setAmount] = useState("");

  const {
    unshield,
    status,
    isEncrypting,
    isSigning,
    isDecrypting,
    isFinalizing,
    isPending,
    error,
  } = useUnshield({
    wrapperAddress,
    onSuccess: (hash) => console.log("Unshield complete!", hash),
  });

  const handleSubmit = async () => {
    await unshield(BigInt(amount));
  };

  return (
    <div>
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        {isEncrypting ? "Encrypting..." :
         isSigning ? "Sign in wallet..." :
         isDecrypting ? "Getting proof..." :
         isFinalizing ? "Finalizing..." :
         "Unshield"}
      </button>
      {error && <p>{error.message}</p>}
    </div>
  );
}
```

***

### useUserDecrypt()

> **useUserDecrypt**(`requestsOrParams`): [`UseDecryptReturn`](#usedecryptreturn)

Defined in: [react/useUserDecrypt.ts:124](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L124)

Hook for decrypting FHE encrypted values using TanStack Query mutations.

Uses EIP-1193 provider for signing (no ethers.js dependency).
Storage must be provided via FhevmProvider to cache signatures.

Supports two usage patterns:

**Simple single-handle (recommended):**
```tsx
const { decrypt, isDecrypting, results } = useUserDecrypt({
  handle: balanceHandle,
  contractAddress: '0x...'
})
```

**Batch decryption:**
```tsx
const { decrypt, results } = useUserDecrypt([
  { handle: handle1, contractAddress },
  { handle: handle2, contractAddress }
])
```

#### Parameters

##### requestsOrParams

[`DecryptParams`](#decryptparams) | readonly [`DecryptRequest`](#decryptrequest)[] | `undefined`

#### Returns

[`UseDecryptReturn`](#usedecryptreturn)

#### Example

```tsx
function BalanceDisplay({ handle, contractAddress }) {
  const { results, decrypt, isDecrypting, canDecrypt } = useUserDecrypt({
    handle,
    contractAddress
  })

  const balance = handle ? results[handle] : undefined

  return (
    <div>
      <p>Balance: {balance?.toString() ?? 'Encrypted'}</p>
      <button onClick={decrypt} disabled={!canDecrypt}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
    </div>
  )
}
```

***

### useUserDecryptedValue()

> **useUserDecryptedValue**(`handle`, `contractAddress`): [`UseDecryptedValueReturn`](#usedecryptedvaluereturn)

Defined in: [react/useUserDecryptedValue.ts:80](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L80)

Hook for reading cached decrypted values without triggering new decryption.

This hook provides a read-only view of the decryption cache populated by
useUserDecrypt. It's useful for:
- Displaying previously decrypted values
- Checking if a value has been decrypted before
- Avoiding redundant decryption operations

Note: This hook does NOT trigger decryption. To decrypt values,
use the useUserDecrypt hook instead.

#### Parameters

##### handle

The encrypted handle to look up, or undefined

`string` | `undefined`

##### contractAddress

The contract address, or undefined

`` `0x${string}` `` | `undefined`

#### Returns

[`UseDecryptedValueReturn`](#usedecryptedvaluereturn)

#### Examples

```tsx
function CachedBalance({ handle, contractAddress }) {
  const { data, isCached } = useUserDecryptedValue(handle, contractAddress)

  if (!isCached) {
    return <p>Value not decrypted yet</p>
  }

  return <p>Cached balance: {data?.toString()}</p>
}
```

```tsx
// Use with useUserDecrypt for a complete flow
function Balance({ handle, contractAddress }) {
  const { data: signer } = useEthersSigner()
  const { isCached, data: cachedValue } = useUserDecryptedValue(handle, contractAddress)
  const { decrypt, isDecrypting, canDecrypt } = useUserDecrypt(
    handle && !isCached ? [{ handle, contractAddress }] : undefined,
    signer
  )

  // Show cached value if available
  if (isCached) {
    return <p>Balance: {cachedValue?.toString()}</p>
  }

  return (
    <div>
      <p>Balance: Encrypted</p>
      <button onClick={decrypt} disabled={!canDecrypt || isDecrypting}>
        {isDecrypting ? 'Decrypting...' : 'Decrypt'}
      </button>
    </div>
  )
}
```

***

### useUserDecryptedValues()

> **useUserDecryptedValues**(`handles`): `object`

Defined in: [react/useUserDecryptedValue.ts:130](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L130)

Hook for reading multiple cached decrypted values at once.

#### Parameters

##### handles

Array of { handle, contractAddress } to look up

readonly `object`[] | `undefined`

#### Returns

`object`

##### allCached

> **allCached**: `boolean`

##### cachedCount

> **cachedCount**: `number`

##### values

> **values**: (`string` \| `bigint` \| `boolean` \| `undefined`)[]

#### Example

```tsx
function TokenBalances({ tokens }) {
  const cached = useUserDecryptedValues(
    tokens.map(t => ({ handle: t.handle, contractAddress: t.address }))
  )

  return (
    <ul>
      {tokens.map((token, i) => (
        <li key={token.handle}>
          {token.name}: {cached.values[i]?.toString() ?? 'Encrypted'}
        </li>
      ))}
    </ul>
  )
}
```

***

### useWalletOrSigner()

> **useWalletOrSigner**(): [`WalletActions`](#walletactions)

Defined in: [react/useWalletOrSigner.ts:74](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L74)

Bridge hook that returns a unified WalletActions interface.

- If `wallet` is available in context → uses wallet directly + RPC for reads/receipts
- Otherwise → falls back to useEthersSigner (ethers.js path)

This allows hooks to be migrated incrementally without duplicating logic.

#### Returns

[`WalletActions`](#walletactions)

## Classes

### FhevmAbortError

Defined in: [internal/fhevm.ts:66](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L66)

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new FhevmAbortError**(`message?`): [`FhevmAbortError`](#fhevmaborterror)

Defined in: [internal/fhevm.ts:67](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L67)

###### Parameters

###### message?

`string` = `"FHEVM operation was cancelled"`

###### Returns

[`FhevmAbortError`](#fhevmaborterror)

###### Overrides

`Error.constructor`

***

### FhevmDecryptionSignature

Defined in: [FhevmDecryptionSignature.ts:148](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L148)

#### Accessors

##### contractAddresses

###### Get Signature

> **get** **contractAddresses**(): `` `0x${string}` ``[]

Defined in: [FhevmDecryptionSignature.ts:184](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L184)

###### Returns

`` `0x${string}` ``[]

##### durationDays

###### Get Signature

> **get** **durationDays**(): `number`

Defined in: [FhevmDecryptionSignature.ts:192](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L192)

###### Returns

`number`

##### privateKey

###### Get Signature

> **get** **privateKey**(): `string`

Defined in: [FhevmDecryptionSignature.ts:172](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L172)

###### Returns

`string`

##### publicKey

###### Get Signature

> **get** **publicKey**(): `string`

Defined in: [FhevmDecryptionSignature.ts:176](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L176)

###### Returns

`string`

##### signature

###### Get Signature

> **get** **signature**(): `string`

Defined in: [FhevmDecryptionSignature.ts:180](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L180)

###### Returns

`string`

##### startTimestamp

###### Get Signature

> **get** **startTimestamp**(): `number`

Defined in: [FhevmDecryptionSignature.ts:188](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L188)

###### Returns

`number`

##### userAddress

###### Get Signature

> **get** **userAddress**(): `` `0x${string}` ``

Defined in: [FhevmDecryptionSignature.ts:196](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L196)

###### Returns

`` `0x${string}` ``

#### Methods

##### equals()

> **equals**(`s`): `boolean`

Defined in: [FhevmDecryptionSignature.ts:305](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L305)

###### Parameters

###### s

[`FhevmDecryptionSignatureType`](#fhevmdecryptionsignaturetype)

###### Returns

`boolean`

##### isValid()

> **isValid**(): `boolean`

Defined in: [FhevmDecryptionSignature.ts:309](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L309)

###### Returns

`boolean`

##### saveToGenericStringStorage()

> **saveToGenericStringStorage**(`storage`, `instance`, `withPublicKey`): `Promise`\<`void`\>

Defined in: [FhevmDecryptionSignature.ts:313](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L313)

###### Parameters

###### storage

[`GenericStringStorage`](#genericstringstorage)

###### instance

`FhevmInstance`

###### withPublicKey

`boolean`

###### Returns

`Promise`\<`void`\>

##### toJSON()

> **toJSON**(): `object`

Defined in: [FhevmDecryptionSignature.ts:247](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L247)

###### Returns

`object`

###### contractAddresses

> **contractAddresses**: `` `0x${string}` ``[]

###### durationDays

> **durationDays**: `number`

###### eip712

> **eip712**: [`EIP712Type`](#eip712type)

###### privateKey

> **privateKey**: `string`

###### publicKey

> **publicKey**: `string`

###### signature

> **signature**: `string`

###### startTimestamp

> **startTimestamp**: `number`

###### userAddress

> **userAddress**: `` `0x${string}` ``

##### checkIs()

> `static` **checkIs**(`s`): `s is FhevmDecryptionSignatureType`

Defined in: [FhevmDecryptionSignature.ts:205](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L205)

Type guard to check if an unknown value is a valid FhevmDecryptionSignatureType.

###### Parameters

###### s

`unknown`

Value to check

###### Returns

`s is FhevmDecryptionSignatureType`

True if the value is a valid signature type

##### fromJSON()

> `static` **fromJSON**(`json`): [`FhevmDecryptionSignature`](#fhevmdecryptionsignature)

Defined in: [FhevmDecryptionSignature.ts:266](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L266)

Deserialize a FhevmDecryptionSignature from JSON.

###### Parameters

###### json

`unknown`

JSON string or parsed object

###### Returns

[`FhevmDecryptionSignature`](#fhevmdecryptionsignature)

FhevmDecryptionSignature instance

###### Throws

TypeError if the JSON is invalid or doesn't match the expected schema

##### loadFromGenericStringStorage()

> `static` **loadFromGenericStringStorage**(`storage`, `instance`, `contractAddresses`, `userAddress`, `publicKey?`): `Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

Defined in: [FhevmDecryptionSignature.ts:342](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L342)

###### Parameters

###### storage

[`GenericStringStorage`](#genericstringstorage)

###### instance

`FhevmInstance`

###### contractAddresses

`string`[]

###### userAddress

`string`

###### publicKey?

`string`

###### Returns

`Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

##### loadOrSign()

> `static` **loadOrSign**(`instance`, `contractAddresses`, `signer`, `storage`, `keyPair?`): `Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

Defined in: [FhevmDecryptionSignature.ts:458](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L458)

Load a cached signature or create a new one.
Uses EIP-1193 provider for signing.

###### Parameters

###### instance

`FhevmInstance`

###### contractAddresses

`string`[]

###### signer

[`SignerParams`](#signerparams)

###### storage

[`GenericStringStorage`](#genericstringstorage)

###### keyPair?

###### privateKey

`string`

###### publicKey

`string`

###### Returns

`Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

##### new()

> `static` **new**(`instance`, `contractAddresses`, `publicKey`, `privateKey`, `signer`): `Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

Defined in: [FhevmDecryptionSignature.ts:391](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L391)

Create a new decryption signature using EIP-1193 provider.

###### Parameters

###### instance

`FhevmInstance`

###### contractAddresses

`string`[]

###### publicKey

`string`

###### privateKey

`string`

###### signer

[`SignerParams`](#signerparams)

###### Returns

`Promise`\<[`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null`\>

***

### FhevmInstanceAdapter

Defined in: [internal/FhevmInstanceAdapter.ts:125](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L125)

Default adapter implementation that wraps the relayer-sdk FhevmInstance.

#### Implements

- [`IFhevmInstanceAdapter`](#ifhevminstanceadapter)

#### Accessors

##### rawInstance

###### Get Signature

> **get** **rawInstance**(): `FhevmInstance`

Defined in: [internal/FhevmInstanceAdapter.ts:138](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L138)

Get the underlying FhevmInstance.
Use sparingly - prefer using adapter methods for better abstraction.

###### Returns

`FhevmInstance`

#### Constructors

##### Constructor

> **new FhevmInstanceAdapter**(`instance`, `chainId`): [`FhevmInstanceAdapter`](#fhevminstanceadapter)

Defined in: [internal/FhevmInstanceAdapter.ts:129](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L129)

###### Parameters

###### instance

`FhevmInstance`

###### chainId

`number`

###### Returns

[`FhevmInstanceAdapter`](#fhevminstanceadapter)

#### Methods

##### createEIP712()

> **createEIP712**(`publicKey`, `contractAddresses`, `startTimestamp`, `durationDays`): [`DecryptionEIP712Data`](#decryptioneip712data)

Defined in: [internal/FhevmInstanceAdapter.ts:152](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L152)

Create EIP-712 typed data for user decryption authorization.

###### Parameters

###### publicKey

`string`

The user's public key for decryption (hex string)

###### contractAddresses

`string`[]

Contract addresses authorized for decryption

###### startTimestamp

`number`

Unix timestamp when the authorization starts (seconds)

###### durationDays

`number`

Number of days the authorization is valid

###### Returns

[`DecryptionEIP712Data`](#decryptioneip712data)

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`createEIP712`](#createeip712-1)

##### createEncryptedInput()

> **createEncryptedInput**(`contractAddress`, `userAddress`): [`EncryptedInputBuilder`](#encryptedinputbuilder)

Defined in: [internal/FhevmInstanceAdapter.ts:142](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L142)

Create an encrypted input builder for the given contract and user.

###### Parameters

###### contractAddress

`` `0x${string}` ``

The contract that will receive the encrypted input

###### userAddress

`` `0x${string}` ``

The user's wallet address

###### Returns

[`EncryptedInputBuilder`](#encryptedinputbuilder)

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`createEncryptedInput`](#createencryptedinput-1)

##### getChainId()

> **getChainId**(): `number`

Defined in: [internal/FhevmInstanceAdapter.ts:193](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L193)

Get the chain ID this instance is configured for.

###### Returns

`number`

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`getChainId`](#getchainid-1)

##### publicDecrypt()

> **publicDecrypt**(`handles`): `Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

Defined in: [internal/FhevmInstanceAdapter.ts:189](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L189)

Decrypt values using public (on-chain) decryption.

###### Parameters

###### handles

`string`[]

Array of encrypted value handles to decrypt

###### Returns

`Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`publicDecrypt`](#publicdecrypt-1)

##### supportsMethod()

> **supportsMethod**(`methodName`): `boolean`

Defined in: [internal/FhevmInstanceAdapter.ts:197](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L197)

Check if the instance supports a specific method.
Useful for feature detection.

###### Parameters

###### methodName

`string`

###### Returns

`boolean`

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`supportsMethod`](#supportsmethod-1)

##### userDecrypt()

> **userDecrypt**(`requests`, `privateKey`, `publicKey`, `signature`, `contractAddresses`, `userAddress`, `startTimestamp`, `durationDays`): `Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

Defined in: [internal/FhevmInstanceAdapter.ts:167](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L167)

Decrypt values using user authorization.

###### Parameters

###### requests

`HandleContractPair`[]

Array of handle/contract pairs to decrypt

###### privateKey

`string`

User's private key for decryption (hex string)

###### publicKey

`string`

User's public key for decryption (hex string)

###### signature

`string`

EIP-712 signature authorizing decryption

###### contractAddresses

`` `0x${string}` ``[]

Authorized contract addresses

###### userAddress

`` `0x${string}` ``

User's wallet address

###### startTimestamp

`number`

Authorization start timestamp (seconds)

###### durationDays

`number`

Authorization duration in days

###### Returns

`Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

###### Implementation of

[`IFhevmInstanceAdapter`](#ifhevminstanceadapter).[`userDecrypt`](#userdecrypt-1)

***

### FhevmReactError

Defined in: [internal/fhevm.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L22)

#### Extends

- `Error`

#### Constructors

##### Constructor

> **new FhevmReactError**(`code`, `message?`, `options?`): [`FhevmReactError`](#fhevmreacterror)

Defined in: [internal/fhevm.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L24)

###### Parameters

###### code

`string`

###### message?

`string`

###### options?

`ErrorOptions`

###### Returns

[`FhevmReactError`](#fhevmreacterror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> **code**: `string`

Defined in: [internal/fhevm.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevm.ts#L23)

***

### GenericStringInMemoryStorage

Defined in: [storage/GenericStringStorage.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L7)

#### Implements

- [`GenericStringStorage`](#genericstringstorage)

#### Constructors

##### Constructor

> **new GenericStringInMemoryStorage**(): [`GenericStringInMemoryStorage`](#genericstringinmemorystorage)

###### Returns

[`GenericStringInMemoryStorage`](#genericstringinmemorystorage)

#### Methods

##### getItem()

> **getItem**(`key`): `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [storage/GenericStringStorage.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L10)

###### Parameters

###### key

`string`

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

###### Implementation of

[`GenericStringStorage`](#genericstringstorage).[`getItem`](#getitem-2)

##### removeItem()

> **removeItem**(`key`): `void` \| `Promise`\<`void`\>

Defined in: [storage/GenericStringStorage.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L16)

###### Parameters

###### key

`string`

###### Returns

`void` \| `Promise`\<`void`\>

###### Implementation of

[`GenericStringStorage`](#genericstringstorage).[`removeItem`](#removeitem-2)

##### setItem()

> **setItem**(`key`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [storage/GenericStringStorage.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L13)

###### Parameters

###### key

`string`

###### value

`string`

###### Returns

`void` \| `Promise`\<`void`\>

###### Implementation of

[`GenericStringStorage`](#genericstringstorage).[`setItem`](#setitem-2)

***

### RelayerSDKLoader

Defined in: [internal/RelayerSDKLoader.ts:67](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L67)

#### Constructors

##### Constructor

> **new RelayerSDKLoader**(`options?`): [`RelayerSDKLoader`](#relayersdkloader)

Defined in: [internal/RelayerSDKLoader.ts:77](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L77)

###### Parameters

###### options?

[`RelayerSDKLoaderOptions`](#relayersdkloaderoptions) = `{}`

###### Returns

[`RelayerSDKLoader`](#relayersdkloader)

#### Methods

##### isLoaded()

> **isLoaded**(): `boolean`

Defined in: [internal/RelayerSDKLoader.ts:89](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L89)

###### Returns

`boolean`

##### load()

> **load**(): `Promise`\<`void`\>

Defined in: [internal/RelayerSDKLoader.ts:101](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L101)

Load the Relayer SDK with automatic retry on failure.
Uses exponential backoff with jitter between retry attempts.
If a fallback URL is configured and the primary CDN fails, it will try the fallback.

###### Returns

`Promise`\<`void`\>

## Interfaces

### ConfidentialBalanceConfig

Defined in: [types/balance.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L7)

#### Properties

##### abi?

> `optional` **abi**: `InterfaceAbi`

Defined in: [types/balance.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L10)

##### account?

> `optional` **account**: `` `0x${string}` ``

Defined in: [types/balance.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L9)

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [types/balance.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L8)

***

### ConfidentialBalanceResult

Defined in: [types/balance.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L13)

#### Properties

##### decryptedValue?

> `optional` **decryptedValue**: [`DecryptedValue`](#decryptedvalue-1)

Defined in: [types/balance.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L18)

Populated when `decrypt: true` and decryption has completed for this handle

##### error

> **error**: `Error` \| `undefined`

Defined in: [types/balance.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L16)

##### result

> **result**: `` `0x${string}` `` \| `undefined`

Defined in: [types/balance.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L14)

##### status

> **status**: `"success"` \| `"failure"` \| `"pending"`

Defined in: [types/balance.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L15)

***

### DecryptionEIP712Data

Defined in: [internal/FhevmInstanceAdapter.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L38)

EIP-712 typed data structure for decryption authorization.

#### Properties

##### domain

> **domain**: `object`

Defined in: [internal/FhevmInstanceAdapter.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L39)

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

Defined in: [internal/FhevmInstanceAdapter.ts:45](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L45)

##### primaryType

> **primaryType**: `string`

Defined in: [internal/FhevmInstanceAdapter.ts:46](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L46)

##### types

> **types**: `Record`\<`string`, `object`[]\>

Defined in: [internal/FhevmInstanceAdapter.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L47)

***

### DecryptParams

Defined in: [react/useUserDecrypt.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L24)

Parameters for single-handle decryption (simplified API).

#### Properties

##### contractAddress

> **contractAddress**: `` `0x${string}` `` \| `undefined`

Defined in: [react/useUserDecrypt.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L28)

Contract address that holds the encrypted value

##### handle

> **handle**: `string` \| `undefined`

Defined in: [react/useUserDecrypt.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L26)

The encrypted handle to decrypt

***

### DecryptRequest

Defined in: [react/useUserDecrypt.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L14)

Request for decrypting an encrypted handle.

#### Properties

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [react/useUserDecrypt.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L18)

Contract address that holds the encrypted value

##### handle

> **handle**: `string`

Defined in: [react/useUserDecrypt.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L16)

The encrypted handle to decrypt

***

### Eip1193Provider

Defined in: [internal/eip1193.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L10)

Standard EIP-1193 provider interface.
This is what window.ethereum, wagmi connectors, and viem clients all implement.

#### Methods

##### request()

> **request**(`args`): `Promise`\<`unknown`\>

Defined in: [internal/eip1193.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L11)

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

Defined in: [internal/eip1193.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L36)

EIP-712 typed data structure.

#### Properties

##### domain

> **domain**: [`TypedDataDomain`](#typeddatadomain)

Defined in: [internal/eip1193.ts:37](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L37)

##### message

> **message**: `Record`\<`string`, `unknown`\>

Defined in: [internal/eip1193.ts:40](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L40)

##### primaryType

> **primaryType**: `string`

Defined in: [internal/eip1193.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L39)

##### types

> **types**: `Record`\<`string`, [`TypedDataField`](#typeddatafield)[]\>

Defined in: [internal/eip1193.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L38)

***

### EncryptedInputBuilder

Defined in: [internal/FhevmInstanceAdapter.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L14)

Encrypted input builder interface.
Abstracts the RelayerEncryptedInput type from relayer-sdk.

#### Methods

##### add128()

> **add128**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L26)

Add a 128-bit unsigned integer

###### Parameters

###### value

`bigint`

###### Returns

`this`

##### add16()

> **add16**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L20)

Add a 16-bit unsigned integer

###### Parameters

###### value

`number`

###### Returns

`this`

##### add256()

> **add256**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L28)

Add a 256-bit unsigned integer

###### Parameters

###### value

`bigint`

###### Returns

`this`

##### add32()

> **add32**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L22)

Add a 32-bit unsigned integer

###### Parameters

###### value

`number`

###### Returns

`this`

##### add64()

> **add64**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L24)

Add a 64-bit unsigned integer

###### Parameters

###### value

`bigint`

###### Returns

`this`

##### add8()

> **add8**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L18)

Add an 8-bit unsigned integer

###### Parameters

###### value

`number`

###### Returns

`this`

##### addAddress()

> **addAddress**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L30)

Add an address value

###### Parameters

###### value

`` `0x${string}` ``

###### Returns

`this`

##### addBool()

> **addBool**(`value`): `this`

Defined in: [internal/FhevmInstanceAdapter.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L16)

Add a boolean value

###### Parameters

###### value

`boolean`

###### Returns

`this`

##### encrypt()

> **encrypt**(): `Promise`\<\{ `handles`: `Uint8Array`\<`ArrayBufferLike`\>[]; `inputProof`: `Uint8Array`; \}\>

Defined in: [internal/FhevmInstanceAdapter.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L32)

Encrypt all added values

###### Returns

`Promise`\<\{ `handles`: `Uint8Array`\<`ArrayBufferLike`\>[]; `inputProof`: `Uint8Array`; \}\>

***

### FhevmConfig

Defined in: [config.ts:84](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L84)

FhevmConfig holds the configuration for FHE operations.
Created once at app startup and passed to FhevmProvider.

#### Methods

##### getChain()

> **getChain**(`chainId`): [`FhevmChain`](#fhevmchain) \| `undefined`

Defined in: [config.ts:98](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L98)

Get a chain by its ID.
Returns undefined if the chain is not configured.

###### Parameters

###### chainId

`number`

###### Returns

[`FhevmChain`](#fhevmchain) \| `undefined`

##### getMockRpcUrl()

> **getMockRpcUrl**(`chainId`): `string` \| `undefined`

Defined in: [config.ts:109](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L109)

Get the RPC URL for a mock chain.
Returns undefined for production chains or if chain is not found.

###### Parameters

###### chainId

`number`

###### Returns

`string` \| `undefined`

##### isMockChain()

> **isMockChain**(`chainId`): `boolean`

Defined in: [config.ts:103](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L103)

Check if a chain ID corresponds to a mock chain.

###### Parameters

###### chainId

`number`

###### Returns

`boolean`

#### Properties

##### chains

> `readonly` **chains**: readonly [`FhevmChain`](#fhevmchain)[]

Defined in: [config.ts:86](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L86)

Configured chains

##### ssr

> `readonly` **ssr**: `boolean`

Defined in: [config.ts:92](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L92)

SSR mode flag

##### storage

> `readonly` **storage**: [`FhevmStorage`](#fhevmstorage)

Defined in: [config.ts:89](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L89)

Storage instance for persistence

***

### FhevmConfigOptions

Defined in: [config.ts:60](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L60)

Options for creating an FhevmConfig.

#### Properties

##### chains

> **chains**: readonly [`FhevmChain`](#fhevmchain)[]

Defined in: [config.ts:65](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L65)

Array of FHE-enabled chains to support.
At least one chain must be provided.

##### ssr?

> `optional` **ssr**: `boolean`

Defined in: [config.ts:77](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L77)

Enable SSR mode. When true, uses noopStorage by default
and defers initialization until client-side hydration.

##### storage?

> `optional` **storage**: [`FhevmStorage`](#fhevmstorage)

Defined in: [config.ts:71](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L71)

Storage for persisting decryption signatures and other FHE data.
Defaults to localStorage in browser, noopStorage in SSR.

***

### FhevmContextValue

Defined in: [react/context.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L16)

Context value provided by FhevmProvider.

#### Properties

##### address

> **address**: `` `0x${string}` `` \| `undefined`

Defined in: [react/context.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L33)

User's wallet address

##### chainId

> **chainId**: `number` \| `undefined`

Defined in: [react/context.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L30)

Current chain ID

##### config

> **config**: [`FhevmConfig`](#fhevmconfig)

Defined in: [react/context.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L18)

The FHEVM configuration

##### error

> **error**: `Error` \| `undefined`

Defined in: [react/context.ts:27](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L27)

Error if status is 'error'

##### instance

> **instance**: `FhevmInstance` \| `undefined`

Defined in: [react/context.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L21)

The initialized FHEVM instance, undefined until ready

##### isConnected

> **isConnected**: `boolean`

Defined in: [react/context.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L36)

Whether the wallet is connected

##### provider

> **provider**: [`Eip1193Provider`](#eip1193provider) \| `undefined`

Defined in: [react/context.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L39)

EIP-1193 provider for signing operations

##### refresh()

> **refresh**: () => `void`

Defined in: [react/context.ts:55](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L55)

Force re-initialization of the FHEVM instance

###### Returns

`void`

##### rpcUrl

> **rpcUrl**: `string` \| `undefined`

Defined in: [react/context.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L49)

RPC URL for the current chain (derived from config)

##### status

> **status**: [`FhevmStatus`](#fhevmstatus)

Defined in: [react/context.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L24)

Current initialization status

##### storage

> **storage**: [`GenericStringStorage`](#genericstringstorage) \| `undefined`

Defined in: [react/context.ts:52](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L52)

Storage for caching signatures (optional, developer-provided)

##### wallet

> **wallet**: [`FhevmWallet`](#fhevmwallet) \| `undefined`

Defined in: [react/context.ts:46](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L46)

FhevmWallet for direct wallet integration (preferred over provider).
When provided, hooks use wallet.sendTransaction / wallet.signTypedData
instead of going through ethers.js.

***

### FhevmProviderProps

Defined in: [react/FhevmProvider.tsx:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L17)

Props for FhevmProvider component.

#### Properties

##### address?

> `optional` **address**: `` `0x${string}` ``

Defined in: [react/FhevmProvider.tsx:61](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L61)

User's wallet address.
Required for encryption and decryption operations.

##### apiKey?

> `optional` **apiKey**: `string`

Defined in: [react/FhevmProvider.tsx:128](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L128)

API key for relayer authentication.
Required for relayer-sdk v0.4.0+ when using Zama's hosted relayer.

Get your API key from the Zama dashboard.

###### Example

```tsx
<FhevmProvider
  config={config}
  apiKey={process.env.NEXT_PUBLIC_ZAMA_API_KEY}
  ...
/>
```

##### autoInit?

> `optional` **autoInit**: `boolean`

Defined in: [react/FhevmProvider.tsx:111](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L111)

Whether to automatically initialize when wallet connects.
Default: true

##### chainId?

> `optional` **chainId**: `number`

Defined in: [react/FhevmProvider.tsx:67](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L67)

Current chain ID.
Required for FHEVM initialization.

##### children

> **children**: `ReactNode`

Defined in: [react/FhevmProvider.tsx:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L22)

React children

##### config

> **config**: [`FhevmConfig`](#fhevmconfig)

Defined in: [react/FhevmProvider.tsx:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L19)

FHEVM configuration created with createFhevmConfig

##### initTimeout?

> `optional` **initTimeout**: `number`

Defined in: [react/FhevmProvider.tsx:144](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L144)

Timeout in milliseconds for FHEVM initialization.
If initialization takes longer than this, it will be aborted and an error state set.
Default: 30000 (30 seconds)

###### Example

```tsx
<FhevmProvider
  config={config}
  initTimeout={60000} // 60 seconds
  ...
/>
```

##### isConnected?

> `optional` **isConnected**: `boolean`

Defined in: [react/FhevmProvider.tsx:73](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L73)

Whether the wallet is connected.
Controls auto-initialization.

##### ~~provider?~~

> `optional` **provider**: [`Eip1193Provider`](#eip1193provider)

Defined in: [react/FhevmProvider.tsx:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L31)

EIP-1193 provider for FHEVM operations.
This can be window.ethereum, a wagmi connector, or any EIP-1193 compatible provider.
If not provided, will attempt to use window.ethereum.

###### Deprecated

Prefer using the `wallet` prop instead for simpler integration.

##### queryClient?

> `optional` **queryClient**: `QueryClient`

Defined in: [react/FhevmProvider.tsx:164](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L164)

Optional external QueryClient instance.
If provided, FhevmProvider will use this instead of creating its own.
Useful when your app already has a QueryClientProvider to avoid cache isolation.

###### Example

```tsx
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

<FhevmProvider
  config={config}
  queryClient={queryClient}
  ...
/>
```

##### storage?

> `optional` **storage**: [`GenericStringStorage`](#genericstringstorage)

Defined in: [react/FhevmProvider.tsx:95](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L95)

Storage for caching decryption signatures.

SECURITY NOTE: The SDK does NOT provide a default storage.
You must explicitly choose your storage strategy:

- `memoryStorage` - Keys cleared on refresh (most secure, re-sign every time)
- `sessionStorageAdapter` - Keys cleared when tab closes
- `localStorageAdapter` - Persistent (accessible to any JS on the page)
- `indexedDBStorage` - Persistent (from config.storage)
- Custom storage - Implement GenericStringStorage interface
- `undefined` - No caching, re-sign every decrypt operation

###### Example

```tsx
import { memoryStorage } from '@zama-fhe/react-sdk';

<FhevmProvider storage={memoryStorage} ... />
```

##### ~~wagmi?~~

> `optional` **wagmi**: `object`

Defined in: [react/FhevmProvider.tsx:101](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L101)

###### ~~address~~

> **address**: `` `0x${string}` `` \| `undefined`

###### ~~chainId~~

> **chainId**: `number` \| `undefined`

###### ~~isConnected~~

> **isConnected**: `boolean`

###### Deprecated

Use `address`, `chainId`, and `isConnected` props directly instead.
This prop will be removed in a future version.

##### wallet?

> `optional` **wallet**: [`FhevmWallet`](#fhevmwallet)

Defined in: [react/FhevmProvider.tsx:55](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/FhevmProvider.tsx#L55)

FhevmWallet for direct wallet integration.

When provided, hooks use `wallet.sendTransaction` and `wallet.signTypedData`
directly instead of going through an ethers.js adapter. This is the preferred
approach — both viem and ethers users can implement FhevmWallet in 3-5 lines.

When both `wallet` and `provider` are set, `wallet` takes priority for
transaction hooks. The `provider` is still used for FHEVM instance initialization.

###### Example

```tsx
// With viem
const wallet: FhevmWallet = {
  address: walletClient.account.address,
  sendTransaction: (tx) => walletClient.sendTransaction({ ...tx, account, chain }),
  signTypedData: (td) => walletClient.signTypedData({ ...td, account }),
}

<FhevmProvider config={config} wallet={wallet} provider={publicClient} ... />
```

***

### FhevmStorage

Defined in: [config.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L7)

Storage interface for persisting FHE-related data.
Compatible with localStorage, sessionStorage, or custom implementations.

#### Methods

##### getItem()

> **getItem**(`key`): `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [config.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L8)

###### Parameters

###### key

`string`

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

##### removeItem()

> **removeItem**(`key`): `void` \| `Promise`\<`void`\>

Defined in: [config.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L10)

###### Parameters

###### key

`string`

###### Returns

`void` \| `Promise`\<`void`\>

##### setItem()

> **setItem**(`key`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [config.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L9)

###### Parameters

###### key

`string`

###### value

`string`

###### Returns

`void` \| `Promise`\<`void`\>

***

### FhevmWallet

Defined in: [types/wallet.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/wallet.ts#L33)

Lightweight wallet interface for FHE operations.

Accepts `sendTransaction` + `signTypedData` directly so that
both viem and ethers users can implement it in 3-5 lines
without building an EIP-1193 adapter.

#### Examples

```ts
import { walletClient } from './viem'

const wallet: FhevmWallet = {
  address: walletClient.account.address,
  sendTransaction: (tx) => walletClient.sendTransaction({ ...tx, account: walletClient.account, chain }),
  signTypedData: (td) => walletClient.signTypedData({ ...td, account: walletClient.account }),
}
```

```ts
import { signer } from './ethers'

const wallet: FhevmWallet = {
  address: await signer.getAddress() as `0x${string}`,
  sendTransaction: async (tx) => {
    const resp = await signer.sendTransaction(tx)
    return resp.hash as `0x${string}`
  },
  signTypedData: (td) => signer.signTypedData(td.domain, td.types, td.message),
}
```

#### Methods

##### sendTransaction()

> **sendTransaction**(`tx`): `Promise`\<`` `0x${string}` ``\>

Defined in: [types/wallet.ts:40](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/wallet.ts#L40)

Send a transaction and return the transaction hash.

###### Parameters

###### tx

###### data

`` `0x${string}` ``

###### to

`` `0x${string}` ``

###### value?

`bigint`

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### signTypedData()

> **signTypedData**(`typedData`): `Promise`\<`` `0x${string}` ``\>

Defined in: [types/wallet.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/wallet.ts#L49)

Sign EIP-712 typed data and return the signature.

###### Parameters

###### typedData

###### domain

`Record`\<`string`, `unknown`\>

###### message

`Record`\<`string`, `unknown`\>

###### primaryType

`string`

###### types

`Record`\<`string`, `object`[]\>

###### Returns

`Promise`\<`` `0x${string}` ``\>

#### Properties

##### address

> **address**: `` `0x${string}` ``

Defined in: [types/wallet.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/wallet.ts#L35)

The wallet's address

***

### GenericStringStorage

Defined in: [storage/GenericStringStorage.ts:1](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L1)

#### Methods

##### getItem()

> **getItem**(`key`): `string` \| `Promise`\<`string` \| `null`\> \| `null`

Defined in: [storage/GenericStringStorage.ts:2](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L2)

###### Parameters

###### key

`string`

###### Returns

`string` \| `Promise`\<`string` \| `null`\> \| `null`

##### removeItem()

> **removeItem**(`key`): `void` \| `Promise`\<`void`\>

Defined in: [storage/GenericStringStorage.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L4)

###### Parameters

###### key

`string`

###### Returns

`void` \| `Promise`\<`void`\>

##### setItem()

> **setItem**(`key`, `value`): `void` \| `Promise`\<`void`\>

Defined in: [storage/GenericStringStorage.ts:3](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/GenericStringStorage.ts#L3)

###### Parameters

###### key

`string`

###### value

`string`

###### Returns

`void` \| `Promise`\<`void`\>

***

### IFhevmInstanceAdapter

Defined in: [internal/FhevmInstanceAdapter.ts:57](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L57)

Adapter interface for FhevmInstance.
This interface abstracts the relayer-sdk FhevmInstance, making it easier to:
- Mock in tests
- Swap implementations
- Add cross-cutting concerns (logging, metrics, etc.)

#### Methods

##### createEIP712()

> **createEIP712**(`publicKey`, `contractAddresses`, `startTimestamp`, `durationDays`): [`DecryptionEIP712Data`](#decryptioneip712data)

Defined in: [internal/FhevmInstanceAdapter.ts:75](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L75)

Create EIP-712 typed data for user decryption authorization.

###### Parameters

###### publicKey

`string`

The user's public key for decryption (hex string)

###### contractAddresses

`string`[]

Contract addresses authorized for decryption

###### startTimestamp

`number`

Unix timestamp when the authorization starts (seconds)

###### durationDays

`number`

Number of days the authorization is valid

###### Returns

[`DecryptionEIP712Data`](#decryptioneip712data)

##### createEncryptedInput()

> **createEncryptedInput**(`contractAddress`, `userAddress`): [`EncryptedInputBuilder`](#encryptedinputbuilder)

Defined in: [internal/FhevmInstanceAdapter.ts:63](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L63)

Create an encrypted input builder for the given contract and user.

###### Parameters

###### contractAddress

`` `0x${string}` ``

The contract that will receive the encrypted input

###### userAddress

`` `0x${string}` ``

The user's wallet address

###### Returns

[`EncryptedInputBuilder`](#encryptedinputbuilder)

##### getChainId()

> **getChainId**(): `number`

Defined in: [internal/FhevmInstanceAdapter.ts:113](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L113)

Get the chain ID this instance is configured for.

###### Returns

`number`

##### publicDecrypt()

> **publicDecrypt**(`handles`): `Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

Defined in: [internal/FhevmInstanceAdapter.ts:108](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L108)

Decrypt values using public (on-chain) decryption.

###### Parameters

###### handles

`string`[]

Array of encrypted value handles to decrypt

###### Returns

`Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

##### supportsMethod()

> **supportsMethod**(`methodName`): `boolean`

Defined in: [internal/FhevmInstanceAdapter.ts:119](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L119)

Check if the instance supports a specific method.
Useful for feature detection.

###### Parameters

###### methodName

`string`

###### Returns

`boolean`

##### userDecrypt()

> **userDecrypt**(`requests`, `privateKey`, `publicKey`, `signature`, `contractAddresses`, `userAddress`, `startTimestamp`, `durationDays`): `Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

Defined in: [internal/FhevmInstanceAdapter.ts:93](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/FhevmInstanceAdapter.ts#L93)

Decrypt values using user authorization.

###### Parameters

###### requests

`HandleContractPair`[]

Array of handle/contract pairs to decrypt

###### privateKey

`string`

User's private key for decryption (hex string)

###### publicKey

`string`

User's public key for decryption (hex string)

###### signature

`string`

EIP-712 signature authorizing decryption

###### contractAddresses

`` `0x${string}` ``[]

Authorized contract addresses

###### userAddress

`` `0x${string}` ``

User's wallet address

###### startTimestamp

`number`

Authorization start timestamp (seconds)

###### durationDays

`number`

Authorization duration in days

###### Returns

`Promise`\<`Readonly`\<`Record`\<`` `0x${string}` ``, `ClearValueType`\>\>\>

***

### KmsInitParams

Defined in: [internal/fhevmTypes.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L20)

KMS (Key Management Service) initialization parameters.
These configure the connection to the key management service.

#### Indexable

\[`key`: `string`\]: `unknown`

Additional KMS configuration

#### Properties

##### authToken?

> `optional` **authToken**: `string`

Defined in: [internal/fhevmTypes.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L24)

Authentication token

##### url?

> `optional` **url**: `string`

Defined in: [internal/fhevmTypes.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L22)

KMS endpoint URL

***

### PublicDecryptParams

Defined in: [react/usePublicDecrypt.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L23)

Parameters for usePublicDecrypt hook.

#### Properties

##### handles

> **handles**: (`string` \| `undefined`)[] \| `undefined`

Defined in: [react/usePublicDecrypt.ts:25](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L25)

Array of encrypted handles to decrypt

***

### PublicDecryptResult

Defined in: [react/usePublicDecrypt.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L11)

Result from public decryption.

#### Properties

##### abiEncodedClearValues

> **abiEncodedClearValues**: `` `0x${string}` ``

Defined in: [react/usePublicDecrypt.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L15)

ABI-encoded clear values for contract callback

##### clearValues

> **clearValues**: `Record`\<`string`, `string` \| `bigint` \| `boolean`\>

Defined in: [react/usePublicDecrypt.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L13)

Decrypted values keyed by handle

##### decryptionProof

> **decryptionProof**: `` `0x${string}` ``

Defined in: [react/usePublicDecrypt.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L17)

Decryption proof for contract verification

***

### RelayerSDKLoaderOptions

Defined in: [internal/RelayerSDKLoader.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L10)

Options for RelayerSDKLoader.

#### Properties

##### cdnUrl?

> `optional` **cdnUrl**: `string`

Defined in: [internal/RelayerSDKLoader.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L23)

Custom CDN URL for the relayer SDK script.
Defaults to the official Zama CDN.

##### crossOrigin?

> `optional` **crossOrigin**: `"anonymous"` \| `"use-credentials"`

Defined in: [internal/RelayerSDKLoader.ts:41](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L41)

Cross-origin attribute for the script tag.
Required when using SRI with scripts from a different origin.
Defaults to "anonymous" when integrity is provided.

##### fallbackUrl?

> `optional` **fallbackUrl**: `string`

Defined in: [internal/RelayerSDKLoader.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L28)

Fallback CDN URL to try if the primary CDN fails.
If not provided, no fallback will be attempted.

##### initialDelay?

> `optional` **initialDelay**: `number`

Defined in: [internal/RelayerSDKLoader.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L16)

Initial delay in ms before first retry (default: 1000)

##### integrity?

> `optional` **integrity**: `string`

Defined in: [internal/RelayerSDKLoader.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L35)

Subresource Integrity (SRI) hash for the script.
Format: "sha384-..." or "sha512-..."
If provided, the script will be verified against this hash.

###### See

https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

##### maxDelay?

> `optional` **maxDelay**: `number`

Defined in: [internal/RelayerSDKLoader.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L18)

Maximum delay in ms between retries (default: 10000)

##### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [internal/RelayerSDKLoader.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L14)

Maximum number of retry attempts (default: 3)

##### trace?

> `optional` **trace**: `TraceType`

Defined in: [internal/RelayerSDKLoader.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/RelayerSDKLoader.ts#L12)

Optional trace function for logging

***

### TfheInitParams

Defined in: [internal/fhevmTypes.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L7)

TFHE initialization parameters.
These are passed to the TFHE library for cryptographic setup.

#### Indexable

\[`key`: `string`\]: `unknown`

Additional TFHE configuration

#### Properties

##### publicKeyParams?

> `optional` **publicKeyParams**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [internal/fhevmTypes.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L11)

Public key parameters

##### wasmUrl?

> `optional` **wasmUrl**: `string`

Defined in: [internal/fhevmTypes.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L9)

WASM module URL override

***

### TypedDataDomain

Defined in: [internal/eip1193.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L17)

EIP-712 typed data domain.

#### Properties

##### chainId?

> `optional` **chainId**: `number`

Defined in: [internal/eip1193.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L20)

##### name?

> `optional` **name**: `string`

Defined in: [internal/eip1193.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L18)

##### salt?

> `optional` **salt**: `` `0x${string}` ``

Defined in: [internal/eip1193.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L22)

##### verifyingContract?

> `optional` **verifyingContract**: `` `0x${string}` ``

Defined in: [internal/eip1193.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L21)

##### version?

> `optional` **version**: `string`

Defined in: [internal/eip1193.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L19)

***

### TypedDataField

Defined in: [internal/eip1193.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L28)

EIP-712 type definition.

#### Properties

##### name

> **name**: `string`

Defined in: [internal/eip1193.ts:29](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L29)

##### type

> **type**: `string`

Defined in: [internal/eip1193.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/eip1193.ts#L30)

***

### UseConfidentialBalancesOptions

Defined in: [types/balance.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L21)

#### Properties

##### account?

> `optional` **account**: `` `0x${string}` ``

Defined in: [types/balance.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L23)

##### contracts

> **contracts**: readonly [`ConfidentialBalanceConfig`](#confidentialbalanceconfig)[]

Defined in: [types/balance.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L22)

##### decrypt?

> `optional` **decrypt**: `boolean`

Defined in: [types/balance.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L26)

Opt-in auto-decryption: composes useUserDecrypt + useUserDecryptedValues internally

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [types/balance.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L24)

***

### UseConfidentialBalancesReturn

Defined in: [types/balance.ts:29](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L29)

#### Properties

##### canDecrypt

> **canDecrypt**: `boolean`

Defined in: [types/balance.ts:44](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L44)

Whether decryption is ready to be called

##### data

> **data**: [`ConfidentialBalanceResult`](#confidentialbalanceresult)[]

Defined in: [types/balance.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L30)

##### decryptAll()

> **decryptAll**: () => `void`

Defined in: [types/balance.ts:40](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L40)

Trigger EIP-712 signing + decryption for all fetched handles

###### Returns

`void`

##### decryptedCount

> **decryptedCount**: `number`

Defined in: [types/balance.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L50)

How many handles have been decrypted

##### decryptError

> **decryptError**: `string` \| `null`

Defined in: [types/balance.ts:46](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L46)

Error message if decryption failed

##### error

> **error**: `Error` \| `null`

Defined in: [types/balance.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L36)

##### isAllDecrypted

> **isAllDecrypted**: `boolean`

Defined in: [types/balance.ts:48](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L48)

Whether all fetched handles have been decrypted

##### isDecrypting

> **isDecrypting**: `boolean`

Defined in: [types/balance.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L42)

Whether decryption is currently in progress

##### isError

> **isError**: `boolean`

Defined in: [types/balance.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L34)

##### isFetching

> **isFetching**: `boolean`

Defined in: [types/balance.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L33)

##### isLoading

> **isLoading**: `boolean`

Defined in: [types/balance.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L31)

##### isRefetching

> **isRefetching**: `boolean`

Defined in: [types/balance.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L32)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [types/balance.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L35)

##### refetch()

> **refetch**: () => `Promise`\<`void`\>

Defined in: [types/balance.ts:37](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L37)

###### Returns

`Promise`\<`void`\>

##### status

> **status**: [`BalanceStatus`](#balancestatus)

Defined in: [types/balance.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L38)

***

### UseConfidentialTransferOptions

Defined in: [types/transfer.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L11)

Options for useConfidentialTransfer hook.

#### Properties

##### abi?

> `optional` **abi**: `InterfaceAbi`

Defined in: [types/transfer.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L15)

Optional custom ABI (uses default ERC7984 ABI if not provided)

##### contractAddress

> **contractAddress**: `` `0x${string}` ``

Defined in: [types/transfer.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L13)

The token contract address

##### functionName?

> `optional` **functionName**: `string`

Defined in: [types/transfer.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L17)

Function name to call (default: "confidentialTransfer")

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [types/transfer.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L21)

Callback when transfer fails

###### Parameters

###### error

`Error`

###### Returns

`void`

##### onSuccess()?

> `optional` **onSuccess**: (`txHash`) => `void`

Defined in: [types/transfer.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L19)

Callback when transfer succeeds

###### Parameters

###### txHash

`string`

###### Returns

`void`

***

### UseConfidentialTransferReturn

Defined in: [types/transfer.ts:27](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L27)

Return type for useConfidentialTransfer hook.

#### Properties

##### error

> **error**: `Error` \| `null`

Defined in: [types/transfer.ts:59](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L59)

Error if status is 'error'

##### isConfirming

> **isConfirming**: `boolean`

Defined in: [types/transfer.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L47)

Whether waiting for transaction confirmation

##### isEncrypting

> **isEncrypting**: `boolean`

Defined in: [types/transfer.ts:41](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L41)

Whether currently encrypting the amount

##### isError

> **isError**: `boolean`

Defined in: [types/transfer.ts:53](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L53)

Whether the transfer failed

##### isPending

> **isPending**: `boolean`

Defined in: [types/transfer.ts:56](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L56)

Whether any operation is pending

##### isSigning

> **isSigning**: `boolean`

Defined in: [types/transfer.ts:44](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L44)

Whether waiting for user to sign the transaction

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [types/transfer.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L50)

Whether the transfer was successful

##### reset()

> **reset**: () => `void`

Defined in: [types/transfer.ts:65](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L65)

Reset the hook state to idle

###### Returns

`void`

##### status

> **status**: [`TransferStatus`](#transferstatus)

Defined in: [types/transfer.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L38)

Current transfer status

##### transfer()

> **transfer**: (`to`, `amount`) => `Promise`\<`void`\>

Defined in: [types/transfer.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L35)

Execute a confidential transfer.
Handles encryption, signing, and confirmation automatically.

###### Parameters

###### to

`` `0x${string}` ``

Recipient address

###### amount

`bigint`

Amount to transfer (will be encrypted)

###### Returns

`Promise`\<`void`\>

##### txHash

> **txHash**: `string` \| `undefined`

Defined in: [types/transfer.ts:62](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L62)

Transaction hash after signing

***

### UseDecryptedValueReturn

Defined in: [react/useUserDecryptedValue.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L11)

Return type for useUserDecryptedValue hook.

#### Properties

##### contractAddress

> **contractAddress**: `string` \| `undefined`

Defined in: [react/useUserDecryptedValue.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L22)

The contract address being queried

##### data

> **data**: `string` \| `bigint` \| `boolean` \| `undefined`

Defined in: [react/useUserDecryptedValue.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L13)

The cached decrypted value, or undefined if not cached

##### handle

> **handle**: `string` \| `undefined`

Defined in: [react/useUserDecryptedValue.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L19)

The handle being queried

##### isCached

> **isCached**: `boolean`

Defined in: [react/useUserDecryptedValue.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecryptedValue.ts#L16)

Whether the value exists in the cache

***

### UseDecryptReturn

Defined in: [react/useUserDecrypt.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L34)

Return type for useUserDecrypt hook.

#### Properties

##### canDecrypt

> **canDecrypt**: `boolean`

Defined in: [react/useUserDecrypt.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L39)

Whether decryption is ready to be called.
False if FHEVM not ready, no provider, or already decrypting.

##### clearError()

> **clearError**: () => `void`

Defined in: [react/useUserDecrypt.ts:63](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L63)

Clear the error state

###### Returns

`void`

##### decrypt()

> **decrypt**: () => `void`

Defined in: [react/useUserDecrypt.ts:51](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L51)

Start the decryption process.
Results will be available in `results` when complete.

###### Returns

`void`

##### error

> **error**: `string` \| `null`

Defined in: [react/useUserDecrypt.ts:60](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L60)

Error message if decryption failed

##### isDecrypting

> **isDecrypting**: `boolean`

Defined in: [react/useUserDecrypt.ts:54](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L54)

Whether decryption is currently in progress

##### isError

> **isError**: `boolean`

Defined in: [react/useUserDecrypt.ts:73](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L73)

Whether decryption failed

##### isIdle

> **isIdle**: `boolean`

Defined in: [react/useUserDecrypt.ts:76](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L76)

Whether the hook is in idle state (not started)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [react/useUserDecrypt.ts:70](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L70)

Whether decryption completed successfully

##### message

> **message**: `string`

Defined in: [react/useUserDecrypt.ts:57](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L57)

Status message for UI feedback

##### results

> **results**: `Record`\<`string`, `string` \| `bigint` \| `boolean`\>

Defined in: [react/useUserDecrypt.ts:45](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useUserDecrypt.ts#L45)

Decrypted results keyed by handle.
Empty until decrypt() is called and completes.

***

### UseEncryptReturn

Defined in: [react/useEncrypt.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEncrypt.ts#L21)

Return type for useEncrypt hook.

#### Properties

##### encrypt()

> **encrypt**: \<`T`\>(`inputs`, `contractAddress`) => `Promise`\<\[...\{ \[K in string \| number \| symbol\]: Uint8Array\<ArrayBufferLike\> \}\[\], `Uint8Array`\<`ArrayBufferLike`\>\] \| `undefined`\>

Defined in: [react/useEncrypt.ts:56](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEncrypt.ts#L56)

Encrypt values for FHE contract calls.

Returns a tuple of `[...handles, proof]` for easy destructuring.

###### Type Parameters

###### T

`T` *extends* readonly [`EncryptInput`](shared/README.md#encryptinput)[]

###### Parameters

###### inputs

`T`

Array of typed values to encrypt

###### contractAddress

`` `0x${string}` ``

Target contract address

###### Returns

`Promise`\<\[...\{ \[K in string \| number \| symbol\]: Uint8Array\<ArrayBufferLike\> \}\[\], `Uint8Array`\<`ArrayBufferLike`\>\] \| `undefined`\>

Tuple of handles followed by proof, or undefined if not ready

###### Example

```ts
// Single value
const [amountHandle, proof] = await encrypt([
  { type: 'uint64', value: 100n },
], contractAddress);

// Multiple values
const [amountHandle, recipientHandle, proof] = await encrypt([
  { type: 'uint64', value: 100n },
  { type: 'address', value: '0x...' },
], contractAddress);

// Use in contract call
writeContract({
  args: [amountHandle, recipientHandle, proof],
});
```

##### isReady

> **isReady**: `boolean`

Defined in: [react/useEncrypt.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEncrypt.ts#L26)

Whether encryption is ready.
False if FHEVM is not initialized or wallet not connected.

***

### UseEthersSignerReturn

Defined in: [react/useEthersSigner.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L12)

Return type for useEthersSigner hook.

#### Properties

##### error

> **error**: `Error` \| `undefined`

Defined in: [react/useEthersSigner.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L23)

Error if signer creation failed

##### isLoading

> **isLoading**: `boolean`

Defined in: [react/useEthersSigner.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L20)

Whether the signer is currently being loaded

##### isReady

> **isReady**: `boolean`

Defined in: [react/useEthersSigner.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L26)

Whether the signer is ready to use

##### provider

> **provider**: `BrowserProvider` \| `undefined`

Defined in: [react/useEthersSigner.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L17)

The ethers provider, or undefined if not available

##### signer

> **signer**: `JsonRpcSigner` \| `undefined`

Defined in: [react/useEthersSigner.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useEthersSigner.ts#L14)

The ethers signer, or undefined if not available

***

### UseFhevmClientReturn

Defined in: [react/useFhevmClient.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L8)

Return type for useFhevmClient hook.

#### Properties

##### config

> **config**: [`FhevmConfig`](#fhevmconfig)

Defined in: [react/useFhevmClient.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L16)

The FHEVM configuration

##### instance

> **instance**: `FhevmInstance` \| `undefined`

Defined in: [react/useFhevmClient.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L10)

The FHEVM instance, undefined until ready

##### isReady

> **isReady**: `boolean`

Defined in: [react/useFhevmClient.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L22)

Whether the instance is ready to use

##### refresh()

> **refresh**: () => `void`

Defined in: [react/useFhevmClient.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L19)

Force re-initialization

###### Returns

`void`

##### status

> **status**: [`FhevmStatus`](#fhevmstatus)

Defined in: [react/useFhevmClient.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmClient.ts#L13)

Current initialization status

***

### UseFhevmInstanceOptions

Defined in: [react/useFhevmInstance.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L16)

Parameters for the FHEVM instance query.

#### Properties

##### apiKey?

> `optional` **apiKey**: `string`

Defined in: [react/useFhevmInstance.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L30)

API key for relayer

##### chainId

> **chainId**: `number` \| `undefined`

Defined in: [react/useFhevmInstance.ts:22](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L22)

Current chain ID

##### config

> **config**: [`FhevmConfig`](#fhevmconfig)

Defined in: [react/useFhevmInstance.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L18)

FHEVM configuration

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [react/useFhevmInstance.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L34)

Whether to enable auto-initialization

##### initTimeout?

> `optional` **initTimeout**: `number`

Defined in: [react/useFhevmInstance.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L32)

Timeout in milliseconds

##### isConnected

> **isConnected**: `boolean`

Defined in: [react/useFhevmInstance.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L24)

Whether wallet is connected

##### mockChains

> **mockChains**: `Record`\<`number`, `string`\>

Defined in: [react/useFhevmInstance.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L28)

Map of mock chain IDs to RPC URLs

##### provider

> **provider**: `string` \| [`Eip1193Provider`](#eip1193provider) \| `undefined`

Defined in: [react/useFhevmInstance.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L20)

EIP-1193 provider or RPC URL string for FHEVM instance initialization

##### scriptReady

> **scriptReady**: `boolean`

Defined in: [react/useFhevmInstance.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L26)

Whether relayer script is ready

***

### UseFhevmInstanceReturn

Defined in: [react/useFhevmInstance.ts:40](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L40)

Return type for useFhevmInstance hook.

#### Properties

##### error

> **error**: `Error` \| `null`

Defined in: [react/useFhevmInstance.ts:46](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L46)

Error if initialization failed

##### instance

> **instance**: `FhevmInstance` \| `undefined`

Defined in: [react/useFhevmInstance.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L42)

The FHEVM instance, or undefined if not ready

##### isError

> **isError**: `boolean`

Defined in: [react/useFhevmInstance.ts:52](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L52)

Whether instance failed to initialize

##### isLoading

> **isLoading**: `boolean`

Defined in: [react/useFhevmInstance.ts:48](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L48)

Whether instance is currently loading

##### isReady

> **isReady**: `boolean`

Defined in: [react/useFhevmInstance.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L50)

Whether instance is ready

##### refresh()

> **refresh**: () => `void`

Defined in: [react/useFhevmInstance.ts:54](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L54)

Manually refresh the instance

###### Returns

`void`

##### status

> **status**: `"error"` \| `"idle"` \| `"ready"` \| `"initializing"`

Defined in: [react/useFhevmInstance.ts:44](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmInstance.ts#L44)

Current status

***

### UseFhevmStatusReturn

Defined in: [react/useFhevmStatus.ts:6](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L6)

Return type for useFhevmStatus hook.

#### Properties

##### chainId

> **chainId**: `number` \| `undefined`

Defined in: [react/useFhevmStatus.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L23)

Current chain ID

##### error

> **error**: `Error` \| `undefined`

Defined in: [react/useFhevmStatus.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L11)

Error if status is 'error'

##### isConnected

> **isConnected**: `boolean`

Defined in: [react/useFhevmStatus.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L26)

Whether wallet is connected

##### isError

> **isError**: `boolean`

Defined in: [react/useFhevmStatus.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L20)

Convenience flag: true when status is 'error'

##### isInitializing

> **isInitializing**: `boolean`

Defined in: [react/useFhevmStatus.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L17)

Convenience flag: true when status is 'initializing'

##### isReady

> **isReady**: `boolean`

Defined in: [react/useFhevmStatus.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L14)

Convenience flag: true when status is 'ready'

##### status

> **status**: [`FhevmStatus`](#fhevmstatus)

Defined in: [react/useFhevmStatus.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useFhevmStatus.ts#L8)

Current initialization status

***

### UsePublicDecryptReturn

Defined in: [react/usePublicDecrypt.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L31)

Return type for usePublicDecrypt hook.

#### Properties

##### canDecrypt

> **canDecrypt**: `boolean`

Defined in: [react/usePublicDecrypt.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L36)

Whether public decryption is ready to be called.
False if FHEVM not ready or no handles provided.

##### clearError()

> **clearError**: () => `void`

Defined in: [react/usePublicDecrypt.ts:71](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L71)

Clear the error state

###### Returns

`void`

##### clearValues

> **clearValues**: `Record`\<`string`, `string` \| `bigint` \| `boolean`\>

Defined in: [react/usePublicDecrypt.ts:59](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L59)

Decrypted values keyed by handle (convenience accessor).
Equivalent to result?.clearValues ?? {}

##### decrypt()

> **decrypt**: () => `void`

Defined in: [react/usePublicDecrypt.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L42)

Start the public decryption process.
Results will be available in `result` when complete.

###### Returns

`void`

##### decryptAsync()

> **decryptAsync**: () => `Promise`\<[`PublicDecryptResult`](#publicdecryptresult) \| `undefined`\>

Defined in: [react/usePublicDecrypt.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L47)

Async version of decrypt that returns the result directly.

###### Returns

`Promise`\<[`PublicDecryptResult`](#publicdecryptresult) \| `undefined`\>

##### error

> **error**: `string` \| `null`

Defined in: [react/usePublicDecrypt.ts:68](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L68)

Error message if decryption failed

##### isDecrypting

> **isDecrypting**: `boolean`

Defined in: [react/usePublicDecrypt.ts:62](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L62)

Whether decryption is currently in progress

##### isError

> **isError**: `boolean`

Defined in: [react/usePublicDecrypt.ts:81](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L81)

Whether decryption failed

##### isIdle

> **isIdle**: `boolean`

Defined in: [react/usePublicDecrypt.ts:84](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L84)

Whether the hook is in idle state (not started)

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [react/usePublicDecrypt.ts:78](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L78)

Whether decryption completed successfully

##### message

> **message**: `string`

Defined in: [react/usePublicDecrypt.ts:65](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L65)

Status message for UI feedback

##### result

> **result**: [`PublicDecryptResult`](#publicdecryptresult) \| `undefined`

Defined in: [react/usePublicDecrypt.ts:53](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/usePublicDecrypt.ts#L53)

Full decryption result including proof and encoded values.
Use this when you need to call a contract callback.

***

### UseShieldOptions

Defined in: [types/shield.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L24)

#### Properties

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [types/shield.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L32)

Callback on error

###### Parameters

###### error

`Error`

###### Returns

`void`

##### onSuccess()?

> `optional` **onSuccess**: (`txHash`) => `void`

Defined in: [types/shield.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L30)

Callback on successful shield

###### Parameters

###### txHash

`string`

###### Returns

`void`

##### underlyingAddress?

> `optional` **underlyingAddress**: `` `0x${string}` ``

Defined in: [types/shield.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L28)

Underlying ERC20 token address (optional, will be fetched if not provided)

##### wrapperAddress

> **wrapperAddress**: `` `0x${string}` ``

Defined in: [types/shield.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L26)

ERC7984 wrapper contract address

***

### UseShieldReturn

Defined in: [types/shield.ts:35](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L35)

#### Properties

##### allowance

> **allowance**: `bigint` \| `undefined`

Defined in: [types/shield.ts:57](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L57)

Current allowance for wrapper

##### error

> **error**: `Error` \| `null`

Defined in: [types/shield.ts:51](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L51)

Error if any

##### isApproving

> **isApproving**: `boolean`

Defined in: [types/shield.ts:43](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L43)

Whether checking/requesting allowance

##### isError

> **isError**: `boolean`

Defined in: [types/shield.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L49)

Whether operation errored

##### isPending

> **isPending**: `boolean`

Defined in: [types/shield.ts:41](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L41)

Whether currently processing

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [types/shield.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L47)

Whether operation succeeded

##### isWrapping

> **isWrapping**: `boolean`

Defined in: [types/shield.ts:45](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L45)

Whether wrapping

##### refetchAllowance()

> **refetchAllowance**: () => `Promise`\<`void`\>

Defined in: [types/shield.ts:59](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L59)

Refetch allowance

###### Returns

`Promise`\<`void`\>

##### reset()

> **reset**: () => `void`

Defined in: [types/shield.ts:55](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L55)

Reset state

###### Returns

`void`

##### shield()

> **shield**: (`amount`, `to?`) => `Promise`\<`void`\>

Defined in: [types/shield.ts:37](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L37)

Execute the shield operation (ERC20 → ERC7984)

###### Parameters

###### amount

`bigint`

###### to?

`` `0x${string}` ``

###### Returns

`Promise`\<`void`\>

##### status

> **status**: [`ShieldStatus`](#shieldstatus)

Defined in: [types/shield.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L39)

Current status

##### txHash

> **txHash**: `string` \| `undefined`

Defined in: [types/shield.ts:53](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L53)

Transaction hash if available

***

### UseSignatureOptions

Defined in: [react/useSignature.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L14)

Options for useSignature hook.

#### Properties

##### contractAddresses

> **contractAddresses**: `` `0x${string}` ``[]

Defined in: [react/useSignature.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L16)

Contract addresses for which the signature is valid

##### enabled?

> `optional` **enabled**: `boolean`

Defined in: [react/useSignature.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L20)

Whether to enable the query

##### userAddress?

> `optional` **userAddress**: `` `0x${string}` ``

Defined in: [react/useSignature.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L18)

User address (optional, will use context address if not provided)

***

### UseSignatureReturn

Defined in: [react/useSignature.ts:26](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L26)

Return type for useSignature hook.

#### Properties

##### error

> **error**: `Error` \| `null`

Defined in: [react/useSignature.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L36)

Error if any

##### isError

> **isError**: `boolean`

Defined in: [react/useSignature.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L34)

Whether the query encountered an error

##### isLoading

> **isLoading**: `boolean`

Defined in: [react/useSignature.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L32)

Whether the query is loading

##### isSignatureCached

> **isSignatureCached**: `boolean`

Defined in: [react/useSignature.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L30)

Whether a signature exists in storage

##### refetch()

> **refetch**: () => `Promise`\<`void`\>

Defined in: [react/useSignature.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L38)

Refetch the signature from storage

###### Returns

`Promise`\<`void`\>

##### signature

> **signature**: [`FhevmDecryptionSignature`](#fhevmdecryptionsignature) \| `null` \| `undefined`

Defined in: [react/useSignature.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useSignature.ts#L28)

The loaded signature, if it exists in storage

***

### UseUnshieldOptions

Defined in: [types/shield.ts:62](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L62)

#### Properties

##### onError()?

> `optional` **onError**: (`error`) => `void`

Defined in: [types/shield.ts:68](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L68)

Callback on error

###### Parameters

###### error

`Error`

###### Returns

`void`

##### onSuccess()?

> `optional` **onSuccess**: (`txHash`) => `void`

Defined in: [types/shield.ts:66](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L66)

Callback on successful unshield initiation

###### Parameters

###### txHash

`string`

###### Returns

`void`

##### wrapperAddress

> **wrapperAddress**: `` `0x${string}` ``

Defined in: [types/shield.ts:64](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L64)

ERC7984 wrapper contract address

***

### UseUnshieldReturn

Defined in: [types/shield.ts:71](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L71)

#### Properties

##### error

> **error**: `Error` \| `null`

Defined in: [types/shield.ts:91](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L91)

Error if any

##### finalizeTxHash

> **finalizeTxHash**: `string` \| `undefined`

Defined in: [types/shield.ts:95](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L95)

Finalize transaction hash if available

##### isDecrypting

> **isDecrypting**: `boolean`

Defined in: [types/shield.ts:83](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L83)

Whether waiting for public decryption proof

##### isEncrypting

> **isEncrypting**: `boolean`

Defined in: [types/shield.ts:79](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L79)

Whether encrypting the amount

##### isError

> **isError**: `boolean`

Defined in: [types/shield.ts:89](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L89)

Whether operation errored

##### isFinalizing

> **isFinalizing**: `boolean`

Defined in: [types/shield.ts:85](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L85)

Whether finalizing the unwrap

##### isPending

> **isPending**: `boolean`

Defined in: [types/shield.ts:77](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L77)

Whether currently processing

##### isSigning

> **isSigning**: `boolean`

Defined in: [types/shield.ts:81](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L81)

Whether signing the transaction

##### isSuccess

> **isSuccess**: `boolean`

Defined in: [types/shield.ts:87](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L87)

Whether operation succeeded

##### reset()

> **reset**: () => `void`

Defined in: [types/shield.ts:97](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L97)

Reset state

###### Returns

`void`

##### status

> **status**: [`UnshieldStatus`](#unshieldstatus)

Defined in: [types/shield.ts:75](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L75)

Current status

##### txHash

> **txHash**: `string` \| `undefined`

Defined in: [types/shield.ts:93](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L93)

Unwrap transaction hash if available

##### unshield()

> **unshield**: (`amount`, `to?`) => `Promise`\<`void`\>

Defined in: [types/shield.ts:73](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L73)

Execute the unshield operation (ERC7984 → ERC20)

###### Parameters

###### amount

`bigint`

###### to?

`` `0x${string}` ``

###### Returns

`Promise`\<`void`\>

***

### WalletActions

Defined in: [react/useWalletOrSigner.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L15)

Unified wallet actions interface.
Abstracts over FhevmWallet (direct) and ethers.js signer (legacy) paths.

#### Methods

##### call()

> **call**(`to`, `data`): `Promise`\<`` `0x${string}` ``\>

Defined in: [react/useWalletOrSigner.ts:27](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L27)

Execute a read-only contract call

###### Parameters

###### to

`` `0x${string}` ``

###### data

`` `0x${string}` ``

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### sendTransaction()

> **sendTransaction**(`tx`): `Promise`\<`` `0x${string}` ``\>

Defined in: [react/useWalletOrSigner.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L17)

Send a transaction and return the tx hash

###### Parameters

###### tx

###### data

`` `0x${string}` ``

###### to

`` `0x${string}` ``

###### value?

`bigint`

###### Returns

`Promise`\<`` `0x${string}` ``\>

##### waitForReceipt()

> **waitForReceipt**(`txHash`): `Promise`\<`TransactionReceipt`\>

Defined in: [react/useWalletOrSigner.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L24)

Wait for a transaction receipt

###### Parameters

###### txHash

`` `0x${string}` ``

###### Returns

`Promise`\<`TransactionReceipt`\>

#### Properties

##### address

> **address**: `` `0x${string}` ``

Defined in: [react/useWalletOrSigner.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L30)

The wallet address

##### isReady

> **isReady**: `boolean`

Defined in: [react/useWalletOrSigner.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useWalletOrSigner.ts#L33)

Whether the wallet actions are ready to use

## Type Aliases

### BalanceStatus

> **BalanceStatus** = `"idle"` \| `"loading"` \| `"success"` \| `"error"`

Defined in: [types/balance.ts:3](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L3)

***

### ConfigChainId

> **ConfigChainId**\<`C`\> = `C`\[`"chains"`\]\[`number`\]\[`"id"`\]

Defined in: [config.ts:198](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L198)

Type helper to extract chain IDs from a config.
Useful for type-safe chain selection.

#### Type Parameters

##### C

`C` *extends* [`FhevmConfig`](#fhevmconfig)

***

### DecryptedValue

> **DecryptedValue** = `string` \| `bigint` \| `boolean`

Defined in: [types/balance.ts:5](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/balance.ts#L5)

***

### EIP712MessageValue

> **EIP712MessageValue** = `string` \| `number` \| `bigint` \| `boolean` \| `` `0x${string}` `` \| `Uint8Array` \| [`EIP712MessageValue`](#eip712messagevalue)[] \| \{\[`key`: `string`\]: [`EIP712MessageValue`](#eip712messagevalue); \}

Defined in: [fhevmTypes.ts:28](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L28)

EIP-712 message value types.
Values can be primitives, arrays, or nested objects.

***

### EIP712Type

> **EIP712Type** = `object`

Defined in: [fhevmTypes.ts:41](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L41)

EIP-712 typed data structure for signing.

#### Properties

##### domain

> **domain**: `object`

Defined in: [fhevmTypes.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L42)

###### chainId

> **chainId**: `number`

###### name

> **name**: `string`

###### verifyingContract

> **verifyingContract**: `` `0x${string}` ``

###### version

> **version**: `string`

##### message

> **message**: `Record`\<`string`, [`EIP712MessageValue`](#eip712messagevalue)\>

Defined in: [fhevmTypes.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L50)

The message to sign. Structure varies based on primaryType.

##### primaryType

> **primaryType**: `string`

Defined in: [fhevmTypes.ts:51](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L51)

##### types

> **types**: `object`

Defined in: [fhevmTypes.ts:52](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L52)

###### Index Signature

\[`key`: `string`\]: `object`[]

***

### EncryptedOutput

> **EncryptedOutput** = `object`

Defined in: [types/encryption.ts:90](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L90)

Encrypted output containing handles and proof.

#### Properties

##### handles

> **handles**: `Uint8Array`[]

Defined in: [types/encryption.ts:92](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L92)

Encrypted handles to pass to contract

##### inputProof

> **inputProof**: `Uint8Array`

Defined in: [types/encryption.ts:94](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L94)

Proof for the encrypted input

***

### EncryptInput

> **EncryptInput** = \{ `type`: `"bool"`; `value`: `boolean`; \} \| \{ `type`: `"uint8"`; `value`: `number`; \} \| \{ `type`: `"uint16"`; `value`: `number`; \} \| \{ `type`: `"uint32"`; `value`: `number`; \} \| \{ `type`: `"uint64"`; `value`: `bigint`; \} \| \{ `type`: `"uint128"`; `value`: `bigint`; \} \| \{ `type`: `"uint256"`; `value`: `bigint`; \} \| \{ `type`: `"address"`; `value`: `` `0x${string}` ``; \}

Defined in: [types/encryption.ts:60](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L60)

Discriminated union for type-safe encryption inputs.

TypeScript enforces correct value types based on the `type` field:
- `bool` requires `boolean`
- `uint8`, `uint16`, `uint32` require `number`
- `uint64`, `uint128`, `uint256` require `bigint`
- `address` requires `0x${string}`

#### Example

```ts
// Valid inputs
const inputs: EncryptInput[] = [
  { type: 'bool', value: true },
  { type: 'uint8', value: 255 },
  { type: 'uint64', value: 100n },
  { type: 'address', value: '0x1234...' },
];

// TypeScript errors at compile time:
{ type: 'uint64', value: 100 }    // Error: number not assignable to bigint
{ type: 'bool', value: 1 }         // Error: number not assignable to boolean
{ type: 'address', value: 'bad' }  // Error: string not assignable to `0x${string}`
```

***

### EncryptResult

> **EncryptResult**\<`T`\> = readonly \[`...{ [K in keyof T]: Uint8Array }`, `Uint8Array`\]

Defined in: [types/encryption.ts:82](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L82)

Result type for encrypt function.
Returns a tuple of [...handles, proof] for easy destructuring.

#### Type Parameters

##### T

`T` *extends* readonly [`EncryptInput`](#encryptinput)[]

#### Example

```ts
const [amountHandle, recipientHandle, proof] = await encrypt([
  { type: 'uint64', value: 100n },
  { type: 'address', value: '0x...' },
], contractAddress);
```

***

### FheTypeName

> **FheTypeName** = `"bool"` \| `"uint8"` \| `"uint16"` \| `"uint32"` \| `"uint64"` \| `"uint128"` \| `"uint256"` \| `"address"`

Defined in: [types/encryption.ts:12](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/encryption.ts#L12)

Supported FHE type names (Solidity-style naming).
Maps to relayer-sdk internal types: ebool, euint8, euint16, euint32, euint64, euint128, euint256, eaddress

***

### FhevmChain

> **FhevmChain** = `object`

Defined in: [chains/types.ts:5](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L5)

FhevmChain defines the configuration for an FHE-enabled blockchain network.
Similar to wagmi's Chain type but specific to FHE operations.

#### Properties

##### aclAddress?

> `optional` **aclAddress**: `` `0x${string}` ``

Defined in: [chains/types.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L17)

ACL contract address - controls FHE access permissions

##### gatewayUrl?

> `optional` **gatewayUrl**: `string`

Defined in: [chains/types.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L19)

Gateway URL for relayer operations (production chains)

##### id

> **id**: `number`

Defined in: [chains/types.ts:7](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L7)

Unique chain identifier

##### inputVerifierAddress?

> `optional` **inputVerifierAddress**: `` `0x${string}` ``

Defined in: [chains/types.ts:23](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L23)

Input verifier contract address

##### isMock

> **isMock**: `boolean`

Defined in: [chains/types.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L13)

Whether this is a mock/local chain (uses hardhat plugin mock mode)

##### kmsVerifierAddress?

> `optional` **kmsVerifierAddress**: `` `0x${string}` ``

Defined in: [chains/types.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L21)

KMS verifier contract address

##### name

> **name**: `string`

Defined in: [chains/types.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L9)

Human-readable chain name

##### network

> **network**: `string`

Defined in: [chains/types.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L11)

Network identifier (e.g., 'sepolia', 'hardhat')

##### relayerUrl?

> `optional` **relayerUrl**: `string`

Defined in: [chains/types.ts:25](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L25)

Relayer URL for encrypted transaction relay

##### rpcUrl?

> `optional` **rpcUrl**: `string`

Defined in: [chains/types.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L15)

RPC URL for the chain (required for mock chains)

***

### FhevmCreateInstanceType()

> **FhevmCreateInstanceType** = () => `Promise`\<[`FhevmInstance`](#fhevminstance)\>

Defined in: [internal/fhevmTypes.ts:41](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L41)

#### Returns

`Promise`\<[`FhevmInstance`](#fhevminstance)\>

***

### FhevmDecryptionSignatureType

> **FhevmDecryptionSignatureType** = `object`

Defined in: [fhevmTypes.ts:13](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L13)

#### Properties

##### contractAddresses

> **contractAddresses**: `` `0x${string}` ``[]

Defined in: [fhevmTypes.ts:20](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L20)

##### durationDays

> **durationDays**: `number`

Defined in: [fhevmTypes.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L18)

##### eip712

> **eip712**: [`EIP712Type`](#eip712type)

Defined in: [fhevmTypes.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L21)

##### privateKey

> **privateKey**: `string`

Defined in: [fhevmTypes.ts:15](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L15)

##### publicKey

> **publicKey**: `string`

Defined in: [fhevmTypes.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L14)

##### signature

> **signature**: `string`

Defined in: [fhevmTypes.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L16)

##### startTimestamp

> **startTimestamp**: `number`

Defined in: [fhevmTypes.ts:17](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L17)

##### userAddress

> **userAddress**: `` `0x${string}` ``

Defined in: [fhevmTypes.ts:19](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L19)

***

### FhevmInitSDKOptions

> **FhevmInitSDKOptions** = `object`

Defined in: [internal/fhevmTypes.ts:32](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L32)

Options for initializing the FHEVM SDK.

#### Properties

##### kmsParams?

> `optional` **kmsParams**: [`KmsInitParams`](#kmsinitparams)

Defined in: [internal/fhevmTypes.ts:36](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L36)

Key Management Service parameters

##### tfheParams?

> `optional` **tfheParams**: [`TfheInitParams`](#tfheinitparams)

Defined in: [internal/fhevmTypes.ts:34](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L34)

TFHE cryptographic library parameters

##### thread?

> `optional` **thread**: `number`

Defined in: [internal/fhevmTypes.ts:38](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L38)

Number of threads for WASM execution

***

### FhevmInitSDKType()

> **FhevmInitSDKType** = (`options?`) => `Promise`\<`boolean`\>

Defined in: [internal/fhevmTypes.ts:42](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L42)

#### Parameters

##### options?

[`FhevmInitSDKOptions`](#fhevminitsdkoptions)

#### Returns

`Promise`\<`boolean`\>

***

### FhevmInstance

> **FhevmInstance** = `_FhevmInstance`

Defined in: [fhevmTypes.ts:8](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L8)

***

### FhevmInstanceConfig

> **FhevmInstanceConfig** = `_FhevmInstanceConfig`

Defined in: [fhevmTypes.ts:9](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L9)

***

### FhevmLoadSDKType()

> **FhevmLoadSDKType** = () => `Promise`\<`void`\>

Defined in: [internal/fhevmTypes.ts:43](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L43)

#### Returns

`Promise`\<`void`\>

***

### FhevmMockChain

> **FhevmMockChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: [chains/types.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L31)

Configuration for mock chains that auto-fetch metadata from the node

#### Type Declaration

##### isMock

> **isMock**: `true`

##### rpcUrl

> **rpcUrl**: `string`

***

### FhevmProductionChain

> **FhevmProductionChain** = [`FhevmChain`](#fhevmchain) & `object`

Defined in: [chains/types.ts:39](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/types.ts#L39)

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

### FhevmQueryKey

> **FhevmQueryKey** = *typeof* [`all`](#all) \| `ReturnType`\<*typeof* [`decrypt`](#decrypt-3)\> \| `ReturnType`\<*typeof* [`decryptHandle`](#decrypthandle)\> \| `ReturnType`\<*typeof* [`decryptBatch`](#decryptbatch)\> \| `ReturnType`\<*typeof* [`publicDecrypt`](#publicdecrypt-2)\> \| `ReturnType`\<*typeof* [`publicDecryptHandle`](#publicdecrypthandle)\> \| `ReturnType`\<*typeof* [`publicDecryptBatch`](#publicdecryptbatch)\> \| `ReturnType`\<*typeof* [`signature`](#signature-3)\> \| `ReturnType`\<*typeof* [`signatureFor`](#signaturefor)\> \| `ReturnType`\<*typeof* [`encrypt`](#encrypt-2)\> \| `ReturnType`\<*typeof* [`encryptFor`](#encryptfor)\> \| `ReturnType`\<*typeof* [`instance`](#instance-3)\> \| `ReturnType`\<*typeof* [`instanceFor`](#instancefor)\> \| `ReturnType`\<*typeof* [`transfer`](#transfer-1)\> \| `ReturnType`\<*typeof* [`transferFor`](#transferfor)\> \| `ReturnType`\<*typeof* [`shield`](#shield-1)\> \| `ReturnType`\<*typeof* [`shieldFor`](#shieldfor)\> \| `ReturnType`\<*typeof* [`unshield`](#unshield-1)\> \| `ReturnType`\<*typeof* [`unshieldFor`](#unshieldfor)\> \| `ReturnType`\<*typeof* [`balance`](#balance)\> \| `ReturnType`\<*typeof* [`balanceFor`](#balancefor)\> \| `ReturnType`\<*typeof* [`balances`](#balances)\>

Defined in: [react/queryKeys.ts:135](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/queryKeys.ts#L135)

Type helper for query key arrays

***

### FhevmRelayerSDKType

> **FhevmRelayerSDKType** = `object`

Defined in: [internal/fhevmTypes.ts:46](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L46)

#### Properties

##### \_\_initialized\_\_?

> `optional` **\_\_initialized\_\_**: `boolean`

Defined in: [internal/fhevmTypes.ts:50](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L50)

##### createInstance()

> **createInstance**: (`config`) => `Promise`\<[`FhevmInstance`](#fhevminstance)\>

Defined in: [internal/fhevmTypes.ts:48](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L48)

###### Parameters

###### config

[`FhevmInstanceConfig`](#fhevminstanceconfig)

###### Returns

`Promise`\<[`FhevmInstance`](#fhevminstance)\>

##### initSDK

> **initSDK**: [`FhevmInitSDKType`](#fhevminitsdktype)

Defined in: [internal/fhevmTypes.ts:47](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L47)

##### SepoliaConfig

> **SepoliaConfig**: [`FhevmInstanceConfig`](#fhevminstanceconfig)

Defined in: [internal/fhevmTypes.ts:49](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L49)

***

### FhevmStatus

> **FhevmStatus** = `"idle"` \| `"initializing"` \| `"ready"` \| `"error"`

Defined in: [react/context.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/context.ts#L11)

Status of the FHEVM instance initialization.

***

### FhevmWindowType

> **FhevmWindowType** = `object`

Defined in: [internal/fhevmTypes.ts:52](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L52)

#### Properties

##### relayerSDK

> **relayerSDK**: [`FhevmRelayerSDKType`](#fhevmrelayersdktype)

Defined in: [internal/fhevmTypes.ts:53](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L53)

***

### HandleContractPair

> **HandleContractPair** = `_HandleContractPair`

Defined in: [fhevmTypes.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L10)

***

### IsFhevmSupportedType()

> **IsFhevmSupportedType** = (`chainId`) => `boolean`

Defined in: [internal/fhevmTypes.ts:44](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/fhevmTypes.ts#L44)

#### Parameters

##### chainId

`number`

#### Returns

`boolean`

***

### ShieldStatus

> **ShieldStatus** = `"idle"` \| `"checking-allowance"` \| `"approving"` \| `"wrapping"` \| `"confirming"` \| `"success"` \| `"error"`

Defined in: [types/shield.ts:5](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L5)

Types for shield (ERC20 → ERC7984) and unshield (ERC7984 → ERC20) operations.

***

### SignerParams

> **SignerParams** = \{ `address`: `` `0x${string}` ``; `provider`: [`Eip1193Provider`](#eip1193provider); `wallet?`: `undefined`; \} \| \{ `address?`: `undefined`; `provider?`: `undefined`; `wallet`: [`FhevmWallet`](#fhevmwallet); \}

Defined in: [FhevmDecryptionSignature.ts:85](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/FhevmDecryptionSignature.ts#L85)

Parameters for signing a decryption request.
Supports both the legacy EIP-1193 provider path and the new FhevmWallet path.

#### Type Declaration

\{ `address`: `` `0x${string}` ``; `provider`: [`Eip1193Provider`](#eip1193provider); `wallet?`: `undefined`; \}

##### address

> **address**: `` `0x${string}` ``

User's wallet address

##### provider

> **provider**: [`Eip1193Provider`](#eip1193provider)

EIP-1193 provider (window.ethereum, wagmi connector, etc.)

##### wallet?

> `optional` **wallet**: `undefined`

\{ `address?`: `undefined`; `provider?`: `undefined`; `wallet`: [`FhevmWallet`](#fhevmwallet); \}

##### address?

> `optional` **address**: `undefined`

##### provider?

> `optional` **provider**: `undefined`

##### wallet

> **wallet**: [`FhevmWallet`](#fhevmwallet)

FhevmWallet for direct signing (preferred)

***

### TransferStatus

> **TransferStatus** = `"idle"` \| `"encrypting"` \| `"signing"` \| `"confirming"` \| `"success"` \| `"error"`

Defined in: [types/transfer.ts:6](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/transfer.ts#L6)

Transfer status for tracking the confidential transfer flow.

***

### UnshieldStatus

> **UnshieldStatus** = `"idle"` \| `"encrypting"` \| `"signing"` \| `"confirming"` \| `"decrypting"` \| `"finalizing"` \| `"success"` \| `"error"`

Defined in: [types/shield.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/types/shield.ts#L14)

***

### UserDecryptResults

> **UserDecryptResults** = `_UserDecryptResults`

Defined in: [fhevmTypes.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/fhevmTypes.ts#L11)

## Variables

### ERC20\_ABI

> `const` **ERC20\_ABI**: readonly \[\{ `inputs`: readonly \[\{ `name`: `"spender"`; `type`: `"address"`; \}, \{ `name`: `"amount"`; `type`: `"uint256"`; \}\]; `name`: `"approve"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"owner"`; `type`: `"address"`; \}, \{ `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"allowance"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"balanceOf"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"decimals"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"uint8"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"symbol"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"name"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}\]

Defined in: [abi/ERC20.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/abi/ERC20.ts#L4)

Minimal ERC20 ABI for approve, allowance, and balance operations.

***

### ERC20TOERC7984\_ABI

> `const` **ERC20TOERC7984\_ABI**: readonly \[\{ `inputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"constructor"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}\]; `name`: `"AddressEmptyCode"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"implementation"`; `type`: `"address"`; \}\]; `name`: `"ERC1967InvalidImplementation"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"ERC1967NonPayable"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"requestId"`; `type`: `"uint256"`; \}\]; `name`: `"ERC7984InvalidGatewayRequest"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"receiver"`; `type`: `"address"`; \}\]; `name`: `"ERC7984InvalidReceiver"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"receiver"`; `type`: `"address"`; \}\]; `name`: `"ERC7984InvalidReceiver"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"sender"`; `type`: `"address"`; \}\]; `name`: `"ERC7984InvalidSender"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"ERC7984TotalSupplyOverflow"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"caller"`; `type`: `"address"`; \}\]; `name`: `"ERC7984UnauthorizedCaller"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"holder"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"ERC7984UnauthorizedSpender"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"address"`; `name`: `"user"`; `type`: `"address"`; \}\]; `name`: `"ERC7984UnauthorizedUseOfEncryptedAmount"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"holder"`; `type`: `"address"`; \}\]; `name`: `"ERC7984ZeroBalance"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"FailedCall"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"InvalidInitialization"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"InvalidKMSSignatures"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"InvalidUnwrapRequest"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"NotInitializing"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"owner"`; `type`: `"address"`; \}\]; `name`: `"OwnableInvalidOwner"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"OwnableUnauthorizedAccount"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"uint8"`; `name`: `"bits"`; `type`: `"uint8"`; \}, \{ `internalType`: `"uint256"`; `name`: `"value"`; `type`: `"uint256"`; \}\]; `name`: `"SafeCastOverflowedUintDowncast"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"token"`; `type`: `"address"`; \}\]; `name`: `"SafeERC20FailedOperation"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"bytes32"`; `name`: `"handle"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"address"`; `name`: `"sender"`; `type`: `"address"`; \}\]; `name`: `"SenderNotAllowedToUseHandle"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"UUPSUnauthorizedCallContext"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"bytes32"`; `name`: `"slot"`; `type`: `"bytes32"`; \}\]; `name`: `"UUPSUnsupportedProxiableUUID"`; `type`: `"error"`; \}, \{ `inputs`: readonly \[\]; `name`: `"ZamaProtocolUnsupported"`; `type`: `"error"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"euint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"requester"`; `type`: `"address"`; \}\]; `name`: `"AmountDiscloseRequested"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"euint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `indexed`: `false`; `internalType`: `"uint64"`; `name`: `"amount"`; `type`: `"uint64"`; \}\]; `name`: `"AmountDisclosed"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"ConfidentialTransfer"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `false`; `internalType`: `"uint64"`; `name`: `"version"`; `type`: `"uint64"`; \}\]; `name`: `"Initialized"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"holder"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"operator"`; `type`: `"address"`; \}, \{ `indexed`: `false`; `internalType`: `"uint48"`; `name`: `"until"`; `type`: `"uint48"`; \}\]; `name`: `"OperatorSet"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"previousOwner"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"newOwner"`; `type`: `"address"`; \}\]; `name`: `"OwnershipTransferStarted"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"previousOwner"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"newOwner"`; `type`: `"address"`; \}\]; `name`: `"OwnershipTransferred"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `false`; `internalType`: `"bytes32[]"`; `name`: `"handlesList"`; `type`: `"bytes32[]"`; \}, \{ `indexed`: `false`; `internalType`: `"bytes"`; `name`: `"abiEncodedCleartexts"`; `type`: `"bytes"`; \}\]; `name`: `"PublicDecryptionVerified"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"receiver"`; `type`: `"address"`; \}, \{ `indexed`: `false`; `internalType`: `"euint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `indexed`: `false`; `internalType`: `"uint64"`; `name`: `"cleartextAmount"`; `type`: `"uint64"`; \}\]; `name`: `"UnwrapFinalized"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"receiver"`; `type`: `"address"`; \}, \{ `indexed`: `false`; `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"UnwrapRequested"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"implementation"`; `type`: `"address"`; \}\]; `name`: `"Upgraded"`; `type`: `"event"`; \}, \{ `inputs`: readonly \[\]; `name`: `"UPGRADE_INTERFACE_VERSION"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"acceptOwnership"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"confidentialBalanceOf"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"confidentialProtocolId"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"confidentialTotalSupply"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"externalEuint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferAndCall"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"externalEuint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"inputProof"`; `type`: `"bytes"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferAndCall"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"externalEuint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferFrom"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"confidentialTransferFrom"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"externalEuint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"inputProof"`; `type`: `"bytes"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferFromAndCall"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferFromAndCall"`; `outputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"transferred"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"contractURI"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"decimals"`; `outputs`: readonly \[\{ `internalType`: `"uint8"`; `name`: `""`; `type`: `"uint8"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"uint64"`; `name`: `"cleartextAmount"`; `type`: `"uint64"`; \}, \{ `internalType`: `"bytes"`; `name`: `"decryptionProof"`; `type`: `"bytes"`; \}\]; `name`: `"discloseEncryptedAmount"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"burntAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"uint64"`; `name`: `"burntAmountCleartext"`; `type`: `"uint64"`; \}, \{ `internalType`: `"bytes"`; `name`: `"decryptionProof"`; `type`: `"bytes"`; \}\]; `name`: `"finalizeUnwrap"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"string"`; `name`: `"name_"`; `type`: `"string"`; \}, \{ `internalType`: `"string"`; `name`: `"symbol_"`; `type`: `"string"`; \}, \{ `internalType`: `"string"`; `name`: `"contractURI_"`; `type`: `"string"`; \}, \{ `internalType`: `"contract IERC20"`; `name`: `"underlying_"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"owner_"`; `type`: `"address"`; \}\]; `name`: `"initialize"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"holder"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"isOperator"`; `outputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"maxTotalSupply"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"name"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `""`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"uint256"`; `name`: `"amount"`; `type`: `"uint256"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"onTransferReceived"`; `outputs`: readonly \[\{ `internalType`: `"bytes4"`; `name`: `""`; `type`: `"bytes4"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"owner"`; `outputs`: readonly \[\{ `internalType`: `"address"`; `name`: `""`; `type`: `"address"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"pendingOwner"`; `outputs`: readonly \[\{ `internalType`: `"address"`; `name`: `""`; `type`: `"address"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"proxiableUUID"`; `outputs`: readonly \[\{ `internalType`: `"bytes32"`; `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"rate"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"renounceOwnership"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"euint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}\]; `name`: `"requestDiscloseEncryptedAmount"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"operator"`; `type`: `"address"`; \}, \{ `internalType`: `"uint48"`; `name`: `"until"`; `type`: `"uint48"`; \}\]; `name`: `"setOperator"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"bytes4"`; `name`: `"interfaceId"`; `type`: `"bytes4"`; \}\]; `name`: `"supportsInterface"`; `outputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"symbol"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"totalSupply"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"newOwner"`; `type`: `"address"`; \}\]; `name`: `"transferOwnership"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"underlying"`; `outputs`: readonly \[\{ `internalType`: `"address"`; `name`: `""`; `type`: `"address"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"externalEuint64"`; `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `internalType`: `"bytes"`; `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"unwrap"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"euint64"`; `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"unwrap"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"newImplementation"`; `type`: `"address"`; \}, \{ `internalType`: `"bytes"`; `name`: `"data"`; `type`: `"bytes"`; \}\]; `name`: `"upgradeToAndCall"`; `outputs`: readonly \[\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"uint256"`; `name`: `"amount"`; `type`: `"uint256"`; \}\]; `name`: `"wrap"`; `outputs`: readonly \[\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}\]

Defined in: [abi/erc20toerc7984.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/abi/erc20toerc7984.ts#L4)

Full ERC20-to-ERC7984 wrapper ABI.

***

### ERC7984\_ABI

> `const` **ERC7984\_ABI**: readonly \[\{ `inputs`: readonly \[\{ `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"confidentialBalanceOf"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"owner"`; `type`: `"address"`; \}, \{ `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"confidentialAllowance"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"amount"`; `type`: `"bytes32"`; \}\]; `name`: `"confidentialTransfer"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"spender"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialApprove"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `name`: `"from"`; `type`: `"address"`; \}, \{ `name`: `"to"`; `type`: `"address"`; \}, \{ `name`: `"encryptedAmount"`; `type`: `"bytes32"`; \}, \{ `name`: `"inputProof"`; `type`: `"bytes"`; \}\]; `name`: `"confidentialTransferFrom"`; `outputs`: readonly \[\{ `name`: `""`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}\]

Defined in: [abi/erc7984.ts:4](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/abi/erc7984.ts#L4)

Full ERC7984 ABI including balance and approval functions.

***

### fhevmKeys

> `const` **fhevmKeys**: `object`

Defined in: [react/queryKeys.ts:21](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/queryKeys.ts#L21)

Query key factory for FHEVM TanStack Query operations.

Following TanStack Query best practices for hierarchical keys:
- Keys are arrays for granular invalidation
- More specific keys extend from broader ones
- Use factory functions for type safety

#### Type Declaration

##### all

> `readonly` **all**: readonly \[`"fhevm"`\]

Root key for all FHEVM queries

##### balance()

> `readonly` **balance**: () => readonly \[`"fhevm"`, `"balance"`\]

Base key for all balance queries

###### Returns

readonly \[`"fhevm"`, `"balance"`\]

##### balanceFor()

> `readonly` **balanceFor**: (`chainId`, `contractAddress`, `account`) => readonly \[`"fhevm"`, `"balance"`, `number`, `string`, `string`\]

Key for a single confidential balance

###### Parameters

###### chainId

`number`

###### contractAddress

`string`

###### account

`string`

###### Returns

readonly \[`"fhevm"`, `"balance"`, `number`, `string`, `string`\]

##### balances()

> `readonly` **balances**: (`chainId`, `contractAddresses`, `account`) => readonly \[`"fhevm"`, `"balance"`, `number`, `"batch"`, `string`, `string`\]

Key for batch confidential balance queries

###### Parameters

###### chainId

`number`

###### contractAddresses

`string`[]

###### account

`string`

###### Returns

readonly \[`"fhevm"`, `"balance"`, `number`, `"batch"`, `string`, `string`\]

##### decrypt()

> `readonly` **decrypt**: () => readonly \[`"fhevm"`, `"decrypt"`\]

Base key for all decryption queries

###### Returns

readonly \[`"fhevm"`, `"decrypt"`\]

##### decryptBatch()

> `readonly` **decryptBatch**: (`chainId`, `handles`) => readonly \[`"fhevm"`, `"decrypt"`, `number`, `"batch"`, `string`\]

Key for batch decryption results

###### Parameters

###### chainId

`number`

###### handles

`string`[]

###### Returns

readonly \[`"fhevm"`, `"decrypt"`, `number`, `"batch"`, `string`\]

##### decryptHandle()

> `readonly` **decryptHandle**: (`chainId`, `handle`, `contractAddress`) => readonly \[`"fhevm"`, `"decrypt"`, `number`, `string`, `string`\]

Key for a specific decrypted handle value

###### Parameters

###### chainId

`number`

###### handle

`string`

###### contractAddress

`string`

###### Returns

readonly \[`"fhevm"`, `"decrypt"`, `number`, `string`, `string`\]

##### encrypt()

> `readonly` **encrypt**: () => readonly \[`"fhevm"`, `"encrypt"`\]

Base key for all encryption mutations

###### Returns

readonly \[`"fhevm"`, `"encrypt"`\]

##### encryptFor()

> `readonly` **encryptFor**: (`chainId`, `contractAddress`) => readonly \[`"fhevm"`, `"encrypt"`, `number`, `string`\]

Key for tracking encryption to a specific contract

###### Parameters

###### chainId

`number`

###### contractAddress

`string`

###### Returns

readonly \[`"fhevm"`, `"encrypt"`, `number`, `string`\]

##### instance()

> `readonly` **instance**: () => readonly \[`"fhevm"`, `"instance"`\]

Base key for FHEVM instance queries

###### Returns

readonly \[`"fhevm"`, `"instance"`\]

##### instanceFor()

> `readonly` **instanceFor**: (`chainId`) => readonly \[`"fhevm"`, `"instance"`, `number`\]

Key for instance on a specific chain

###### Parameters

###### chainId

`number`

###### Returns

readonly \[`"fhevm"`, `"instance"`, `number`\]

##### publicDecrypt()

> `readonly` **publicDecrypt**: () => readonly \[`"fhevm"`, `"publicDecrypt"`\]

Base key for all public decryption queries

###### Returns

readonly \[`"fhevm"`, `"publicDecrypt"`\]

##### publicDecryptBatch()

> `readonly` **publicDecryptBatch**: (`chainId`, `handles`) => readonly \[`"fhevm"`, `"publicDecrypt"`, `number`, `"batch"`, `string`\]

Key for batch public decryption results

###### Parameters

###### chainId

`number`

###### handles

`string`[]

###### Returns

readonly \[`"fhevm"`, `"publicDecrypt"`, `number`, `"batch"`, `string`\]

##### publicDecryptHandle()

> `readonly` **publicDecryptHandle**: (`chainId`, `handle`) => readonly \[`"fhevm"`, `"publicDecrypt"`, `number`, `string`\]

Key for a specific publicly decrypted handle value

###### Parameters

###### chainId

`number`

###### handle

`string`

###### Returns

readonly \[`"fhevm"`, `"publicDecrypt"`, `number`, `string`\]

##### shield()

> `readonly` **shield**: () => readonly \[`"fhevm"`, `"shield"`\]

Base key for all shield (ERC20 → ERC7984) mutations

###### Returns

readonly \[`"fhevm"`, `"shield"`\]

##### shieldFor()

> `readonly` **shieldFor**: (`chainId`, `wrapperAddress`) => readonly \[`"fhevm"`, `"shield"`, `number`, `string`\]

Key for shield operations to a specific wrapper contract

###### Parameters

###### chainId

`number`

###### wrapperAddress

`string`

###### Returns

readonly \[`"fhevm"`, `"shield"`, `number`, `string`\]

##### signature()

> `readonly` **signature**: () => readonly \[`"fhevm"`, `"signature"`\]

Base key for all signature queries

###### Returns

readonly \[`"fhevm"`, `"signature"`\]

##### signatureFor()

> `readonly` **signatureFor**: (`chainId`, `address`) => readonly \[`"fhevm"`, `"signature"`, `number`, `string`\]

Key for a user's decryption signature on a specific chain

###### Parameters

###### chainId

`number`

###### address

`string`

###### Returns

readonly \[`"fhevm"`, `"signature"`, `number`, `string`\]

##### transfer()

> `readonly` **transfer**: () => readonly \[`"fhevm"`, `"transfer"`\]

Base key for all confidential transfer mutations

###### Returns

readonly \[`"fhevm"`, `"transfer"`\]

##### transferFor()

> `readonly` **transferFor**: (`chainId`, `contractAddress`) => readonly \[`"fhevm"`, `"transfer"`, `number`, `string`\]

Key for transfers to a specific ERC7984 contract

###### Parameters

###### chainId

`number`

###### contractAddress

`string`

###### Returns

readonly \[`"fhevm"`, `"transfer"`, `number`, `string`\]

##### unshield()

> `readonly` **unshield**: () => readonly \[`"fhevm"`, `"unshield"`\]

Base key for all unshield (ERC7984 → ERC20) mutations

###### Returns

readonly \[`"fhevm"`, `"unshield"`\]

##### unshieldFor()

> `readonly` **unshieldFor**: (`chainId`, `wrapperAddress`) => readonly \[`"fhevm"`, `"unshield"`, `number`, `string`\]

Key for unshield operations from a specific wrapper contract

###### Parameters

###### chainId

`number`

###### wrapperAddress

`string`

###### Returns

readonly \[`"fhevm"`, `"unshield"`, `number`, `string`\]

#### Example

```typescript
// Invalidate all FHEVM queries
queryClient.invalidateQueries({ queryKey: fhevmKeys.all })

// Invalidate all decryption queries
queryClient.invalidateQueries({ queryKey: fhevmKeys.decrypt() })

// Get cached value for specific handle
queryClient.getQueryData(fhevmKeys.decryptHandle(chainId, handle, contract))
```

***

### fhevmQueryClient

> `const` **fhevmQueryClient**: `QueryClient`

Defined in: [react/queryClient.ts:18](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/queryClient.ts#L18)

SDK-specific QueryClient instance for FHEVM operations.

This client is used internally by the SDK for:
- Caching decrypted values
- Managing signature state
- Deduplicating encryption/decryption requests

Default options:
- staleTime: 5 minutes (decrypted values don't change)
- gcTime: 30 minutes (keep in cache for reuse)
- retry: 1 for queries (network issues)
- retry: 0 for mutations (user-initiated, don't auto-retry)
- refetchOnWindowFocus: false (FHE data is stable)

***

### hardhatLocal

> `const` **hardhatLocal**: [`FhevmMockChain`](#fhevmmockchain)

Defined in: [chains/hardhat.ts:11](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/hardhat.ts#L11)

Hardhat local development chain.
Uses the FHEVM hardhat plugin in mock mode.

Contract addresses are automatically fetched from the node
via the `fhevm_relayer_metadata` RPC call.

***

### InMemoryStorageProvider

> `const` **InMemoryStorageProvider**: `React.FC`\<`InMemoryStorageProviderProps`\>

Defined in: [react/useInMemoryStorage.tsx:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/react/useInMemoryStorage.tsx#L24)

***

### localStorageAdapter

> `const` **localStorageAdapter**: [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:111](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L111)

localStorage storage instance.
Data persists across sessions.

***

### memoryStorage

> `const` **memoryStorage**: [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:45](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L45)

Singleton memory storage instance.
Keys are cleared on page refresh.

***

### noopStorage

> `const` **noopStorage**: [`FhevmStorage`](#fhevmstorage)

Defined in: [config.ts:16](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/config.ts#L16)

No-op storage implementation for SSR or when persistence is not needed.

***

### noOpStorage

> `const` **noOpStorage**: [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:186](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L186)

No-op storage instance.
Use this to disable signature caching entirely.
Users will need to re-sign on every decrypt operation.

***

### RELAYER\_SDK\_FALLBACK\_URL

> `const` **RELAYER\_SDK\_FALLBACK\_URL**: `string` \| `undefined` = `undefined`

Defined in: [internal/constants.ts:30](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/constants.ts#L30)

Fallback CDN URL for the relayer SDK script.
Used if the primary CDN fails and no custom fallback is provided.

***

### RELAYER\_SDK\_INTEGRITY

> `const` **RELAYER\_SDK\_INTEGRITY**: `string` \| `undefined` = `undefined`

Defined in: [internal/constants.ts:24](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/constants.ts#L24)

Subresource Integrity (SRI) hash for the relayer SDK script.
This hash is used to verify the integrity of the script loaded from CDN.
Format: algorithm-base64hash (e.g., "sha384-...")

To generate this hash:
1. Download the script: curl -O https://cdn.zama.org/relayer-sdk-js/0.4.0/relayer-sdk-js.umd.cjs
2. Generate hash: openssl dgst -sha384 -binary relayer-sdk-js.umd.cjs | openssl base64 -A
3. Prepend "sha384-" to the result

#### See

https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity

***

### RELAYER\_SDK\_URL

> `const` **RELAYER\_SDK\_URL**: `"https://cdn.zama.org/relayer-sdk-js/0.4.0/relayer-sdk-js.umd.cjs"`

Defined in: [internal/constants.ts:10](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/constants.ts#L10)

CDN URL for the relayer SDK script.

***

### RELAYER\_SDK\_VERSION

> `const` **RELAYER\_SDK\_VERSION**: `"0.4.0"` = `"0.4.0"`

Defined in: [internal/constants.ts:5](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/constants.ts#L5)

Relayer SDK version locked in the @zama-fhe/react-sdk.
Users don't need to manage this - it's handled internally.

***

### ~~SDK\_CDN\_URL~~

> `const` **SDK\_CDN\_URL**: `"https://cdn.zama.org/relayer-sdk-js/0.4.0/relayer-sdk-js.umd.cjs"` = `RELAYER_SDK_URL`

Defined in: [internal/constants.ts:33](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/internal/constants.ts#L33)

#### Deprecated

Use RELAYER_SDK_URL instead

***

### sepolia

> `const` **sepolia**: [`FhevmProductionChain`](#fhevmproductionchain)

Defined in: [chains/sepolia.ts:14](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/sepolia.ts#L14)

Ethereum Sepolia testnet with Zama FHE infrastructure.

This chain uses the Zama relayer SDK for encrypted operations.
Contract addresses are loaded from the SDK at runtime via SepoliaConfig.

Note: The actual addresses are fetched from the relayer SDK at runtime
to ensure they stay in sync with Zama's infrastructure updates.
The placeholder addresses below are overridden during initialization.

***

### SEPOLIA\_CHAIN\_ID

> `const` **SEPOLIA\_CHAIN\_ID**: `11155111` = `11155111`

Defined in: [chains/sepolia.ts:31](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/chains/sepolia.ts#L31)

Marker to indicate this chain should use SepoliaConfig from relayer SDK.
Used internally to differentiate from custom production chains.

***

### sessionStorageAdapter

> `const` **sessionStorageAdapter**: [`GenericStringStorage`](#genericstringstorage)

Defined in: [storage/adapters.ts:146](https://github.com/zama-ai/react-sdk/blob/e4afe2db935854d2dac4b83765190716f0c84929/packages/react-sdk/src/storage/adapters.ts#L146)

sessionStorage storage instance.
Data persists until the tab is closed.
