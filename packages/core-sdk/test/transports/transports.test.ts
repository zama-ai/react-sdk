import { describe, it, expect } from "vitest";
import { http } from "../../src/transports/http.js";
import { fallback } from "../../src/transports/fallback.js";
import { custom } from "../../src/transports/custom.js";

describe("Transport factories", () => {
  describe("http", () => {
    it("should create http transport with default config", () => {
      const transport = http();
      expect(transport.type).toBe("http");
      expect(transport.config).toEqual({});
    });

    it("should create http transport with URL string", () => {
      const transport = http("https://eth.llamarpc.com");
      expect(transport.type).toBe("http");
      expect(transport.config).toEqual({ url: "https://eth.llamarpc.com" });
    });

    it("should create http transport with config object", () => {
      const transport = http({ url: "https://rpc.ankr.com/eth", timeout: 10000 });
      expect(transport.type).toBe("http");
      expect(transport.config).toEqual({
        url: "https://rpc.ankr.com/eth",
        timeout: 10000,
      });
    });

    it("should create http transport with only timeout", () => {
      const transport = http({ timeout: 5000 });
      expect(transport.type).toBe("http");
      expect(transport.config).toEqual({ timeout: 5000 });
    });

    it("should handle empty config object", () => {
      const transport = http({});
      expect(transport.type).toBe("http");
      expect(transport.config).toEqual({});
    });

    it("should create different transport instances", () => {
      const transport1 = http("https://url1.com");
      const transport2 = http("https://url2.com");
      expect(transport1).not.toBe(transport2);
      expect(transport1.config).not.toBe(transport2.config);
    });
  });

  describe("fallback", () => {
    it("should create fallback transport with single transport", () => {
      const httpTransport = http("https://eth.llamarpc.com");
      const transport = fallback([httpTransport]);

      expect(transport.type).toBe("fallback");
      expect(transport.config.transports).toHaveLength(1);
      expect(transport.config.transports[0]).toBe(httpTransport);
    });

    it("should create fallback transport with multiple transports", () => {
      const transports = [
        http("https://eth-mainnet.g.alchemy.com/v2/demo"),
        http("https://cloudflare-eth.com"),
        http("https://rpc.ankr.com/eth"),
      ];
      const transport = fallback(transports);

      expect(transport.type).toBe("fallback");
      expect(transport.config.transports).toHaveLength(3);
      expect(transport.config.transports).toBe(transports);
    });

    it("should preserve transport order", () => {
      const transport1 = http("https://url1.com");
      const transport2 = http("https://url2.com");
      const transport3 = http("https://url3.com");

      const transport = fallback([transport1, transport2, transport3]);

      expect(transport.config.transports[0]).toBe(transport1);
      expect(transport.config.transports[1]).toBe(transport2);
      expect(transport.config.transports[2]).toBe(transport3);
    });

    it("should create fallback with empty array", () => {
      const transport = fallback([]);
      expect(transport.type).toBe("fallback");
      expect(transport.config.transports).toHaveLength(0);
    });

    it("should allow nested fallback transports", () => {
      const innerFallback = fallback([http("https://url1.com"), http("https://url2.com")]);
      const outerFallback = fallback([innerFallback, http("https://url3.com")]);

      expect(outerFallback.type).toBe("fallback");
      expect(outerFallback.config.transports).toHaveLength(2);
      expect(outerFallback.config.transports[0].type).toBe("fallback");
    });
  });

  describe("custom", () => {
    it("should create custom transport with provider", () => {
      const mockProvider = { request: async () => {} };
      const transport = custom({ provider: mockProvider });

      expect(transport.type).toBe("custom");
      expect(transport.config.provider).toBe(mockProvider);
    });

    it("should create custom transport with ethers-like provider", () => {
      const mockEthersProvider = {
        getNetwork: async () => ({ chainId: 1n }),
        getBlockNumber: async () => 123456,
      };
      const transport = custom({ provider: mockEthersProvider });

      expect(transport.type).toBe("custom");
      expect(transport.config.provider).toBe(mockEthersProvider);
    });

    it("should create custom transport with viem-like client", () => {
      const mockViemClient = {
        chain: { id: 1 },
        transport: { type: "http" },
      };
      const transport = custom({ provider: mockViemClient });

      expect(transport.type).toBe("custom");
      expect(transport.config.provider).toBe(mockViemClient);
    });

    it("should preserve provider reference", () => {
      const mockProvider = { custom: "provider" };
      const transport = custom({ provider: mockProvider });

      expect(transport.config.provider).toBe(mockProvider);
      expect((transport.config.provider as any).custom).toBe("provider");
    });
  });

  describe("transport type system", () => {
    it("should have correct type discriminators", () => {
      const httpTransport = http();
      const fallbackTransport = fallback([http()]);
      const customTransport = custom({ provider: {} });

      expect(httpTransport.type).toBe("http");
      expect(fallbackTransport.type).toBe("fallback");
      expect(customTransport.type).toBe("custom");
    });

    it("should allow type-based switching", () => {
      const transports = [
        http("https://url.com"),
        fallback([http()]),
        custom({ provider: {} }),
      ];

      const types = transports.map((t) => t.type);
      expect(types).toEqual(["http", "fallback", "custom"]);
    });
  });

  describe("mixed transport usage", () => {
    it("should allow combining different transport types", () => {
      const httpTransport = http("https://primary.com");
      const customTransport = custom({ provider: { request: async () => {} } });
      const fallbackTransport = fallback([httpTransport, customTransport]);

      expect(fallbackTransport.config.transports).toHaveLength(2);
      expect(fallbackTransport.config.transports[0].type).toBe("http");
      expect(fallbackTransport.config.transports[1].type).toBe("custom");
    });
  });
});
