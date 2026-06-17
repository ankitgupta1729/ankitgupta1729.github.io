// Seed community data for showcase/demo purposes. These are sample members
// and discussions used to demonstrate the comment, reaction and forum
// features. They are clearly labelled as a demo in the UI. Real, persistent
// discussion runs through Giscus (GitHub Discussions) once configured.

export interface Member {
  handle: string;
  name: string;
  role: string;
  bio: string;
  joined: string; // ISO date
  contributions: number;
}

export interface Comment {
  article: string | "general"; // article id, or "general" for the community wall
  handle: string;
  body: string;
  likes: number;
  postedAt: string; // ISO datetime
  replies?: { handle: string; body: string; likes: number; postedAt: string }[];
}

export const MEMBERS: Member[] = [
  { handle: "maya_codes", name: "Maya Rao", role: "ML Engineer", bio: "Trains models by day, breaks them by night. Loves a clean ablation study.", joined: "2026-01-12", contributions: 48 },
  { handle: "leo_thinks", name: "Leon Fischer", role: "Physics PhD", bio: "Quantum foundations, coffee, and explaining tensors to anyone who'll listen.", joined: "2026-01-20", contributions: 41 },
  { handle: "ananya.ds", name: "Ananya Iyer", role: "Data Scientist", bio: "Causal inference enthusiast. Will fight you about p-values (politely).", joined: "2026-02-03", contributions: 37 },
  { handle: "the_quant", name: "Sam Whitfield", role: "Quant Analyst", bio: "Markets, probability, and the eternal hunt for a free lunch.", joined: "2026-02-15", contributions: 33 },
  { handle: "crypto_kate", name: "Katarina Novak", role: "Security Researcher", bio: "Breaks crypto so you don't have to. Post-quantum curious.", joined: "2026-02-28", contributions: 29 },
  { handle: "histbuff", name: "Daniel Okafor", role: "Historian", bio: "Connecting dots between the printing press and the timeline.", joined: "2026-03-10", contributions: 24 },
  { handle: "bio_priya", name: "Priya Menon", role: "Biologist", bio: "CRISPR, immunology, and the elegance of living systems.", joined: "2026-03-22", contributions: 21 },
  { handle: "mathjoy", name: "Yuki Tanaka", role: "Maths Teacher", bio: "Convinced everyone can love proofs with the right story.", joined: "2026-04-01", contributions: 19 },
  { handle: "devraj", name: "Raj Sharma", role: "Software Engineer", bio: "Distributed systems and the occasional Tailwind rabbit hole.", joined: "2026-04-14", contributions: 16 },
  { handle: "skye_writes", name: "Skye Bennett", role: "Science Writer", bio: "Making hard ideas feel obvious in retrospect.", joined: "2026-04-30", contributions: 14 },
];

export const COMMENTS: Comment[] = [
  {
    article: "monty-hall-problem",
    handle: "mathjoy",
    body: "I've taught this for years and the simulator is the single best way to convince a skeptical class. Ran it 1,000× live and the 67% just appears. Saving this!",
    likes: 27,
    postedAt: "2026-06-08T09:14:00Z",
    replies: [
      { handle: "ananya.ds", body: "Same — the 100-door framing finally made it click for me as a student. Information from the host is everything.", likes: 9, postedAt: "2026-06-08T11:02:00Z" },
    ],
  },
  {
    article: "monty-hall-problem",
    handle: "devraj",
    body: "Wrote a quick Python sim to double-check and yep, switching ~0.667. Intuition is humbled once again 😅",
    likes: 12,
    postedAt: "2026-06-09T15:40:00Z",
  },
  {
    article: "attention-is-all-you-need-explained",
    handle: "maya_codes",
    body: "Best plain-English explanation of Q/K/V I've sent to three junior teammates. The diagram alone is worth bookmarking.",
    likes: 34,
    postedAt: "2026-06-10T18:22:00Z",
    replies: [
      { handle: "skye_writes", body: "Agreed. 'What am I looking for / what do I offer / what do I carry' is such a clean mental model.", likes: 6, postedAt: "2026-06-11T08:05:00Z" },
    ],
  },
  {
    article: "why-llms-hallucinate",
    handle: "maya_codes",
    body: "The 'optimizing for plausibility, not truth' line should be on a poster in every ML team's office.",
    likes: 22,
    postedAt: "2026-06-14T13:10:00Z",
  },
  {
    article: "bayes-theorem-updating-beliefs",
    handle: "ananya.ds",
    body: "The pictograph nails why base rates matter. I dragged the disease rate to 0.1% and watched the posterior collapse — chilling and clarifying.",
    likes: 18,
    postedAt: "2026-05-13T10:30:00Z",
  },
  {
    article: "compound-interest-eighth-wonder",
    handle: "the_quant",
    body: "Set monthly to $0 and just bumped the years — the curve does the talking. Time really is the dominant variable.",
    likes: 25,
    postedAt: "2026-05-29T07:48:00Z",
    replies: [
      { handle: "devraj", body: "The fee point hurt though. 2% sounds tiny until you see it eat a third of the final balance.", likes: 8, postedAt: "2026-05-29T09:12:00Z" },
    ],
  },
  {
    article: "quantum-entanglement-demystified",
    handle: "leo_thinks",
    body: "Finally an explainer that's honest about no-faster-than-light signalling. So many pop articles get this wrong. Bell's theorem section is spot on.",
    likes: 31,
    postedAt: "2026-06-03T20:15:00Z",
  },
  {
    article: "how-rsa-encryption-works",
    handle: "crypto_kate",
    body: "Nice intro. Would love a follow-up on why we're migrating to post-quantum — Shor's algorithm deserves its own piece.",
    likes: 15,
    postedAt: "2026-05-31T16:05:00Z",
  },
  {
    article: "crispr-rewriting-life",
    handle: "bio_priya",
    body: "As someone in the field: the somatic vs germline distinction is exactly the conversation we keep having. Great, balanced piece.",
    likes: 20,
    postedAt: "2026-05-26T12:00:00Z",
  },
  {
    article: "printing-press-changed-everything",
    handle: "histbuff",
    body: "The 'every information revolution follows the same arc' framing is so useful. The internet rhyming with 1450 — chef's kiss.",
    likes: 17,
    postedAt: "2026-05-19T14:25:00Z",
  },
  {
    article: "general",
    handle: "skye_writes",
    body: "Just found Polymath and I've lost an entire evening to the interactive widgets. The Monty Hall one is dangerously fun. 👏",
    likes: 19,
    postedAt: "2026-06-15T21:40:00Z",
    replies: [
      { handle: "maya_codes", body: "Welcome! Wait until you try the gradient-descent one with the learning rate cranked to max 💥", likes: 5, postedAt: "2026-06-15T22:10:00Z" },
    ],
  },
  {
    article: "general",
    handle: "the_quant",
    body: "Request: a piece on the Kelly criterion? Feels like a natural follow-up to the diversification article.",
    likes: 11,
    postedAt: "2026-06-16T08:30:00Z",
  },
];

export function memberByHandle(handle: string): Member | undefined {
  return MEMBERS.find((m) => m.handle === handle);
}

export function avatarUrl(handle: string): string {
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(handle)}&radius=50`;
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days > 30) return Math.floor(days / 30) + "mo ago";
  if (days > 0) return days + "d ago";
  const hrs = Math.floor(diff / 3600000);
  if (hrs > 0) return hrs + "h ago";
  return "just now";
}
