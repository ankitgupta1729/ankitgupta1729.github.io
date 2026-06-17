# Polymath 🧠

**Knowledge, beautifully organized.** A free, fast, open knowledge hub covering AI, machine learning, data science, mathematics, physics, cryptography, finance, science, technology, and history — with reactions, comments, and a community forum.

🔗 **Live site:** https://ankitgupta1729.github.io

Built by [Ankit Gupta](https://github.com/ankitgupta1729). Content is licensed CC BY 4.0; code is MIT.

---

## ✨ Features

- **Beautiful, responsive design** with light/dark mode and tasteful motion
- **Articles** in Markdown/MDX across 10 knowledge domains, with categories, tags, and reading time
- **Topic filtering & full-text search** (Pagefind — runs entirely in the browser, no server)
- **Reactions** (👍 👎 ❤️) and **threaded comments** on every article via [Giscus](https://giscus.app) (GitHub Discussions)
- **Community forum** backed by GitHub Discussions
- **Social sharing** (X, LinkedIn, WhatsApp, copy link) + RSS feed
- **SEO-ready**: Open Graph tags, JSON-LD, sitemap, canonical URLs
- **$0 hosting** on GitHub Pages, deployed automatically via GitHub Actions

## 🛠️ Tech stack

| Concern | Choice |
|---|---|
| Framework | [Astro 5](https://astro.build) (static output) |
| Styling | Tailwind CSS 4 + Typography plugin |
| Content | Markdown / MDX content collections |
| Search | [Pagefind](https://pagefind.app) |
| Comments | [Giscus](https://giscus.app) (GitHub Discussions) |
| Hosting | GitHub Pages (free) |
| CI/CD | GitHub Actions |

## 🚀 Local development

```bash
npm install
npm run dev      # start dev server at http://localhost:4321
npm run build    # build to ./dist and generate the search index
npm run preview  # preview the production build locally
```

## ✍️ Adding an article

Create a Markdown file in `src/content/blog/`:

```markdown
---
title: "Your Title"
description: "One or two sentence summary."
category: "ai"          # see slugs in src/consts.ts
tags: ["tag1", "tag2"]
pubDate: 2026-06-17
heroEmoji: "🤖"
featured: false          # set true to highlight on the home page
---

Your content here…
```

Then publish (see deployment below).

## 📦 Deployment

The live site is published to the **`gh-pages`** branch and served by GitHub Pages.
To rebuild and redeploy after changing content:

```bash
npm run deploy    # builds, generates the search index, and pushes ./dist to gh-pages
```

### Optional: enable fully automated CI deploys

A ready-made GitHub Actions workflow lives at `.github/deploy.yml.disabled`. Pushing
files under `.github/workflows/` requires a token with the `workflow` scope, so to
activate it once:

```bash
gh auth refresh -h github.com -s workflow      # one-time, opens browser
git mv .github/deploy.yml.disabled .github/workflows/deploy.yml
git add .github && git commit -m "Enable CI deploy" && git push
```

Then set **Settings → Pages → Source → GitHub Actions**. After that, every push to
`main` builds and deploys automatically — no manual step.

## 💬 Enabling comments (one-time setup)

Comments and reactions degrade gracefully until configured. To turn them on:

1. Make sure this repo is **public** and enable the **Discussions** tab (Settings → Features).
2. Install the **Giscus GitHub App**: https://github.com/apps/giscus → grant it access to this repo.
3. Visit https://giscus.app, enter the repo, and copy the generated `repo-id` and `category-id`.
4. Paste them into `GISCUS` in [`src/consts.ts`](src/consts.ts).
5. Commit & push. Done — every article and the forum now have live discussions.

## 🗄️ Data & storage (how "saving things" works)

The site is **static**, so there's no server to maintain — yet it still stores plenty:

| Need | Where it's stored | Notes |
|---|---|---|
| Likes, reactions, your own comments, reading list, newsletter intent | **Browser localStorage** | Instant, private to each visitor, zero cost. |
| Real, shared, persistent comments & reactions | **GitHub Discussions via Giscus** | The durable backend. Enable once (see above). |
| Demo community (members, sample threads) | `src/lib/community.ts` | Seed data, clearly labelled "Demo" in the UI. Edit freely. |

**Want true shared like counts** across all visitors? The 💙 like button on every article already supports [Supabase](https://supabase.com) (free tier). It uses a per-visitor localStorage fallback until you add keys — then counts go global automatically.

1. Create a Supabase project. In the SQL editor, run:

   ```sql
   create table article_likes (slug text primary key, likes int not null default 0);
   alter table article_likes enable row level security;
   create policy "read" on article_likes for select using (true);

   create or replace function toggle_like(article_slug text, delta int)
   returns int language plpgsql security definer as $$
   declare new_count int;
   begin
     insert into article_likes(slug, likes) values (article_slug, greatest(delta,0))
       on conflict (slug) do update set likes = greatest(article_likes.likes + delta, 0)
       returning likes into new_count;
     return new_count;
   end; $$;
   ```

2. Paste your project URL + anon key into `SUPABASE` in [`src/consts.ts`](src/consts.ts) and redeploy.

The anon key is safe to ship in a static site; RLS keeps data locked down. This is **optional** — Giscus + localStorage already cover comments, reactions and personalization for free.

## 🌐 Custom domain (optional)

GitHub Pages supports a custom domain for free (you only pay your registrar for the domain itself, ~$10/yr). Add a `CNAME` file in `public/` with your domain and configure DNS per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 📄 License

- **Code:** MIT
- **Content:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
