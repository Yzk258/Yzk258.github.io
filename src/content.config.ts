import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

/**
 * 从 frontmatter 里的时间戳解析出 Date。
 *
 * 要求写完整时间并带时区（例如 2026-09-27T10:00:00+08:00）。
 * 只写日期（2026-09-27）会被当成 UTC 零点，在东八区显示出来就是前一天 ——
 * 与其默默算错，不如直接报错提醒写清楚时区。
 */
/**
 * 从 frontmatter 解析出带时区的 Date。
 *
 * YAML 会把 `2026-09-27T10:00:00+08:00` 自动解析成 Date 对象，
 * 但写成 `2026-09-27` 会当成「无时区的日期」——
 * 于是被当成 UTC 零点，在东八区显示出来就是前一天。
 * 所以这里同时接受字符串与 Date，但要拦掉没有时区信息的那种。
 */
const dateWithTimezone = z
  .union([z.string(), z.date()])
  .superRefine((value, ctx) => {
    if (value instanceof Date) {
      // YAML 已解析成 Date 时无法再判断原始写法，
      // 但 date-only 会被解析成 UTC 午夜，这里据此给出提示
      if (
        value.getUTCHours() === 0 &&
        value.getUTCMinutes() === 0 &&
        value.getUTCSeconds() === 0 &&
        value.getUTCMilliseconds() === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message:
            "时间没有时区信息（或正好是 UTC 零点）。请写成 2026-09-27T10:00:00+08:00 这样带时区的完整时间，" +
            "否则在东八区会显示成前一天",
        });
      }
      return;
    }

    if (Number.isNaN(new Date(value).getTime())) {
      ctx.addIssue({ code: "custom", message: "不是有效的时间格式" });
      return;
    }
    if (!/(?:Z|[+-]\d{2}:?\d{2})$/.test(value)) {
      ctx.addIssue({
        code: "custom",
        message:
          "请写完整时间并带时区，例如 2026-09-27T10:00:00+08:00；只写日期会因时区差显示成前一天",
      });
    }
  })
  .transform(value => (value instanceof Date ? value : new Date(value)));

const posts = defineCollection({
  // 下划线开头的文件不参与构建，方便放草稿
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      /** 文章标题 */
      title: z.string(),
      /** 摘要，用于列表页与 SEO，建议一两句 */
      description: z.string(),
      /** 首次发布时间，必须带时区 */
      pubDatetime: dateWithTimezone,
      /** 最后修改时间，可选；填了就以它作为排序依据 */
      modDatetime: dateWithTimezone.optional().nullable(),
      /** 标签，用于分类 */
      tags: z.array(z.string()).default([]),
      /** 草稿：为 true 时不参与构建 */
      draft: z.boolean().optional(),
      /** 置顶到首页「最新文章」最前 */
      featured: z.boolean().optional(),
      /** 社交分享图；不填则用站点默认图 */
      ogImage: image().or(z.string()).optional(),
      /** 原文链接，用于声明转载来源 */
      canonicalURL: z.string().url().optional(),
      /** 作者，默认取站点配置 */
      author: z.string().default(config.site.author),
    }),
});

export const collections = { posts };
