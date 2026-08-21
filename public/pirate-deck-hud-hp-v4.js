/* Pirate Deck — HUD / Character HP V4
   Moves the existing HP nodes without changing gameplay state or render IDs. */
(() => {
  const $ = id => document.getElementById(id);

  function makeMeta(className, label){
    const node = document.createElement('div');
    node.className = `hud-stat hud-boss-meta ${className}`;
    node.innerHTML = `<small>${label}</small><b></b>`;
    return node;
  }

  function syncBossMeta(nameNode, levelNode){
    const title = $('bossTitle')?.textContent?.trim() || 'PIRAT KAI';
    const progress = $('bossProgressText')?.textContent?.replace(/^☠\s*BOSS\s*/i,'').trim() || '1 / 10';
    nameNode.querySelector('b').textContent = title;
    levelNode.querySelector('b').textContent = progress;
  }

  function init(){
    const hud = document.querySelector('.battle-hud');
    const tula = document.querySelector('.tula-visual');
    const boss = document.querySelector('.boss-side-visual');
    if(!hud || !tula || !boss) return;
    if(hud.dataset.hpV4 === '1') return;

    const playerHp = $('playerHp')?.closest('.hud-health');
    const bossHp = $('bossHpText')?.closest('.hud-health');
    if(!playerHp || !bossHp) return;

    hud.dataset.hpV4 = '1';

    playerHp.classList.remove('hud-stat','hud-health');
    playerHp.classList.add('character-health','tula-character-health');
    bossHp.classList.remove('hud-stat','hud-health');
    bossHp.classList.add('character-health','boss-character-health');

    tula.append(playerHp);
    boss.append(bossHp);

    const bossName = makeMeta('hud-boss-name','BOSSFIGHT');
    const bossLevel = makeMeta('hud-boss-level','LEVEL');
    hud.append(bossName,bossLevel);

    const sync = () => syncBossMeta(bossName,bossLevel);
    sync();

    const observer = new MutationObserver(sync);
    if($('bossTitle')) observer.observe($('bossTitle'), {childList:true,subtree:true,characterData:true});
    if($('bossProgressText')) observer.observe($('bossProgressText'), {childList:true,subtree:true,characterData:true});
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
