import type { FhevmMockChain } from "../types/chain.js";

/**
 * Hardhat local development network configuration.
 * Uses mock mode with metadata auto-fetched from the node.
 */
export const hardhatLocal: FhevmMockChain = {
  id: 31337,
  name: "Hardhat Local",
  network: "hardhat",
  isMock: true,
  rpcUrl: "http://127.0.0.1:8545",
};
