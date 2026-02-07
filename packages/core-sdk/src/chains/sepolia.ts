import type { FhevmProductionChain } from "../types/chain.js";

/**
 * Sepolia testnet configuration for FHEVM.
 */
export const sepolia: FhevmProductionChain = {
  id: 11155111,
  name: "Sepolia",
  network: "sepolia",
  isMock: false,
  aclAddress: "0x0Fa2e205445A0c5C0BC90C15FeC3b269D13C8910",
  gatewayUrl: "https://gateway.sepolia.zama.ai",
  kmsVerifierAddress: "0x208De73316E44722e16f6dDFF40881A3e4F86104",
  inputVerifierAddress: "0x2634D6f7C29Cf250e9e198d3fB332F3Cd8e10000",
  relayerUrl: "https://relayer.sepolia.zama.ai",
};
