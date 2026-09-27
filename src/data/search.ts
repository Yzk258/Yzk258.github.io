/**
 * 站内搜索索引
 *
 * 由页面与课程数据派生而来，不额外维护一份手工清单，
 * 这样新增课程后搜索能自动覆盖。
 */
import { courses, semesters } from './study';
import { projects } from './projects';
import { hubs } from '../config';

export interface SearchItem {
  title: string;
  url: string;
  /** 分组标题，决定结果里的归类 */
  group: string;
  icon: string;
  /** 额外关键词，供精确匹配（如拼音缩写 dsa、课程代号） */
  keywords?: string;
  /** 无输入时是否出现在"猜你想找"里 */
  featured?: boolean;
  /** 无输入时是否出现在"快速跳转"里 */
  quick?: boolean;
}

/** 站内固定页面 */
const pages: SearchItem[] = [
  {
    title: '首页 · 资源中转站',
    url: '/',
    group: '站点',
    icon: '🏠',
    keywords: 'home index 主页 首页 中转 hub',
    quick: true,
  },
  {
    title: '学习资料库',
    url: '/study/',
    group: '站点',
    icon: '📚',
    keywords: 'study 资料 课程 学习',
    quick: true,
    featured: true,
  },
  {
    title: '项目库',
    url: '/projects/',
    group: '站点',
    icon: '🧩',
    keywords: 'projects 项目 作品 代码',
    quick: true,
    featured: true,
  },
  {
    title: '更新日志',
    url: '/notes/',
    group: '站点',
    icon: '📝',
    keywords: 'notes changelog 日志 更新',
    quick: true,
  },
  {
    title: '关于我',
    url: '/about/',
    group: '站点',
    icon: '👤',
    keywords: 'about me 关于 自我介绍 联系',
    quick: true,
  },
];

/** 学期页面 */
const semesterPages: SearchItem[] = semesters.map((semester) => ({
  title: semester.label,
  url: `/study/${semester.id}/`,
  group: '学期',
  icon: '🗓️',
  keywords: `semester ${semester.year} ${semester.term} 学期 课程表`,
}));

/** 课程 */
const courseItems: SearchItem[] = courses.map((course) => {
  const semester = semesters.find((item) => item.id === course.semester);
  const tags = course.tags?.join(' ') ?? '';
  return {
    title: course.name,
    url: `/study/${course.semester}/#${course.id}`,
    group: semester ? `课程 · ${semester.label}` : '课程',
    icon: '📄',
    keywords:
      `${course.id} ${tags} ${course.keywords ?? ''} ${semester?.label ?? ''} ${course.teacher ?? ''}`.trim(),
    featured: ['ds', 'quantum', 'network'].includes(course.id),
  };
});

/** 项目 */
const projectItems: SearchItem[] = projects.map((project) => ({
  title: project.title,
  url: `/projects/#${project.id}`,
  group: '项目',
  icon: '🧩',
  keywords: `${project.id} ${project.tags?.join(' ') ?? ''} ${project.year}`,
  featured: true,
}));

/** 资源中转入口（含站外去向） */
const hubItems: SearchItem[] = hubs.map((hub) => ({
  title: hub.title,
  url: hub.href,
  group: '资源中转',
  icon: hub.icon,
  keywords: `${hub.title} 中转 hub 入口 ${hub.external ? '站外 外部' : ''}`,
}));

export const searchItems: SearchItem[] = [
  ...pages,
  ...hubItems,
  ...semesterPages,
  ...courseItems,
  ...projectItems,
];

/** 注入到页面供搜索脚本读取 */
export const searchIndexJson = JSON.stringify(searchItems);
