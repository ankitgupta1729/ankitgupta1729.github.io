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
  const LSQ = "doubtsQ4"; // bumped when the seed set changes (now ~50 PYQs)
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
