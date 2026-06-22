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
  const LSQ = "doubtsQ2"; // bumped when the seed set changes (adds PYQs)
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

      // ── Previous-Year Questions ─────────────────────────────
      { id: "seed-pyq1", kind: "pyq", year: 2021, subject: "Algorithms", title: "GATE CSE 2021: Solve the recurrence T(n) = 2T(n/2) + n", body: "Consider the recurrence $T(n) = 2\\,T(n/2) + n$ with $T(1)=1$. What is the asymptotic time complexity of $T(n)$?\n\n*(GATE CSE 2021, 1 mark)*", author_name: "PYQ Bank", exam: "gate", tags: ["recurrence", "master-theorem", "1-mark"], votes: 12, status: "solved", accepted_answer_id: "seed-pa1", created_at: t(30) },
      { id: "seed-pyq2", kind: "pyq", year: 2019, subject: "Physics", title: "JEE Advanced 2019: Minimum speed at the top of a vertical circle", body: "A small ball of mass $m$ is attached to a light string and whirled in a **vertical circle** of radius $R$. What is the minimum speed at the **top** of the circle so the string stays taut?\n\n*(JEE Advanced 2019, Mechanics)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["circular-motion", "mechanics"], votes: 9, status: "solved", accepted_answer_id: "seed-pa2", created_at: t(26) },
      { id: "seed-pyq3", kind: "pyq", year: 2022, subject: "Quantitative Aptitude", title: "CAT 2022: Successive percentage change in price", body: "The price of an article is first increased by 20% and then decreased by 20%. What is the net percentage change in the price?\n\n*(CAT 2022, Arithmetic)*", author_name: "PYQ Bank", exam: "cat", tags: ["percentages", "arithmetic"], votes: 6, status: "solved", accepted_answer_id: "seed-pa3", created_at: t(20) },
      { id: "seed-pyq4", kind: "pyq", year: 2018, subject: "Mathematics", title: "ISI B.Stat 2018: Number of diagonals of a convex polygon", body: "How many diagonals does a convex polygon with $n$ sides have? Derive the formula.\n\n*(ISI B.Stat entrance, Combinatorics)*", author_name: "PYQ Bank", exam: "isi-cmi", tags: ["combinatorics", "counting"], votes: 5, status: "open", accepted_answer_id: null, created_at: t(15) },
      { id: "seed-pyq5", kind: "pyq", year: 2020, subject: "Data Structures", title: "GATE CSE 2020: Max elements in a binary heap of height h", body: "A binary heap is stored as an array. What is the **maximum** number of elements in a binary heap of height $h$ (root at height 0)?\n\n*(GATE CSE 2020)*", author_name: "PYQ Bank", exam: "gate", tags: ["heap", "data-structures"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(12) },
      { id: "seed-pyq6", kind: "pyq", year: 2023, subject: "Chemistry", title: "JEE Main 2023: Moles of O atoms in 0.25 mol of CO2", body: "How many moles of oxygen **atoms** are present in $0.25\\ \\text{mol}$ of $\\mathrm{CO_2}$?\n\n*(JEE Main 2023, Physical Chemistry — mole concept)*", author_name: "PYQ Bank", exam: "iit-jee", tags: ["mole-concept", "chemistry"], votes: 3, status: "open", accepted_answer_id: null, created_at: t(8) },
    ];
    write(LSQ, qs);
    write("doubtsA:seed-q1", [
      { id: "seed-a1", question_id: "seed-q1", body: "It's the **shape factor** $I/mr^2$. Acceleration on the incline is $a = \\frac{g\\sin\\theta}{1 + I/mr^2}$. Mass and radius cancel! Sphere = 2/5, ring = 1, so the sphere has larger $a$.", author_name: "Maya Rao", votes: 9, created_at: t(4) },
    ]);
    write("doubtsA:seed-q2", [
      { id: "seed-a2", question_id: "seed-q2", body: "Count how many times the innermost statement runs as a sum. For `for i in 1..n: for j in 1..i`, that's $1+2+\\dots+n = \\tfrac{n(n+1)}2 = O(n^2)$. Turn nested loops into a summation and evaluate.", author_name: "Leon Fischer", votes: 5, created_at: t(1) },
    ]);
    write("doubtsA:seed-pyq1", [
      { id: "seed-pa1", question_id: "seed-pyq1", body: "By the **Master Theorem**: $a=2,\\ b=2,\\ f(n)=n$. Compare with $n^{\\log_b a}=n^{\\log_2 2}=n^1$. Since $f(n)=\\Theta(n^{\\log_b a})$ (Case 2), $T(n)=\\Theta(n\\log n)$.\n\nThis is exactly the **merge-sort** recurrence — so the answer is $\\boxed{\\Theta(n\\log n)}$.", author_name: "Maya Rao", votes: 14, created_at: t(29) },
      { id: "seed-pa1b", question_id: "seed-pyq1", body: "Intuition without the theorem: the recursion tree has $\\log_2 n$ levels, and **each level does $O(n)$ total work** (top level $n$, next $2\\cdot n/2=n$, …). So total $=n\\cdot\\log n=O(n\\log n)$.", author_name: "Dev Khanna", votes: 6, created_at: t(28) },
    ]);
    write("doubtsA:seed-pyq2", [
      { id: "seed-pa2", question_id: "seed-pyq2", body: "At the top, gravity supplies the centripetal force when the string is on the verge of going slack ($T=0$): $mg = \\dfrac{mv^2}{R}$. Solving, $v_{\\min}=\\sqrt{gR}$.", author_name: "Ishan Verma", votes: 11, created_at: t(25) },
    ]);
    write("doubtsA:seed-pyq3", [
      { id: "seed-pa3", question_id: "seed-pyq3", body: "Take price $=100$. After $+20\\%$: $120$. After $-20\\%$ of $120$: $120\\times0.8=96$. Net change $=96-100=-4$, i.e. a **4% decrease**.\n\nShortcut: successive $+a\\%,-a\\%$ always gives a net $-\\dfrac{a^2}{100}\\% = -\\dfrac{400}{100}=-4\\%$.", author_name: "Priya Nair", votes: 8, created_at: t(19) },
    ]);
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
      if (await mode() === "live") { const { data } = await _sb.from("questions").select("*").order("created_at", { ascending: false }); return data || []; }
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
