import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { JsonRpcSigner } from "ethers";
import { FhevmDecryptionSignature } from "../src/FhevmDecryptionSignature";
import type { FhevmDecryptionSignatureType, EIP712Type, FhevmInstance } from "../src/fhevmTypes";
import { GenericStringInMemoryStorage } from "../src/storage/GenericStringStorage";

/** Signing methods used by FhevmDecryptionSignature (matches relayer-sdk usage). */
type FhevmInstanceSigning = {
  createEIP712: (
    publicKey: string,
    contractAddresses: string[],
    startTimestamp: number,
    durationDays: number
  ) => EIP712Type;
  generateKeypair: () => { publicKey: string; privateKey: string };
};

const validEIP712: EIP712Type = {
  domain: {
    chainId: 1,
    name: "Test",
    verifyingContract: "0x0000000000000000000000000000000000000001",
    version: "1",
  },
  primaryType: "UserDecryptRequestVerification",
  message: {},
  types: {
    // as defined in FhevmDecryptionSignature.new
    UserDecryptRequestVerification: [
      { name: "publicKey", type: "address" },
      { name: "contractAddresses", type: "address[]" },
      { name: "startTimestamp", type: "uint256" },
      { name: "durationDays", type: "uint256" },
    ],
  },
};

function validSignatureType(
  overrides: Partial<FhevmDecryptionSignatureType> = {}
): FhevmDecryptionSignatureType {
  const now = Math.floor(Date.now() / 1000);
  return {
    publicKey: "0x" + "01".repeat(20),
    privateKey: "0xab",
    signature: "0xsignature",
    startTimestamp: now,
    durationDays: 365,
    userAddress: "0x0000000000000000000000000000000000000001",
    contractAddresses: ["0x0000000000000000000000000000000000000002"],
    eip712: validEIP712,
    ...overrides,
  };
}

const defaultSigning: FhevmInstanceSigning = {
  createEIP712: (
    publicKey: string,
    contractAddresses: string[],
    startTimestamp: number,
    durationDays: number
  ) => ({
    domain: validEIP712.domain,
    primaryType: validEIP712.primaryType,
    message: { publicKey, contractAddresses, startTimestamp, durationDays },
    types: validEIP712.types,
  }),
  generateKeypair: () => ({
    publicKey: "0xgeneratedPub",
    privateKey: "0xgeneratedPriv",
  }),
};

function createMockInstance(signingOverrides?: Partial<FhevmInstanceSigning>): FhevmInstance {
  const signing: FhevmInstanceSigning = { ...defaultSigning, ...signingOverrides };
  return { ...signing } as unknown as FhevmInstance;
}

describe("FhevmDecryptionSignature", () => {
  describe("checkIs", () => {
    it("returns false for non-objects", () => {
      expect(FhevmDecryptionSignature.checkIs(null)).toBe(false);
      expect(FhevmDecryptionSignature.checkIs(undefined)).toBe(false);
      expect(FhevmDecryptionSignature.checkIs("")).toBe(false);
      expect(FhevmDecryptionSignature.checkIs(0)).toBe(false);
    });

    it("returns false for empty object", () => {
      expect(FhevmDecryptionSignature.checkIs({})).toBe(false);
    });

    it("returns false when required string fields are missing or wrong type", () => {
      expect(FhevmDecryptionSignature.checkIs({ publicKey: 1 })).toBe(false);
      expect(FhevmDecryptionSignature.checkIs(validSignatureType({ privateKey: undefined }))).toBe(
        false
      );
      expect(
        // @ts-expect-error testing wrong type
        FhevmDecryptionSignature.checkIs(validSignatureType({ signature: 1 }))
      ).toBe(false);
    });

    it("returns false when numeric fields are wrong type", () => {
      expect(
        FhevmDecryptionSignature.checkIs(
          // @ts-expect-error testing wrong type
          validSignatureType({ startTimestamp: "1" })
        )
      ).toBe(false);
      expect(
        FhevmDecryptionSignature.checkIs(
          // @ts-expect-error testing wrong type
          validSignatureType({ durationDays: "365" })
        )
      ).toBe(false);
    });

    it("returns false when userAddress is not 0x-prefixed", () => {
      expect(
        FhevmDecryptionSignature.checkIs(
          // @ts-expect-error testing wrong type
          validSignatureType({ userAddress: "choucroute" })
        )
      ).toBe(false);
    });

    it("returns false when contractAddresses is not array or has invalid items", () => {
      expect(
        FhevmDecryptionSignature.checkIs(
          // @ts-expect-error testing wrong type
          validSignatureType({ contractAddresses: "0x1" })
        )
      ).toBe(false);
      expect(
        FhevmDecryptionSignature.checkIs(
          validSignatureType({
            // @ts-expect-error testing wrong type
            contractAddresses: ["nohex"],
          })
        )
      ).toBe(false);
    });

    it("returns false when eip712 is missing or invalid", () => {
      expect(FhevmDecryptionSignature.checkIs(validSignatureType({ eip712: undefined }))).toBe(
        false
      );
      expect(
        FhevmDecryptionSignature.checkIs(
          validSignatureType({ eip712: null as unknown as EIP712Type })
        )
      ).toBe(false);
      expect(
        FhevmDecryptionSignature.checkIs(
          // @ts-expect-error testing wrong type
          validSignatureType({ eip712: { domain: {} } })
        )
      ).toBe(false);
    });

    it("returns true for valid FhevmDecryptionSignatureType", () => {
      expect(FhevmDecryptionSignature.checkIs(validSignatureType())).toBe(true);
    });
  });

  describe("fromJSON", () => {
    it("parses JSON string", () => {
      const data = validSignatureType();
      const sig = FhevmDecryptionSignature.fromJSON(JSON.stringify(data));
      expect(sig.publicKey).toBe(data.publicKey);
      expect(sig.signature).toBe(data.signature);
    });

    it("accepts plain object", () => {
      const data = validSignatureType();
      const sig = FhevmDecryptionSignature.fromJSON(data);
      expect(sig.userAddress).toBe(data.userAddress);
      expect(sig.contractAddresses).toEqual(data.contractAddresses);
    });

    it("throws for invalid shape", () => {
      expect(() => FhevmDecryptionSignature.fromJSON({})).toThrow(TypeError);
      expect(() => FhevmDecryptionSignature.fromJSON('{"publicKey":"0x1"}')).toThrow(TypeError);
    });
    it("throws when user addresses is invalid", () => {
      const data = validSignatureType({
        userAddress: "0xbb",
      });
      expect(() => FhevmDecryptionSignature.fromJSON(data)).toThrow(TypeError);
    });
    it("throws when contract addresses are invalid", () => {
      const data = validSignatureType({
        contractAddresses: ["0xa", "0xb"],
      });
      expect(() => FhevmDecryptionSignature.fromJSON(data)).toThrow(TypeError);
    });
    it("does not throw when contract addresses are unsorted", () => {
      const data = validSignatureType({
        contractAddresses: [
          "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
          "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        ],
      });
      expect(() => FhevmDecryptionSignature.fromJSON(data)).not.toThrow();
    });
  });

  describe("getters", () => {
    it("expose all fields from constructed instance", () => {
      const data = validSignatureType({
        publicKey: "0xpub",
        privateKey: "0xpriv",
        signature: "0xsig",
        startTimestamp: 100,
        durationDays: 7,
        userAddress: "0x1111111111111111111111111111111111111111",
        contractAddresses: [
          "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
      });
      const sig = FhevmDecryptionSignature.fromJSON(data);
      expect(sig.publicKey).toBe("0xpub");
      expect(sig.privateKey).toBe("0xpriv");
      expect(sig.signature).toBe("0xsig");
      expect(sig.startTimestamp).toBe(100);
      expect(sig.durationDays).toBe(7);
      expect(sig.userAddress).toBe("0x1111111111111111111111111111111111111111");
      expect(sig.contractAddresses).toEqual([
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ]);
    });
  });

  describe("toJSON", () => {
    it("returns object that passes checkIs and can roundtrip", () => {
      const data = validSignatureType();
      const sig = FhevmDecryptionSignature.fromJSON(data);
      const json = sig.toJSON();
      expect(FhevmDecryptionSignature.checkIs(json)).toBe(true);
      const sig2 = FhevmDecryptionSignature.fromJSON(json);
      expect(sig2.signature).toBe(sig.signature);
      expect(sig2.userAddress).toBe(sig.userAddress);
    });
  });

  describe("equals", () => {
    it("returns true when signature matches", () => {
      const sig = FhevmDecryptionSignature.fromJSON(validSignatureType({ signature: "0xsame" }));
      expect(sig.equals(validSignatureType({ signature: "0xsame" }))).toBe(true);
    });

    it("returns false when signature differs", () => {
      const sig = FhevmDecryptionSignature.fromJSON(validSignatureType({ signature: "0xsame" }));
      expect(sig.equals(validSignatureType({ signature: "0xother" }))).toBe(false);
    });
  });

  describe("isValid", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns true when current time is before expiry", () => {
      const start = 1000;
      const durationDays = 1;
      vi.setSystemTime((start + 12 * 60 * 60) * 1000); // 12h later
      const sig = FhevmDecryptionSignature.fromJSON(
        validSignatureType({ startTimestamp: start, durationDays })
      );
      expect(sig.isValid()).toBe(true);
    });

    it("returns false when current time is after expiry", () => {
      const start = 1000;
      const durationDays = 1;
      const expiry = start + durationDays * 24 * 60 * 60;
      vi.setSystemTime((expiry + 1) * 1000);
      const sig = FhevmDecryptionSignature.fromJSON(
        validSignatureType({ startTimestamp: start, durationDays })
      );
      expect(sig.isValid()).toBe(false);
    });
  });

  describe("saveToGenericStringStorage / loadFromGenericStringStorage", () => {
    it("saves and loads signature with same instance and params", async () => {
      const storage = new GenericStringInMemoryStorage();
      const instance = createMockInstance();
      const data = validSignatureType({
        userAddress: "0x0000000000000000000000000000000000000001",
        contractAddresses: [
          "0x0000000000000000000000000000000000000002",
          "0x0000000000000000000000000000000000000003",
        ],
      });
      const sig = FhevmDecryptionSignature.fromJSON(data);
      await sig.saveToGenericStringStorage(storage, instance, false);

      const loaded = await FhevmDecryptionSignature.loadFromGenericStringStorage(
        storage,
        instance,
        [
          "0x0000000000000000000000000000000000000002",
          "0x0000000000000000000000000000000000000003",
        ],
        "0x0000000000000000000000000000000000000001"
      );
      expect(loaded).not.toBeNull();
      expect(loaded!.signature).toBe(sig.signature);
      expect(loaded!.userAddress).toBe(sig.userAddress);
    });

    it("loadFromGenericStringStorage returns null when nothing stored", async () => {
      const storage = new GenericStringInMemoryStorage();
      const instance = createMockInstance();
      const loaded = await FhevmDecryptionSignature.loadFromGenericStringStorage(
        storage,
        instance,
        ["0x0000000000000000000000000000000000000002"],
        "0x0000000000000000000000000000000000000001"
      );
      expect(loaded).toBeNull();
    });

    it("loadFromGenericStringStorage returns null when stored signature is expired", async () => {
      try {
        vi.useFakeTimers();
        const start = 1000;
        const durationDays = 1;
        vi.setSystemTime((start + 2 * 24 * 60 * 60) * 1000); // 2 days later
        const storage = new GenericStringInMemoryStorage();
        const instance = createMockInstance();
        const data = validSignatureType({
          startTimestamp: start,
          durationDays,
          userAddress: "0x0000000000000000000000000000000000000001",
          contractAddresses: ["0x0000000000000000000000000000000000000002"],
        });
        const sig = FhevmDecryptionSignature.fromJSON(data);
        await sig.saveToGenericStringStorage(storage, instance, false);
        const loaded = await FhevmDecryptionSignature.loadFromGenericStringStorage(
          storage,
          instance,
          ["0x0000000000000000000000000000000000000002"],
          "0x0000000000000000000000000000000000000001"
        );
        expect(loaded).toBeNull();
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe("new", () => {
    it("returns FhevmDecryptionSignature when signer and instance succeed (no wallet)", async () => {
      const instance = createMockInstance();
      instance.createEIP712 = (
        publicKey: string,
        contractAddresses: string[],
        startTimestamp: number,
        durationDays: number
      ) =>
        ({
          domain: validEIP712.domain,
          primaryType: validEIP712.primaryType,
          message: { publicKey, contractAddresses, startTimestamp, durationDays },
          types: validEIP712.types,
        }) as unknown as ReturnType<typeof instance.createEIP712>;

      //signer without a wallet so that it falls back to signer provider
      const signer = {
        address: "0x0000000000000000000000000000000000000001",
        getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        signTypedData: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        // no wallet
        provider: {
          request: ({ method }: { method: string }) => {
            if (method === "eth_signTypedData_v4") {
              return Promise.resolve("0xsignature");
            }
            return Promise.reject(new Error("Unsupported method"));
          },
        },
      } as unknown as JsonRpcSigner;
      const sig = await FhevmDecryptionSignature.new(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        "0xpub",
        "0x0000000000000000000000000000000000000006",
        // @ts-expect-error testing with signer
        signer
      );
      expect(sig).not.toBeNull();
      expect(sig!.publicKey).toBe("0xpub");
      expect(sig!.signature).toBe("0xsignature");
      expect(sig!.userAddress).toBe("0x0000000000000000000000000000000000000001");
      expect(sig!.durationDays).toBe(1);
    });

    it("returns FhevmDecryptionSignature when signer and instance succeed (wallet)", async () => {
      const instance = createMockInstance();
      instance.createEIP712 = (
        publicKey: string,
        contractAddresses: string[],
        startTimestamp: number,
        durationDays: number
      ) =>
        ({
          domain: validEIP712.domain,
          primaryType: validEIP712.primaryType,
          message: { publicKey, contractAddresses, startTimestamp, durationDays },
          types: validEIP712.types,
        }) as unknown as ReturnType<typeof instance.createEIP712>;

      const signer = {
        getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        signTypedData: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        wallet: {
          // wallets receives typedData and output signature
          signTypedData: () => Promise.resolve(validSignatureType().signature),
          address: "0x0000000000000000000000000000000000000001",
        },
        provider: {
          request: ({ method }: { method: string }) => {
            if (method === "eth_signTypedData_v4") {
              return Promise.resolve("0xsignature");
            }
            return Promise.reject(new Error("Unsupported method"));
          },
        },
      } as unknown as JsonRpcSigner;
      const sig = await FhevmDecryptionSignature.new(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        "0xpub",
        "0x0000000000000000000000000000000000000006",
        // @ts-expect-error testing with wallet
        signer
      );
      // sig is null :-(
      expect(sig).not.toBeNull();
      expect(sig!.publicKey).toBe("0xpub");
      expect(sig!.signature).toBe("0xsignature");
      expect(sig!.userAddress).toBe("0x0000000000000000000000000000000000000001");
      expect(sig!.durationDays).toBe(1);
    });

    it("returns null when signer fails", async () => {
      const instance = createMockInstance();
      (instance as any).createEIP712 = () => ({
        domain: validEIP712.domain,
        primaryType: validEIP712.primaryType,
        message: {},
        types: validEIP712.types,
      });
      const signer = {
        getAddress: () => Promise.reject(new Error("no wallet")),
        signTypedData: () => Promise.resolve("0xmockSig"),
        provider: {
          request: ({ method }: { method: string }) => {
            if (method === "eth_signTypedData_v4") {
              return Promise.resolve("0xsignature");
            }
            return Promise.reject(new Error("Unsupported method"));
          },
        },
      } as unknown as JsonRpcSigner;
      const sig = await FhevmDecryptionSignature.new(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        "0xpub",
        "0xpriv",
        // @ts-expect-error testing with signer
        signer
      );
      expect(sig).toBeNull();
    });
  });

  describe.skip("loadOrSign", () => {
    it("returns cached signature when loadFromGenericStringStorage returns one", async () => {
      const storage = new GenericStringInMemoryStorage();
      const instance = createMockInstance();
      const data = validSignatureType({
        userAddress: "0x0000000000000000000000000000000000000001",
        contractAddresses: ["0x0000000000000000000000000000000000000002"],
      });
      const sig = FhevmDecryptionSignature.fromJSON(data);
      await sig.saveToGenericStringStorage(storage, instance, false);

      const signer = {
        getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        signTypedData: vi.fn(() => Promise.resolve("0xnewSig")),
      } as any;

      const result = await FhevmDecryptionSignature.loadOrSign(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        signer,
        storage
      );
      expect(result).not.toBeNull();
      //
      expect(result!.signature).toBe("0xsignature");
      expect(signer.signTypedData).not.toHaveBeenCalled();
    });

    it("creates new signature and saves when no cache", async () => {
      const storage = new GenericStringInMemoryStorage();
      const instance = createMockInstance();
      const signer = {
        getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        signTypedData: () => Promise.resolve("0xnewSig"),
        wallet: {},
        provider: {
          request: ({ method }: { method: string }) => {
            if (method === "eth_signTypedData_v4") {
              return Promise.resolve("0xsignature");
            }
            return Promise.reject(new Error("Unsupported method"));
          },
        },
      } as unknown as JsonRpcSigner;

      const result = await FhevmDecryptionSignature.loadOrSign(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        // @ts-expect-error testing with signer
        signer,
        storage
      );
      expect(result).not.toBeNull();
      expect(result!.signature).toBe("0xnewSig");
      expect(result!.publicKey).toBe("0xgeneratedPub");

      const loaded = await FhevmDecryptionSignature.loadFromGenericStringStorage(
        storage,
        instance,
        ["0x0000000000000000000000000000000000000002"],
        "0x0000000000000000000000000000000000000001"
      );
      expect(loaded).not.toBeNull();
      expect(loaded!.signature).toBe("0xnewSig");
    });

    it("uses provided keyPair when given", async () => {
      const storage = new GenericStringInMemoryStorage();
      const instance = createMockInstance();
      const signer = {
        getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000001"),
        signTypedData: () => Promise.resolve("0xnewSig"),
        request: () =>
          Promise.resolve({
            publicKey: "0xmyPub",
            privateKey: "0xmyPriv",
          }),
      } as unknown as JsonRpcSigner;
      const keyPair = { publicKey: "0xmyPub", privateKey: "0xmyPriv" };

      const result = await FhevmDecryptionSignature.loadOrSign(
        instance,
        ["0x0000000000000000000000000000000000000002"],
        // @ts-expect-error testing with signer
        signer,
        storage,
        keyPair
      );
      expect(result).not.toBeNull();
      expect(result!.publicKey).toBe("0xmyPub");
      expect(result!.privateKey).toBe("0xmyPriv");
    });
  });
});
