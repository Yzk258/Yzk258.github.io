/**
 * 估算阅读时长。
 *
 * 中英文混排时不能只按空格数词 —— 中文没有词间空格，
 * 整段中文会被算成 1 个词。所以分开统计：
 * 中日韩字符按字数算（约 300 字/分钟），
 * 拉丁文字按词数算（约 200 词/分钟），取两者耗时相加。
 */
const CJK_RE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g;
const CJK_PER_MINUTE = 300;
const WORDS_PER_MINUTE = 200;

export function getReadingMinutes(markdown: string): number {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");

  const cjkCount = (withoutCode.match(CJK_RE) ?? []).length;
  const latinWords = (
    withoutCode
      .replace(CJK_RE, " ")
      .match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) ?? []
  ).length;

  const minutes =
    cjkCount / CJK_PER_MINUTE + latinWords / WORDS_PER_MINUTE;

  // 再短的文章也显示 1 分钟
  return Math.max(1, Math.round(minutes));
}
