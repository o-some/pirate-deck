import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
let checks = 0;

function pass(condition, message) {
  checks += 1;
  if (!condition) throw new Error(`Gameplay Contract V26 failed: ${message}`);
}

function sliceBetween(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  pass(start >= 0, `${label}: missing start marker ${startMarker}`);
  pass(end > start, `${label}: missing end marker ${endMarker}`);
  return source.slice(start, end);
}

const index = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
const core = await readFile(resolve(root, 'public/pirate-deck.js'), 'utf8');
const rules = await readFile(resolve(root, 'public/pirate-deck-card-rules-v2.js'), 'utf8');
const monsters = await readFile(resolve(root, 'public/pirate-deck-monster-cards-v1.js'), 'utf8');

// The gameplay DOM contract must remain available to the runtime scripts.
for (const id of [
  'start',
  'restart',
  'endTurn',
  'cards',
  'playerLanes',
  'enemyLanes',
  'energy',
  'energyText',
  'playerHp',
  'bossHp',
  'bossHpText',
  'bossSprite',
  'learn',
  'questionTitle',
  'questionCopy',
  'answers',
  'mastery',
  'log'
]) {
  pass(index.includes(`id="${id}"`), `index.astro lost gameplay DOM id #${id}`);
}

// Runtime patch order is intentional: core -> loss rules -> monster gameplay -> UI bundle.
const runtimeOrder = [
  'pirate-deck.js',
  'pirate-deck-card-rules-v2.js',
  'pirate-deck-monster-cards-v1.js',
  'pirate-deck-ui-runtime-v18.js'
];
let previousScriptIndex = -1;
for (const file of runtimeOrder) {
  const scriptIndex = index.indexOf(file);
  pass(scriptIndex > previousScriptIndex, `runtime script order is invalid around ${file}`);
  previousScriptIndex = scriptIndex;
}
pass((index.match(/<script\s+src=/g) ?? []).length === runtimeOrder.length, 'index.astro must keep exactly four runtime script tags');

// Boss progression contract.
const bossBlock = sliceBetween(core, 'const BOSS_ROSTER=[', 'const CARD_POOL=[', 'boss roster');
const bosses = [...bossBlock.matchAll(/id:'([^']+)'[\s\S]*?name:'([^']+)'[\s\S]*?level:(\d+),[\s\S]*?hp:(\d+),[\s\S]*?sprite:'([^']+)'/g)]
  .map(match => ({ id: match[1], name: match[2], level: Number(match[3]), hp: Number(match[4]), sprite: match[5] }));
pass(bosses.length === 10, `expected 10 bosses, found ${bosses.length}`);
pass(new Set(bosses.map(boss => boss.id)).size === bosses.length, 'boss ids must be unique');
pass(new Set(bosses.map(boss => boss.sprite)).size === bosses.length, 'boss sprites must be unique');
for (let index = 0; index < bosses.length; index += 1) {
  const boss = bosses[index];
  pass(boss.level === index + 1, `boss ${boss.name} must remain level ${index + 1}`);
  pass(boss.sprite.startsWith('bosses/level-'), `boss ${boss.name} lost its local sprite path`);
  if (index > 0) pass(boss.hp > bosses[index - 1].hp, `boss HP must increase from level ${index} to ${index + 1}`);
}

const freshBlock = sliceBetween(core, 'function fresh(', 'function shuffle(', 'fresh state');
for (const marker of [
  'bossHp:BOSS_ROSTER[bossIndex].hp',
  'playerHp:20',
  'maxEnergy:3',
  'energy:3',
  'hand:[...CARD_POOL].slice(0,4)',
  'field:[]',
  'enemy:[]',
  'turn:1',
  'bossRewarded:false'
]) {
  pass(freshBlock.includes(marker), `fresh combat state lost ${marker}`);
}

const endTurnBlock = sliceBetween(core, 'function endTurn(){', 'function selectBoss(', 'end turn');
for (const marker of [
  'state.field.reduce((s,c)=>s+c.atk,0)',
  'state.bossHp=Math.max(0,state.bossHp-damage)',
  'state.playerHp-=Math.max(1,strength-1)',
  'state.turn++',
  'state.maxEnergy=Math.min(6,state.maxEnergy+1)',
  'state.energy=state.maxEnergy',
  'draw()'
]) {
  pass(endTurnBlock.includes(marker), `end-turn contract lost ${marker}`);
}

const nextBossBlock = sliceBetween(core, 'function nextBoss(){', 'function restart(){', 'boss transition');
pass(nextBossBlock.includes('state.bossIndex>=BOSS_ROSTER.length-1'), 'final boss guard is missing');
pass(nextBossBlock.includes('selectBoss(state.bossIndex+1)'), 'next boss must advance exactly one level');

const restartBlock = sliceBetween(core, 'function restart(){', 'function initIntro(){', 'restart');
pass(restartBlock.includes('const index=state?.bossIndex??0'), 'restart must preserve selected boss');
pass(restartBlock.includes('const shells=state?.shells??0'), 'restart must preserve earned shells');
pass(restartBlock.includes('state=fresh(index,shells)'), 'restart must rebuild combat state through fresh()');

// Monster/card identity contract.
const cardBlock = sliceBetween(core, 'const CARD_POOL=[', 'let state;', 'card pool');
const cardIds = [...cardBlock.matchAll(/\{id:'([^']+)'/g)].map(match => match[1]);
pass(cardIds.length === 8, `expected 8 base cards, found ${cardIds.length}`);
pass(new Set(cardIds).size === cardIds.length, 'base card ids must be unique');

const monsterDefBlock = sliceBetween(monsters, 'const MONSTER_DEFS = {', 'const QUESTION_POOL = [', 'monster definitions');
for (const id of cardIds) {
  pass(monsterDefBlock.includes(`    ${id}: {`), `monster definition missing for card id ${id}`);
}
pass((monsterDefBlock.match(/image: 'card-monsters\//g) ?? []).length === cardIds.length, 'each monster must keep one local image reference');
pass((monsterDefBlock.match(/cost: \d+/g) ?? []).length === cardIds.length, 'each monster must keep an energy cost');
pass((monsterDefBlock.match(/atk: \d+/g) ?? []).length === cardIds.length, 'each monster must keep an attack value');
pass((monsterDefBlock.match(/hp: \d+/g) ?? []).length === cardIds.length, 'each monster must keep a defense value');

// Question pool quality contract: unique questions, one correct answer, two distinct distractors.
const questionBlock = sliceBetween(monsters, 'const QUESTION_POOL = [', 'let lastQuestionId = null;', 'question pool');
const questions = [...questionBlock.matchAll(/\{\s*id:'([^']+)',\s*de:'([^']+)',\s*correct:'([^']+)',\s*wrong:\[([^\]]+)\]\s*\}/g)]
  .map(match => ({
    id: match[1],
    de: match[2],
    correct: match[3],
    wrong: [...match[4].matchAll(/'([^']+)'/g)].map(option => option[1])
  }));
pass(questions.length === 16, `expected 16 language questions, found ${questions.length}`);
pass(new Set(questions.map(question => question.id)).size === questions.length, 'question ids must be unique');
for (const question of questions) {
  pass(question.wrong.length === 2, `${question.id} must keep exactly two distractors`);
  pass(!question.wrong.includes(question.correct), `${question.id} repeats the correct answer as distractor`);
  pass(new Set([question.correct, ...question.wrong]).size === 3, `${question.id} answer options must be unique`);
}
pass(monsters.includes('const eligible = QUESTION_POOL.filter(q => q.id !== lastQuestionId)'), 'question picker must avoid immediate repetition');

// Wrong answers must consume the card and energy without adding a unit or damaging the boss.
const wrongStart = monsters.indexOf('if(!correct){');
const wrongEnd = monsters.indexOf('\n      return;', wrongStart);
pass(wrongStart >= 0 && wrongEnd > wrongStart, 'wrong-answer branch could not be located');
const wrongBlock = monsters.slice(wrongStart, wrongEnd);
for (const marker of [
  'state.energy=Math.max(0,state.energy-card.cost)',
  'state.hand=state.hand.filter(item=>item.id!==card.id)',
  'state.discarded=Array.isArray(state.discarded)?state.discarded:[]',
  'state.discarded.push(card.id)'
]) {
  pass(wrongBlock.includes(marker), `wrong-answer contract lost ${marker}`);
}
pass(!wrongBlock.includes('state.field.push'), 'wrong answer must not place a monster on the field');
pass(!wrongBlock.includes('state.bossHp-='), 'wrong answer must not damage the boss');

// Correct answers must consume energy/card, create the played unit and apply field/overflow combat.
const correctBlock = monsters.slice(wrongEnd, monsters.indexOf('\n  decorateHandCards();', wrongEnd));
for (const marker of [
  'state.energy=Math.max(0,state.energy-card.cost)',
  'state.hand=state.hand.filter(item=>item.id!==card.id)',
  'const played={...card,atk,hp}',
  'state.field.push(played)',
  'state.bossHp-=Math.max(1,atk-1)',
  "if(card.effectKind==='rush'",
  "if(card.effectKind==='burst'",
  "if(card.effectKind==='draw') draw()",
  'state.bossHp=Math.max(0,state.bossHp)'
]) {
  pass(correctBlock.includes(marker), `correct-answer contract lost ${marker}`);
}

// Discarded/field cards must not be redrawn during the same boss fight.
const drawBlock = sliceBetween(rules, 'draw = function patchedDraw()', 'if (state && !Array.isArray(state.discarded))', 'draw patch');
for (const marker of [
  '!state.hand.some(handCard => handCard.id === card.id)',
  '!discarded.includes(card.id)',
  '!fieldIds.includes(card.id)',
  'state.hand.push(pool[0])'
]) {
  pass(drawBlock.includes(marker), `draw contract lost ${marker}`);
}

// Keep the intended patch chain intact.
for (const marker of ['render = function patchedRender()', 'ask = function patchedAsk(card)', 'resolve = function patchedResolve(card, correct, button)', 'draw = function patchedDraw()']) {
  pass(rules.includes(marker), `card-rules patch lost ${marker}`);
}
for (const marker of ['render = function monsterRender()', 'ask = function monsterAsk(card)', 'function resolveMonsterQuestion(card,question,correct,button)']) {
  pass(monsters.includes(marker), `monster gameplay patch lost ${marker}`);
}

console.log(`Gameplay Contract V26: PASS (${checks} checks).`);
