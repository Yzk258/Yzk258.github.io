import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://yzk258.github.io/",
    title: "YZK 的个人站",
    description:
      "YZK 的个人主页：学习笔记、项目记录与资料归档都放在这里。",
    author: "YZK",
    // 座右铭：首页 hero 与「关于我」的基本信息各显示一次。
    // 换成自己的句子即可；清空这一行，两处都会自动隐藏。
    motto: "We must know, we will know.",
    mottoUrl: "https://en.wikiquote.org/wiki/David_Hilbert",
    // 出生时间：日期未提供具体时刻时，按北京时间当天 00:00:00 计算。
    birthDatetime: "2006-04-16T00:00:00+08:00",
    // 头像链接、活跃度统计、GitHub 入口都由这一处派生
    github: "Yzk258",
    ogImage: "default-og.jpg",
    lang: "zh-CN",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    // 本主题原有的动态 OG 图路由（satori 渲染）未移植，固定关闭，
    // 分享图统一使用 public/default-og.jpg
    dynamicOgImage: false,
    // 本站不使用归档与站内搜索，Header 里对应入口一并关掉
    showArchives: true,
    showBackButton: false,
    editPost: { enabled: false },
    // pagefind：构建后生成索引（见 package.json 的 postbuild）
    search: "pagefind",
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
