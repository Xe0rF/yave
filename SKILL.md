---
name: yave
description: >-
  把概念、流程、架构、对比、数学或几何解释成可交互的单页 HTML 可视化（yet another visual explainer）。
  当用户说“解释/讲讲原理/看不懂/画个图/可视化/演示一下”，或问题涉及多步流程、状态转换、
  前后对比、函数图像、坐标系、参数动画、三角形/多边形、ER 关系时使用。输出一段 HTML 代码块。
---

# yave — yet another visual explainer

把解释做成 **深色、移动端优先的夜间讲义页**。运行时提供排版、LaTeX、函数/几何变换、
参数滑条、连续动画、缩放/平移；你只写语义 HTML 和少量自定义元素，不写 CSS/JS/按钮。

## 输出

- 只输出一个 `html` 代码块，完整文档；不写文件、不调用工具。
- 代码块前最多一句结论；代码块后最多一句“哪一帧/哪张图可以继续问”。
- 唯一外链（不加版本号/query）：

```html
<script src="https://xe0rf.github.io/yave/yave.js"></script>
```

- 页面里不要出现 `<style>` 或 `<script>`（上面这一行除外）。
- 主题固定为深色；不要写内联颜色、背景、渐变、阴影。运行时负责 token。
- 页面骨架：

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
      <p class="y-kicker">一句背景</p>
      <h1>一句话结论</h1>
      <p class="y-lede">补充一句为什么。</p>
    </header>
    <section>...</section>
    <section>...</section>
  </main>
  <script src="https://xe0rf.github.io/yave/yave.js"></script>
</body>
</html>
```

- 3–6 个 `section`；每节只讲一个变量/结论；hero 最多三行。
- 几何图放进 `<figure>`，运行时自动编号 `Fig. 01`。

## 数学：强制 LaTeX

- **所有数学记号一律 `$...$` / `$$...$$`**，包括单变量、上下标、分数、根式、希腊字母、比较符、坐标。
- 反例：`x²`、`2/3`、`√2`、`π≈3.14`、`F(0,1)`。
- 正例：`$x^2$`、`$\frac{2}{3}$`、`$\sqrt{2}$`、`$\pi\approx3.14$`、`$F(0,1)$`、`$\vec{AB}$`。
- Unicode 只用于非数学 UI（流程箭头 `→`、项目符号）；图标用 `<yave-icon>`。
- 支持 `\frac \sqrt[n]{} \vec \overline \hat \sum \int \pi \le \ge \ne \approx \to \infty \text \mathbf \mathbb` 等。
- 不写长篇推导；只保留一个关键公式，推导放 `<details>` 默认折叠。
- 几何的 `label` 也写 `$...$`；`expr` 是代码表达式，不走 LaTeX。

## 配方（直接抄）

### 1. 连续动画 / 点沿曲线

```html
<figure>
  <yave-geo x="-2,2" y="-1,4" animate="t:0..2" duration="6">
    <yave-curve expr="x^2" from="-2" to="2"></yave-curve>
    <yave-point x="t" y="t^2" label="$P$"></yave-point>
  </yave-geo>
  <figcaption>点 P 沿曲线连续移动。</figcaption>
</figure>
```

- `animate="t:0..2"`：默认循环；`paused` 初始暂停；`once` 只播一次。
- 工具栏自动出现播放/暂停 + 缩放/重置；不要写按钮。
- 一个 section 最多一个自动动画。

### 2. 函数变换

```html
<yave-geo x="-6,6" y="-4,8"
          a="0.5..2" a-value="1"
          h="-2..2" h-value="0"
          k="-2..4" k-value="0"
          animate="a:1..2; h:0..2; k:0..3" duration="8">
  <yave-curve base="x^2" expr="a*f(b*(x-h))+k" from="-2.8" to="2.8"></yave-curve>
  <yave-label x="-5.5" y="7">$y=x^2$</yave-label>
  <yave-label x="-5.5" y="5">$y=a f(b(x-h))+k$</yave-label>
</yave-geo>
```

- `base` 编译父函数；`expr` 里用 `f(x)`；自动画 ghost 父曲线（`no-ghost` 可关）。
- `a/b/h/k` 是内置参数；`a="0.5..2"` 自动生成滑条，`a-value` 设初值；单值 `a="2"` 是常量。
- `animate="a:1..2; h:0..2"` 一条时间线同时插值；播放时滑条跟着动，拖动滑条会暂停。
- 未声明的参数默认：`a=b=1`，`h=k=tx=ty=theta=0`，`s=1`。

### 3. 图形变换

```html
<yave-geo x="-4,6" y="-1,5" height="300" equal
          theta="0..360" theta-value="0"
          s="0.5..2" s-value="1"
          tx="-2..2" tx-value="0"
          ty="-2..2" ty-value="0"
          animate="theta:0..90; s:1..1.5; tx:0..2" duration="8">
  <yave-polygon points="0,0 3,0 1,2" labels="O,B,A" ghost></yave-polygon>
  <yave-group transform="translate(tx,ty) rotate(theta) scale(s)" origin="0,0">
    <yave-polygon points="0,0 3,0 1,2" labels="O',B',A'"></yave-polygon>
  </yave-group>
</yave-geo>
```

- `equal`：保持等比（圆不变形、角度真实）；`yave-group` / `yave-circle` 会自动触发。纯多边形/角度图也要加。
- 原图 `ghost`；变换后的图放 `yave-group`。`origin="x,y"` 指定旋转/缩放中心。
- 变换顺序固定：`translate(tx,ty)` → 平移到 origin → rotate → scale → 平移回 -origin。
- 反射用 `scale(-1,1)` / `scale(1,-1)`。
- 标签随 group 旋转；需要水平标签就把 `yave-label` 放 group 外。

### 4. 参数探索

```html
<yave-geo x="-3,3" y="-1,9" a="0.2..2" a-value="1">
  <yave-curve expr="a*x^2"></yave-curve>
</yave-geo>
```

- 范围属性自动生成滑条；单值是常量。表达式可用 `a`、`b`、`h`、`k`、`s`、`theta`、`tx`、`ty`、`t`。

### 5. 参数曲线

```html
<yave-geo x="-4,4" y="-2,2" equal animate="t:0..6.283">
  <yave-curve x-expr="cos(t)" y-expr="sin(t)" from="0" to="6.283"></yave-curve>
  <yave-point x="cos(t)" y="sin(t)" label="$P$"></yave-point>
</yave-geo>
```

### 6. 前后对比 / tabs

```html
<div class="y-tabs">
  <button class="y-tab" type="button">变换前</button>
  <button class="y-tab" type="button">变换后</button>
  <div class="y-panel">...</div>
  <div class="y-panel">...</div>
</div>
```

- 运行时补 tablist/role/键盘；不要自己写 aria 或按钮样式。

### 7. 流程 / 层级 / ER

```html
<div class="y-flow">
  <span class="y-node">取参数</span><span class="y-arrow">→</span>
  <span class="y-node is-hot">重绘</span><span class="y-arrow">→</span>
  <span class="y-node">读结果</span>
</div>

<ul class="y-tree">
  <li>坐标系<ul><li>函数曲线</li><li>参数曲线</li></ul></li>
</ul>

<yave-er>
User: id, name, email
Order: id, user_id, total
User -> Order: 1:N
</yave-er>
```

- ER 用实体卡 + 关系胶囊，不做自动布线；复杂流程用 `.y-flow`，层级用 `.y-tree`。
- 表格用原生 `<table>`；运行时自动包横向滚动容器；只用行分隔线，无外框。

### 8. 图标

```html
<yave-icon name="lightbulb" size="16" label="提示"></yave-icon>
```

可用：`lightbulb zap target route layers network cpu database server cloud code-2 terminal git-branch workflow box circle triangle square sigma chart-line chart-bar gauge clock calendar arrow-right arrow-down arrow-up check x alert-triangle info circle-help play pause rotate-ccw zoom-in zoom-out plus minus settings-2 sliders-horizontal move eye search filter list table book-open graduation-cap maximize-2 chevron-left chevron-right chevron-down`。

不包装饰容器；默认 16px；未知名称回退 `circle-help`。

## 几何 API

```html
<yave-geo x="-5,5" y="-4,4" grid="1" height="240" equal
          a="0.5..2" a-value="1" animate="a:1..2" duration="6" zoom="1.2">
  <yave-curve expr="a*x^2" from="-2" to="2" label="$y=a x^2$"></yave-curve>
  <yave-point x="1" y="a" label="$A$"></yave-point>
  <yave-segment from="0,0" to="1,a" label="$OA$"></yave-segment>
  <yave-polygon points="0,0 3,0 1,2" labels="O,B,A"></yave-polygon>
  <yave-circle x="0" y="0" r="1" label="$r=1$"></yave-circle>
  <yave-vector x="2" y="1" label="$\vec{v}$"></yave-vector>
  <yave-label x="-4" y="3">$y=f(x)$</yave-label>
  <yave-group transform="rotate(theta)" origin="0,0">...</yave-group>
</yave-geo>
```

| 元素 | 属性 |
|---|---|
| `yave-geo` | `x`/`y` 范围、`grid`、`height`、`equal`/`stretch`、`zoom`、`nozoom`、`label`；参数 `a b h k s theta tx ty` |
| `yave-curve` | `expr`、`base`、`from`/`to`、`label`、`base-label`、`dashed`、`ghost`、`no-ghost`、`width`；参数曲线 `x-expr`/`y-expr` |
| `yave-point` | `x` `y` `r` `label` |
| `yave-segment` | `from="x,y"` `to="x,y"` 或 `x1 y1 x2 y2`，`label` |
| `yave-polygon` | `points`、`labels`、`open`、`ghost` |
| `yave-circle` | `x` `y` `r` `label` |
| `yave-vector` | `x` `y`、`ox`/`oy`、`label` |
| `yave-label` | `x` `y` `anchor`，文本可含 `$...$` |
| `yave-group` | `transform="translate(tx,ty) rotate(theta) scale(s)"`、`origin`、`ghost` |

- 表达式：`+ - * / ^`、括号、`x`、`t`、参数、`pi`/`π`、`e`，以及 `sin cos tan asin acos atan sqrt abs ln log log2 log10 exp floor ceil round min max pow`；隐式乘法 `2x` 可用。
- 缩放：滚轮/双指缩放，拖动平移，双击或工具栏重置；`nozoom` 关闭。
- `equal` 保持等比；函数图默认填满画框，几何图建议加；`stretch` 强制非等比（少用）。

## 非数学内容

- 默认用原生 HTML / Markdown 等价结构：标题、段落、列表、表格、`blockquote`、`pre/code`、`dl`、`details`、`figure/figcaption`。
- 不要给每段套卡片；`section` 之间自动有 1px 顶线。
- 关键结论/警告用 `.y-callout`（变体 `.is-ok` `.is-warn` `.is-err`）。
- 两列用 `.y-grid`；流程用 `.y-flow`；层级用 `.y-tree`；前后用 `.y-tabs`。
- 非几何参数用 `.y-slider` + `data-yave-var`（只改 CSS 变量）。
- 长推导放 `<details>`；表格让运行时自动包滚动容器。
- 不引入 Mermaid/通用图引擎；不要让模型手写 SVG 连线。
- 只有状态必须离散时才用 `.y-steps`；几何动画优先用 `yave-geo animate`。

## 教学与紧凑

- 先给一个会动的图，再给一句话解释；不要先写三段背景。
- 每个 section 一个变量/结论；3–6 节；hero 最多三行。
- 公式是标注，不是主体；只写一个关键公式，其余折叠。
- 每个 section 最多一个自动动画；整页尽量不超过 3 个，其余图用参数滑条或静态。
- 数值例子要算过；不要编数据。
- 与教学无关的东西保持小、少、安静。

## 自检

- 只有一个 `yave.js` 外链；没有手写 `<style>` / `<script>`；没有版本 query。
- 所有数学都是 LaTeX；没有 `x²` / `2/3` / `√2`。
- 没有渐变、装饰阴影、内联颜色；深色 token 未被破坏。
- 360px 宽不横向滚动；表格在容器内滚动。
- 几何图没有 `⚠`；滑条/动画/缩放可用；`yave-label` 的 `$...$` 能渲染。
- 用 `.y-steps` 时按钮和 ←/→ 能走完，首尾禁用；tabs 键盘可切换。
- 页面有 3–6 个 section；没有大段文字墙。
