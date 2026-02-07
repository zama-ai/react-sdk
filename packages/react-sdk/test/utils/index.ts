// Mock providers
export {
  createMockEip1193Provider,
  createFailingProvider,
  createDelayedProvider,
  TEST_ADDRESS,
  TEST_CHAIN_ID,
} from "./mockProvider";

// Mock FHEVM instance
export {
  createMockFhevmInstance,
  createFailingFhevmInstance,
  createDelayedFhevmInstance,
  MOCK_HANDLE,
} from "./mockFhevmInstance";

// Mock wallet
export { createMockFhevmWallet } from "./mockWallet";

// Test wrappers
export {
  createTestWrapper,
  ConnectedWrapper,
  DisconnectedWrapper,
  InitializingWrapper,
  ErrorWrapper,
  type TestWrapperOptions,
} from "./testWrapper";
