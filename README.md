# yave — yet another visual explainer

轻量的可视化解释 skill：模型只写语义 HTML，运行时在页面里注入深色排版、LaTeX、
函数/几何变换、参数滑条、连续动画和缩放/平移。源码用 Lit + Vite，最终只对外交付一个
经典脚本 `yave.js`，Agent 用一个 `<script src>` 直接引用。

## 文件

- `SKILL.md` — 规则文件与配方（模型读这个）
- `src/` — Lit 组件与运行时源码
- `site/` — 接入页与 demo，构建时原样复制到 `dist/`
- `scripts/gen-icons.mjs` — 从 `lucide-static` 生成精选图标
- `scripts/smoke.mjs` — 用系统 Chromium 跑 360px 交互冒烟测试
- `test/smoke.html` — 冒烟测试页面（不部署）
- `dist/` — 构建产物，不提交

## 本地开发

```bash
npm install
npm run build      # 生成图标 + 构建 dist/yave.js 与 site 页面
npm run preview    # 预览 dist/
npm run smoke      # 无头 Chromium 交互测试
```

`npm run dev` 会先生成图标，再启动 Vite。`src/icons.generated.js` 是生成文件，已加入
`.gitignore`。

## 构建产物

`dist/yave.js` 是单个经典 IIFE，包含 Lit、Lucide 图标、全部 CSS 和运行时；没有
`import` / `export`，也不需要模块加载。构建时注入当前 commit 短 SHA：

- banner：`/*! yave @ <short-sha> | Lucide icons ISC */`
- 运行时：`window.Yave.commit`

不维护版本号，也没有 `?v=` 查询参数。

## 部署

主发布方式是 GitHub Pages，由 `.github/workflows/pages.yml` 构建并部署 `dist/`：

```text
https://xe0rf.github.io/yave/yave.js
```

首次启用时，仓库 Pages 的 Source 需要设为 **GitHub Actions**（`build_type=workflow`）。
推送 `main` 或手动触发 workflow 后，部署结果在 Actions 的 `pages` environment 里查看。

验证：

```bash
curl -sI https://xe0rf.github.io/yave/yave.js | head
curl -s https://xe0rf.github.io/yave/yave.js | grep -o 'yave @ [0-9a-f]*' | head -1
```

应看到 `content-type: application/javascript` 与当前 commit 短 SHA。

## 页面接入

```html
<script src="https://xe0rf.github.io/yave/yave.js"></script>
```

运行时自动给 `<body>` 加 `yave` 类、注入深色 CSS、渲染 `<yave-geo>` / `<yave-er>` /
`<yave-icon>`，并初始化 tabs、sliders、表格滚动容器和步进控制条。脚本未加载时页面仍是
可读的语义 HTML。

## 页面示例

```html
<main class="y-page">
  <header class="y-hero">
    <p class="y-kicker">yave / demo</p>
    <h1>让变换自己发生</h1>
    <p class="y-lede">父函数、参数和变换后的图形同时在场。</p>
  </header>

  <section>
    <h2>函数变换</h2>
    <figure>
      <yave-geo x="-6,6" y="-4,8"
                a="0.5..2" a-value="1"
                h="-2..2" h-value="0"
                k="-2..4" k-value="0"
                animate="a:1..2; h:0..2; k:0..3">
        <yave-curve base="x^2" expr="a*f(b*(x-h))+k" from="-2.8" to="2.8"></yave-curve>
      </yave-geo>
      <figcaption>父函数是 ghost；参数由一条时间线推进。</figcaption>
    </figure>
  </section>
</main>
<script src="https://xe0rf.github.io/yave/yave.js"></script>
```

完整示例见 `site/demo.html` / 线上 `demo.html`。

## 开发约定

- 运行时是经典脚本，IIFE 包裹；重复加载由 `window.__yaveLoaded` 拦截，自定义元素注册是幂等的。
- 几何表达式使用内置递归下降解析器，不调用 `eval` / `new Function`。
- `<yave-geo>` 的 Lit 模板只负责外框、工具栏和参数行；SVG 内容由 `src/lib/geo-render.js` 渲染，便于处理 `foreignObject` 与高频动态点。
- `<yave-er>` 解析三行 DSL，渲染实体卡与关系胶囊，不做自动布线。
- 图标来自 [Lucide](https://lucide.dev/)（ISC），由 `scripts/gen-icons.mjs` 生成。
- 主题是深色-only；不要加渐变、装饰阴影或第二套浅色主题。
- 改完运行 `npm run build && npm run smoke`，并用 Chromium 做 360px/桌面截图检查。
