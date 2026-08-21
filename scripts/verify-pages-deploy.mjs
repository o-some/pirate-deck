const DEFAULT_BASE_URL = 'https://o-some.github.io/pirate-deck/';
const RETRIES = 8;
const RETRY_DELAY_MS = 4000;

const requestedBase = process.argv[2] || DEFAULT_BASE_URL;
const baseUrl = new URL(requestedBase.endsWith('/') ? requestedBase : `${requestedBase}/`);

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
  '01-neri-meereskundschafter.webp',
  '02-pompi-apfelgeist.webp',
  '03-wavi-wellengeist.webp',
  '04-mira-herzhueterin.webp',
  '05-soli-sonnengeist.webp',
  '06-lexi-runengelehrter.webp',
  '07-krax-sprintkrabbler.webp',
  '08-moa-inselwaechter.webp'
];

const requiredPaths = [
  'pirate-deck-foundation-v17.css',
  'pirate-deck-runtime-v15.css',
  'pirate-deck.js',
  'pirate-deck-card-rules-v2.js',
  'pirate-deck-monster-cards-v1.js',
  'pirate-deck-ui-runtime-v18.js',
  'card-monsters/manifest.json',
  ...bosses.map(file => `bosses/${file}`),
  ...monsters.map(file => `card-monsters/${file}`)
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, label) {
  let lastError;

  for (let attempt = 1; attempt <= RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'cache-control': 'no-cache',
          'user-agent': 'pirate-deck-pages-smoke-v25'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < RETRIES) {
        console.warn(`${label}: attempt ${attempt}/${RETRIES} failed (${error.message}); retrying...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  throw new Error(`${label}: failed after ${RETRIES} attempts (${lastError?.message || 'unknown error'})`);
}

function fail(message) {
  throw new Error(`Pages Smoke V25 failed: ${message}`);
}

console.log(`Pages Smoke V25: checking ${baseUrl.href}`);

const pageResponse = await fetchWithRetry(baseUrl, 'index');
const html = await pageResponse.text();

if (!html.trim()) fail('index HTML is empty');
if (!html.includes('<title>Pirate Deck · Tula’s Island</title>')) fail('expected Pirate Deck title is missing');
if (!html.includes('id="start"')) fail('start button marker is missing');
if (!html.includes('id="cards"')) fail('card hand marker is missing');
if (!html.includes('BOSS 1 / 10')) fail('boss progress marker is missing');
if (/\b(?:src|href)=["'](?:\.\.\/|\/src\/|src\/)/i.test(html)) fail('built page contains a source-tree asset reference');

for (const path of requiredPaths.slice(0, 6)) {
  const expected = new URL(path, baseUrl).pathname;
  if (!html.includes(expected)) {
    fail(`index HTML does not reference ${expected}`);
  }
}

for (const path of requiredPaths) {
  const url = new URL(path, baseUrl);
  const response = await fetchWithRetry(url, path);
  const body = await response.arrayBuffer();
  if (body.byteLength === 0) fail(`${path} returned an empty body`);
}

const manifestUrl = new URL('card-monsters/manifest.json', baseUrl);
const manifestResponse = await fetchWithRetry(manifestUrl, 'monster manifest');
const manifest = JSON.parse(await manifestResponse.text());

if (manifest.version !== 2 || manifest.runtimeMode !== 'individual-webp') {
  fail('monster manifest version/runtimeMode is invalid on Pages');
}
if (!Array.isArray(manifest.monsters) || manifest.monsters.length !== monsters.length) {
  fail(`monster manifest must expose ${monsters.length} monsters on Pages`);
}

const deployedMonsterFiles = manifest.monsters.map(monster => monster.runtime);
for (const expected of monsters) {
  if (!deployedMonsterFiles.includes(expected)) fail(`monster manifest lost ${expected}`);
}

console.log(`Pages Smoke V25: PASS (${requiredPaths.length} deployed assets + index HTML).`);
