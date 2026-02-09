[**Zama FHE SDK v0.1.0**](../../../README.md)

***

[Zama FHE SDK](../../../packages.md) / [@zama-fhe/react-sdk](../README.md) / configureLogger

# Function: configureLogger()

> **configureLogger**(`options`): `void`

Defined in: [internal/logger.ts:69](https://github.com/zama-ai/react-sdk/blob/73652ce2cd36e55c11ea775809c219de287f30ed/packages/react-sdk/src/internal/logger.ts#L69)

Configure the logger.

## Parameters

### options

`Partial`\<`LoggerConfig`\>

## Returns

`void`

## Example

```ts
import { configureLogger } from '@zama-fhe/react-sdk';

// Enable debug logging in production
configureLogger({ enabled: true });

// Change prefix
configureLogger({ prefix: '[my-app]' });
```
