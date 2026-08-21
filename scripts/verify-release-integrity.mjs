import { access, readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
let checks = 0;

function pass(condition, message) {
  checks += 1;
  if (!condition) throw new Error(`Release integrity V24 failed: ${message}`);
}

async function mustExist(path) {
  await access(resolve(root, path));
  pass(true, `missing required file: ${path}`);
}

const requiredFiles = [
  'astro.config.mjs',
  'package.json',
  'package-lock.json',
  '.nvmrc',
  '.gitignore',
  '.github/workflows/deploy.yml',
  'src/pages/index.astro',
  'public/pirate-deck.js',
  'public/pirate-deck-card-rules-v2.js',
  'public/pirate-deck-monster-cards-v1.js',
  'public/pirate-deck-a11y-v23.js',
  'scripts/build-foundation-css.mjs',
  'scripts/build-ui-runtime.mjs',
  'scripts/verify-runtime-sources.mjs',
  'scripts/verify-style-sources.mjs',
  'scripts/verify-asset-integrity.mjs',
  'scripts/verify-gameplay-contract.mjs',
  'scripts/verify-pages-deploy.mjs',
  'docs/RUNTIME_SOURCE_GUARD_V20_VERIFIED.md',
  'docs/RUNTIME_SOURCE_GUARD_V20_PAGES_VERIFIED.md',
  'docs/STYLE_SOURCE_GUARD_V21_VERIFIED.md',
  'docs/STYLE_SOURCE_GUARD_V21_PAGES_VERIFIED.md',
  'docs/ASSET_INTEGRITY_V22_VERIFIED.md',
  'docs/ASSET_INTEGRITY_V22_PAGES_VERIFIED.md',
  'docs/A11Y_V23_VERIFIED.md',
  'docs/A11Y_V23_PAGES_VERIFIED.md'
];

for (const file of requiredFiles) await mustExist(file);

const workflowFiles = (await readdir(resolve(root, '.github/workflows'))).sort();
pass(
  workflowFiles.length === 1 && workflowFiles[0] === 'deploy.yml',
  `workflow directory must contain only deploy.yml, found: ${workflowFiles.join(', ') || '(empty)'}`
);

const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const packageLock = JSON.parse(await readFile(resolve(root, 'package-lock.json'), 'utf8'));
const scripts = packageJson.scripts ?? {};
for (const scriptName of [
  'prepare:styles',
  'prepare:scripts',
  'prepare:runtime',
  'verify:sources',
  'verify:styles',
  'verify:assets',
  'verify:gameplay',
  'verify:release',
  'verify:pages',
  'verify:runtime',
  'build'
]) {
  pass(typeof scripts[scriptName] === 'string' && scripts[scriptName].length > 0, `package script ${scriptName} is missing`);
}
pass(packageJson.engines?.node === '>=22.19.0', 'package.json must require Node >=22.19.0');
pass(packageJson.dependencies?.astro === '7.2.4', 'Astro must remain pinned to the V28 security baseline 7.2.4');
pass(packageLock.lockfileVersion === 3, 'package-lock.json must use lockfileVersion 3');
pass(packageLock.packages?.['']?.dependencies?.astro === '7.2.4', 'package-lock root Astro dependency must match 7.2.4');
pass(packageLock.packages?.['']?.engines?.node === '>=22.19.0', 'package-lock root Node engine must match package.json');
pass(packageLock.packages?.['node_modules/astro']?.version === '7.2.4', 'package-lock must resolve Astro exactly to 7.2.4');
pass(scripts['verify:gameplay'].includes('verify-gameplay-contract.mjs'), 'verify:gameplay must run the gameplay contract verifier');
pass(scripts['verify:pages'].includes('verify-pages-deploy.mjs'), 'verify:pages must run the Pages smoke verifier');
pass(scripts['verify:runtime'].includes('verify:gameplay'), 'verify:runtime must include verify:gameplay');
pass(scripts['verify:runtime'].includes('verify:release'), 'verify:runtime must include verify:release');
pass(scripts.build.includes('prepare:runtime'), 'build must prepare generated runtime assets');
pass(scripts.build.includes('verify:runtime'), 'build must run runtime verification');
pass(scripts.build.includes('astro build'), 'build must run astro build');

const nvmrc = (await readFile(resolve(root, '.nvmrc'), 'utf8')).trim();
pass(nvmrc === '22.19.0', '.nvmrc must pin Node 22.19.0');

const astroConfig = await readFile(resolve(root, 'astro.config.mjs'), 'utf8');
pass(astroConfig.includes("site: 'https://o-some.github.io'"), 'Astro site URL changed unexpectedly');
pass(astroConfig.includes("base: '/pirate-deck'"), 'Astro base path changed unexpectedly');
pass(astroConfig.includes("output: 'static'"), 'Astro output must remain static');

const index = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
for (const expected of [
  'pirate-deck-foundation-v17.css',
  'pirate-deck-runtime-v15.css',
  'pirate-deck.js',
  'pirate-deck-card-rules-v2.js',
  'pirate-deck-monster-cards-v1.js',
  'pirate-deck-ui-runtime-v18.js'
]) {
  pass(index.includes(expected), `index.astro no longer references ${expected}`);
}
const scriptTagCount = (index.match(/<script\s+src=/g) ?? []).length;
pass(scriptTagCount === 4, `index.astro must keep exactly 4 runtime script tags, found ${scriptTagCount}`);

const runtimeBuilder = await readFile(resolve(root, 'scripts/build-ui-runtime.mjs'), 'utf8');
for (const expected of [
  'pirate-deck-asset-guard.js',
  'pirate-deck-info-toast.js',
  'pirate-deck-guide-v1.js',
  'pirate-deck-hud-hp-v4.js',
  'pirate-deck-hand7-v5.js',
  'pirate-deck-a11y-v23.js'
]) {
  pass(runtimeBuilder.includes(`'${expected}'`), `UI runtime builder lost ${expected}`);
}
pass(runtimeBuilder.includes("'pirate-deck-ui-runtime-v18.js'"), 'UI runtime output filename changed unexpectedly');

const styleBuilder = await readFile(resolve(root, 'scripts/build-foundation-css.mjs'), 'utf8');
const styleSources = [
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
for (const expected of styleSources) {
  pass(styleBuilder.includes(`'${expected}'`), `foundation CSS builder lost ${expected}`);
}
pass(styleBuilder.includes("'pirate-deck-foundation-v17.css'"), 'foundation CSS output filename changed unexpectedly');

const gitignore = await readFile(resolve(root, '.gitignore'), 'utf8');
for (const generated of [
  'public/pirate-deck-foundation-v17.css',
  'public/pirate-deck-ui-runtime-v18.js'
]) {
  pass(gitignore.split(/\r?\n/).includes(generated), `${generated} must remain ignored because it is generated during build`);
}

const deployWorkflow = await readFile(resolve(root, '.github/workflows/deploy.yml'), 'utf8');
for (const expected of [
  'branches: [main]',
  'actions/checkout@v5',
  'actions/setup-node@v5',
  'node-version: 22.19.0',
  'run: npm ci',
  'npm run build',
  'actions/upload-pages-artifact@v3',
  'actions/deploy-pages@v4',
  'path: ./dist',
  'name: Verify live Pages deployment',
  'needs: deploy',
  'npm run verify:pages -- https://o-some.github.io/pirate-deck/'
]) {
  pass(deployWorkflow.includes(expected), `deploy.yml lost required release step: ${expected}`);
}
pass(!deployWorkflow.includes('run: npm install'), 'deploy.yml must use npm ci instead of npm install');

console.log(`Release integrity V24: PASS (${checks} checks).`);
