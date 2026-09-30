# YZK 的个人站

个人主页 —— 学习笔记、项目记录与资料归档都放在这里，日常更新以本站为准。
站外只留 GitHub 与邮箱两个入口。

线上地址：<https://yzk258.github.io/>

## 技术栈

- [Astro](https://astro.build/) 7，纯静态输出，默认零客户端框架运行时
- [Tailwind CSS](https://tailwindcss.com/) 4（通过 `@tailwindcss/vite`）
- TypeScript（`astro/tsconfigs/strict`）
- 字体 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)（自托管，`@fontsource-variable`）
- 文章：`@astrojs/mdx` + Shiki 代码高亮 + `remark-toc` / `rehype-callouts`
- 评论：[giscus](https://giscus.app/)，评论存在仓库的 GitHub Discussions 里
- 头像与 GitHub 活跃度：头像本地化，活跃度在构建时抓取官方贡献页并渲染成静态 HTML
- 站内搜索：[pagefind](https://pagefind.app/)，构建后生成索引（`postbuild` 钩子）

主题基于 [AstroPaper](https://github.com/satnaing/astro-paper) v6 改造。
沿用的是它的**布局骨架与机制**（主题切换、配置解析层、i18n 结构、路由组织）；
**配色令牌与绝大多数界面是自己重写的** —— README 早期版本写成「沿用其设计令牌」
不准确，只有令牌的命名结构留下来，取值全部换成了 Catppuccin。

上游自带的标签、归档、站内搜索已按需接回（见下），
归档与搜索受 `features.showArchives` / `features.search` 控制。
未接回的是动态 OG 图（satori 渲染）、编辑链接与分享链接 —— 理由见文末。

配色取自 [Catppuccin](https://catppuccin.com/)：
浅色用 Latte，深色用 Mocha，两套同族，切换时观感一致。

## 目录结构

```
astro-paper.config.ts    站点配置（标题、描述、座右铭、社交链接、功能开关）
astro.config.ts          构建配置（集成、Markdown 流水线、代码高亮）
src/
├── config.ts            配置解析层：给 astro-paper.config.ts 补默认值
├── content.config.ts    文章集合的 schema（frontmatter 校验）
├── content/posts/       ← 文章写在这里
├── data/hubs.ts         首页「站外入口」的卡片列表（GitHub、邮箱）
├── components/
│   ├── ApiCards.astro   三个第三方接口小卡片
│   ├── Activity.astro   GitHub 活跃度（按月表格 + 逐日热力图）
│   ├── Avatar.astro     头像框
│   ├── Card.astro       文章列表项
│   ├── ContributionHeatmap.astro  GitHub 逐日热力图（首页与关于页共用）
│   ├── Comments.astro   giscus 评论区（评论存在 GitHub Discussions）
│   ├── Datetime.astro   日期显示（按站点时区格式化）
│   ├── Header.astro     页头与导航
│   ├── Footer.astro     页脚
│   ├── Socials.astro    社交图标（由 socials 配置驱动）
│   ├── Breadcrumb.astro 面包屑
│   ├── Main.astro       内容页容器（也是搜索索引的正文边界）
│   ├── Tag.astro        标签链接
│   ├── Pagination.astro 分页导航
│   ├── TableOfContents.astro 文章页右侧大纲目录（≥1280px 显示）
│   └── LinkButton.astro 链接按钮（禁用时渲染成 span）
├── layouts/
│   ├── Layout.astro     全局 HTML 骨架、meta、主题初始化
│   └── PostLayout.astro 文章页附加的 meta 与 JSON-LD
├── i18n/                界面文案（仅中文）
├── pages/
│   ├── index.astro      /            首页（hero + 站内导航 + 最新文章 + 站外入口）
│   ├── posts/[...page].astro        文章列表（分页，页大小 = posts.perPage）
│   ├── posts/[...slug]/             文章详情
│   ├── tags/index.astro             标签总览
│   ├── tags/[tag]/[...page].astro   单个标签下的文章（分页）
│   ├── archives/index.astro         归档（按年 → 月）
│   ├── search.astro                 站内搜索（pagefind UI）
│   ├── about.astro                  关于我
│   ├── rss.xml.ts                   订阅源
│   └── robots.txt.ts
├── scripts/
│   ├── theme.ts         深浅色切换
│   └── post.ts          文章页交互（复制、目录锚点、图片放大、进度条）
├── styles/
│   ├── theme.css        设计令牌（颜色、字体）← 改配色看这里
│   ├── typography.css   文章正文排版
│   └── global.css       Tailwind 入口与基础样式
├── types/config.ts      配置的类型定义
└── utils/
    ├── posts.ts         文章过滤与排序
    ├── tags.ts          标签汇总与匹配
    ├── slug.ts          文件名 → URL
    ├── date.ts          日期格式化（按站点时区）
    ├── readingTime.ts   中文友好的阅读时长估算
    └── transformers/    Shiki 代码块文件名标签插件
public/
├── favicon.svg
├── default-og.jpg       分享卡片默认图
└── giscus/
    ├── theme-latte.css  giscus 评论区主题（浅色）
    └── theme-mocha.css  giscus 评论区主题（深色）
```

## 写文章

在 `src/content/posts/` 下新建 `.md`（或 `.mdx`）文件即可，
文件名就是 URL —— `hello-world.md` 对应 `/posts/hello-world/`。
这样改标题不会让链接失效，也避免中文标题被转写成乱码路径。

开头必须有 frontmatter：

```yaml
---
title: 文章标题
description: 一两句话的摘要，显示在列表页和订阅源里
pubDatetime: 2026-09-27T18:30:00+08:00   # 必须带时区
tags: ["标签一", "标签二"]
featured: false      # true 会置顶
draft: false         # true 则不参与构建
---
```

**时间一定要写时区。** 只写 `2026-09-27` 会被当成 UTC 零点，
在东八区显示出来就是前一天。带 `+08:00` 才准确 ——
构建服务器跑在 UTC，这个偏移是它换算本地时间的唯一依据。

正文支持的能力：

| 写法 | 效果 |
| --- | --- |
| `## 目录` | 自动替换成文章标题目录（可折叠） |
| ` ```ts title="文件名" ` | 代码高亮 + 文件名标签 |
| `` ```js `` 里 `// [!code highlight]` | 高亮该行 |
| `` ```js `` 里 `// [!code word:42]` | 高亮该词 |
| `> [!NOTE]` 等引用块 | 提示框（NOTE/TIP/IMPORTANT/WARNING/CAUTION） |
| 图片 | 点击放大，`Esc` 关闭 |
| `## 标题` / `### 标题` | 自动加锚点，可分享到具体小节 |

更细的示例见 `src/content/posts/writing-guide.md` 本身。

写完后 `npm run build` 会校验 frontmatter，格式不对会直接报错并指出问题。

## 公式与换行

数学公式由 `remark-math` + `rehype-katex` 渲染，样式来自 `katex/dist/katex.min.css`。
行内用 `$...$`，块级用 `$$...$$`。

**关键限制：KaTeX 不支持自动换行。** 这是它的官方设计决定，不是配置问题。
公式渲染成 `white-space: nowrap` 的一整块，浏览器不能从中间断开它。由此有两个后果：

1. **行内公式放不下时，整块跳到下一行**，于是上一行尾巴留下大片空白。
   实测过一篇公式密集的文章，单行行尾留白最大到 721px（正文列宽才 736px）。
2. **块级公式超宽时会把整页撑出横向滚动条**。`typography.css` 里已给
   `.katex-display` 加了 `overflow-x: auto` 兜底，把溢出收在公式自己身上，
   不再破坏整页宽度。但这只是兜底 —— 公式仍需要手动换行才读得清楚。

所以写公式时：

| 情况 | 做法 |
| --- | --- |
| 独立的长公式 | 一律用 `$$...$$`，不要留在句子中间 |
| 多行结构（`cases` / `array` / 长推导） | **必须**放块级，行内放不下 |
| 块级里需要换行 | 用 `aligned` + `\\`，`&` 标对齐点（放在等号前） |
| 行内的长公式 | 拆句，或把 `\text{中文}` 挪到正文里 |

```latex
$$
\begin{aligned}
\mathbb{R}_{ij}^{(m+1)}
&= \mathbb{R}_{ij}^{(m)} + X \\
&= \mathbb{R}_{ij}^{(m)} + Y
\end{aligned}
$$
```

`cases` 这种多行结构被塞进行内是问题最严重的写法：它又宽又高（实测一个
680px 宽、85px 高），必然把所在段落切得七零八落。

顺带两点：

- `\text{...}` 里的中文**不会**自动换行，长了同样会溢出
- `·` 不是隐形空格，它渲染成可见的中点 `⋅`（U+22C5）。
  想加空隙用 `\,`、`\;` 或 `\quad`

## 标签、归档、分页与搜索

| 功能 | 地址 | 说明 |
|---|---|---|
| 标签总览 | `/tags/` | 汇总全站标签，点进去看该标签下的文章 |
| 单个标签 | `/tags/<tag>/` | 标签 slug 由 `utils/slug.ts` 生成，**中文原样保留**，如 `/tags/建站/` |
| 归档 | `/archives/` | 按「年 → 月」倒序列出全部文章 |
| 分页 | `/posts/page/2/` … | 页大小取 `posts.perPage`，只有一页时不显示分页控件 |
| 搜索 | `/search/` | pagefind 索引，支持 `?q=关键词` 直接进入 |

标签来自文章 frontmatter 的 `tags` 字段。文章卡片上的标签可以直接点。

### 两个容易踩的点

**1. 搜索索引是构建后生成的，不在仓库里。**
`npm run build` 之后会自动跑 `postbuild` 钩子（`pagefind --site dist`）生成索引，
所以 `astro dev` 下搜索页显示的是「需要先完整构建」的提示，这是预期的。
只想看搜索结果，用 `npm run build && npm run preview`。

**2. 只有 `Main.astro` 与文章页的 `<main>` 内部会被索引。**
这两处带 `data-pagefind-body`，作用是让 pagefind 跳过每页都重复的导航与页脚 ——
否则搜任何词都会命中全部页面，结果里全是噪声。新增页面类型时记得套 `<Main>`。

搜索索引不包含中文词干提取（pagefind 不支持），但中文按字符切分可以正常搜到。

## 头像与 GitHub 活跃度

| 位置 | 内容 |
| --- | --- |
| `public/avatar.jpg` | 头像图片（460×460），用 `.tools/fetch-avatar.mjs` 重新拉取 |
| `src/components/Avatar.astro` | 头像框，`size="sm"` 用于首页，`size="lg"` 用于关于页 |
| `src/components/Activity.astro` | 汇总数字 + 按月表格，只在关于页 |
| `src/components/ContributionHeatmap.astro` | 逐日热力图，首页与关于页共用 |
| `src/utils/github-activity.ts` | 抓取与解析，见下 |

**头像**是本地文件而不是直接引用 GitHub 的地址，这样不依赖外站可用性。
想换头像就改 GitHub 上的头像，再跑一次 `.tools/fetch-avatar.mjs`。

**活跃度数据**在构建时抓取，渲染成静态 HTML（运行时零客户端 JS）。
来源是 GitHub 官方的贡献页 `https://github.com/users/Yzk258/contributions` ——
GitHub 没有公开的贡献数据 REST 接口，那个 GraphQL 需要 token，所以只能解析页面：

```html
<td data-date="2026-09-27" id="contribution-day-component-0-12" data-level="2">
<tool-tip for="contribution-day-component-0-12">14 contributions on …</tool-tip>
```

精确次数只在 `tool-tip` 文案里，`data-level` 只是 0-4 的色阶，两者用 id 关联。

这块是**唯一一处依赖第三方页面结构**的地方，所以：

- 解析出的天数少于 300 就认为结构变了，**整块不渲染**（不会显示错的数字，
  更不会让构建失败）；头像和其它内容不受影响
- 逐日数据缓存在 `node_modules/.cache/`（按日期失效，已被 gitignore），
  同一天内重复构建不重复打网络

**每日自动重建**：`.github/workflows/deploy.yml` 里有一条 `schedule`
（03:17 UTC），因为数据只在构建时抓取，不重建的话会停在上次部署那天。
想立即刷新就去 Actions 页面手动跑一次 workflow。

用户名集中在 `astro-paper.config.ts` 的 `site.github`（该字段是必填的），
头像链接、活跃度抓取、GitHub 入口都由它派生，改一处即可。
只有 `.tools/fetch-avatar.mjs` 里还留着一份，因为它是独立脚本、不读站点配置。

## 评论

文章页底部有评论区，用的是 [giscus](https://giscus.app/)：
评论存在本仓库的 **GitHub Discussions** 里，所以站点仍然是纯静态，
没有后端、没有数据库、没有费用。代价是评论者需要登录 GitHub 账号。

相关设置（要改的话都得动）：

| 位置 | 内容 |
| --- | --- |
| `src/components/Comments.astro` | 仓库名、repoId、category、categoryId |
| 仓库 Settings → Features | 必须开启 **Discussions** |
| GitHub 上的 giscus App | 必须授权给本仓库，否则读取评论会 403 |

**每篇文章对应一个 discussion**，标识（term）由页面路径算出：
`/posts/site-setup/` → `posts/site-setup`。
这个规则在 `Comments.astro` 顶部，**定下来后别轻易改** ——
改了 term 会让已有评论“找不到”（旧 discussion 还在，只是不再关联）。

注意这里没用 giscus 自带的 `pathname` 映射，而是用 `specific` 自己算：
`pathname` 映射在客户端里不会去掉结尾斜杠，`/posts/site-setup/`
会变成 `posts/site-setup/`，查询时差这一个字符就直接 404。
自己算还能让线上（`/posts/x/`）和本地预览（`/posts/x.html`）
落到同一个 discussion 上。

几个实现细节：

- **延迟加载**：评论区进入视口前 300px 才开始加载，读者不滚到底就不会
  为它付任何代价（可以用 `.tools/check-comments.mjs` 复核首屏请求数）
- **跟随主题**：主题由站点状态驱动，而不是 giscus 的 `preferred_color_scheme`
  （后者只认系统偏好，读者手动点过切换按钮后会不一致）
- 语言固定 `zh-CN`（必须通过 `data-lang` 传，见 `Comments.astro` 里的注释）
- iframe 的 `title` 覆盖成了中文，否则读屏会念英文 "Comments"

### 评论区外观

评论区的配色由 `public/giscus/theme-latte.css`（浅色）和
`public/giscus/theme-mocha.css`（深色）提供，通过 giscus 官方的
`data-theme` 机制加载 —— 它支持把内置主题名换成**一个 CSS 文件的地址**。

为什么不用现成的：

| 方案 | 问题 |
| --- | --- |
| 内置的 `light` / `dark` | 是 GitHub 原生配色：正文 `#1f2328`、面板 `#fff`、强调色蓝 `#0969da`，与本站的 Catppuccin 完全脱节 |
| 内置的 `catppuccin_latte` / `catppuccin_mocha` | 主色调对了，但「登录并评论」按钮是绿色（`#40a02b`）、字体写死 system-ui，且加载动画指向第三方 CDN（`giscus.catppuccin.com`） |

自己写的两份主题与 `src/styles/theme.css` 的令牌逐项对应，
主按钮用站点强调色（浅色紫 / 深色粉），加载动画换成纯 CSS。

两个实测得出的约束：

- **主题地址必须是绝对地址**。giscus 会把这个值放进 iframe 里的
  `<link href>`，而 iframe 的源是 `giscus.app`，相对的
  `/giscus/theme-latte.css` 会被解析成 `giscus.app/giscus/...` 从而 404。
  代码里用运行时的 `location.origin` 拼，而不是构建时的 `Astro.site`
  —— 后者会把地址写死成线上域名，本地预览时那个文件还不存在。
- **iframe 内部是跨域隔离的**（实测 `contentDocument` 为 `null`），
  所以没法用脚本注入样式，只能走 `data-theme` 这条官方路径。
  这也是为什么换主题必须重设 iframe 的 URL、而不是改 CSS 变量。

字体在 iframe 里拿不到本站自托管的 JetBrains Mono（跨域），
所以主题里退到系统等宽字体栈 —— 保留「等宽」这个设计意图，
不为此引入第三方字体请求。

**管理评论**：直接在仓库的 Discussions 里回复、删除或锁定。
giscus 的回复和 GitHub 上是同一份数据，两边同步。

## 大纲目录

文章页右侧有一条大纲目录，自动从文章的 h2 / h3 生成，滚动时高亮当前小节。

**为什么用 fixed 定位而不是 grid 加宽**：正文列是固定 768px（`max-w-3xl`）
居中的，两侧本来就有留白。目录直接用 `position: fixed` 停在右侧那片留白里，
正文的版心、行宽、现有版式一点都不用动。

代价是它**只在 ≥1280px（xl 断点）出现**：

```
正文 768px + 两侧各 16px 内边距 = 800px
1280px 屏扣掉 800px，右侧剩约 240px，才放得下这条 13rem 的目录
```

实测目录左缘恒在正文右缘右侧 **16px**，任何宽度都不会与正文重叠。
窄屏由正文里那个折叠目录负责（`remark-toc` 生成，见 `site-setup.md`），
两者互补：宽屏看侧栏，窄屏看正文。

几个实现要点：

- 数据来自 `render(post)` 的 `headings`，顺序与正文一致，slug 也是同一个
  `github-slugger` 算法，所以能直接当锚点用，不需要额外解析 DOM
- 少于两条目录项就整个不渲染（一个条目的目录没有意义）
- 高亮判定用「最后一条越过视口上方 120px 的标题」，而不是
  `IntersectionObserver` —— 后者在快速滚动与锚点跳转时容易出现中间态
- 当前项的样式写在 CSS 选择器里（`#post-toc a[aria-current]`），
  脚本只维护 `aria-current` 一个属性。站点启用了 ClientRouter，
  站内跳转是局部替换 DOM，把类名状态写进脚本容易残留
- h3 的缩进用 `padding-inline-start` 而不是 `margin` ——
  竖条是绝对定位的，用 margin 会把竖条一起推右，h2 与 h3 的竖条就不对齐了

## 怎么改内容

**改站点标题 / 描述 / 社交链接**：编辑 `astro-paper.config.ts`。
`socials` 里的 `name` 必须对应 `src/assets/icons/socials/` 下的图标文件名。

**改 GitHub 用户名**：只改 `astro-paper.config.ts` 里的 `site.github`
（该字段必填）。头像链接、活跃度抓取、GitHub 入口都由它派生。
只有 `.tools/fetch-avatar.mjs` 单独留着一份，因为它是不读站点配置的独立脚本。

**改座右铭**：只改 `astro-paper.config.ts` 里的 `site.motto`，两处会同时变 ——
首页 hero 简介下方一行（终端注释样式），以及「关于我」基本信息的第一张卡片。
这一项可选：删掉或留空，两处都会自动隐藏，不会留下空位。

**开关功能**：`astro-paper.config.ts` 的 `features`：

| 字段 | 当前值 | 关掉会怎样 |
|---|---|---|
| `showArchives` | `true` | `/archives/` 返回 404，导航入口消失 |
| `search` | `"pagefind"` | `/search/` 返回 404，导航入口消失 |
| `lightAndDarkMode` | `true` | 隐藏深浅色切换按钮 |
| `dynamicOgImage` | `false` | 未接回，见文末说明 |

**改首页站外入口**：编辑 `src/data/hubs.ts`。数组里每一项：

```ts
{
  title: "GitHub",
  description: "一句话说明",
  href: "https://example.com/",  // 站内用 "/xxx/"
  icon: "📚",                     // emoji，避免额外引入图标
  external: true,                // 是否新标签页打开
}
```

**改首页站内导航**：编辑 `src/pages/index.astro` 顶部的 `siteNav` 数组
（`title` / `description` / `href` / `icon`）。它与 `Header.astro` 里的主导航
是两份，增删页面时两边都要看一眼。

**改配色**：只改 `src/styles/theme.css` 顶部的令牌。
浅色在 `:root, [data-theme="light"]`，深色在 `[data-theme="dark"]`，两处成对修改。

令牌的对比度已按 WCAG AA 校验过（`.tools/check-contrast.mjs` 可复核）：

| 用途 | Latte（浅） | Mocha（深） |
| --- | --- | --- |
| 正文 / 背景 | 7.06:1 | 11.34:1 |
| 次要文字 / 背景 | 5.55:1 | 7.37:1 |
| 强调色作文字 | 4.79:1 | 7.08:1 |
| 主按钮文字 / accent 底 | 5.41:1 | 7.08:1 |

改色后建议重跑校验，正文低于 4.5:1 就不合格。

**关于字体**：JetBrains Mono 只覆盖拉丁字符，中文会回退到 `--font-cjk`
里的系统黑体。这是必然回退 —— 好处是拉丁部分保持等宽（终端观感），
中文保证可读；不建议强行给中文套等宽字体，会让字形变挤。

**关于代码高亮的配色**：浅色和深色用的不是同一套主题
（`github-light-default` / `catppuccin-mocha`）。
因为 Catppuccin Latte 是给界面设计的柔和色板，用在代码上
10 种 token 色有 8 种对比度低于 4.5:1，最差只有 2.34:1。
Mocha 没有这个问题，所以深色保留下与站点一致的配色。
若要更换，用 `.tools/check-code-contrast.mjs` 逐个 token 复核。

**改界面文案**：编辑 `src/i18n/lang/zh-CN.ts`。

**改关于我页面**：编辑 `src/pages/about.astro`。

## 第三方接口

首页底部三张卡片分别调用：

| 卡片 | 接口 |
| --- | --- |
| 一言 | <https://v1.hitokoto.cn/> |
| 随机狗狗 | <https://dog.ceo/api/breeds/image/random> |
| 今日诗词 | <https://v1.jinrishici.com/all.json> |

实现见 `src/components/ApiCards.astro`，具备：

- 卡片进入视口才发首次请求（`IntersectionObserver`）
- 6 秒超时（`AbortController`），失败显示兜底文案
- 连点用自增序号保护，只采用最后一次结果
- 断网时直接提示，不发无效请求
- 整卡可键盘操作（Enter / Space），带 `aria-label`
- 内容一律用 `textContent` 写入，无 HTML 注入风险

## 本地开发

```bash
npm install
npm run dev       # 开发服务器
npm run build     # 类型检查 + 构建到 dist/ + 生成搜索索引
npm run preview   # 预览构建产物
```

`npm run build` 之后会自动执行 `postbuild`（pagefind 生成索引），
所以 `npm run build` 是验证搜索功能的唯一方式，`npm run dev` 看不到搜索结果。

## 未接回的上游功能

AstroPaper 自带但本站**刻意没有**启用的功能，以及理由：

| 功能 | 上游实现 | 为什么不接 |
|---|---|---|
| 动态 OG 图 | `og.png.ts` + satori + sharp | satori 需要的字体在 `@fontsource-variable` 里只有 woff2（无 TTF），且**无法渲染中文标题** —— 本站标题基本是中文，接回来也只会缺字。分享图统一用 `public/default-og.jpg` |
| 编辑链接 | `EditPost.astro` | 单人站点，没有「去 GitHub 编辑」的需求 |
| 分享链接 | `ShareLinks.astro` | `shareLinks: []` 是当初特意清空的 |

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。

首次使用需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 许可

站点内容版权归作者所有。

界面主题来自 [AstroPaper](https://github.com/satnaing/astro-paper)，
以 MIT 许可发布，原始许可见 [LICENSE](./LICENSE)。
