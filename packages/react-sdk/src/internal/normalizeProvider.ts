"use client";

import type { Eip1193Provider } from "./validations/eip1193";

const VIEM_TYPE_MAP: Record<string, string> = {
  legacy: "0x0",
  eip2930: "0x1",
  eip1559: "0x2",
  eip4844: "0x3",
};

/**
 * Wraps an EIP-1193 provider to normalize viem-specific response formats
 * for ethers.js compatibility.
 */
export function normalizeProviderForEthers(provider: Eip1193Provider): Eip1193Provider {
  return {
    async request(args: { method: string; params?: unknown[] }) {
      const { method } = args;

      // Handle pending transaction receipts (viem throws, ethers expects null)
      if (method === "eth_getTransactionReceipt") {
        try {
          const result = await provider.request(args);
          if (!result) return null;
          return normalizeTransactionFields(result as Record<string, unknown>);
        } catch (err: any) {
          if (err?.message?.includes("could not be found")) return null;
          throw err;
        }
      }

      // Normalize transaction fields for getTransactionByHash
      if (method === "eth_getTransactionByHash") {
        const result = await provider.request(args);
        if (!result) return null;
        return normalizeTransactionFields(result as Record<string, unknown>);
      }

      return provider.request(args);
    },
  };
}

function normalizeTransactionFields(tx: Record<string, unknown>): Record<string, unknown> {
  const { type, typeHex: _, yParity: __, ...rest } = tx;

  // Convert viem string types to hex
  const normalizedType =
    typeof type === "string" && type in VIEM_TYPE_MAP ? VIEM_TYPE_MAP[type] : type;

  return { ...rest, type: normalizedType };
}
