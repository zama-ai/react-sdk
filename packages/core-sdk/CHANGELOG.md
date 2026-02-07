# Changelog

## [0.1.0] - 2026-02-03

### Added

#### 🎉 wagmi-core Style Configuration
- **Transport System**: Now follows wagmi-core pattern with `transports` map
- `http(url?)` - HTTP transport for JSON-RPC connections
- `custom({ provider })` - Custom transport for ethers/viem providers
- `fallback([...transports])` - Fallback transport with multiple endpoints

#### Example Migration:
```typescript
// Before
const config = createFhevmConfig({
  chains: [sepolia],
})

// After (wagmi-core style)
const config = createFhevmConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
  },
})
```

#### Core Features
- ✅ **Dual Provider Support**: Works with both ethers.js v6 and viem v2
- ✅ **Configuration System**: `createFhevmConfig()` with transports
- ✅ **Chain Definitions**: Sepolia and Hardhat Local preconfigured
- ✅ **Actions**:
  - `encrypt()` - Encrypt values (scaffold)
  - `confidentialTransfer()` - ERC7984 transfers (scaffold)
  - `confidentialBalance()` - Read encrypted balance
  - `confidentialBalances()` - Read multiple balances in parallel
- ✅ **Provider Abstraction**: Auto-detects ethers vs viem
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error classes

### Architecture

Follows the proven wagmi-core pattern:
- `@fhevm/relayer-sdk` → Low-level FHE primitives
- `@zama-fhe/core-sdk` → Framework-agnostic core (this package)
- `@zama-fhe/react-sdk` → React hooks layer (future)

### Known Limitations

- `encrypt()` requires relayer-sdk integration (not yet implemented)
- `decrypt()` and `publicDecrypt()` not yet implemented
- `createEIP712()` not yet implemented
- `confidentialTransfer()` requires ABI encoding completion
- No tests yet

### Next Steps

1. Integrate `@zama-fhe/relayer-sdk` for actual encryption
2. Implement decrypt actions
3. Add comprehensive tests
4. Refactor `@zama-fhe/react-sdk` to use this core
5. Add documentation site

## [Unreleased]

### Planned
- [ ] Complete encrypt implementation with relayer-sdk
- [ ] Implement decrypt() and publicDecrypt()
- [ ] Implement createEIP712() for signatures
- [ ] Add instance caching
- [ ] Add tests (unit + integration)
- [ ] Add JSDoc documentation
- [ ] Support direct EIP-1193 providers
- [ ] Support WebSocket transports
- [ ] Add retry logic for transports
- [ ] Add request batching
