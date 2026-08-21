/* Pirate Deck — Monster Cards V1
   Card identity/art is independent from language questions.
   Correct answer: card may be played. Wrong answer: card is discarded for this boss fight. */
(() => {
  const MONSTER_DEFS = {
    turtle: {
      name: 'Neri', title: 'Meereskundschafter', spriteIndex: 0, type: 'WÄCHTER',
      cost: 2, atk: 3, hp: 4, effectKind: 'attack_bonus', effectValue: 2,
      effectLabel: 'VORHUT', effectText: '+2 Angriff beim Ausspielen'
    },
    apple: {
      name: 'Pompi', title: 'Apfelgeist', spriteIndex: 1, type: 'GEIST',
      cost: 1, atk: 2, hp: 3, effectKind: 'heal', effectValue: 2,
      effectLabel: 'HEILUNG', effectText: 'Tula erhält +2 Leben'
    },
    swim: {
      name: 'Wavi', title: 'Wellengeist', spriteIndex: 2, type: 'GEIST',
      cost: 2, atk: 4, hp: 2, effectKind: 'rush', effectValue: 0,
      effectLabel: 'SOFORT', effectText: 'Greift den Boss sofort an'
    },
    friend: {
      name: 'Mira', title: 'Herzhüterin', spriteIndex: 3, type: 'WÄCHTER',
      cost: 2, atk: 2, hp: 5, effectKind: 'defense_bonus', effectValue: 2,
      effectLabel: 'SCHUTZ', effectText: '+2 Verteidigung beim Ausspielen'
    },
    sunny: {
      name: 'Soli', title: 'Sonnengeist', spriteIndex: 4, type: 'ZAUBERWESEN',
      cost: 1, atk: 3, hp: 2, effectKind: 'shell', effectValue: 1,
      effectLabel: 'BONUS', effectText: '+1 Muschel bei Erfolg'
    },
    book: {
      name: 'Lexi', title: 'Runengelehrter', spriteIndex: 5, type: 'MAGIER',
      cost: 2, atk: 2, hp: 3, effectKind: 'draw', effectValue: 1,
      effectLabel: 'WISSEN', effectText: 'Ziehe nach dem Ausspielen 1 Karte'
    },
    run: {
      name: 'Krax', title: 'Sprintkrabbler', spriteIndex: 6, type: 'STÜRMER',
      cost: 2, atk: 4, hp: 2, effectKind: 'burst', effectValue: 2,
      effectLabel: 'ANSTURM', effectText: '+2 direkter Boss-Schaden'
    },
    island: {
      name: 'Moa', title: 'Inselwächter', spriteIndex: 7, type: 'TITAN',
      cost: 3, atk: 2, hp: 6, effectKind: 'defense_bonus', effectValue: 3,
      effectLabel: 'BASTION', effectText: '+3 Verteidigung beim Ausspielen'
    }
  };

  const QUESTION_POOL = [
    { id:'q-house',  de:'Haus',       correct:'house',  wrong:['horse','mouse'] },
    { id:'q-water',  de:'Wasser',     correct:'water',  wrong:['window','winter'] },
    { id:'q-eat',    de:'essen',      correct:'eat',    wrong:['read','sleep'] },
    { id:'q-fast',   de:'schnell',    correct:'fast',   wrong:['slow','small'] },
    { id:'q-brave',  de:'mutig',      correct:'brave',  wrong:['tired','quiet'] },
    { id:'q-speak',  de:'sprechen',   correct:'speak',  wrong:['swim','stand'] },
    { id:'q-school', de:'Schule',     correct:'school', wrong:['street','shop'] },
    { id:'q-night',  de:'Nacht',      correct:'night',  wrong:['morning','light'] },
    { id:'q-tree',   de:'Baum',       correct:'tree',   wrong:['train','door'] },
    { id:'q-happy',  de:'glücklich',  correct:'happy',  wrong:['hungry','heavy'] },
    { id:'q-run',    de:'laufen',     correct:'run',    wrong:['write','drink'] },
    { id:'q-book',   de:'Buch',       correct:'book',   wrong:['boat','bread'] }
  ];

  let lastQuestionId = null;

  function shuffleLocal(list){
    const copy=[...list];
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  }

  function pickQuestion(){
    const eligible = QUESTION_POOL.filter(q => q.id !== lastQuestionId);
    const question = eligible[Math.floor(Math.random()*eligible.length)] || QUESTION_POOL[0];
    lastQuestionId = question.id;
    return question;
  }

  /* Mutate existing card objects in-place so every existing state/hand reference stays valid. */
  CARD_POOL.forEach(card => {
    const def = MONSTER_DEFS[card.id];
    if(!def) return;
    Object.assign(card, {
      name: def.name,
      monsterTitle: def.title,
      spriteIndex: def.spriteIndex,
      cardType: def.type,
      cost: def.cost,
      atk: def.atk,
      hp: def.hp,
      effectKind: def.effectKind,
      effectValue: def.effectValue,
      effectLabel: def.effectLabel,
      effectText: def.effectText,
      text: `${def.effectLabel} · ${def.effectText}`
    });
  });

  function spritePosition(index){
    const col=index%4;
    const row=Math.floor(index/4);
    return {
      x:['0%','33.333%','66.667%','100%'][col],
      y:row===0?'0%':'100%'
    };
  }

  function decorateHandCards(){
    const host=document.getElementById('cards');
    if(!host || !state?.hand) return;

    [...host.querySelectorAll('.card')].forEach((button,index)=>{
      const card=state.hand[index];
      if(!card) return;
      const pos=spritePosition(card.spriteIndex ?? 0);
      const unaffordable=card.cost>state.energy;

      button.classList.add('monster-card');
      button.classList.toggle('disabled',unaffordable);
      button.disabled=unaffordable || state.playerHp<=0 || state.bossHp<=0;
      button.dataset.monster=card.id;
      button.setAttribute('aria-label',`${card.name}, ${card.monsterTitle}. Kosten ${card.cost} Wellenkraft. Angriff ${card.atk}. Verteidigung ${card.hp}. Antippen für eine Sprachfrage.`);
      button.innerHTML=`
        <span class="cost monster-cost" aria-label="${card.cost} Wellenkraft"><span class="cost-wave" aria-hidden="true">🌊</span><strong>${card.cost}</strong></span>
        <span class="monster-type">${card.cardType}</span>
        <span class="monster-art-frame" aria-hidden="true"><span class="monster-sprite" style="--sprite-x:${pos.x};--sprite-y:${pos.y}"></span></span>
        <span class="monster-name"><strong>${card.name}</strong><small>${card.monsterTitle}</small></span>
        <span class="monster-effect"><small>${card.effectLabel}</small><span>${card.effectText}</span></span>
        <span class="monster-stats">
          <b class="monster-attack"><span>⚔</span><strong>${card.atk}</strong><small>ANGRIFF</small></b>
          <b class="monster-defense"><span>🛡</span><strong>${card.hp}</strong><small>VERTEIDIGUNG</small></b>
        </span>
        <span class="monster-play-hint">ANTIPPEN · FRAGE LÖSEN</span>
      `;
    });
  }

  function decorateBattleSlots(){
    const player=document.getElementById('playerLanes');
    if(player && state?.field){
      player.innerHTML=[0,1,2].map(i=>state.field[i]
        ? `<div class="slot unit monster-unit"><div><b>${state.field[i].name}</b><small>${state.field[i].monsterTitle||''}</small><span>⚔ ${state.field[i].atk} · 🛡 ${state.field[i].hp}</span></div></div>`
        : '<div class="slot">DEIN PLATZ</div>').join('');
    }
    const enemy=document.getElementById('enemyLanes');
    if(enemy && state?.enemy){
      enemy.innerHTML=[0,1,2].map(i=>state.enemy[i]
        ? `<div class="slot unit enemy-unit"><div><b>🏴‍☠️ ${state.enemy[i].name}</b><span>⚔ ${state.enemy[i].atk} · 🛡 ${state.enemy[i].hp}</span></div></div>`
        : '<div class="slot">FREI</div>').join('');
    }
  }

  const previousRender = render;
  render = function monsterRender(){
    previousRender();
    decorateHandCards();
    decorateBattleSlots();
  };

  ask = function monsterAsk(card){
    if(!card || card.cost>state.energy) return;
    const q=pickQuestion();
    const title=document.getElementById('questionTitle');
    const copy=document.getElementById('questionCopy');
    const answers=document.getElementById('answers');
    const mastery=document.getElementById('mastery');
    if(title) title.textContent=`Was bedeutet „${q.de}“ auf Englisch?`;
    if(copy) copy.textContent=`Die Frage ist unabhängig von ${card.name}. Richtig = ${card.name} darf gespielt werden. Falsch = die Karte geht verloren.`;
    if(mastery) mastery.textContent=`🌊 Einsatz: ${card.cost} Wellenkraft · ⚔ ${card.atk} Angriff · 🛡 ${card.hp} Verteidigung`;
    if(answers){
      answers.innerHTML='';
      shuffleLocal([q.correct,...q.wrong]).forEach(option=>{
        const button=document.createElement('button');
        button.className='answer';
        button.textContent=option;
        button.onclick=()=>resolveMonsterQuestion(card,q,option===q.correct,button);
        answers.append(button);
      });
    }
    document.getElementById('learn')?.classList.add('open');
  };

  function resolveMonsterQuestion(card,question,correct,button){
    document.querySelectorAll('.answer').forEach(answer=>{answer.disabled=true;});
    button.classList.add(correct?'good':'bad');
    const mastery=document.getElementById('mastery');

    if(!correct){
      if(mastery) mastery.innerHTML=`💥 <b>Karte verloren!</b> Richtig wäre: ${question.correct}. ${card.cost} Wellenkraft wird trotzdem verbraucht.`;
      setTulaPose('surprised','react-bad');
      setTimeout(()=>{
        state.energy=Math.max(0,state.energy-card.cost);
        state.hand=state.hand.filter(item=>item.id!==card.id);
        state.discarded=Array.isArray(state.discarded)?state.discarded:[];
        if(!state.discarded.includes(card.id)) state.discarded.push(card.id);
        document.getElementById('learn')?.classList.remove('open');
        if(mastery) mastery.textContent='Richtig = Karte darf ins Spiel. Falsch = Karte geht für diesen Bosskampf verloren.';
        const log=document.getElementById('log');
        if(log) log.textContent=`💥 ${card.name} verloren · ${question.de} = ${question.correct}`;
        render();
        if(state.bossHp>0&&state.playerHp>0)setTimeout(()=>setTulaPose('neutral'),700);
      },850);
      return;
    }

    let atk=card.atk;
    let hp=card.hp;
    if(card.effectKind==='attack_bonus') atk+=card.effectValue||0;
    if(card.effectKind==='defense_bonus') hp+=card.effectValue||0;
    if(card.effectKind==='heal') state.playerHp=Math.min(20,state.playerHp+(card.effectValue||0));
    if(card.effectKind==='shell') state.shells+=(card.effectValue||0);

    if(mastery) mastery.innerHTML=`✅ <b>Richtig!</b> ${question.de} = ${question.correct}. ${card.name} darf gespielt werden.`;
    setTulaPose('happy','react-good');

    setTimeout(()=>{
      state.energy=Math.max(0,state.energy-card.cost);
      state.hand=state.hand.filter(item=>item.id!==card.id);
      const played={...card,atk,hp};

      if(state.field.length<3){
        state.field.push(played);
      }else{
        state.bossHp-=Math.max(1,atk-1);
        hitBoss();
      }

      if(card.effectKind==='rush' && state.bossHp>0){
        state.bossHp-=atk;
        hitBoss();
      }
      if(card.effectKind==='burst' && state.bossHp>0){
        state.bossHp-=(card.effectValue||0);
        hitBoss();
      }
      if(card.effectKind==='draw'){
        draw();
      }

      state.bossHp=Math.max(0,state.bossHp);
      document.getElementById('learn')?.classList.remove('open');
      if(mastery) mastery.textContent='Richtig = Karte darf ins Spiel. Falsch = Karte geht für diesen Bosskampf verloren.';
      const log=document.getElementById('log');
      if(log) log.textContent=`✨ ${card.name} beschworen · ${question.de} = ${question.correct}`;
      render();
      if(state.bossHp>0&&state.playerHp>0)setTimeout(()=>setTulaPose('neutral'),700);
    },700);
  }

  /* Initial state was created before this enhancement loaded; mutate references and repaint once. */
  decorateHandCards();
  decorateBattleSlots();
})();
