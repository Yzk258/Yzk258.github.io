import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/posts";
import { slugify } from "@/utils/slug";
import config from "@/config";

export async function GET(context: { site: URL | undefined }) {
  const posts = getSortedPosts(await getCollection("posts"));

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: context.site ?? config.site.url,
    customData: `<language>zh-cn</language>`,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.pubDatetime),
      link: `/posts/${slugify(post.id)}/`,
    })),
  });
}
