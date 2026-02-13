# Function: configureLogger()

```ts
function configureLogger(options: Partial<LoggerConfig>): void;
```

Defined in: [internal/logger.ts:69](https://github.com/zama-ai/react-sdk/blob/5bfa7b8f1746f561f5c2a74a33e236c34ae3f107/packages/react-sdk/src/internal/logger.ts#L69)

Configure the logger.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | `Partial`\<`LoggerConfig`\> |

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
