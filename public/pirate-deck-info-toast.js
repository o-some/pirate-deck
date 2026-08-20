(() => {
  const toast = document.getElementById('infoToast');
  const panel = document.getElementById('infoToastPanel');
  const mini = document.getElementById('infoToastMini');
  const close = document.getElementById('infoToastClose');
  const log = document.getElementById('log');
  if (!toast || !panel || !mini || !close || !log) return;

  const AUTO_HIDE_MS = 1500;
  let hideTimer = null;
  let manualOpen = false;

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function openToast({ auto = false } = {}) {
    clearHideTimer();
    manualOpen = !auto;
    toast.classList.remove('is-minimized');
    toast.classList.add('is-open', 'pulse');
    window.setTimeout(() => toast.classList.remove('pulse'), 360);

    if (auto) {
      hideTimer = window.setTimeout(() => {
        if (!manualOpen) minimizeToast();
      }, AUTO_HIDE_MS);
    }
  }

  function minimizeToast() {
    clearHideTimer();
    manualOpen = false;
    toast.classList.remove('is-open', 'pulse');
    toast.classList.add('is-minimized');
  }

  function showAutomaticUpdate() {
    if (manualOpen) return;
    openToast({ auto: true });
  }

  mini.addEventListener('click', () => openToast({ auto: false }));
  close.addEventListener('click', minimizeToast);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toast.classList.contains('is-open')) minimizeToast();
  });

  const observer = new MutationObserver(() => showAutomaticUpdate());
  observer.observe(log, { childList: true, characterData: true, subtree: true });

  // Start minimized so the intro screen is never covered.
  minimizeToast();

  // Expose a tiny bridge for future game events without coupling the core game to this UI.
  window.PirateDeckInfo = {
    show(message, { auto = true } = {}) {
      if (typeof message === 'string' && message.trim()) log.textContent = message;
      if (auto) showAutomaticUpdate();
      else openToast({ auto: false });
    },
    open() { openToast({ auto: false }); },
    minimize: minimizeToast
  };
})();
