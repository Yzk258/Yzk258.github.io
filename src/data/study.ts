/**
 * 内容数据层 —— 骨架阶段用类型化的 TS 数据文件占位。
 *
 * 为什么先用数据文件而不是 Astro Content Collections：
 *   现在内容几乎为空，建立 collections 只会多一层需要维护的 schema。
 *   等资料真正多起来（尤其课程笔记要写正文）时，再迁移到
 *   src/content/ + Content Collections 更合适，届时这套接口可以保持不变。
 */

/** 学期 */
export interface Semester {
  /** URL 片段，如 "year1-fall" */
  id: string;
  /** 年级序号，1 表示大一 */
  year: number;
  /** 学期：秋季 / 春季 */
  term: '秋季' | '春季';
  /** 显示名称 */
  label: string;
  /** 一句话说明 */
  note?: string;
}

/** 课程 */
export interface Course {
  /** 锚点 id，全站唯一 */
  id: string;
  name: string;
  /** 对应 Semester.id */
  semester: string;
  /** 授课教师，不确定就留空 */
  teacher?: string;
  /** 资料条目数 —— 有资料后再更新，用于显示进度 */
  resources?: number;
  /** 关键词，用于标签展示与站内搜索匹配 */
  tags?: string[];
  /**
   * 额外的搜索关键词（空格分隔）。
   * 课程简称、英文名与拼音缩写放这里，例如 dsa、ds、data structure，
   * 这样搜缩写也能命中。
   */
  keywords?: string;
}

export const semesters: Semester[] = [
  { id: 'year1-fall', year: 1, term: '秋季', label: '大一上学期' },
  { id: 'year1-spring', year: 1, term: '春季', label: '大一下学期' },
  { id: 'year2-fall', year: 2, term: '秋季', label: '大二上学期' },
  {
    id: 'year2-spring',
    year: 2,
    term: '春季',
    label: '大二下学期',
    note: '当前学期',
  },
];

export const courses: Course[] = [
  // 大一上
  { id: 'math1', name: '微积分A1', semester: 'year1-fall', tags: ['数学'], keywords: 'math calculus wjf 微积分 高等数学' },
  { id: 'matrix', name: '线性代数（理科类）', semester: 'year1-fall', tags: ['数学'], keywords: 'linear algebra xxds 线代 矩阵' },
  { id: 'physics1', name: '基础物理学1', semester: 'year1-fall', tags: ['物理'], keywords: 'physics wl 普物 力学' },
  { id: 'writing', name: '写作与沟通', semester: 'year1-fall', tags: ['通识'], keywords: 'writing xz 写作 沟通' },
  { id: 'english1', name: '英语阅读与写作B', semester: 'year1-fall', tags: ['英语'], keywords: 'english reading writing yy 英语阅读' },

  // 大一下
  { id: 'math2', name: '微积分A2', semester: 'year1-spring', tags: ['数学'], keywords: 'math calculus wjf 微积分 高等数学' },
  { id: 'physics2', name: '基础物理学2', semester: 'year1-spring', tags: ['物理'], keywords: 'physics wl 普物 电磁学 光学' },
  { id: 'python', name: '计算机程序设计基础（Python）', semester: 'year1-spring', tags: ['编程'], keywords: 'python chengxu programming jsj 程设 编程' },
  { id: 'physics-lab1', name: '基础物理实验1', semester: 'year1-spring', tags: ['实验'], keywords: 'physics lab sy 普物实验 大物实验' },
  { id: 'graphics', name: '工程图学基础', semester: 'year1-spring', tags: ['工程'], keywords: 'engineering graphics gctx 工图 cad 制图' },
  { id: 'english2', name: '英语听说B', semester: 'year1-spring', tags: ['英语'], keywords: 'english listening speaking yy 英语听说' },
  { id: 'general1', name: '通识课', semester: 'year1-spring', tags: ['通识'], keywords: 'general tsk 通识 选修' },

  // 大二上
  { id: 'complex', name: '复变函数与数理方程', semester: 'year2-fall', tags: ['数学'], keywords: 'complex variables fubian fhsz 复变 数理方程' },
  { id: 'physics3', name: '基础物理学3', semester: 'year2-fall', tags: ['物理'], keywords: 'physics wl 普物 量子 近代物理' },
  { id: 'probability', name: '概率论与数理统计', semester: 'year2-fall', tags: ['数学'], keywords: 'probability statistics gltj 概率 统计 概统' },
  { id: 'discrete', name: '离散数学1', semester: 'year2-fall', tags: ['数学', '计算机'], keywords: 'discrete math lsxx 离散 图论' },
  { id: 'physics-lab2', name: '基础物理实验2', semester: 'year2-fall', tags: ['实验'], keywords: 'physics lab sy 普物实验 大物实验' },
  { id: 'football', name: '足球专项', semester: 'year2-fall', tags: ['体育'], keywords: 'football zq 足球 体育' },
  { id: 'general2', name: '通识课', semester: 'year2-fall', tags: ['通识'], keywords: 'general tsk 通识 选修' },

  // 大二下
  { id: 'quantum', name: '量子力学', semester: 'year2-spring', tags: ['物理'], keywords: 'quantum mechanics lzlx qm 量子力学' },
  { id: 'nuclear', name: '核辐射物理与探测学', semester: 'year2-spring', tags: ['物理'], keywords: 'nuclear radiation hfs 核辐射 探测 核物理' },
  { id: 'digital', name: '数字电路与嵌入式系统', semester: 'year2-spring', tags: ['硬件'], keywords: 'digital circuit embedded szdl qrs 数电 嵌入式 fpga' },
  { id: 'ds', name: '数据结构', semester: 'year2-spring', tags: ['计算机'], keywords: 'data structure dsa ds sjjg 数据结构 算法' },
  { id: 'network', name: '计算机网络原理', semester: 'year2-spring', tags: ['计算机'], keywords: 'computer network jsjwl net 计网 网络 tcp' },
  {
    id: 'advanced-linear-algebra',
    name: '高等线性代数选讲',
    semester: 'year2-spring',
    tags: ['数学'],
    keywords: 'advanced linear algebra gdxxds 高代 线代选讲',
  },
  { id: 'fitness', name: '健美专项', semester: 'year2-spring', tags: ['体育'], keywords: 'fitness jm 健美 健身 体育' },
];

/** 取某个学期的全部课程 */
export function coursesOf(semesterId: string): Course[] {
  return courses.filter((course) => course.semester === semesterId);
}

/** 取单个学期 */
export function semesterById(id: string): Semester | undefined {
  return semesters.find((semester) => semester.id === id);
}

/** 全站课程总数，用于首页统计 */
export const courseCount = courses.length;
