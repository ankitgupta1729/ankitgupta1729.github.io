import { CATEGORIES } from "../consts";

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryName(slug: string): string {
  return categoryBySlug(slug)?.name ?? slug;
}
