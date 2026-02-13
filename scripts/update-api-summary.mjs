#!/usr/bin/env node

/**
 * Post-TypeDoc generation script.
 *
 * Reads the generated API docs and updates docs/SUMMARY.md so that
 * individual function pages appear in the GitBook sidebar, grouped
 * by the @category tag assigned in the _docs.ts entry points.
 *
 * Idempotent: can be run multiple times safely. On each run it rebuilds
 * the "## API Reference" section from scratch based on generated files.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

const DOCS_DIR = new URL("../docs", import.meta.url).pathname;
const SUMMARY_PATH = join(DOCS_DIR, "SUMMARY.md");

// ---------------------------------------------------------------------------
// Category definitions — maps function names to categories.
// ---------------------------------------------------------------------------

const CORE_SDK_CATEGORIES = {
  Config: ["createFhevmConfig"],
  Actions: [
    "encrypt",
    "writeConfidentialTransfer",
    "readConfidentialBalance",
    "readConfidentialBalances",
  ],
  Chains: [
    "sepolia",
    "mainnet",
    "hardhatLocal",
    "defineChain",
    "defineMockChain",
    "defineProductionChain",
  ],
  Transports: ["http", "custom", "fallback"],
  Providers: ["detectProvider"],
};

const REACT_SDK_CATEGORIES = {
  Hooks: [
    "FhevmProvider",
    "useEncrypt",
    "useUserDecrypt",
    "usePublicDecrypt",
    "useFhevmStatus",
    "useFhevmClient",
    "useEthersSigner",
    "useWalletOrSigner",
    "useConfidentialTransfer",
    "useConfidentialBalances",
    "useShield",
    "useUnshield",
    "useUserDecryptedValue",
    "useUserDecryptedValues",
    "useSignature",
  ],
  Config: ["createFhevmConfig"],
  Utilities: ["formatConfidentialAmount", "configureLogger"],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getFunctionNames(pkgPath) {
  const functionsDir = join(DOCS_DIR, "api", pkgPath, "functions");
  if (!existsSync(functionsDir)) return [];
  return readdirSync(functionsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => basename(f, ".md"))
    .sort();
}

function groupByCategory(functionNames, categoryMap, pkgPath) {
  const categorized = new Map();
  const uncategorized = [];

  const lookup = new Map();
  for (const [cat, names] of Object.entries(categoryMap)) {
    for (const name of names) {
      lookup.set(name, cat);
    }
  }

  for (const name of functionNames) {
    const cat = lookup.get(name);
    const entry = { name, path: `api/${pkgPath}/functions/${name}.md` };
    if (cat) {
      if (!categorized.has(cat)) categorized.set(cat, []);
      categorized.get(cat).push(entry);
    } else {
      uncategorized.push(entry);
    }
  }

  const result = [];
  for (const cat of Object.keys(categoryMap)) {
    if (categorized.has(cat)) {
      result.push({ category: cat, entries: categorized.get(cat) });
    }
  }
  if (uncategorized.length > 0) {
    result.push({ category: "Other", entries: uncategorized });
  }
  return result;
}

/**
 * Generate SUMMARY.md lines for a package's API entries under a top-level bullet.
 */
function generatePackageApiLines(label, groups) {
  const lines = [`* ${label}`];

  for (const { category, entries } of groups) {
    lines.push(`  * ${category}`);
    for (const { name, path } of entries) {
      lines.push(`    * [${name}](${path})`);
    }
  }

  return lines;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const coreFunctions = getFunctionNames("@zama-fhe/core-sdk");
const reactFunctions = getFunctionNames("@zama-fhe/react-sdk");

console.log(
  `Found ${coreFunctions.length} core-sdk functions, ${reactFunctions.length} react-sdk functions`
);

const coreGroups = groupByCategory(
  coreFunctions,
  CORE_SDK_CATEGORIES,
  "@zama-fhe/core-sdk"
);
const reactGroups = groupByCategory(
  reactFunctions,
  REACT_SDK_CATEGORIES,
  "@zama-fhe/react-sdk"
);

// Build the new API Reference section
const apiSection = [
  "",
  "## API Reference",
  "",
  ...generatePackageApiLines("Core SDK", coreGroups),
  ...generatePackageApiLines("React SDK", reactGroups),
  "",
];

// Read SUMMARY.md and find the API Reference section
const summary = readFileSync(SUMMARY_PATH, "utf-8");
const lines = summary.split("\n");

// Find "## API Reference" header (or similar)
let apiHeaderIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (/^## API\s/i.test(lines[i])) {
    apiHeaderIndex = i;
    break;
  }
}

let result;

if (apiHeaderIndex !== -1) {
  // Find the end of the API Reference section:
  // everything until the next ## header or end of file
  let apiEndIndex = lines.length;
  for (let i = apiHeaderIndex + 1; i < lines.length; i++) {
    if (/^## /.test(lines[i])) {
      apiEndIndex = i;
      break;
    }
  }

  // Replace the entire API Reference section
  const before = lines.slice(0, apiHeaderIndex);
  const after = lines.slice(apiEndIndex);

  // Remove trailing blank lines from `before`
  while (before.length > 0 && before[before.length - 1].trim() === "") {
    before.pop();
  }

  result = [...before, ...apiSection, ...after];
  console.log(
    `Replaced API Reference section (lines ${apiHeaderIndex}-${apiEndIndex})`
  );
} else {
  // No existing API Reference section — append to end
  const trimmed = lines.slice();
  while (trimmed.length > 0 && trimmed[trimmed.length - 1].trim() === "") {
    trimmed.pop();
  }
  result = [...trimmed, ...apiSection];
  console.log("Appended new API Reference section");
}

writeFileSync(SUMMARY_PATH, result.join("\n"));
console.log("Updated docs/SUMMARY.md with API function entries");
