# yave — yet another visual explainer

一个轻量的可视化解释 skill：模型只写语义 HTML，`yave.js` 在页面里注入基础 CSS、步进动画、可视化构件和几何绘图。

## 文件

- `SKILL.md` — skill 规则与组件速查（模型读这个）
- `yave.js` — 运行时，部署后通过公网 URL 引用
- `demo.html` — 本地示例，覆盖步进、几何、滑条、流程等组件
- `index.html` — Pages 根页

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/demo.html
```

也可以直接用浏览器打开 `demo.html`（经典脚本，无模块/跨域限制）。

## 部署

主发布方式是 GitHub Pages。仓库 `Xe0rF/yave` 的 `main` 分支根目录即发布内容：

```text
https://xe0rf.github.io/yave/yave.js
```

首次开启 Pages 后需要等待几分钟构建。验证：

```bash
curl -sI https://xe0rf.github.io/yave/yave.js | head
```

应看到 `content-type: application/javascript`。

## 页面接入

```html
<script src="https://xe0rf.github.io/yave/yave.js"></script>
```

运行时自动给 `<body>` 加 `yave` 类、注入样式、生成步进控制条，并把 `<yave-geo>` 渲染成 SVG。脚本未加载时页面仍是可读的语义 HTML。

## 开发约定

- `yave.js` 是经典脚本（非 ES module），IIFE 包裹，重复加载会被 `window.__yaveLoaded` 拦截。
- 几何表达式使用内置递归下降解析器，不调用 `eval` / `new Function`，可在严格 CSP 下工作。
- 改完运行 `node --check yave.js`，并用 `demo.html` 做一次 360px 宽截图检查。
