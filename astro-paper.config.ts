import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yzk258.github.io/",
    title: "YZK 的个人站",
    description:
      "YZK 的个人主页与资源中转站：学习资料、项目归档与个人主站的统一入口。",
    author: "YZK",
    profile: "https://yinzachary24.top/",
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
    dynamicOgImage: true,
    // 本站不使用归档与站内搜索，Header 里对应入口一并关掉
    showArchives: false,
    showBackButton: false,
    editPost: { enabled: false },
    search: false,
  },
  socials: [
    { name: "github", url: "https://github.com/Yzk258" },
    { name: "mail", url: "mailto:yzk24@mails.tsinghua.edu.cn" },
  ],
  shareLinks: [],
});
