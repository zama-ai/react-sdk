# Transports

Configure RPC transports for the Core SDK.

## HTTP Transport

```typescript
import { http } from "@zama-fhe/core-sdk/transports";

const transport = http("https://rpc.example.com");
```

## Fallback Transport

```typescript
import { fallback, http } from "@zama-fhe/core-sdk/transports";

const transport = fallback([
  http("https://rpc1.example.com"),
  http("https://rpc2.example.com"),
]);
```

See the [API Reference](../api/modules/_zama-fhe_core-sdk.html) for details.
