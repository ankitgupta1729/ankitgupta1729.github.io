// Central site configuration. Edit values here to rebrand the whole site.

export const SITE = {
  name: "Polymath",
  tagline: "Knowledge, beautifully organized.",
  description:
    "Polymath is a free, open knowledge hub exploring AI, machine learning, data science, mathematics, physics, cryptography, finance, history, science and technology — with a community that discusses, questions and learns together.",
  url: "https://ankitgupta1729.github.io",
  author: "Ankit Gupta",
  email: "ankitgupta1729@gmail.com",
  locale: "en",
};

// Used by Giscus comments. After you authorize the Giscus GitHub App and run
// the configurator at https://giscus.app, paste the generated repoId and
// categoryId here. Comments degrade gracefully until then.
export const GISCUS = {
  repo: "ankitgupta1729/ankitgupta1729.github.io",
  repoId: "", // <-- fill from giscus.app
  category: "Comments",
  categoryId: "", // <-- fill from giscus.app
};

export const SOCIAL = {
  github: "https://github.com/ankitgupta1729",
  // Update these to your real handles when ready — they render only if set.
  twitter: "https://twitter.com/",
  linkedin: "https://www.linkedin.com/",
  youtube: "",
  rss: "/rss.xml",
};

// The knowledge domains the site covers. `slug` drives /categories/<slug>.
export const CATEGORIES = [
  { slug: "ai", name: "Artificial Intelligence", icon: "🤖", color: "#6366f1", blurb: "From neural nets to agents and alignment." },
  { slug: "machine-learning", name: "Machine Learning", icon: "📈", color: "#0ea5e9", blurb: "Models, training, evaluation and intuition." },
  { slug: "data-science", name: "Data Science", icon: "🔬", color: "#14b8a6", blurb: "Turning messy data into honest insight." },
  { slug: "mathematics", name: "Mathematics", icon: "∑", color: "#8b5cf6", blurb: "The language that underpins everything." },
  { slug: "physics", name: "Physics", icon: "⚛️", color: "#ef4444", blurb: "How the universe actually works." },
  { slug: "cryptography", name: "Cryptography", icon: "🔐", color: "#f59e0b", blurb: "Secrets, trust and the math of privacy." },
  { slug: "finance", name: "Finance", icon: "💹", color: "#22c55e", blurb: "Markets, money and quantitative thinking." },
  { slug: "science", name: "Science", icon: "🧪", color: "#06b6d4", blurb: "Curiosity across biology, chemistry and beyond." },
  { slug: "technology", name: "Technology", icon: "💡", color: "#ec4899", blurb: "The tools reshaping how we live." },
  { slug: "history", name: "History", icon: "🏛️", color: "#a16207", blurb: "How we got here, and why it matters." },
];

export const NAV = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/blog" },
  { name: "Topics", href: "/categories" },
  { name: "Forum", href: "/forum" },
  { name: "Search", href: "/search" },
  { name: "About", href: "/about" },
];
