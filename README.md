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
npm run build
npx gh-pages -d dist -b gh-pages   # or push ./dist to the gh-pages branch
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

## 🌐 Custom domain (optional)

GitHub Pages supports a custom domain for free (you only pay your registrar for the domain itself, ~$10/yr). Add a `CNAME` file in `public/` with your domain and configure DNS per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 📄 License

- **Code:** MIT
- **Content:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
