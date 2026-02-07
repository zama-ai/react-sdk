import type { Transport, CustomTransportConfig } from "../types/transport.js";

/**
 * Create a custom transport with a provided provider.
 *
 * Use this when you want to provide your own ethers provider, viem client,
 * or other custom provider.
 *
 * @example
 * ```typescript
 * // With ethers
 * import { ethers } from 'ethers'
 * const provider = new ethers.JsonRpcProvider('https://...')
 * const transport = custom({ provider })
 *
 * // With viem
 * import { createPublicClient, http } from 'viem'
 * const client = createPublicClient({ chain: sepolia, transport: http() })
 * const transport = custom({ provider: client })
 * ```
 */
export function custom(config: CustomTransportConfig): Transport {
  return {
    type: "custom",
    config,
  };
}
