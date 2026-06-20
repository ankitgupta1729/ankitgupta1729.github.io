# Polymath 🧠

**Knowledge, beautifully organized.** A free, fast, open knowledge hub covering AI, machine learning, data science, mathematics, physics, cryptography, finance, science, technology, and history — with reactions, comments, and a community forum.

🔗 **Live site:** https://ankitgupta1729.github.io

Built by [Ankit Gupta](https://github.com/ankitgupta1729). Content is licensed CC BY 4.0; code is MIT.

---

## ✨ Features

- **Beautiful, responsive design** with light/dark mode and tasteful motion
- **Articles** in Markdown/MDX across 10 knowledge domains, with categories, tags, and reading time
- **Topic filtering & full-text search** (Pagefind — runs entirely in the browser, no server)
- **Custom comment system** — beautiful in-app threaded comments, replies, likes & sorting (Supabase-backed, with a local/demo fallback)
- **In-browser AI assistant ("Ask Poly")** — runs free Hugging Face models on-device via Transformers.js; retrieves relevant articles and writes grounded answers. No API key, no cost.
- **Reactions** (👍 👎 ❤️), per-article like counter, bookmarks & reading list
- **Community page + forum** with member profiles, leaderboard and activity feed
- **Social sharing** (X, LinkedIn, Facebook, Reddit, HN, Telegram, WhatsApp, email, native share) + RSS feed
- **Auto-generated social preview (OG) images** per article + SEO (JSON-LD, sitemap, canonical URLs)
- **$0 hosting** on GitHub Pages, deployed automatically via GitHub Actions

## 🛠️ Tech stack

| Concern | Choice |
|---|---|
| Framework | [Astro 5](https://astro.build) (static output) |
| Styling | Tailwind CSS 4 + Typography plugin |
| Content | Markdown / MDX content collections |
| Search | [Pagefind](https://pagefind.app) |
| Comments / likes | Custom UI + [Supabase](https://supabase.com) (optional) / localStorage |
| AI assistant | [Transformers.js](https://huggingface.co/docs/transformers.js) (on-device, free) |
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

## 💬 Comments (custom, no third party)

Every article and the forum use a **custom, in-app comment box** — threaded replies, likes, sorting and avatars. Out of the box it works immediately with sample discussion + your own comments saved in the browser. To make comments **shared and permanent across all visitors**, connect Supabase (free) — see the storage section below.

## 🤖 AI assistant ("Ask Poly")

A floating assistant on every page runs **free, open-source chat models entirely in the visitor's browser** via [Transformers.js](https://huggingface.co/docs/transformers.js) — no API key, no server, no cost. It picks the best model for the device: **Llama-3.2-1B-Instruct** on WebGPU (Chrome/Edge), or the lighter **SmolLM2-360M-Instruct** via WASM everywhere else. It embeds the article index on-device (`all-MiniLM-L6-v2`) for retrieval (RAG), then the chat model writes a grounded, conversational answer and cites the source articles. Greetings ("hi") get an instant reply; real questions load the model once (cached afterwards). Configure or disable via `AI` in [`src/consts.ts`](src/consts.ts).

## 🗄️ Data & storage (how "saving things" works)

The site is **static**, so there's no server to maintain — yet it still stores plenty:

| Need | Where it's stored | Notes |
|---|---|---|
| Reactions, your own comments, likes, reading list, newsletter intent | **Browser localStorage** | Instant, private to each visitor, zero cost. |
| Shared, permanent comments & like counts | **Supabase** (optional, free tier) | Real database; off by default. |
| Demo community (members, sample threads) | `src/lib/community.ts` | Seed data, clearly labelled "Demo" in the UI. Edit freely. |

**Want shared comments + like counts** across all visitors? Add [Supabase](https://supabase.com) (free tier). The comment box and 💙 like button already support it — they use a per-visitor localStorage fallback until you add keys, then go global automatically.

1. Create a Supabase project. In the SQL editor, run:

   ```sql
   -- Likes
   create table article_likes (slug text primary key, likes int not null default 0);

   create or replace function toggle_like(article_slug text, delta int)
   returns int language plpgsql security definer as $$
   declare new_count int;
   begin
     insert into article_likes(slug, likes) values (article_slug, greatest(delta,0))
       on conflict (slug) do update set likes = greatest(article_likes.likes + delta, 0)
       returning likes into new_count;
     return new_count;
   end; $$;

   -- Comments
   create table comments (
     id uuid primary key default gen_random_uuid(),
     slug text not null,
     parent_id uuid references comments(id) on delete cascade,
     name text not null,
     avatar_url text,
     body text not null,
     likes int not null default 0,
     created_at timestamptz not null default now()
   );
   -- (if the table already exists, instead run:)
   -- alter table comments add column if not exists avatar_url text;
   alter table comments enable row level security;
   create policy "read"   on comments for select using (true);
   create policy "insert" on comments for insert with check (char_length(body) between 1 and 1000);

   create or replace function like_comment(comment_id uuid)
   returns void language sql security definer as $$
     update comments set likes = likes + 1 where id = comment_id;
   $$;

   -- User-written articles
   create table user_posts (
     id uuid primary key default gen_random_uuid(),
     author_id uuid,
     author_name text,
     title text not null,
     slug text,
     category text,
     tags text[],
     emoji text,
     body text not null,
     published boolean not null default false,
     created_at timestamptz not null default now()
   );
   alter table user_posts enable row level security;
   create policy "read published" on user_posts for select using (published or auth.uid() = author_id);
   create policy "insert own"      on user_posts for insert with check (auth.uid() = author_id);
   create policy "update own"      on user_posts for update using (auth.uid() = author_id);
   create policy "delete own"      on user_posts for delete using (auth.uid() = author_id);
   ```

2. Paste your project URL + anon key into `SUPABASE` in [`src/consts.ts`](src/consts.ts) and redeploy.

The anon key is safe to ship in a static site; RLS keeps data locked down. This is **optional** — localStorage + the demo seed already make comments and likes work out of the box.

### Community features SQL (profiles, leaderboard, feedback, bookmarks)

Run this once to power profile pages, the points leaderboard, the feedback board, and cross-device bookmarks. Everything degrades gracefully if you skip it.

```sql
-- Attribute comments to a user (for points). Existing rows stay anonymous.
alter table comments add column if not exists author_id uuid;

-- Profiles: one row per registered user
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text, avatar_url text, bio text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "read"       on profiles for select using (true);
create policy "upsert own" on profiles for insert with check (auth.uid() = id);
create policy "update own" on profiles for update using (auth.uid() = id);

-- Feedback / suggestions board
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  type text default 'suggestion',
  title text not null,
  body text,
  author_id uuid,
  author_name text,
  votes int not null default 0,
  status text default 'open',
  created_at timestamptz default now()
);
alter table feedback enable row level security;
create policy "read"   on feedback for select using (true);
create policy "insert" on feedback for insert with check (char_length(title) between 1 and 200);

create or replace function vote_feedback(fb_id uuid, delta int)
returns int language plpgsql security definer as $$
declare n int; begin
  update feedback set votes = greatest(votes + delta, 0) where id = fb_id returning votes into n;
  return n; end; $$;

-- Cross-device bookmarks
create table if not exists bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  slug text, title text, category text, emoji text, description text,
  created_at timestamptz default now(),
  primary key (user_id, slug)
);
alter table bookmarks enable row level security;
create policy "own" on bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Points leaderboard (posts ×10 + comments ×2 + feedback ×3)
create or replace function leaderboard()
returns table(id uuid, name text, avatar_url text, points bigint)
language sql security definer as $$
  select p.id, p.name, p.avatar_url,
    coalesce(po.c,0)*10 + coalesce(cm.c,0)*2 + coalesce(fb.c,0)*3 as points
  from profiles p
  left join (select author_id, count(*) c from user_posts where published group by author_id) po on po.author_id = p.id
  left join (select author_id, count(*) c from comments where author_id is not null group by author_id) cm on cm.author_id = p.id
  left join (select author_id, count(*) c from feedback group by author_id) fb on fb.author_id = p.id
  order by points desc nulls last limit 50;
$$;

-- Comment counts per article (for cards / trending)
create or replace function comment_counts()
returns table(slug text, n bigint)
language sql security definer as $$ select slug, count(*) from comments group by slug; $$;
```

**Editor image upload** also needs a public Storage bucket: Supabase → **Storage → New bucket** → name it `post-images` → toggle **Public** → Create.

## 🔐 Accounts & login (normal + social)

The header **Sign in** button and the `/write` editor use the same `SUPABASE` config above. With keys set, you get **real accounts**:

- **Email + password** registration and sign-in (Supabase Auth).
- **Social login** — Google, GitHub, Facebook (and more). Enable each provider in **Supabase → Authentication → Providers**, paste the provider's OAuth client ID/secret, and add your site URL to the allowed redirect list. No code changes needed — the buttons already call `signInWithOAuth`.

Without keys, the site runs in **demo mode**: accounts and articles are stored only in the visitor's browser (clearly labelled), so the full UX — sign-in modal, writing, publishing, "My posts" — works immediately for showcasing.

## ✍️ Writing articles

Signed-in users can visit **/write** to compose articles in a Markdown + LaTeX editor with a formatting toolbar and a live side-by-side preview (math via KaTeX, rendering via marked + DOMPurify). Posts appear under **/my-posts**; with Supabase they're saved to the `user_posts` table (and become a shared, global feed), otherwise they're kept locally.

## 🌐 Custom domain (optional)

GitHub Pages supports a custom domain for free (you only pay your registrar for the domain itself, ~$10/yr). Add a `CNAME` file in `public/` with your domain and configure DNS per [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 📄 License

- **Code:** MIT
- **Content:** [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
