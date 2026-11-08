/*! yave.js — yet another visual explainer runtime (v1.0.0) */
(function () {
  'use strict';
  if (window.__yaveLoaded) return;
  window.__yaveLoaded = true;

  /* ------------------------------------------------------------------ *
   * styles
   * ------------------------------------------------------------------ */
  var css = `
body.yave{
  --y-bg:#fbfbfa; --y-surface:#ffffff; --y-surface-2:#f3f3f1;
  --y-ink:#17171a; --y-ink-2:#54545d; --y-ink-3:#8b8b95;
  --y-line:#e5e5e8; --y-accent:#4f6bff; --y-accent-2:#8a5cff;
  --y-ok:#159a55; --y-warn:#b87308; --y-err:#d23b3b;
  --y-r:14px; --y-r-s:9px;
  --y-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
  --y-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
  margin:0; background:var(--y-bg); color:var(--y-ink);
  font-family:var(--y-sans); font-size:15px; line-height:1.65;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
  overflow-wrap:break-word;
}
@media (prefers-color-scheme:dark){
  body.yave{
    --y-bg:#0b0b0d; --y-surface:#141417; --y-surface-2:#1c1c20;
    --y-ink:#f1f1f3; --y-ink-2:#b4b4bd; --y-ink-3:#7c7c87;
    --y-line:#2a2a30; --y-accent:#7d92ff; --y-accent-2:#a987ff;
    --y-ok:#3ecf8e; --y-warn:#f0b44c; --y-err:#ff6b6b;
  }
}
body.yave *,body.yave *::before,body.yave *::after{box-sizing:border-box}
body.yave .y-page{max-width:460px;margin:0 auto;padding:22px 16px 110px}
body.yave h1,body.yave h2,body.yave h3,body.yave h4{line-height:1.25;letter-spacing:-.02em;margin:0 0 .5em;text-wrap:balance}
body.yave h1{font-size:26px;letter-spacing:-.028em;margin-bottom:12px}
body.yave h2{font-size:19px;margin-top:24px;margin-bottom:9px}
body.yave h3{font-size:15.5px;margin-top:16px;margin-bottom:5px}
body.yave p{margin:0 0 10px;text-wrap:pretty}
body.yave ul,body.yave ol{margin:0 0 12px;padding-left:1.35em}
body.yave li{margin:3px 0}
body.yave a{color:var(--y-accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--y-accent) 32%,transparent)}
body.yave strong{font-weight:650}
body.yave code{font-family:var(--y-mono);font-size:.86em;background:var(--y-surface-2);border:1px solid var(--y-line);border-radius:6px;padding:.1em .35em}
body.yave pre{font-family:var(--y-mono);font-size:12.5px;line-height:1.55;background:var(--y-surface);border:1px solid var(--y-line);border-radius:var(--y-r-s);padding:12px 14px;overflow-x:auto;margin:0 0 12px}
body.yave pre code{background:none;border:0;padding:0;font-size:inherit}
body.yave table{width:100%;border-collapse:collapse;font-size:13.5px;margin:0 0 12px}
body.yave th,body.yave td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--y-line);vertical-align:top}
body.yave th{color:var(--y-ink-2);font-weight:600;font-size:12px}
body.yave blockquote{margin:0 0 12px;padding:2px 0 2px 12px;border-left:3px solid var(--y-line);color:var(--y-ink-2)}
body.yave hr{border:0;border-top:1px solid var(--y-line);margin:18px 0}
body.yave .y-hero{padding:8px 0 16px}
body.yave .y-kicker{font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--y-accent);margin-bottom:7px}
body.yave .y-lede{font-size:16px;color:var(--y-ink-2);margin-bottom:0}
body.yave .y-card{background:var(--y-surface);border:1px solid var(--y-line);border-radius:var(--y-r);padding:16px;margin:14px 0}
body.yave .y-stack>*+*{margin-top:10px}
body.yave .y-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:360px){body.yave .y-grid{grid-template-columns:1fr}}
body.yave .y-callout{border-left:3px solid var(--y-accent);background:color-mix(in srgb,var(--y-accent) 7%,transparent);padding:12px 14px;border-radius:0 var(--y-r-s) var(--y-r-s) 0;margin:14px 0}
body.yave .y-callout.is-ok{border-color:var(--y-ok);background:color-mix(in srgb,var(--y-ok) 8%,transparent)}
body.yave .y-callout.is-warn{border-color:var(--y-warn);background:color-mix(in srgb,var(--y-warn) 9%,transparent)}
body.yave .y-callout.is-err{border-color:var(--y-err);background:color-mix(in srgb,var(--y-err) 8%,transparent)}
body.yave .y-callout>:last-child,body.yave .y-card>:last-child{margin-bottom:0}
body.yave .y-badge{display:inline-block;font-size:11px;font-weight:600;padding:2px 7px;border-radius:99px;background:var(--y-surface-2);border:1px solid var(--y-line);color:var(--y-ink-2);vertical-align:middle}
body.yave .y-kv{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:13.5px;margin:0}
body.yave .y-kv dt{color:var(--y-ink-3)}
body.yave .y-kv dd{margin:0}
body.yave .y-flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
body.yave .y-flow.is-v{flex-direction:column;align-items:stretch}
body.yave .y-flow.is-v .y-arrow{transform:rotate(90deg);align-self:center}
body.yave .y-node{background:var(--y-surface-2);border:1px solid var(--y-line);border-radius:var(--y-r-s);padding:7px 10px;font-size:13px;line-height:1.4}
body.yave .y-node.is-hot{border-color:var(--y-accent);background:color-mix(in srgb,var(--y-accent) 8%,transparent)}
body.yave .y-arrow{color:var(--y-ink-3);font-size:14px;user-select:none}
body.yave .y-timeline{margin:8px 0 0 4px;padding-left:18px;border-left:2px solid var(--y-line)}
body.yave .y-timeline>*{position:relative;margin:0 0 14px}
body.yave .y-timeline>*::before{content:"";position:absolute;left:-25px;top:7px;width:10px;height:10px;border-radius:50%;background:var(--y-accent);box-shadow:0 0 0 3px var(--y-bg)}
body.yave .y-timeline>*:last-child{margin-bottom:0}
body.yave .y-bars{display:grid;gap:8px}
body.yave .y-bar{display:grid;grid-template-columns:5em 1fr 3.2em;align-items:center;gap:8px;font-size:12.5px}
body.yave .y-bar>span{color:var(--y-ink-2)}
body.yave .y-bar>i{height:9px;border-radius:99px;background:var(--y-surface-2);position:relative;overflow:hidden}
body.yave .y-bar>i::after{content:"";position:absolute;left:0;top:0;bottom:0;width:calc(var(--v,0)*100%);border-radius:inherit;background:linear-gradient(90deg,var(--y-accent),var(--y-accent-2))}
body.yave .y-bar>b{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}
body.yave .y-stats{display:flex;gap:10px;flex-wrap:wrap}
body.yave .y-stat{flex:1 1 0;background:var(--y-surface);border:1px solid var(--y-line);border-radius:var(--y-r-s);padding:10px 12px}
body.yave .y-stat b{display:block;font-size:22px;line-height:1.2;font-variant-numeric:tabular-nums}
body.yave .y-stat span{font-size:11.5px;color:var(--y-ink-3)}
body.yave .y-slider{display:block;margin:10px 0}
body.yave .y-slider>span{display:flex;justify-content:space-between;font-size:12.5px;color:var(--y-ink-2);margin-bottom:4px}
body.yave .y-slider output{font-family:var(--y-mono);color:var(--y-ink)}
body.yave .y-slider input[type=range]{width:100%;accent-color:var(--y-accent)}
body.yave .y-canvas{position:relative;height:180px;border-radius:var(--y-r-s);background:var(--y-surface-2);border:1px solid var(--y-line);overflow:hidden;margin:12px 0}
body.yave .y-dot{position:absolute;width:32px;height:32px;margin:-16px 0 0 -16px;border-radius:50%;background:var(--y-accent);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:600;line-height:1}
body.yave .y-steps{margin:14px 0}
body.yave .y-step{display:none;position:relative;padding-right:30px}
body.yave .y-step.is-active{display:block;animation:y-step-in .28s cubic-bezier(.2,.7,.2,1) both}
body.yave .y-step::after{content:attr(data-yave-no);position:absolute;top:3px;right:0;font-family:var(--y-mono);font-size:10px;letter-spacing:.06em;color:var(--y-accent);opacity:.75}
body.yave .y-controls{position:sticky;bottom:12px;display:flex;align-items:center;gap:4px;width:max-content;margin:18px auto 0;padding:5px;border-radius:14px;background:color-mix(in srgb,var(--y-surface) 88%,transparent);border:1px solid var(--y-line);box-shadow:0 8px 28px rgba(0,0,0,.12);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
body.yave .y-controls button{width:38px;height:34px;border:0;border-radius:9px;background:transparent;color:var(--y-ink-2);font-size:18px;line-height:1;cursor:pointer}
body.yave .y-controls button:hover{background:var(--y-surface-2);color:var(--y-ink)}
body.yave .y-controls button:disabled{opacity:.3;cursor:default}
body.yave .y-controls .y-pos{min-width:64px;text-align:center;font-family:var(--y-mono);font-size:12px;color:var(--y-ink-2);font-variant-numeric:tabular-nums}
body.yave .y-controls .y-pos b{color:var(--y-ink);font-weight:600}
body.yave .y-step.is-active .y-anim{animation:y-up .45s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s)}
body.yave .y-step.is-active .y-pop{animation:y-pop .42s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s)}
body.yave yave-geo{display:block;margin:12px 0}
body.yave yave-geo svg{width:100%;height:auto;display:block}
body.yave .yave-grid{stroke:var(--y-line);stroke-width:1}
body.yave .yave-axis{stroke:var(--y-ink-3);stroke-width:1}
body.yave .yave-tick{fill:var(--y-ink-3);font-size:10px;font-family:var(--y-mono)}
body.yave .yave-curve{fill:none;stroke:var(--y-accent);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
body.yave .yave-dot{fill:var(--y-accent);stroke:var(--y-bg);stroke-width:1.5}
body.yave .yave-shape{fill:color-mix(in srgb,var(--y-accent) 12%,transparent);stroke:var(--y-accent);stroke-width:1.8}
body.yave .yave-shape.is-open{fill:none}
body.yave .yave-line{stroke:var(--y-ink-2);stroke-width:1.5}
body.yave .yave-arrowhead{fill:var(--y-ink-2);stroke:none}
body.yave .yave-label{fill:var(--y-ink);font-size:12px;font-family:var(--y-sans)}
body.yave .yave-label.is-muted{fill:var(--y-ink-3)}
body.yave .yave-err{fill:var(--y-err);font-size:10px;font-family:var(--y-mono)}
body.yave .y-math{display:inline;line-height:1.25}
body.yave .y-math.is-display{display:block;text-align:center;margin:10px 0;font-size:1.06em}
body.yave .y-math sup,body.yave .y-math sub{font-size:.72em;line-height:0}
body.yave .y-frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;text-align:center;margin:0 .15em;font-size:.92em}
body.yave .y-frac-n{padding:0 .25em .04em;border-bottom:1px solid currentColor;line-height:1.15}
body.yave .y-frac-d{padding:.04em .25em 0;line-height:1.15}
body.yave .y-sqrt{display:inline-flex;align-items:flex-start;vertical-align:middle;margin:0 .1em}
body.yave .y-sqrt-b{border-top:1px solid currentColor;padding:0 .18em;line-height:1.2}
body.yave .y-sqrt-i{font-size:.68em;line-height:1;margin-right:.05em}
body.yave .y-mtext{font-family:var(--y-sans)}
@keyframes y-step-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes y-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes y-pop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  body.yave *,body.yave *::before,body.yave *::after{animation-duration:.01ms!important;animation-delay:0s!important;transition:none!important}
}
@media print{
  body.yave .y-step{display:block!important;padding-right:0}
  body.yave .y-step::after{display:none}
  body.yave .y-controls{display:none}
}
`;

  var style = document.createElement('style');
  style.id = 'yave-style';
  style.textContent = css;
  document.head.appendChild(style);

  /* ------------------------------------------------------------------ *
   * helpers
   * ------------------------------------------------------------------ */
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function num(v, d) {
    var n = parseFloat(v);
    return isFinite(n) ? n : d;
  }

  function range(v, a, b) {
    if (!v) return [a, b];
    var p = String(v).split(',').map(parseFloat);
    if (p.length < 2 || !isFinite(p[0]) || !isFinite(p[1]) || p[0] === p[1]) return [a, b];
    return p[0] < p[1] ? [p[0], p[1]] : [p[1], p[0]];
  }

  function svgEl(name, attrs, text) {
    var n = document.createElementNS(SVG_NS, name);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  /* ------------------------------------------------------------------ *
   * minimal LaTeX renderer (no external dependency)
   * ------------------------------------------------------------------ */
  var MATH_GREEK = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε',
    zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι', kappa: 'κ',
    lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', omicron: 'ο', pi: 'π', varpi: 'ϖ',
    rho: 'ρ', varrho: 'ϱ', sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ',
    phi: 'φ', varphi: 'ϕ', chi: 'χ', psi: 'ψ', omega: 'ω',
    Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π',
    Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω'
  };
  var MATH_SYMBOLS = {
    times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓', le: '≤', leq: '≤',
    ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', equiv: '≡', sim: '∼',
    propto: '∝', infty: '∞', to: '→', rightarrow: '→', leftarrow: '←',
    leftrightarrow: '↔', Rightarrow: '⇒', Leftarrow: '⇐', mapsto: '↦',
    uparrow: '↑', downarrow: '↓', sum: '∑', prod: '∏', int: '∫', iint: '∬',
    oint: '∮', partial: '∂', nabla: '∇', forall: '∀', exists: '∃', in: '∈',
    notin: '∉', subset: '⊂', supset: '⊃', cup: '∪', cap: '∩',
    emptyset: '∅', angle: '∠', perp: '⊥', parallel: '∥', circ: '∘',
    star: '⋆', ast: '∗', oplus: '⊕', otimes: '⊗'
  };

  function escHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function renderMath(src) {
    var pos = 0;

    function skipSpace() { while (src[pos] === ' ') pos++; }

    function parseRawArg() {
      skipSpace();
      if (src[pos] !== '{') return '';
      pos++;
      var depth = 1, start = pos;
      while (pos < src.length && depth > 0) {
        if (src[pos] === '{') depth++;
        else if (src[pos] === '}') depth--;
        if (depth > 0) pos++;
      }
      var out = src.slice(start, pos);
      if (src[pos] === '}') pos++;
      return out;
    }

    function parseArg() {
      skipSpace();
      if (pos >= src.length) return '';
      if (src[pos] === '{') {
        pos++;
        var inner = parseSeq('}');
        if (src[pos] === '}') pos++;
        return inner;
      }
      if (src[pos] === '\\') {
        var m = /^\\([a-zA-Z]+|.)/.exec(src.slice(pos));
        if (!m) { pos++; return ''; }
        pos += m[0].length;
        return parseCommand(m[1]);
      }
      return escHtml(src[pos++]);
    }

    function parseCommand(name) {
      if (name === 'frac' || name === 'dfrac' || name === 'tfrac') {
        var n = parseArg(), d = parseArg();
        return '<span class="y-frac"><span class="y-frac-n">' + n +
               '</span><span class="y-frac-d">' + d + '</span></span>';
      }
      if (name === 'sqrt') {
        skipSpace();
        var idx = '';
        if (src[pos] === '[') {
          pos++;
          var st = pos;
          while (pos < src.length && src[pos] !== ']') pos++;
          idx = escHtml(src.slice(st, pos));
          if (src[pos] === ']') pos++;
        }
        var body = parseArg();
        return '<span class="y-sqrt">' + (idx ? '<span class="y-sqrt-i">' + idx +
               '</span>' : '') + '√<span class="y-sqrt-b">' + body + '</span></span>';
      }
      if (name === 'text' || name === 'mathrm' || name === 'operatorname') {
        return '<span class="y-mtext">' + escHtml(parseRawArg()) + '</span>';
      }
      if (MATH_GREEK[name]) return escHtml(MATH_GREEK[name]);
      if (MATH_SYMBOLS[name]) return escHtml(MATH_SYMBOLS[name]);
      if (name === 'left' || name === 'right') return '';
      if (name === 'quad') return '&nbsp;&nbsp;';
      if (name === ',') return '&thinsp;';
      if (name === ';' || name === ' ') return '&nbsp;';
      if (name === '\\') return '<br>';
      return escHtml(name);
    }

    function parseSeq(end) {
      var out = '';
      while (pos < src.length) {
        var ch = src[pos];
        if (end && ch === end) break;
        if (ch === '}') break;
        if (ch === '{') {
          pos++;
          out += parseSeq('}');
          if (src[pos] === '}') pos++;
          continue;
        }
        if (ch === '^' || ch === '_') {
          pos++;
          var arg = parseArg();
          out += ch === '^' ? '<sup>' + arg + '</sup>' : '<sub>' + arg + '</sub>';
          continue;
        }
        if (ch === '\\') {
          var m = /^\\([a-zA-Z]+|.)/.exec(src.slice(pos));
          if (!m) { pos++; continue; }
          pos += m[0].length;
          out += parseCommand(m[1]);
          continue;
        }
        if (ch === ' ') { pos++; out += ' '; continue; }
        pos++;
        out += escHtml(ch);
      }
      return out;
    }

    return parseSeq();
  }

  function initMath() {
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'PRE' ||
            tag === 'CODE' || tag === 'TEXTAREA' || tag === 'YAVE-GEO') {
          return NodeFilter.FILTER_REJECT;
        }
        return /\$[^$\n]+\$/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = re.exec(text))) {
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var display = m[1] != null;
        var span = document.createElement('span');
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

  /* ------------------------------------------------------------------ *
   * expression compiler (no eval)
   * ------------------------------------------------------------------ */
  function tokenize(src) {
    var s = String(src), out = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        var mn = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));
        if (!mn) throw new Error('bad number');
        out.push(parseFloat(mn[0]));
        i += mn[0].length;
        continue;
      }
      if (/[a-zA-Z]/.test(c)) {
        var mi = /^[a-zA-Z][a-zA-Z0-9_]*/.exec(s.slice(i));
        out.push(mi[0]);
        i += mi[0].length;
        continue;
      }
      if (c === 'π') { out.push('pi'); i++; continue; }
      if ('+-*/^(),'.indexOf(c) >= 0) { out.push(c); i++; continue; }
      throw new Error('bad char ' + c);
    }
    return out;
  }

  function makeCall(name, a) {
    switch (name) {
      case 'sin': return function (x) { return Math.sin(a[0](x)); };
      case 'cos': return function (x) { return Math.cos(a[0](x)); };
      case 'tan': return function (x) { return Math.tan(a[0](x)); };
      case 'asin': return function (x) { return Math.asin(a[0](x)); };
      case 'acos': return function (x) { return Math.acos(a[0](x)); };
      case 'atan': return function (x) { return Math.atan(a[0](x)); };
      case 'sqrt': return function (x) { return Math.sqrt(a[0](x)); };
      case 'abs': return function (x) { return Math.abs(a[0](x)); };
      case 'ln': return function (x) { return Math.log(a[0](x)); };
      case 'log': return function (x) { return Math.log(a[0](x)); };
      case 'log2': return function (x) { return Math.log2(a[0](x)); };
      case 'log10': return function (x) { return Math.log10(a[0](x)); };
      case 'exp': return function (x) { return Math.exp(a[0](x)); };
      case 'floor': return function (x) { return Math.floor(a[0](x)); };
      case 'ceil': return function (x) { return Math.ceil(a[0](x)); };
      case 'round': return function (x) { return Math.round(a[0](x)); };
      case 'min': return function (x) { var v = a.map(function (f) { return f(x); }); return Math.min.apply(null, v); };
      case 'max': return function (x) { var v = a.map(function (f) { return f(x); }); return Math.max.apply(null, v); };
      case 'pow': return function (x) { return Math.pow(a[0](x), a[1](x)); };
      default: throw new Error('unknown fn ' + name);
    }
  }

  function compile(src) {
    var t = tokenize(src), i = 0;
    function peek() { return t[i]; }
    function eat(v) { if (t[i] === v) { i++; return true; } return false; }

    function primary() {
      if (eat('(')) {
        var inner = expr();
        if (!eat(')')) throw new Error('missing )');
        return inner;
      }
      var tok = t[i++];
      if (tok == null) throw new Error('unexpected end');
      if (typeof tok === 'number') return function () { return tok; };
      if (tok === 'x') return function (x) { return x; };
      if (tok === 'pi') return function () { return Math.PI; };
      if (tok === 'e') return function () { return Math.E; };
      if (typeof tok === 'string' && /^[a-z]/i.test(tok)) {
        if (eat('(')) {
          var args = [expr()];
          while (eat(',')) args.push(expr());
          if (!eat(')')) throw new Error('missing ) after ' + tok);
          return makeCall(tok, args);
        }
        throw new Error('unknown ' + tok);
      }
      throw new Error('unexpected ' + tok);
    }

    function power() {
      var base = primary();
      if (eat('^')) {
        var exponent = unary();
        return function (x) { return Math.pow(base(x), exponent(x)); };
      }
      return base;
    }

    function unary() {
      if (eat('-')) { var g = unary(); return function (x) { return -g(x); }; }
      if (eat('+')) return unary();
      return power();
    }

    function startsPrimary(tok) {
      return typeof tok === 'number' || (typeof tok === 'string' && (/^[a-z]/i.test(tok) || tok === '('));
    }

    function term() {
      var f = unary();
      for (;;) {
        if (eat('*')) { var l = f, r = unary(); f = function (x) { return l(x) * r(x); }; }
        else if (eat('/')) { var l2 = f, r2 = unary(); f = function (x) { return l2(x) / r2(x); }; }
        else if (startsPrimary(peek())) { var l3 = f, r3 = unary(); f = function (x) { return l3(x) * r3(x); }; }
        else return f;
      }
    }

    function expr() {
      var f = term();
      for (;;) {
        if (eat('+')) { var l = f, r = term(); f = function (x) { return l(x) + r(x); }; }
        else if (eat('-')) { var l2 = f, r2 = term(); f = function (x) { return l2(x) - r2(x); }; }
        else return f;
      }
    }

    var fn = expr();
    if (i < t.length) throw new Error('trailing input');
    return fn;
  }

  /* ------------------------------------------------------------------ *
   * steps
   * ------------------------------------------------------------------ */
  function pad2(n) { return n < 10 ? '0' + n : String(n); }

  function pickActive(boxes) {
    if (boxes.length === 1) return boxes[0];
    var vh = window.innerHeight || 800;
    var best = null, bestD = Infinity;
    boxes.forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var d = Math.abs((r.top + r.bottom) / 2 - vh / 2);
        if (d < bestD) { bestD = d; best = b; }
      }
    });
    return best || boxes[0];
  }

  function initSteps() {
    var boxes = document.querySelectorAll('.y-steps, [data-yave-steps]');
    Array.prototype.forEach.call(boxes, function (box) {
      if (box.__yaveReady) return;
      box.__yaveReady = true;

      var steps = Array.prototype.filter.call(box.children, function (el) {
        return el.classList && (el.classList.contains('y-step') || el.hasAttribute('data-yave-step'));
      });
      if (!steps.length) return;

      var cur = 0;
      var firstShow = true;
      steps.forEach(function (s, idx) {
        s.setAttribute('data-yave-no', pad2(idx + 1));
        s.setAttribute('aria-hidden', 'true');
      });

      var controls = null, prev = null, next = null, pos = null;

      function captureKeys(step) {
        var map = {};
        if (!step) return map;
        Array.prototype.forEach.call(step.querySelectorAll('[data-yave-key]'), function (el) {
          var r = el.getBoundingClientRect();
          if (r.width || r.height) map[el.getAttribute('data-yave-key')] = r;
        });
        return map;
      }

      function flipKeys(step, fromMap) {
        if (!fromMap || !step) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        Array.prototype.forEach.call(step.querySelectorAll('[data-yave-key]'), function (el) {
          var from = fromMap[el.getAttribute('data-yave-key')];
          if (!from) return;
          var to = el.getBoundingClientRect();
          var dx = from.left - to.left;
          var dy = from.top - to.top;
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
          if (el.animate) {
            el.animate(
              [
                { transform: 'translate(' + dx + 'px,' + dy + 'px)' },
                { transform: 'translate(0,0)' }
              ],
              { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' }
            );
          }
        });
      }

      function show(idx) {
        var fromMap = firstShow ? null : captureKeys(steps[cur]);
        cur = Math.max(0, Math.min(steps.length - 1, idx));
        steps.forEach(function (s, j) {
          var on = j === cur;
          s.classList.toggle('is-active', on);
          s.setAttribute('aria-hidden', on ? 'false' : 'true');
        });
        flipKeys(steps[cur], fromMap);
        firstShow = false;
        if (pos) pos.innerHTML = '<b>' + (cur + 1) + '</b> / ' + steps.length;
        if (prev) prev.disabled = cur === 0;
        if (next) next.disabled = cur === steps.length - 1;
        box.__yaveIndex = cur;
      }

      if (steps.length > 1) {
        controls = document.createElement('div');
        controls.className = 'y-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', '步骤控制');
        controls.innerHTML =
          '<button type="button" class="y-prev" aria-label="上一帧">‹</button>' +
          '<span class="y-pos" aria-live="polite"></span>' +
          '<button type="button" class="y-next" aria-label="下一帧">›</button>';
        prev = controls.querySelector('.y-prev');
        next = controls.querySelector('.y-next');
        pos = controls.querySelector('.y-pos');
        prev.addEventListener('click', function () { show(cur - 1); });
        next.addEventListener('click', function () { show(cur + 1); });
        box.appendChild(controls);
        box.__yaveShow = show;
      }

      show(0);
    });

    if (!document.__yaveKeys) {
      document.__yaveKeys = true;
      document.addEventListener('keydown', function (e) {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        var list = Array.prototype.slice.call(document.querySelectorAll('.y-steps, [data-yave-steps]')).filter(function (b) { return b.__yaveShow; });
        if (!list.length) return;
        var box = pickActive(list);
        if (!box) return;
        e.preventDefault();
        box.__yaveShow(box.__yaveIndex + (e.key === 'ArrowRight' ? 1 : -1));
      });
    }
  }

  /* ------------------------------------------------------------------ *
   * geometry
   * ------------------------------------------------------------------ */
  function niceStep(min, max, target) {
    var span = max - min;
    if (!(span > 0)) return 1;
    var raw = span / target;
    var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
    var norm = raw / pow;
    var mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return mult * pow;
  }

  function parsePoints(v) {
    if (!v) return [];
    return String(v).trim().split(/\s+/).map(function (pair) {
      var p = pair.split(',').map(parseFloat);
      return [p[0] || 0, p[1] || 0];
    });
  }

  function parsePoint(v) {
    if (!v) return null;
    var p = String(v).trim().split(/[,\s]+/).map(parseFloat);
    if (p.length < 2 || !isFinite(p[0]) || !isFinite(p[1])) return null;
    return [p[0], p[1]];
  }

  function renderGeo(host) {
    if (host.__yaveGeo) return;
    host.__yaveGeo = true;

    var xr = range(host.getAttribute('x'), -5, 5);
    var yr = range(host.getAttribute('y'), -4, 4);
    var height = num(host.getAttribute('height'), 240);
    var grid = num(host.getAttribute('grid'), 1);
    var W = host.clientWidth || 420, pad = 26;

    // equal scale on both axes so circles and angles stay true
    var u = Math.min((W - 2 * pad) / (xr[1] - xr[0]), (height - 2 * pad) / (yr[1] - yr[0]));
    var cx0 = W / 2, cy0 = height / 2;
    var xMid = (xr[0] + xr[1]) / 2, yMid = (yr[0] + yr[1]) / 2;
    var sx = function (x) { return cx0 + (x - xMid) * u; };
    var sy = function (y) { return cy0 - (y - yMid) * u; };

    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + height, role: 'img', 'aria-label': host.getAttribute('label') || '坐标图' });

    function line(x1, y1, x2, y2, cls) {
      svg.appendChild(svgEl('line', { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), class: cls }));
    }

    // grid
    if (grid > 0) {
      var gx = Math.ceil(xr[0] / grid) * grid;
      for (; gx <= xr[1] + 1e-9; gx += grid) {
        if (Math.abs(gx) < 1e-9) continue;
        line(sx(gx), sy(yr[0]), sx(gx), sy(yr[1]), 'yave-grid');
      }
      var gy = Math.ceil(yr[0] / grid) * grid;
      for (; gy <= yr[1] + 1e-9; gy += grid) {
        if (Math.abs(gy) < 1e-9) continue;
        line(sx(xr[0]), sy(gy), sx(xr[1]), sy(gy), 'yave-grid');
      }
    }

    // axes
    if (yr[0] <= 0 && yr[1] >= 0) {
      line(sx(xr[0]), sy(0), sx(xr[1]), sy(0), 'yave-axis');
      svg.appendChild(svgEl('path', {
        d: 'M' + (sx(xr[1]) - 7) + ' ' + (sy(0) - 3.5) + 'L' + sx(xr[1]) + ' ' + sy(0) + 'L' + (sx(xr[1]) - 7) + ' ' + (sy(0) + 3.5),
        class: 'yave-axis', fill: 'none'
      }));
    }
    if (xr[0] <= 0 && xr[1] >= 0) {
      line(sx(0), sy(yr[0]), sx(0), sy(yr[1]), 'yave-axis');
      svg.appendChild(svgEl('path', {
        d: 'M' + (sx(0) - 3.5) + ' ' + (sy(yr[1]) + 7) + 'L' + sx(0) + ' ' + sy(yr[1]) + 'L' + (sx(0) + 3.5) + ' ' + (sy(yr[1]) + 7),
        class: 'yave-axis', fill: 'none'
      }));
    }

    // ticks
    var tx = niceStep(xr[0], xr[1], 6);
    var ty = niceStep(yr[0], yr[1], 6);
    var baseY = (yr[0] <= 0 && yr[1] >= 0) ? sy(0) : sy(yr[0]);
    var baseX = (xr[0] <= 0 && xr[1] >= 0) ? sx(0) : sx(xr[0]);
    for (var v = Math.ceil(xr[0] / tx) * tx; v <= xr[1] + 1e-9; v += tx) {
      if (Math.abs(v) < 1e-9) continue;
      var xx = sx(v);
      svg.appendChild(svgEl('text', { x: xx, y: baseY + 12, class: 'yave-tick', 'text-anchor': 'middle' }, fmt(v)));
    }
    for (var w = Math.ceil(yr[0] / ty) * ty; w <= yr[1] + 1e-9; w += ty) {
      if (Math.abs(w) < 1e-9) continue;
      var yy = sy(w);
      svg.appendChild(svgEl('text', { x: baseX - 6, y: yy + 3, class: 'yave-tick', 'text-anchor': 'end' }, fmt(w)));
    }

    function fmt(n) {
      return Math.abs(n) < 1e-9 ? '0' : (Math.round(n * 100) / 100).toString();
    }

    function label(x, y, text, cls, anchor) {
      if (!text) return;
      svg.appendChild(svgEl('text', {
        x: x, y: y, class: 'yave-label' + (cls ? ' ' + cls : ''),
        'text-anchor': anchor || 'start'
      }, text));
    }

    // children
    Array.prototype.forEach.call(host.children, function (child) {
      var tag = child.tagName.toLowerCase();
      try {
        if (tag === 'yave-curve') {
          var expr = child.getAttribute('expr');
          if (!expr) return;
          var fn = compile(expr);
          var from = num(child.getAttribute('from'), xr[0]);
          var to = num(child.getAttribute('to'), xr[1]);
          var N = 240, d = '', pen = false;
          var yPad = (yr[1] - yr[0]) * 3;
          for (var k = 0; k <= N; k++) {
            var x = from + (to - from) * k / N;
            var y = fn(x);
            if (typeof y !== 'number' || !isFinite(y) || y < yr[0] - yPad || y > yr[1] + yPad) {
              pen = false;
              continue;
            }
            var px = sx(x), py = sy(y);
            d += (pen ? 'L' : 'M') + px.toFixed(2) + ' ' + py.toFixed(2);
            pen = true;
          }
          if (d) {
            var curveAttrs = { d: d, class: 'yave-curve' };
            if (child.hasAttribute('dashed')) curveAttrs['stroke-dasharray'] = '5 4';
            svg.appendChild(svgEl('path', curveAttrs));
          }
          var ly = fn(to);
          if (isFinite(ly)) label(sx(to) + 2, sy(ly) - 6, child.getAttribute('label'), 'is-muted');
        } else if (tag === 'yave-point') {
          var pxx = num(child.getAttribute('x'), 0), pyy = num(child.getAttribute('y'), 0);
          svg.appendChild(svgEl('circle', { cx: sx(pxx), cy: sy(pyy), r: 4.2, class: 'yave-dot' }));
          label(sx(pxx) + 7, sy(pyy) - 7, child.getAttribute('label'));
        } else if (tag === 'yave-segment') {
          var pa = parsePoint(child.getAttribute('from'));
          var pb = parsePoint(child.getAttribute('to'));
          var x1, y1, x2, y2;
          if (pa && pb) {
            x1 = pa[0]; y1 = pa[1]; x2 = pb[0]; y2 = pb[1];
          } else {
            x1 = num(child.getAttribute('x1'), 0); y1 = num(child.getAttribute('y1'), 0);
            x2 = num(child.getAttribute('x2'), 0); y2 = num(child.getAttribute('y2'), 0);
          }
          line(sx(x1), sy(y1), sx(x2), sy(y2), 'yave-line');
          label(sx((x1 + x2) / 2) + 6, sy((y1 + y2) / 2) - 6, child.getAttribute('label'));
        } else if (tag === 'yave-polygon') {
          var pts = parsePoints(child.getAttribute('points'));
          if (!pts.length) return;
          var mapped = pts.map(function (p) { return sx(p[0]).toFixed(2) + ',' + sy(p[1]).toFixed(2); }).join(' ');
          var open = child.hasAttribute('open');
          svg.appendChild(svgEl(open ? 'polyline' : 'polygon', {
            points: mapped,
            class: 'yave-shape' + (open ? ' is-open' : '')
          }));
          var labels = (child.getAttribute('labels') || '').split(',').filter(function (s) { return s.trim(); });
          pts.forEach(function (p, idx) {
            var txt = labels[idx] && labels[idx].trim();
            if (txt) label(sx(p[0]) + 7, sy(p[1]) - 7, txt);
          });
        } else if (tag === 'yave-circle') {
          var ccx = num(child.getAttribute('x'), 0), ccy = num(child.getAttribute('y'), 0), rr = num(child.getAttribute('r'), 1);
          svg.appendChild(svgEl('circle', { cx: sx(ccx), cy: sy(ccy), r: rr * u, class: 'yave-shape' }));
          label(sx(ccx) + rr * u + 4, sy(ccy) - 4, child.getAttribute('label'));
        } else if (tag === 'yave-vector') {
          var vx = num(child.getAttribute('x'), 1), vy = num(child.getAttribute('y'), 1);
          var ox = num(child.getAttribute('ox'), 0), oy = num(child.getAttribute('oy'), 0);
          line(sx(ox), sy(oy), sx(vx), sy(vy), 'yave-line');
          var ang = Math.atan2(sy(vy) - sy(oy), sx(vx) - sx(ox));
          var tipX = sx(vx), tipY = sy(vy), ah = 8;
          svg.appendChild(svgEl('path', {
            d: 'M' + tipX + ' ' + tipY +
               'L' + (tipX - ah * Math.cos(ang - 0.4)) + ' ' + (tipY - ah * Math.sin(ang - 0.4)) +
               'L' + (tipX - ah * Math.cos(ang + 0.4)) + ' ' + (tipY - ah * Math.sin(ang + 0.4)) + 'Z',
            class: 'yave-arrowhead'
          }));
          label(tipX + 6, tipY - 6, child.getAttribute('label'));
        } else if (tag === 'yave-label') {
          label(sx(num(child.getAttribute('x'), 0)), sy(num(child.getAttribute('y'), 0)), child.textContent, null, child.getAttribute('anchor') || 'start');
        }
      } catch (err) {
        var msg = String(err && err.message || err);
        svg.appendChild(svgEl('text', { x: 8, y: 14, class: 'yave-err' }, '⚠ ' + msg));
      }
    });

    host.textContent = '';
    host.appendChild(svg);
  }

  function initGeo() {
    var list = document.querySelectorAll('yave-geo');
    Array.prototype.forEach.call(list, renderGeo);
  }

  /* ------------------------------------------------------------------ *
   * sliders
   * ------------------------------------------------------------------ */
  function initSliders() {
    var list = document.querySelectorAll('.y-slider input[type=range]');
    Array.prototype.forEach.call(list, function (input) {
      if (input.__yaveSlider) return;
      input.__yaveSlider = true;
      var update = function () {
        var out = input.closest('.y-slider').querySelector('output');
        if (out) out.textContent = input.value;
        var varName = input.getAttribute('data-yave-var');
        if (varName) {
          var scope = input.closest('[data-yave-scope]') || document.body;
          scope.style.setProperty(varName, input.value);
        }
      };
      input.addEventListener('input', update);
      update();
    });
  }

  /* ------------------------------------------------------------------ *
   * boot
   * ------------------------------------------------------------------ */
  function boot() {
    document.body.classList.add('yave');
    initMath();
    initSteps();
    initGeo();
    initSliders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.Yave = { version: '1.0.0', boot: boot };
})();
