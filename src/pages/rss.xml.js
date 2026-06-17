import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "../consts";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: [post.data.category, ...post.data.tags],
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
