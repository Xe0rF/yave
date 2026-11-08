---
name: yave
description: >-
  把概念、流程、架构、对比、数学或几何解释成可交互的单页 HTML 可视化（yet another visual explainer）。
  当用户说“解释/讲讲原理/看不懂/画个图/可视化/演示一下”，或问题涉及多步流程、状态转换、
  前后对比、函数图像、坐标系、三角形/多边形时使用。输出一段 HTML 代码块。
---

# yave — yet another visual explainer

把解释做成**移动端竖屏优先**的单页 HTML。页面通过一个外链脚本获得基础 CSS、步进动画、可视化构件和几何绘图；你只写语义标记，不手写 CSS/JS。

## 输出

- 只输出一个 `html` 代码块，内容是完整文档。不写文件、不调用工具。
- 代码块前最多一句结论；代码块后最多一句“哪一帧可以继续问”。
- 页面语言跟随用户。简单符号用 Unicode（`x²`、`√`、`π`、`≈`、`≤`）；分数、根式、上下标、复杂公式用 LaTeX `$...$`，例如 `$\frac{2}{3}$`，不要写成 `2/3`。
- 除下面这一行外，页面里不要出现 `<style>` 或 `<script>`：

```html
<script src="https://xe0rf.github.io/yave/yave.js"></script>
```

## 页面骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>标题</title>
</head>
<body>
  <main class="y-page">
    <header class="y-hero">
      <div class="y-kicker">一句背景</div>
      <h1>一句话结论</h1>
      <p class="y-lede">补充一句为什么。</p>
    </header>
    <!-- 3–8 个区块 -->
  </main>
  <script src="https://yave.xe0rf.com/yave.js"></script>
</body>
</html>
```

## 构件

| 目的 | 标记 |
|---|---|
| 卡片 | `<section class="y-card">`；子元素放进 `.y-stack` 自动留白 |
| 结论/警告 | `<div class="y-callout">`；变体 `.is-ok` `.is-warn` `.is-err` |
| 键值 | `<dl class="y-kv"><dt>键</dt><dd>值</dd></dl>` |
| 两列 | `<div class="y-grid">…</div>` |
| 流程 | `<div class="y-flow"><span class="y-node">A</span><span class="y-arrow">→</span><span class="y-node">B</span></div>`；加 `.is-v` 垂直 |
| 时间轴 | `<div class="y-timeline"><div>…</div><div>…</div></div>` |
| 对照条 | `<div class="y-bars"><div class="y-bar" style="--v:.72"><span>A</span><i></i><b>72</b></div></div>` |
| 数字 | `<div class="y-stats"><div class="y-stat"><b>3</b><span>步</span></div></div>` |
| 滑条 | `<label class="y-slider"><span>a = <output>2</output></span><input type="range" min="0" max="10" step="0.1" value="2"></label>` |
| 徽标 | `<span class="y-badge">…</span>` |
| 表格/代码 | 原生 `<table>` / `<pre><code>` |

滑条加 `data-yave-var="--a"` 会把当前值写到最近的 `[data-yave-scope]`（默认 `body`）的 CSS 变量上。
`.y-node.is-hot` 高亮当前节点；`.y-callout`、`.y-card` 内最后一个子元素的底部留白会自动收掉。

## 动画

```html
<div class="y-steps">
  <section class="y-step">
    <h2>第 1 帧标题</h2>
    …
  </section>
  <section class="y-step">…</section>
</div>
```

- 运行时自动生成最小控制条（`‹ 2 / 3 ›`）、键盘 ←/→、右上角帧编号。**不要自己写按钮。**
- 帧内元素加 `.y-anim`（上浮淡入）或 `.y-pop`，用 `style="--d:.1s"` 错开。
- 一个 `.y-steps` 只放一条动画流程；多条流程用多个 `.y-steps`。
- 帧编号在对话里可直接指代：“第 2 帧”。
- **跨帧连贯**：需要从上一帧平滑移动到下一帧的元素，在两帧里写相同的 `data-yave-key`；运行时会记录旧位置并做 FLIP 补间。元素用 `left` / `top` / `margin` 定位，不要用 `transform`。
- `.y-canvas` 是相对定位画布（高 180px），`.y-dot` 是居中定位的圆点，适合做位移演示：

```html
<div class="y-steps">
  <section class="y-step">
    <div class="y-canvas"><span class="y-dot" data-yave-key="p" style="left:15%;top:50%">P</span></div>
  </section>
  <section class="y-step">
    <div class="y-canvas"><span class="y-dot" data-yave-key="p" style="left:85%;top:50%">P</span></div>
  </section>
</div>
```

- 几何图内部是即时重绘的；`data-yave-key` 只让整图移动，不做曲线形变插值。

## 几何

```html
<yave-geo x="-5,5" y="-4,4" grid="1" height="250">
  <yave-curve expr="x^2 - 2" from="-2.5" to="2.5" label="y = x² − 2"></yave-curve>
  <yave-point x="1" y="-1" label="A(1, −1)"></yave-point>
  <yave-polygon points="0,0 3,0 1,2" labels="O,B,A"></yave-polygon>
</yave-geo>
```

- `yave-geo`：`x` / `y` 是显示范围 `min,max`；`grid` 网格步长（`0` 关闭）；`height` 像素高度。
- `yave-curve`：`expr` 表达式、`from` / `to`、`label`、`dashed`。
- `yave-point`：`x` `y` `label`。
- `yave-segment`：`x1 y1 x2 y2` 或 `from="x,y" to="x,y"`，可选 `label`。
- `yave-polygon`：`points="x,y x,y …"`、`labels="A,B,C"`；`open` 只画折线不填充。
- `yave-circle`：`x` `y` `r`。
- `yave-vector`：`x` `y` 终点，可选 `ox` `oy` 起点（默认原点）。
- `yave-label`：`x` `y`，元素文本即标签。
- 表达式：`+ - * / ^`、括号、`x`、`pi`/`π`、`e`，以及 `sin cos tan asin acos atan sqrt abs ln log log2 log10 exp floor ceil round min max pow`；隐式乘法 `2x` 可用。
- 坐标等比缩放：圆不会变形，角度真实。几何图放在 `.y-card` 里更稳。

## 数学

- 行内 `$...$`，块级 `$$...$$`；运行时内置渲染，不加载外部库。
- 支持 `\frac` / `\dfrac` / `\sqrt[n]{}`、`^` / `_`、希腊字母，以及 `\times \cdot \pm \le \ge \ne \approx \infty \to \sum \prod \int` 等常用命令。
- 分数不要写成 `2/3`：写 `$\frac{2}{3}$`。
- 几何的 `expr` 是代码表达式（`x^2/4`），不走 LaTeX；图上的 `label` 用 Unicode 或纯文本。

## 教学规则

- 移动端竖屏优先；`y-page` 已是窄列，不要做桌面双栏。
- 尽可能用布局、动画、图标、滑条代替大段文字。
- 动画只提供最小控制器；关键帧要有数字编号。
- 用多个有代表性的例子覆盖边界条件。
- 与教学无关的东西保持小、少、安静。
- 简单符号用 Unicode；分数、根式、上下标用 LaTeX `$...$`，不要用斜杠写分数。
- 默认环境支持 Markdown 和代码块内的现代 HTML 渲染。
- 示例数值要算过；算法或数值结果用工具验证，不要凭空编数据。
- 开工前有歧义就问；问题明确就直接做。

## 自检

- 只有一个 `yave.js` 外链，没有手写 `<style>` / `<script>`。
- 360px 宽下不横向滚动。
- 每一步都能用按钮和 ←/→ 走完；首尾帧按钮正确禁用。
- 几何表达式没有拼写错误（图上不应出现 `⚠`）。
- 页面内若有代码示例，外层代码块用四个反引号围栏。
