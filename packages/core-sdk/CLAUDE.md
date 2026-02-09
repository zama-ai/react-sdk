# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**@zama-fhe/core-sdk** - Framework-agnostic core SDK for Fully Homomorphic Encryption (FHE) on EVM chains. Provides pure async functions for FHE operations that work seamlessly with both **ethers.js v6** and **viem v2**.

**Status:** Alpha - Core scaffold complete, pending full relayer-sdk integration.

**Dependencies:**
- `@zama-fhe/shared` (workspace) - Internal shared package containing ABIs, chains, types, and utilities
- `@zama-fhe/relayer-sdk` (0.4.0) - Zama's FHE relayer SDK

## Commands

### Development
```bash
npm install          # Install dependencies
npm run build        # Build SDK to dist/
npm run watch        # Build in watch mode
npm run clean        # Remove dist/ directory
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Linting & Type Checking
```bash
npm run lint         # ESLint
npm run lint:fix     # Fix lint issues
npm run typecheck    # TypeScript type checking (no emit)
npm run build:check  # Type check (alias for typecheck)
```

## Architecture

### Core Data Flow

```
User Code
    ↓
Actions (encrypt, writeConfidentialTransfer, etc.)
    ↓
UnifiedProvider (abstracts ethers/viem)
    ↓
@zama-fhe/relayer-sdk (FHE primitives)
    ↓
Blockchain (EVM chain)
```

### Package Structure

```
@zama-fhe/shared (internal)    ← ABIs, chains, types, utilities
    ↓
@zama-fhe/core-sdk             ← Framework-agnostic actions
    ↓
@zama-fhe/react-sdk            ← React hooks layer
```

Core-SDK imports from `@zama-fhe/shared`:
- **ABIs**: Contract ABIs (ERC7984, ERC20)
- **Chains**: Chain definitions (sepolia, hardhat)
- **Types**: Shared TypeScript types (EncryptInput, DecryptRequest, etc.)
- **Utils**: Error classes, validation functions

Core-SDK re-exports these from shared for consumer convenience.

### Directory Structure

```
src/
├── actions/          # Core FHE operations (encrypt, transfer, balance)
│   ├── encrypt.ts
│   ├── confidentialTransfer.ts
│   ├── confidentialBalance.ts
│   └── index.ts
├── providers/        # Ethers/Viem abstraction layer
│   ├── detect.ts         # Auto-detect provider type
│   ├── ethers.ts         # Ethers.js adapter
│   ├── viem.ts           # Viem adapter
│   ├── types.ts          # UnifiedProvider interface
│   └── index.ts
├── config/           # Configuration system
│   ├── createConfig.ts   # createFhevmConfig()
│   ├── types.ts          # FhevmConfig type
│   └── index.ts
├── chains/           # Chain definitions (sepolia, hardhat)
│   ├── definitions.ts
│   ├── utils.ts
│   └── index.ts
├── transports/       # Transport layer (http, custom, fallback)
│   ├── http.ts
│   ├── custom.ts
│   ├── fallback.ts
│   └── index.ts
├── types/            # TypeScript type definitions
│   ├── chain.ts          # FhevmChain, FhevmMockChain, etc.
│   ├── encryption.ts     # EncryptInput, EncryptedOutput
│   ├── decryption.ts     # DecryptRequest, SignatureData
│   ├── transport.ts      # Transport types
│   └── index.ts
├── utils/            # Utilities and error classes
│   ├── errors.ts         # FhevmError hierarchy
│   ├── validation.ts     # Address/chain validation
│   └── index.ts
├── abi/              # Smart contract ABIs
│   └── erc7984.ts
└── index.ts          # Main exports
```

### Key Architectural Decisions

1. **Provider Agnostic** - Works with both ethers.js and viem through `UnifiedProvider` abstraction:
   ```typescript
   // Auto-detects provider type
   const provider = detectProvider(signer); // ethers
   const provider = detectProvider(client); // viem
   ```

2. **Pure Functions** - All actions are stateless async functions (wagmi-core pattern):
   ```typescript
   // No global state, no classes
   const result = await writeConfidentialTransfer(config, params);
   ```

3. **Subpath Exports** - Modular imports via package.json exports:
   ```typescript
   import { createFhevmConfig } from "@zama-fhe/core-sdk";
   import { writeConfidentialTransfer } from "@zama-fhe/core-sdk/actions";
   import { sepolia } from "@zama-fhe/core-sdk/chains";
   ```

4. **No Storage Management** - SDK does not manage signature storage. Users control caching strategy.

5. **Type Safety** - Full TypeScript with discriminated unions for encryption types:
   ```typescript
   type EncryptInput =
     | { type: "bool"; value: boolean }
     | { type: "uint64"; value: bigint }
     | { type: "address"; value: `0x${string}` }
     // ... etc
   ```

### Provider Abstraction Pattern

The `UnifiedProvider` interface allows seamless switching between ethers and viem:

```typescript
// src/providers/types.ts
export interface UnifiedProvider {
  type: "ethers" | "viem";

  sendTransaction(tx: TransactionRequest): Promise<`0x${string}`>;
  readContract(params: ReadContractParams): Promise<unknown>;
  getAddress(): Promise<`0x${string}`>;
  getChainId(): Promise<number>;
}
```

**Implementation:**
- `detectProvider()` - Auto-detects ethers Signer or viem WalletClient
- `createEthersProvider()` - Wraps ethers.js Signer
- `createViemProvider()` - Wraps viem WalletClient

### Action Pattern

All actions follow this structure:

```typescript
export async function myAction(
  config: FhevmConfig,
  params: MyActionParams
): Promise<MyActionResult> {
  // 1. Validate inputs
  assertChainId(params.chainId);

  // 2. Get chain configuration
  const chain = config.getChain(params.chainId);

  // 3. Wrap provider if needed
  const provider = params.provider
    ? detectProvider(params.provider)
    : undefined;

  // 4. Execute operation
  const result = await performOperation();

  // 5. Return result
  return result;
}
```

## Current Implementation Status

### ✅ Completed
- Config system (`createFhevmConfig`)
- Provider abstraction (ethers/viem support)
- Chain definitions (sepolia, hardhatLocal)
- Transport layer (http, custom, fallback)
- Type definitions (full TypeScript coverage)
- Error classes (FhevmError hierarchy)
- Validation utilities
- `readConfidentialBalance()` - Read single balance
- `readConfidentialBalances()` - Read multiple balances

### 🚧 Pending Implementation
- `encrypt()` - Needs relayer-sdk integration
- `writeConfidentialTransfer()` - Needs proper ABI encoding
- `decrypt()` - User decryption action
- `publicDecrypt()` - Public decryption action
- `createEIP712()` - Signature generation helper
- Comprehensive test coverage
- API documentation

## TypeScript Configuration

**Strict mode enabled** with additional checks:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`
- `isolatedModules: true`
- `verbatimModuleSyntax: true`

**Module system:** ES2022 with `bundler` resolution

**Build output:** `dist/` with `.js`, `.d.ts`, `.d.ts.map`, and `.js.map` files

## Peer Dependencies

Both are **optional** - SDK works with either one:
- `ethers` ^6.0.0 - For ethers.js users
- `viem` ^2.0.0 - For viem users

Users only need to install the library they use.

## Adding a New Action

1. Create `src/actions/myAction.ts`:
   ```typescript
   import type { FhevmConfig } from "../config/index.js";

   export interface MyActionParams {
     chainId: number;
     // ... params
   }

   export async function myAction(
     config: FhevmConfig,
     params: MyActionParams
   ): Promise<MyActionResult> {
     // Implementation
   }
   ```

2. Export from `src/actions/index.ts`:
   ```typescript
   export { myAction, type MyActionParams } from "./myAction.js";
   ```

3. Re-export from `src/index.ts` if part of main API

4. Add tests in `test/myAction.test.ts`

5. Update `package.json` exports if creating new subpath

## Integration with react-sdk

The react-sdk (`@zama-fhe/react-sdk`) is the React hooks layer that wraps this core SDK:

```
@zama-fhe/relayer-sdk  ← Low-level FHE primitives (Zama)
         ↓
@zama-fhe/core-sdk     ← Framework-agnostic actions (this package)
         ↓
@zama-fhe/react-sdk    ← React hooks layer
         ↓
dApps                  ← User applications
```

The react-sdk will use core-sdk actions and add:
- React hooks (useState, useEffect, etc.)
- TanStack Query for caching
- Signature storage management
- React-specific error handling

## Common Patterns

### Using with Ethers.js

```typescript
import { ethers } from "ethers";
import { createFhevmConfig, writeConfidentialTransfer } from "@zama-fhe/core-sdk";
import { sepolia } from "@zama-fhe/core-sdk/chains";

const config = createFhevmConfig({ chains: [sepolia] });
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const result = await writeConfidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: "0x...",
  to: "0x...",
  amount: 100n,
  provider: signer, // ← Ethers signer
});
```

### Using with Viem

```typescript
import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import { createFhevmConfig, writeConfidentialTransfer } from "@zama-fhe/core-sdk";

const config = createFhevmConfig({
  chains: [{ id: sepolia.id, name: sepolia.name }]
});

const client = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const result = await writeConfidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: "0x...",
  to: "0x...",
  amount: 100n,
  provider: client, // ← Viem wallet client
});
```

### Node.js Backend Example

```typescript
import { ethers } from "ethers";
import { createFhevmConfig, writeConfidentialTransfer } from "@zama-fhe/core-sdk";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const config = createFhevmConfig({
  chains: [{ id: 11155111, name: "sepolia" }],
});

// Works perfectly in Node.js
const result = await writeConfidentialTransfer(config, {
  chainId: 11155111,
  contractAddress: process.env.TOKEN_ADDRESS as `0x${string}`,
  to: recipientAddress as `0x${string}`,
  amount: 1000n,
  provider: wallet,
});
```

## Error Handling

All actions throw typed errors:

```typescript
import {
  FhevmError,
  FhevmConfigError,
  FhevmProviderError,
  FhevmTransactionError
} from "@zama-fhe/core-sdk";

try {
  await writeConfidentialTransfer(config, params);
} catch (error) {
  if (error instanceof FhevmProviderError) {
    // Handle provider-specific errors
  } else if (error instanceof FhevmTransactionError) {
    // Handle transaction errors
  }
}
```

## Key Files to Understand

1. **`src/providers/detect.ts`** - How ethers/viem detection works
2. **`src/config/createConfig.ts`** - Configuration system
3. **`src/actions/confidentialBalance.ts`** - Example of completed action
4. **`src/types/encryption.ts`** - Type-safe encryption inputs
5. **`src/utils/errors.ts`** - Error class hierarchy

## Notes

- This is an **alpha** package - APIs may change
- The scaffold is complete, primary remaining work is relayer-sdk integration
- Follow wagmi-core patterns for consistency
- All imports use `.js` extensions (required for ES modules)
- Provider detection is automatic - users don't need to specify type
