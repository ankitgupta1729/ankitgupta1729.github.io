// Seed mock tests. Each quiz has MCQs with the correct index, an explanation,
// and a topic (used for per-topic performance feedback). Add freely.
export interface QQ {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  topic: string;
}
export interface Quiz {
  slug: string;
  title: string;
  exam: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  minutes: number;
  questions: QQ[];
}

export const QUIZZES: Quiz[] = [
  {
    slug: "jee-mechanics-1",
    title: "JEE Mechanics — Set 1",
    exam: "iit-jee",
    subject: "Physics",
    difficulty: "Medium",
    minutes: 10,
    questions: [
      { q: "A body rolls without slipping. The relation between v and ω is:", options: ["v = ω", "v = rω", "v = r/ω", "v = r²ω"], answer: 1, explain: "Rolling constraint: the contact point is instantaneously at rest, giving v = rω.", topic: "Rotation" },
      { q: "Which rolls down an incline fastest (from rest)?", options: ["Ring", "Hollow sphere", "Solid sphere", "Solid cylinder"], answer: 2, explain: "Smaller I/mr² ⇒ larger acceleration. Solid sphere has 2/5, the least here.", topic: "Rotation" },
      { q: "A 2 kg body under 10 N net force accelerates at:", options: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"], answer: 1, explain: "a = F/m = 10/2 = 5 m/s².", topic: "Newton's laws" },
      { q: "Angular momentum is conserved when:", options: ["No net force acts", "No net torque acts", "KE is constant", "Velocity is constant"], answer: 1, explain: "L is conserved if the net external torque is zero.", topic: "Rotation" },
      { q: "A projectile's horizontal velocity (no air resistance):", options: ["Increases", "Decreases", "Stays constant", "Becomes zero at top"], answer: 2, explain: "No horizontal force ⇒ horizontal velocity is constant throughout.", topic: "Kinematics" },
    ],
  },
  {
    slug: "gate-algorithms-1",
    title: "GATE CS — Algorithms Set 1",
    exam: "gate",
    subject: "Computer Science",
    difficulty: "Medium",
    minutes: 10,
    questions: [
      { q: "Time complexity of binary search on a sorted array of n elements:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1, explain: "Each step halves the search space ⇒ O(log n).", topic: "Complexity" },
      { q: "T(n) = 2T(n/2) + O(n) solves to:", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1, explain: "Master theorem case 2 (merge sort) ⇒ Θ(n log n).", topic: "Recurrences" },
      { q: "Worst-case time to search in a balanced BST:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], answer: 1, explain: "Balanced height is O(log n).", topic: "Data structures" },
      { q: "Which sort is NOT comparison-based?", options: ["Merge sort", "Quick sort", "Counting sort", "Heap sort"], answer: 2, explain: "Counting sort uses key values as indices, beating the O(n log n) comparison bound.", topic: "Sorting" },
      { q: "A hash table's average-case lookup is:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explain: "With good hashing and load factor, average lookup is O(1).", topic: "Data structures" },
    ],
  },
  {
    slug: "isi-combinatorics-1",
    title: "ISI/CMI — Combinatorics Set 1",
    exam: "isi-cmi",
    subject: "Mathematics",
    difficulty: "Hard",
    minutes: 12,
    questions: [
      { q: "Among any 13 integers, two share the same remainder mod 12 because:", options: ["They're consecutive", "Pigeonhole: 13 objects, 12 boxes", "12 is even", "They're prime"], answer: 1, explain: "13 numbers into 12 remainder-classes ⇒ two collide.", topic: "Pigeonhole" },
      { q: "Number of ways to choose 2 from 5 (order irrelevant):", options: ["10", "20", "25", "5"], answer: 0, explain: "C(5,2) = 5!/(2!3!) = 10.", topic: "Counting" },
      { q: "How many 3-digit numbers have all distinct digits (no leading zero)?", options: ["648", "720", "900", "504"], answer: 0, explain: "9 × 9 × 8 = 648.", topic: "Counting" },
      { q: "The minimum people to guarantee two share a birthday (ignoring Feb 29):", options: ["365", "366", "183", "23"], answer: 1, explain: "366 guarantees it by pigeonhole (365 boxes).", topic: "Pigeonhole" },
      { q: "Sum 1+2+…+n equals:", options: ["n²", "n(n+1)/2", "n(n-1)/2", "2ⁿ"], answer: 1, explain: "Gauss's formula: n(n+1)/2.", topic: "Series" },
    ],
  },
  {
    slug: "neet-biology-1",
    title: "NEET — Biology Set 1",
    exam: "neet",
    subject: "Biology",
    difficulty: "Easy",
    minutes: 8,
    questions: [
      { q: "The powerhouse of the cell is the:", options: ["Nucleus", "Mitochondrion", "Ribosome", "Golgi body"], answer: 1, explain: "Mitochondria produce ATP via cellular respiration.", topic: "Cell biology" },
      { q: "DNA replication is:", options: ["Conservative", "Semi-conservative", "Dispersive", "Random"], answer: 1, explain: "Meselson–Stahl showed replication is semi-conservative.", topic: "Genetics" },
      { q: "Which blood cells fight infection?", options: ["RBCs", "Platelets", "WBCs", "Plasma"], answer: 2, explain: "White blood cells (leukocytes) are the immune cells.", topic: "Human physiology" },
      { q: "Photosynthesis primarily occurs in the:", options: ["Mitochondria", "Chloroplast", "Nucleus", "Vacuole"], answer: 1, explain: "Chloroplasts contain chlorophyll and carry out photosynthesis.", topic: "Plant biology" },
      { q: "The basic unit of the nervous system is the:", options: ["Neuron", "Nephron", "Alveolus", "Villus"], answer: 0, explain: "Neurons transmit nerve impulses.", topic: "Human physiology" },
    ],
  },
];

export function quizBySlug(slug: string) {
  return QUIZZES.find((q) => q.slug === slug);
}
