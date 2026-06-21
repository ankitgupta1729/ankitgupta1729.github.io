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
  {
    slug: "jee-chemistry-1",
    title: "JEE Chemistry — Mole Concept & Bonding",
    exam: "iit-jee",
    subject: "Chemistry",
    difficulty: "Medium",
    minutes: 8,
    questions: [
      { q: "Number of atoms in 1 mole of any substance (Avogadro's number):", options: ["6.022 × 10²³", "3.14 × 10⁸", "9.81 × 10¹⁰", "1.6 × 10⁻¹⁹"], answer: 0, explain: "One mole contains 6.022 × 10²³ entities.", topic: "Mole concept" },
      { q: "Moles in 36 g of water (H₂O, M = 18 g/mol):", options: ["1", "2", "18", "36"], answer: 1, explain: "n = mass/M = 36/18 = 2 mol.", topic: "Mole concept" },
      { q: "Which bond is the strongest?", options: ["Single", "Double", "Triple", "All equal"], answer: 2, explain: "Triple bonds (e.g., N≡N) have the highest bond energy.", topic: "Bonding" },
      { q: "The shape of a CH₄ molecule is:", options: ["Linear", "Trigonal planar", "Tetrahedral", "Bent"], answer: 2, explain: "sp³ hybridisation gives a tetrahedral geometry (109.5°).", topic: "Bonding" },
      { q: "Oxidation number of S in H₂SO₄:", options: ["+2", "+4", "+6", "−2"], answer: 2, explain: "2(+1) + S + 4(−2) = 0 ⇒ S = +6.", topic: "Redox" },
    ],
  },
  {
    slug: "jee-calculus-1",
    title: "JEE Mathematics — Limits & Derivatives",
    exam: "iit-jee",
    subject: "Mathematics",
    difficulty: "Medium",
    minutes: 10,
    questions: [
      { q: "lim(x→0) sin(x)/x equals:", options: ["0", "1", "∞", "Undefined"], answer: 1, explain: "A standard limit: sin(x)/x → 1 as x → 0.", topic: "Limits" },
      { q: "d/dx (x³) =", options: ["3x²", "x²", "3x", "x⁴/4"], answer: 0, explain: "Power rule: d/dx xⁿ = n·xⁿ⁻¹.", topic: "Derivatives" },
      { q: "The derivative of eˣ is:", options: ["x·eˣ⁻¹", "eˣ", "ln x", "1/x"], answer: 1, explain: "eˣ is its own derivative.", topic: "Derivatives" },
      { q: "lim(x→∞) (1 + 1/x)ˣ equals:", options: ["1", "0", "e", "∞"], answer: 2, explain: "This limit defines Euler's number e ≈ 2.718.", topic: "Limits" },
      { q: "d/dx (sin x) =", options: ["cos x", "−cos x", "−sin x", "sec²x"], answer: 0, explain: "The derivative of sin x is cos x.", topic: "Derivatives" },
    ],
  },
  {
    slug: "cat-quant-1",
    title: "CAT — Quantitative Aptitude Set 1",
    exam: "cat",
    subject: "Quant",
    difficulty: "Medium",
    minutes: 9,
    questions: [
      { q: "If a shirt costs 800 after a 20% discount, its original price was:", options: ["960", "1000", "1024", "640"], answer: 1, explain: "0.8 × P = 800 ⇒ P = 1000.", topic: "Percentages" },
      { q: "Average of 10, 20, 30, 40, 50 is:", options: ["25", "30", "35", "150"], answer: 1, explain: "Sum 150 / 5 = 30.", topic: "Averages" },
      { q: "A train 120 m long at 36 km/h crosses a pole in:", options: ["6 s", "12 s", "10 s", "20 s"], answer: 1, explain: "36 km/h = 10 m/s; 120/10 = 12 s.", topic: "Speed & distance" },
      { q: "Ratio 3:4 means the second is what % more than the first?", options: ["25%", "33.3%", "75%", "133%"], answer: 1, explain: "(4−3)/3 = 33.3%.", topic: "Ratios" },
      { q: "Simple interest on 2000 at 5% for 2 years:", options: ["100", "200", "210", "500"], answer: 1, explain: "SI = PRT/100 = 2000·5·2/100 = 200.", topic: "Interest" },
    ],
  },
  {
    slug: "upsc-gs-1",
    title: "UPSC — General Studies Starter",
    exam: "upsc",
    subject: "Polity & History",
    difficulty: "Easy",
    minutes: 7,
    questions: [
      { q: "How many fundamental rights are guaranteed by the Indian Constitution (currently)?", options: ["5", "6", "7", "9"], answer: 1, explain: "Six fundamental rights (the right to property was removed in 1978).", topic: "Polity" },
      { q: "Who is called the 'Father of the Indian Constitution'?", options: ["Nehru", "Gandhi", "B. R. Ambedkar", "Patel"], answer: 2, explain: "Dr. B. R. Ambedkar chaired the drafting committee.", topic: "Polity" },
      { q: "The Quit India Movement was launched in:", options: ["1920", "1930", "1942", "1947"], answer: 2, explain: "Launched in August 1942 by the INC.", topic: "Modern history" },
      { q: "Which body conducts elections in India?", options: ["Parliament", "Supreme Court", "Election Commission", "RBI"], answer: 2, explain: "The Election Commission of India is the constitutional authority.", topic: "Polity" },
      { q: "The 'Tropic of Cancer' passes through how many Indian states?", options: ["5", "8", "10", "12"], answer: 1, explain: "It passes through 8 states.", topic: "Geography" },
    ],
  },
  {
    slug: "gate-ds-os-1",
    title: "GATE CS — Data Structures & OS",
    exam: "gate",
    subject: "Computer Science",
    difficulty: "Hard",
    minutes: 10,
    questions: [
      { q: "A stack follows which order?", options: ["FIFO", "LIFO", "Priority", "Random"], answer: 1, explain: "Stack = Last In, First Out.", topic: "Data structures" },
      { q: "Worst-case insertion in a singly linked list at the head:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explain: "Inserting at head is constant time.", topic: "Data structures" },
      { q: "Which causes a deadlock to be possible?", options: ["Mutual exclusion + hold-and-wait + no preemption + circular wait", "Only mutual exclusion", "Round-robin scheduling", "Paging"], answer: 0, explain: "All four Coffman conditions must hold simultaneously.", topic: "Operating systems" },
      { q: "A page fault occurs when:", options: ["CPU overheats", "A requested page is not in physical memory", "The disk is full", "A process exits"], answer: 1, explain: "The page must be fetched from secondary storage.", topic: "Operating systems" },
      { q: "Number of edges in a tree with n nodes:", options: ["n", "n−1", "n+1", "2n"], answer: 1, explain: "A tree with n nodes has exactly n−1 edges.", topic: "Graphs & trees" },
    ],
  },
  {
    slug: "neet-physics-1",
    title: "NEET — Physics Set 1",
    exam: "neet",
    subject: "Physics",
    difficulty: "Easy",
    minutes: 8,
    questions: [
      { q: "SI unit of force is the:", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 1, explain: "Force is measured in newtons (kg·m/s²).", topic: "Mechanics" },
      { q: "Acceleration due to gravity on Earth (approx):", options: ["9.8 m/s²", "98 m/s²", "1.6 m/s²", "0"], answer: 0, explain: "g ≈ 9.8 m/s² near Earth's surface.", topic: "Mechanics" },
      { q: "Ohm's law states V =", options: ["I/R", "IR", "I²R", "R/I"], answer: 1, explain: "Voltage = current × resistance.", topic: "Electricity" },
      { q: "Which has the longest wavelength?", options: ["Gamma rays", "Visible light", "Radio waves", "X-rays"], answer: 2, explain: "Radio waves have the longest wavelength in the EM spectrum.", topic: "Waves & optics" },
      { q: "The work done when force is perpendicular to displacement is:", options: ["Maximum", "Zero", "Negative", "Infinite"], answer: 1, explain: "W = Fd cosθ; cos90° = 0.", topic: "Mechanics" },
    ],
  },
];

export function quizBySlug(slug: string) {
  return QUIZZES.find((q) => q.slug === slug);
}
