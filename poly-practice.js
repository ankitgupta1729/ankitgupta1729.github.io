// Personal practice layer — bookmarks + a lightweight spaced-repetition queue.
// localStorage is the synchronous source of truth (works with zero backend);
// when a user is signed in and Supabase is configured, items also sync to a
// `practice_items` table so they follow the user across devices. Sync is
// last-write-wins per item using an `u` (updated-ms) stamp; a "polypractice"
// document event fires after a remote merge so UIs can re-render live.
//
// Revision schedule: SM-2-lite ladder — each "Got it" pushes the next review
// further out; a "Missed" resets it to day 1.
window.PolyPractice = (function () {
  const SAVED = "practiceSaved";   // { [id]: {id,title,exam,year,subject,kind,url,savedAt,u} }
  const REV = "practiceRevisit";   // { [id]: {...meta, due, interval, reps, lapses, addedAt, u} }
  const INTERVALS = [1, 3, 7, 16, 35, 75]; // days between successful reviews
  const DAY = 86400000;
  const now = () => Date.now();
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v)); // eslint-disable-line
  const saved = () => read(SAVED, {});
  const rev = () => read(REV, {});
  const setSaved = (v) => write(SAVED, v);
  const setRev = (v) => write(REV, v);

  // ── Supabase sync (best-effort, never blocks the UI) ─────
  const user = () => (window.PolyAuth && window.PolyAuth.user) || null;
  async function db() { return window.polyDB ? await window.polyDB() : null; }
  function emit() { try { document.dispatchEvent(new CustomEvent("polypractice")); } catch (e) {} }

  async function push(list, item) {
    const u = user(); if (!u || !u.id) return; const sb = await db(); if (!sb) return;
    try { await sb.from("practice_items").upsert({ user_id: u.id, item_id: item.id, list: list, data: item, updated_at: new Date().toISOString() }); } catch (e) {}
  }
  async function del(list, itemId) {
    const u = user(); if (!u || !u.id) return; const sb = await db(); if (!sb) return;
    try { await sb.from("practice_items").delete().eq("user_id", u.id).eq("item_id", itemId).eq("list", list); } catch (e) {}
  }
  async function pushAll() {
    const u = user(); if (!u || !u.id) return; const sb = await db(); if (!sb) return;
    const rows = [];
    Object.values(saved()).forEach((it) => rows.push({ user_id: u.id, item_id: it.id, list: "saved", data: it, updated_at: new Date().toISOString() }));
    Object.values(rev()).forEach((it) => rows.push({ user_id: u.id, item_id: it.id, list: "revisit", data: it, updated_at: new Date().toISOString() }));
    if (rows.length) try { await sb.from("practice_items").upsert(rows); } catch (e) {}
  }
  let _pulled = false;
  async function pull() {
    const u = user(); if (!u || !u.id) return; const sb = await db(); if (!sb) return;
    let rows; try { const r = await sb.from("practice_items").select("*").eq("user_id", u.id); if (r.error) return; rows = r.data; } catch (e) { return; }
    if (!rows) return;
    const s = saved(), r = rev(); let changed = false;
    rows.forEach((row) => {
      const inc = row.data || {}; if (!inc.id) return;
      const store = row.list === "saved" ? s : r;
      const cur = store[inc.id];
      if (!cur || (inc.u || 0) > (cur.u || 0)) { store[inc.id] = inc; changed = true; }
    });
    if (changed) { setSaved(s); setRev(r); }
    await pushAll();     // back-fill items this device has that the cloud doesn't
    if (changed) emit();
  }
  function syncOnce() { if (_pulled) return; _pulled = true; pull(); }
  // kick off when auth becomes known
  if (window.PolyAuth) { if (user()) syncOnce(); if (window.PolyAuth.onChange) window.PolyAuth.onChange((u) => { if (u) { _pulled = false; syncOnce(); } }); }
  document.addEventListener("polyauth", (e) => { if (e.detail) { _pulled = false; syncOnce(); } });

  return {
    // ── Bookmarks ──────────────────────────────────────────
    isSaved(id) { return !!saved()[id]; },
    toggleSave(item) {
      const s = saved();
      if (s[item.id]) { delete s[item.id]; setSaved(s); del("saved", item.id); return false; }
      const row = Object.assign({ savedAt: now() }, item, { u: now() });
      s[item.id] = row; setSaved(s); push("saved", row); return true;
    },
    listSaved() { return Object.values(saved()).sort((a, b) => b.savedAt - a.savedAt); },
    savedCount() { return Object.keys(saved()).length; },

    // ── Spaced-repetition revision queue ───────────────────
    inQueue(id) { return !!rev()[id]; },
    addToQueue(item) {
      const r = rev();
      if (!r[item.id]) { const row = Object.assign({}, item, { addedAt: now(), due: now(), interval: 0, reps: 0, lapses: 0, u: now() }); r[item.id] = row; setRev(r); push("revisit", row); }
      return true;
    },
    removeFromQueue(id) { const r = rev(); delete r[id]; setRev(r); del("revisit", id); },
    grade(id, ok) {
      const r = rev(); const it = r[id]; if (!it) return;
      if (ok) { it.reps = (it.reps || 0) + 1; it.interval = INTERVALS[Math.min(it.reps - 1, INTERVALS.length - 1)]; }
      else { it.lapses = (it.lapses || 0) + 1; it.reps = 0; it.interval = INTERVALS[0]; }
      it.due = now() + it.interval * DAY; it.u = now();
      setRev(r); push("revisit", it);
    },
    dueItems() { const t = now(); return Object.values(rev()).filter((x) => x.due <= t).sort((a, b) => a.due - b.due); },
    upcomingItems() { const t = now(); return Object.values(rev()).filter((x) => x.due > t).sort((a, b) => a.due - b.due); },
    allRevisit() { return Object.values(rev()).sort((a, b) => a.due - b.due); },
    dueCount() { const t = now(); return Object.values(rev()).filter((x) => x.due <= t).length; },
    revisitCount() { return Object.keys(rev()).length; },
    sync() { _pulled = false; syncOnce(); },
  };
})();
