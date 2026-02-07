import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import { logger } from "./logger";

type FhevmStoredPublicKey = {
  publicKeyId: string;
  publicKey: Uint8Array;
};

type FhevmStoredPublicParams = {
  publicParamsId: string;
  publicParams: Uint8Array;
};

interface PublicParamsDB extends DBSchema {
  publicKeyStore: {
    key: string;
    value: {
      acl: `0x${string}`;
      value: FhevmStoredPublicKey;
    };
  };
  paramsStore: {
    key: string;
    value: {
      acl: `0x${string}`;
      value: FhevmStoredPublicParams;
    };
  };
}

/**
 * Storage type currently in use.
 */
type StorageType = "indexeddb" | "memory" | "none";

let __dbPromise: Promise<IDBPDatabase<PublicParamsDB>> | undefined = undefined;
let __storageType: StorageType = "none";
const __memoryFallback: Map<
  string,
  { publicKey?: FhevmStoredPublicKey; publicParams?: FhevmStoredPublicParams }
> = new Map();

/**
 * Get the current storage type being used.
 */
export function getPublicKeyStorageType(): StorageType {
  return __storageType;
}

/**
 * Initialize IndexedDB with fallback to memory storage.
 * Logs which storage type is being used.
 */
async function _getDB(): Promise<IDBPDatabase<PublicParamsDB> | undefined> {
  // Return cached DB if already initialized
  if (__dbPromise) {
    return __dbPromise;
  }

  // SSR - use memory storage
  if (typeof window === "undefined") {
    __storageType = "memory";
    logger.debug("[PublicKeyStorage]", "SSR detected, using memory storage");
    return undefined;
  }

  // Try IndexedDB
  try {
    __dbPromise = openDB<PublicParamsDB>("fhevm", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("paramsStore")) {
          db.createObjectStore("paramsStore", { keyPath: "acl" });
        }
        if (!db.objectStoreNames.contains("publicKeyStore")) {
          db.createObjectStore("publicKeyStore", { keyPath: "acl" });
        }
      },
    });

    // Test if DB is accessible (private browsing may block IndexedDB)
    const db = await __dbPromise;
    if (db) {
      __storageType = "indexeddb";
      logger.debug("[PublicKeyStorage]", "Using IndexedDB for public key storage");
      return db;
    }
  } catch (error) {
    // IndexedDB failed (private browsing, disabled, etc.)
    logger.warn(
      "[PublicKeyStorage]",
      "IndexedDB unavailable, falling back to memory storage:",
      error instanceof Error ? error.message : String(error)
    );
    __dbPromise = undefined;
  }

  // Fallback to memory storage
  __storageType = "memory";
  logger.debug("[PublicKeyStorage]", "Using memory storage (data will not persist)");
  return undefined;
}

// Types that match @zama-fhe/relayer-sdk v0.4 FhevmPkeConfigType
type FhevmPublicKeyType = {
  data: Uint8Array;
  id: string;
};

type FhevmPkeCrsType = {
  publicParams: Uint8Array;
  publicParamsId: string;
};

type FhevmPkeCrsByCapacityType = {
  2048: FhevmPkeCrsType;
};

function assertFhevmStoredPublicKey(value: unknown): asserts value is FhevmStoredPublicKey | null {
  if (typeof value !== "object") {
    throw new Error(`FhevmStoredPublicKey must be an object`);
  }
  if (value === null) {
    return;
  }
  if (!("publicKeyId" in value)) {
    throw new Error(`FhevmStoredPublicKey.publicKeyId does not exist`);
  }
  if (typeof value.publicKeyId !== "string") {
    throw new Error(`FhevmStoredPublicKey.publicKeyId must be a string`);
  }
  if (!("publicKey" in value)) {
    throw new Error(`FhevmStoredPublicKey.publicKey does not exist`);
  }
  if (!(value.publicKey instanceof Uint8Array)) {
    throw new Error(`FhevmStoredPublicKey.publicKey must be a Uint8Array`);
  }
}

function assertFhevmStoredPublicParams(
  value: unknown
): asserts value is FhevmStoredPublicParams | null {
  if (typeof value !== "object") {
    throw new Error(`FhevmStoredPublicParams must be an object`);
  }
  if (value === null) {
    return;
  }
  if (!("publicParamsId" in value)) {
    throw new Error(`FhevmStoredPublicParams.publicParamsId does not exist`);
  }
  if (typeof value.publicParamsId !== "string") {
    throw new Error(`FhevmStoredPublicParams.publicParamsId must be a string`);
  }
  if (!("publicParams" in value)) {
    throw new Error(`FhevmStoredPublicParams.publicParams does not exist`);
  }
  if (!(value.publicParams instanceof Uint8Array)) {
    throw new Error(`FhevmStoredPublicParams.publicParams must be a Uint8Array`);
  }
}

export async function publicKeyStorageGet(aclAddress: `0x${string}`): Promise<{
  publicKey?: FhevmPublicKeyType;
  publicParams?: FhevmPkeCrsByCapacityType;
}> {
  const db = await _getDB();

  let storedPublicKey: FhevmStoredPublicKey | null = null;
  let storedPublicParams: FhevmStoredPublicParams | null = null;

  if (db) {
    // Try IndexedDB
    try {
      const pk = await db.get("publicKeyStore", aclAddress);
      if (pk?.value) {
        assertFhevmStoredPublicKey(pk.value);
        storedPublicKey = pk.value;
      }
    } catch (error) {
      logger.warn("[PublicKeyStorage]", "Failed to read public key from IndexedDB:", error);
    }

    try {
      const pp = await db.get("paramsStore", aclAddress);
      if (pp?.value) {
        assertFhevmStoredPublicParams(pp.value);
        storedPublicParams = pp.value;
      }
    } catch (error) {
      logger.warn("[PublicKeyStorage]", "Failed to read public params from IndexedDB:", error);
    }
  } else {
    // Use memory fallback
    const cached = __memoryFallback.get(aclAddress);
    if (cached) {
      storedPublicKey = cached.publicKey ?? null;
      storedPublicParams = cached.publicParams ?? null;
    }
  }

  const result: {
    publicKey?: FhevmPublicKeyType;
    publicParams?: FhevmPkeCrsByCapacityType;
  } = {};

  if (storedPublicKey) {
    result.publicKey = {
      id: storedPublicKey.publicKeyId,
      data: storedPublicKey.publicKey,
    };
  }

  if (storedPublicParams) {
    result.publicParams = {
      2048: storedPublicParams,
    };
  }

  return result;
}

export async function publicKeyStorageSet(
  aclAddress: `0x${string}`,
  publicKey: FhevmStoredPublicKey | null,
  publicParams: FhevmStoredPublicParams | null
) {
  assertFhevmStoredPublicKey(publicKey);
  assertFhevmStoredPublicParams(publicParams);

  const db = await _getDB();

  if (db) {
    // Use IndexedDB
    try {
      if (publicKey) {
        await db.put("publicKeyStore", { acl: aclAddress, value: publicKey });
      }
      if (publicParams) {
        await db.put("paramsStore", { acl: aclAddress, value: publicParams });
      }
    } catch (error) {
      logger.warn("[PublicKeyStorage]", "Failed to write to IndexedDB:", error);
      // Fall through to memory storage
    }
  }

  // Also store in memory (ensures data survives IndexedDB errors and
  // provides immediate access without async DB read)
  const existing = __memoryFallback.get(aclAddress) ?? {};
  __memoryFallback.set(aclAddress, {
    publicKey: publicKey ?? existing.publicKey,
    publicParams: publicParams ?? existing.publicParams,
  });
}
