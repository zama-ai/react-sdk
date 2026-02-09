[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/core-sdk](../README.md) / detectProvider

# Function: detectProvider()

> **detectProvider**(`provider`): `UnifiedProvider`

Defined in: [core-sdk/src/providers/detect.ts:18](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/core-sdk/src/providers/detect.ts#L18)

Auto-detect provider type and wrap it in a UnifiedProvider.

Supports:
- ethers.js Signer/Provider
- viem WalletClient/PublicClient
- EIP-1193 providers (future)
- RPC URLs (future)

## Parameters

### provider

`unknown`

The provider to detect and wrap

## Returns

`UnifiedProvider`

UnifiedProvider instance

## Throws

Error if provider type cannot be detected
