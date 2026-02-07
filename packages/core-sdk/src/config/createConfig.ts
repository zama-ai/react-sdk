import type { FhevmChain } from "../types/chain.js";
import type { Transport } from "../types/transport.js";
import type { FhevmConfig, FhevmConfigOptions } from "./types.js";

/**
 * Create an FhevmConfig for use with SDK actions.
 * Similar to wagmi's createConfig but for FHE operations.
 *
 * @example
 * ```ts
 * import { createFhevmConfig, http } from '@zama-fhe/core-sdk'
 * import { sepolia, hardhatLocal } from '@zama-fhe/core-sdk/chains'
 *
 * const config = createFhevmConfig({
 *   chains: [sepolia, hardhatLocal],
 *   transports: {
 *     [sepolia.id]: http('https://sepolia.infura.io/v3/YOUR_KEY'),
 *     [hardhatLocal.id]: http('http://localhost:8545'),
 *   },
 * })
 * ```
 */
export function createFhevmConfig(options: FhevmConfigOptions): FhevmConfig {
  const { chains, transports } = options;

  if (!chains || chains.length === 0) {
    throw new Error("createFhevmConfig: At least one chain must be provided");
  }

  // Build chain lookup map
  const chainMap = new Map<number, FhevmChain>();
  for (const chain of chains) {
    if (chainMap.has(chain.id)) {
      console.warn(
        `createFhevmConfig: Duplicate chain ID ${chain.id} (${chain.name}). Using the first definition.`
      );
      continue;
    }
    chainMap.set(chain.id, chain);

    // Validate that each chain has a transport
    if (!transports[chain.id]) {
      throw new Error(
        `createFhevmConfig: No transport configured for chain ${chain.id} (${chain.name}). ` +
          `Add a transport in the transports map.`
      );
    }
  }

  const config: FhevmConfig = {
    chains,
    transports,

    getChain(chainId: number): FhevmChain | undefined {
      return chainMap.get(chainId);
    },

    getTransport(chainId: number): Transport | undefined {
      return transports[chainId];
    },

    isMockChain(chainId: number): boolean {
      const chain = chainMap.get(chainId);
      return chain?.isMock === true;
    },

    getMockRpcUrl(chainId: number): string | undefined {
      const chain = chainMap.get(chainId);
      if (chain?.isMock && chain.rpcUrl) {
        return chain.rpcUrl;
      }
      return undefined;
    },

    _internal: {
      chainMap,
    },
  };

  return config;
}
