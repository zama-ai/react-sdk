import type { Transport, HttpTransportConfig } from "../types/transport.js";

/**
 * Create an HTTP transport for JSON-RPC connections.
 *
 * @example
 * ```typescript
 * const transport = http()
 * const transport = http({ url: 'https://eth.llamarpc.com' })
 * const transport = http({ timeout: 10_000 })
 * ```
 */
export function http(config?: HttpTransportConfig | string): Transport {
  const transportConfig: HttpTransportConfig =
    typeof config === "string" ? { url: config } : config ?? {};

  return {
    type: "http",
    config: transportConfig,
  };
}
