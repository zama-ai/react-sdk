import { createEthersProvider, isEthersProvider } from "./ethers.js";
import { createViemProvider, isViemProvider } from "./viem.js";
import type { UnifiedProvider } from "./types.js";

/**
 * Auto-detect provider type and wrap it in a UnifiedProvider.
 *
 * Supports:
 * - ethers.js Signer/Provider
 * - viem WalletClient/PublicClient
 * - EIP-1193 providers (future)
 * - RPC URLs (future)
 *
 * @param provider - The provider to detect and wrap
 * @returns UnifiedProvider instance
 * @throws Error if provider type cannot be detected
 */
export function detectProvider(provider: unknown): UnifiedProvider {
  // Check for viem client first (more specific properties)
  if (isViemProvider(provider)) {
    return createViemProvider(provider);
  }

  // Check for ethers signer/provider
  if (isEthersProvider(provider)) {
    return createEthersProvider(provider);
  }

  // Check for EIP-1193 provider
  if (
    provider &&
    typeof provider === "object" &&
    "request" in provider &&
    typeof (provider as { request: unknown }).request === "function"
  ) {
    throw new Error(
      "EIP-1193 providers are not yet supported. Please wrap in ethers.BrowserProvider or viem createWalletClient."
    );
  }

  // Check for RPC URL string
  if (typeof provider === "string") {
    throw new Error("RPC URLs are not yet supported. Please use ethers.JsonRpcProvider or viem createPublicClient.");
  }

  throw new Error(
    "Unable to detect provider type. Must be ethers.js Signer/Provider or viem WalletClient/PublicClient."
  );
}
