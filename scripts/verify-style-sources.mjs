import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const publicDir = resolve(root, 'public');
const generatedFoundation = 'pirate-deck-foundation-v17.css';
const runtimeStylesheet = 'pirate-deck-runtime-v15.css';

const foundationSources = [
  'pirate-deck.css',
  'pirate-deck-mobile.css',
  'pirate-deck-card-polish.css',
  'pirate-deck-ci-pass.css',
  'pirate-deck-mobile-final.css',
  'pirate-deck-desktop-fit.css',
  'pirate-deck-cards-toast.css',
  'pirate-deck-card-ui-v2.css',
  'pirate-deck-hand-premium-v3.css',
  'pirate-deck-guide-v1.css',
  'pirate-deck-monster-cards-v1.css',
  'pirate-deck-battle-layout-v3.css'
];

const expectedSources = new Set([...foundationSources, runtimeStylesheet]);
const publicEntries = await readdir(publicDir, { withFileTypes: true });
const publicCss = publicEntries
  .filter(entry => entry.isFile() && entry.name.endsWith('.css'))
  .map(entry => entry.name)
  .filter(name => name !== generatedFoundation)
  .sort();

const missing = [...expectedSources].filter(name => !publicCss.includes(name));
const orphaned = publicCss.filter(name => !expectedSources.has(name));

if (missing.length || orphaned.length) {
  if (missing.length) console.error(`Missing stylesheet sources: ${missing.join(', ')}`);
  if (orphaned.length) console.error(`Unclassified/orphan stylesheets: ${orphaned.join(', ')}`);
  process.exit(1);
}

const indexSource = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
for (const file of [generatedFoundation, runtimeStylesheet]) {
  const count = indexSource.split(file).length - 1;
  if (count !== 1) {
    console.error(`Expected exactly one runtime stylesheet reference to ${file}, found ${count}.`);
    process.exit(1);
  }
}

for (const file of foundationSources) {
  if (indexSource.includes(file)) {
    console.error(`Foundation source must not be loaded directly: ${file}`);
    process.exit(1);
  }
}

const stylesheetLinkCount = (indexSource.match(/<link\s+rel="stylesheet"/g) || []).length;
if (stylesheetLinkCount !== 2) {
  console.error(`Expected 2 runtime stylesheet links, found ${stylesheetLinkCount}.`);
  process.exit(1);
}

const generatorSource = await readFile(resolve(root, 'scripts/build-foundation-css.mjs'), 'utf8');
let previousGeneratorIndex = -1;
for (const file of foundationSources) {
  const index = generatorSource.indexOf(`'${file}'`);
  if (index < 0 || index <= previousGeneratorIndex) {
    console.error(`Foundation generator source order is invalid at ${file}.`);
    process.exit(1);
  }
  previousGeneratorIndex = index;
}

const generatedSource = await readFile(resolve(publicDir, generatedFoundation), 'utf8');
let previousBundleIndex = -1;
for (const file of foundationSources) {
  const marker = `/* ===== ${file} ===== */`;
  const index = generatedSource.indexOf(marker);
  if (index < 0 || index <= previousBundleIndex) {
    console.error(`Generated Foundation V17 order is invalid at ${file}.`);
    process.exit(1);
  }
  previousBundleIndex = index;
}

console.log(`Style Source Guard PASS: ${foundationSources.length} foundation + 1 runtime stylesheet, no orphan CSS files.`);
