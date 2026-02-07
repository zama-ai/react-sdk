/**
 * Options for configuring the mock relayer server.
 */
export interface MockRelayerOptions {
    /** Port to listen on (default: 8546) */
    port?: number;
    /** Simulated latency in ms (default: 0) */
    latency?: number;
    /** Error rate 0-1 for simulating failures (default: 0) */
    errorRate?: number;
    /** Whether to log requests (default: false) */
    verbose?: boolean;
}
/**
 * Job status tracking.
 */
interface Job {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    result: Record<string, string | bigint | boolean> | null;
    error: string | null;
    createdAt: number;
}
/**
 * Mock relayer server for integration testing.
 *
 * Simulates the relayer-sdk API endpoints:
 * - POST /v2/user-decrypt - Start user decryption job
 * - GET /v2/user-decrypt/:jobId - Poll job status
 * - POST /v2/input-proof - Get input proof for encryption
 * - POST /v2/public-decrypt - Start public decryption job
 * - GET /keyurl - Get public key URL
 *
 * @example
 * ```typescript
 * const relayer = new MockRelayer({ port: 8546 });
 * await relayer.start();
 *
 * // Run tests...
 *
 * await relayer.stop();
 * ```
 */
export declare class MockRelayer {
    private server;
    private jobs;
    private readonly options;
    constructor(options?: MockRelayerOptions);
    /**
     * Start the mock relayer server.
     */
    start(): Promise<void>;
    /**
     * Stop the mock relayer server.
     */
    stop(): Promise<void>;
    /**
     * Get the base URL for the mock relayer.
     */
    get baseUrl(): string;
    /**
     * Clear all jobs (for test isolation).
     */
    clearJobs(): void;
    /**
     * Get a job by ID (for test assertions).
     */
    getJob(jobId: string): Job | undefined;
    /**
     * Force complete a job with specific values (for testing).
     */
    completeJob(jobId: string, values: Record<string, string | bigint | boolean>): void;
    /**
     * Force fail a job (for testing error scenarios).
     */
    failJob(jobId: string, error: string): void;
    private log;
    private shouldSimulateError;
    private handleRequest;
    private readBody;
    private handleUserDecrypt;
    private handleInputProof;
    private handlePublicDecrypt;
    private handleKeyUrl;
    private handleHealth;
}
/**
 * Create and start a mock relayer for testing.
 * Returns a cleanup function.
 *
 * @example
 * ```typescript
 * let cleanup: () => Promise<void>;
 *
 * beforeAll(async () => {
 *   cleanup = await startMockRelayer({ port: 8546 });
 * });
 *
 * afterAll(async () => {
 *   await cleanup();
 * });
 * ```
 */
export declare function startMockRelayer(options?: MockRelayerOptions): Promise<{
    relayer: MockRelayer;
    stop: () => Promise<void>;
}>;
export {};
//# sourceMappingURL=mockRelayer.d.ts.map