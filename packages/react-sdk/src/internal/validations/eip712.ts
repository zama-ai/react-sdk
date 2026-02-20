import type { Eip1193Provider } from "./eip1193";
import { isAddress, isIdentifier, isSolidityType, parseType } from "./generic";

/**
 * EIP-712 typed data domain.
 * TODO rename EIP712Domain
 */
export interface TypedDataDomain {
  name?: string; // user readable name of signing domain
  version?: string; // current major version of the signing domain
  chainId?: number; // EIP-155 chain id
  verifyingContract?: `0x${string}`; // address of the contract that will verify the signature
  salt?: `0x${string}`; //  a disambiguating salt for the protocol
}

/**
 * EIP-712 type definition.
 */
export interface TypedDataField {
  name: string;
  type: string;
}

export type TypedDataTypes = Record<string, TypedDataField[]>;

/**
 * EIP-712 message structure.
 * This is a very loose type since the message can be any object
 */

type EIP712Message = object;

/**
 * EIP-712 typed data structure.
 */
export interface EIP712TypedData {
  domain: TypedDataDomain;
  types: Record<string, TypedDataField[]>;
  primaryType: string;
  message: Record<string, unknown>;
}

/**
 * checks if payload has EIP712 shape
 * @param e: an unknown shape
 * @returns boolean
 */
export function isEIP712(e: unknown): e is EIP712TypedData {
  if (!e || typeof e !== "object") return false;
  const o = e as Record<string, unknown>;

  const checks: [key: string, pred: (v: unknown) => boolean][] = [
    ["types", isTypedDataTypes],
    ["domain", isEIP712Domain],
    ["primaryType", (v): v is string => typeof v === "string"],
    ["message", isMessage],
  ];
  return checks.every(([key, pred]) => key in o && pred(o[key]));
}

/**
 * Validates that an object has the shape of an EIP712Domain
 * port of https://github.com/wevm/abitype/blob/main/packages/abitype/src/zod.ts#L301
 */
export function isEIP712Domain(d: unknown): d is TypedDataDomain {
  if (!d || typeof d !== "object") return false;
  const o = d as Record<string, unknown>;
  const checks: [key: string, pred: (v: unknown) => boolean][] = [
    ["name", isIdentifier],
    ["version", (v): v is string => typeof v === "string"],
    ["chainId", (v): v is number => typeof v === "number" || typeof v === "bigint"],
    ["verifyingContract", isAddress],
    ["salt", (v): v is `0x${string}` => typeof v === "string" && v.startsWith("0x")],
  ];
  return checks.some(([key, pred]) => key in o && pred(o[key]));
}

export function isMessage(m: unknown): m is EIP712Message {
  if (!m || typeof m !== "object") return false;
  return true;
}

/**
 * isTypedDataTypes
 * @param value: an unknown shape
 * @returns boolean
 */

export function isTypedDataTypes(value: unknown): value is TypedDataTypes {
  if (!value || typeof value !== "object") return false;
  const typed = value as Record<string, unknown>;

  for (const key of Object.keys(typed)) {
    if (typeof key !== "string") return false;
    if (isSolidityType(key)) return false;

    const fields = typed[key];
    if (!Array.isArray(fields)) return false;

    for (const field of fields) {
      if (!field || typeof field !== "object") return false;
      const f = field as Record<string, unknown>;

      if (!isIdentifier(f.name)) return false;
      if (typeof f.type !== "string") return false;

      const parsed = parseType(f.type);
      if (!parsed) return false;

      if (!(parsed.base in typed || isSolidityType(parsed.base))) {
        return false;
      }
    }
  }

  function validateNoCycles(key: string, ancestors: Set<string> = new Set()): boolean {
    const fields = typed[key] as TypedDataField[];

    for (const field of fields) {
      const parsed = parseType(field.type);
      if (!parsed) return false;

      if (parsed.base === key) return false; // self reference

      if (parsed.base in typed) {
        if (ancestors.has(parsed.base)) return false;

        if (!validateNoCycles(parsed.base, new Set([...ancestors, parsed.base]))) return false;
      }
    }

    return true;
  }

  for (const key of Object.keys(typed)) {
    if (!validateNoCycles(key)) return false;
  }

  return true;
}

/**
 * Sign EIP-712 typed data using an EIP-1193 provider.
 * Uses eth_signTypedData_v4 method directly.
 */
export async function signTypedData(
  provider: Eip1193Provider,
  address: `0x${string}`,
  typedData: EIP712TypedData
): Promise<string> {
  // eth_signTypedData_v4 expects the full typed data as a JSON string
  const dataToSign = {
    domain: typedData.domain,
    types: {
      EIP712Domain: getEIP712DomainType(typedData.domain),
      ...typedData.types,
    },
    primaryType: typedData.primaryType,
    message: typedData.message,
  };

  // Custom replacer to handle BigInt serialization
  const replacer = (_key: string, value: unknown): unknown => {
    if (typeof value === "bigint") {
      return Number(value);
    }
    return value;
  };

  const signature = await provider.request({
    method: "eth_signTypedData_v4",
    params: [address, JSON.stringify(dataToSign, replacer)],
  });

  return signature as string;
}

/**
 * Get the EIP712Domain type array based on which domain fields are present.
 */
function getEIP712DomainType(domain: TypedDataDomain): TypedDataField[] {
  const types: TypedDataField[] = [];

  if (domain.name !== undefined) {
    types.push({ name: "name", type: "string" });
  }
  if (domain.version !== undefined) {
    types.push({ name: "version", type: "string" });
  }
  if (domain.chainId !== undefined) {
    types.push({ name: "chainId", type: "uint256" });
  }
  if (domain.verifyingContract !== undefined) {
    types.push({ name: "verifyingContract", type: "address" });
  }
  if (domain.salt !== undefined) {
    types.push({ name: "salt", type: "bytes32" });
  }

  return types;
}

/**
 * Get the current chain ID from an EIP-1193 provider.
 */
export async function getChainId(provider: Eip1193Provider): Promise<number> {
  const chainId = await provider.request({ method: "eth_chainId" });
  return Number.parseInt(chainId as string, 16);
}

/**
 * Get connected accounts from an EIP-1193 provider.
 */
export async function getAccounts(provider: Eip1193Provider): Promise<`0x${string}`[]> {
  const accounts = await provider.request({ method: "eth_accounts" });
  return accounts as `0x${string}`[];
}

/**
 * Request account access from an EIP-1193 provider.
 */
export async function requestAccounts(provider: Eip1193Provider): Promise<`0x${string}`[]> {
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  return accounts as `0x${string}`[];
}

/**
 * Hash EIP-712 typed data for use as a cache key.
 * This is a simplified hash - not cryptographically secure, just for cache keys.
 */
export function hashTypedDataForKey(typedData: EIP712TypedData): string {
  const str = JSON.stringify({
    domain: typedData.domain,
    types: typedData.types,
    primaryType: typedData.primaryType,
    // Only include relevant message fields for the key, not timestamps
    message: {
      publicKey: typedData.message.publicKey,
      contractAddresses: typedData.message.contractAddresses,
    },
  });

  // Simple hash function for cache keys
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}
