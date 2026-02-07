# pnpm File Linking

When consuming the SDK via `"file:../react-sdk"` in pnpm, duplicate module instances can break React context. The hooks can't find the provider because they reference a different copy of `FhevmContext`.

## Symptoms

- `useFhevmContext must be used within a FhevmProvider` error even though `FhevmProvider` is present
- Hooks return `undefined` for instance/status despite successful initialization

## Workaround: Single re-export file

Create a single re-export file and import from it everywhere in your app:

```typescript
// lib/fhevm.ts
export {
  FhevmProvider,
  useFhevmStatus,
  useConfidentialBalances,
  useEthersSigner,
  useShield,
  useUnshield,
  useConfidentialTransfer,
  createFhevmConfig,
} from "@zama-fhe/react-sdk";

export { sepolia } from "@zama-fhe/react-sdk/chains";
export { memoryStorage } from "@zama-fhe/react-sdk/storage";
```

Then import from the re-export file:

```typescript
// Good — single resolution
import { useShield } from "@/lib/fhevm";

// Bad — may resolve to different copy
import { useShield } from "@zama-fhe/react-sdk";
```

## Alternative: Webpack/Next.js resolve alias

Force all imports to resolve to the same copy:

```javascript
// next.config.js
const path = require("path");

module.exports = {
  webpack: (config) => {
    config.resolve.alias["@zama-fhe/react-sdk"] = path.resolve(
      __dirname,
      "node_modules/@zama-fhe/react-sdk",
    );
    return config;
  },
};
```

## Why this happens

pnpm's strict isolation means `file:` protocol dependencies can result in two separate copies of the SDK in the module graph — one from the consuming app's `node_modules` and one from the linked path. Since React context identity depends on reference equality, two copies means `useContext` can't find the provider from the other copy.
