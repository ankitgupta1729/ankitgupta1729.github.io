import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import sharp from "sharp";
import { SITE, CATEGORIES } from "../../consts";

const categoryBySlugSafe = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug) ?? { name: slug, color: "#6366f1" };

export async function getStaticPaths() {
  const posts = (await getCollection("blog")).filter((p) => !p.data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      category: post.data.category,
    },
  }));
}

function escapeXml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

// Greedy word-wrap by approximate character budget per line.
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    trimmed[maxLines - 1] = trimmed[maxLines - 1].replace(/\s+\S*$/, "") + "…";
    return trimmed;
  }
  return lines;
}

export const GET: APIRoute = async ({ props }) => {
  const { title, category } = props as { title: string; category: string };
  const cat = categoryBySlugSafe(category);
  const lines = wrap(title, 26, 3);
  const startY = 300 - (lines.length - 1) * 38;

  const titleTspans = lines
    .map((l, i) => `<tspan x="80" y="${startY + i * 76}">${escapeXml(l)}</tspan>`)
    .join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b0f1a"/>
      <stop offset="1" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="120" r="260" fill="${cat.color}" opacity="0.16"/>
  <circle cx="160" cy="560" r="200" fill="#ec4899" opacity="0.10"/>
  <rect x="80" y="${startY - 88}" width="${Math.min(560, 110 + category.length * 16)}" height="44" rx="22" fill="${cat.color}" opacity="0.22"/>
  <text x="104" y="${startY - 57}" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" fill="#ffffff">${escapeXml(cat.name.toUpperCase())}</text>
  <text font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#ffffff">${titleTspans}</text>
  <g font-family="Helvetica, Arial, sans-serif">
    <circle cx="92" cy="560" r="22" fill="#6366f1"/>
    <text x="84" y="569" font-size="26" font-weight="800" fill="#ffffff">P</text>
    <text x="126" y="569" font-size="30" font-weight="800" fill="#ffffff">${escapeXml(SITE.name)}</text>
    <text x="1120" y="569" text-anchor="end" font-size="24" fill="#94a3b8">${escapeXml(SITE.urlShort)}</text>
  </g>
</svg>`.trim();

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" },
  });
};
