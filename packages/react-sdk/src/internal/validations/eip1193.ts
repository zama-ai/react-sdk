/**
 * EIP-1193 utilities for provider-only SDK design.
 * No ethers.js dependency - uses raw EIP-1193 provider methods.
 */

/**
 * Standard EIP-1193 provider interface.
 * This is what window.ethereum, wagmi connectors, and viem clients all implement.
 */
export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}
