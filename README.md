# YZK 的个人站

个人主页兼资源中转站 —— 把散落在各处的入口（个人主站、GitHub、邮箱）收在一处，
外加一个用来写文章的板块。

线上地址：<https://yzk258.github.io/>

## 技术栈

- [Astro](https://astro.build/) 7，纯静态输出，默认零客户端框架运行时
- [Tailwind CSS](https://tailwindcss.com/) 4（通过 `@tailwindcss/vite`）
- TypeScript（`astro/tsconfigs/strict`）
- 字体 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)（自托管，`@fontsource-variable`）
- 文章：`@astrojs/mdx` + Shiki 代码高亮 + `remark-toc` / `rehype-callouts`
- 评论：[giscus](https://giscus.app/)，评论存在仓库的 GitHub Discussions 里
- 头像与 GitHub 活跃度：头像本地化，活跃度在构建时抓取官方贡献页并渲染成静态 HTML

主题基于 [AstroPaper](https://github.com/satnaing/astro-paper) v6 改造，
沿用其布局与设计令牌，去掉了标签、归档、站内搜索等用不到的博客功能。

配色取自 [Catppuccin](https://catppuccin.com/)：
浅色用 Latte，深色用 Mocha，两套同族，切换时观感一致。

## 目录结构

```
astro-paper.config.ts    站点配置（标题、描述、社交链接、功能开关）
astro.config.ts          构建配置（集成、Markdown 流水线、代码高亮）
src/
├── config.ts            配置解析层：给 astro-paper.config.ts 补默认值
├── content.config.ts    文章集合的 schema（frontmatter 校验）
├── content/posts/       ← 文章写在这里
├── data/hubs.ts         首页「资源中转」的入口列表
├── components/
│   ├── ApiCards.astro   三个第三方接口小卡片
│   ├── Activity.astro   GitHub 活跃度（按月表格 + 逐日热力图）
│   ├── Avatar.astro     头像框
│   ├── Card.astro       文章列表项
│   ├── Comments.astro   giscus 评论区（评论存在 GitHub Discussions）
│   ├── Datetime.astro   日期显示（按站点时区格式化）
│   ├── Header.astro     页头与导航
│   ├── Footer.astro     页脚
│   ├── Socials.astro    社交图标（由 socials 配置驱动）
│   ├── Breadcrumb.astro 面包屑
│   ├── Main.astro       内容页容器
│   └── LinkButton.astro 链接按钮
├── layouts/
│   ├── Layout.astro     全局 HTML 骨架、meta、主题初始化
│   └── PostLayout.astro 文章页附加的 meta 与 JSON-LD
├── i18n/                界面文案（仅中文）
├── pages/
│   ├── index.astro      /            首页
│   ├── posts/index.astro            文章列表
│   ├── posts/[...slug]/             文章详情
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
    ├── slug.ts          文件名 → URL
    ├── date.ts          日期格式化（按站点时区）
    ├── readingTime.ts   中文友好的阅读时长估算
    └── transformers/    Shiki 代码块文件名标签插件
public/
├── favicon.svg
└── default-og.jpg       分享卡片默认图
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

## 头像与 GitHub 活跃度

| 位置 | 内容 |
| --- | --- |
| `public/avatar.jpg` | 头像图片（460×460），用 `.tools/fetch-avatar.mjs` 重新拉取 |
| `src/components/Avatar.astro` | 头像框，`size="sm"` 用于首页，`size="lg"` 用于关于页 |
| `src/components/Activity.astro` | 活跃度表格与热力图，只在关于页 |
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

需要改用户名时，`Activity.astro` 和 `fetch-avatar.mjs` 里的 `Yzk258` 都要改。

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

**管理评论**：直接在仓库的 Discussions 里回复、删除或锁定。
giscus 的回复和 GitHub 上是同一份数据，两边同步。

## 怎么改内容

**改站点标题 / 描述 / 社交链接**：编辑 `astro-paper.config.ts`。
`socials` 里的 `name` 必须对应 `src/assets/icons/socials/` 下的图标文件名。

**改首页中转入口**：编辑 `src/data/hubs.ts`。数组里每一项：

```ts
{
  title: "个人主站",
  description: "一句话说明",
  href: "https://example.com/",  // 站内用 "/xxx/"
  icon: "🏠",                     // emoji，避免额外引入图标
  external: true,                // 是否新标签页打开
  primary: true,                 // 是否作为首页大按钮，最多一个
}
```

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
npm run build     # 类型检查 + 构建到 dist/
npm run preview   # 预览构建产物
```

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 自动构建并发布到 GitHub Pages。

首次使用需在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。

## 许可

站点内容版权归作者所有。

界面主题来自 [AstroPaper](https://github.com/satnaing/astro-paper)，
以 MIT 许可发布，原始许可见 [LICENSE](./LICENSE)。
