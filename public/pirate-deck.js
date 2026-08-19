const TULA_ASSETS={
  neutral:'https://raw.githubusercontent.com/o-some/tulasisland/main/assets/creative/tula_neutral_front.webp',
  happy:'https://raw.githubusercontent.com/o-some/tulasisland/main/assets/creative/tula_happy.webp',
  surprised:'https://raw.githubusercontent.com/o-some/tulasisland/main/assets/creative/tula_surprised.webp',
  celebrating:'https://raw.githubusercontent.com/o-some/tulasisland/main/assets/creative/tula_celebrating.webp'
};

const BOSS_ROSTER=[
  {
    id:'pirat-kai',
    name:'Pirat Kai',
    level:1,
    hp:24,
    accent:'#ffd06e',
    taunt:'Na los, Inselkröte! Zeig mir deine Wortkraft.',
    sprite:'https://raw.githubusercontent.com/o-some/tulasisland/main/public/letter-bay/bosses/level-01-pirat-kai.webp'
  },
  {
    id:'kapitaen-brax',
    name:'Kapitän Brax',
    level:2,
    hp:27,
    accent:'#e9b858',
    taunt:'Meine Crew hat schon bessere Wortakrobaten über Bord gehen sehen!',
    sprite:'https://uc21f703ab39bc01e316e6b37a21.previews.dropboxusercontent.com/p/thumb/ADHISArofPJynnKIJZN7d1_0_q8K_atGDmrgVaQUgEfqtIv8QL8XAyNqamoPVsFNRErJ9TeYf4EBhsVS4x0Qoq3LFdqNmKtqTEK68hCskpniPsZQI31ea9MQlykOI5pF7GFaQjSU4wBYTG5k9STnn60BuMvV6xCQzTni60rImGkeSBEHRrV93JYXlHQ0e0IYOZk9rR5dK8a5e7pV7_ktwpN0v6baxP74yj6kcfQD-SURALB5q2UdzrPnO7jA5ejOphzd1XQ5Blrq05T-lADLSuAfSdTnpX-jv10RbWt43yqdY_I2jBxqsXTESnIpiDZWfjjFMNoNc3_ZJfOixkoHjiZI/p.png'
  },
  {
    id:'blackfinn',
    name:'Blackfinn',
    level:3,
    hp:30,
    accent:'#ff8e58',
    taunt:'Ein falsches Wort und ich schnappe mir deine Muscheln!',
    sprite:'https://ucc1bc3c9a90ef6e2ec91558c652.previews.dropboxusercontent.com/p/thumb/ADHXNNNAqfzZ_edxUeV3Bjact23MrNqtUQtzruwTPVDgy9t-cIeya6ozKTRGqYXeqzty7oNg99yvv9svNfKX6MctXzV-tfsvUZu7N2YB0hJ2hXpq-4fa9IHMa0xV7XefkOfkElhl2XnWc1Atbim4_41Au1iHY15_il9yjcl0R6MCCgETRV_yPUYPg9Du1etO3H621Miyl63QHnMyZ126c7hbBOfrPqcoZ44IOqDRt5CYG5R2IFjHaMMtLgJ690Y41hcHgs2b5mMoeUc3qJdoKXZmJj9kmuF0xtYJwx9yEw58_7-kDFnPMMpGmLxPW9ES5BHRRO865pKvzC_Sufgn99Yl/p.png'
  },
  {
    id:'alt-kapitaen-roderick',
    name:'Alt-Kapitän Roderick',
    level:4,
    hp:33,
    accent:'#8fc9ff',
    taunt:'Ich kenne jede Strömung dieser Insel – aber kennst du jedes Wort?',
    sprite:'https://uc15a90db7c75204724aa6c5359d.previews.dropboxusercontent.com/p/thumb/ADFn9u_8tSAXGcsmNaA5chb-cThIirDzo7N5EPk6MBqIiXwgE5ifNivPMupRZ2N-2khK2zrycyDR7JbiyOFyUG6zTOXT6_fbWk681AJxjYYJLQqUr5ipwx2XCLt053Wt6_oD0WkITNZo0QNEP03sT2pkygUdcEw669lV2vuRBiu-zPAj5F1ojkYvE162ebIplJLUD2skRUbBxxFC6vr9xUT7Ln-XMHrEH8VYiAnrgpAXPO9HRlIVKt52KRqLeji0LPrv4rD-q2YTyB9YuB3pUCbQfoefA6xqSfLfPQdmFoDXoLVjY6zdqjaWXYbGQ3gYRfjR0cwPj4yG9GVRSzZhyC2N/p.png'
  },
  {
    id:'piratenbaron-vargas',
    name:'Piratenbaron Vargas',
    level:5,
    hp:36,
    accent:'#d6995e',
    taunt:'Ich sammle Gold, Siege und die Fehler meiner Gegner.',
    sprite:'https://ucc20bf702487d33b775a5354a78.previews.dropboxusercontent.com/p/thumb/ADG3lEjrOov_1RaQVlk9TAUziC7NRPyjoDXSSArAlW_d3obBoqJ3MhZdGyIMvfe0iu13TJr2sucjvm1nseQFeIN7_EUXgPmv07cQjT9jlnv4934gDeL7_ZPyCkDKrgxma_0ZYYjtkuKTwnpSKChD_urHsOkcXyyVw33hWZ458XPeDTlEy4IAhjQ52voHZYwAvOMRl-fuUiZylpThYFZN8EFisZHUJDJSnJuTMDnjccY3kKIXGGwz49oOaZtmex2ohkRyXSYIkOBtZm8KG8lMuZtEkkFrzvQt1tMg8hxsXN2JliGIGqIz3B6_TxNwYmofit3QIXyhd8v-QMbX6kaEj94G/p.png'
  },
  {
    id:'kapitaen-ironhook',
    name:'Kapitän Ironhook',
    level:6,
    hp:39,
    accent:'#dca65f',
    taunt:'Mein Haken ist alt. Meine Geduld ist älter. Dein Wortschatz besser auch.',
    sprite:'https://uc2eff97e6e70686051c35bbf43f.previews.dropboxusercontent.com/p/thumb/ADHjT4LbcNDEj5N_Glqetvb16asH1K6XZQe_aMu3RlIoiovXnNv_0rmaEO2oab_Uw-AFKax0CquXYLyLklcJ2qiK7oG7EgQCUnBL3vj2YYk7smt2bQg5CwXUXbpUcFgLQ58RuVNv9KAj_v5kmabb4LK4MPa-jCXxcNO6fWIv4PS4cc2HnpY5WGKCqGj-lojgcWg0JMroTtR9sEFti5lkCRqxNo59Winq79tif1Zyuua1PwJbJnMksoCk_4LYBtrPeexT_zGG44szfxfKk2fmkJZp3rAwsKmyD_pIoOMVEobS4YDI4HrME0VO5h6GOKftG6EuC-w0uDAXvjEYR_bi5r8F/p.png'
  },
  {
    id:'admiral-thorne',
    name:'Admiral Thorne',
    level:7,
    hp:42,
    accent:'#9d8cff',
    taunt:'Ab hier reicht Glück nicht mehr. Zeig mir, was du gelernt hast.',
    sprite:'https://uc6aab47346799b1fa775586d672.previews.dropboxusercontent.com/p/thumb/ADF4_3omjKW1KQP90J9VZTW9NXYxFrzoV74E8OycdEZa8_kC3xk-ZDOXgH4ZgyTL2jrMmKUq4ZQ7btLtZNCZAxgXLlTP_h4nSInLF8408RBM4PC53BhMzsiNkGaN0mhjsHONbPhAfqKnLZR8RLkMjTR87hKQHY5TYyCpcGthiabQWUYzxdBtigX_uHCCb68AajW3ljcQZcu3yKDtjI3TCRrRahTxSs8l24vSDSTa6J6GygTXWVgQA0tJbu30-LTDsZdQHiiUySqPCBH31_sZfHjMp8QoQCk-kD9wmIm8lh_fgr-0eV81GMbJopRfE3ZwUE6-DSnXff7RU5xMIhDzmWX6/p.png'
  },
  {
    id:'kartenmeister-corvin',
    name:'Kartenmeister Corvin',
    level:8,
    hp:45,
    accent:'#69cbd1',
    taunt:'Jede Karte zeigt einen Weg. Mal sehen, ob du den richtigen findest.',
    sprite:'https://uc180ab07e1240065d7563ddbb95.previews.dropboxusercontent.com/p/thumb/ADFJ1GQSaGVp622fTaviDKeW_HX5HcEFUKRSTNOQTMXBeddD9C0iohhH1VCSSzBN2KgqcEktgqrXZON_bdOQaMCGEvz0k0mwdPjZUOx0syiH49qqf-KaWsp69PM4lV_HteLN_sDNrlEvIeREc3Hit6XwyvsaEp8M3RY5aPEo5ZazBvaliZUfGZ6iWzuF2jjwxprwNIamrsShKQ0aslbO2aAo72sWc2YCaOQnUvoe8hVo6vKA-H5Bn-BOGS9dMQ9r_5522D4Y5pTVlR6X2hpbkrOqlEzhkLcAVeQCCYOiLiafEAM2vZ0e1KQyta6qgb2vbWFFBWCNbg-hJElqWOAwBNWH/p.png'
  },
  {
    id:'schattenfuerst-azrak',
    name:'Schattenfürst Azrak',
    level:9,
    hp:48,
    accent:'#b66dff',
    taunt:'Deine Problemwörter kehren im Schatten zurück.',
    sprite:'https://uced72d90bf1317bc73f883bc77e.previews.dropboxusercontent.com/p/thumb/ADHoIzPDg5psw-CmSdm3zcIQqtRX5_d-qH2EakPtiGFHAbPJa8-Q6PNWqIgBRodfvCCi2Wi4DxFh44QN0XTxFDHgXTJNGSbSY2nEhz-ViWDQgnjUQHtgT0tN6bPs_KGYT-p_RLTI4b_GkJmVzeWcCyHDYooKvVeg3RASgkjriIfp7JGIZi-BOjSBjoIe4jGZrhARjpfjrFB17XoSvPo_bfFSnTAGIak6uwiEbIcM45af-RmakyZXEx0mONgz5TqYJeAxz8QUrwI4r8tdxGPEcH0R5DNpfXqDSYEF6hoXA2WBKiHW_Pt1BaFXx6NcdDJcMtc_iGzw2RnNR3X9MIzHiYoM/p.png'
  },
  {
    id:'piratenkoenig-varkos',
    name:'Piratenkönig Varkos',
    level:10,
    hp:52,
    accent:'#ff6860',
    taunt:'Wer mich besiegt, beherrscht die Wortmeere von Tula’s Island.',
    sprite:'https://uc6d4dff5fae6b49263dfc3b7d31.previews.dropboxusercontent.com/p/thumb/ADGeqFcpi4_5hDMr6jTSayFMGEviufkqK2mLES14UoD-69io4Q19WzfPU23fOYoSAfqlTAj9yOT0jNZ9Y9oIXxNl71VnzJGa0P7KP9kHNkchLRhUOF5r9eiFrvtbKsC7MGdn8ehUJaOhQxYayLByS6YHI_mJGMN-VXoGtZGwnLo409NHqgr6Y7_ViQueRWqww7IHQckv21i_BNmpmujKj_JX1H-UkVPK_uBbmDgqura_nmah5ZsT6ne4hLvXoekj8dwgx-NFVhHs55OYhnBjWRSWErbRtjOWGq3ORa21i60qN2NG5rDGCXE6EY-yK_5Mq8Ecjf8TzoDklu6RDqnsReYp/p.png'
  }
];

const CARD_POOL=[
  {id:'turtle',name:'Schildkröte',en:'turtle',wrong:['rabbit','fish'],emoji:'🐢',cost:2,atk:3,hp:3,text:'Begleiter · Richtig: +2 Angriff'},
  {id:'apple',name:'Apfel',en:'apple',wrong:['bread','water'],emoji:'🍎',cost:1,atk:1,hp:2,text:'Begleiter · Richtig: Tula heilt'},
  {id:'swim',name:'schwimmen',en:'swim',wrong:['sleep','speak'],emoji:'🌊',cost:2,atk:4,hp:1,text:'Aktion · Richtig: Sofortangriff'},
  {id:'friend',name:'Freund',en:'friend',wrong:['teacher','brother'],emoji:'🤝',cost:2,atk:2,hp:4,text:'Begleiter · Richtig: +2 Leben'},
  {id:'sunny',name:'sonnig',en:'sunny',wrong:['cloudy','angry'],emoji:'☀️',cost:1,atk:2,hp:1,text:'Zauber · Richtig: +1 Muschel'},
  {id:'book',name:'Buch',en:'book',wrong:['table','ticket'],emoji:'📘',cost:1,atk:1,hp:2,text:'Relikt · Richtig: Wortkraft'},
  {id:'run',name:'laufen',en:'run',wrong:['dance','answer'],emoji:'🏃',cost:2,atk:3,hp:2,text:'Aktion · Richtig: +2 Schaden'},
  {id:'island',name:'Insel',en:'island',wrong:['airport','forest'],emoji:'🏝️',cost:2,atk:2,hp:3,text:'Ort · Richtig: Schutzschild'}
];

let state;
const $=id=>document.getElementById(id);
const currentBoss=()=>BOSS_ROSTER[state?.bossIndex??0]||BOSS_ROSTER[0];

function fresh(bossIndex=state?.bossIndex??0,shells=state?.shells??0){
  return{
    bossIndex,
    bossHp:BOSS_ROSTER[bossIndex].hp,
    playerHp:20,
    maxEnergy:3,
    energy:3,
    shells,
    hand:[...CARD_POOL].slice(0,4),
    field:[],
    enemy:[],
    turn:1,
    bossRewarded:false
  };
}

function shuffle(a){return[...a].sort(()=>Math.random()-.5)}

function draw(){
  const p=shuffle(CARD_POOL.filter(c=>!state.hand.some(h=>h.id===c.id)));
  if(p[0]&&state.hand.length<4)state.hand.push(p[0]);
}

function setTulaPose(pose='neutral',reaction=''){
  const el=$('tulaSprite');
  if(!el)return;
  el.src=TULA_ASSETS[pose]||TULA_ASSETS.neutral;
  el.classList.remove('react-good','react-bad');
  if(reaction){void el.offsetWidth;el.classList.add(reaction)}
}

function hitBoss(){
  const el=$('bossSprite');
  if(!el)return;
  el.classList.remove('hit');
  void el.offsetWidth;
  el.classList.add('hit');
  setTimeout(()=>el.classList.remove('hit'),520);
}

function setBossCopy(boss){
  document.documentElement.style.setProperty('--boss-accent',boss.accent);
  if($('bossHudLabel'))$('bossHudLabel').textContent=`${boss.name.toUpperCase()} ❤️`;
  if($('bossTitle'))$('bossTitle').textContent=boss.name.toUpperCase();
  if($('bossProgressText'))$('bossProgressText').textContent=`☠ BOSS ${boss.level} / ${BOSS_ROSTER.length}`;
  if($('enemyCrewTitle'))$('enemyCrewTitle').textContent=`☠ ${boss.name.toUpperCase()} · CREW`;
  if($('bossSprite')){
    $('bossSprite').src=boss.sprite;
    $('bossSprite').alt=boss.name;
  }
  if($('taunt')&&!$('taunt').dataset.turnText)$('taunt').innerHTML=`„${boss.taunt}“`;
  if($('bossDots')){
    $('bossDots').innerHTML=BOSS_ROSTER.map((_,i)=>`<i class="${i===state.bossIndex?'active':''}${i<state.bossIndex?' done':''}"></i>`).join('');
  }
}

function renderBossRoster(){
  const host=$('bossRoster');
  if(!host)return;
  host.innerHTML='';
  BOSS_ROSTER.forEach((boss,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='boss-roster-card'+(index===state.bossIndex?' active':'');
    button.style.setProperty('--node-accent',boss.accent);
    button.setAttribute('aria-label',`Level ${boss.level}: ${boss.name}`);
    button.innerHTML=`<span class="boss-roster-level">LV ${boss.level}</span><span class="boss-roster-art"><img src="${boss.sprite}" alt="" loading="${Math.abs(index-state.bossIndex)>2?'lazy':'eager'}"></span><strong>${boss.name}</strong>`;
    button.onclick=()=>selectBoss(index);
    host.append(button);
  });
  requestAnimationFrame(()=>{
    host.querySelector('.boss-roster-card.active')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  });
}

function render(){
  const boss=currentBoss();
  setBossCopy(boss);
  const safeBossHp=Math.max(0,state.bossHp);
  $('bossHpText').textContent=`${safeBossHp} / ${boss.hp}`;
  $('bossHp').style.width=`${safeBossHp/boss.hp*100}%`;
  $('playerHp').textContent=Math.max(0,state.playerHp);
  $('playerHpBar').style.width=`${Math.max(0,state.playerHp)/20*100}%`;
  $('shells').textContent=state.shells;
  $('turnNo').textContent=state.turn;
  $('energyText').textContent=`${state.energy} / ${state.maxEnergy}`;

  $('energy').innerHTML='';
  for(let i=0;i<state.maxEnergy;i++){
    const o=document.createElement('i');
    o.className='orb'+(i>=state.energy?' off':'');
    $('energy').append(o);
  }

  $('cards').innerHTML='';
  state.hand.forEach(c=>{
    const b=document.createElement('button');
    b.className='card card-'+c.id+(c.cost>state.energy?' disabled':'');
    b.disabled=c.cost>state.energy||state.playerHp<=0||state.bossHp<=0;
    b.setAttribute('aria-label',`${c.name}, Kosten ${c.cost}`);
    b.innerHTML=`<span class="cost">${c.cost}</span><span class="art">${c.emoji}</span><strong>${c.name}</strong><p>${c.text}</p><span class="stats"><b>⚔ ${c.atk}</b><b>♥ ${c.hp}</b></span>`;
    b.onclick=()=>ask(c);
    $('cards').append(b);
  });

  $('playerLanes').innerHTML=[0,1,2].map(i=>state.field[i]
    ?`<div class="slot unit"><div><b>${state.field[i].emoji} ${state.field[i].name}</b><span>⚔ ${state.field[i].atk} · ♥ ${state.field[i].hp}</span></div></div>`
    :`<div class="slot">DEIN PLATZ</div>`).join('');

  $('enemyLanes').innerHTML=[0,1,2].map(i=>state.enemy[i]
    ?`<div class="slot unit"><div><b>🏴‍☠️ ${state.enemy[i].name}</b><span>⚔ ${state.enemy[i].atk} · ♥ ${state.enemy[i].hp}</span></div></div>`
    :`<div class="slot">FREI</div>`).join('');

  renderBossRoster();

  if(state.bossHp<=0){
    if(!state.bossRewarded){
      state.shells+=10+boss.level;
      state.bossRewarded=true;
      $('shells').textContent=state.shells;
    }
    $('log').textContent=`🏆 ${boss.name} besiegt! +${10+boss.level} Muscheln · ${boss.level<BOSS_ROSTER.length?'Der nächste Boss wartet.':'Die Piratenflotte ist geschlagen!'}`;
    $('endTurn').textContent=boss.level<BOSS_ROSTER.length?'☠ NÄCHSTER BOSS':'🏆 FLOTTE BESIEGT';
    $('endTurn').classList.add('next-boss');
    setTulaPose('celebrating','react-good');
  }else{
    $('endTurn').textContent='⚔ ZUG BEENDEN';
    $('endTurn').classList.remove('next-boss');
  }

  if(state.playerHp<=0){
    $('log').textContent=`💀 Tula wurde von ${boss.name} besiegt. Starte das Duell neu.`;
    setTulaPose('surprised','react-bad');
  }
}

function ask(card){
  const boss=currentBoss();
  $('questionTitle').textContent=`Was bedeutet „${card.name}“ auf Englisch?`;
  $('questionCopy').textContent=`Wähle die richtige Übersetzung. Eine richtige Antwort verstärkt deinen Angriff auf ${boss.name}.`;
  const opts=shuffle([card.en,...card.wrong]);
  $('answers').innerHTML='';
  opts.forEach(o=>{
    const b=document.createElement('button');
    b.className='answer';
    b.textContent=o;
    b.onclick=()=>resolve(card,o===card.en,b);
    $('answers').append(b);
  });
  $('learn').classList.add('open');
}

function resolve(card,correct,button){
  document.querySelectorAll('.answer').forEach(x=>x.disabled=true);
  button.classList.add(correct?'good':'bad');
  let atk=card.atk,hp=card.hp;
  if(correct){
    atk+=2;
    state.shells+=card.id==='sunny'?1:0;
    if(card.id==='apple')state.playerHp=Math.min(20,state.playerHp+2);
    $('mastery').textContent=`✅ Richtig: ${card.name} = ${card.en}. Meisterschaftseffekt aktiviert.`;
    setTulaPose('happy','react-good');
  }else{
    $('mastery').textContent=`❌ Nicht ganz. ${card.name} = ${card.en}. Die Karte wird ohne Meisterschaft gespielt.`;
    setTulaPose('surprised','react-bad');
  }

  setTimeout(()=>{
    state.energy-=card.cost;
    state.hand=state.hand.filter(x=>x.id!==card.id);
    if(state.field.length<3){
      state.field.push({...card,atk,hp});
    }else{
      state.bossHp-=Math.max(1,atk-1);
      hitBoss();
    }
    if(correct&&card.id==='swim'){state.bossHp-=atk;hitBoss()}
    if(correct&&card.id==='run'){state.bossHp-=2;hitBoss()}
    state.bossHp=Math.max(0,state.bossHp);
    $('learn').classList.remove('open');
    $('mastery').textContent='Richtig = voller Karteneffekt. Falsch = die Karte wird schwächer gespielt.';
    $('log').textContent=correct?`✨ ${card.name} gemeistert! Deine Karte ist stärker.`:`📘 Merke dir: ${card.name} = ${card.en}.`;
    render();
    if(state.bossHp>0&&state.playerHp>0)setTimeout(()=>setTulaPose('neutral'),650);
  },650);
}

function endTurn(){
  const boss=currentBoss();
  if(state.bossHp<=0){
    if(state.bossIndex<BOSS_ROSTER.length-1)nextBoss();
    return;
  }
  if(state.playerHp<=0)return;

  const damage=state.field.reduce((s,c)=>s+c.atk,0);
  state.bossHp=Math.max(0,state.bossHp-damage);
  if(damage>0)hitBoss();

  state.enemy=[];
  if(state.bossHp>0){
    const levelPressure=Math.floor(state.bossIndex/3);
    const strength=Math.min(7,1+Math.floor(state.turn/2)+levelPressure);
    state.enemy.push({
      name:['Deckmatrose','Kanonier','Wortdieb','Sturmrufer'][state.turn%4],
      atk:strength,
      hp:2+strength
    });
    state.playerHp-=Math.max(1,strength-1);
    if(strength>1)setTulaPose('surprised','react-bad');
  }

  state.turn++;
  state.maxEnergy=Math.min(6,state.maxEnergy+1);
  state.energy=state.maxEnergy;
  draw();

  $('taunt').dataset.turnText='1';
  $('taunt').innerHTML=state.turn%2
    ?`„Nicht schlecht. Aber <b>${boss.name}</b> schlägt zurück!“`
    :`„Kennst du auch die <b>nächsten Wörter</b>?“`;
  $('log').textContent=`Runde ${state.turn}: Deine Crew verursacht ${damage} Schaden.`;
  render();
  if(state.playerHp>0&&state.bossHp>0)setTimeout(()=>setTulaPose('neutral'),650);
}

function selectBoss(index){
  if(index<0||index>=BOSS_ROSTER.length)return;
  const shells=state?.shells??0;
  state=fresh(index,shells);
  delete $('taunt').dataset.turnText;
  $('taunt').innerHTML=`„${currentBoss().taunt}“`;
  $('log').textContent=`Level ${currentBoss().level}: ${currentBoss().name}. Spiele eine Karte und prüfe den Boss-Sprite direkt im Kampf.`;
  setTulaPose('neutral');
  render();
}

function nextBoss(){
  if(state.bossIndex>=BOSS_ROSTER.length-1){
    $('log').textContent='🏆 Alle 10 Bosse besiegt. Die komplette Piratenflotte ist geschlagen!';
    return;
  }
  selectBoss(state.bossIndex+1);
}

function restart(){
  const index=state?.bossIndex??0;
  const shells=state?.shells??0;
  state=fresh(index,shells);
  delete $('taunt').dataset.turnText;
  $('taunt').innerHTML=`„${currentBoss().taunt}“`;
  $('log').textContent=`Level ${currentBoss().level}: ${currentBoss().name}. Spiele eine Karte. Richtige Übersetzungen machen sie stärker.`;
  setTulaPose('neutral');
  render();
}

function initIntro(){
  if($('introBossSprite'))$('introBossSprite').src=BOSS_ROSTER[0].sprite;
  if($('introBossTitle'))$('introBossTitle').textContent=`${BOSS_ROSTER[0].name} wartet.`;
}

$('start').onclick=()=>{
  $('intro').classList.add('hidden');
  restart();
};
$('endTurn').onclick=endTurn;
$('restart').onclick=restart;

state=fresh(0,0);
initIntro();
render();
