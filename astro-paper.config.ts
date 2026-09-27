import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yzk258.github.io/",
    title: "YZK 的个人站",
    description:
      "YZK 的个人主页与资源中转站：学习资料、项目归档与个人主站的统一入口。",
    author: "YZK",
    profile: "https://yinzachary24.top/",
    // 头像链接、活跃度统计、GitHub 入口都由这一处派生
    github: "Yzk258",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    // 本主题原有的动态 OG 图路由（satori 渲染）未移植，固定关闭，
    // 分享图统一使用 public/default-og.jpg
    dynamicOgImage: false,
    // 本站不使用归档与站内搜索，Header 里对应入口一并关掉
    showArchives: false,
    showBackButton: false,
    editPost: { enabled: false },
    search: false,
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/Yzk258",
      linkTitle: "在 GitHub 上查看 YZK",
    },
    {
      name: "mail",
      url: "mailto:yzk24@mails.tsinghua.edu.cn",
      linkTitle: "给 YZK 发邮件",
    },
  ],
  shareLinks: [],
});
