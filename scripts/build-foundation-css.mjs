import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const outputFile = join(publicDir, 'pirate-deck-foundation-v17.css');

const sourceFiles = [
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
  'pirate-deck-battle-layout-v3.css',
];

const parts = [];
for (const file of sourceFiles) {
  const css = await readFile(join(publicDir, file), 'utf8');
  parts.push(`/* ===== ${file} ===== */\n${css.trimEnd()}\n`);
}

const banner = `/* Pirate Deck — Foundation CSS V17\n   Generated from the 12 active pre-V15 stylesheets in their exact runtime order.\n   Do not edit this generated file directly. */\n\n`;

await writeFile(outputFile, banner + parts.join('\n'), 'utf8');
console.log(`Generated ${outputFile} from ${sourceFiles.length} source stylesheets.`);
