/**
 * 站点级配置 —— 改这里就能改全站信息
 * 页面、导航、页脚、SEO 全部从这里取值，避免多处重复维护。
 */

export const site = {
  /** 站点标题（浏览器标签页 / SEO） */
  title: "YZK's Homepage",
  /** 站点副标题 */
  tagline: '学习资料 · 项目归档 · 资源中转',
  /** SEO 描述 */
  description:
    'YZK 的个人站点：整理大学课程学习资料、个人项目与建站记录，并作为通往个人主站与各类资源的统一入口。',
  /** 用于 <html lang> 与 RSS / OG 属性 */
  lang: 'zh-CN',
  /** 部署地址，与 astro.config.mjs 中的 site 保持一致 */
  url: 'https://yzk258.github.io',
  author: 'YZK',
  email: 'yzk24@mails.tsinghua.edu.cn',
  github: 'https://github.com/Yzk258',
  /** 个人主站 */
  mainSite: 'https://yinzachary24.top/',
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

export interface HubLink {
  href: string;
  title: string;
  text: string;
  icon: string;
  /** 站外链接会在新标签页打开 */
  external?: boolean;
  /** 主要去向，显示为高亮卡片 */
  primary?: boolean;
}

/**
 * 资源中转入口 —— 首页的 Resource Hub 区块
 * 本站同时承担个人主页与资源中转两个角色，这里是中转侧的全部出口。
 */
export const hubs: HubLink[] = [
  {
    href: site.mainSite,
    title: '个人主站',
    text: '最新动态与内容都在主站，中转站的主要去向。',
    icon: '🏰',
    external: true,
    primary: true,
  },
  {
    href: '/study/',
    title: '学习资料库',
    text: '按学期与科目整理课程资料与个人评价。',
    icon: '📚',
  },
  {
    href: '/projects/',
    title: '项目库',
    text: '日常的代码实践与技术尝试。',
    icon: '🧩',
  },
  {
    href: '/notes/',
    title: '更新日志',
    text: '本站逐步完善的全部过程。',
    icon: '📝',
  },
  {
    href: site.github,
    title: 'GitHub',
    text: '全部内容开源在此，欢迎按需取用。',
    icon: '🐙',
    external: true,
  },
  {
    href: `mailto:${site.email}`,
    title: '联系我',
    text: site.email,
    icon: '✉️',
    external: true,
  },
];
