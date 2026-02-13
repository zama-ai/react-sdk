# @zama-fhe/core-sdk

## Functions

### Config

- [createFhevmConfig](functions/createFhevmConfig.md)

### Actions

- [encrypt](functions/encrypt.md)
- [readConfidentialBalance](functions/readConfidentialBalance.md)
- [readConfidentialBalances](functions/readConfidentialBalances.md)
- [writeConfidentialTransfer](functions/writeConfidentialTransfer.md)

### Chains

- [defineChain](functions/defineChain.md)
- [defineMockChain](functions/defineMockChain.md)
- [defineProductionChain](functions/defineProductionChain.md)

### Providers

- [detectProvider](functions/detectProvider.md)

### Transports

- [custom](functions/custom.md)
- [fallback](functions/fallback.md)
- [http](functions/http.md)

## Variables

### hardhatLocal

```ts
const hardhatLocal: FhevmMockChain;
```

Defined in: shared/dist/chains/hardhat.d.ts:9

Hardhat local development chain.
Uses the FHEVM hardhat plugin in mock mode.

Contract addresses are automatically fetched from the node
via the `fhevm_relayer_metadata` RPC call.

***

### mainnet

```ts
const mainnet: FhevmProductionChain;
```

Defined in: shared/dist/chains/mainnet.d.ts:12

Ethereum mainnet with Zama FHE infrastructure.

This chain uses the Zama relayer SDK for encrypted operations.
Contract addresses are loaded from the SDK at runtime via MainnetConfig.

Note: The actual addresses are fetched from the relayer SDK at runtime
to ensure they stay in sync with Zama's infrastructure updates.
The placeholder addresses below are overridden during initialization.

***

### sepolia

```ts
const sepolia: FhevmProductionChain;
```

Defined in: shared/dist/chains/sepolia.d.ts:12

Ethereum Sepolia testnet with Zama FHE infrastructure.

This chain uses the Zama relayer SDK for encrypted operations.
Contract addresses are loaded from the SDK at runtime via SepoliaConfig.

Note: The actual addresses are fetched from the relayer SDK at runtime
to ensure they stay in sync with Zama's infrastructure updates.
The placeholder addresses below are overridden during initialization.
