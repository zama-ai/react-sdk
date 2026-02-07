import { randomUUID } from "crypto";
import { createServer, IncomingMessage, ServerResponse, Server } from "http";
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
export class MockRelayer {
    server = null;
    jobs = new Map();
    options;
    constructor(options = {}) {
        this.options = {
            port: options.port ?? 8546,
            latency: options.latency ?? 0,
            errorRate: options.errorRate ?? 0,
            verbose: options.verbose ?? false,
        };
    }
    /**
     * Start the mock relayer server.
     */
    async start() {
        return new Promise((resolve, reject) => {
            this.server = createServer(this.handleRequest.bind(this));
            this.server.on("error", (err) => {
                reject(err);
            });
            this.server.listen(this.options.port, () => {
                this.log(`Mock relayer started on port ${this.options.port}`);
                resolve();
            });
        });
    }
    /**
     * Stop the mock relayer server.
     */
    async stop() {
        return new Promise((resolve) => {
            if (!this.server) {
                resolve();
                return;
            }
            this.server.close(() => {
                this.log("Mock relayer stopped");
                this.server = null;
                this.jobs.clear();
                resolve();
            });
        });
    }
    /**
     * Get the base URL for the mock relayer.
     */
    get baseUrl() {
        return `http://localhost:${this.options.port}`;
    }
    /**
     * Clear all jobs (for test isolation).
     */
    clearJobs() {
        this.jobs.clear();
    }
    /**
     * Get a job by ID (for test assertions).
     */
    getJob(jobId) {
        return this.jobs.get(jobId);
    }
    /**
     * Force complete a job with specific values (for testing).
     */
    completeJob(jobId, values) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = "completed";
            job.result = values;
        }
    }
    /**
     * Force fail a job (for testing error scenarios).
     */
    failJob(jobId, error) {
        const job = this.jobs.get(jobId);
        if (job) {
            job.status = "failed";
            job.error = error;
        }
    }
    log(message) {
        if (this.options.verbose) {
            console.log(`[MockRelayer] ${message}`);
        }
    }
    shouldSimulateError() {
        return Math.random() < this.options.errorRate;
    }
    async handleRequest(req, res) {
        const url = new URL(req.url ?? "/", `http://localhost:${this.options.port}`);
        this.log(`${req.method} ${url.pathname}`);
        // CORS headers
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }
        // Simulate latency
        if (this.options.latency > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.options.latency));
        }
        // Simulate random errors
        if (this.shouldSimulateError()) {
            res.writeHead(503, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Simulated service unavailable" }));
            return;
        }
        try {
            if (url.pathname.startsWith("/v2/user-decrypt")) {
                await this.handleUserDecrypt(req, res, url);
            }
            else if (url.pathname.startsWith("/v2/input-proof")) {
                await this.handleInputProof(req, res);
            }
            else if (url.pathname.startsWith("/v2/public-decrypt")) {
                await this.handlePublicDecrypt(req, res, url);
            }
            else if (url.pathname === "/keyurl" || url.pathname === "/v2/keyurl") {
                this.handleKeyUrl(res);
            }
            else if (url.pathname === "/health") {
                this.handleHealth(res);
            }
            else {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Not found" }));
            }
        }
        catch (error) {
            this.log(`Error handling request: ${error}`);
            // Only write error response if headers haven't been sent
            if (!res.headersSent) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Internal server error" }));
            }
        }
    }
    async readBody(req) {
        return new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", () => {
                resolve(body);
            });
        });
    }
    async handleUserDecrypt(req, res, url) {
        if (req.method === "POST") {
            // Create new decryption job
            const body = await this.readBody(req);
            let parsed;
            try {
                parsed = JSON.parse(body);
            }
            catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON body" }));
                return;
            }
            const jobId = randomUUID();
            const job = {
                id: jobId,
                status: "pending",
                result: null,
                error: null,
                createdAt: Date.now(),
            };
            this.jobs.set(jobId, job);
            this.log(`Created user decrypt job ${jobId}`);
            res.writeHead(202, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: { jobId } }));
            // Simulate async processing
            setTimeout(() => {
                const existingJob = this.jobs.get(jobId);
                if (existingJob && existingJob.status === "pending") {
                    existingJob.status = "completed";
                    // Generate mock decrypted values
                    const handles = parsed.handles ?? [];
                    existingJob.result = {};
                    for (const handle of handles) {
                        // Generate a mock decrypted value (random bigint)
                        existingJob.result[handle] = BigInt(Math.floor(Math.random() * 1000000));
                    }
                    this.log(`Completed user decrypt job ${jobId}`);
                }
            }, 500);
        }
        else if (req.method === "GET") {
            // Poll job status
            const pathParts = url.pathname.split("/");
            const jobId = pathParts[pathParts.length - 1];
            const job = this.jobs.get(jobId);
            if (!job) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Job not found" }));
                return;
            }
            if (job.status === "completed") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    status: "completed",
                    result: job.result,
                }));
            }
            else if (job.status === "failed") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    status: "failed",
                    error: job.error,
                }));
            }
            else {
                res.writeHead(202, {
                    "Content-Type": "application/json",
                    "Retry-After": "1",
                });
                res.end(JSON.stringify({ status: "pending" }));
            }
        }
        else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
        }
    }
    async handleInputProof(req, res) {
        if (req.method !== "POST") {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
        }
        const body = await this.readBody(req);
        let parsed;
        try {
            parsed = JSON.parse(body);
        }
        catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON body" }));
            return;
        }
        // Generate mock input proof
        const handles = parsed.handles ?? [];
        const mockHandles = handles.map(() => "0x" + "ab".repeat(32));
        const mockProof = "0x" + "cd".repeat(64);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            handles: mockHandles,
            inputProof: mockProof,
        }));
    }
    async handlePublicDecrypt(req, res, url) {
        if (req.method === "POST") {
            const body = await this.readBody(req);
            let parsed;
            try {
                parsed = JSON.parse(body);
            }
            catch {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON body" }));
                return;
            }
            const jobId = randomUUID();
            const job = {
                id: jobId,
                status: "pending",
                result: null,
                error: null,
                createdAt: Date.now(),
            };
            this.jobs.set(jobId, job);
            this.log(`Created public decrypt job ${jobId}`);
            res.writeHead(202, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ result: { jobId } }));
            // Simulate async processing
            setTimeout(() => {
                const existingJob = this.jobs.get(jobId);
                if (existingJob && existingJob.status === "pending") {
                    existingJob.status = "completed";
                    const handles = parsed.handles ?? [];
                    existingJob.result = {};
                    for (const handle of handles) {
                        existingJob.result[handle] = BigInt(Math.floor(Math.random() * 1000000));
                    }
                    this.log(`Completed public decrypt job ${jobId}`);
                }
            }, 300);
        }
        else if (req.method === "GET") {
            const pathParts = url.pathname.split("/");
            const jobId = pathParts[pathParts.length - 1];
            const job = this.jobs.get(jobId);
            if (!job) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Job not found" }));
                return;
            }
            if (job.status === "completed") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    status: "completed",
                    clearValues: job.result,
                    abiEncodedClearValues: "0x" + "00".repeat(32),
                    decryptionProof: "0x" + "ff".repeat(64),
                }));
            }
            else if (job.status === "failed") {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({
                    status: "failed",
                    error: job.error,
                }));
            }
            else {
                res.writeHead(202, {
                    "Content-Type": "application/json",
                    "Retry-After": "1",
                });
                res.end(JSON.stringify({ status: "pending" }));
            }
        }
        else {
            res.writeHead(405, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Method not allowed" }));
        }
    }
    handleKeyUrl(res) {
        // Return a mock public key
        const mockPublicKey = {
            publicKey: "0x" + "11".repeat(32),
            publicParams: {
                kmsContractAddress: "0x" + "22".repeat(20),
                aclContractAddress: "0x" + "33".repeat(20),
            },
        };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(mockPublicKey));
    }
    handleHealth(res) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", timestamp: Date.now() }));
    }
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
export async function startMockRelayer(options) {
    const relayer = new MockRelayer(options);
    await relayer.start();
    return {
        relayer,
        stop: () => relayer.stop(),
    };
}
//# sourceMappingURL=mockRelayer.js.map