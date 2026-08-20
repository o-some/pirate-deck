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
