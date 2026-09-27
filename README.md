# YZK's Homepage

个人主页与学习资料归档站，基于 [Astro](https://astro.build/) 构建，部署在 GitHub Pages。

线上地址：<https://yzk258.github.io>

## 技术选型

| 项目 | 选择 | 原因 |
| --- | --- | --- |
| 框架 | Astro 7 | 构建产物是纯静态 HTML，零框架运行时；组件可复用，默认不向浏览器发送多余 JS |
| 样式 | 原生 CSS + 设计令牌 | 站点规模不需要 CSS 框架，`src/styles/global.css` 里统一管理颜色/间距/圆角 |
| 内容 | 类型化 TS 数据文件 | 内容量还小，先不上 Content Collections，等笔记正文多起来再迁移 |
| 部署 | GitHub Actions → Pages | 每次推送 main 自动构建发布，无需手动上传 `dist/` |

## 本地开发

```bash
npm install     # 安装依赖
npm run dev     # 本地开发，默认 http://localhost:4321
npm run build   # 构建到 dist/
npm run preview # 本地预览构建产物
```

## 目录结构

```
src/
├── config.ts              # 站点信息与导航 —— 改站名、邮箱、导航项来这里
├── data/                  # 内容数据
│   ├── study.ts           # 学期与课程
│   ├── projects.ts        # 项目列表
│   └── updates.ts         # 更新日志
├── layouts/
│   └── BaseLayout.astro   # 全站布局：head / 头部 / 页脚
├── components/            # Header、Footer、PageHeader、Section、CourseCard 等
├── scripts/               # 主题切换、滚动揭示等前端脚本
├── styles/
│   └── global.css         # 设计令牌 + 基础样式 + 通用组件类
└── pages/                 # 路由（文件路径即 URL）
    ├── index.astro        # /
    ├── about/index.astro  # /about/
    ├── study/             # /study/ 与 /study/<学期>/
    ├── projects/          # /projects/
    ├── notes/             # /notes/
    └── 404.astro          # 404 页面
public/
├── favicon.svg
└── files/                 # 学习资料等静态文件放这里（当前为空）
```

## 怎么加内容

**加课程资料**：在 `src/data/study.ts` 的 `courses` 数组里加一条记录，
把文件放进 `public/files/`，然后给该课程补上链接即可。

**加项目**：在 `src/data/projects.ts` 的 `projects` 数组里追加，填 `title`、`summary`、
`year`，可选 `tags`、`repo`、`demo`、`status`。

**加更新日志**：在 `src/data/updates.ts` 的数组最前面插入一条。

**改配色**：只改 `src/styles/global.css` 顶部的令牌。
浅色在 `:root`，深色在 `html[data-theme='dark']`，两处成对修改。

## 主题

支持浅色 / 深色切换，默认跟随系统。用户手动切换后写入 `localStorage`，
由 `src/scripts/theme-init.ts` 在 `<head>` 中同步执行以避免深色模式闪白。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布。
首次使用需在仓库 **Settings → Pages → Source** 中选择 **GitHub Actions**。
