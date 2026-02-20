/**
 * Validate an Ethereum address.
 * Replaces ethers.isAddress.
 */
export function isAddress(value: unknown): value is `0x${string}` {
  if (typeof value !== "string") return false;
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

/**
 * Normalize an address to checksummed format.
 * Simple implementation without full checksum validation.
 */
export function normalizeAddress(address: string): `0x${string}` {
  if (!isAddress(address)) {
    throw new Error(`Invalid address: ${address}`);
  }
  return address.toLowerCase() as `0x${string}`;
}

/**
 * Validates that a string is a valid solidity identifier.
 * port of https://github.com/wevm/abitype/blob/main/packages/abitype/src/zod.ts#L17
 */
export function isIdentifier(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(value);
}

const solidityTypeRegex =
  /^(address|bool|string|bytes([1-9]|[1-2][0-9]|3[0-2])?|u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$)/;

export function isSolidityType(type: string): boolean {
  return solidityTypeRegex.test(type);
}

const typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*?)(?<array>(?:\[\d*?\])*)$/;

export function parseType(type: string): { base: string; isArray: boolean } | null {
  const match = type.match(typeWithoutTupleRegex);
  if (!match?.groups?.type) return null;
  return {
    base: match.groups.type,
    isArray: Boolean(match.groups.array),
  };
}
