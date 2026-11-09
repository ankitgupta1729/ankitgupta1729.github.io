// Q&A data layer — works against Supabase when configured (window.polyDB),
// otherwise falls back to localStorage + a small demo seed so the whole
// doubts flow works offline/before setup.
window.PolyQA = (function () {
  const LSQ = "doubtsQ";
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  async function db() { return window.polyDB ? await window.polyDB() : null; }

  function seed() {
    const t = (d) => new Date(Date.now() - d * 86400000).toISOString();
    const qs = [
      { id: "seed-q1", title: "Why does a solid sphere beat a ring rolling down an incline?", body: "Both start from rest at the same height. I get that energy is conserved, but why does the sphere always win regardless of mass or radius?", author_name: "Aarav", exam: "iit-jee", tags: ["mechanics", "rotation"], votes: 7, status: "solved", accepted_answer_id: "seed-a1", created_at: t(4) },
      { id: "seed-q2", title: "GATE: How to quickly identify the time complexity of nested loops?", body: "When loops depend on each other (inner loop runs to `i`), I get confused. Any reliable method?", author_name: "Priya", exam: "gate", tags: ["algorithms", "complexity"], votes: 4, status: "open", accepted_answer_id: null, created_at: t(2) },
    ];
    write(LSQ, qs);
    write("doubtsA:seed-q1", [
      { id: "seed-a1", question_id: "seed-q1", body: "It's the **shape factor** $I/mr^2$. Acceleration on the incline is $a = \\frac{g\\sin\\theta}{1 + I/mr^2}$. Mass and radius cancel! Sphere = 2/5, ring = 1, so the sphere has larger $a$.", author_name: "Maya Rao", votes: 9, created_at: t(4) },
    ]);
    write("doubtsA:seed-q2", [
      { id: "seed-a2", question_id: "seed-q2", body: "Count how many times the innermost statement runs as a sum. For `for i in 1..n: for j in 1..i`, that's $1+2+\\dots+n = \\tfrac{n(n+1)}2 = O(n^2)$. Turn nested loops into a summation and evaluate.", author_name: "Leon Fischer", votes: 5, created_at: t(1) },
    ]);
    return qs;
  }
  function ensureSeed() { let q = read(LSQ, null); if (!q) q = seed(); return q; }

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
    async getQuestion(id) {
      if (await mode() === "live") { const { data } = await _sb.from("questions").select("*").eq("id", id).maybeSingle(); return data; }
      return ensureSeed().find((x) => x.id === id);
    },
    async createQuestion(q) {
      if (await mode() === "live") { const { data, error } = await _sb.from("questions").insert(q).select().maybeSingle(); return { data, error }; }
      const arr = ensureSeed(); const row = Object.assign({ id: uid("q-"), votes: 0, status: "open", accepted_answer_id: null, created_at: new Date().toISOString() }, q); arr.unshift(row); write(LSQ, arr); return { data: row };
    },
    async listAnswers(qid) {
      if (await mode() === "live") { const { data } = await _sb.from("answers").select("*").eq("question_id", qid).order("votes", { ascending: false }); return data || []; }
      return read("doubtsA:" + qid, []);
    },
    async createAnswer(a) {
      if (await mode() === "live") { const { data, error } = await _sb.from("answers").insert(a).select().maybeSingle(); return { data, error }; }
      const arr = read("doubtsA:" + a.question_id, []); const row = Object.assign({ id: uid("a-"), votes: 0, created_at: new Date().toISOString() }, a); arr.push(row); write("doubtsA:" + a.question_id, arr); return { data: row };
    },
    async vote(kind, id, delta, qid) {
      if (await mode() === "live") { try { await _sb.rpc(kind === "q" ? "vote_question" : "vote_answer", { row_id: id, delta }); } catch (e) {} return; }
      if (kind === "q") { const arr = ensureSeed(); const r = arr.find((x) => x.id === id); if (r) { r.votes = Math.max(0, (r.votes || 0) + delta); write(LSQ, arr); } }
      else { const k = "doubtsA:" + qid; const arr = read(k, []); const r = arr.find((x) => x.id === id); if (r) { r.votes = Math.max(0, (r.votes || 0) + delta); write(k, arr); } }
    },
    async accept(qid, aid) {
      if (await mode() === "live") { try { await _sb.from("questions").update({ accepted_answer_id: aid, status: "solved" }).eq("id", qid); } catch (e) {} return; }
      const arr = ensureSeed(); const q = arr.find((x) => x.id === qid); if (q) { q.accepted_answer_id = aid; q.status = "solved"; write(LSQ, arr); }
    },
  };
})();
