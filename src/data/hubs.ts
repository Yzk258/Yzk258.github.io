/**
 * 资源中转入口 —— 首页「资源中转」区块由这里渲染。
 *
 * 增删入口只需要改这个数组：
 *   title       卡片标题
 *   description 一句话说明
 *   href        目标链接，站内用 "/xxx/"，站外用完整 URL
 *   icon        卡片左上角的符号（emoji 即可，避免额外引入图标）
 *   external    是否新标签页打开
 *   primary     是否高亮为「主入口」，首页最多设一个
 */
export interface Hub {
  title: string;
  description: string;
  href: string;
  icon: string;
  external?: boolean;
  primary?: boolean;
}

export const hubs: Hub[] = [
  {
    title: "个人主站",
    description: "最新最全的内容都在这里，日常更新以主站为准。",
    href: "https://yinzachary24.top/",
    icon: "🏠",
    external: true,
    primary: true,
  },
  {
    title: "GitHub",
    description: "课程作业、小工具和这个站点本身的源码。",
    href: "https://github.com/Yzk258",
    icon: "💻",
    external: true,
  },
  {
    title: "联系我",
    description: "有资料要补充或者想交流，直接发邮件。",
    href: "mailto:yzk24@mails.tsinghua.edu.cn",
    icon: "✉️",
  },
];
