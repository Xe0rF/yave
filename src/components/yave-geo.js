import { LitElement, html } from 'lit';
import { ref } from 'lit/directives/ref.js';
import { createGeoRenderer, specsFromHost } from '../lib/geo-render.js';
import { fmt, isReducedMotion, num } from '../lib/util.js';

const PARAM_NAMES = ['a', 'b', 'h', 'k', 's', 'theta', 'tx', 'ty'];
const PARAM_DEFAULTS = { a: 1, b: 1, h: 0, k: 0, s: 1, theta: 0, tx: 0, ty: 0 };

function parseParams(host) {
  const defs = {};
  for (const name of PARAM_NAMES) {
    const raw = host.getAttribute(name);
    if (raw == null) {
      defs[name] = { value: PARAM_DEFAULTS[name], slider: false };
      continue;
    }
    const m = /^\s*(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)\s*$/.exec(raw);
    if (m) {
      const lo = Math.min(parseFloat(m[1]), parseFloat(m[2]));
      const hi = Math.max(parseFloat(m[1]), parseFloat(m[2]));
      const initialRaw = host.getAttribute(`${name}-value`);
      let value = initialRaw != null ? parseFloat(initialRaw) : (lo + hi) / 2;
      if (!Number.isFinite(value)) value = (lo + hi) / 2;
      value = Math.max(lo, Math.min(hi, value));
      defs[name] = {
        value,
        min: lo,
        max: hi,
        step: (hi - lo) / 100 || 0.01,
        slider: true,
      };
    } else {
      const value = parseFloat(raw);
      defs[name] = {
        value: Number.isFinite(value) ? value : PARAM_DEFAULTS[name],
        slider: false,
      };
    }
  }
  return defs;
}

function parseAnimate(host) {
  const raw = host.getAttribute('animate');
  if (!raw) return null;
  const parts = raw.split(/[;,]/).map(s => s.trim()).filter(Boolean);
  const items = [];
  for (const part of parts) {
    let name = 't';
    let from;
    let to;
    const named = /^([a-zA-Z]+)\s*:\s*(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)$/.exec(part);
    if (named) {
      name = named[1];
      from = parseFloat(named[2]);
      to = parseFloat(named[3]);
    } else {
      const bare = /^(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)$/.exec(part);
      if (!bare) continue;
      from = parseFloat(bare[1]);
      to = parseFloat(bare[2]);
    }
    if (Number.isFinite(from) && Number.isFinite(to)) items.push({ name, from, to });
  }
  return items.length ? items : null;
}

export class YaveGeo extends LitElement {
  constructor() {
    super();
    this._specs = [];
    this._paramDefs = {};
    this._values = {};
    this._ctx = {};
    this._animated = null;
    this._renderer = null;
    this._inputs = {};
    this._playing = false;
    this._userPaused = false;
    this._autoplay = false;
    this._reduced = false;
    this._duration = 6000;
    this._loop = true;
    this._progress = 0;
    this._raf = 0;
    this._last = 0;
    this._lastRender = 0;
    this._ro = null;
    this._io = null;
    this._svg = null;
    this._svgRef = ref(el => { this._svg = el; });
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    this._specs = specsFromHost(this);
    this.textContent = '';
    this._paramDefs = parseParams(this);
    this._animated = parseAnimate(this);
    this._values = {};
    for (const name of PARAM_NAMES) {
      this._values[name] = this._paramDefs[name] ? this._paramDefs[name].value : PARAM_DEFAULTS[name];
    }
    this._ctx = { x: 0, t: 0, ...this._values };
    super.connectedCallback();
  }

  firstUpdated() {
    this._renderer = createGeoRenderer(this._svg, this, {
      specs: this._specs,
      ctx: this._ctx,
    });
    this._renderer.layout(this.clientWidth || 420, num(this.getAttribute('height'), 240));
    this._duration = Math.max(0.2, num(this.getAttribute('duration'), 6)) * 1000;
    this._loop = !this.hasAttribute('once');
    this._reduced = isReducedMotion();
    this._autoplay = !!this._animated && !this.hasAttribute('paused') && !this._reduced;
    this._inputs = {};
    this.querySelectorAll('.yave-geo-param input').forEach(input => {
      this._inputs[input.getAttribute('aria-label')] = input;
    });
    this._syncPlayButton();
    this._observe();
    if (this._autoplay) this._play();
  }

  disconnectedCallback() {
    this._pause();
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
    if (this._renderer) this._renderer.destroy();
    super.disconnectedCallback();
  }

  _observe() {
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => {
        if (!this._renderer) return;
        const w = this.clientWidth;
        if (w > 40) this._renderer.layout(w, num(this.getAttribute('height'), 240));
      });
      this._ro.observe(this);
    }
    if (typeof IntersectionObserver !== 'undefined') {
      this._io = new IntersectionObserver(entries => {
        const visible = entries.some(e => e.isIntersecting);
        if (!visible) {
          this._pause();
        } else if (this._autoplay && !this._userPaused && !this._playing &&
                   (this._loop || this._progress < 1)) {
          this._play();
        }
      }, { threshold: 0.05 });
      this._io.observe(this);
    }
  }

  _play() {
    if (!this._animated || this._playing) return;
    if (!this._loop && this._progress >= 1) this._progress = 0;
    this._playing = true;
    this._last = performance.now();
    this._lastRender = 0;
    this._syncPlayButton();
    const tick = now => {
      if (!this._playing) return;
      const dt = Math.min(120, now - this._last);
      this._last = now;
      this._progress += dt / this._duration;
      if (this._progress >= 1) {
        if (this._loop) {
          this._progress %= 1;
        } else {
          this._progress = 1;
          this._playing = false;
          this._syncPlayButton();
        }
      }
      if (now - this._lastRender >= 32 || !this._playing) {
        this._lastRender = now;
        this._applyProgress(this._progress);
      }
      if (this._playing) this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  _pause() {
    this._playing = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
    this._syncPlayButton();
  }

  _togglePlay() {
    if (!this._animated) return;
    if (this._playing) {
      this._userPaused = true;
      this._pause();
    } else {
      this._userPaused = false;
      this._play();
    }
  }

  _syncPlayButton() {
    const btn = this.querySelector('[data-act="play"]');
    if (!btn) return;
    const icon = btn.querySelector('yave-icon');
    if (icon) icon.setAttribute('name', this._playing ? 'pause' : 'play');
    btn.setAttribute('aria-label', this._playing ? '暂停' : '播放');
  }

  _applyProgress(progress) {
    let changed = false;
    for (const item of this._animated) {
      const v = item.from + (item.to - item.from) * progress;
      if (item.name === 't') {
        this._ctx.t = v;
        changed = true;
        continue;
      }
      this._values[item.name] = v;
      this._ctx[item.name] = v;
      const def = this._paramDefs[item.name];
      if (def) def.value = v;
      const input = this._inputs[item.name];
      if (input) {
        input.value = String(v);
        const out = input.parentElement.querySelector('output');
        if (out) out.textContent = fmt(v);
      }
      changed = true;
    }
    if (changed && this._renderer) {
      this._renderer.setContext(this._ctx);
      this._renderer.rebuildContent();
    }
  }

  _onParam(name, event) {
    const v = parseFloat(event.target.value);
    if (!Number.isFinite(v)) return;
    this._userPaused = true;
    this._pause();
    const def = this._paramDefs[name];
    if (def) def.value = v;
    this._values[name] = v;
    this._ctx[name] = v;
    const out = event.target.parentElement.querySelector('output');
    if (out) out.textContent = fmt(v);
    if (this._renderer) {
      this._renderer.setContext(this._ctx);
      this._renderer.rebuildContent();
    }
  }

  render() {
    const canPlay = !!this._animated;
    const canZoom = !this.hasAttribute('nozoom');
    const params = Object.entries(this._paramDefs).filter(([, p]) => p.slider);
    return html`
      <div class="yave-geo-frame">
        <svg
          ${this._svgRef}
          class="yave-geo-svg"
          role="img"
          aria-label=${this.getAttribute('label') || '坐标图'}
        ></svg>
        <div class="yave-geo-tools">
          ${canPlay ? html`
            <button type="button" class="yave-geo-btn" data-act="play" aria-label="播放" @click=${this._togglePlay}>
              <yave-icon name="play" size="16"></yave-icon>
            </button>
          ` : null}
          ${canZoom ? html`
            <button type="button" class="yave-geo-btn" data-act="zoom-in" aria-label="放大" @click=${() => this._renderer && this._renderer.zoomBy(1.25)}>
              <yave-icon name="zoom-in" size="16"></yave-icon>
            </button>
            <button type="button" class="yave-geo-btn" data-act="zoom-out" aria-label="缩小" @click=${() => this._renderer && this._renderer.zoomBy(1 / 1.25)}>
              <yave-icon name="zoom-out" size="16"></yave-icon>
            </button>
            <button type="button" class="yave-geo-btn" data-act="reset" aria-label="重置视图" @click=${() => this._renderer && this._renderer.resetView()}>
              <yave-icon name="rotate-ccw" size="16"></yave-icon>
            </button>
          ` : null}
        </div>
      </div>
      ${params.length ? html`
        <div class="yave-geo-params">
          ${params.map(([name, p]) => html`
            <label class="yave-geo-param">
              <span>${name}</span>
              <input
                type="range"
                min=${p.min}
                max=${p.max}
                step=${p.step}
                .value=${String(p.value)}
                aria-label=${name}
                @input=${event => this._onParam(name, event)}
              >
              <output>${fmt(p.value)}</output>
            </label>
          `)}
        </div>
      ` : null}
    `;
  }
}

if (!customElements.get('yave-geo')) customElements.define('yave-geo', YaveGeo);
