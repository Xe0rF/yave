export const css = `
body.yave{
  --y-bg:#0b0e13; --y-surface:#121720; --y-surface-2:#1a212c;
  --y-line:#26303d; --y-line-strong:#354254;
  --y-ink:#e6edf6; --y-ink-2:#a7b4c4; --y-ink-3:#748295;
  --y-accent:#e6c25a;
  --y-accent-soft:color-mix(in srgb,var(--y-accent) 12%,transparent);
  --y-ok:#6fcf97; --y-warn:#f0a35e; --y-err:#ff7b72;
  --y-r:14px; --y-r-s:8px;
  --y-display:"Iowan Old Style","Palatino Linotype","Book Antiqua","Noto Serif CJK SC","Source Han Serif CN","思源宋体 CN","Noto Serif SC","Songti SC",serif;
  --y-sans:"InterVariable","Inter",ui-sans-serif,system-ui,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;
  --y-mono:"JetBrains Mono",ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
  margin:0; background:var(--y-bg); color:var(--y-ink);
  font-family:var(--y-sans); font-size:16px; line-height:1.65;
  -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility;
  overflow-wrap:break-word; color-scheme:dark;
}
body.yave *,body.yave *::before,body.yave *::after{box-sizing:border-box}
body.yave .y-page{max-width:600px;margin:0 auto;padding:28px 20px 104px;counter-reset:y-fig}
body.yave h1,body.yave h2,body.yave h3,body.yave h4{color:var(--y-ink);line-height:1.2;letter-spacing:-.02em;margin:0 0 .5em;text-wrap:balance}
body.yave h1{font-family:var(--y-display);font-size:32px;font-weight:600;line-height:1.15;letter-spacing:-.025em;margin-bottom:10px}
body.yave h2{font-family:var(--y-display);font-size:21px;font-weight:600;line-height:1.25;letter-spacing:-.015em;margin-top:20px;margin-bottom:6px}
body.yave h3{font-size:16px;font-weight:600;margin-top:14px;margin-bottom:4px}
body.yave p{margin:0 0 10px;text-wrap:pretty}
body.yave ul,body.yave ol{margin:0 0 12px;padding-left:1.35em}
body.yave li{margin:3px 0}
body.yave a{color:var(--y-accent);text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--y-accent) 32%,transparent)}
body.yave strong{font-weight:600}
body.yave code{font-family:var(--y-mono);font-size:.86em;background:var(--y-surface-2);border:1px solid var(--y-line);border-radius:5px;padding:.1em .35em}
body.yave pre{font-family:var(--y-mono);font-size:13px;line-height:1.55;background:var(--y-surface);border:1px solid var(--y-line);border-radius:var(--y-r-s);padding:12px 14px;white-space:pre-wrap;overflow-wrap:break-word;margin:0 0 12px}
body.yave pre code{background:none;border:0;padding:0;font-size:inherit}
body.yave table{width:100%;border-collapse:collapse;font-size:14px;margin:0}
body.yave th,body.yave td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--y-line);vertical-align:top}
body.yave th{color:var(--y-ink-3);font-family:var(--y-mono);font-size:11px;font-weight:500}
body.yave td{color:var(--y-ink-2);font-variant-numeric:tabular-nums}
body.yave td:last-child,body.yave th:last-child{text-align:right}
body.yave blockquote{margin:0 0 12px;padding:2px 0 2px 12px;border-left:2px solid var(--y-line);color:var(--y-ink-2)}
body.yave dl{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;margin:12px 0;font-size:14px}
body.yave dt{color:var(--y-ink-3);font-family:var(--y-mono);font-size:12px}
body.yave dd{min-width:0;margin:0;color:var(--y-ink-2);overflow-wrap:break-word}
body.yave hr{border:0;border-top:1px solid var(--y-line);margin:20px 0}
body.yave details{margin:12px 0 0;padding-top:8px;border-top:1px solid var(--y-line);color:var(--y-ink-2);font-size:14px}
body.yave summary{cursor:pointer;color:var(--y-ink-2)}
body.yave summary::marker{color:var(--y-accent)}
body.yave details p:last-child{margin-bottom:0}
body.yave .y-hero{padding:4px 0 18px}
body.yave .y-kicker{margin:0 0 8px;color:var(--y-accent);font-family:var(--y-mono);font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
body.yave .y-lede{max-width:46ch;margin:0;color:var(--y-ink-2);font-size:17px;line-height:1.55;text-wrap:pretty}
body.yave .y-page > section{margin-top:20px;padding-top:18px;border-top:1px solid var(--y-line)}
body.yave .y-callout{margin:0 0 18px;padding:9px 11px;border-left:2px solid var(--y-accent);background:color-mix(in srgb,var(--y-accent) 8%,transparent);color:var(--y-ink-2);font-size:14px;line-height:1.55}
body.yave .y-callout>:last-child{margin-bottom:0}
body.yave .y-callout.is-ok{border-color:var(--y-ok);background:color-mix(in srgb,var(--y-ok) 8%,transparent)}
body.yave .y-callout.is-warn{border-color:var(--y-warn);background:color-mix(in srgb,var(--y-warn) 8%,transparent)}
body.yave .y-callout.is-err{border-color:var(--y-err);background:color-mix(in srgb,var(--y-err) 8%,transparent)}
body.yave .y-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:12px 0}
body.yave .y-flow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
body.yave .y-flow.is-v{flex-direction:column;align-items:stretch}
body.yave .y-flow.is-v .y-arrow{align-self:center;transform:rotate(90deg)}
body.yave .y-node{padding:5px 9px;border:1px solid var(--y-line);border-radius:var(--y-r-s);background:var(--y-surface-2);color:var(--y-ink-2);font-size:13px;line-height:1.4}
body.yave .y-node.is-hot{border-color:var(--y-accent);color:var(--y-ink)}
body.yave .y-arrow{color:var(--y-ink-3);font-family:var(--y-mono);font-size:12px}
body.yave .y-tree{list-style:none;margin:12px 0;padding-left:1.1em}
body.yave .y-tree ul{list-style:none;margin:2px 0;padding-left:1.2em;border-left:1px solid var(--y-line)}
body.yave .y-tree li{position:relative;margin:0;padding:2px 0 2px 1em}
body.yave .y-tree li::before{content:"";position:absolute;left:0;top:.9em;width:.7em;height:1px;background:var(--y-line)}
body.yave .y-tree > li{padding-left:0}
body.yave .y-tree > li::before{display:none}
body.yave .y-tabs{margin:12px 0}
body.yave .y-tablist{display:flex;gap:2px;max-width:100%;padding:2px;border:1px solid var(--y-line);border-radius:var(--y-r-s);background:var(--y-surface-2);overflow-x:auto;scrollbar-width:none}
body.yave .y-tablist::-webkit-scrollbar{display:none}
body.yave .y-tab{flex:none;padding:5px 10px;border:0;border-radius:calc(var(--y-r-s) - 2px);background:transparent;color:var(--y-ink-2);font:inherit;font-size:13px;white-space:nowrap;cursor:pointer}
body.yave .y-tab[aria-selected="true"],body.yave .y-tab.is-active{background:var(--y-surface);color:var(--y-ink)}
body.yave .y-panel{margin-top:10px}
body.yave .y-panel[hidden]{display:none}
body.yave .y-slider{display:grid;gap:4px;margin:12px 0;color:var(--y-ink-2);font-size:14px}
body.yave .y-slider>span{display:flex;justify-content:space-between;gap:10px}
body.yave .y-slider output{font-family:var(--y-mono);color:var(--y-ink);font-variant-numeric:tabular-nums}
body.yave .y-slider input[type=range]{width:100%;accent-color:var(--y-accent)}
body.yave .y-steps{margin:16px 0}
body.yave .y-step{display:none;position:relative;padding-right:34px}
body.yave .y-step.is-active{display:block;animation:y-step-in .22s cubic-bezier(.2,.7,.2,1) both}
body.yave .y-step::after{content:attr(data-yave-no);position:absolute;top:2px;right:0;color:var(--y-accent);font-family:var(--y-mono);font-size:10px;letter-spacing:.06em;opacity:.8}
body.yave .y-controls{position:sticky;bottom:12px;display:flex;align-items:center;gap:8px;width:max-content;margin:18px auto 0;padding:4px;border:1px solid var(--y-line);border-radius:12px;background:var(--y-surface)}
body.yave .y-controls button{position:relative;display:inline-flex;align-items:center;justify-content:center;width:40px;height:32px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--y-ink-2);cursor:pointer}
body.yave .y-controls button::after{content:"";position:absolute;left:50%;top:50%;width:48px;height:48px;transform:translate(-50%,-50%)}
body.yave .y-controls button:hover{background:var(--y-surface-2);color:var(--y-ink)}
body.yave .y-controls button:disabled{opacity:.3;cursor:default}
body.yave .y-controls .y-pos{min-width:64px;text-align:center;color:var(--y-ink-2);font-family:var(--y-mono);font-size:12px;font-variant-numeric:tabular-nums}
body.yave .y-controls .y-pos b{color:var(--y-ink);font-weight:500}
body.yave .y-step.is-active .y-anim{animation:y-up .35s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s)}
body.yave .y-step.is-active .y-pop{animation:y-pop .35s cubic-bezier(.2,.7,.2,1) both;animation-delay:var(--d,0s)}
body.yave .y-table-wrap{width:100%;margin:0 0 12px;overflow-x:auto;scrollbar-width:thin}
body.yave figure{counter-increment:y-fig;margin:14px 0 0}
body.yave figure::before{content:"Fig. " counter(y-fig,decimal-leading-zero);display:block;margin-bottom:5px;color:var(--y-ink-3);font-family:var(--y-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase}
body.yave figure>svg{display:block;width:100%;height:auto;border:1px solid var(--y-line);border-radius:var(--y-r-s);background:var(--y-surface)}
body.yave figcaption{margin-top:6px;color:var(--y-ink-3);font-size:13px;line-height:1.5}
body.yave yave-geo{display:block;margin:12px 0}
body.yave figure>yave-geo{margin:0}
body.yave .yave-geo-frame{position:relative;border:1px solid var(--y-line);border-radius:var(--y-r-s);background:var(--y-surface);overflow:hidden}
body.yave .yave-geo-svg{display:block;width:100%;height:auto;touch-action:none;cursor:grab}
body.yave .yave-geo-svg.is-panning{cursor:grabbing}
body.yave .yave-geo-tools{position:absolute;top:6px;right:6px;display:flex;gap:12px}
body.yave .yave-geo-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:1px solid var(--y-line);border-radius:8px;background:var(--y-surface);color:var(--y-ink-2);cursor:pointer}
body.yave .yave-geo-btn::after{content:"";position:absolute;left:50%;top:50%;width:48px;height:48px;transform:translate(-50%,-50%)}
body.yave .yave-geo-btn:hover{background:var(--y-surface-2);color:var(--y-ink)}
body.yave .yave-geo-params{display:grid;gap:6px;margin-top:8px}
body.yave .yave-geo-param{display:grid;grid-template-columns:3.4em 1fr 3.2em;align-items:center;gap:8px;color:var(--y-ink-2);font-family:var(--y-mono);font-size:12px}
body.yave .yave-geo-param input[type=range]{width:100%;min-width:0;accent-color:var(--y-accent)}
body.yave .yave-geo-param output{text-align:right;color:var(--y-ink);font-variant-numeric:tabular-nums}
body.yave .yave-grid{stroke:var(--y-line);stroke-width:1;vector-effect:non-scaling-stroke}
body.yave .yave-axis{stroke:var(--y-ink-3);stroke-width:1;vector-effect:non-scaling-stroke}
body.yave .yave-tick{fill:var(--y-ink-3);font-size:10px;font-family:var(--y-mono);font-variant-numeric:tabular-nums}
body.yave .yave-curve{fill:none;stroke:var(--y-accent);stroke-width:2;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}
body.yave .yave-curve.is-ghost{stroke:var(--y-ink-3);stroke-width:1.5;stroke-dasharray:5 5;opacity:.8}
body.yave .yave-curve.is-dashed{stroke-dasharray:5 4}
body.yave .yave-dot{fill:var(--y-accent);stroke:var(--y-bg);stroke-width:1.5;vector-effect:non-scaling-stroke}
body.yave .yave-dot.is-ghost{fill:var(--y-ink-3)}
body.yave .yave-shape{fill:var(--y-accent-soft);stroke:var(--y-accent);stroke-width:1.8;vector-effect:non-scaling-stroke}
body.yave .yave-shape.is-open{fill:none}
body.yave .yave-shape.is-ghost{fill:var(--y-accent-soft);stroke:var(--y-ink-3);stroke-dasharray:5 5;opacity:.55}
body.yave .yave-line{stroke:var(--y-ink-2);stroke-width:1.5;vector-effect:non-scaling-stroke}
body.yave .yave-line.is-ghost{stroke:var(--y-ink-3);stroke-dasharray:4 4;opacity:.7}
body.yave .yave-arrowhead{fill:var(--y-ink-2);stroke:none}
body.yave .yave-arrowhead.is-ghost{fill:var(--y-ink-3)}
body.yave .yave-label{fill:var(--y-ink);font-size:12px;font-family:var(--y-sans)}
body.yave .yave-label.is-muted{fill:var(--y-ink-3)}
body.yave .yave-label-fo{pointer-events:none}
body.yave .yave-label-html{font:12px/1.25 var(--y-sans);color:var(--y-ink)}
body.yave .yave-err{fill:var(--y-err);font-size:10px;font-family:var(--y-mono)}
body.yave yave-er{display:block;margin:12px 0}
body.yave .yave-er-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
body.yave .yave-er-entity{padding:10px;border:1px solid var(--y-line);border-radius:var(--y-r-s);background:var(--y-surface)}
body.yave .yave-er-entity b{display:block;margin-bottom:4px;color:var(--y-accent);font-family:var(--y-mono);font-size:12px;font-weight:500}
body.yave .yave-er-field{display:flex;justify-content:space-between;gap:8px;padding:2px 0;border-top:1px solid var(--y-line);color:var(--y-ink-2);font-family:var(--y-mono);font-size:11px}
body.yave .yave-er-field:first-of-type{border-top:0}
body.yave .yave-er-rels{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
body.yave .yave-er-rel{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid var(--y-line);border-radius:999px;color:var(--y-ink-2);font-family:var(--y-mono);font-size:11px}
body.yave .yave-er-rel b{color:var(--y-accent);font-weight:500}
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
body.yave .y-mbf{font-weight:600}
body.yave .y-mbb{font-family:"STIX Two Math","Cambria Math",serif}
body.yave .y-mcal{font-family:"STIX Two Math","Cambria Math",serif;font-style:italic}
body.yave .y-vec{position:relative;display:inline-block;padding-top:.12em}
body.yave .y-vec::before{content:"→";position:absolute;left:50%;top:-.58em;transform:translateX(-50%) scaleX(.8);font-size:.9em;line-height:1}
body.yave .y-overline{border-top:1px solid currentColor;padding-top:.05em}
body.yave .y-hat{position:relative;display:inline-block}
body.yave .y-hat::before{content:"^";position:absolute;left:50%;top:-.62em;transform:translateX(-50%);font-size:.9em;line-height:1}
body.yave .y-dot-above{position:relative;display:inline-block}
body.yave .y-dot-above::before{content:".";position:absolute;left:50%;top:-.55em;transform:translateX(-50%);font-size:1em;line-height:1}
body.yave .y-ddot-above{position:relative;display:inline-block}
body.yave .y-ddot-above::before{content:"..";position:absolute;left:50%;top:-.55em;transform:translateX(-50%);font-size:.9em;line-height:1}
body.yave button:focus-visible,body.yave a:focus-visible,body.yave summary:focus-visible,body.yave input:focus-visible{outline:2px solid var(--y-accent);outline-offset:2px}
@keyframes y-step-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes y-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes y-pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
@media (max-width:520px){
  body.yave .y-page{padding:20px 16px 88px}
  body.yave h1{font-size:28px}
  body.yave .yave-er-grid{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  body.yave *,body.yave *::before,body.yave *::after{animation-duration:.01ms!important;animation-delay:0s!important;transition:none!important}
}
@media print{
  body.yave .y-step{display:block!important;padding-right:0}
  body.yave .y-step::after{display:none}
  body.yave .y-controls,body.yave .yave-geo-tools,body.yave .yave-geo-params{display:none}
}
`;
