/* Pirate Deck — Accessibility / modal focus V23
   Adds focus management and ARIA state without changing gameplay rules. */
(() => {
  const learn = document.getElementById('learn');
  const cards = document.getElementById('cards');
  const endTurn = document.getElementById('endTurn');
  const questionTitle = document.getElementById('questionTitle');
  const mastery = document.getElementById('mastery');
  if (!learn || !cards || !endTurn) return;

  let originMonsterId = null;
  let wasOpen = learn.classList.contains('open');

  learn.setAttribute('aria-labelledby', 'questionTitle');
  learn.setAttribute('aria-describedby', 'questionCopy mastery');
  learn.setAttribute('aria-hidden', wasOpen ? 'false' : 'true');
  questionTitle?.setAttribute('tabindex', '-1');
  mastery?.setAttribute('aria-live', 'polite');

  function syncCardAria() {
    cards.querySelectorAll('button.monster-card').forEach(card => {
      card.setAttribute('aria-disabled', card.disabled ? 'true' : 'false');
    });
  }

  function rememberOrigin(event) {
    const card = event.target instanceof Element ? event.target.closest('button.monster-card') : null;
    if (!card || card.disabled) return;
    originMonsterId = card.dataset.monster || null;
  }

  function focusFirstAnswer() {
    const first = learn.querySelector('button.answer:not(:disabled)');
    if (first instanceof HTMLElement) {
      first.focus({ preventScroll: true });
      return;
    }
    questionTitle?.focus({ preventScroll: true });
  }

  function restoreFocus() {
    let target = null;
    if (originMonsterId) {
      target = [...cards.querySelectorAll('button.monster-card')]
        .find(card => card.dataset.monster === originMonsterId && !card.disabled) || null;
    }
    (target || endTurn).focus({ preventScroll: true });
    originMonsterId = null;
  }

  function syncDialogState() {
    const open = learn.classList.contains('open');
    learn.setAttribute('aria-hidden', open ? 'false' : 'true');

    if (open && !wasOpen) {
      requestAnimationFrame(focusFirstAnswer);
    } else if (!open && wasOpen) {
      requestAnimationFrame(restoreFocus);
    }
    wasOpen = open;
  }

  function trapDialogKeyboard(event) {
    if (!learn.classList.contains('open')) return;

    if (event.key === 'Escape') {
      // The language question is gameplay-critical and must not be bypassed.
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...learn.querySelectorAll('button.answer:not(:disabled)')];
    if (!focusable.length) {
      event.preventDefault();
      questionTitle?.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  }

  cards.addEventListener('click', rememberOrigin, true);
  learn.addEventListener('keydown', trapDialogKeyboard, true);

  const dialogObserver = new MutationObserver(syncDialogState);
  dialogObserver.observe(learn, { attributes: true, attributeFilter: ['class'] });

  const cardObserver = new MutationObserver(syncCardAria);
  cardObserver.observe(cards, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'class'] });

  syncCardAria();
  syncDialogState();
})();
