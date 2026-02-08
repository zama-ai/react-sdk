# Architecture

How the SDK packages work together.

## Package Layering

```
@fhevm/relayer-sdk        ← Low-level FHE primitives (Zama)
        ↓
@zama-fhe/core-sdk        ← Framework-agnostic actions (ethers.js or viem)
        ↓
@zama-fhe/react-sdk       ← React hooks layer (wagmi, viem, or ethers.js)
        ↓
Your Application          ← dApps, backends, CLIs
```

See [README](../README.md) for more details.
