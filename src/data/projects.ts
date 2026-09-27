/** 项目条目 —— 有真实项目后往数组里加即可 */
export interface Project {
  /** 锚点 id / 排序用，全站唯一 */
  id: string;
  /** 项目名 */
  title: string;
  /** 一句话简介 */
  summary: string;
  /** 年份，用于排序 */
  year: number;
  /** 技术栈 / 关键词 */
  tags?: string[];
  /** 代码仓库 */
  repo?: string;
  /** 在线演示 */
  demo?: string;
  /** 是否仍在维护 */
  status?: '进行中' | '已完成' | '已归档';
}

export const projects: Project[] = [];
