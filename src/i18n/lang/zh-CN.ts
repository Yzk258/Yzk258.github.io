import type { UIStrings } from "../types";

export default {
  nav: {
    home: "首页",
    about: "关于我",
    posts: "文章",
  },
  home: {
    socialLinks: "找到我",
    latestPosts: "最新文章",
    allPosts: "全部文章",
  },
  posts: {
    title: "文章",
    description: "记录学习过程、踩过的坑和一些想法。",
    backToPosts: "返回文章列表",
    empty: "还没有文章。",
    publishedOn: "发布于",
    updatedOn: "更新于",
    readingTime: "阅读约",
    minutes: "分钟",
    tableOfContents: "目录",
    previousPost: "上一篇",
    nextPost: "下一篇",
    adjacentPosts: "相邻文章",
    copyCode: "复制",
    copied: "已复制",
    copyFailed: "复制失败",
    linkToHeading: "链接到本节",
    backToTop: "回到顶部",
  },
  comments: {
    title: "评论",
    hint: "评论由 GitHub Discussions 提供，需要登录 GitHub 账号。",
    iframeTitle: "评论区（由 GitHub Discussions 提供）",
    noscript: "评论需要 JavaScript 才能加载。",
  },
  footer: {
    copyright: "版权所有",
    allRightsReserved: "保留所有权利。",
    themeCredit: "主题",
  },
  a11y: {
    skipToContent: "跳到主要内容",
    openMenu: "打开菜单",
    closeMenu: "关闭菜单",
    toggleTheme: "切换深浅色",
    zoomImage: "放大图片",
    closeImage: "关闭图片预览",
    imagePreview: "图片预览",
    readingProgress: "阅读进度",
  },
  notFound: {
    title: "404 页面不存在",
    message: "找不到这个页面",
    goHome: "返回首页",
  },
} satisfies UIStrings;
