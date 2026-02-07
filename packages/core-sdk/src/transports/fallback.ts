import type { Transport } from "../types/transport.js";

/**
 * Create a fallback transport that tries multiple transports in order.
 *
 * If the first transport fails, it will try the next one, and so on.
 *
 * @example
 * ```typescript
 * const transport = fallback([
 *   http('https://eth-mainnet.g.alchemy.com/v2/...'),
 *   http('https://cloudflare-eth.com'),
 *   http('https://rpc.ankr.com/eth'),
 * ])
 * ```
 */
export function fallback(transports: Transport[]): Transport {
  return {
    type: "fallback",
    config: { transports },
  };
}
