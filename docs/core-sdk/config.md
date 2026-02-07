# Configuration

Learn how to configure the Core SDK for your application.

## Creating a Configuration

Use `createConfig()` to create a configuration object:

```typescript
import { createConfig } from "@zama-fhe/core-sdk";
import { sepolia, hardhatLocal } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [sepolia, hardhatLocal],
  defaultChain: sepolia,
});
```

## Configuration Options

### chains (required)

An array of chain objects defining the networks your app supports.

```typescript
import { sepolia } from "@zama-fhe/core-sdk/chains";

const config = createConfig({
  chains: [sepolia],
});
```

### defaultChain (optional)

The default chain to use when none is specified in action calls.

```typescript
const config = createConfig({
  chains: [sepolia, hardhatLocal],
  defaultChain: sepolia, // Use Sepolia by default
});
```

## Using Configuration

Pass the configuration object to all SDK actions:

```typescript
import { confidentialTransfer } from "@zama-fhe/core-sdk";

const result = await confidentialTransfer(config, {
  chainId: sepolia.chainId,
  // ... other params
});
```

## See Also

- [Chains](chains.md) - Network configuration
- [Transports](transports.md) - RPC transport setup
- [Providers](providers.md) - Provider integration
