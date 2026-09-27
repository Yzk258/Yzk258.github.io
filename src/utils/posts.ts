import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * 判断一篇文章是否应该出现在列表与构建产物中。
 *
 * - 草稿（draft: true）始终排除
 * - 生产环境下，发布时间还没到的文章先不显示
 * - 开发环境不做时间判断，方便提前预览
 */
export function isPublished({ data }: CollectionEntry<"posts">) {
  if (data.draft) return false;
  if (import.meta.env.DEV) return true;
  const publishAt =
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return Date.now() > publishAt;
}

/**
 * 按「最后修改时间」倒序排列，没有 modDatetime 就用发布时间。
 * 置顶（featured）的文章始终排在最前。
 */
export function sortPosts(posts: CollectionEntry<"posts">[]) {
  const timeOf = (post: CollectionEntry<"posts">) =>
    Math.floor(
      new Date(post.data.modDatetime ?? post.data.pubDatetime).getTime() / 1000
    );

  return [...posts].sort((a, b) => {
    if (a.data.featured !== b.data.featured) {
      return a.data.featured ? -1 : 1;
    }
    return timeOf(b) - timeOf(a);
  });
}

/** 过滤出可发布的文章并排序，列表页与首页都用这个 */
export function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  return sortPosts(posts.filter(isPublished));
}
