import { compile } from './expr.js';
import { parsePoint } from './util.js';

const FN_RE = /(translate|rotate|scale)\s*\(([^)]*)\)/g;

export function parseTransform(str, ctx) {
  const out = { tx: 0, ty: 0, rot: 0, sx: 1, sy: 1 };
  if (!str) return out;
  FN_RE.lastIndex = 0;
  let m;
  while ((m = FN_RE.exec(str))) {
    const name = m[1];
    const args = m[2].split(',').map(s => s.trim()).filter(Boolean);
    const vals = args.map(a => {
      const fn = compile(a);
      const v = fn(ctx);
      if (!Number.isFinite(v)) throw new Error('bad transform value');
      return v;
    });
    if (name === 'translate') {
      out.tx += vals[0] || 0;
      out.ty += vals[1] || 0;
    } else if (name === 'rotate') {
      out.rot += vals[0] || 0;
    } else if (name === 'scale') {
      const sx = vals[0] == null ? 1 : vals[0];
      const sy = vals[1] == null ? sx : vals[1];
      out.sx *= sx;
      out.sy *= sy;
    }
  }
  return out;
}

export function buildGroupTransform(attrs, ctx) {
  const t = parseTransform(attrs.transform || '', ctx);
  const origin = parsePoint(attrs.origin) || [0, 0];
  const [ox, oy] = origin;
  const parts = [];
  if (t.tx || t.ty) parts.push(`translate(${t.tx} ${t.ty})`);
  if (ox || oy) parts.push(`translate(${ox} ${oy})`);
  if (t.rot) parts.push(`rotate(${t.rot})`);
  if (t.sx !== 1 || t.sy !== 1) parts.push(`scale(${t.sx} ${t.sy})`);
  if (ox || oy) parts.push(`translate(${-ox} ${-oy})`);
  return parts.join(' ') || 'translate(0 0)';
}
