/* Pirate Deck — Monster Cards V2
   Monster identity/art is independent from language questions.
   Correct answer: card may be played. Wrong answer: card is discarded for this boss fight. */
(() => {
  const MONSTER_DEFS = {
    turtle: {
      name: 'Neri', title: 'Meereskundschafter', image: 'card-monsters/01-neri-meereskundschafter.webp', type: 'WÄCHTER',
      cost: 2, atk: 3, hp: 4, effectKind: 'attack_bonus', effectValue: 2,
      effectLabel: 'VORHUT', effectText: '+2 Angriff beim Ausspielen', emoji: '🐢'
    },
    apple: {
      name: 'Pompi', title: 'Apfelgeist', image: 'card-monsters/02-pompi-apfelgeist.webp', type: 'GEIST',
      cost: 1, atk: 2, hp: 3, effectKind: 'heal', effectValue: 2,
      effectLabel: 'HEILUNG', effectText: 'Tula erhält +2 Leben', emoji: '🍎'
    },
    swim: {
      name: 'Wavi', title: 'Wellengeist', image: 'card-monsters/03-wavi-wellengeist.webp', type: 'GEIST',
      cost: 2, atk: 4, hp: 2, effectKind: 'rush', effectValue: 0,
      effectLabel: 'SOFORT', effectText: 'Greift den Boss sofort an', emoji: '🌊'
    },
    friend: {
      name: 'Mira', title: 'Herzhüterin', image: 'card-monsters/04-mira-herzhueterin.webp', type: 'WÄCHTER',
      cost: 2, atk: 2, hp: 5, effectKind: 'defense_bonus', effectValue: 2,
      effectLabel: 'SCHUTZ', effectText: '+2 Verteidigung beim Ausspielen', emoji: '💚'
    },
    sunny: {
      name: 'Soli', title: 'Sonnengeist', image: 'card-monsters/05-soli-sonnengeist.webp', type: 'ZAUBERWESEN',
      cost: 1, atk: 3, hp: 2, effectKind: 'shell', effectValue: 1,
      effectLabel: 'BONUS', effectText: '+1 Muschel bei Erfolg', emoji: '☀️'
    },
    book: {
      name: 'Lexi', title: 'Runengelehrter', image: 'card-monsters/06-lexi-runengelehrter.webp', type: 'MAGIER',
      cost: 2, atk: 2, hp: 3, effectKind: 'draw', effectValue: 1,
      effectLabel: 'WISSEN', effectText: 'Ziehe nach dem Ausspielen 1 Karte', emoji: '📘'
    },
    run: {
      name: 'Krax', title: 'Sprintkrabbler', image: 'card-monsters/07-krax-sprintkrabbler.webp', type: 'STÜRMER',
      cost: 2, atk: 4, hp: 2, effectKind: 'burst', effectValue: 2,
      effectLabel: 'ANSTURM', effectText: '+2 direkter Boss-Schaden', emoji: '🦀'
    },
    island: {
      name: 'Moa', title: 'Inselwächter', image: 'card-monsters/08-moa-inselwaechter.webp', type: 'TITAN',
      cost: 3, atk: 2, hp: 6, effectKind: 'defense_bonus', effectValue: 3,
      effectLabel: 'BASTION', effectText: '+3 Verteidigung beim Ausspielen', emoji: '🛡️'
    }
  };

  const QUESTION_POOL = [
    { id:'q-house',   de:'Haus',       correct:'house',  wrong:['horse','mouse'] },
    { id:'q-water',   de:'Wasser',     correct:'water',  wrong:['window','winter'] },
    { id:'q-eat',     de:'essen',      correct:'eat',    wrong:['read','sleep'] },
    { id:'q-fast',    de:'schnell',    correct:'fast',   wrong:['slow','small'] },
    { id:'q-brave',   de:'mutig',      correct:'brave',  wrong:['tired','quiet'] },
    { id:'q-speak',   de:'sprechen',   correct:'speak',  wrong:['swim','stand'] },
    { id:'q-school',  de:'Schule',     correct:'school', wrong:['street','shop'] },
    { id:'q-night',   de:'Nacht',      correct:'night',  wrong:['morning','light'] },
    { id:'q-tree',    de:'Baum',       correct:'tree',   wrong:['train','door'] },
    { id:'q-happy',   de:'glücklich',  correct:'happy',  wrong:['hungry','heavy'] },
    { id:'q-run',     de:'laufen',     correct:'run',    wrong:['write','drink'] },
    { id:'q-book',    de:'Buch',       correct:'book',   wrong:['boat','bread'] },
    { id:'q-friend',  de:'Freund',     correct:'friend', wrong:['family','father'] },
    { id:'q-sun',     de:'Sonne',      correct:'sun',    wrong:['moon','star'] },
    { id:'q-food',    de:'Essen',      correct:'food',   wrong:['foot','room'] },
    { id:'q-small',   de:'klein',      correct:'small',  wrong:['strong','slow'] }
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

  /* Mutate existing card objects in-place so existing game state and hand references remain valid. */
  CARD_POOL.forEach(card => {
    const def = MONSTER_DEFS[card.id];
    if(!def) return;
    Object.assign(card, {
      name: def.name,
      monsterTitle: def.title,
      monsterImage: def.image,
      cardType: def.type,
      cost: def.cost,
      atk: def.atk,
      hp: def.hp,
      effectKind: def.effectKind,
      effectValue: def.effectValue,
      effectLabel: def.effectLabel,
      effectText: def.effectText,
      monsterEmoji: def.emoji,
      text: `${def.effectLabel} · ${def.effectText}`
    });
  });

  function artMarkup(card){
    return `<span class="monster-art-frame"><img class="monster-art-img" src="${card.monsterImage}" alt="${card.name}, ${card.monsterTitle}" loading="eager" decoding="async"><span class="monster-art-fallback" aria-hidden="true">${card.monsterEmoji||'🐢'}</span></span>`;
  }

  function installImageFallback(button){
    const img=button.querySelector('.monster-art-img');
    if(!img) return;
    const markFailed=()=>button.classList.add('monster-image-failed');
    img.addEventListener('error',markFailed,{once:true});
    if(img.complete && img.naturalWidth===0) markFailed();
  }

  function decorateHandCards(){
    const host=document.getElementById('cards');
    if(!host || !state?.hand) return;

    [...host.querySelectorAll('.card')].forEach((button,index)=>{
      const card=state.hand[index];
      if(!card) return;
      const unaffordable=card.cost>state.energy;

      button.className=`card monster-card monster-${card.id}${unaffordable?' disabled':''}`;
      button.disabled=unaffordable || state.playerHp<=0 || state.bossHp<=0;
      button.dataset.monster=card.id;
      button.setAttribute('aria-label',`${card.name}, ${card.monsterTitle}. Kosten ${card.cost} Wellenkraft. Angriff ${card.atk}. Verteidigung ${card.hp}. Antippen für eine unabhängige Sprachfrage.`);
      button.innerHTML=`
        <span class="monster-cost" aria-label="${card.cost} Wellenkraft"><span aria-hidden="true">🌊</span><strong>${card.cost}</strong></span>
        <span class="monster-type">${card.cardType}</span>
        ${artMarkup(card)}
        <span class="monster-name"><strong>${card.name}</strong><small>${card.monsterTitle}</small></span>
        <span class="monster-effect"><small>${card.effectLabel}</small><span>${card.effectText}</span></span>
        <span class="monster-stats" aria-label="Kampfwerte">
          <b class="monster-attack"><span aria-hidden="true">⚔</span><strong>${card.atk}</strong><small>ANGRIFF</small></b>
          <b class="monster-defense"><span aria-hidden="true">🛡</span><strong>${card.hp}</strong><small>VERTEIDIGUNG</small></b>
        </span>
        <span class="monster-play-hint">ANTIPPEN · FRAGE LÖSEN</span>
      `;
      installImageFallback(button);
    });
  }

  function unitMarkup(card){
    const image=card.monsterImage || MONSTER_DEFS[card.id]?.image || '';
    return `<div class="unit-card-inner">${image?`<img class="unit-monster-img" src="${image}" alt="" loading="lazy">`:''}<div class="unit-card-copy"><b>${card.name}</b><small>${card.monsterTitle||''}</small><span><em>⚔ ${card.atk}</em><em>🛡 ${card.hp}</em></span></div></div>`;
  }

  function decorateBattleSlots(){
    const player=document.getElementById('playerLanes');
    if(player && state?.field){
      player.innerHTML=[0,1,2].map(i=>state.field[i]
        ? `<div class="slot unit monster-unit">${unitMarkup(state.field[i])}</div>`
        : '<div class="slot empty-slot"><span>DEIN PLATZ</span><i aria-hidden="true">⚓</i></div>').join('');
    }
    const enemy=document.getElementById('enemyLanes');
    if(enemy && state?.enemy){
      enemy.innerHTML=[0,1,2].map(i=>state.enemy[i]
        ? `<div class="slot unit enemy-unit"><div class="unit-card-copy"><b>🏴‍☠️ ${state.enemy[i].name}</b><span><em>⚔ ${state.enemy[i].atk}</em><em>🛡 ${state.enemy[i].hp}</em></span></div></div>`
        : '<div class="slot empty-slot enemy-empty"><span>FREI</span></div>').join('');
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
    if(copy) copy.textContent=`Diese Sprachfrage ist unabhängig von ${card.name}. Nur eine richtige Antwort erlaubt das Ausspielen.`;
    if(mastery) mastery.innerHTML=`<b>${card.name}</b> · 🌊 ${card.cost} · ⚔ ${card.atk} · 🛡 ${card.hp} <span class="question-risk">Falsch = Karte verloren</span>`;
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

      if(card.effectKind==='rush' && state.bossHp>0){state.bossHp-=atk;hitBoss();}
      if(card.effectKind==='burst' && state.bossHp>0){state.bossHp-=(card.effectValue||0);hitBoss();}
      if(card.effectKind==='draw') draw();

      state.bossHp=Math.max(0,state.bossHp);
      document.getElementById('learn')?.classList.remove('open');
      if(mastery) mastery.textContent='Richtig = Karte darf ins Spiel. Falsch = Karte geht für diesen Bosskampf verloren.';
      const log=document.getElementById('log');
      if(log) log.textContent=`✨ ${card.name} beschworen · ${question.de} = ${question.correct}`;
      render();
      if(state.bossHp>0&&state.playerHp>0)setTimeout(()=>setTulaPose('neutral'),700);
    },700);
  }

  decorateHandCards();
  decorateBattleSlots();
})();
