# 走进数学分析：从微积分到实变函数

## 一、极限：分析的基石

极限（limit）是整个数学分析的奠基概念。简单来说，当 $x$ 无限趋近于 $a$ 时，$f(x)$ 无限趋近于 $L$，记作：

$$
\lim_{x \to a} f(x) = L
$$

更加严格的 $\varepsilon$—$\delta$ 语言定义如下：

> 对任意 $\varepsilon > 0$，存在 $\delta > 0$，使得当 $0 < |x - a| < \delta$ 时，有 $|f(x) - L| < \varepsilon$。

例如，一个经典极限：

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

---

## 二、导数与微分

导数的定义就是变化率的极限：

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

### 基本求导公式

| 函数        | 导数                     |
| ----------- | ------------------------ |
| $x^n$       | $n x^{n-1}$              |
| $\sin x$    | $\cos x$                 |
| $\cos x$    | $-\sin x$                |
| $e^x$       | $e^x$                    |
| $\ln x$     | $\frac{1}{x}$            |
| $\tan x$    | $\sec^2 x$               |
| $\arcsin x$ | $\frac{1}{\sqrt{1-x^2}}$ |

### 莱布尼茨法则（高阶导数）

对于两个函数的乘积，其 $n$ 阶导数为：

$$
(fg)^{(n)} = \sum_{k=0}^{n} \binom{n}{k} f^{(k)} g^{(n-k)}
$$

形式上和二项式定理完全一致，这并非巧合——两者都源于组合结构。

---

## 三、积分学

### 不定积分

$$
\int x^n \, dx = \frac{x^{n+1}}{n+1} + C, \quad n \neq -1
$$

$$
\int \frac{1}{x} \, dx = \ln|x| + C
$$

$$
\int e^x \, dx = e^x + C
$$

### 定积分与微积分基本定理

微积分基本定理（FTC）将微分和积分联系了起来：

$$
\frac{d}{dx} \left( \int_{a}^{x} f(t) \, dt \right) = f(x)
$$

以及：

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a), \quad \text{其中 } F' = f
$$

### 经典定积分

$$
\int_{0}^{\pi} \sin x \, dx = 2
$$

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$

$$
\int_{0}^{1} \frac{dx}{1 + x^2} = \frac{\pi}{4}
$$

---

## 四、级数

### 泰勒级数

对于一个光滑函数 $f$，其泰勒展开为：

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!} (x - a)^n
$$

常见展开：

$$
e^x = \sum_{n=0}^{\infty} \frac{x^n}{n!} = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots
$$

$$
\sin x = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} x^{2n+1} = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots
$$

$$
\cos x = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n)!} x^{2n} = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots
$$

### 调和级数

$$
\sum_{n=1}^{\infty} \frac{1}{n} = \infty
$$

调和级数发散，但 $p$-级数在 $p > 1$ 时收敛：

$$
\sum_{n=1}^{\infty} \frac{1}{n^p} < \infty \iff p > 1
$$

### 欧拉恒等式

$$
e^{i\pi} + 1 = 0
$$

这个等式将 $e$、$i$、$\pi$、$1$ 和 $0$ 五个最重要的数学常数联系在了一起，被誉为"最美丽的数学公式"。

---

## 五、多变量微积分

### 偏导数

对于 $z = f(x, y)$，偏导数定义为：

$$
\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x, y)}{h}
$$

### 梯度

梯度指向函数增长最快的方向：

$$
\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)
$$

### 拉普拉斯算子

$$
\nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2} + \frac{\partial^2 f}{\partial z^2}
$$

拉普拉斯方程 $\nabla^2 f = 0$ 在物理中无处不在——引力场、静电场、热传导、流体力学……

### 重积分

二重积分计算区域 $D$ 上的体积：

$$
\iint_{D} f(x, y) \, dA
$$

例如，单位圆盘上的积分：

$$
\iint_{x^2 + y^2 \leq 1} e^{-(x^2 + y^2)} \, dA = \pi \left(1 - \frac{1}{e}\right)
$$

### 格林定理

$$
\oint_{C} (P \, dx + Q \, dy) = \iint_{D} \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA
$$

它将曲线积分与二重积分联系了起来，是斯托克斯定理的二维特例。

---

## 六、实变函数初步

### 勒贝格积分

勒贝格积分是黎曼积分的推广。黎曼积分分割的是定义域，而勒贝格积分分割的是值域：

$$
\int f \, d\mu = \lim_{n \to \infty} \sum_{k=1}^{n2^n} \frac{k}{2^n} \, \mu\!\left( \left\{ x \mid \frac{k}{2^n} \leq f(x) < \frac{k+1}{2^n} \right\} \right)
$$

### 控制收敛定理

设 $\{f_n\}$ 是可测函数列，且 $f_n \to f$ 几乎处处收敛。若存在可积函数 $g$ 使得 $|f_n| \leq g$ 几乎处处成立，则：

$$
\lim_{n \to \infty} \int f_n \, d\mu = \int f \, d\mu
$$

> 这是实变函数中最重要的定理之一，它告诉你什么条件下极限可以和积分交换顺序。

---

## 七、有趣的事实

- **$\pi$ 是无理数**：1761 年由 Lambert 证明。
- **$e$ 是超越数**：1873 年由 Hermite 证明——它不满足任何整系数多项式方程。
- **$\pi$ 也是超越数**：1882 年由 Lindemann 证明，顺带解决了"化圆为方"这一古老问题。
- **素数定理**：不大于 $x$ 的素数个数 $\pi(x) \sim \dfrac{x}{\ln x}$。

---

_数学是人类智慧的皇冠，愿你享受探索的乐趣。_

## 十六、项目当前使用的扩展（skyblog）

项目通过 `ExtensionKit` 统一组织所有扩展（`packages/rich-text-editor/src/extensions/index.ts`），每个扩展均可通过选项关闭：

### 自定义扩展

| 扩展             | 说明                                                 |
| ---------------- | ---------------------------------------------------- |
| `CodeBlockShiki` | 自定义代码块，基于 Shiki 语法高亮，支持亮暗主题切换  |
| `ImageExtended`  | 扩展自 `@tiptap/extension-image`，支持调整大小和对齐 |
| `InsertLine`     | 在空行插入并保持缩进层级                             |
| `PasteMarkdown`  | 粘贴时自动检测并转换 Markdown 为富文本               |

### 官方扩展

| 扩展                        | 说明                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `StarterKit`                | 基础必备（**禁用了 codeBlock**，由 `CodeBlockShiki` 替代）         |
| `Emoji`                     | 表情选择（启用了 emoticon 转换）                                   |
| `Highlight`                 | 荧光笔高亮（multicolor 模式）                                      |
| `Markdown`                  | Markdown 导入导出（tab 缩进，GFM 模式）                            |
| `Placeholder`               | 占位符                                                             |
| `Subscript` / `Superscript` | 下标/上标                                                          |
| `TableKit`                  | 表格套件（Table + TableRow + TableCell + TableHeader，可调整列宽） |
| `TaskList` / `TaskItem`     | 任务列表（支持嵌套）                                               |
| `TextAlign`                 | 文本对齐（支持 heading、paragraph、image）                         |
| `TextStyleKit`              | 文本样式扩展集                                                     |
| `Typography`                | 排版替换（`--` → `—`、`""` → `""` 等）                             |

具体各扩展的默认配置见 `packages/rich-text-editor/src/extensions/index.ts`。
