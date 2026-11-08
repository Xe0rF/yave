import { compile } from './expr.js';
import { renderMixedMath } from './math.js';
import { buildGroupTransform } from './transform.js';
import {
  XHTML_NS,
  clamp,
  fmt,
  niceStep,
  num,
  parsePoints,
  range,
  svgEl,
} from './util.js';

function specsNeedEqual(specs) {
  for (const spec of specs) {
    if (spec.tag === 'yave-group' || spec.tag === 'yave-circle') return true;
    if (spec.children && specsNeedEqual(spec.children)) return true;
  }
  return false;
}

function readSpecs(el) {
  return Array.from(el.children)
    .filter(child => child.tagName.toLowerCase().startsWith('yave-'))
    .map(child => {
      const attrs = {};
      for (const a of child.attributes) attrs[a.name] = a.value;
      return {
        tag: child.tagName.toLowerCase(),
        attrs,
        text: child.textContent || '',
        children: readSpecs(child),
      };
    });
}

function compileAttr(spec, key, fallback) {
  const raw = spec.attrs[key];
  if (raw == null || raw === '') return fallback;
  spec._fns = spec._fns || {};
  if (!spec._fns[key]) spec._fns[key] = compile(raw);
  return spec._fns[key];
}

function evalAttr(spec, key, ctx, fallback) {
  const fn = compileAttr(spec, key, null);
  if (!fn) return fallback;
  const v = fn(ctx);
  return Number.isFinite(v) ? v : fallback;
}

function evalPair(spec, key, ctx, fallback) {
  const raw = spec.attrs[key];
  if (!raw) return fallback;
  const parts = String(raw).split(/[,\s]+/).filter(Boolean);
  if (!parts.length) return fallback;
  const x = compile(parts[0])(ctx);
  const y = compile(parts[1] || '0')(ctx);
  return [Number.isFinite(x) ? x : fallback[0], Number.isFinite(y) ? y : fallback[1]];
}

export function createGeoRenderer(svg, host, config) {
  const state = {
    W: 420,
    H: num(host.getAttribute('height'), 240),
    xr: range(host.getAttribute('x'), -5, 5),
    yr: range(host.getAttribute('y'), -4, 4),
    grid: num(host.getAttribute('grid'), 1),
    ux: 1,
    uy: 1,
    equal: false,
    cx0: 0,
    cy0: 0,
    xMid: 0,
    yMid: 0,
    pad: 26,
    specs: config.specs,
    ctx: config.ctx || {},
    initialZoom: num(host.getAttribute('zoom'), 1),
    nozoom: host.hasAttribute('nozoom'),
    view: { k: num(host.getAttribute('zoom'), 1), tx: 0, ty: 0 },
    viewport: null,
    bg: null,
    content: null,
  };

  const sx = x => state.cx0 + (x - state.xMid) * state.ux;
  const sy = y => state.cy0 - (y - state.yMid) * state.uy;

  function addError(parent, message) {
    parent.appendChild(svgEl('text', { x: 8, y: 16, class: 'yave-err' }, '⚠ ' + message));
  }

  function addLabel(parent, x, y, text, opts = {}) {
    if (text == null || text === '') return;
    const anchor = opts.anchor || 'start';
    const dx = opts.dx != null ? opts.dx : anchor === 'middle' ? 0 : anchor === 'end' ? -6 : 7;
    const dy = opts.dy != null ? opts.dy : -7;
    const px = x + dx;
    const py = y + dy;
    if (/\$[^$]+\$/.test(text)) {
      const fo = svgEl('foreignObject', {
        x: px,
        y: py - 14,
        width: 340,
        height: 52,
        class: 'yave-label-fo',
        overflow: 'visible',
      });
      fo.setAttribute('pointer-events', 'none');
      const div = document.createElementNS(XHTML_NS, 'div');
      div.className = 'yave-label-html';
      div.style.whiteSpace = 'nowrap';
      div.style.font = '12px/1.25 var(--y-sans)';
      div.style.color = opts.muted ? 'var(--y-ink-3)' : 'var(--y-ink)';
      if (anchor === 'middle') div.style.transform = 'translateX(-50%)';
      if (anchor === 'end') div.style.transform = 'translateX(-100%)';
      div.innerHTML = renderMixedMath(text);
      fo.appendChild(div);
      parent.appendChild(fo);
    } else {
      parent.appendChild(svgEl('text', {
        x: px,
        y: py,
        class: 'yave-label' + (opts.muted ? ' is-muted' : '') + (opts.cls ? ' ' + opts.cls : ''),
        'text-anchor': anchor,
      }, text));
    }
  }

  function line(parent, x1, y1, x2, y2, cls) {
    parent.appendChild(svgEl('line', {
      x1: x1.toFixed(2),
      y1: y1.toFixed(2),
      x2: x2.toFixed(2),
      y2: y2.toFixed(2),
      class: cls,
    }));
  }

  function drawBackground() {
    const bg = state.bg;
    bg.textContent = '';
    const { xr, yr, grid } = state;

    if (grid > 0) {
      const gx = Math.ceil(xr[0] / grid) * grid;
      for (let x = gx; x <= xr[1] + 1e-9; x += grid) {
        if (Math.abs(x) < 1e-9) continue;
        line(bg, sx(x), sy(yr[0]), sx(x), sy(yr[1]), 'yave-grid');
      }
      const gy = Math.ceil(yr[0] / grid) * grid;
      for (let y = gy; y <= yr[1] + 1e-9; y += grid) {
        if (Math.abs(y) < 1e-9) continue;
        line(bg, sx(xr[0]), sy(y), sx(xr[1]), sy(y), 'yave-grid');
      }
    }

    if (yr[0] <= 0 && yr[1] >= 0) {
      line(bg, sx(xr[0]), sy(0), sx(xr[1]), sy(0), 'yave-axis');
      bg.appendChild(svgEl('path', {
        d: 'M' + (sx(xr[1]) - 7) + ' ' + (sy(0) - 3.5) +
          'L' + sx(xr[1]) + ' ' + sy(0) +
          'L' + (sx(xr[1]) - 7) + ' ' + (sy(0) + 3.5),
        class: 'yave-axis',
        fill: 'none',
      }));
    }
    if (xr[0] <= 0 && xr[1] >= 0) {
      line(bg, sx(0), sy(yr[0]), sx(0), sy(yr[1]), 'yave-axis');
      bg.appendChild(svgEl('path', {
        d: 'M' + (sx(0) - 3.5) + ' ' + (sy(yr[1]) + 7) +
          'L' + sx(0) + ' ' + sy(yr[1]) +
          'L' + (sx(0) + 3.5) + ' ' + (sy(yr[1]) + 7),
        class: 'yave-axis',
        fill: 'none',
      }));
    }

    const tx = niceStep(xr[0], xr[1], 6);
    const ty = niceStep(yr[0], yr[1], 6);
    const baseY = yr[0] <= 0 && yr[1] >= 0 ? sy(0) : sy(yr[0]);
    const baseX = xr[0] <= 0 && xr[1] >= 0 ? sx(0) : sx(xr[0]);

    for (let v = Math.ceil(xr[0] / tx) * tx; v <= xr[1] + 1e-9; v += tx) {
      if (Math.abs(v) < 1e-9) continue;
      bg.appendChild(svgEl('text', {
        x: sx(v).toFixed(2),
        y: (baseY + 12).toFixed(2),
        class: 'yave-tick',
        'text-anchor': 'middle',
      }, fmt(v)));
    }
    for (let w = Math.ceil(yr[0] / ty) * ty; w <= yr[1] + 1e-9; w += ty) {
      if (Math.abs(w) < 1e-9) continue;
      bg.appendChild(svgEl('text', {
        x: (baseX - 6).toFixed(2),
        y: (sy(w) + 3).toFixed(2),
        class: 'yave-tick',
        'text-anchor': 'end',
      }, fmt(w)));
    }
  }

  function drawCurve(spec, parent, ctx) {
    const attrs = spec.attrs;
    const parametric = attrs['x-expr'] != null || attrs['y-expr'] != null;
    const baseExpr = attrs.base ? compile(attrs.base) : null;
    const baseFn = baseExpr ? xVal => baseExpr({ ...ctx, x: xVal }) : null;
    const evalCtx = baseFn ? { ...ctx, f: baseFn } : ctx;
    const ghost = attrs.ghost != null;
    const dashed = attrs.dashed != null;
    const from = attrs.from != null ? evalAttr(spec, 'from', ctx, null) : null;
    const to = attrs.to != null ? evalAttr(spec, 'to', ctx, null) : null;

    if (baseExpr && !attrs['no-ghost']) {
      drawCurvePath(parent, baseExpr, ctx, from, to, true, true, attrs['base-label'], attrs['base-width']);
    }

    if (parametric) {
      const xFn = compile(attrs['x-expr'] || 't');
      const yFn = compile(attrs['y-expr'] || '0');
      const t0 = from != null ? from : 0;
      const t1 = to != null ? to : Math.PI * 2;
      drawParametricPath(parent, xFn, yFn, evalCtx, t0, t1, ghost, dashed, attrs.label, attrs.width);
      return;
    }

    const expr = compile(attrs.expr || '0');
    const x0 = from != null ? from : state.xr[0];
    const x1 = to != null ? to : state.xr[1];
    drawCurvePath(parent, expr, evalCtx, x0, x1, ghost, dashed, attrs.label, attrs.width);
  }

  function drawCurvePath(parent, fn, ctx, from, to, ghost, dashed, label, width) {
    const x0 = from != null ? from : state.xr[0];
    const x1 = to != null ? to : state.xr[1];
    const N = 240;
    const yPad = (state.yr[1] - state.yr[0]) * 3;
    let d = '';
    let pen = false;
    let lastX = null;
    let lastY = null;
    for (let k = 0; k <= N; k++) {
      const x = x0 + (x1 - x0) * k / N;
      const y = fn({ ...ctx, x });
      if (!Number.isFinite(y) || y < state.yr[0] - yPad || y > state.yr[1] + yPad) {
        pen = false;
        continue;
      }
      const px = sx(x);
      const py = sy(y);
      d += (pen ? 'L' : 'M') + px.toFixed(2) + ' ' + py.toFixed(2);
      pen = true;
      lastX = px;
      lastY = py;
    }
    if (d) {
      const path = svgEl('path', { d });
      path.setAttribute('class', 'yave-curve' + (ghost ? ' is-ghost' : '') + (dashed ? ' is-dashed' : ''));
      if (width) path.style.strokeWidth = width;
      parent.appendChild(path);
    }
    if (label && lastX != null) addLabel(parent, lastX, lastY, label, { muted: ghost });
  }

  function drawParametricPath(parent, xFn, yFn, ctx, t0, t1, ghost, dashed, label, width) {
    const N = 320;
    const xPad = (state.xr[1] - state.xr[0]) * 3;
    const yPad = (state.yr[1] - state.yr[0]) * 3;
    let d = '';
    let pen = false;
    let lastX = null;
    let lastY = null;
    for (let k = 0; k <= N; k++) {
      const t = t0 + (t1 - t0) * k / N;
      const x = xFn({ ...ctx, t });
      const y = yFn({ ...ctx, t });
      if (!Number.isFinite(x) || !Number.isFinite(y) ||
          x < state.xr[0] - xPad || x > state.xr[1] + xPad ||
          y < state.yr[0] - yPad || y > state.yr[1] + yPad) {
        pen = false;
        continue;
      }
      const px = sx(x);
      const py = sy(y);
      d += (pen ? 'L' : 'M') + px.toFixed(2) + ' ' + py.toFixed(2);
      pen = true;
      lastX = px;
      lastY = py;
    }
    if (d) {
      const path = svgEl('path', { d });
      path.setAttribute('class', 'yave-curve' + (ghost ? ' is-ghost' : '') + (dashed ? ' is-dashed' : ''));
      if (width) path.style.strokeWidth = width;
      parent.appendChild(path);
    }
    if (label && lastX != null) addLabel(parent, lastX, lastY, label, { muted: ghost });
  }

  function drawPoint(spec, parent, ctx) {
    const x = evalAttr(spec, 'x', ctx, 0);
    const y = evalAttr(spec, 'y', ctx, 0);
    const r = evalAttr(spec, 'r', ctx, 4.2);
    parent.appendChild(svgEl('circle', {
      cx: sx(x).toFixed(2),
      cy: sy(y).toFixed(2),
      r,
      class: 'yave-dot' + (spec.attrs.ghost != null ? ' is-ghost' : ''),
    }));
    addLabel(parent, sx(x), sy(y), spec.attrs.label, { muted: spec.attrs.ghost != null });
  }

  function drawSegment(spec, parent, ctx) {
    const a = evalPair(spec, 'from', ctx, null) ||
      [evalAttr(spec, 'x1', ctx, 0), evalAttr(spec, 'y1', ctx, 0)];
    const b = evalPair(spec, 'to', ctx, null) ||
      [evalAttr(spec, 'x2', ctx, 0), evalAttr(spec, 'y2', ctx, 0)];
    line(parent, sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1]),
      'yave-line' + (spec.attrs.ghost != null ? ' is-ghost' : '') + (spec.attrs.dashed != null ? ' is-dashed' : ''));
    addLabel(parent, sx((a[0] + b[0]) / 2), sy((a[1] + b[1]) / 2), spec.attrs.label, { muted: spec.attrs.ghost != null });
  }

  function drawPolygon(spec, parent, ctx) {
    const pts = parsePoints(spec.attrs.points);
    if (!pts.length) return;
    const mapped = pts.map(p => sx(p[0]).toFixed(2) + ',' + sy(p[1]).toFixed(2)).join(' ');
    const open = spec.attrs.open != null;
    const ghost = spec.attrs.ghost != null;
    const dashed = spec.attrs.dashed != null;
    const node = svgEl(open ? 'polyline' : 'polygon', {
      points: mapped,
      class: 'yave-shape' + (open ? ' is-open' : '') + (ghost ? ' is-ghost' : '') + (dashed ? ' is-dashed' : ''),
    });
    parent.appendChild(node);
    const labels = (spec.attrs.labels || '').split(',').map(s => s.trim());
    pts.forEach((p, i) => {
      if (labels[i]) addLabel(parent, sx(p[0]), sy(p[1]), labels[i], { muted: ghost });
    });
  }

  function drawCircle(spec, parent, ctx) {
    const x = evalAttr(spec, 'x', ctx, 0);
    const y = evalAttr(spec, 'y', ctx, 0);
    const r = evalAttr(spec, 'r', ctx, 1);
    const ghost = spec.attrs.ghost != null;
    const rx = r * state.ux;
    const ry = r * state.uy;
    parent.appendChild(svgEl('ellipse', {
      cx: sx(x).toFixed(2),
      cy: sy(y).toFixed(2),
      rx: rx.toFixed(2),
      ry: ry.toFixed(2),
      class: 'yave-shape' + (ghost ? ' is-ghost' : ''),
    }));
    addLabel(parent, sx(x) + rx + 4, sy(y) - 4, spec.attrs.label, { muted: ghost });
  }

  function drawVector(spec, parent, ctx) {
    const ox = evalAttr(spec, 'ox', ctx, 0);
    const oy = evalAttr(spec, 'oy', ctx, 0);
    const x = evalAttr(spec, 'x', ctx, 1);
    const y = evalAttr(spec, 'y', ctx, 1);
    const ghost = spec.attrs.ghost != null;
    line(parent, sx(ox), sy(oy), sx(x), sy(y), 'yave-line' + (ghost ? ' is-ghost' : ''));
    const ang = Math.atan2(sy(y) - sy(oy), sx(x) - sx(ox));
    const tipX = sx(x);
    const tipY = sy(y);
    const ah = 8;
    parent.appendChild(svgEl('path', {
      d: 'M' + tipX + ' ' + tipY +
        'L' + (tipX - ah * Math.cos(ang - 0.4)) + ' ' + (tipY - ah * Math.sin(ang - 0.4)) +
        'L' + (tipX - ah * Math.cos(ang + 0.4)) + ' ' + (tipY - ah * Math.sin(ang + 0.4)) + 'Z',
      class: 'yave-arrowhead' + (ghost ? ' is-ghost' : ''),
    }));
    addLabel(parent, tipX + 6, tipY - 6, spec.attrs.label, { muted: ghost });
  }

  function drawLabelSpec(spec, parent, ctx) {
    const x = evalAttr(spec, 'x', ctx, 0);
    const y = evalAttr(spec, 'y', ctx, 0);
    addLabel(parent, sx(x), sy(y), spec.text, {
      anchor: spec.attrs.anchor || 'start',
      muted: spec.attrs.muted != null,
    });
  }

  function renderSpec(spec, parent, ctx, inheritedGhost) {
    const tag = spec.tag;
    const ghost = inheritedGhost || spec.attrs.ghost != null;
    if (tag === 'yave-group') {
      const g = svgEl('g', { class: 'yave-group' + (ghost ? ' is-ghost' : '') });
      try {
        g.setAttribute('transform', buildGroupTransform(spec.attrs, ctx));
      } catch (err) {
        addError(parent, err.message || String(err));
        return;
      }
      for (const child of spec.children) {
        try {
          renderSpec(child, g, ctx, ghost);
        } catch (err) {
          addError(g, err.message || String(err));
        }
      }
      parent.appendChild(g);
      return;
    }
    try {
      if (tag === 'yave-curve') drawCurve(spec, parent, ctx);
      else if (tag === 'yave-point') drawPoint(spec, parent, ctx);
      else if (tag === 'yave-segment') drawSegment(spec, parent, ctx);
      else if (tag === 'yave-polygon') drawPolygon(spec, parent, ctx);
      else if (tag === 'yave-circle') drawCircle(spec, parent, ctx);
      else if (tag === 'yave-vector') drawVector(spec, parent, ctx);
      else if (tag === 'yave-label') drawLabelSpec(spec, parent, ctx);
    } catch (err) {
      addError(parent, err.message || String(err));
    }
  }

  function applyView() {
    if (!state.viewport) return;
    const v = state.view;
    state.viewport.setAttribute('transform', `translate(${v.tx} ${v.ty}) scale(${v.k})`);
  }

  function centerView() {
    state.view.k = state.initialZoom;
    state.view.tx = (state.W / 2) * (1 - state.view.k);
    state.view.ty = (state.H / 2) * (1 - state.view.k);
  }

  function rebuildContent() {
    if (!state.content) return;
    state.content.textContent = '';
    for (const spec of state.specs) {
      renderSpec(spec, state.content, state.ctx, false);
    }
  }

  function layout(width, height) {
    const w = Math.max(140, width || host.clientWidth || 420);
    state.W = w;
    state.H = height || state.H;
    state.xr = range(host.getAttribute('x'), -5, 5);
    state.yr = range(host.getAttribute('y'), -4, 4);
    state.grid = num(host.getAttribute('grid'), 1);
    state.pad = Math.max(18, Math.min(30, w * 0.055));
    const xSpan = state.xr[1] - state.xr[0];
    const ySpan = state.yr[1] - state.yr[0];
    const ux = (state.W - 2 * state.pad) / xSpan;
    const uy = (state.H - 2 * state.pad) / ySpan;
    const needsEqual = host.hasAttribute('equal') || specsNeedEqual(state.specs);
    if (needsEqual && !host.hasAttribute('stretch')) {
      const u = Math.min(ux, uy);
      state.ux = u;
      state.uy = u;
      state.equal = true;
    } else {
      state.ux = ux;
      state.uy = uy;
      state.equal = false;
    }
    state.cx0 = state.W / 2;
    state.cy0 = state.H / 2;
    state.xMid = (state.xr[0] + state.xr[1]) / 2;
    state.yMid = (state.yr[0] + state.yr[1]) / 2;
    centerView();

    svg.setAttribute('viewBox', `0 0 ${state.W} ${state.H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', host.getAttribute('label') || '坐标图');
    svg.textContent = '';

    state.viewport = svgEl('g', { class: 'yave-viewport' });
    state.bg = svgEl('g', { class: 'yave-bg' });
    state.content = svgEl('g', { class: 'yave-content' });
    state.viewport.appendChild(state.bg);
    state.viewport.appendChild(state.content);
    svg.appendChild(state.viewport);
    drawBackground();
    rebuildContent();
    applyView();
  }

  function clientToSvg(clientX, clientY) {
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = svg.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    return p.matrixTransform(ctm.inverse());
  }

  function zoomAt(point, factor) {
    const view = state.view;
    const next = clamp(view.k * factor, 0.4, 6);
    if (Math.abs(next - view.k) < 1e-4) return;
    const ratio = next / view.k;
    view.tx = point.x - (point.x - view.tx) * ratio;
    view.ty = point.y - (point.y - view.ty) * ratio;
    view.k = next;
    applyView();
  }

  function zoomBy(factor) {
    zoomAt({ x: state.W / 2, y: state.H / 2 }, factor);
  }

  function resetView() {
    centerView();
    applyView();
  }

  const pointers = new Map();

  function onWheel(e) {
    if (!state.viewport) return;
    e.preventDefault();
    const p = clientToSvg(e.clientX, e.clientY);
    zoomAt(p, Math.exp(-e.deltaY * 0.0015));
  }

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    svg.classList.add('is-panning');
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    const next = { x: e.clientX, y: e.clientY };

    if (pointers.size === 1) {
      pointers.set(e.pointerId, next);
      const p0 = clientToSvg(prev.x, prev.y);
      const p1 = clientToSvg(next.x, next.y);
      state.view.tx += p1.x - p0.x;
      state.view.ty += p1.y - p0.y;
      applyView();
      return;
    }

    if (pointers.size === 2) {
      const ids = Array.from(pointers.keys());
      const other = pointers.get(ids[0] === e.pointerId ? ids[1] : ids[0]);
      const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y);
      pointers.set(e.pointerId, next);
      const newDist = Math.hypot(next.x - other.x, next.y - other.y);
      if (prevDist > 0 && newDist > 0) {
        const mid = clientToSvg((next.x + other.x) / 2, (next.y + other.y) / 2);
        zoomAt(mid, newDist / prevDist);
      }
    }
  }

  function onPointerUp(e) {
    pointers.delete(e.pointerId);
    if (!pointers.size) svg.classList.remove('is-panning');
    if (svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
  }

  function onDoubleClick(e) {
    e.preventDefault();
    resetView();
  }

  if (!state.nozoom) {
    svg.addEventListener('wheel', onWheel, { passive: false });
    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('pointermove', onPointerMove);
    svg.addEventListener('pointerup', onPointerUp);
    svg.addEventListener('pointercancel', onPointerUp);
    svg.addEventListener('dblclick', onDoubleClick);
  }

  return {
    layout,
    rebuildContent,
    setContext(ctx) { state.ctx = ctx; },
    applyView,
    zoomBy,
    resetView,
    getView() { return { ...state.view }; },
    getSize() { return { W: state.W, H: state.H }; },
    destroy() {
      if (!state.nozoom) {
        svg.removeEventListener('wheel', onWheel);
        svg.removeEventListener('pointerdown', onPointerDown);
        svg.removeEventListener('pointermove', onPointerMove);
        svg.removeEventListener('pointerup', onPointerUp);
        svg.removeEventListener('pointercancel', onPointerUp);
        svg.removeEventListener('dblclick', onDoubleClick);
      }
    },
  };
}

export function specsFromHost(host) {
  return readSpecs(host);
}
