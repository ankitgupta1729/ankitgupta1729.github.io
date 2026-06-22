// Personal practice layer — bookmarks + a lightweight spaced-repetition queue,
// all in localStorage so it works with zero backend. Items are PYQs (or quizzes)
// identified by a stable id. The revision schedule uses an SM-2-lite ladder:
// each "Got it" pushes the next review further out; a "Missed" resets it.
window.PolyPractice = (function () {
  const SAVED = "practiceSaved";   // { [id]: {id,title,exam,year,subject,kind,url,savedAt} }
  const REV = "practiceRevisit";   // { [id]: {...meta, due, interval, reps, lapses, addedAt} }
  const INTERVALS = [1, 3, 7, 16, 35, 75]; // days between successful reviews
  const DAY = 86400000;
  const now = () => Date.now();
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const saved = () => read(SAVED, {});
  const rev = () => read(REV, {});

  return {
    // ── Bookmarks ──────────────────────────────────────────
    isSaved(id) { return !!saved()[id]; },
    toggleSave(item) {
      const s = saved();
      if (s[item.id]) delete s[item.id];
      else s[item.id] = Object.assign({ savedAt: now() }, item);
      write(SAVED, s);
      return !!saved()[item.id];
    },
    listSaved() { return Object.values(saved()).sort((a, b) => b.savedAt - a.savedAt); },
    savedCount() { return Object.keys(saved()).length; },

    // ── Spaced-repetition revision queue ───────────────────
    inQueue(id) { return !!rev()[id]; },
    addToQueue(item) {
      const r = rev();
      if (!r[item.id]) { r[item.id] = Object.assign({}, item, { addedAt: now(), due: now(), interval: 0, reps: 0, lapses: 0 }); write(REV, r); }
      return true;
    },
    removeFromQueue(id) { const r = rev(); delete r[id]; write(REV, r); },
    // grade a due item: ok=true advances the ladder, ok=false resets to day 1
    grade(id, ok) {
      const r = rev(); const it = r[id]; if (!it) return;
      if (ok) { it.reps = (it.reps || 0) + 1; it.interval = INTERVALS[Math.min(it.reps - 1, INTERVALS.length - 1)]; }
      else { it.lapses = (it.lapses || 0) + 1; it.reps = 0; it.interval = INTERVALS[0]; }
      it.due = now() + it.interval * DAY;
      write(REV, r);
    },
    dueItems() { const t = now(); return Object.values(rev()).filter((x) => x.due <= t).sort((a, b) => a.due - b.due); },
    upcomingItems() { const t = now(); return Object.values(rev()).filter((x) => x.due > t).sort((a, b) => a.due - b.due); },
    allRevisit() { return Object.values(rev()).sort((a, b) => a.due - b.due); },
    dueCount() { const t = now(); return Object.values(rev()).filter((x) => x.due <= t).length; },
    revisitCount() { return Object.keys(rev()).length; },
  };
})();
