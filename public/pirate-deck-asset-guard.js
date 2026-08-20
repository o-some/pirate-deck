(() => {
  const KAI_LOCAL = 'level-01-pirat-kai.webp';
  const KAI_FALLBACK = 'https://raw.githubusercontent.com/o-some/tulasisland/main/public/letter-bay/bosses/level-01-pirat-kai.webp';

  function repairKaiImage(img) {
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.src.includes(KAI_LOCAL)) return;
    if (img.dataset.kaiFallback === '1') return;
    img.dataset.kaiFallback = '1';
    img.src = KAI_FALLBACK;
  }

  document.addEventListener('error', event => {
    repairKaiImage(event.target);
  }, true);

  function scan() {
    document.querySelectorAll('img').forEach(img => {
      if (img.src.includes(KAI_LOCAL) && img.complete && img.naturalWidth === 0) {
        repairKaiImage(img);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan, { once: true });
  } else {
    scan();
  }

  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
