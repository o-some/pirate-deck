import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const publicDir = resolve(root, 'public');
const bossesDir = resolve(publicDir, 'bosses');
const monstersDir = resolve(publicDir, 'card-monsters');

const bosses = [
  'level-01-pirat-kai.webp',
  'level-02-kapitaen-brax.webp',
  'level-03-blackfinn.webp',
  'level-04-alt-kapitaen-roderick.webp',
  'level-05-piratenbaron-vargas.webp',
  'level-06-kapitaen-ironhook.webp',
  'level-07-admiral-thorne.webp',
  'level-08-kartenmeister-corvin.webp',
  'level-09-schattenfuerst-azrak.webp',
  'level-10-piratenkoenig-varkos.webp'
];

const monsters = [
  { id: 'neri', name: 'Neri', title: 'Meereskundschafter', runtime: '01-neri-meereskundschafter.webp' },
  { id: 'pompi', name: 'Pompi', title: 'Apfelgeist', runtime: '02-pompi-apfelgeist.webp' },
  { id: 'wavi', name: 'Wavi', title: 'Wellengeist', runtime: '03-wavi-wellengeist.webp' },
  { id: 'mira', name: 'Mira', title: 'Herzhüterin', runtime: '04-mira-herzhueterin.webp' },
  { id: 'soli', name: 'Soli', title: 'Sonnengeist', runtime: '05-soli-sonnengeist.webp' },
  { id: 'lexi', name: 'Lexi', title: 'Runengelehrter', runtime: '06-lexi-runengelehrter.webp' },
  { id: 'krax', name: 'Krax', title: 'Sprintkrabbler', runtime: '07-krax-sprintkrabbler.webp' },
  { id: 'moa', name: 'Moa', title: 'Inselwächter', runtime: '08-moa-inselwaechter.webp' }
];

const imagePattern = /\.(?:webp|png|jpe?g|avif|gif|svg)$/i;

async function assertExactImages(directory, expected, label) {
  const entries = await readdir(directory, { withFileTypes: true });
  const actual = entries
    .filter(entry => entry.isFile() && imagePattern.test(entry.name))
    .map(entry => entry.name)
    .sort();
  const wanted = [...expected].sort();

  const missing = wanted.filter(name => !actual.includes(name));
  const orphaned = actual.filter(name => !wanted.includes(name));
  if (missing.length || orphaned.length) {
    if (missing.length) console.error(`${label} missing images: ${missing.join(', ')}`);
    if (orphaned.length) console.error(`${label} orphan images: ${orphaned.join(', ')}`);
    process.exit(1);
  }

  for (const name of expected) {
    const info = await stat(resolve(directory, name));
    if (!info.isFile() || info.size <= 0) {
      console.error(`${label} image is empty or invalid: ${name}`);
      process.exit(1);
    }
  }
}

await assertExactImages(bossesDir, bosses, 'Boss');
await assertExactImages(monstersDir, monsters.map(monster => monster.runtime), 'Monster');

const coreSource = await readFile(resolve(publicDir, 'pirate-deck.js'), 'utf8');
let previousBossIndex = -1;
for (const file of bosses) {
  const path = `bosses/${file}`;
  const count = coreSource.split(path).length - 1;
  const index = coreSource.indexOf(path);
  if (count !== 1 || index <= previousBossIndex) {
    console.error(`Boss roster reference invalid or out of order: ${path}`);
    process.exit(1);
  }
  previousBossIndex = index;
}
const bossSpriteCount = (coreSource.match(/sprite:'bosses\//g) || []).length;
if (bossSpriteCount !== bosses.length) {
  console.error(`Expected ${bosses.length} boss sprite references, found ${bossSpriteCount}.`);
  process.exit(1);
}

const monsterSource = await readFile(resolve(publicDir, 'pirate-deck-monster-cards-v1.js'), 'utf8');
for (const monster of monsters) {
  const path = `card-monsters/${monster.runtime}`;
  const count = monsterSource.split(path).length - 1;
  const identity = `name: '${monster.name}', title: '${monster.title}', image: '${path}'`;
  if (count !== 1 || !monsterSource.includes(identity)) {
    console.error(`Monster definition mismatch: ${monster.name} / ${monster.runtime}`);
    process.exit(1);
  }
}

const manifestPath = resolve(monstersDir, 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest.version !== 2 || manifest.runtimeMode !== 'individual-webp') {
  console.error('Monster manifest version/runtimeMode is invalid.');
  process.exit(1);
}
if (!Array.isArray(manifest.monsters) || manifest.monsters.length !== monsters.length) {
  console.error(`Expected ${monsters.length} manifest monsters.`);
  process.exit(1);
}

for (let index = 0; index < monsters.length; index += 1) {
  const expected = monsters[index];
  const actual = manifest.monsters[index];
  if (!actual || actual.id !== expected.id || actual.name !== expected.name || actual.title !== expected.title || actual.runtime !== expected.runtime) {
    console.error(`Monster manifest mismatch at position ${index + 1}: expected ${expected.name}.`);
    process.exit(1);
  }
}

console.log(`Asset Integrity Guard PASS: ${bosses.length} bosses + ${monsters.length} monster images, no orphan runtime images.`);
