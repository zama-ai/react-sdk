/**
 * Lightweight ABI encoding/decoding for the specific functions the SDK calls.
 * No ethers.js dependency — uses pre-computed selectors and manual ABI encoding.
 *
 * Supported types: address, uint256, uint64, bytes32, bytes, bool
 */

// ─────────────────────────────────────────────────────────────────────────────
// Pre-computed 4-byte function selectors (keccak256 of the signature, first 4 bytes)
// ─────────────────────────────────────────────────────────────────────────────

export const SELECTORS = {
  // ERC20
  "approve(address,uint256)": "0x095ea7b3",
  "allowance(address,address)": "0xdd62ed3e",
  // ERC7984 / ERC20-to-ERC7984
  "underlying()": "0x6f307dc3",
  "wrap(address,uint256)": "0xbf376c7a",
  "unwrap(address,address,bytes32,bytes)": "0x5bf4ef06",
  "finalizeUnwrap(bytes32,uint64,bytes)": "0x5bb67a05",
  "confidentialTransfer(address,bytes32,bytes)": "0x2fb74e62",
  "confidentialBalanceOf(address)": "0x344ff101",
} as const;

/**
 * Pre-computed event topic for UnwrapRequested(address,bytes32).
 * keccak256("UnwrapRequested(address,bytes32)")
 */
export const UNWRAP_REQUESTED_TOPIC =
  "0x77d02d353c5629272875d11f1b34ec4c65d7430b075575b78cd2502034c469ee";

/**
 * Zero hash constant (32 zero bytes).
 */
export const ZERO_HASH: `0x${string}` = `0x${"00".repeat(32)}` as `0x${string}`;

// ─────────────────────────────────────────────────────────────────────────────
// ABI Encoding
// ─────────────────────────────────────────────────────────────────────────────

type AbiValue = `0x${string}` | bigint | number | boolean | Uint8Array;

/**
 * Encode a function call with pre-computed selector.
 *
 * @param signature - The full function signature, e.g. "approve(address,uint256)"
 * @param args - Arguments matching the function signature types
 * @returns ABI-encoded calldata with 4-byte selector prefix
 */
export function encodeFunctionCall(
  signature: keyof typeof SELECTORS,
  args: AbiValue[]
): `0x${string}` {
  const selector = SELECTORS[signature];
  const paramTypes = parseParamTypes(signature);
  const encoded = encodeParams(paramTypes, args);
  return `${selector}${encoded}` as `0x${string}`;
}

/**
 * Decode the return value of a function call.
 *
 * @param signature - The full function signature (used to determine return type)
 * @param returnType - The ABI type of the return value, e.g. "address", "uint256", "bytes32"
 * @param data - The hex-encoded return data (without 0x prefix is fine)
 * @returns The decoded value
 */
export function decodeFunctionResult(
  returnType: string,
  data: `0x${string}`
): AbiValue {
  const hex = strip0x(data);
  switch (returnType) {
    case "address":
      return `0x${hex.slice(24, 64)}` as `0x${string}`;
    case "uint256":
      return BigInt(`0x${hex.slice(0, 64)}`);
    case "uint64":
      return BigInt(`0x${hex.slice(0, 64)}`);
    case "bytes32":
      return `0x${hex.slice(0, 64)}` as `0x${string}`;
    case "bool":
      return BigInt(`0x${hex.slice(0, 64)}`) !== 0n;
    default:
      throw new Error(`Unsupported return type: ${returnType}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function strip0x(hex: string): string {
  return hex.startsWith("0x") ? hex.slice(2) : hex;
}

function padLeft(hex: string, bytes: number): string {
  return hex.padStart(bytes * 2, "0");
}

function parseParamTypes(signature: string): string[] {
  const match = signature.match(/\(([^)]*)\)/);
  if (!match || !match[1]) return [];
  return match[1].split(",");
}

/**
 * ABI-encode parameters. Handles both static and dynamic types.
 *
 * Static types (address, uint256, uint64, bytes32, bool) are encoded in-place as 32-byte words.
 * Dynamic types (bytes) use offset + length + data encoding.
 */
function encodeParams(types: string[], values: AbiValue[]): string {
  if (types.length !== values.length) {
    throw new Error(`Type/value count mismatch: ${types.length} types, ${values.length} values`);
  }

  // First pass: determine which types are dynamic
  const isDynamic = types.map((t) => t === "bytes" || t === "string");
  const headSize = types.length * 32; // Each slot in the head is 32 bytes

  // Build head (static values or offsets) and tail (dynamic data)
  const headParts: string[] = [];
  const tailParts: string[] = [];
  let tailOffset = headSize;

  for (let i = 0; i < types.length; i++) {
    if (isDynamic[i]) {
      // Head: offset to the dynamic data
      headParts.push(padLeft(tailOffset.toString(16), 32));
      // Tail: length + padded data
      const encoded = encodeDynamicValue(types[i]!, values[i]!);
      tailParts.push(encoded);
      tailOffset += encoded.length / 2; // encoded is hex chars, divide by 2 for bytes
    } else {
      // Head: encoded static value
      headParts.push(encodeStaticValue(types[i]!, values[i]!));
    }
  }

  return headParts.join("") + tailParts.join("");
}

function encodeStaticValue(type: string, value: AbiValue): string {
  switch (type) {
    case "address": {
      const addr = strip0x(value as string).toLowerCase();
      return padLeft(addr, 32);
    }
    case "uint256": {
      const n = typeof value === "bigint" ? value : BigInt(value as number);
      return padLeft(n.toString(16), 32);
    }
    case "uint64": {
      const n = typeof value === "bigint" ? value : BigInt(value as number);
      return padLeft(n.toString(16), 32);
    }
    case "bytes32": {
      let hex: string;
      if (value instanceof Uint8Array) {
        hex = Array.from(value)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } else {
        hex = strip0x(value as string);
      }
      // bytes32 is left-aligned in ABI encoding (padded on the right)
      return hex.padEnd(64, "0");
    }
    case "bool": {
      return padLeft(value ? "1" : "0", 32);
    }
    default:
      throw new Error(`Unsupported static type: ${type}`);
  }
}

function encodeDynamicValue(type: string, value: AbiValue): string {
  if (type === "bytes") {
    let hex: string;
    if (value instanceof Uint8Array) {
      hex = Array.from(value)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else {
      hex = strip0x(value as string);
    }
    const length = hex.length / 2;
    const lengthEncoded = padLeft(length.toString(16), 32);
    // Data must be padded to 32-byte boundary
    const paddedData = hex.padEnd(Math.ceil(hex.length / 64) * 64, "0");
    return lengthEncoded + paddedData;
  }
  throw new Error(`Unsupported dynamic type: ${type}`);
}
