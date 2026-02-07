import type { FhevmChain, FhevmMockChain, FhevmProductionChain } from "../types/chain.js";

/**
 * Helper to define a custom FHE-enabled chain.
 *
 * @example
 * ```ts
 * const myChain = defineChain({
 *   id: 123456,
 *   name: "My Custom Chain",
 *   network: "custom",
 *   isMock: false,
 *   aclAddress: "0x...",
 *   gatewayUrl: "https://gateway.custom.com",
 *   kmsVerifierAddress: "0x...",
 *   inputVerifierAddress: "0x...",
 *   relayerUrl: "https://relayer.custom.com",
 * })
 * ```
 */
export function defineChain<T extends FhevmChain>(chain: T): T {
  return chain;
}

/**
 * Helper to define a mock chain.
 */
export function defineMockChain(chain: Omit<FhevmMockChain, "isMock">): FhevmMockChain {
  return { ...chain, isMock: true };
}

/**
 * Helper to define a production chain.
 */
export function defineProductionChain(
  chain: Omit<FhevmProductionChain, "isMock">
): FhevmProductionChain {
  return { ...chain, isMock: false };
}
