import type { UIStrings } from "./types";
import zhCN from "./lang/zh-CN";

/**
 * 本站只有中文一种界面语言，因此这里不再按 locale 查表。
 *
 * 仍然保留这一层封装：将来若要加语言，把 `translations` 换成
 * 以 locale 为键的映射、并按 locale 取用即可。
 */
const translations: UIStrings = zhCN;

export function useTranslations(): UIStrings {
  return translations;
}
