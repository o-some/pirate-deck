/* Pirate Deck — card loss rule + intuitive card presentation */
(() => {
  const CARD_META = {
    turtle: { type: 'BEGLEITER', badge: 'CREW', effect: '+2 Angriff bei richtiger Übersetzung', accent: 'teal' },
    apple: { type: 'BEGLEITER', badge: 'HEILUNG', effect: 'Tula heilt sich bei richtiger Übersetzung', accent: 'teal' },
    swim: { type: 'AKTION', badge: 'SOFORT', effect: 'Sofortangriff bei richtiger Übersetzung', accent: 'blue' },
    friend: { type: 'BEGLEITER', badge: 'SCHUTZ', effect: '+2 Leben bei richtiger Übersetzung', accent: 'teal' },
    sunny: { type: 'ZAUBER', badge: 'BONUS', effect: '+1 Muschel bei richtiger Übersetzung', accent: 'violet' },
    book: { type: 'RELIKT', badge: 'WORTKRAFT', effect: 'Aktiviert Wortkraft bei richtiger Übersetzung', accent: 'gold' },
    run: { type: 'AKTION', badge: 'ANGRIFF', effect: '+2 Schaden bei richtiger Übersetzung', accent: 'blue' },
    island: { type: 'ORT', badge: 'SCHILD', effect: 'Schutzschild bei richtiger Übersetzung', accent: 'green' }
  };

  const RULE_TEXT = 'Richtig = Karte wird gespielt. Falsch = Karte geht für diesen Bosskampf verloren.';
  const originalRender = render;
  const originalAsk = ask;
  const originalResolve = resolve;

  function metaFor(card) {
    return CARD_META[card.id] || { type: 'KARTE', badge: 'WORTKRAFT', effect: card.text || '', accent: 'teal' };
  }

  function enhanceCards() {
    const host = document.getElementById('cards');
    if (!host || !state?.hand) return;

    [...host.querySelectorAll('.card')].forEach((button, index) => {
      const card = state.hand[index];
      if (!card) return;
      const meta = metaFor(card);

      button.dataset.cardId = card.id;
      button.dataset.cardType = meta.type;
      button.classList.add(`card-accent-${meta.accent}`);
      button.setAttribute('aria-label', `${card.name}. ${meta.type}. Kosten ${card.cost}. Angriff ${card.atk}. Leben ${card.hp}. Antippen und übersetzen.`);

      button.innerHTML = `
        <span class="card-frame-glow" aria-hidden="true"></span>
        <span class="cost" aria-label="Kosten ${card.cost}">${card.cost}</span>
        <span class="card-type">${meta.type}</span>
        <span class="card-art-shell"><span class="art" aria-hidden="true">${card.emoji}</span></span>
        <strong>${card.name}</strong>
        <span class="card-effect"><small>${meta.badge}</small><span>${meta.effect}</span></span>
        <span class="stats">
          <b class="stat-attack"><span aria-hidden="true">⚔</span><strong>${card.atk}</strong><small>ANGRIFF</small></b>
          <b class="stat-health"><span aria-hidden="true">♥</span><strong>${card.hp}</strong><small>LEBEN</small></b>
        </span>
        <span class="card-play-hint">ANTIPPEN · ÜBERSETZEN</span>
      `;
    });

    const handTitle = document.querySelector('.hand-title small:last-child');
    if (handTitle) handTitle.textContent = 'ANTIPPEN → ÜBERSETZEN';
  }

  render = function patchedRender() {
    originalRender();
    enhanceCards();
  };

  ask = function patchedAsk(card) {
    originalAsk(card);
    const copy = document.getElementById('questionCopy');
    const mastery = document.getElementById('mastery');
    if (copy) copy.textContent = 'Richtig: Karte wird gespielt und erhält ihren Bonus. Falsch: Karte und eingesetzte Wellenkraft sind verloren.';
    if (mastery) mastery.textContent = `⚠ Falsch = ${card.name} geht für diesen Bosskampf verloren.`;
  };

  resolve = function patchedResolve(card, correct, button) {
    if (correct) {
      originalResolve(card, true, button);
      setTimeout(() => {
        const mastery = document.getElementById('mastery');
        if (mastery) mastery.textContent = RULE_TEXT;
      }, 720);
      return;
    }

    document.querySelectorAll('.answer').forEach(answer => { answer.disabled = true; });
    button.classList.add('bad');

    const mastery = document.getElementById('mastery');
    if (mastery) mastery.innerHTML = `💥 <b>Karte verloren!</b> ${card.name} = ${card.en}. Die Karte wird nicht ausgespielt und ${card.cost} Wellenkraft ${card.cost === 1 ? 'ist' : 'sind'} verbraucht.`;

    setTulaPose('surprised', 'react-bad');

    setTimeout(() => {
      state.energy = Math.max(0, state.energy - card.cost);
      state.hand = state.hand.filter(item => item.id !== card.id);
      state.discarded = Array.isArray(state.discarded) ? state.discarded : [];
      if (!state.discarded.includes(card.id)) state.discarded.push(card.id);

      document.getElementById('learn')?.classList.remove('open');
      if (mastery) mastery.textContent = RULE_TEXT;

      const log = document.getElementById('log');
      if (log) log.textContent = `💥 ${card.name} verloren. Merke dir: ${card.name} = ${card.en}.`;

      render();
      if (state.bossHp > 0 && state.playerHp > 0) setTimeout(() => setTulaPose('neutral'), 700);
    }, 850);
  };

  /* Wrong answers discard a card for the whole boss fight. */
  draw = function patchedDraw() {
    const discarded = Array.isArray(state?.discarded) ? state.discarded : [];
    const fieldIds = Array.isArray(state?.field) ? state.field.map(card => card.id) : [];
    const pool = shuffle(CARD_POOL.filter(card =>
      !state.hand.some(handCard => handCard.id === card.id) &&
      !discarded.includes(card.id) &&
      !fieldIds.includes(card.id)
    ));
    if (pool[0] && state.hand.length < 4) state.hand.push(pool[0]);
  };

  if (state && !Array.isArray(state.discarded)) state.discarded = [];
  const initialMastery = document.getElementById('mastery');
  if (initialMastery) initialMastery.textContent = RULE_TEXT;
  enhanceCards();
})();
