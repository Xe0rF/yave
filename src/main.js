import './components/yave-icon.js';
import './components/yave-er.js';
import './components/yave-geo.js';
import { css } from './css.js';
import { initMath } from './lib/math.js';
import { initSteps } from './lib/steps.js';
import { bootInteractive } from './lib/interactive.js';

const commit = typeof __YAVE_COMMIT__ !== 'undefined' ? __YAVE_COMMIT__ : 'dev';

function injectStyles() {
  if (document.getElementById('yave-style')) return;
  const style = document.createElement('style');
  style.id = 'yave-style';
  style.textContent = css;
  document.head.appendChild(style);
}

function boot() {
  if (!document.body) return;
  document.body.classList.add('yave');
  initMath();
  initSteps();
  bootInteractive();
}

if (!window.__yaveLoaded) {
  window.__yaveLoaded = true;
  window.Yave = { commit, boot };
  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
