export const SVG_NS = 'http://www.w3.org/2000/svg';
export const XHTML_NS = 'http://www.w3.org/1999/xhtml';

export function num(v, d) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
}

export function range(v, a, b) {
  if (!v) return [a, b];
  const p = String(v).split(',').map(parseFloat);
  if (p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1]) || p[0] === p[1]) return [a, b];
  return p[0] < p[1] ? [p[0], p[1]] : [p[1], p[0]];
}

export function parsePoint(v) {
  if (!v) return null;
  const p = String(v).trim().split(/[,\s]+/).map(parseFloat);
  if (p.length < 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
  return [p[0], p[1]];
}

export function parsePoints(v) {
  if (!v) return [];
  return String(v)
    .trim()
    .split(/\s+/)
    .map(pair => pair.split(',').map(parseFloat))
    .filter(p => p.length >= 2 && Number.isFinite(p[0]) && Number.isFinite(p[1]))
    .map(p => [p[0], p[1]]);
}

export function svgEl(name, attrs, text) {
  const n = document.createElementNS(SVG_NS, name);
  if (attrs) {
    for (const k in attrs) {
      if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
  }
  if (text != null) n.textContent = text;
  return n;
}

export function fmt(n) {
  if (!Number.isFinite(n)) return '';
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
}

export function niceStep(min, max, target) {
  const span = max - min;
  if (!(span > 0)) return 1;
  const raw = span / target;
  const pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
  const norm = raw / pow;
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return mult * pow;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export function isReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

export function nextFrame(fn) {
  if (typeof window.requestAnimationFrame === 'function') return window.requestAnimationFrame(fn);
  return window.setTimeout(fn, 16);
}
