/* Pirate Deck — first-run tutorial flow */
(() => {
  const intro = document.getElementById('intro');
  const startButton = document.getElementById('start');
  const guide = document.getElementById('gameGuide');
  const guideStart = document.getElementById('guideStart');
  const guideSkip = document.getElementById('guideSkip');

  if (!intro || !startButton || !guide || !guideStart) return;

  const startBattle = () => {
    guide.classList.remove('open');
    guide.setAttribute('aria-hidden', 'true');
    intro.classList.add('hidden');
    if (typeof restart === 'function') restart();
  };

  const openGuide = () => {
    intro.classList.add('hidden');
    guide.classList.add('open');
    guide.setAttribute('aria-hidden', 'false');
    guideStart.focus({ preventScroll: true });
  };

  startButton.onclick = () => {
    try {
      if (localStorage.getItem('pirateDeckGuideSeen') === '1') {
        startBattle();
        return;
      }
    } catch (_) {}
    openGuide();
  };

  guideStart.addEventListener('click', () => {
    try {
      if (guideSkip?.checked) localStorage.setItem('pirateDeckGuideSeen', '1');
      else localStorage.removeItem('pirateDeckGuideSeen');
    } catch (_) {}
    startBattle();
  });

  guide.addEventListener('keydown', event => {
    if (event.key === 'Escape') startBattle();
  });
})();

/* Pirate Deck V4 — configurable hand architecture.
   Default is four cards. The UI can later expand without rewriting the game core. */
(() => {
  const DEFAULT_HAND_LIMIT = 4;
  const MAX_SUPPORTED_HAND_LIMIT = 8;

  const normalizeLimit = value => {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return DEFAULT_HAND_LIMIT;
    return Math.max(1, Math.min(MAX_SUPPORTED_HAND_LIMIT, parsed));
  };

  if (!window.PIRATE_DECK_HAND_LIMIT) window.PIRATE_DECK_HAND_LIMIT = DEFAULT_HAND_LIMIT;

  const originalFresh = fresh;
  fresh = function premiumFresh(...args) {
    const next = originalFresh(...args);
    next.handLimit = normalizeLimit(window.PIRATE_DECK_HAND_LIMIT);
    next.hand = [...CARD_POOL].slice(0, next.handLimit);
    return next;
  };

  if (state && !state.handLimit) state.handLimit = normalizeLimit(window.PIRATE_DECK_HAND_LIMIT);

  draw = function premiumDraw() {
    const limit = normalizeLimit(state?.handLimit ?? window.PIRATE_DECK_HAND_LIMIT);
    const discarded = Array.isArray(state?.discarded) ? state.discarded : [];
    const fieldIds = Array.isArray(state?.field) ? state.field.map(card => card.id) : [];
    const pool = shuffle(CARD_POOL.filter(card =>
      !state.hand.some(handCard => handCard.id === card.id) &&
      !discarded.includes(card.id) &&
      !fieldIds.includes(card.id)
    ));
    if (pool[0] && state.hand.length < limit) state.hand.push(pool[0]);
  };

  const previousRender = render;
  render = function premiumRender() {
    previousRender();
    syncHandUi();
  };

  function syncHandUi() {
    if (!state) return;
    const limit = normalizeLimit(state.handLimit ?? window.PIRATE_DECK_HAND_LIMIT);
    state.handLimit = limit;

    const title = document.querySelector('.hand-title small:first-child');
    if (title) title.innerHTML = `DEINE HAND <span class="hand-count">${state.hand.length}/${limit}</span>`;

    const cards = document.getElementById('cards');
    if (cards) {
      cards.style.setProperty('--hand-limit', String(limit));
      cards.dataset.handLimit = String(limit);
      cards.classList.toggle('is-expandable', limit > DEFAULT_HAND_LIMIT || state.hand.length > DEFAULT_HAND_LIMIT);
    }
  }

  window.PirateDeckHand = {
    get limit() {
      return normalizeLimit(state?.handLimit ?? window.PIRATE_DECK_HAND_LIMIT);
    },
    setLimit(value) {
      const limit = normalizeLimit(value);
      window.PIRATE_DECK_HAND_LIMIT = limit;
      if (state) {
        state.handLimit = limit;
        if (state.hand.length > limit) state.hand = state.hand.slice(0, limit);
        while (state.hand.length < limit) {
          const before = state.hand.length;
          draw();
          if (state.hand.length === before) break;
        }
        render();
      }
      return limit;
    }
  };

  const warning = document.querySelector('.guide-warning');
  if (warning && !warning.dataset.handLimitAdded) {
    warning.dataset.handLimitAdded = '1';
    warning.insertAdjacentHTML('beforeend', '<br><span>🃏 Deine Hand fasst aktuell bis zu <b>4 Karten</b>. Das Limit ist technisch bereits für spätere Erweiterungen vorbereitet.</span>');
  }

  syncHandUi();
})();
