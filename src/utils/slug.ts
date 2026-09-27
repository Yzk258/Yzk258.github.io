/**
 * 由文件名生成 URL slug。
 *
 * 本站文章的中文标题无法可靠地转成拼音，所以 slug 一律取自文件名：
 * 文件名即 URL，作者完全可控，改标题不会改变链接。
 *
 * - 拉丁字母转小写，空格与下划线转连字符
 * - 去掉变音符号（café → cafe）
 * - 中文等非 ASCII 字符原样保留（浏览器与 GitHub Pages 都能正确处理）
 * - 去掉首尾连字符，并压缩连续连字符
 */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    // 去掉组合用变音符号
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}
