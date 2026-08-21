import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const publicDir = resolve(root, 'public');
const generatedUiBundle = 'pirate-deck-ui-runtime-v18.js';

const coreScripts = [
  'pirate-deck.js',
  'pirate-deck-card-rules-v2.js',
  'pirate-deck-monster-cards-v1.js'
];

const uiSourceScripts = [
  'pirate-deck-asset-guard.js',
  'pirate-deck-info-toast.js',
  'pirate-deck-guide-v1.js',
  'pirate-deck-hud-hp-v4.js',
  'pirate-deck-hand7-v5.js',
  'pirate-deck-a11y-v23.js'
];

const expectedSourceScripts = new Set([...coreScripts, ...uiSourceScripts]);
const publicEntries = await readdir(publicDir, { withFileTypes: true });
const publicJs = publicEntries
  .filter(entry => entry.isFile() && entry.name.endsWith('.js'))
  .map(entry => entry.name)
  .filter(name => name !== generatedUiBundle)
  .sort();

const missing = [...expectedSourceScripts].filter(name => !publicJs.includes(name));
const orphaned = publicJs.filter(name => !expectedSourceScripts.has(name));

if (missing.length || orphaned.length) {
  if (missing.length) console.error(`Missing runtime source scripts: ${missing.join(', ')}`);
  if (orphaned.length) console.error(`Unclassified/orphan runtime scripts: ${orphaned.join(', ')}`);
  process.exit(1);
}

const indexSource = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
const directRuntimeScripts = [...coreScripts, generatedUiBundle];

for (const file of directRuntimeScripts) {
  const count = indexSource.split(file).length - 1;
  if (count !== 1) {
    console.error(`Expected exactly one runtime reference to ${file}, found ${count}.`);
    process.exit(1);
  }
}

for (const file of uiSourceScripts) {
  if (indexSource.includes(file)) {
    console.error(`UI source script must not be loaded directly: ${file}`);
    process.exit(1);
  }
}

const scriptTagCount = (indexSource.match(/<script\s+src=/g) || []).length;
if (scriptTagCount !== 4) {
  console.error(`Expected 4 runtime script tags, found ${scriptTagCount}.`);
  process.exit(1);
}

const generatorSource = await readFile(resolve(root, 'scripts/build-ui-runtime.mjs'), 'utf8');
let previousGeneratorIndex = -1;
for (const file of uiSourceScripts) {
  const index = generatorSource.indexOf(`'${file}'`);
  if (index < 0 || index <= previousGeneratorIndex) {
    console.error(`UI bundle generator source order is invalid at ${file}.`);
    process.exit(1);
  }
  previousGeneratorIndex = index;
}

const generatedSource = await readFile(resolve(publicDir, generatedUiBundle), 'utf8');
let previousBundleIndex = -1;
for (const file of uiSourceScripts) {
  const marker = `/* ===== ${file} ===== */`;
  const index = generatedSource.indexOf(marker);
  if (index < 0 || index <= previousBundleIndex) {
    console.error(`Generated UI runtime order is invalid at ${file}.`);
    process.exit(1);
  }
  previousBundleIndex = index;
}

console.log(`Runtime Source Guard PASS: ${coreScripts.length} core + ${uiSourceScripts.length} UI sources, no orphan JS files.`);
