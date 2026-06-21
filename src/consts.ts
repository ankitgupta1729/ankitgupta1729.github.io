// Central site configuration. Edit values here to rebrand the whole site.

export const SITE = {
  name: "Polymath",
  tagline: "Knowledge, beautifully organized.",
  description:
    "Polymath is a free, open knowledge hub exploring AI, machine learning, data science, mathematics, physics, cryptography, finance, history, science and technology — with a community that discusses, questions and learns together.",
  url: "https://ankitgupta1729.github.io",
  urlShort: "ankitgupta1729.github.io",
  author: "Ankit Gupta",
  email: "ankitgupta1729@gmail.com",
  locale: "en",
};

// Optional: a real shared "likes" database via Supabase (free tier). Leave
// blank to use a per-visitor localStorage fallback (great for demo/showcase).
// When set, like counts are global and persist across all visitors.
// Setup SQL is documented in the README.
export const SUPABASE = {
  url: "https://bcgpurvuwmvljbqmaqwm.supabase.co",
  anonKey: "sb_publishable_zIXsjL-F4dixk81WlVwWkQ_rU6YclKM", // publishable/anon key — safe to ship; protected by RLS
};

// Login options. List ONLY the social providers you've actually enabled in
// Supabase (Authentication → Providers). Anything not listed here is hidden,
// so visitors never hit a "provider is not enabled" error page.
// e.g. once GitHub works, use: providers: ["github"]
export const AUTH = {
  emailPassword: true,
  providers: ["github", "google"] as ("google" | "github" | "facebook")[],
};

// In-browser AI assistant ("Ask Poly") — runs free, open-source chat models
// via Transformers.js entirely on the visitor's device. No API key, no cost.
// Picks the best model for the device: real Llama-3.2 when WebGPU is available,
// otherwise the smaller SmolLM2 (runs anywhere via WASM). Both are open-source
// instruct/chat models, so they answer conversationally (incl. "hi").
export const AI = {
  enabled: true,
  cdn: "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0",
  embedModel: "Xenova/all-MiniLM-L6-v2", // semantic search over articles (RAG)
  chatWebGPU: { model: "onnx-community/Llama-3.2-1B-Instruct", dtype: "q4f16" },
  chatWASM: { model: "HuggingFaceTB/SmolLM2-360M-Instruct", dtype: "q4" },
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

// Verified free Unsplash banner images for some categories (decorative,
// shown behind a gradient overlay). Categories without an entry keep the
// gradient-only header. Append `?w=1200&q=70&auto=format` when rendering.
export const CATEGORY_IMAGES: Record<string, string> = {
  mathematics: "photo-1635070041078-e363dbe005cb", // chalkboard equations
  physics: "photo-1517976487492-5750f3195933", // rocket launch
  science: "photo-1451187580459-43490279c0fa", // earth from space
};

export function unsplash(id: string, w = 1200): string {
  return `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;
}

export const NAV = [
  { name: "Home", href: "/" },
  { name: "Articles", href: "/blog" },
  { name: "Exams", href: "/exams" },
  { name: "Frontiers", href: "/frontiers" },
  { name: "Arcade", href: "/play" },
  { name: "Write", href: "/write" },
  { name: "About", href: "/about" },
];

// Competitive-exam prep hub. `slug` drives /exams/<slug>.
export const EXAMS = [
  { slug: "iit-jee", name: "IIT-JEE", icon: "🧮", color: "#6366f1", blurb: "Physics, Chemistry & Mathematics for JEE Main & Advanced.", subjects: ["Physics", "Chemistry", "Mathematics"] },
  { slug: "neet", name: "NEET", icon: "🧬", color: "#22c55e", blurb: "Biology, Physics & Chemistry for medical entrance.", subjects: ["Biology", "Physics", "Chemistry"] },
  { slug: "gate", name: "GATE", icon: "⚙️", color: "#0ea5e9", blurb: "Engineering, CS & maths for GATE.", subjects: ["Computer Science", "Mathematics", "ECE", "Mechanical"] },
  { slug: "isi-cmi", name: "ISI / CMI", icon: "📐", color: "#8b5cf6", blurb: "Statistics & mathematics olympiad-style entrance.", subjects: ["Mathematics", "Statistics"] },
  { slug: "cat", name: "CAT", icon: "📊", color: "#ec4899", blurb: "Quant, DILR & verbal for MBA admissions.", subjects: ["Quant", "DILR", "VARC"] },
  { slug: "upsc", name: "UPSC", icon: "🏛️", color: "#a16207", blurb: "Foundations for civil-services aspirants.", subjects: ["Polity", "History", "Economy", "Science & Tech"] },
];

export function examBySlug(slug: string) {
  return EXAMS.find((e) => e.slug === slug);
}

// Newsletter signup. The form works out-of-the-box with Buttondown's free
// plan: create an account at https://buttondown.com and set your username
// below. If left blank, the signup gracefully becomes an RSS/follow card so
// nothing is ever broken. (Mailchimp/ConvertKit also expose a POST URL —
// set `actionUrl` directly to use any provider.)
export const NEWSLETTER = {
  buttondownUser: "", // e.g. "ankitgupta" → posts to buttondown.com/api/...
  actionUrl: "", // optional: full form action URL for any provider (overrides buttondownUser)
  title: "Get one good idea a week",
  blurb:
    "A short, ad-free digest of new Polymath articles across AI, science, maths and more. No spam, unsubscribe anytime.",
};
