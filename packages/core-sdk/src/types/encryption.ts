/**
 * Supported FHE type names for encryption.
 */
export type FheTypeName =
  | "bool"
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "uint128"
  | "uint256"
  | "address";

/**
 * Discriminated union for type-safe encryption inputs.
 * Each type has its own specific value type.
 */
export type EncryptInput =
  | { type: "bool"; value: boolean }
  | { type: "uint8"; value: number }
  | { type: "uint16"; value: number }
  | { type: "uint32"; value: number }
  | { type: "uint64"; value: bigint }
  | { type: "uint128"; value: bigint }
  | { type: "uint256"; value: bigint }
  | { type: "address"; value: `0x${string}` };

/**
 * Result from encryption operation.
 */
export interface EncryptedOutput {
  /** Array of encrypted handles (one per input value) */
  handles: Uint8Array[];
  /** Proof of encryption validity */
  inputProof: Uint8Array;
}

/**
 * Tuple type for encryption result.
 * Returns [...handles, proof] for easy destructuring.
 *
 * @example
 * ```typescript
 * const [handle1, handle2, proof] = result as EncryptResult<typeof inputs>
 * ```
 */
export type EncryptResult<T extends readonly EncryptInput[]> = [
  ...{ [K in keyof T]: Uint8Array },
  Uint8Array
];

// Helper to avoid unused type warning
export type _EncryptResultHelper = EncryptResult<[{ type: "uint64"; value: bigint }]>;
