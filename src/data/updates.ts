/** 更新日志条目 —— 新的写在数组最前面 */
export interface Update {
  /** ISO 日期字符串，如 "2026-02-21" */
  date: string;
  title: string;
  /** 变更条目 */
  items: string[];
  /** 可选：标签，如 ["重构", "内容"] */
  tags?: string[];
}

/**
 * 换框架这件事本身值得记一笔，所以这里留了一条真实日志。
 * 更早的历史记录见旧站点（git 历史中的 main 分支）。
 */
export const updates: Update[] = [
  {
    date: '2026-02-21',
    title: '站点重构：迁移到 Astro',
    items: [
      '从手写 HTML/CSS/JS 迁移到 Astro，导航、页脚、主题等改为组件复用，不再每个页面各写一份。',
      '重做视觉：改用中性底色 + 青蓝主色，并加入深浅色主题切换。',
      '移除每 50ms / 80ms 生成 DOM 节点的星空与雪花动画，改为一次性入场动效，并尊重系统"减弱动效"设置。',
      '清理 6 个空文件与失效链接，导航结构改为 /study/、/projects/、/notes/、/about/。',
    ],
    tags: ['重构'],
  },
];
