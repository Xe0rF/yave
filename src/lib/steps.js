import { isReducedMotion } from './util.js';

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function pickActive(boxes) {
  if (boxes.length === 1) return boxes[0];
  const vh = window.innerHeight || 800;
  let best = null;
  let bestD = Infinity;
  for (const box of boxes) {
    const r = box.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh) {
      const d = Math.abs((r.top + r.bottom) / 2 - vh / 2);
      if (d < bestD) {
        bestD = d;
        best = box;
      }
    }
  }
  return best || boxes[0];
}

function captureKeys(step) {
  const map = {};
  if (!step) return map;
  step.querySelectorAll('[data-yave-key]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width || r.height) map[el.getAttribute('data-yave-key')] = r;
  });
  return map;
}

function flipKeys(step, fromMap) {
  if (!fromMap || !step || isReducedMotion()) return;
  step.querySelectorAll('[data-yave-key]').forEach(el => {
    const from = fromMap[el.getAttribute('data-yave-key')];
    if (!from) return;
    const to = el.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
    if (el.animate) {
      el.animate(
        [
          { transform: `translate(${dx}px,${dy}px)` },
          { transform: 'translate(0,0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' },
      );
    }
  });
}

export function initSteps() {
  const boxes = document.querySelectorAll('.y-steps, [data-yave-steps]');
  boxes.forEach(box => {
    if (box.__yaveReady) return;
    box.__yaveReady = true;

    const steps = Array.from(box.children).filter(
      el => el.classList && (el.classList.contains('y-step') || el.hasAttribute('data-yave-step')),
    );
    if (!steps.length) return;

    let cur = 0;
    let firstShow = true;
    steps.forEach((step, i) => {
      step.setAttribute('data-yave-no', pad2(i + 1));
      step.setAttribute('aria-hidden', 'true');
    });

    let controls = null;
    let prev = null;
    let next = null;
    let pos = null;

    function show(index) {
      const fromMap = firstShow ? null : captureKeys(steps[cur]);
      cur = Math.max(0, Math.min(steps.length - 1, index));
      steps.forEach((step, i) => {
        const on = i === cur;
        step.classList.toggle('is-active', on);
        step.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      flipKeys(steps[cur], fromMap);
      firstShow = false;
      if (pos) pos.innerHTML = `<b>${cur + 1}</b> / ${steps.length}`;
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === steps.length - 1;
      box.__yaveIndex = cur;
      steps[cur].dispatchEvent(new CustomEvent('yave:show', {
        bubbles: true,
        detail: { index: cur },
      }));
    }

    if (steps.length > 1) {
      controls = document.createElement('div');
      controls.className = 'y-controls';
      controls.setAttribute('role', 'group');
      controls.setAttribute('aria-label', '步骤控制');
      controls.innerHTML =
        '<button type="button" class="y-prev" aria-label="上一帧"><yave-icon name="chevron-left" size="16"></yave-icon></button>' +
        '<span class="y-pos" aria-live="polite"></span>' +
        '<button type="button" class="y-next" aria-label="下一帧"><yave-icon name="chevron-right" size="16"></yave-icon></button>';
      prev = controls.querySelector('.y-prev');
      next = controls.querySelector('.y-next');
      pos = controls.querySelector('.y-pos');
      prev.addEventListener('click', () => show(cur - 1));
      next.addEventListener('click', () => show(cur + 1));
      box.appendChild(controls);
      box.__yaveShow = show;
    }

    show(0);
  });

  if (!document.__yaveKeys) {
    document.__yaveKeys = true;
    document.addEventListener('keydown', e => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' ||
                t.tagName === 'SELECT' || t.isContentEditable)) return;
      const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      const list = Array.from(document.querySelectorAll('.y-steps, [data-yave-steps]'))
        .filter(b => b.__yaveShow);
      if (!list.length) return;
      const box = pickActive(list);
      if (!box) return;
      e.preventDefault();
      if (e.key === 'Home') box.__yaveShow(0);
      else if (e.key === 'End') box.__yaveShow(Number.MAX_SAFE_INTEGER);
      else box.__yaveShow(box.__yaveIndex + (e.key === 'ArrowRight' ? 1 : -1));
    });
  }
}
