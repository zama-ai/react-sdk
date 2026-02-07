import { vi } from "vitest";
import { createFhevmConfig } from "../../src/config/createConfig.js";
import { http } from "../../src/transports/http.js";

/**
 * Test addresses
 */
export const TEST_ADDRESSES = {
  user: "0x1111111111111111111111111111111111111111" as `0x${string}`,
  recipient: "0x2222222222222222222222222222222222222222" as `0x${string}`,
  token: "0x3333333333333333333333333333333333333333" as `0x${string}`,
  contract: "0x4444444444444444444444444444444444444444" as `0x${string}`,
};

/**
 * Test chain IDs
 */
export const TEST_CHAIN_IDS = {
  sepolia: 11155111,
  hardhat: 31337,
};

/**
 * Create a mock ethers signer
 */
export function createMockEthersSigner(address: `0x${string}` = TEST_ADDRESSES.user) {
  const mockTxReceipt = {
    status: 1,
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  };

  const mockTxResponse = {
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" as `0x${string}`,
    wait: vi.fn().mockResolvedValue(mockTxReceipt),
  };

  return {
    sendTransaction: vi.fn().mockResolvedValue(mockTxResponse),
    getAddress: vi.fn().mockResolvedValue(address),
    provider: {
      call: vi.fn(),
    },
  };
}

/**
 * Create a mock viem wallet client
 */
export function createMockViemClient(address: `0x${string}` = TEST_ADDRESSES.user) {
  return {
    chain: { id: TEST_CHAIN_IDS.sepolia },
    transport: { type: "http" },
    account: { address },
    sendTransaction: vi
      .fn()
      .mockResolvedValue(
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" as `0x${string}`
      ),
    readContract: vi.fn(),
  };
}

/**
 * Create a mock public client for reading
 */
export function createMockPublicClient() {
  return {
    chain: { id: TEST_CHAIN_IDS.sepolia },
    transport: { type: "http" },
    readContract: vi.fn(),
  };
}

/**
 * Create test config with mock chains
 */
export function createTestConfig() {
  return createFhevmConfig({
    chains: [
      {
        id: TEST_CHAIN_IDS.sepolia,
        name: "Sepolia",
        network: "sepolia",
        isMock: false,
        aclAddress: "0x0Fa2e205445A0c5C0BC90C15FeC3b269D13C8910",
        gatewayUrl: "https://gateway.sepolia.zama.ai",
        kmsVerifierAddress: "0x208De73316E44722e16f6dDFF40881A3e4F86104",
        inputVerifierAddress: "0x2634D6f7C29Cf250e9e198d3fB332F3Cd8e10000",
        relayerUrl: "https://relayer.sepolia.zama.ai",
      },
      {
        id: TEST_CHAIN_IDS.hardhat,
        name: "Hardhat Local",
        network: "hardhat",
        isMock: true,
        rpcUrl: "http://127.0.0.1:8545",
      },
    ],
    transports: {
      [TEST_CHAIN_IDS.sepolia]: http("https://sepolia.infura.io/v3/test"),
      [TEST_CHAIN_IDS.hardhat]: http("http://127.0.0.1:8545"),
    },
  });
}

/**
 * Mock balance handle (32-byte hex string)
 */
export const MOCK_BALANCE_HANDLE =
  "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" as `0x${string}`;

/**
 * Mock encrypted handles
 */
export const MOCK_ENCRYPTED_HANDLES = [
  "0x1111111111111111111111111111111111111111111111111111111111111111" as `0x${string}`,
  "0x2222222222222222222222222222222222222222222222222222222222222222" as `0x${string}`,
];

/**
 * Mock input proof
 */
export const MOCK_INPUT_PROOF =
  "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" as `0x${string}`;

/**
 * Zero hash constant
 */
export const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
