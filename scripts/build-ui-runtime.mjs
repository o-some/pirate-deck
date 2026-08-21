import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const files = [
  'pirate-deck-asset-guard.js',
  'pirate-deck-info-toast.js',
  'pirate-deck-guide-v1.js',
  'pirate-deck-hud-hp-v4.js',
  'pirate-deck-hand7-v5.js'
];

const parts = [
  '/* Pirate Deck — UI Runtime V18\n   Generated from the five UI/UX enhancement scripts in their exact runtime order.\n   Do not edit this generated file directly. */\n'
];

for (const file of files) {
  const source = await readFile(resolve(root, 'public', file), 'utf8');
  parts.push(`\n/* ===== ${file} ===== */\n${source.trimEnd()}\n;\n`);
}

await writeFile(
  resolve(root, 'public', 'pirate-deck-ui-runtime-v18.js'),
  parts.join(''),
  'utf8'
);

console.log(`Generated pirate-deck-ui-runtime-v18.js from ${files.length} source files.`);
