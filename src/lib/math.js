import { escapeHtml } from './util.js';

const GREEK = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', varpi: 'ϖ',
  rho: 'ρ', varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
  phi: 'φ', varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
  Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
};

const SYMBOLS = {
  times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓', le: '≤', leq: '≤',
  ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', equiv: '≡', sim: '∼',
  propto: '∝', infty: '∞', to: '→', rightarrow: '→', leftarrow: '←',
  leftrightarrow: '↔', Rightarrow: '⇒', Leftarrow: '⇐', Leftrightarrow: '⇔',
  mapsto: '↦', uparrow: '↑', downarrow: '↓', sum: '∑', prod: '∏',
  int: '∫', iint: '∬', iiint: '∭', oint: '∮', partial: '∂', nabla: '∇',
  forall: '∀', exists: '∃', in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆',
  supset: '⊃', supseteq: '⊇', cup: '∪', cap: '∩', emptyset: '∅',
  varnothing: '∅', angle: '∠', perp: '⊥', parallel: '∥', circ: '∘',
  star: '⋆', ast: '∗', oplus: '⊕', otimes: '⊗', cdots: '⋯', ldots: '…',
  dots: '…', vdots: '⋮', ddots: '⋱', therefore: '∴', because: '∵',
  degree: '°', prime: '′', ell: 'ℓ', hbar: 'ℏ', Re: 'ℜ', Im: 'ℑ',
};

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'sinh', 'cosh', 'tanh',
  'arcsin', 'arccos', 'arctan', 'log', 'ln', 'exp', 'lim', 'max', 'min',
  'sup', 'inf', 'det', 'gcd',
]);

const DOUBLE_STRUCK = {
  R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ', P: 'ℙ',
};

export function renderMath(src) {
  const s = String(src);
  let pos = 0;

  function skipSpace() {
    while (s[pos] === ' ') pos++;
  }

  function parseRawArg() {
    skipSpace();
    if (s[pos] !== '{') return '';
    pos++;
    let depth = 1;
    const start = pos;
    while (pos < s.length && depth > 0) {
      if (s[pos] === '{') depth++;
      else if (s[pos] === '}') depth--;
      if (depth > 0) pos++;
    }
    const out = s.slice(start, pos);
    if (s[pos] === '}') pos++;
    return out;
  }

  function parseArg() {
    skipSpace();
    if (pos >= s.length) return '';
    if (s[pos] === '{') {
      pos++;
      const inner = parseSeq('}');
      if (s[pos] === '}') pos++;
      return inner;
    }
    if (s[pos] === '\\') {
      const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(pos));
      if (!m) { pos++; return ''; }
      pos += m[0].length;
      return parseCommand(m[1]);
    }
    return escapeHtml(s[pos++]);
  }

  function parseCommand(name) {
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
      const n = parseArg();
      const d = parseArg();
      return '<span class="y-frac"><span class="y-frac-n">' + n +
        '</span><span class="y-frac-d">' + d + '</span></span>';
    }
    if (name === 'sqrt') {
      skipSpace();
      let idx = '';
      if (s[pos] === '[') {
        pos++;
        const st = pos;
        while (pos < s.length && s[pos] !== ']') pos++;
        idx = escapeHtml(s.slice(st, pos));
        if (s[pos] === ']') pos++;
      }
      const body = parseArg();
      return '<span class="y-sqrt">' + (idx ? '<span class="y-sqrt-i">' + idx + '</span>' : '') +
        '√<span class="y-sqrt-b">' + body + '</span></span>';
    }
    if (name === 'text' || name === 'mathrm' || name === 'operatorname') {
      return '<span class="y-mtext">' + escapeHtml(parseRawArg()) + '</span>';
    }
    if (name === 'mathbf') return '<span class="y-mbf">' + parseArg() + '</span>';
    if (name === 'mathbb') {
      const raw = parseRawArg();
      const mapped = raw.replace(/[A-Z]/g, c => DOUBLE_STRUCK[c] || c);
      return '<span class="y-mbb">' + escapeHtml(mapped) + '</span>';
    }
    if (name === 'mathcal') return '<span class="y-mcal">' + parseArg() + '</span>';
    if (name === 'vec') return '<span class="y-vec">' + parseArg() + '</span>';
    if (name === 'overline' || name === 'bar') return '<span class="y-overline">' + parseArg() + '</span>';
    if (name === 'hat') return '<span class="y-hat">' + parseArg() + '</span>';
    if (name === 'dot') return '<span class="y-dot-above">' + parseArg() + '</span>';
    if (name === 'ddot') return '<span class="y-ddot-above">' + parseArg() + '</span>';
    if (name === 'left' || name === 'right' || name === 'displaystyle') return '';
    if (name === 'quad') return '&nbsp;&nbsp;';
    if (name === 'qquad') return '&nbsp;&nbsp;&nbsp;&nbsp;';
    if (name === ',' || name === ';' || name === ':') return '&#8201;';
    if (name === '!') return '';
    if (name === '\\') return '<br>';
    if (name === '%' || name === '$' || name === '_' || name === '&' ||
        name === '#' || name === '{' || name === '}') {
      return escapeHtml(name);
    }
    if (GREEK[name]) return escapeHtml(GREEK[name]);
    if (SYMBOLS[name]) return escapeHtml(SYMBOLS[name]);
    if (FUNCTIONS.has(name)) return '<span class="y-mtext">' + escapeHtml(name) + '</span>';
    return escapeHtml(name);
  }

  function parseSeq(end) {
    let out = '';
    while (pos < s.length) {
      const ch = s[pos];
      if (end && ch === end) break;
      if (ch === '}') break;
      if (ch === '{') {
        pos++;
        out += parseSeq('}');
        if (s[pos] === '}') pos++;
        continue;
      }
      if (ch === '^' || ch === '_') {
        pos++;
        const arg = parseArg();
        out += ch === '^' ? '<sup>' + arg + '</sup>' : '<sub>' + arg + '</sub>';
        continue;
      }
      if (ch === '\\') {
        const m = /^\\([a-zA-Z]+|.)/.exec(s.slice(pos));
        if (!m) { pos++; continue; }
        pos += m[0].length;
        out += parseCommand(m[1]);
        continue;
      }
      if (ch === ' ') { pos++; out += ' '; continue; }
      pos++;
      out += escapeHtml(ch);
    }
    return out;
  }

  return parseSeq();
}

export function renderMixedMath(text) {
  const s = String(text);
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    out += escapeHtml(s.slice(last, m.index));
    const raw = m[1] != null ? m[1] : m[2];
    out += '<span class="y-math">' + renderMath(raw) + '</span>';
    last = re.lastIndex;
  }
  out += escapeHtml(s.slice(last));
  return out;
}

export function initMath() {
  if (!document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.nodeName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'PRE' || tag === 'CODE' ||
          tag === 'TEXTAREA' || tag === 'YAVE-GEO' || tag === 'YAVE-ER' || tag === 'YAVE-ICON') {
        return NodeFilter.FILTER_REJECT;
      }
      if (p.closest && p.closest('.y-math')) return NodeFilter.FILTER_REJECT;
      return /\$[^$\n]+\$/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(node => {
    const text = node.nodeValue;
    const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const display = m[1] != null;
      const span = document.createElement('span');
      span.className = 'y-math' + (display ? ' is-display' : '');
      span.innerHTML = renderMath(display ? m[1] : m[2]);
      frag.appendChild(span);
      last = re.lastIndex;
    }
    if (last === 0) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
}
