/* Pirate Deck — Hand 7 V5
   Isolated hand-capacity layer. Keeps the existing battle/card engine intact. */
(() => {
  let handLimit = 7;

  const baseFresh = fresh;
  fresh = function hand7Fresh(...args){
    const next = baseFresh(...args);
    next.hand = [...CARD_POOL].slice(0, handLimit);
    next.discarded = [];
    return next;
  };

  draw = function hand7Draw(){
    if(!state || state.hand.length >= handLimit) return;
    const discarded = new Set(Array.isArray(state.discarded) ? state.discarded : []);
    const candidates = shuffle(CARD_POOL.filter(card =>
      !state.hand.some(held => held.id === card.id) && !discarded.has(card.id)
    ));
    if(candidates[0]) state.hand.push(candidates[0]);
  };

  function fillHandToLimit(){
    if(!state?.hand) return;
    let guard = CARD_POOL.length + 2;
    while(state.hand.length < handLimit && guard-- > 0){
      const before = state.hand.length;
      draw();
      if(state.hand.length === before) break;
    }
  }

  function updateHandCounter(){
    const title = document.querySelector('.hand-title');
    if(!title || !state?.hand) return;
    title.classList.add('hand-title-v5');

    let badge = document.getElementById('handCount');
    if(!badge){
      badge = document.createElement('span');
      badge.id = 'handCount';
      badge.className = 'hand-count-v5';
      const first = title.querySelector('small');
      if(first) first.insertAdjacentElement('afterend', badge);
      else title.prepend(badge);
    }
    badge.textContent = `${state.hand.length}/${handLimit}`;
    badge.setAttribute('aria-label', `${state.hand.length} von maximal ${handLimit} Karten auf der Hand`);
  }

  const previousRender = render;
  render = function hand7Render(){
    previousRender();
    updateHandCounter();
  };

  window.PirateDeckHand = {
    get limit(){ return handLimit; },
    setLimit(value){
      const parsed = Number.parseInt(value, 10);
      if(!Number.isFinite(parsed) || parsed < 1) return handLimit;
      handLimit = parsed;
      fillHandToLimit();
      render();
      return handLimit;
    }
  };

  fillHandToLimit();
  render();
})();
