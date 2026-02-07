# Architecture

How the SDK packages work together.

## Package Layering

```
@fhevm/relayer-sdk        ← Low-level FHE primitives (Zama)
        ↓
@zama-fhe/shared          ← ABIs, chains, types, utils
        ↓
@zama-fhe/core-sdk        ← Framework-agnostic actions
        ↓
@zama-fhe/react-sdk       ← React hooks layer
        ↓
Your Application          ← dApps, backends, CLIs
```

See [README](../README.md) for more details.
