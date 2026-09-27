/**
 * GitHub 贡献数据。
 *
 * GitHub 没有公开的贡献数据接口 —— GraphQL 那个需要 token，REST 里没有，
 * 所以只能解析官方贡献页的 HTML：
 *
 *   <td data-date="2026-09-27" id="contribution-day-component-0-12"
 *       data-level="2" class="ContributionCalendar-day">
 *   <tool-tip for="contribution-day-component-0-12">14 contributions on …</tool-tip>
 *
 * 精确次数只存在于 tool-tip 的文案里，data-level 只是 0-4 的色阶。
 * 两者用 id 关联。
 *
 * 数据结构变了就返回 null，调用方不渲染这一块 —— 头像等其余内容不受影响。
 * 这是刻意的：抓第三方 HTML 有风险，失败不该让整个站点构建挂掉。
 */

export type ContributionDay = {
  date: string;
  level: number;
  count: number;
};

export type ContributionMonth = {
  /** YYYY-MM */
  key: string;
  total: number;
  activeDays: number;
};

export type ContributionStats = {
  days: ContributionDay[];
  total: number;
  activeDays: number;
  maxInADay: number;
  /** 最长连续有提交的天数 */
  longestStreak: number;
  /** 从最后一天往前数的连续天数 */
  currentStreak: number;
  months: ContributionMonth[];
  /** 区间首尾日期 */
  first: string;
  last: string;
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

/**
 * 解析贡献页 HTML。
 * td 的属性顺序在真实页面里不固定，所以三种顺序都扫一遍。
 */
export function parseContributionHtml(html: string): ContributionDay[] {
  const byId = new Map<string, ContributionDay>();
  const ID = "contribution-day-component-[^\"]+";

  const patterns: Array<{
    re: RegExp;
    build: (m: RegExpMatchArray) => [string, ContributionDay];
  }> = [
    {
      re: new RegExp(
        `<td[^>]*?data-date="(\\d{4}-\\d{2}-\\d{2})"[^>]*?id="(${ID})"[^>]*?data-level="(\\d)"`,
        "g"
      ),
      build: m => [m[2], { date: m[1], level: +m[3], count: 0 }],
    },
    {
      re: new RegExp(
        `<td[^>]*?id="(${ID})"[^>]*?data-date="(\\d{4}-\\d{2}-\\d{2})"[^>]*?data-level="(\\d)"`,
        "g"
      ),
      build: m => [m[1], { date: m[2], level: +m[3], count: 0 }],
    },
    {
      re: new RegExp(
        `<td[^>]*?data-level="(\\d)"[^>]*?data-date="(\\d{4}-\\d{2}-\\d{2})"[^>]*?id="(${ID})"`,
        "g"
      ),
      build: m => [m[3], { date: m[2], level: +m[1], count: 0 }],
    },
  ];

  for (const { re, build } of patterns) {
    for (const m of html.matchAll(re)) {
      const [id, day] = build(m);
      if (!byId.has(id)) byId.set(id, day);
    }
  }

  for (const m of html.matchAll(
    /<tool-tip[^>]*?for="([^"]+)"[^>]*?>([^<]*)<\/tool-tip>/g
  )) {
    const day = byId.get(m[1]);
    if (!day) continue;
    const count = m[2].match(/^(\d+)\s+contribution/);
    day.count = count ? +count[1] : 0;
  }

  return [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** 从逐日数据汇总出统计值 */
export function summarize(days: ContributionDay[]): ContributionStats {
  const total = days.reduce((sum, d) => sum + d.count, 0);
  const active = days.filter(d => d.count > 0);

  let longestStreak = 0;
  let running = 0;
  for (const day of days) {
    if (day.count > 0) {
      running++;
      if (running > longestStreak) longestStreak = running;
    } else {
      running = 0;
    }
  }

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak++;
    else break;
  }

  const monthMap = new Map<string, ContributionMonth>();
  for (const day of days) {
    const key = day.date.slice(0, 7);
    const entry = monthMap.get(key) ?? { key, total: 0, activeDays: 0 };
    entry.total += day.count;
    if (day.count > 0) entry.activeDays++;
    monthMap.set(key, entry);
  }

  return {
    days,
    total,
    activeDays: active.length,
    maxInADay: days.reduce((max, d) => Math.max(max, d.count), 0),
    longestStreak,
    currentStreak,
    months: [...monthMap.values()].sort((a, b) => a.key.localeCompare(b.key)),
    first: days[0]?.date ?? "",
    last: days[days.length - 1]?.date ?? "",
  };
}

type CacheFile = { fetchedOn: string; username: string; stats: ContributionStats };

/**
 * 本地缓存。
 *
 * 放在 node_modules/.cache 下：这个目录本来就被 gitignore，不会污染仓库，
 * 而 CI 的 npm ci 之后它可能已存在，所以按「日期」而不是「小时数」失效 ——
 * 每天定时重建时一定会重新抓，同一天内的多次本地构建则复用。
 */
const CACHE_PATH = "node_modules/.cache/github-contributions.json";

async function readCache(username: string, today: string) {
  try {
    const { readFile } = await import("node:fs/promises");
    const raw = await readFile(CACHE_PATH, "utf8");
    const cache = JSON.parse(raw) as CacheFile;
    if (cache.username === username && cache.fetchedOn === today) {
      return cache.stats;
    }
  } catch {
    // 没有缓存或缓存损坏，都当作未命中
  }
  return null;
}

async function writeCache(username: string, today: string, stats: ContributionStats) {
  try {
    const { mkdir, writeFile } = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    await mkdir(dirname(CACHE_PATH), { recursive: true });
    await writeFile(
      CACHE_PATH,
      JSON.stringify({ fetchedOn: today, username, stats } satisfies CacheFile),
      "utf8"
    );
  } catch {
    // 缓存写不进去无所谓，不影响本次构建
  }
}

/**
 * 抓取并汇总。失败返回 null。
 *
 * GITHUB_TOKEN 是可选的：带上它走 5000 次/小时的配额，
 * 不带则走 60 次/小时（构建只用 1 次，通常也够）。
 */
export async function fetchContributionStats(
  username: string
): Promise<ContributionStats | null> {
  const today = new Date().toISOString().slice(0, 10);
  // 缓存按日期失效，所以先读总是划算的：同一天内重复构建不再打网络，
  // 而每天的定时重建一定会重新抓。
  const cached = await readCache(username, today);
  if (cached) return cached;

  try {
    const token = process.env.GITHUB_TOKEN;
    const response = await fetch(
      `https://github.com/users/${username}/contributions`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(20_000),
      }
    );
    if (!response.ok) {
      console.warn(
        `[activity] GitHub 贡献页返回 ${response.status}，本次不渲染贡献数据`
      );
      return (await readCache(username, "")) ?? null;
    }

    const days = parseContributionHtml(await response.text());
    // 解析不出足够天数就认为页面结构变了，宁可不显示也不要显示错的
    if (days.length < 300) {
      console.warn(
        `[activity] 只解析出 ${days.length} 天（预期 300+），页面结构可能已变，本次不渲染`
      );
      return null;
    }

    const stats = summarize(days);
    await writeCache(username, today, stats);
    return stats;
  } catch (error) {
    console.warn(
      `[activity] 抓取失败：${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

/**
 * 把逐日数据补成从周日开始的 7 列网格。
 * GitHub 返回的区间首日不一定是周日，补 null 占位才能让同列对应同一星期几。
 */
export function toWeekGrid(
  days: ContributionDay[]
): Array<ContributionDay | null> {
  if (days.length === 0) return [];
  const firstDayOfWeek = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  return [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...days,
  ];
}
