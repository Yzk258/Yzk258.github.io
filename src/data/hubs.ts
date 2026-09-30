/**
 * 站外入口 —— 首页「站外入口」区块由这里渲染。
 *
 * 站内内容（文章 / 标签 / 归档 / 关于）的入口写在
 * src/pages/index.astro 的 siteNav 里，不在这里。
 *
 * 增删入口只需要改这个数组：
 *   title       卡片标题
 *   description 一句话说明
 *   href        目标链接，站内用 "/xxx/"，站外用完整 URL
 *   external    是否新标签页打开
 *
 * 卡片不配图标：emoji 与站点观感不搭，刻意留白。
 */
export interface Hub {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

import config from "@/config";

export const hubs: Hub[] = [
  {
    title: "GitHub",
    description: "课程作业、小工具和这个站点本身的源码。",
    href: `https://github.com/${config.site.github}`,
    external: true,
  },
  {
    title: "联系我",
    description: "有资料要补充或者想交流，直接发邮件。",
    href: "mailto:yzk24@mails.tsinghua.edu.cn",
  },
];
