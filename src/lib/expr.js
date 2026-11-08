const VARS = new Set(['x', 't', 'a', 'b', 'h', 'k', 's', 'theta', 'tx', 'ty']);
const CONSTANTS = { pi: Math.PI, e: Math.E };

export function tokenize(src) {
  const s = String(src);
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/[0-9.]/.test(c)) {
      const m = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
      if (!m) throw new Error('bad number');
      out.push(parseFloat(m[0]));
      i += m[0].length;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      const m = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(s.slice(i));
      out.push(m[0]);
      i += m[0].length;
      continue;
    }
    if (c === 'π') { out.push('pi'); i++; continue; }
    if (c === 'θ') { out.push('theta'); i++; continue; }
    if ('+-*/^(),'.includes(c)) { out.push(c); i++; continue; }
    throw new Error('bad char ' + c);
  }
  return out;
}

function makeCall(name, args) {
  const a = args;
  switch (name) {
    case 'sin': return c => Math.sin(a[0](c));
    case 'cos': return c => Math.cos(a[0](c));
    case 'tan': return c => Math.tan(a[0](c));
    case 'cot': return c => 1 / Math.tan(a[0](c));
    case 'sec': return c => 1 / Math.cos(a[0](c));
    case 'csc': return c => 1 / Math.sin(a[0](c));
    case 'asin': return c => Math.asin(a[0](c));
    case 'acos': return c => Math.acos(a[0](c));
    case 'atan': return c => Math.atan(a[0](c));
    case 'atan2': return c => Math.atan2(a[0](c), a[1](c));
    case 'sinh': return c => Math.sinh(a[0](c));
    case 'cosh': return c => Math.cosh(a[0](c));
    case 'tanh': return c => Math.tanh(a[0](c));
    case 'sqrt': return c => Math.sqrt(a[0](c));
    case 'abs': return c => Math.abs(a[0](c));
    case 'ln': return c => Math.log(a[0](c));
    case 'log': return c => Math.log(a[0](c));
    case 'log2': return c => Math.log2(a[0](c));
    case 'log10': return c => Math.log10(a[0](c));
    case 'exp': return c => Math.exp(a[0](c));
    case 'floor': return c => Math.floor(a[0](c));
    case 'ceil': return c => Math.ceil(a[0](c));
    case 'round': return c => Math.round(a[0](c));
    case 'sign': return c => Math.sign(a[0](c));
    case 'min': return c => Math.min(...a.map(f => f(c)));
    case 'max': return c => Math.max(...a.map(f => f(c)));
    case 'hypot': return c => Math.hypot(...a.map(f => f(c)));
    case 'pow': return c => Math.pow(a[0](c), a[1](c));
    case 'mod': return c => a[0](c) % a[1](c);
    default: throw new Error('unknown fn ' + name);
  }
}

export function compile(src) {
  const t = tokenize(src);
  let i = 0;

  const peek = () => t[i];
  const eat = v => {
    if (t[i] === v) { i++; return true; }
    return false;
  };
  const expect = v => {
    if (!eat(v)) throw new Error('expected ' + v);
  };

  function primary() {
    if (eat('(')) {
      const inner = expr();
      expect(')');
      return inner;
    }
    const tok = t[i++];
    if (tok == null) throw new Error('unexpected end');
    if (typeof tok === 'number') return () => tok;
    if (VARS.has(tok)) return c => c[tok];
    if (tok === 'f') {
      if (eat('(')) {
        const arg = expr();
        expect(')');
        return c => c.f(arg(c));
      }
      throw new Error('f() needs an argument');
    }
    if (typeof tok === 'string' && /^[a-z]/i.test(tok)) {
      if (eat('(')) {
        const args = [expr()];
        while (eat(',')) args.push(expr());
        expect(')');
        return makeCall(tok, args);
      }
      if (CONSTANTS[tok] != null) return () => CONSTANTS[tok];
      throw new Error('unknown ' + tok);
    }
    throw new Error('unexpected ' + tok);
  }

  function power() {
    const base = primary();
    if (eat('^')) {
      const exponent = unary();
      return c => Math.pow(base(c), exponent(c));
    }
    return base;
  }

  function unary() {
    if (eat('-')) {
      const g = unary();
      return c => -g(c);
    }
    if (eat('+')) return unary();
    return power();
  }

  function startsPrimary(tok) {
    return typeof tok === 'number' || (typeof tok === 'string' && (/^[a-z]/i.test(tok) || tok === '('));
  }

  function term() {
    let f = unary();
    for (;;) {
      if (eat('*')) {
        const l = f;
        const r = unary();
        f = c => l(c) * r(c);
      } else if (eat('/')) {
        const l = f;
        const r = unary();
        f = c => l(c) / r(c);
      } else if (startsPrimary(peek())) {
        const l = f;
        const r = unary();
        f = c => l(c) * r(c);
      } else {
        return f;
      }
    }
  }

  function expr() {
    let f = term();
    for (;;) {
      if (eat('+')) {
        const l = f;
        const r = term();
        f = c => l(c) + r(c);
      } else if (eat('-')) {
        const l = f;
        const r = term();
        f = c => l(c) - r(c);
      } else {
        return f;
      }
    }
  }

  const fn = expr();
  if (i < t.length) throw new Error('trailing input');
  return fn;
}
