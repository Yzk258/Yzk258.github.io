import type { CollectionEntry } from "astro:content";
import { isPublished } from "./posts";
import { slugify } from "./slug";

export type Tag = {
  /** URL 里用的 slug，例如 "建站" → "建站"（中文原样保留） */
  tag: string;
  /** 页面上显示的原文，例如 "建站" */
  tagName: string;
};

/**
 * 从文章列表里汇总出全部标签。
 *
 * 用 `isPublished` 过滤而不是上游的 `postFilter` —— 前者除了草稿还会排除
 * 发布时间还没到的文章，与列表页、首页保持一致，否则会出现
 * 「标签页里有这篇文章、列表页却没有」的错位。
 *
 * 去重按 slug 判断，所以大小写不同、空格不同的标签会合并成一个。
 */
export function getUniqueTags(posts: CollectionEntry<"posts">[]): Tag[] {
  return posts
    .filter(isPublished)
    .flatMap(post => post.data.tags)
    .map(tag => ({ tag: slugify(tag), tagName: tag }))
    .filter(
      (value, index, self) =>
        self.findIndex(item => item.tag === value.tag) === index
    )
    .sort((a, b) => a.tag.localeCompare(b.tag, "zh-CN"));
}

/**
 * 判断一篇文章是否属于某个标签。
 *
 * 同样按 slug 比较，这样文章里写 "Astro"、链接里是 "astro" 也能匹配上。
 */
export function postHasTag(
  post: CollectionEntry<"posts">,
  tagSlug: string
): boolean {
  return post.data.tags.some(tag => slugify(tag) === tagSlug);
}
