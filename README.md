# YZK 的个人站

个人主页兼资源中转站 —— 把散落在各处的入口（个人主站、GitHub、邮箱）收在一处。

线上地址：<https://yzk258.github.io/>

## 技术栈

- [Astro](https://astro.build/) 7，纯静态输出，默认零客户端框架运行时
- [Tailwind CSS](https://tailwindcss.com/) 4（通过 `@tailwindcss/vite`）
- TypeScript（`astro/tsconfigs/strict`）
- 字体 [JetBrains Mono](https://www.jetbrains.com/lp/mono/)（自托管，`@fontsource-variable`）

主题基于 [AstroPaper](https://github.com/satnaing/astro-paper) v6 改造，
沿用其布局与设计令牌，移除了文章、标签、归档、搜索等博客功能。

配色取自 [Catppuccin](https://catppuccin.com/)：
浅色用 Latte，深色用 Mocha，两套同族，切换时观感一致。

## 目录结构

```
astro-paper.config.ts    站点配置（标题、描述、社交链接、功能开关）
astro.config.ts          构建配置（集成、字体、环境变量）
src/
├── config.ts            配置解析层：给 astro-paper.config.ts 补默认值
├── data/hubs.ts         首页「资源中转」的入口列表 ← 最常改的文件
├── components/
│   ├── ApiCards.astro   三个第三方接口小卡片
│   ├── Header.astro     页头与导航
│   ├── Footer.astro     页脚
│   ├── Socials.astro    社交图标（由 socials 配置驱动）
│   ├── Breadcrumb.astro 面包屑
│   ├── Main.astro       内容页容器
│   └── LinkButton.astro 链接按钮
├── layouts/Layout.astro 全局 HTML 骨架、meta、主题初始化
├── i18n/                界面文案（仅中文）
├── pages/               路由：/、/about/、404、robots.txt
├── scripts/theme.ts     深浅色切换
├── styles/
│   ├── theme.css        设计令牌（颜色、字体）← 改配色看这里
│   └── global.css       Tailwind 入口与基础样式
├── types/config.ts      配置的类型定义
└── utils/               base 路径与 OG 图处理
public/
├── favicon.svg
└── default-og.jpg       分享卡片默认图
```

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
