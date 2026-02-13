# Function: detectProvider()

```ts
function detectProvider(provider: unknown): UnifiedProvider;
```

Defined in: [core-sdk/src/providers/detect.ts:18](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/core-sdk/src/providers/detect.ts#L18)

Auto-detect provider type and wrap it in a UnifiedProvider.

Supports:
- ethers.js Signer/Provider
- viem WalletClient/PublicClient
- EIP-1193 providers (future)
- RPC URLs (future)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `provider` | `unknown` | The provider to detect and wrap |

## Returns

`UnifiedProvider`

UnifiedProvider instance

## Throws

Error if provider type cannot be detected
