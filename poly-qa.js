// Q&A data layer — works against Supabase when configured (window.polyDB),
// otherwise falls back to localStorage + a small demo seed so the whole
// doubts / previous-year-questions flow works offline/before setup.
//
// Doubts and Previous-Year Questions (PYQs) share the same questions/answers
// tables; a PYQ is just a question with kind:"pyq" plus year + subject.
// Any id beginning with "seed" is a curated starter item: it always lives in
// localStorage (browsable + answerable locally) even when the rest of the site
// is live, so the PYQ bank is never empty and never depends on the DB columns.
window.PolyQA = (function () {
  const LSQ = "doubtsQ6"; // bumped when the seed set changes (now ~105 PYQs, 2004-2024)
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const isSeed = (id) => typeof id === "string" && id.indexOf("seed") === 0;
  async function db() { return window.polyDB ? await window.polyDB() : null; }

  function seed() {
    const t = (d) => new Date(Date.now() - d * 86400000).toISOString();
    const qs = [
      // ── Doubts ──────────────────────────────────────────────
      { id: "seed-q1", kind: "doubt", title: "Why does a solid sphere beat a ring rolling down an incline?", body: "Both start from rest at the same height. I get that energy is conserved, but why does the sphere always win regardless of mass or radius?", author_name: "Aarav", exam: "iit-jee", tags: ["mechanics", "rotation"], votes: 7, status: "solved", accepted_answer_id: "seed-a1", created_at: t(4) },
      { id: "seed-q2", kind: "doubt", title: "GATE: How to quickly identify the time complexity of nested loops?", body: "When loops depend on each other (inner loop runs to `i`), I get confused. Any reliable method?", author_name: "Priya", exam: "gate", tags: ["algorithms", "complexity"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(2) },

      // ── Previous-Year Questions: GATE ───────────────────────
      { id: "seed-pyq1", kind: "pyq", year: 2021, subject: "Computer Science", title: "GATE CSE 2021: Solve the recurrence T(n) = 2T(n/2) + n", body: "Consider the recurrence $T(n) = 2\\,T(n/2) + n$ with $T(1)=1$. What is the asymptotic time complexity of $T(n)$?\n\n*(GATE CSE 2021, 1 mark)*", author_name: "PYQ Bank", exam: "gate", tags: ["recurrence", "master-theorem", "algorithms"], votes: 12, status: "solved", accepted_answer_id: "seed-pa1", created_at: t(40) },
      { id: "seed-pyq5", kind: "pyq", year: 2020, subject: "Computer Science", title: "GATE CSE 2020: Max elements in a binary heap of height h", body: "A binary heap is stored as an array. What is the **maximum** number of elements in a binary heap of height $h$ (root at height 0)?\n\n*(GATE CSE 2020)*", author_name: "PYQ Bank", exam: "gate", tags: ["heap", "data-structures"], votes: 6, status: "solved", accepted_answer_id: "seed-pa5", created_at: t(38) },
      { id: "seed-pyq7", kind: "pyq", year: 2022, subject: "Computer Science", title: "GATE CSE 2022: The four necessary conditions for deadlock", body: "State the four **necessary** (Coffman) conditions that must hold simultaneously for a deadlock to occur in an operating system.\n\n*(GATE CSE 2022, Operating Systems)*", author_name: "PYQ Bank", exam: "gate", tags: ["operating-systems", "deadlock"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(36) },
      { id: "seed-pyq8", kind: "pyq", year: 2019, subject: "Computer Science", title: "GATE CSE 2019: Candidate key from functional dependencies", body: "Consider relation $R(A,B,C,D)$ with functional dependencies $A\\to B,\\ B\\to C,\\ C\\to D$. What is the candidate key of $R$?\n\n*(GATE CSE 2019, DBMS)*", author_name: "PYQ Bank", exam: "gate", tags: ["dbms", "normalization", "candidate-key"], votes: 4, status: "solved", accepted_answer_id: "seed-pa8", created_at: t(34) },
      { id: "seed-pyq9", kind: "pyq", year: 2023, subject: "Computer Science", title: "GATE CSE 2023: Is L = { aⁿbⁿ : n ≥ 0 } regular?", body: "Is the language $L = \\{a^n b^n : n \\ge 0\\}$ regular? Justify your answer.\n\n*(GATE CSE 2023, Theory of Computation)*", author_name: "PYQ Bank", exam: "gate", tags: ["toc", "pumping-lemma", "regular-languages"], votes: 6, status: "open", accepted_answer_id: null, created_at: t(33) },
      { id: "seed-pyq10", kind: "pyq", year: 2024, subject: "Mathematics", title: "GATE 2024: Eigenvalues of [[2,1],[1,2]]", body: "Find the eigenvalues of the matrix $\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$.\n\n*(GATE 2024, Engineering Mathematics — Linear Algebra)*", author_name: "PYQ Bank", exam: "gate", tags: ["linear-algebra", "eigenvalues"], votes: 4, status: "solved", accepted_answer_id: "seed-pa10", created_at: t(31) },
      { id: "seed-pyq11", kind: "pyq", year: 2018, subject: "ECE", title: "GATE 2018: Simplify the Boolean expression AB + A(B + C) + B(B + C)", body: "Simplify the Boolean expression $AB + A(B+C) + B(B+C)$ to its minimal sum-of-products form.\n\n*(GATE 2018, Digital Logic)*", author_name: "PYQ Bank", exam: "gate", tags: ["digital-logic", "boolean-algebra"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(29) },

      // ── Previous-Year Questions: IIT-JEE ────────────────────
      { id: "seed-pyq2", kind: "pyq", year: 2019, subject: "Physics", title: "JEE Advanced 2019: Minimum speed at the top of a vertical circle", body: "A small ball of mass $m$ is attached to a light string and whirled in a **vertical circle** of radius $R$. What is the minimum speed at the **top** of the circle so the string stays taut?\n\n*(JEE Advanced 2019, Mechanics)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["circular-motion", "mechanics"], votes: 9, status: "solved", accepted_answer_id: "seed-pa2", created_at: t(28) },
      { id: "seed-pyq6", kind: "pyq", year: 2023, subject: "Chemistry", title: "JEE Main 2023: Moles of O atoms in 0.25 mol of CO₂", body: "How many moles of oxygen **atoms** are present in $0.25\\ \\text{mol}$ of $\\mathrm{CO_2}$?\n\n*(JEE Main 2023, Physical Chemistry — mole concept)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["mole-concept", "chemistry"], votes: 5, status: "solved", accepted_answer_id: "seed-pa6", created_at: t(26) },
      { id: "seed-pyq12", kind: "pyq", year: 2024, subject: "Physics", title: "JEE Main 2024: Angle for maximum projectile range", body: "A projectile is launched from level ground with a fixed speed $v$. At what launch angle is the **horizontal range** maximum, and what is that maximum range?\n\n*(JEE Main 2024, Kinematics)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["projectile", "kinematics"], votes: 6, status: "solved", accepted_answer_id: "seed-pa12", created_at: t(24) },
      { id: "seed-pyq13", kind: "pyq", year: 2022, subject: "Mathematics", title: "JEE Advanced 2022: Sum and product of roots", body: "If $\\alpha$ and $\\beta$ are the roots of $2x^2 - 5x + 3 = 0$, find $\\alpha + \\beta$ and $\\alpha\\beta$, and hence $\\alpha^2 + \\beta^2$.\n\n*(JEE Advanced 2022, Quadratic Equations)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["quadratic", "algebra"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(22) },
      { id: "seed-pyq14", kind: "pyq", year: 2021, subject: "Physics", title: "JEE Main 2021: Energy stored in a charged capacitor", body: "A capacitor of capacitance $C$ is charged to a potential difference $V$. Write the expression for the energy stored, and find the energy if $C = 2\\ \\mu F$ and $V = 100\\ \\text{V}$.\n\n*(JEE Main 2021, Electrostatics)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["capacitor", "electrostatics"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(20) },
      { id: "seed-pyq15", kind: "pyq", year: 2020, subject: "Chemistry", title: "JEE Main 2020: pH of 0.001 M HCl", body: "What is the pH of a $0.001\\ \\text{M}$ aqueous solution of HCl at 25 °C?\n\n*(JEE Main 2020, Ionic Equilibrium)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["ph", "equilibrium", "chemistry"], votes: 4, status: "solved", accepted_answer_id: "seed-pa15", created_at: t(18) },
      { id: "seed-pyq16", kind: "pyq", year: 2018, subject: "Mathematics", title: "JEE Advanced 2018: Evaluate ∫₀^(π/2) sin²x dx", body: "Evaluate the definite integral $\\displaystyle\\int_0^{\\pi/2} \\sin^2 x \\, dx$.\n\n*(JEE Advanced 2018, Integral Calculus)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["integration", "calculus"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(17) },

      // ── Previous-Year Questions: NEET ───────────────────────
      { id: "seed-pyq17", kind: "pyq", year: 2023, subject: "Biology", title: "NEET 2023: Phenotypic ratio of a monohybrid cross", body: "In a monohybrid cross between two heterozygous tall pea plants $(Tt \\times Tt)$, what is the expected **phenotypic** ratio in the F₂ generation?\n\n*(NEET 2023, Genetics)*", author_name: "PYQ Bank", exam: "neet", tags: ["genetics", "mendel"], votes: 7, status: "solved", accepted_answer_id: "seed-pa17", created_at: t(25) },
      { id: "seed-pyq18", kind: "pyq", year: 2022, subject: "Biology", title: "NEET 2022: Chargaff's rule for DNA base composition", body: "If a double-stranded DNA molecule has 20% adenine, what are the percentages of thymine, guanine and cytosine according to **Chargaff's rule**?\n\n*(NEET 2022, Molecular Biology)*", author_name: "PYQ Bank", exam: "neet", tags: ["dna", "molecular-biology"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(23) },
      { id: "seed-pyq19", kind: "pyq", year: 2021, subject: "Physics", title: "NEET 2021: Image distance from the lens formula", body: "An object is placed $30\\ \\text{cm}$ in front of a convex lens of focal length $20\\ \\text{cm}$. Find the position and nature of the image.\n\n*(NEET 2021, Ray Optics)*", author_name: "PYQ Bank", exam: "neet", tags: ["optics", "lens"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(21) },
      { id: "seed-pyq20", kind: "pyq", year: 2024, subject: "Chemistry", title: "NEET 2024: Hybridization of carbon in ethyne (C₂H₂)", body: "What is the hybridization of each carbon atom in ethyne (acetylene), $\\mathrm{H{-}C{\\equiv}C{-}H}$?\n\n*(NEET 2024, Chemical Bonding)*", author_name: "PYQ Bank", exam: "neet", tags: ["hybridization", "bonding"], votes: 5, status: "solved", accepted_answer_id: "seed-pa20", created_at: t(19) },
      { id: "seed-pyq21", kind: "pyq", year: 2020, subject: "Biology", title: "NEET 2020: Site of the light reaction of photosynthesis", body: "In which part of the chloroplast does the **light reaction** of photosynthesis take place?\n\n*(NEET 2020, Plant Physiology)*", author_name: "PYQ Bank", exam: "neet", tags: ["photosynthesis", "plant-physiology"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(16) },

      // ── Previous-Year Questions: ISI / CMI ──────────────────
      { id: "seed-pyq4", kind: "pyq", year: 2018, subject: "Mathematics", title: "ISI B.Stat 2018: Number of diagonals of a convex polygon", body: "How many diagonals does a convex polygon with $n$ sides have? Derive the formula.\n\n*(ISI B.Stat entrance, Combinatorics)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["combinatorics", "counting"], votes: 5, status: "solved", accepted_answer_id: "seed-pa4", created_at: t(27) },
      { id: "seed-pyq22", kind: "pyq", year: 2022, subject: "Mathematics", title: "ISI/CMI 2022: Trailing zeros of 100!", body: "How many trailing zeros does $100!$ (100 factorial) have when written in decimal?\n\n*(ISI/CMI entrance, Number Theory)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["number-theory", "factorials"], votes: 6, status: "solved", accepted_answer_id: "seed-pa22", created_at: t(24) },
      { id: "seed-pyq23", kind: "pyq", year: 2020, subject: "Statistics", title: "ISI 2020: Probability of at least one six in four throws", body: "A fair die is thrown 4 times. What is the probability of getting **at least one** six?\n\n*(ISI entrance, Probability)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["probability", "statistics"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(15) },
      { id: "seed-pyq24", kind: "pyq", year: 2023, subject: "Mathematics", title: "CMI 2023: Evaluate the limit of (1 + 1/n)ⁿ", body: "Evaluate $\\displaystyle\\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^{n}$ and name the constant it converges to.\n\n*(CMI entrance, Sequences & Limits)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["limits", "sequences"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(13) },

      // ── Previous-Year Questions: CAT ────────────────────────
      { id: "seed-pyq3", kind: "pyq", year: 2022, subject: "Quant", title: "CAT 2022: Successive percentage change in price", body: "The price of an article is first increased by 20% and then decreased by 20%. What is the net percentage change in the price?\n\n*(CAT 2022, Arithmetic)*", author_name: "PYQ Bank", exam: "cat", tags: ["percentages", "arithmetic"], votes: 8, status: "solved", accepted_answer_id: "seed-pa3", created_at: t(23) },
      { id: "seed-pyq25", kind: "pyq", year: 2023, subject: "Quant", title: "CAT 2023: When do two approaching trains meet?", body: "Two trains are $120\\ \\text{km}$ apart and move toward each other at $40\\ \\text{km/h}$ and $20\\ \\text{km/h}$. After how long do they meet?\n\n*(CAT 2023, Time–Speed–Distance)*", author_name: "PYQ Bank", exam: "cat", tags: ["time-speed-distance", "arithmetic"], votes: 6, status: "solved", accepted_answer_id: "seed-pa25", created_at: t(21) },
      { id: "seed-pyq26", kind: "pyq", year: 2021, subject: "Quant", title: "CAT 2021: Profit percentage from a CP:SP ratio", body: "If the ratio of the cost price to the selling price of an article is $4:5$, what is the profit percentage?\n\n*(CAT 2021, Profit & Loss)*", author_name: "PYQ Bank", exam: "cat", tags: ["profit-loss", "ratio"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(14) },
      { id: "seed-pyq27", kind: "pyq", year: 2024, subject: "DILR", title: "CAT 2024: Seating arrangement deduction", body: "Five friends A, B, C, D, E sit in a row. A is not at either end, B is immediately to the right of A, and C is at the left end. List one valid arrangement and explain your reasoning.\n\n*(CAT 2024, Logical Reasoning)*", author_name: "PYQ Bank", exam: "cat", tags: ["logical-reasoning", "arrangements"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(11) },

      // ── Previous-Year Questions: UPSC ───────────────────────
      { id: "seed-pyq28", kind: "pyq", year: 2022, subject: "Polity", title: "UPSC Prelims 2022: Which writ secures release from unlawful detention?", body: "Which constitutional writ is issued by a court to secure the release of a person who has been **unlawfully detained**?\n\n*(UPSC CSE Prelims 2022, Indian Polity)*", author_name: "PYQ Bank", exam: "upsc", tags: ["polity", "writs", "fundamental-rights"], votes: 6, status: "solved", accepted_answer_id: "seed-pa28", created_at: t(22) },
      { id: "seed-pyq29", kind: "pyq", year: 2021, subject: "Economy", title: "UPSC Prelims 2021: What does fiscal deficit measure?", body: "Define **fiscal deficit**. How does it differ from the revenue deficit?\n\n*(UPSC CSE Prelims 2021, Indian Economy)*", author_name: "PYQ Bank", exam: "upsc", tags: ["economy", "public-finance"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(12) },
      { id: "seed-pyq30", kind: "pyq", year: 2023, subject: "Science & Tech", title: "UPSC Prelims 2023: Chandrayaan-3 landing region", body: "Near which region of the Moon did India's **Chandrayaan-3** mission soft-land its Vikram lander in 2023, making India the first country to do so?\n\n*(UPSC CSE Prelims 2023, Science & Technology)*", author_name: "PYQ Bank", exam: "upsc", tags: ["science-tech", "space"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(9) },

      // ── Batch 2: more GATE ──────────────────────────────────
      { id: "seed-pyq31", kind: "pyq", year: 2017, subject: "Computer Science", title: "GATE CSE 2017: Does Dijkstra work with negative edge weights?", body: "Can Dijkstra's shortest-path algorithm be used correctly on a graph with **negative edge weights**? Justify, and name an algorithm that handles them.\n\n*(GATE CSE 2017, Algorithms)*", author_name: "PYQ Bank", exam: "gate", tags: ["graphs", "shortest-path", "algorithms"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(35) },
      { id: "seed-pyq32", kind: "pyq", year: 2021, subject: "Computer Science", title: "GATE CSE 2021: Page faults with FIFO replacement", body: "A process is given 3 frames. For the reference string $1,2,3,4,1,2,5,1,2,3,4,5$, how many page faults occur under **FIFO** page replacement?\n\n*(GATE CSE 2021, Operating Systems)*", author_name: "PYQ Bank", exam: "gate", tags: ["operating-systems", "paging"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(32) },
      { id: "seed-pyq33", kind: "pyq", year: 2019, subject: "Mathematics", title: "GATE 2019: Probability that two dice sum to 7", body: "Two fair dice are rolled. What is the probability that the sum of the numbers shown is exactly $7$?\n\n*(GATE 2019, Probability)*", author_name: "PYQ Bank", exam: "gate", tags: ["probability"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(28) },

      // ── Batch 2: more IIT-JEE ───────────────────────────────
      { id: "seed-pyq34", kind: "pyq", year: 2020, subject: "Physics", title: "JEE Main 2020: Time period of a simple pendulum", body: "A simple pendulum has length $L = 1\\ \\text{m}$. Taking $g = \\pi^2\\ \\text{m/s}^2$, find its time period of oscillation.\n\n*(JEE Main 2020, Oscillations)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["shm", "oscillations"], votes: 5, status: "solved", accepted_answer_id: "seed-pa34", created_at: t(24) },
      { id: "seed-pyq35", kind: "pyq", year: 2024, subject: "Chemistry", title: "JEE Main 2024: Oxidation number of Mn in KMnO₄", body: "What is the oxidation number of manganese in potassium permanganate, $\\mathrm{KMnO_4}$?\n\n*(JEE Main 2024, Redox)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["redox", "oxidation-number"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(21) },
      { id: "seed-pyq36", kind: "pyq", year: 2019, subject: "Mathematics", title: "JEE Main 2019: Maximum value of f(x) = x(10 − x)", body: "Find the maximum value of $f(x) = x(10 - x)$ for real $x$, and the value of $x$ at which it occurs.\n\n*(JEE Main 2019, Application of Derivatives)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["maxima-minima", "calculus"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(19) },
      { id: "seed-pyq37", kind: "pyq", year: 2022, subject: "Physics", title: "JEE Main 2022: Two resistors in parallel", body: "Two resistors of $6\\ \\Omega$ and $3\\ \\Omega$ are connected in **parallel**. What is their equivalent resistance?\n\n*(JEE Main 2022, Current Electricity)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["circuits", "resistance"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(16) },

      // ── Batch 2: more NEET ──────────────────────────────────
      { id: "seed-pyq38", kind: "pyq", year: 2023, subject: "Chemistry", title: "NEET 2023: Number of chambers in the human heart", body: "How many chambers does the human heart have, and name them.\n\n*(NEET 2023, Human Physiology)*", author_name: "PYQ Bank", exam: "neet", tags: ["physiology", "circulation"], votes: 6, status: "solved", accepted_answer_id: "seed-pa38", created_at: t(22) },
      { id: "seed-pyq39", kind: "pyq", year: 2021, subject: "Chemistry", title: "NEET 2021: Electronic configuration of chlorine (Z = 17)", body: "Write the electronic configuration of a chlorine atom (atomic number $Z = 17$).\n\n*(NEET 2021, Atomic Structure)*", author_name: "PYQ Bank", exam: "neet", tags: ["atomic-structure", "configuration"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(17) },
      { id: "seed-pyq40", kind: "pyq", year: 2019, subject: "Physics", title: "NEET 2019: Work done by a constant force", body: "A constant force of $10\\ \\text{N}$ moves a body $5\\ \\text{m}$ in the direction of the force. How much work is done?\n\n*(NEET 2019, Work–Energy)*", author_name: "PYQ Bank", exam: "neet", tags: ["work-energy"], votes: 2, status: "open", accepted_answer_id: null, created_at: t(14) },

      // ── Batch 2: more ISI / CMI ─────────────────────────────
      { id: "seed-pyq41", kind: "pyq", year: 2021, subject: "Mathematics", title: "ISI 2021: Prove AM ≥ GM for two positive reals", body: "For positive reals $a$ and $b$, prove that $\\dfrac{a+b}{2} \\ge \\sqrt{ab}$, with equality iff $a = b$.\n\n*(ISI entrance, Inequalities)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["inequalities", "am-gm"], votes: 6, status: "solved", accepted_answer_id: "seed-pa41", created_at: t(20) },
      { id: "seed-pyq42", kind: "pyq", year: 2019, subject: "Mathematics", title: "ISI 2019: Last digit of 7^100", body: "What is the **units digit** (last digit) of $7^{100}$?\n\n*(ISI entrance, Number Theory)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["number-theory", "modular-arithmetic"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(13) },
      { id: "seed-pyq43", kind: "pyq", year: 2017, subject: "Statistics", title: "ISI 2017: Mean of first n natural numbers", body: "What is the arithmetic mean of the first $n$ natural numbers $1, 2, \\dots, n$?\n\n*(ISI entrance, Statistics)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["statistics", "averages"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(10) },

      // ── Batch 2: more CAT ───────────────────────────────────
      { id: "seed-pyq44", kind: "pyq", year: 2020, subject: "Quant", title: "CAT 2020: New average after a number joins", body: "The average of 10 numbers is $20$. If a new number is added and the average becomes $22$, what is the new number?\n\n*(CAT 2020, Averages)*", author_name: "PYQ Bank", exam: "cat", tags: ["averages", "arithmetic"], votes: 5, status: "solved", accepted_answer_id: "seed-pa44", created_at: t(18) },
      { id: "seed-pyq45", kind: "pyq", year: 2022, subject: "Quant", title: "CAT 2022: Simple interest on a principal", body: "Find the simple interest on $\\textrm{₹}8000$ at $5\\%$ per annum for $3$ years.\n\n*(CAT 2022, Simple & Compound Interest)*", author_name: "PYQ Bank", exam: "cat", tags: ["simple-interest", "arithmetic"], votes: 4, status: "solved", accepted_answer_id: "seed-pa45", created_at: t(15) },
      { id: "seed-pyq46", kind: "pyq", year: 2019, subject: "Quant", title: "CAT 2019: Remainder when 2^10 is divided by 7", body: "What is the remainder when $2^{10}$ is divided by $7$?\n\n*(CAT 2019, Number System)*", author_name: "PYQ Bank", exam: "cat", tags: ["remainders", "number-system"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(12) },
      { id: "seed-pyq47", kind: "pyq", year: 2023, subject: "VARC", title: "CAT 2023: Identify the odd sentence (para-coherence)", body: "Read these statements and decide which one does **not** fit a coherent paragraph: (1) Bees communicate the direction of food via a 'waggle dance'. (2) The angle of the dance encodes the food's bearing relative to the sun. (3) Honey is widely used as a natural sweetener. (4) The duration of the waggle signals distance. Which sentence is the odd one out, and why?\n\n*(CAT 2023, Verbal Ability)*", author_name: "PYQ Bank", exam: "cat", tags: ["verbal", "reasoning"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(8) },

      // ── Batch 2: more UPSC ──────────────────────────────────
      { id: "seed-pyq48", kind: "pyq", year: 2020, subject: "History", title: "UPSC Prelims 2020: Who started the Champaran Satyagraha?", body: "Who led the **Champaran Satyagraha** of 1917, the first civil-disobedience movement in colonial India?\n\n*(UPSC CSE Prelims 2020, Modern History)*", author_name: "PYQ Bank", exam: "upsc", tags: ["modern-history", "freedom-movement"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(11) },
      { id: "seed-pyq49", kind: "pyq", year: 2022, subject: "Polity", title: "UPSC Prelims 2022: How many Schedules in the Constitution?", body: "How many **Schedules** does the Constitution of India currently have?\n\n*(UPSC CSE Prelims 2022, Indian Polity)*", author_name: "PYQ Bank", exam: "upsc", tags: ["polity", "constitution"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(7) },
      { id: "seed-pyq50", kind: "pyq", year: 2021, subject: "Economy", title: "UPSC Prelims 2021: What does GDP stand for?", body: "What does **GDP** stand for, and does it count goods produced by a country's citizens abroad?\n\n*(UPSC CSE Prelims 2021, Indian Economy)*", author_name: "PYQ Bank", exam: "upsc", tags: ["economy", "national-income"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(6) },

      // ── Batch 3: GATE ───────────────────────────────────────
      { id: "seed-pyq51", kind: "pyq", year: 2016, subject: "Computer Science", title: "GATE CSE 2016: How many segments in a TCP three-way handshake?", body: "How many segments are exchanged in the TCP **three-way handshake** to establish a connection, and what are their flags?\n\n*(GATE CSE 2016, Networks)*", author_name: "PYQ Bank", exam: "gate", tags: ["networks", "tcp"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(34) },
      { id: "seed-pyq52", kind: "pyq", year: 2018, subject: "Computer Science", title: "GATE CSE 2018: Load factor of a hash table", body: "A hash table has $m = 1000$ slots and stores $n = 750$ keys. What is its **load factor** $\\alpha$?\n\n*(GATE CSE 2018, Hashing)*", author_name: "PYQ Bank", exam: "gate", tags: ["hashing", "data-structures"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(31) },
      { id: "seed-pyq53", kind: "pyq", year: 2022, subject: "Computer Science", title: "GATE CSE 2022: When is a relation in BCNF?", body: "State the condition for a relation to be in **Boyce–Codd Normal Form (BCNF)**.\n\n*(GATE CSE 2022, DBMS)*", author_name: "PYQ Bank", exam: "gate", tags: ["dbms", "normalization", "bcnf"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(29) },
      { id: "seed-pyq54", kind: "pyq", year: 2020, subject: "Mathematics", title: "GATE 2020: Rank of a 3×3 matrix of all ones", body: "What is the rank of the $3\\times 3$ matrix in which every entry equals $1$?\n\n*(GATE 2020, Linear Algebra)*", author_name: "PYQ Bank", exam: "gate", tags: ["linear-algebra", "rank"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(27) },
      { id: "seed-pyq55", kind: "pyq", year: 2019, subject: "Computer Science", title: "GATE CSE 2019: Average waiting time under SJF", body: "Three processes arrive at time 0 with burst times $6, 8, 7$. Under **non-preemptive Shortest-Job-First**, what is the average waiting time?\n\n*(GATE CSE 2019, OS scheduling)*", author_name: "PYQ Bank", exam: "gate", tags: ["operating-systems", "scheduling"], votes: 5, status: "solved", accepted_answer_id: "seed-pa55", created_at: t(25) },
      { id: "seed-pyq56", kind: "pyq", year: 2023, subject: "Computer Science", title: "GATE CSE 2023: Edges in a minimum spanning tree", body: "A connected undirected graph has $n = 8$ vertices. How many edges does any **spanning tree** of it have?\n\n*(GATE CSE 2023, Graph Theory)*", author_name: "PYQ Bank", exam: "gate", tags: ["graphs", "spanning-tree"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(23) },
      { id: "seed-pyq57", kind: "pyq", year: 2017, subject: "ECE", title: "GATE 2017: Nyquist rate for a 4 kHz signal", body: "A signal is band-limited to $4\\ \\text{kHz}$. What is the minimum (Nyquist) sampling rate needed to reconstruct it?\n\n*(GATE 2017, Signals & Systems)*", author_name: "PYQ Bank", exam: "gate", tags: ["signals", "sampling"], votes: 4, status: "solved", accepted_answer_id: "seed-pa57", created_at: t(21) },

      // ── Batch 3: IIT-JEE ────────────────────────────────────
      { id: "seed-pyq58", kind: "pyq", year: 2023, subject: "Physics", title: "JEE Advanced 2023: Escape velocity from Earth's surface", body: "Write the formula for **escape velocity** from a planet of mass $M$ and radius $R$, and estimate its value for Earth ($g = 9.8\\ \\text{m/s}^2$, $R = 6.4\\times10^6\\ \\text{m}$).\n\n*(JEE Advanced 2023, Gravitation)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["gravitation", "escape-velocity"], votes: 6, status: "solved", accepted_answer_id: "seed-pa58", created_at: t(33) },
      { id: "seed-pyq59", kind: "pyq", year: 2021, subject: "Mathematics", title: "JEE Main 2021: Sum of the first 20 natural numbers", body: "Find the sum of the first $20$ terms of the arithmetic progression $1, 2, 3, \\dots$\n\n*(JEE Main 2021, Sequences & Series)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["ap", "series"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(30) },
      { id: "seed-pyq60", kind: "pyq", year: 2020, subject: "Physics", title: "JEE Main 2020: Apparent frequency (Doppler effect)", body: "A source emitting sound of frequency $f$ moves toward a stationary observer at speed $v_s$. Write the expression for the **apparent frequency** heard (speed of sound $= v$).\n\n*(JEE Main 2020, Waves)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["waves", "doppler"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(28) },
      { id: "seed-pyq61", kind: "pyq", year: 2024, subject: "Mathematics", title: "JEE Main 2024: Derivative of sin(x²)", body: "Differentiate $y = \\sin(x^2)$ with respect to $x$.\n\n*(JEE Main 2024, Differential Calculus)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["differentiation", "chain-rule"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(26) },
      { id: "seed-pyq62", kind: "pyq", year: 2019, subject: "Chemistry", title: "JEE Main 2019: Atoms in 12 g of carbon-12", body: "How many carbon atoms are present in exactly $12\\ \\text{g}$ of carbon-12?\n\n*(JEE Main 2019, Mole Concept)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["mole-concept", "avogadro"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(24) },
      { id: "seed-pyq63", kind: "pyq", year: 2022, subject: "Chemistry", title: "JEE Main 2022: Group of an element with config [Ne]3s²3p⁵", body: "An element has the electronic configuration $[\\mathrm{Ne}]\\,3s^2 3p^5$. To which group and period of the periodic table does it belong, and what is it?\n\n*(JEE Main 2022, Periodic Table)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["periodic-table", "configuration"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(22) },
      { id: "seed-pyq64", kind: "pyq", year: 2018, subject: "Physics", title: "JEE Main 2018: Power dissipated in a resistor", body: "A current of $2\\ \\text{A}$ flows through a $5\\ \\Omega$ resistor. What is the power dissipated?\n\n*(JEE Main 2018, Current Electricity)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["circuits", "power"], votes: 4, status: "solved", accepted_answer_id: "seed-pa64", created_at: t(20) },

      // ── Batch 3: NEET ───────────────────────────────────────
      { id: "seed-pyq65", kind: "pyq", year: 2024, subject: "Biology", title: "NEET 2024: Net ATP yield from glycolysis", body: "What is the **net** gain of ATP molecules per glucose molecule during glycolysis?\n\n*(NEET 2024, Respiration)*", author_name: "PYQ Bank", exam: "neet", tags: ["respiration", "glycolysis"], votes: 6, status: "solved", accepted_answer_id: "seed-pa65", created_at: t(31) },
      { id: "seed-pyq66", kind: "pyq", year: 2022, subject: "Physics", title: "NEET 2022: Resistance and length of a wire", body: "If a wire of resistance $R$ is stretched to twice its length (volume constant), what is its new resistance?\n\n*(NEET 2022, Current Electricity)*", author_name: "PYQ Bank", exam: "neet", tags: ["resistance", "electricity"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(27) },
      { id: "seed-pyq67", kind: "pyq", year: 2021, subject: "Chemistry", title: "NEET 2021: pH of pure water at 25 °C", body: "What is the pH of pure (neutral) water at $25\\,°\\text{C}$, and why?\n\n*(NEET 2021, Ionic Equilibrium)*", author_name: "PYQ Bank", exam: "neet", tags: ["ph", "equilibrium"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(23) },
      { id: "seed-pyq68", kind: "pyq", year: 2023, subject: "Biology", title: "NEET 2023: Universal donor blood group", body: "Which ABO blood group is the **universal donor**, and why?\n\n*(NEET 2023, Human Physiology)*", author_name: "PYQ Bank", exam: "neet", tags: ["blood-groups", "physiology"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(19) },
      { id: "seed-pyq69", kind: "pyq", year: 2020, subject: "Chemistry", title: "NEET 2020: Molecules in 18 g of water", body: "How many molecules are present in $18\\ \\text{g}$ of water ($\\mathrm{H_2O}$)?\n\n*(NEET 2020, Mole Concept)*", author_name: "PYQ Bank", exam: "neet", tags: ["mole-concept", "avogadro"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(15) },
      { id: "seed-pyq70", kind: "pyq", year: 2019, subject: "Biology", title: "NEET 2019: Number of chromosomes in a human somatic cell", body: "How many chromosomes are present in a normal human **somatic** (body) cell?\n\n*(NEET 2019, Genetics)*", author_name: "PYQ Bank", exam: "neet", tags: ["genetics", "chromosomes"], votes: 5, status: "solved", accepted_answer_id: "seed-pa70", created_at: t(12) },

      // ── Batch 3: ISI / CMI ──────────────────────────────────
      { id: "seed-pyq71", kind: "pyq", year: 2021, subject: "Mathematics", title: "ISI 2021: Sum 1 + 2 + … + 100", body: "Evaluate $1 + 2 + 3 + \\dots + 100$ and state the general formula for $1 + 2 + \\dots + n$.\n\n*(ISI entrance, Series)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["series", "gauss"], votes: 6, status: "solved", accepted_answer_id: "seed-pa71", created_at: t(29) },
      { id: "seed-pyq72", kind: "pyq", year: 2019, subject: "Mathematics", title: "CMI 2019: Sum of an infinite geometric series", body: "Evaluate $\\displaystyle\\sum_{n=0}^{\\infty} \\frac{1}{2^n} = 1 + \\tfrac12 + \\tfrac14 + \\dots$\n\n*(CMI entrance, Series)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["geometric-series", "limits"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(25) },
      { id: "seed-pyq73", kind: "pyq", year: 2022, subject: "Statistics", title: "ISI 2022: Mean of a binomial distribution", body: "For a binomial distribution with $n$ trials and success probability $p$, what is the **mean** (expected number of successes)?\n\n*(ISI entrance, Probability)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["probability", "binomial"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(21) },
      { id: "seed-pyq74", kind: "pyq", year: 2020, subject: "Mathematics", title: "ISI 2020: Number of subsets of an n-element set", body: "How many subsets (including the empty set and the set itself) does a set with $n$ elements have? Justify.\n\n*(ISI entrance, Combinatorics)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["combinatorics", "sets"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(17) },
      { id: "seed-pyq75", kind: "pyq", year: 2018, subject: "Mathematics", title: "ISI 2018: Highest power of 2 dividing 50!", body: "What is the highest power of $2$ that divides $50!$?\n\n*(ISI entrance, Number Theory)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["number-theory", "factorials"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(13) },

      // ── Batch 3: CAT ────────────────────────────────────────
      { id: "seed-pyq76", kind: "pyq", year: 2022, subject: "Quant", title: "CAT 2022: Dividing an amount in a ratio", body: "An amount of $\\textrm{₹}1200$ is divided between A and B in the ratio $3:5$. How much does each get?\n\n*(CAT 2022, Ratio & Proportion)*", author_name: "PYQ Bank", exam: "cat", tags: ["ratio", "arithmetic"], votes: 5, status: "solved", accepted_answer_id: "seed-pa76", created_at: t(28) },
      { id: "seed-pyq77", kind: "pyq", year: 2021, subject: "Quant", title: "CAT 2021: Compound interest for 2 years", body: "Find the compound interest on $\\textrm{₹}10000$ at $10\\%$ per annum compounded annually for $2$ years.\n\n*(CAT 2021, Interest)*", author_name: "PYQ Bank", exam: "cat", tags: ["compound-interest", "arithmetic"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(24) },
      { id: "seed-pyq78", kind: "pyq", year: 2023, subject: "Quant", title: "CAT 2023: HCF and LCM relationship", body: "The HCF of two numbers is $6$ and their LCM is $60$. If one number is $12$, what is the other?\n\n*(CAT 2023, Number System)*", author_name: "PYQ Bank", exam: "cat", tags: ["hcf-lcm", "number-system"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(20) },
      { id: "seed-pyq79", kind: "pyq", year: 2020, subject: "Quant", title: "CAT 2020: Combined work rate", body: "A can finish a job in $10$ days and B in $15$ days. Working together, how many days will they take?\n\n*(CAT 2020, Time & Work)*", author_name: "PYQ Bank", exam: "cat", tags: ["time-work", "rates"], votes: 5, status: "solved", accepted_answer_id: "seed-pa79", created_at: t(16) },
      { id: "seed-pyq80", kind: "pyq", year: 2024, subject: "Quant", title: "CAT 2024: Alligation of two priced rice varieties", body: "Rice at $\\textrm{₹}30$/kg is mixed with rice at $\\textrm{₹}40$/kg to make a mixture worth $\\textrm{₹}34$/kg. In what ratio are they mixed?\n\n*(CAT 2024, Mixtures & Alligation)*", author_name: "PYQ Bank", exam: "cat", tags: ["alligation", "mixtures"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(11) },

      // ── Batch 3: UPSC ───────────────────────────────────────
      { id: "seed-pyq81", kind: "pyq", year: 2021, subject: "Polity", title: "UPSC Prelims 2021: Who elects the President of India?", body: "By whom is the **President of India** elected — describe the electoral college.\n\n*(UPSC CSE Prelims 2021, Indian Polity)*", author_name: "PYQ Bank", exam: "upsc", tags: ["polity", "president"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(22) },
      { id: "seed-pyq82", kind: "pyq", year: 2022, subject: "Science & Tech", title: "UPSC Prelims 2022: What is the greenhouse effect?", body: "Briefly explain the **greenhouse effect** and name two greenhouse gases.\n\n*(UPSC CSE Prelims 2022, Environment)*", author_name: "PYQ Bank", exam: "upsc", tags: ["environment", "climate"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(18) },
      { id: "seed-pyq83", kind: "pyq", year: 2020, subject: "History", title: "UPSC Prelims 2020: Who led the Dandi Salt March?", body: "Who led the **Dandi March (Salt Satyagraha)** of 1930, and what did it protest?\n\n*(UPSC CSE Prelims 2020, Modern History)*", author_name: "PYQ Bank", exam: "upsc", tags: ["modern-history", "freedom-movement"], votes: 5, status: "solved", accepted_answer_id: "seed-pa83", created_at: t(14) },
      { id: "seed-pyq84", kind: "pyq", year: 2023, subject: "Economy", title: "UPSC Prelims 2023: What is the repo rate?", body: "What is the **repo rate**, and which institution sets it in India?\n\n*(UPSC CSE Prelims 2023, Indian Economy)*", author_name: "PYQ Bank", exam: "upsc", tags: ["economy", "monetary-policy"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(10) },
      { id: "seed-pyq85", kind: "pyq", year: 2019, subject: "Polity", title: "UPSC Prelims 2019: Minimum age to become President", body: "What is the minimum age required for a person to be eligible for election as **President of India**?\n\n*(UPSC CSE Prelims 2019, Indian Polity)*", author_name: "PYQ Bank", exam: "upsc", tags: ["polity", "eligibility"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(7) },

      // ── Batch 4: classic older-year questions (2004–2015) ───
      { id: "seed-pyq86", kind: "pyq", year: 2005, subject: "Computer Science", title: "GATE CSE 2005: Worst-case comparisons in binary search", body: "What is the worst-case number of comparisons to search a sorted array of $1024$ elements using **binary search**?\n\n*(GATE CSE 2005, Algorithms)*", author_name: "PYQ Bank", exam: "gate", tags: ["binary-search", "algorithms"], votes: 4, status: "solved", accepted_answer_id: "seed-pa86", created_at: t(34) },
      { id: "seed-pyq87", kind: "pyq", year: 2010, subject: "Computer Science", title: "GATE CSE 2010: One key difference between TCP and UDP", body: "State one fundamental difference between **TCP** and **UDP** at the transport layer.\n\n*(GATE CSE 2010, Networks)*", author_name: "PYQ Bank", exam: "gate", tags: ["networks", "transport-layer"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(31) },
      { id: "seed-pyq88", kind: "pyq", year: 2014, subject: "Mathematics", title: "GATE 2014: Determinant of a 2×2 matrix", body: "Find the determinant of $\\begin{pmatrix} 3 & 2 \\\\ 1 & 4 \\end{pmatrix}$.\n\n*(GATE 2014, Linear Algebra)*", author_name: "PYQ Bank", exam: "gate", tags: ["linear-algebra", "determinant"], votes: 3, status: "solved", accepted_answer_id: "seed-pa88", created_at: t(28) },
      { id: "seed-pyq89", kind: "pyq", year: 2012, subject: "Computer Science", title: "GATE CSE 2012: Output of an in-order traversal of a BST", body: "What sequence does an **in-order traversal** of a binary search tree always produce?\n\n*(GATE CSE 2012, Data Structures)*", author_name: "PYQ Bank", exam: "gate", tags: ["bst", "traversal"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(25) },

      { id: "seed-pyq90", kind: "pyq", year: 2005, subject: "Physics", title: "IIT-JEE 2005: Work done lifting a mass", body: "How much work is done in lifting a $10\\ \\text{kg}$ mass vertically through $5\\ \\text{m}$? (Take $g = 10\\ \\text{m/s}^2$.)\n\n*(IIT-JEE 2005, Work–Energy)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["work-energy", "mechanics"], votes: 4, status: "solved", accepted_answer_id: "seed-pa90", created_at: t(33) },
      { id: "seed-pyq91", kind: "pyq", year: 2010, subject: "Mathematics", title: "IIT-JEE 2010: Probability of an even number on a die", body: "A fair six-sided die is rolled once. What is the probability of getting an **even** number?\n\n*(IIT-JEE 2010, Probability)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["probability"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(30) },
      { id: "seed-pyq92", kind: "pyq", year: 2015, subject: "Mathematics", title: "JEE Main 2015: Integral of 1/x", body: "Evaluate the indefinite integral $\\displaystyle\\int \\frac{1}{x}\\,dx$.\n\n*(JEE Main 2015, Integral Calculus)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["integration", "calculus"], votes: 3, status: "solved", accepted_answer_id: "seed-pa92", created_at: t(27) },
      { id: "seed-pyq93", kind: "pyq", year: 2008, subject: "Chemistry", title: "IIT-JEE 2008: Molar mass of water", body: "Calculate the molar mass of water, $\\mathrm{H_2O}$ (H = 1, O = 16).\n\n*(IIT-JEE 2008, Mole Concept)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["mole-concept", "molar-mass"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(23) },

      { id: "seed-pyq94", kind: "pyq", year: 2008, subject: "Biology", title: "AIPMT 2008: The 'powerhouse of the cell'", body: "Which organelle is known as the **powerhouse of the cell**, and why?\n\n*(AIPMT 2008, Cell Biology)*", author_name: "PYQ Bank", exam: "neet", tags: ["cell-biology", "organelles"], votes: 5, status: "solved", accepted_answer_id: "seed-pa94", created_at: t(32) },
      { id: "seed-pyq95", kind: "pyq", year: 2012, subject: "Biology", title: "AIPMT 2012: Largest gland in the human body", body: "Which is the **largest gland** in the human body?\n\n*(AIPMT 2012, Human Physiology)*", author_name: "PYQ Bank", exam: "neet", tags: ["physiology", "glands"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(26) },
      { id: "seed-pyq96", kind: "pyq", year: 2014, subject: "Physics", title: "NEET 2014: Acceleration due to gravity on the Moon", body: "The Moon's gravity is about one-sixth of Earth's. If $g = 9.8\\ \\text{m/s}^2$ on Earth, what is it on the Moon?\n\n*(NEET 2014, Gravitation)*", author_name: "PYQ Bank", exam: "neet", tags: ["gravitation"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(18) },

      { id: "seed-pyq97", kind: "pyq", year: 2010, subject: "Mathematics", title: "ISI 2010: Sum of the first n odd numbers", body: "Find a closed form for $1 + 3 + 5 + \\dots + (2n-1)$ (the sum of the first $n$ odd numbers).\n\n*(ISI entrance, Series)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["series", "induction"], votes: 5, status: "solved", accepted_answer_id: "seed-pa97", created_at: t(29) },
      { id: "seed-pyq98", kind: "pyq", year: 2005, subject: "Mathematics", title: "ISI 2005: Arrangements of the letters of 'MATH'", body: "In how many distinct ways can the letters of the word **MATH** be arranged?\n\n*(ISI entrance, Permutations)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["permutations", "combinatorics"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(22) },
      { id: "seed-pyq99", kind: "pyq", year: 2013, subject: "Mathematics", title: "ISI 2013: Discriminant and nature of roots", body: "For the quadratic $x^2 + x + 1 = 0$, use the discriminant to determine whether the roots are real or complex.\n\n*(ISI entrance, Algebra)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["quadratic", "discriminant"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(16) },

      { id: "seed-pyq100", kind: "pyq", year: 2004, subject: "Quant", title: "CAT 2004: Average speed for equal distances", body: "A car covers half a journey at $40\\ \\text{km/h}$ and the other half at $60\\ \\text{km/h}$. What is its average speed for the whole journey?\n\n*(CAT 2004, Time–Speed–Distance)*", author_name: "PYQ Bank", exam: "cat", tags: ["average-speed", "tsd"], votes: 5, status: "solved", accepted_answer_id: "seed-pa100", created_at: t(28) },
      { id: "seed-pyq101", kind: "pyq", year: 2009, subject: "Quant", title: "CAT 2009: Percentage of a percentage", body: "What is $20\\%$ of $25\\%$ of $400$?\n\n*(CAT 2009, Arithmetic)*", author_name: "PYQ Bank", exam: "cat", tags: ["percentages"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(20) },
      { id: "seed-pyq102", kind: "pyq", year: 2013, subject: "Quant", title: "CAT 2013: Smallest number divisible by 2,3,4,5,6", body: "What is the smallest positive integer divisible by each of $2, 3, 4, 5$ and $6$?\n\n*(CAT 2013, Number System / LCM)*", author_name: "PYQ Bank", exam: "cat", tags: ["lcm", "number-system"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(13) },

      { id: "seed-pyq103", kind: "pyq", year: 2010, subject: "Polity", title: "UPSC Prelims 2010: How many Fundamental Rights today?", body: "How many **Fundamental Rights** are currently guaranteed by the Constitution of India (after the 44th Amendment removed the right to property)?\n\n*(UPSC CSE Prelims 2010, Indian Polity)*", author_name: "PYQ Bank", exam: "upsc", tags: ["polity", "fundamental-rights"], votes: 4, status: "solved", accepted_answer_id: "seed-pa103", created_at: t(24) },
      { id: "seed-pyq104", kind: "pyq", year: 2015, subject: "History", title: "UPSC Prelims 2015: Composer of India's national anthem", body: "Who composed *Jana Gana Mana*, the national anthem of India?\n\n*(UPSC CSE Prelims 2015, Modern History)*", author_name: "PYQ Bank", exam: "upsc", tags: ["modern-history", "culture"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(15) },
      { id: "seed-pyq105", kind: "pyq", year: 2008, subject: "Science & Tech", title: "UPSC Prelims 2008: Longest river flowing within India", body: "Which is the **longest river** that flows entirely within India?\n\n*(UPSC CSE Prelims 2008, Geography)*", author_name: "PYQ Bank", exam: "upsc", tags: ["geography", "rivers"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(9) },
    ];
    write(LSQ, qs);
    write("doubtsA:seed-q1", [
      { id: "seed-a1", question_id: "seed-q1", body: "It's the **shape factor** $I/mr^2$. Acceleration on the incline is $a = \\frac{g\\sin\\theta}{1 + I/mr^2}$. Mass and radius cancel! Sphere = 2/5, ring = 1, so the sphere has larger $a$.", author_name: "Maya Rao", votes: 9, created_at: t(4) },
    ]);
    write("doubtsA:seed-q2", [
      { id: "seed-a2", question_id: "seed-q2", body: "Count how many times the innermost statement runs as a sum. For `for i in 1..n: for j in 1..i`, that's $1+2+\\dots+n = \\tfrac{n(n+1)}2 = O(n^2)$. Turn nested loops into a summation and evaluate.", author_name: "Leon Fischer", votes: 5, created_at: t(1) },
    ]);
    const A = {
      "seed-pyq1": [
        { id: "seed-pa1", body: "By the **Master Theorem**: $a=2,\\ b=2,\\ f(n)=n$. Compare with $n^{\\log_b a}=n^{\\log_2 2}=n^1$. Since $f(n)=\\Theta(n^{\\log_b a})$ (Case 2), $T(n)=\\Theta(n\\log n)$.\n\nThis is exactly the **merge-sort** recurrence — so the answer is $\\boxed{\\Theta(n\\log n)}$.", author_name: "Maya Rao", votes: 14, created_at: t(39) },
        { id: "seed-pa1b", body: "Intuition without the theorem: the recursion tree has $\\log_2 n$ levels, and **each level does $O(n)$ total work** (top level $n$, next $2\\cdot n/2=n$, …). So total $=n\\cdot\\log n=O(n\\log n)$.", author_name: "Dev Khanna", votes: 6, created_at: t(38) },
      ],
      "seed-pyq5": [
        { id: "seed-pa5", body: "A heap is a **complete** binary tree, so it holds the most elements when every level $0..h$ is full: $\\sum_{i=0}^{h} 2^i = 2^{h+1}-1$.\n\n(The minimum, by contrast, is $2^h$.)", author_name: "Leon Fischer", votes: 7, created_at: t(37) },
      ],
      "seed-pyq8": [
        { id: "seed-pa8", body: "Take the closure of $A$: $A^+ = \\{A\\}\\to\\{A,B\\}\\to\\{A,B,C\\}\\to\\{A,B,C,D\\}$ = all attributes. No proper subset of $\\{A\\}$ exists, so the **only candidate key is $A$** (the relation is in a transitive-dependency chain).", author_name: "Sara Beck", votes: 5, created_at: t(33) },
      ],
      "seed-pyq10": [
        { id: "seed-pa10", body: "Characteristic equation: $\\det\\!\\begin{pmatrix}2-\\lambda & 1\\\\ 1 & 2-\\lambda\\end{pmatrix} = (2-\\lambda)^2 - 1 = 0$.\n\nSo $(2-\\lambda)=\\pm 1 \\Rightarrow \\lambda = 1,\\ 3$. (For a symmetric matrix the eigenvalues are real, as expected.)", author_name: "Maya Rao", votes: 6, created_at: t(30) },
      ],
      "seed-pyq2": [
        { id: "seed-pa2", body: "At the top, gravity supplies the centripetal force when the string is on the verge of going slack ($T=0$): $mg = \\dfrac{mv^2}{R}$. Solving, $v_{\\min}=\\sqrt{gR}$.", author_name: "Ishan Verma", votes: 11, created_at: t(27) },
      ],
      "seed-pyq6": [
        { id: "seed-pa6", body: "One molecule of $\\mathrm{CO_2}$ has **2 oxygen atoms**, so $0.25\\ \\text{mol}\\ \\mathrm{CO_2}$ contains $0.25\\times 2 = 0.5\\ \\text{mol}$ of O atoms.", author_name: "Riya Sen", votes: 8, created_at: t(25) },
      ],
      "seed-pyq12": [
        { id: "seed-pa12", body: "Range $R=\\dfrac{v^2\\sin 2\\theta}{g}$ is maximum when $\\sin 2\\theta = 1$, i.e. $2\\theta = 90° \\Rightarrow \\theta = 45°$. The maximum range is $R_{\\max}=\\dfrac{v^2}{g}$.", author_name: "Ishan Verma", votes: 9, created_at: t(23) },
      ],
      "seed-pyq15": [
        { id: "seed-pa15", body: "HCl is a strong acid and dissociates completely, so $[\\mathrm{H^+}] = 10^{-3}\\ \\text{M}$. Thus $\\text{pH} = -\\log_{10}(10^{-3}) = 3$.", author_name: "Riya Sen", votes: 7, created_at: t(17) },
      ],
      "seed-pyq4": [
        { id: "seed-pa4", body: "Each vertex joins to $n-3$ non-adjacent vertices by a diagonal, giving $n(n-3)$ endpoints — but every diagonal is counted at both ends, so divide by 2: $\\dfrac{n(n-3)}{2}$.", author_name: "Sara Beck", votes: 10, created_at: t(26) },
      ],
      "seed-pyq22": [
        { id: "seed-pa22", body: "Trailing zeros come from factors of 10 = 2×5, and 5s are scarcer. Count multiples of 5: $\\lfloor 100/5\\rfloor + \\lfloor 100/25\\rfloor = 20 + 4 = 24$. So $100!$ ends in **24 zeros**.", author_name: "Dev Khanna", votes: 12, created_at: t(23) },
      ],
      "seed-pyq17": [
        { id: "seed-pa17", body: "$Tt \\times Tt$ gives genotypes $1\\,TT : 2\\,Tt : 1\\,tt$. Since $T$ (tall) is dominant, the **phenotypic ratio is $3$ tall $: 1$ short** ($3:1$).", author_name: "Aanya Roy", votes: 9, created_at: t(24) },
      ],
      "seed-pyq20": [
        { id: "seed-pa20", body: "Each carbon in $\\mathrm{H{-}C{\\equiv}C{-}H}$ forms **2 sigma bonds** (one C–H, one C–C) and no lone pairs, so it is **sp hybridized** (the triple bond adds two π bonds from unhybridized p-orbitals). The molecule is linear.", author_name: "Riya Sen", votes: 6, created_at: t(18) },
      ],
      "seed-pyq25": [
        { id: "seed-pa25", body: "They approach each other, so add speeds: relative speed $= 40+20 = 60\\ \\text{km/h}$. Time $= \\dfrac{\\text{distance}}{\\text{relative speed}} = \\dfrac{120}{60} = 2\\ \\text{hours}$.", author_name: "Priya Nair", votes: 7, created_at: t(20) },
      ],
      "seed-pyq3": [
        { id: "seed-pa3", body: "Take price $=100$. After $+20\\%$: $120$. After $-20\\%$ of $120$: $120\\times0.8=96$. Net change $=96-100=-4$, i.e. a **4% decrease**.\n\nShortcut: successive $+a\\%,-a\\%$ always gives a net $-\\dfrac{a^2}{100}\\% = -\\dfrac{400}{100}=-4\\%$.", author_name: "Priya Nair", votes: 8, created_at: t(22) },
      ],
      "seed-pyq28": [
        { id: "seed-pa28", body: "**Habeas corpus** (Latin: 'you shall have the body'). The court orders the detaining authority to produce the person and justify the detention; if it's unlawful, the person is released. It safeguards Article 21 (right to life & personal liberty).", author_name: "Kabir Das", votes: 8, created_at: t(21) },
      ],
      "seed-pyq34": [
        { id: "seed-pa34", body: "$T = 2\\pi\\sqrt{\\dfrac{L}{g}} = 2\\pi\\sqrt{\\dfrac{1}{\\pi^2}} = 2\\pi\\cdot\\dfrac{1}{\\pi} = 2\\ \\text{s}$. The clever choice $g=\\pi^2$ makes the $\\pi$'s cancel.", author_name: "Ishan Verma", votes: 7, created_at: t(23) },
      ],
      "seed-pyq38": [
        { id: "seed-pa38", body: "**Four chambers**: two upper **atria** (right & left atrium) and two lower **ventricles** (right & left ventricle). The right side handles deoxygenated blood, the left side oxygenated.", author_name: "Aanya Roy", votes: 8, created_at: t(21) },
      ],
      "seed-pyq41": [
        { id: "seed-pa41", body: "Since squares are non-negative, $(\\sqrt{a}-\\sqrt{b})^2 \\ge 0$. Expanding: $a - 2\\sqrt{ab} + b \\ge 0 \\Rightarrow a+b \\ge 2\\sqrt{ab} \\Rightarrow \\dfrac{a+b}{2}\\ge\\sqrt{ab}$. Equality holds iff $\\sqrt{a}=\\sqrt{b}$, i.e. $a=b$. $\\blacksquare$", author_name: "Sara Beck", votes: 11, created_at: t(19) },
      ],
      "seed-pyq44": [
        { id: "seed-pa44", body: "Sum of the 10 numbers $=10\\times20=200$. After adding the new number $x$, there are 11 numbers averaging 22, so total $=11\\times22=242$. Thus $x=242-200=42$.", author_name: "Priya Nair", votes: 6, created_at: t(17) },
      ],
      "seed-pyq45": [
        { id: "seed-pa45", body: "Simple interest $=\\dfrac{P\\cdot R\\cdot T}{100}=\\dfrac{8000\\times5\\times3}{100}=\\textrm{₹}1200$.", author_name: "Priya Nair", votes: 5, created_at: t(14) },
      ],
      "seed-pyq55": [
        { id: "seed-pa55", body: "SJF orders by burst: $6, 7, 8$. Waiting times $= 0,\\ 6,\\ 13$. Average $= \\dfrac{0+6+13}{3} = \\dfrac{19}{3} \\approx 6.33$ units.", author_name: "Sara Beck", votes: 6, created_at: t(24) },
      ],
      "seed-pyq57": [
        { id: "seed-pa57", body: "Nyquist rate $= 2\\times$ the highest frequency $= 2\\times 4\\ \\text{kHz} = 8\\ \\text{kHz}$ (i.e. 8000 samples/second).", author_name: "Leon Fischer", votes: 5, created_at: t(20) },
      ],
      "seed-pyq58": [
        { id: "seed-pa58", body: "$v_e = \\sqrt{\\dfrac{2GM}{R}} = \\sqrt{2gR}$. Plugging in: $\\sqrt{2\\times 9.8\\times 6.4\\times10^6} \\approx 1.12\\times10^4\\ \\text{m/s} \\approx 11.2\\ \\text{km/s}$.", author_name: "Ishan Verma", votes: 9, created_at: t(32) },
      ],
      "seed-pyq64": [
        { id: "seed-pa64", body: "$P = I^2 R = (2)^2 \\times 5 = 4\\times 5 = 20\\ \\text{W}$.", author_name: "Ishan Verma", votes: 6, created_at: t(19) },
      ],
      "seed-pyq65": [
        { id: "seed-pa65", body: "Glycolysis produces 4 ATP but consumes 2, so the **net gain is 2 ATP** per glucose (plus 2 NADH).", author_name: "Aanya Roy", votes: 8, created_at: t(30) },
      ],
      "seed-pyq70": [
        { id: "seed-pa70", body: "A normal human somatic cell is diploid with **46 chromosomes** (23 pairs). Gametes are haploid with 23.", author_name: "Aanya Roy", votes: 7, created_at: t(11) },
      ],
      "seed-pyq71": [
        { id: "seed-pa71", body: "Pair the terms (Gauss): $1+2+\\dots+100 = \\dfrac{100\\times101}{2} = 5050$. In general $1+2+\\dots+n = \\dfrac{n(n+1)}{2}$.", author_name: "Dev Khanna", votes: 10, created_at: t(28) },
      ],
      "seed-pyq76": [
        { id: "seed-pa76", body: "Total parts $= 3+5 = 8$. One part $= 1200/8 = 150$. So A gets $3\\times150 = \\textrm{₹}450$ and B gets $5\\times150 = \\textrm{₹}750$.", author_name: "Priya Nair", votes: 6, created_at: t(27) },
      ],
      "seed-pyq79": [
        { id: "seed-pa79", body: "Combined rate $= \\tfrac{1}{10} + \\tfrac{1}{15} = \\tfrac{3+2}{30} = \\tfrac{5}{30} = \\tfrac16$ per day, so together they finish in **6 days**.", author_name: "Priya Nair", votes: 7, created_at: t(15) },
      ],
      "seed-pyq83": [
        { id: "seed-pa83", body: "**Mahatma Gandhi** led the Dandi March (March–April 1930), walking ~240 km to Dandi to make salt from seawater — defying the British **salt tax** and launching the Civil Disobedience Movement.", author_name: "Kabir Das", votes: 8, created_at: t(13) },
      ],
      "seed-pyq86": [
        { id: "seed-pa86", body: "Binary search halves the search space each step, so the worst case is $\\lfloor \\log_2 n \\rfloor + 1 = \\lfloor \\log_2 1024 \\rfloor + 1 = 10 + 1 = 11$ comparisons.", author_name: "Sara Beck", votes: 5, created_at: t(33) },
      ],
      "seed-pyq88": [
        { id: "seed-pa88", body: "$\\det = (3)(4) - (2)(1) = 12 - 2 = 10$.", author_name: "Maya Rao", votes: 4, created_at: t(27) },
      ],
      "seed-pyq90": [
        { id: "seed-pa90", body: "$W = mgh = 10 \\times 10 \\times 5 = 500\\ \\text{J}$.", author_name: "Ishan Verma", votes: 6, created_at: t(32) },
      ],
      "seed-pyq92": [
        { id: "seed-pa92", body: "$\\displaystyle\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.", author_name: "Maya Rao", votes: 5, created_at: t(26) },
      ],
      "seed-pyq94": [
        { id: "seed-pa94", body: "The **mitochondrion** — it carries out aerobic respiration and produces most of the cell's ATP (chemical energy), hence 'powerhouse of the cell'.", author_name: "Aanya Roy", votes: 7, created_at: t(31) },
      ],
      "seed-pyq97": [
        { id: "seed-pa97", body: "$1 + 3 + 5 + \\dots + (2n-1) = n^2$. (Each new odd number adds the next 'L-shaped' layer to an $n\\times n$ square — a classic visual proof.)", author_name: "Dev Khanna", votes: 8, created_at: t(28) },
      ],
      "seed-pyq100": [
        { id: "seed-pa100", body: "For equal distances, use the **harmonic mean**: $\\bar v = \\dfrac{2uv}{u+v} = \\dfrac{2\\times40\\times60}{40+60} = \\dfrac{4800}{100} = 48\\ \\text{km/h}$ (not the simple average of 50).", author_name: "Priya Nair", votes: 7, created_at: t(27) },
      ],
      "seed-pyq103": [
        { id: "seed-pa103", body: "There are **six** Fundamental Rights today: Equality, Freedom, Against Exploitation, Freedom of Religion, Cultural & Educational rights, and Constitutional Remedies. (The Right to Property was removed as a fundamental right by the 44th Amendment, 1978.)", author_name: "Kabir Das", votes: 6, created_at: t(23) },
      ],
    };
    Object.keys(A).forEach((qid) => write("doubtsA:" + qid, A[qid].map((a) => Object.assign({ question_id: qid }, a))));
    return qs;
  }
  function ensureSeed() { let q = read(LSQ, null); if (!q || !q.length) q = seed(); return q; }

  // Probe once: 'live' if the Supabase questions table exists, else 'demo'
  // (localStorage + seed). This makes the Q&A useful immediately and upgrade
  // automatically once the exam-prep SQL is run.
  let _mode = null, _sb = null;
  async function mode() {
    if (_mode) return _mode;
    _sb = await db();
    if (!_sb) { _mode = "demo"; return _mode; }
    try { const { error } = await _sb.from("questions").select("id").limit(1); _mode = error ? "demo" : "live"; }
    catch (e) { _mode = "demo"; }
    return _mode;
  }

  return {
    async isLive() { return (await mode()) === "live"; },
    async listQuestions() {
      if (await mode() === "live") {
        const { data } = await _sb.from("questions").select("*").order("created_at", { ascending: false });
        // Append curated seed doubts so the board is never empty; they route to
        // localStorage for answering (see isSeed), real ones go to Supabase.
        const seeds = ensureSeed().filter((q) => q.kind !== "pyq");
        return (data || []).concat(seeds);
      }
      return ensureSeed();
    },
    // Previous-year questions: curated seed items (always shown) + any live
    // community contributions with kind = 'pyq'.
    async listPYQs() {
      const seeds = ensureSeed().filter((q) => q.kind === "pyq");
      if (await mode() === "live") {
        try {
          const { data, error } = await _sb.from("questions").select("*").eq("kind", "pyq").order("created_at", { ascending: false });
          if (error) return seeds; // 'kind' column not added yet → just seeds
          return (data || []).concat(seeds);
        } catch (e) { return seeds; }
      }
      return seeds;
    },
    async getQuestion(id) {
      if (isSeed(id)) return ensureSeed().find((x) => x.id === id);
      if (await mode() === "live") { const { data } = await _sb.from("questions").select("*").eq("id", id).maybeSingle(); return data; }
      return ensureSeed().find((x) => x.id === id);
    },
    async createQuestion(q) {
      if (await mode() === "live") { const { data, error } = await _sb.from("questions").insert(q).select().maybeSingle(); return { data, error }; }
      const arr = ensureSeed(); const row = Object.assign({ id: uid("q-"), votes: 0, status: "open", accepted_answer_id: null, created_at: new Date().toISOString() }, q); arr.unshift(row); write(LSQ, arr); return { data: row };
    },
    async listAnswers(qid) {
      if (isSeed(qid)) return read("doubtsA:" + qid, []);
      if (await mode() === "live") { const { data } = await _sb.from("answers").select("*").eq("question_id", qid).order("votes", { ascending: false }); return data || []; }
      return read("doubtsA:" + qid, []);
    },
    async createAnswer(a) {
      if (!isSeed(a.question_id) && await mode() === "live") { const { data, error } = await _sb.from("answers").insert(a).select().maybeSingle(); return { data, error }; }
      const arr = read("doubtsA:" + a.question_id, []); const row = Object.assign({ id: uid("a-"), votes: 0, created_at: new Date().toISOString() }, a); arr.push(row); write("doubtsA:" + a.question_id, arr); return { data: row };
    },
    async vote(kind, id, delta, qid) {
      const local = kind === "q" ? isSeed(id) : isSeed(qid);
      if (!local && await mode() === "live") { try { await _sb.rpc(kind === "q" ? "vote_question" : "vote_answer", { row_id: id, delta }); } catch (e) {} return; }
      if (kind === "q") { const arr = ensureSeed(); const r = arr.find((x) => x.id === id); if (r) { r.votes = Math.max(0, (r.votes || 0) + delta); write(LSQ, arr); } }
      else { const k = "doubtsA:" + qid; const arr = read(k, []); const r = arr.find((x) => x.id === id); if (r) { r.votes = Math.max(0, (r.votes || 0) + delta); write(k, arr); } }
    },
    async accept(qid, aid) {
      if (!isSeed(qid) && await mode() === "live") { try { await _sb.from("questions").update({ accepted_answer_id: aid, status: "solved" }).eq("id", qid); } catch (e) {} return; }
      const arr = ensureSeed(); const q = arr.find((x) => x.id === qid); if (q) { q.accepted_answer_id = aid; q.status = "solved"; write(LSQ, arr); }
    },
  };
})();
