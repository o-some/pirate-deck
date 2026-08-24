/* Pirate Deck — Tactical Gameplay V30
   Turns "end turn" into a real enemy phase: persistent crew, telegraphed boss actions,
   enemy crew, shields, varied language challenges, softer mistakes, combos and boss rewards. */
(() => {
  const byId = id => document.getElementById(id);
  const BOSS_HP_V30 = [40, 48, 58, 68, 80, 92, 104, 116, 132, 150];
  const MAX_FIELD = 3;
  const MAX_ENEMY = 2;
  const MAX_HAND = 7;
  let runHpBonus = 0;
  const rewardedBosses = new Set();

  const LANGUAGE_CHALLENGES = [
    {id:'house',de:'Haus',en:'house',wrongEn:['horse','mouse'],wrongDe:['Pferd','Maus'],sentence:'This is my ___.'},
    {id:'water',de:'Wasser',en:'water',wrongEn:['window','winter'],wrongDe:['Fenster','Winter'],sentence:'I drink ___.'},
    {id:'eat',de:'essen',en:'eat',wrongEn:['read','sleep'],wrongDe:['lesen','schlafen'],sentence:'We ___ an apple.'},
    {id:'fast',de:'schnell',en:'fast',wrongEn:['slow','small'],wrongDe:['langsam','klein'],sentence:'The ship is very ___.'},
    {id:'brave',de:'mutig',en:'brave',wrongEn:['tired','quiet'],wrongDe:['müde','leise'],sentence:'Tula is ___.'},
    {id:'speak',de:'sprechen',en:'speak',wrongEn:['swim','stand'],wrongDe:['schwimmen','stehen'],sentence:'Parrots can ___.'},
    {id:'school',de:'Schule',en:'school',wrongEn:['street','shop'],wrongDe:['Straße','Laden'],sentence:'The children go to ___.'},
    {id:'night',de:'Nacht',en:'night',wrongEn:['morning','light'],wrongDe:['Morgen','Licht'],sentence:'The stars shine at ___.'},
    {id:'tree',de:'Baum',en:'tree',wrongEn:['train','door'],wrongDe:['Zug','Tür'],sentence:'A bird sits in the ___.'},
    {id:'happy',de:'glücklich',en:'happy',wrongEn:['hungry','heavy'],wrongDe:['hungrig','schwer'],sentence:'Tula feels ___.'},
    {id:'run',de:'laufen',en:'run',wrongEn:['write','drink'],wrongDe:['schreiben','trinken'],sentence:'I can ___ very fast.'},
    {id:'book',de:'Buch',en:'book',wrongEn:['boat','bread'],wrongDe:['Boot','Brot'],sentence:'I read a ___.'},
    {id:'friend',de:'Freund',en:'friend',wrongEn:['family','father'],wrongDe:['Familie','Vater'],sentence:'Kai was once my ___.'},
    {id:'sun',de:'Sonne',en:'sun',wrongEn:['moon','star'],wrongDe:['Mond','Stern'],sentence:'The ___ is shining.'},
    {id:'food',de:'Essen',en:'food',wrongEn:['foot','room'],wrongDe:['Fuß','Zimmer'],sentence:'The crew needs ___.'},
    {id:'small',de:'klein',en:'small',wrongEn:['strong','slow'],wrongDe:['stark','langsam'],sentence:'The crab is very ___.'}
  ];

  const oldBossHp = BOSS_ROSTER.map(boss => boss.hp);
  BOSS_ROSTER.forEach((boss, index) => {
    boss.v30BaseHp = oldBossHp[index];
    boss.hp = BOSS_HP_V30[index];
  });

  function maxPlayerHp(){ return 30 + runHpBonus; }

  function planIntent(bossIndex, turn){
    const level = bossIndex + 1;
    switch(bossIndex){
      case 0: return {type:'strike',icon:'⚔️',title:'Säbelhieb',detail:`${5 + Math.floor((turn-1)/3)} Schaden auf Tula`,value:5 + Math.floor((turn-1)/3)};
      case 1: return {type:'summon',icon:'🏴‍☠️',title:'Crew an Deck',detail:'Ruft einen Decksmatrosen. Ist die Crew voll: 5 Schaden.',value:5};
      case 2: return {type:'steal',icon:'🪙',title:'Schmutziger Raubzug',detail:'4 Schaden und bis zu 2 Muscheln gestohlen.',value:4};
      case 3: return {type:'storm',icon:'🌪️',title:'Sturmkanone',detail:'2 Schaden an jede Crewkarte + 2 auf Tula.',value:2};
      case 4: return {type:'tax',icon:'⛓️',title:'Tribut des Barons',detail:'3 Schaden. Nächster Zug: −1 Wellenkraft.',value:3};
      case 5: return {type:'hook',icon:'🪝',title:'Eisenhaken',detail:'5 Schaden an deine stärkste Crewkarte.',value:5};
      case 6: return {type:'fortify',icon:'🛡️',title:'Admiralswall',detail:`Boss erhält ${6 + Math.floor(level/2)} Schild und verursacht 2 Schaden.`,value:6 + Math.floor(level/2)};
      case 7: return {type:'swap',icon:'🃏',title:'Kartentrick',detail:'Vertauscht deine äußeren Crewplätze + 4 Schaden.',value:4};
      case 8: return {type:'curse',icon:'🌑',title:'Schattenfluch',detail:'5 Schaden, Combo bricht und −1 Wellenkraft im nächsten Zug.',value:5};
      default:
        return turn % 2
          ? {type:'royal',icon:'👑',title:'Königlicher Doppelzug',detail:'7 Schaden + ein Elitepirat betritt das Feld.',value:7}
          : {type:'royalGuard',icon:'👑',title:'Königswache',detail:'5 Boss-Schild + 5 Schaden.',value:5};
    }
  }

  function ensureState(resetHp=false){
    if(!state) return;
    const boss = currentBoss();
    if(resetHp || state.turn === 1 && state.bossHp === boss.v30BaseHp) state.bossHp = boss.hp;
    if(resetHp || !Number.isFinite(state.maxPlayerHp)) state.maxPlayerHp = maxPlayerHp();
    if(resetHp || state.playerHp === 20) state.playerHp = state.maxPlayerHp;
    if(!Number.isFinite(state.playerShield)) state.playerShield = 0;
    if(!Number.isFinite(state.bossShield)) state.bossShield = 0;
    if(!Number.isFinite(state.questionCount)) state.questionCount = 0;
    if(!Number.isFinite(state.correctChain)) state.correctChain = 0;
    if(!Array.isArray(state.comboWords)) state.comboWords = [];
    if(!Number.isFinite(state.playedThisTurn)) state.playedThisTurn = 0;
    if(!Number.isFinite(state.pendingEnergyPenalty)) state.pendingEnergyPenalty = 0;
    if(!state.phase) state.phase = 'player';
    if(!state.nextIntent) state.nextIntent = planIntent(state.bossIndex, state.turn);
    state.enemy = Array.isArray(state.enemy) ? state.enemy.slice(0, MAX_ENEMY) : [];
    state.field = Array.isArray(state.field) ? state.field.slice(0, MAX_FIELD) : [];
  }

  const previousFresh = fresh;
  fresh = function gameplayV30Fresh(...args){
    const next = previousFresh(...args);
    next.maxPlayerHp = maxPlayerHp();
    next.playerHp = next.maxPlayerHp;
    next.playerShield = 0;
    next.bossShield = 0;
    next.questionCount = 0;
    next.correctChain = 0;
    next.comboWords = [];
    next.playedThisTurn = 0;
    next.pendingEnergyPenalty = 0;
    next.phase = 'player';
    next.nextIntent = planIntent(next.bossIndex, 1);
    next.discarded = [];
    return next;
  };

  draw = function gameplayV30Draw(){
    if(!state || state.hand.length >= MAX_HAND) return;
    const onField = new Set((state.field || []).map(card => card.id));
    const candidates = shuffle(CARD_POOL.filter(card =>
      !state.hand.some(held => held.id === card.id) && !onField.has(card.id)
    ));
    if(candidates[0]) state.hand.push(candidates[0]);
  };

  function actionCard(card){
    return ['rush','burst','shell','heal'].includes(card.effectKind);
  }

  function applyBossDamage(rawAmount){
    const amount = Math.max(0, Math.round(rawAmount));
    const blocked = Math.min(state.bossShield || 0, amount);
    state.bossShield = Math.max(0, (state.bossShield || 0) - blocked);
    const dealt = amount - blocked;
    state.bossHp = Math.max(0, state.bossHp - dealt);
    if(dealt > 0) hitBoss();
    return {dealt, blocked};
  }

  function applyTulaDamage(rawAmount){
    const amount = Math.max(0, Math.round(rawAmount));
    const blocked = Math.min(state.playerShield || 0, amount);
    state.playerShield = Math.max(0, (state.playerShield || 0) - blocked);
    const dealt = amount - blocked;
    state.playerHp = Math.max(0, state.playerHp - dealt);
    if(dealt > 0) setTulaPose('surprised','react-bad');
    return {dealt, blocked};
  }

  function pickChallenge(){
    const eligible = LANGUAGE_CHALLENGES.filter(q => q.id !== state.lastChallengeId);
    const challenge = eligible[Math.floor(Math.random() * eligible.length)] || LANGUAGE_CHALLENGES[0];
    state.lastChallengeId = challenge.id;
    const mode = state.questionCount % 3;
    state.questionCount += 1;
    return {challenge, mode};
  }

  function renderQuestion(card, challenge, mode){
    const title = byId('questionTitle');
    const copy = byId('questionCopy');
    const answers = byId('answers');
    const mastery = byId('mastery');
    let options;
    let correctValue;

    if(mode === 0){
      title.textContent = `Was bedeutet „${challenge.de}“ auf Englisch?`;
      copy.textContent = 'Richtig = voller Karteneffekt. Falsch = die Karte wird trotzdem gespielt, aber deutlich schwächer.';
      options = [challenge.en, ...challenge.wrongEn];
      correctValue = challenge.en;
    }else if(mode === 1){
      title.textContent = `Was bedeutet „${challenge.en}“ auf Deutsch?`;
      copy.textContent = 'Jetzt rückwärts: Englisch → Deutsch. Wissen verstärkt deine Karte.';
      options = [challenge.de, ...challenge.wrongDe];
      correctValue = challenge.de;
    }else{
      title.textContent = `Ergänze: „${challenge.sentence}“`;
      copy.textContent = `Gesuchtes Wort auf Deutsch: „${challenge.de}“.`;
      options = [challenge.en, ...challenge.wrongEn];
      correctValue = challenge.en;
    }

    mastery.innerHTML = `<b>${card.name}</b> · 🌊 ${card.cost} · ⚔ ${card.atk} · 🛡 ${card.hp} <span class="question-risk">Fehler = geschwächter Effekt</span>`;
    answers.innerHTML = '';
    shuffle(options).forEach(option => {
      const button = document.createElement('button');
      button.className = 'answer';
      button.textContent = option;
      button.onclick = () => resolveQuestionV30(card, challenge, option === correctValue, button);
      answers.append(button);
    });
  }

  ask = function gameplayV30Ask(card){
    ensureState();
    if(!card || state.phase !== 'player' || card.cost > state.energy || state.playerHp <= 0 || state.bossHp <= 0) return;
    if(!actionCard(card) && state.field.length >= MAX_FIELD){
      if(byId('log')) byId('log').textContent = '⚓ Deine 3 Crewplätze sind voll. Spiele zuerst eine Aktionskarte oder lass den Bosszug beginnen.';
      return;
    }
    const {challenge, mode} = pickChallenge();
    renderQuestion(card, challenge, mode);
    byId('learn')?.classList.add('open');
  };

  function resolveQuestionV30(card, challenge, correct, button){
    document.querySelectorAll('.answer').forEach(answer => { answer.disabled = true; });
    button.classList.add(correct ? 'good' : 'bad');
    const mastery = byId('mastery');
    if(correct){
      mastery.innerHTML = `✅ <b>Richtig!</b> ${challenge.de} = ${challenge.en}. Volle Wortkraft!`;
      setTulaPose('happy','react-good');
    }else{
      mastery.innerHTML = `📘 <b>Merken:</b> ${challenge.de} = ${challenge.en}. Die Karte wird geschwächt gespielt.`;
      setTulaPose('surprised','react-bad');
    }
    setTimeout(() => playCardV30(card, challenge, correct), 560);
  }

  function playCardV30(card, challenge, correct){
    if(!state || state.phase !== 'player') return;
    state.energy = Math.max(0, state.energy - card.cost);
    state.hand = state.hand.filter(item => item.id !== card.id);
    state.playedThisTurn += 1;

    if(correct){
      state.correctChain += 1;
      state.comboWords.push(challenge.de);
    }else{
      state.correctChain = 0;
      state.comboWords = [];
    }

    if(actionCard(card)){
      if(card.effectKind === 'rush') applyBossDamage(correct ? card.atk : Math.max(1, Math.ceil(card.atk / 2)));
      if(card.effectKind === 'burst') applyBossDamage(correct ? card.atk + (card.effectValue || 0) : Math.max(1, Math.ceil(card.atk / 2)));
      if(card.effectKind === 'heal') state.playerHp = Math.min(state.maxPlayerHp, state.playerHp + (correct ? (card.effectValue || 2) : 1));
      if(card.effectKind === 'shell' && correct) state.shells += card.effectValue || 1;
    }else{
      let atk = correct ? card.atk : Math.max(1, Math.floor(card.atk * .6));
      let hp = correct ? card.hp : Math.max(1, Math.floor(card.hp * .7));
      if(correct && card.effectKind === 'attack_bonus') atk += card.effectValue || 0;
      if(correct && card.effectKind === 'defense_bonus') hp += card.effectValue || 0;
      const played = {...card, atk, hp, mastered: correct};
      state.field.push(played);
      if(card.effectKind === 'defense_bonus') state.playerShield += correct ? 2 : 1;
      if(correct && card.effectKind === 'draw') draw();
    }

    if(correct && state.correctChain >= 2 && state.correctChain % 2 === 0 && state.bossHp > 0){
      const bonus = 2 + Math.floor(state.correctChain / 4);
      applyBossDamage(bonus);
      state.playerShield += 1;
      state.lastCombo = `🔥 WORT-COMBO ${state.correctChain}x · ${state.comboWords.slice(-2).join(' + ')} · ${bonus} Bonusschaden +1 Schild`;
    }else if(correct){
      state.lastCombo = `✨ Wortkette ${state.correctChain}x · Noch eine richtige Antwort für den Combo-Bonus.`;
    }else{
      state.lastCombo = '📘 Wortkette unterbrochen – die Karte hilft trotzdem weiter.';
    }

    byId('learn')?.classList.remove('open');
    if(byId('mastery')) byId('mastery').textContent = 'Richtig = voller Effekt. Falsch = geschwächter Effekt – du bleibst im Spiel.';
    if(byId('log')) byId('log').textContent = correct
      ? `✨ ${card.name} mit voller Wortkraft gespielt · ${challenge.de} = ${challenge.en}`
      : `📘 ${card.name} geschwächt gespielt · Merke: ${challenge.de} = ${challenge.en}`;
    render();
    if(state.bossHp > 0 && state.playerHp > 0) setTimeout(() => setTulaPose('neutral'), 650);
  }

  function cleanupUnits(){
    state.field = (state.field || []).filter(unit => unit.hp > 0).slice(0, MAX_FIELD);
    state.enemy = (state.enemy || []).filter(unit => unit.hp > 0).slice(0, MAX_ENEMY);
  }

  function playerAttackPhase(){
    let bossDamage = 0;
    state.field.forEach((unit, lane) => {
      const target = state.enemy[lane];
      if(target){
        target.hp -= Math.max(1, unit.atk);
      }else{
        const result = applyBossDamage(unit.atk);
        bossDamage += result.dealt;
      }
    });
    cleanupUnits();
    return bossDamage;
  }

  function spawnEnemy(elite=false){
    if(state.enemy.length >= MAX_ENEMY) return false;
    const level = state.bossIndex + 1;
    const names = ['Decksmatrose','Pulveraffe','Hakenwache','Nebelpirat','Königsgarde'];
    state.enemy.push({
      id:`enemy-${state.turn}-${state.enemy.length}`,
      name: elite ? 'Elite-Korsar' : names[Math.min(names.length-1, Math.floor((level-1)/2))],
      atk: (elite ? 4 : 2) + Math.floor(level / 3),
      hp: (elite ? 7 : 4) + Math.floor(level / 2)
    });
    return true;
  }

  function enemyCrewPhase(){
    let damageToTula = 0;
    state.enemy.forEach((enemy, lane) => {
      const target = state.field[lane];
      if(target){
        target.hp -= Math.max(1, enemy.atk);
      }else{
        damageToTula += applyTulaDamage(enemy.atk).dealt;
      }
    });
    cleanupUnits();
    return damageToTula;
  }

  function strongestCrewIndex(){
    if(!state.field.length) return -1;
    let best = 0;
    for(let i=1;i<state.field.length;i++){
      if(state.field[i].atk + state.field[i].hp > state.field[best].atk + state.field[best].hp) best = i;
    }
    return best;
  }

  function executeBossIntent(intent){
    let summary = '';
    switch(intent.type){
      case 'strike': {
        const {dealt,blocked} = applyTulaDamage(intent.value);
        summary = `⚔️ Säbelhieb: ${dealt} Schaden${blocked ? `, ${blocked} geblockt` : ''}.`;
        break;
      }
      case 'summon': {
        if(spawnEnemy(false)) summary = '🏴‍☠️ Ein Decksmatrose betritt Kais Crew.';
        else summary = `🏴‍☠️ Crew voll – ${applyTulaDamage(intent.value).dealt} Schaden auf Tula.`;
        break;
      }
      case 'steal': {
        const stolen = Math.min(2, state.shells);
        state.shells -= stolen;
        summary = `🪙 Blackfinn trifft für ${applyTulaDamage(intent.value).dealt} und stiehlt ${stolen} Muschel${stolen===1?'':'n'}.`;
        break;
      }
      case 'storm': {
        state.field.forEach(unit => { unit.hp -= 2; });
        cleanupUnits();
        summary = `🌪️ Sturmkanone: Crew beschädigt, Tula verliert ${applyTulaDamage(2).dealt} Leben.`;
        break;
      }
      case 'tax': {
        state.pendingEnergyPenalty = Math.max(state.pendingEnergyPenalty, 1);
        summary = `⛓️ Tribut: ${applyTulaDamage(intent.value).dealt} Schaden und nächste Runde −1 Wellenkraft.`;
        break;
      }
      case 'hook': {
        const index = strongestCrewIndex();
        if(index >= 0){
          const target = state.field[index];
          target.hp -= intent.value;
          summary = `🪝 Ironhook trifft ${target.name} für ${intent.value}.`;
          cleanupUnits();
        }else{
          summary = `🪝 Kein Beschützer da – Tula verliert ${applyTulaDamage(6).dealt} Leben.`;
        }
        break;
      }
      case 'fortify': {
        state.bossShield += intent.value;
        summary = `🛡️ Thorne erhält ${intent.value} Schild und Tula verliert ${applyTulaDamage(2).dealt} Leben.`;
        break;
      }
      case 'swap': {
        if(state.field.length >= 2){
          const last = state.field.length - 1;
          [state.field[0],state.field[last]] = [state.field[last],state.field[0]];
        }
        summary = `🃏 Corvin mischt deine Formation und verursacht ${applyTulaDamage(intent.value).dealt} Schaden.`;
        break;
      }
      case 'curse': {
        state.correctChain = 0;
        state.comboWords = [];
        state.pendingEnergyPenalty = Math.max(state.pendingEnergyPenalty, 1);
        summary = `🌑 Azraks Fluch: ${applyTulaDamage(intent.value).dealt} Schaden, Combo weg, nächste Runde −1 Wellenkraft.`;
        break;
      }
      case 'royal': {
        const damage = applyTulaDamage(intent.value).dealt;
        spawnEnemy(true);
        summary = `👑 Varkos: ${damage} Schaden + Elite-Korsar.`;
        break;
      }
      default: {
        state.bossShield += 5;
        summary = `👑 Königswache: +5 Boss-Schild und ${applyTulaDamage(5).dealt} Schaden.`;
      }
    }
    return summary;
  }

  function beginNextTurn(){
    if(state.playerHp <= 0 || state.bossHp <= 0) return;
    state.turn += 1;
    state.maxEnergy = Math.min(5, 3 + Math.floor((state.turn - 1) / 2));
    const penalty = state.pendingEnergyPenalty || 0;
    state.energy = Math.max(1, state.maxEnergy - penalty);
    state.pendingEnergyPenalty = 0;
    state.playedThisTurn = 0;
    state.correctChain = 0;
    state.comboWords = [];
    state.phase = 'player';
    draw();
    if(state.turn % 3 === 0) draw();
    state.nextIntent = planIntent(state.bossIndex, state.turn);
    if(byId('log')) byId('log').textContent = `🌊 Zug ${state.turn}: ${state.energy}/${state.maxEnergy} Wellenkraft. Plane gegen: ${state.nextIntent.title}.`;
    render();
    setTimeout(() => setTulaPose('neutral'), 450);
  }

  function endPlayerTurnV30(){
    ensureState();
    if(state.bossHp <= 0){
      if(state.bossIndex >= BOSS_ROSTER.length - 1){
        if(byId('log')) byId('log').textContent = '🏆 Die gesamte Piratenflotte ist besiegt!';
        return;
      }
      showReward();
      return;
    }
    if(state.playerHp <= 0){
      restart();
      ensureState(true);
      render();
      return;
    }
    if(state.phase !== 'player') return;

    state.phase = 'enemy';
    const intent = state.nextIntent || planIntent(state.bossIndex, state.turn);
    const dealt = playerAttackPhase();
    if(byId('log')) byId('log').textContent = `⚔️ Deine Crew greift an${dealt ? `: ${dealt} Boss-Schaden` : ''}. ${state.bossHp > 0 ? 'Jetzt ist der Boss dran.' : ''}`;
    render();

    if(state.bossHp <= 0){
      state.phase = 'player';
      render();
      return;
    }

    const battleBoss = state.bossIndex;
    const battleTurn = state.turn;
    setTimeout(() => {
      if(!state || state.bossIndex !== battleBoss || state.turn !== battleTurn || state.phase !== 'enemy') return;
      const crewDamage = enemyCrewPhase();
      const bossSummary = executeBossIntent(intent);
      cleanupUnits();
      if(byId('log')) byId('log').textContent = `${bossSummary}${crewDamage ? ` Gegnerische Crew: zusätzlich ${crewDamage} Schaden.` : ''}`;
      render();
      if(state.playerHp <= 0) return;
      setTimeout(() => {
        if(state && state.bossIndex === battleBoss && state.turn === battleTurn && state.phase === 'enemy') beginNextTurn();
      }, 650);
    }, 620);
  }

  function upgradeOptions(){
    const base = (state.bossIndex * 2) % CARD_POOL.length;
    const a = CARD_POOL[base];
    const b = CARD_POOL[(base + 1) % CARD_POOL.length];
    const c = CARD_POOL[(base + 2) % CARD_POOL.length];
    return [
      {icon:'⚔️',title:`${a.name}: +1 Angriff`,copy:'Dauerhaft für diesen Run.',apply:()=>{a.atk += 1;}},
      {icon:'🛡️',title:`${b.name}: +2 Leben`,copy:'Mehr Durchhaltevermögen auf dem Feld.',apply:()=>{b.hp += 2;}},
      c.cost > 1
        ? {icon:'🌊',title:`${c.name}: −1 Kosten`,copy:'Mindestens 1 Wellenkraft.',apply:()=>{c.cost = Math.max(1,c.cost-1);}}
        : {icon:'❤️',title:'Tula: +3 Max-Leben',copy:'Gilt für die restliche Bossroute.',apply:()=>{runHpBonus += 3;}}
    ];
  }

  function showReward(){
    const bossIndex = state.bossIndex;
    if(rewardedBosses.has(bossIndex)){
      nextBoss();
      ensureState(true);
      render();
      return;
    }
    let overlay = byId('rewardV30');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'rewardV30';
      overlay.className = 'reward-v30';
      overlay.innerHTML = `<div class="reward-card-v30"><small>🏆 BOSSBELOHNUNG</small><h2>Wähle 1 Upgrade</h2><p>Dein Deck entwickelt sich auf dem Weg zum Piratenkönig.</p><div class="reward-options-v30"></div></div>`;
      document.body.append(overlay);
    }
    const host = overlay.querySelector('.reward-options-v30');
    host.innerHTML = '';
    upgradeOptions().forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = `<span>${option.icon}</span><strong>${option.title}</strong><small>${option.copy}</small>`;
      button.onclick = () => {
        option.apply();
        rewardedBosses.add(bossIndex);
        overlay.classList.remove('open');
        nextBoss();
        ensureState(true);
        render();
      };
      host.append(button);
    });
    overlay.classList.add('open');
  }

  function injectUi(){
    const strip = document.querySelector('.boss-info-strip');
    if(strip && !byId('bossIntentV30')){
      const intent = document.createElement('div');
      intent.id = 'bossIntentV30';
      intent.className = 'boss-intent-v30';
      const progress = strip.querySelector('.boss-progress');
      strip.insertBefore(intent, progress || null);
    }

    const hand = document.querySelector('.hand');
    if(hand && !byId('languageComboV30')){
      const combo = document.createElement('div');
      combo.id = 'languageComboV30';
      combo.className = 'language-combo-v30';
      const footer = hand.querySelector('.footer-actions');
      hand.insertBefore(combo, footer || null);
    }

    const title = document.querySelector('.hand-title');
    if(title && !byId('phaseChipV30')){
      const chip = document.createElement('span');
      chip.id = 'phaseChipV30';
      chip.className = 'phase-chip-v30';
      title.append(chip);
    }
  }

  function renderV30Ui(){
    ensureState();
    injectUi();
    const boss = currentBoss();
    const intent = state.nextIntent || planIntent(state.bossIndex, state.turn);
    const intentNode = byId('bossIntentV30');
    if(intentNode){
      intentNode.innerHTML = `<span class="intent-icon-v30">${intent.icon}</span><span><small>NÄCHSTER BOSSZUG</small><strong>${intent.title}</strong><em>${intent.detail}</em></span>`;
      intentNode.classList.toggle('enemy-phase', state.phase === 'enemy');
    }

    if(byId('languageComboV30')){
      byId('languageComboV30').textContent = state.lastCombo || '🔥 WORT-COMBO: 2 richtige Antworten hintereinander = Bonusschaden + Schild';
    }
    if(byId('phaseChipV30')) byId('phaseChipV30').textContent = state.phase === 'enemy' ? '☠ BOSSZUG' : '🌊 DEIN ZUG';

    const end = byId('endTurn');
    if(end){
      end.disabled = state.phase === 'enemy';
      if(state.playerHp <= 0) end.textContent = '↻ DUELL NEU STARTEN';
      else if(state.bossHp <= 0) end.textContent = state.bossIndex < BOSS_ROSTER.length-1 ? '🎁 BELOHNUNG · WEITER' : '🏆 FLOTTE BESIEGT';
      else end.textContent = state.phase === 'enemy' ? '☠ BOSS IST DRAN …' : '⚔ ZUG BEENDEN · BOSS DRAN';
    }

    const hpText = byId('playerHp')?.parentElement;
    if(hpText){
      const value = byId('playerHp');
      hpText.childNodes.forEach(node => {
        if(node.nodeType === Node.TEXT_NODE && node.textContent.includes('/ 20')) node.textContent = ` / ${state.maxPlayerHp}`;
      });
      if(value) value.textContent = Math.max(0,state.playerHp);
    }
    if(byId('playerHpBar')) byId('playerHpBar').style.width = `${Math.max(0,state.playerHp) / state.maxPlayerHp * 100}%`;

    const tulaHealth = byId('playerHp')?.closest('.character-health,.hud-health');
    if(tulaHealth){
      let shield = tulaHealth.querySelector('.shield-chip-v30');
      if(!shield){ shield = document.createElement('span'); shield.className='shield-chip-v30'; tulaHealth.append(shield); }
      shield.textContent = `🛡 ${state.playerShield || 0}`;
      shield.hidden = !(state.playerShield > 0);
    }
    const bossHealth = byId('bossHpText')?.closest('.character-health,.hud-health');
    if(bossHealth){
      let shield = bossHealth.querySelector('.shield-chip-v30');
      if(!shield){ shield = document.createElement('span'); shield.className='shield-chip-v30 boss'; bossHealth.append(shield); }
      shield.textContent = `🛡 ${state.bossShield || 0}`;
      shield.hidden = !(state.bossShield > 0);
    }

    document.querySelectorAll('.boss-roster-card').forEach(button => { button.disabled = state.phase === 'enemy'; });
    const crewTitle = byId('enemyCrewTitle');
    if(crewTitle) crewTitle.textContent = `☠ ${boss.name.toUpperCase()} · CREW ${state.enemy.length}/${MAX_ENEMY}`;
  }

  const previousRender = render;
  render = function gameplayV30Render(){
    previousRender();
    renderV30Ui();
  };

  function replaceEndTurnHandler(){
    const old = byId('endTurn');
    if(!old || old.dataset.gameplayV30 === '1') return;
    const freshButton = old.cloneNode(true);
    freshButton.dataset.gameplayV30 = '1';
    old.replaceWith(freshButton);
    freshButton.addEventListener('click', endPlayerTurnV30);
  }

  function refreshGuideCopy(){
    const lead = document.querySelector('.guide-lead');
    if(lead) lead.textContent = 'Spiele in deinem Zug mehrere Karten, löse wechselnde Sprachaufgaben und baue eine Crew auf. „Zug beenden“ startet jetzt den echten Bosszug.';
    const steps = [...document.querySelectorAll('.guide-step p')];
    if(steps[0]) steps[0].innerHTML = 'Wähle Crew- und Aktionskarten. Du kannst mehrere Karten spielen, solange deine <b>Wellenkraft</b> reicht.';
    if(steps[1]) steps[1].innerHTML = '<b>Richtig:</b> voller Effekt und Wort-Combo. <b>Falsch:</b> die Karte wird schwächer gespielt – du bleibst im Kampf.';
    if(steps[2]) steps[2].innerHTML = 'Wellenkraft füllt sich nach dem Bosszug wieder auf und steigt im Kampf langsam bis maximal <b>5</b>.';
    if(steps[3]) steps[3].innerHTML = 'Deine Crew bleibt auf dem Feld und greift beim Zugende an. Gegnerische Crew blockiert ihre Bahn und der Boss kündigt seine nächste Aktion vorher an.';
    const warning = document.querySelector('.guide-warning');
    if(warning) warning.textContent = '🎯 Ziel: Boss-Leben auf 0. Achte auf den angekündigten Bosszug, nutze Schild, räume Gegner-Crew ab und baue Wort-Combos auf.';
    const introCopy = document.querySelector('#intro .intro > p');
    if(introCopy) introCopy.textContent = 'Baue deine Monster-Crew auf, spiele mehrere Karten pro Zug, löse Sprachaufgaben und überlebe die angekündigten Bossangriffe.';
    if(byId('mastery')) byId('mastery').textContent = 'Richtig = voller Effekt. Falsch = geschwächter Effekt – du bleibst im Spiel.';
  }

  ensureState(true);
  replaceEndTurnHandler();
  refreshGuideCopy();
  render();

  window.PirateDeckGameplayV30 = {
    planIntent,
    endTurn: endPlayerTurnV30,
    getState: () => state,
    get maxPlayerHp(){ return maxPlayerHp(); }
  };
})();
