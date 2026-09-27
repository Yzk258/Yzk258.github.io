import config from "@/config";

/**
 * 中文日期格式化。
 *
 * 用 Intl 而不是手拼字符串，这样能按指定时区换算 ——
 * 服务器（GitHub Actions）跑在 UTC，不指定时区的话
 * 东八区晚上写的文章日期会显示成前一天。
 */
export function formatDate(date: Date, timezone = config.site.timezone) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(date);
}

/**
 * 取出某个时刻在指定时区的 UTC 偏移，形如 "+08:00"。
 * longOffset 会给出 "GMT+08:00"，去掉前缀即可。
 */
function getUtcOffset(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const name = parts.find(part => part.type === "timeZoneName")?.value ?? "";
  const offset = name.replace("GMT", "");
  // UTC 本身返回空字符串，补成 +00:00
  return offset === "" ? "+00:00" : offset;
}

/**
 * 机器可读的完整时间，用于 <time datetime>。
 *
 * 要带上时区偏移：不带偏移的写法会被浏览器按访问者的本地时间解释，
 * 而访问者未必在东八区，日期可能因此显示成相邻的一天。
 */
export function toDateTimeAttr(date: Date, timezone = config.site.timezone) {
  // sv-SE 的格式恰好是 YYYY-MM-DD HH:mm:ss
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone,
  })
    .format(date)
    .replace(" ", "T");

  return `${formatted}${getUtcOffset(date, timezone)}`;
}
