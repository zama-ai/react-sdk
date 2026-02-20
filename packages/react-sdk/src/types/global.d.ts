/**
 * Global type declarations for @zama-fhe/react-sdk.
 */

import type { Eip1193Provider } from "../internal/validations/eip1193";

declare global {
  interface Window {
    /**
     * The relayer SDK loaded from CDN.
     * This is automatically loaded by FhevmProvider.
     */
    relayerSDK?: typeof import("@zama-fhe/relayer-sdk/web");

    /**
     * EIP-1193 provider injected by wallet extensions (MetaMask, etc.)
     */
    ethereum?: Eip1193Provider;
  }
}

export {};
