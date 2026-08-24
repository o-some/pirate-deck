import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
let checks = 0;

function pass(condition, message){
  checks += 1;
  if(!condition) throw new Error(`Gameplay V30 failed: ${message}`);
}

const gameplay = await readFile(resolve(root,'public/pirate-deck-gameplay-v30.js'),'utf8');
const styles = await readFile(resolve(root,'public/pirate-deck-gameplay-v30.css'),'utf8');
const runtimeBuilder = await readFile(resolve(root,'scripts/build-ui-runtime.mjs'),'utf8');
const runtimeGuard = await readFile(resolve(root,'scripts/verify-runtime-sources.mjs'),'utf8');
const styleBuilder = await readFile(resolve(root,'scripts/build-foundation-css.mjs'),'utf8');
const styleGuard = await readFile(resolve(root,'scripts/verify-style-sources.mjs'),'utf8');
const index = await readFile(resolve(root,'src/pages/index.astro'),'utf8');

const hpMatch = gameplay.match(/const BOSS_HP_V30 = \[([^\]]+)\]/);
pass(Boolean(hpMatch),'boss HP progression constant is missing');
const bossHp = hpMatch[1].split(',').map(value=>Number(value.trim())).filter(Number.isFinite);
pass(bossHp.length === 10,`expected 10 V30 boss HP values, found ${bossHp.length}`);
pass(bossHp[0] >= 35,'first boss must require a multi-turn fight');
pass(bossHp.at(-1) >= 120,'final boss must have endgame durability');
for(let i=1;i<bossHp.length;i++) pass(bossHp[i] > bossHp[i-1],`boss HP must increase at index ${i}`);

for(const marker of [
  'const MAX_FIELD = 3',
  'const MAX_ENEMY = 2',
  'const MAX_HAND = 7',
  'next.maxPlayerHp = maxPlayerHp()',
  "next.phase = 'player'",
  'state.playerShield',
  'state.bossShield',
  'state.pendingEnergyPenalty',
  'state.nextIntent = planIntent',
  'state.maxEnergy = Math.min(5',
  'state.energy = Math.max(1, state.maxEnergy - penalty)'
]) pass(gameplay.includes(marker),`state/energy contract lost: ${marker}`);

const intents = ['strike','summon','steal','storm','tax','hook','fortify','swap','curse','royal','royalGuard'];
for(const intent of intents) pass(gameplay.includes(`type:'${intent}'`),`boss intent missing: ${intent}`);
pass((gameplay.match(/case \d:/g) ?? []).length >= 9,'boss intent planner must keep distinct boss cases');

for(const marker of [
  'function endPlayerTurnV30()',
  "state.phase = 'enemy'",
  'playerAttackPhase()',
  'enemyCrewPhase()',
  'executeBossIntent(intent)',
  'beginNextTurn()',
  "state.phase = 'player'",
  "end.textContent = state.phase === 'enemy' ? '☠ BOSS IST DRAN …' : '⚔ ZUG BEENDEN · BOSS DRAN'"
]) pass(gameplay.includes(marker),`turn loop contract lost: ${marker}`);

for(const marker of [
  'function applyBossDamage(',
  'Math.min(state.bossShield || 0, amount)',
  'function applyTulaDamage(',
  'Math.min(state.playerShield || 0, amount)',
  'function spawnEnemy(',
  'function cleanupUnits()',
  'target.hp -= Math.max(1, unit.atk)',
  'target.hp -= Math.max(1, enemy.atk)'
]) pass(gameplay.includes(marker),`combat contract lost: ${marker}`);

const languageCount = (gameplay.match(/\{id:'[^']+',de:'[^']+',en:'[^']+'/g) ?? []).length;
pass(languageCount >= 16,`expected at least 16 V30 language challenges, found ${languageCount}`);
for(const marker of [
  'if(mode === 0)',
  '}else if(mode === 1){',
  'Ergänze:',
  'Richtig = voller Karteneffekt. Falsch = die Karte wird trotzdem gespielt',
  'Math.floor(card.atk * .6)',
  'Math.floor(card.hp * .7)',
  'state.correctChain += 1',
  'state.correctChain % 2 === 0',
  'WORT-COMBO'
]) pass(gameplay.includes(marker),`learning/soft-fail contract lost: ${marker}`);

pass(!gameplay.includes('state.discarded.push(card.id)'), 'V30 must not delete a card from the fight on a wrong answer');
pass(gameplay.includes('state.hand = state.hand.filter(item => item.id !== card.id)'), 'played cards must leave the hand');

for(const marker of [
  'function showReward()',
  'Wähle 1 Upgrade',
  "+1 Angriff",
  "+2 Leben",
  '−1 Kosten',
  'rewardedBosses.add(bossIndex)',
  'nextBoss()'
]) pass(gameplay.includes(marker),`boss reward contract lost: ${marker}`);

for(const marker of [
  'boss-intent-v30',
  'language-combo-v30',
  'phase-chip-v30',
  'reward-v30',
  'shield-chip-v30',
  '@media (max-width:640px)',
  '@media (prefers-reduced-motion:reduce)'
]) pass(styles.includes(marker),`V30 stylesheet lost selector/rule: ${marker}`);

pass(runtimeBuilder.includes("'pirate-deck-gameplay-v30.js'"),'UI runtime builder must include gameplay V30');
pass(runtimeBuilder.indexOf("'pirate-deck-gameplay-v30.js'") < runtimeBuilder.indexOf("'pirate-deck-a11y-v23.js'"),'gameplay V30 must execute before accessibility focus layer');
pass(runtimeGuard.includes("'pirate-deck-gameplay-v30.js'"),'runtime source guard must classify gameplay V30');
pass(styleBuilder.includes("'pirate-deck-gameplay-v30.css'"),'foundation builder must include gameplay V30 styles');
pass(styleGuard.includes("'pirate-deck-gameplay-v30.css'"),'style guard must classify gameplay V30 styles');
pass((index.match(/<script\s+src=/g) ?? []).length === 4,'V30 must not add another direct runtime script tag');
pass((index.match(/<link\s+rel="stylesheet"/g) ?? []).length === 2,'V30 must not add another direct stylesheet link');

console.log(`Gameplay V30: PASS (${checks} checks).`);
