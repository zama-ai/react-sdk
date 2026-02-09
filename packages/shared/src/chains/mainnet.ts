import { defineProductionChain } from "./defineChain";
import type { FhevmProductionChain } from "./types";

/**
 * Ethereum mainnet with Zama FHE infrastructure.
 *
 * This chain uses the Zama relayer SDK for encrypted operations.
 * Contract addresses are loaded from the SDK at runtime via MainnetConfig.
 *
 * Note: The actual addresses are fetched from the relayer SDK at runtime
 * to ensure they stay in sync with Zama's infrastructure updates.
 * The placeholder addresses below are overridden during initialization.
 */
export const mainnet: FhevmProductionChain = defineProductionChain({
  id: 1,
  name: "Ethereum Mainnet",
  network: "mainnet",
  // These are placeholder values - actual addresses come from relayer SDK's MainnetConfig
  // at runtime to stay in sync with Zama's infrastructure
  aclAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  gatewayUrl: "https://gateway.zama.ai",
  kmsVerifierAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  inputVerifierAddress: "0x0000000000000000000000000000000000000000" as `0x${string}`,
  relayerUrl: "https://relayer.zama.ai",
});

/**
 * Marker to indicate this chain should use MainnetConfig from relayer SDK.
 * Used internally to differentiate from custom production chains.
 */
export const MAINNET_CHAIN_ID = 1;
