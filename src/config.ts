/**
 * 站点级配置 —— 改这里就能改全站信息
 * 页面、导航、页脚、SEO 全部从这里取值，避免多处重复维护。
 */

export const site = {
  /** 站点标题（浏览器标签页 / SEO） */
  title: "YZK's Homepage",
  /** 站点副标题 */
  tagline: '学习资料与项目归档',
  /** SEO 描述 */
  description:
    'YZK 的个人主页：整理大学课程学习资料、个人项目与随笔记录。',
  /** 用于 <html lang> 与 RSS / OG 属性 */
  lang: 'zh-CN',
  /** 部署地址，与 astro.config.mjs 中的 site 保持一致 */
  url: 'https://yzk258.github.io',
  author: 'YZK',
  email: 'yzk24@mails.tsinghua.edu.cn',
  github: 'https://github.com/Yzk258',
  /** 建站年份，用于页脚版权 */
  since: 2026,
} as const;

/** 顶部导航 */
export const nav = [
  { href: '/', label: '首页' },
  { href: '/study/', label: '学习资料库' },
  { href: '/projects/', label: '项目库' },
  { href: '/notes/', label: '更新日志' },
  { href: '/about/', label: '关于我' },
] as const;
