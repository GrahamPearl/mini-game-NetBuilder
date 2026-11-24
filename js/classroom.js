/* NetBuilder Classroom Edition: ADMIN NO login, points scoring, Teacher Hub.
   Load AFTER script.js:  <script src="./js/classroom.js" defer></script>
   Teacher PIN: change DEFAULT_PIN below (the hub can also change it at runtime). */
(() => {
const DEFAULT_PIN = '2468', KEY = 'nb_cls_', D = document, g = id => D.getElementById(id);
const sg = (k, d) => { try { const v = localStorage.getItem(KEY + k); return v == null ? d : JSON.parse(v) } catch (e) { return d } };
const ss = (k, v) => { try { localStorage.setItem(KEY + k, JSON.stringify(v)) } catch (e) {} };
let rec = null, cur = 1, runs = 0, demo = false, qT = Date.now(), lastIn = Date.now(), unlocked = false, cls = sg('class', {});

/* ===== Scoring: level base = 100 x difficulty (1.0 at L1, +0.25 per level); time factor 1.25 -> 0.5 ===== */
const base = id => Math.round(100 * (1 + .25 * (id - 1))), par = id => 180 + 30 * (id - 1);
const hintsOf = x => (x.sol || 0) + (x.sim || 0);
const newL = () => ({ done: 0, points: 0, time: 0, runs: 0, sol: 0, sim: 0, notes: 0, spent: 0 });
const LR = id => rec.levels[id] || (rec.levels[id] = newL());
const sum = (o, f) => Object.values(o).reduce((s, x) => s + (f(x) || 0), 0);
const tot = r => sum(r.levels, x => x.points) + sum(r.quiz, x => x.pts);
const timeOf = r => sum(r.levels, x => x.done ? x.time : 0), doneOf = r => sum(r.levels, x => x.done ? 1 : 0);
function levelPts(id, spent, x, nRuns) {
  const b = base(id), tf = Math.min(1.25, Math.max(.5, 1.25 - spent / (2 * par(id))));
  const pen = (x.sol ? .25 : 0) + Math.min(.3, .05 * Math.max(0, nRuns - 1));
  return { b, tf, pen, pts: Math.max(Math.round(.2 * b), Math.round(b * (tf - pen))) };
}

/* ===== Persistence & export formats ===== */
const persist = () => { rec.updated = Date.now(); ss('rec_' + rec.admin, rec); ss('last', rec.admin); hud() };
const norm = r => ({ admin: String(r.admin), updated: r.updated || 0, levels: r.levels || {}, quiz: r.quiz || {} });
const toCSV = r => 'admin,type,id,done,points,time_s,runs,hints\n' +
  Object.entries(r.levels).map(([i, x]) => `${r.admin},L,${i},${x.done ? 1 : 0},${x.points},${x.time},${x.runs},${hintsOf(x)}`).join('\n') + '\n' +
  Object.entries(r.quiz).map(([i, x]) => `${r.admin},Q,${i},${x.ok ? 1 : 0},${x.pts},${x.time},,`).join('\n');
const block = r => 'NBRESULT:' + btoa(JSON.stringify(r));
function dl(name, text, type) { const a = D.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500) }

/* ===== UI helpers (reuse the game's .mb/.mc modal styles) ===== */
const css = D.createElement('style');
css.textContent = `.nbt{width:100%;border-collapse:collapse;font-size:.78rem}.nbt th,.nbt td{padding:4px 6px;border-bottom:1px solid var(--b);text-align:left}
.nbt tr.cl{cursor:pointer}.nbt tr.cl:hover{background:#0b1120}.nbm{font-size:.78rem;color:var(--m)}.nbh{z-index:90}
button[onclick="openEd()"]{display:none}#nbU,#nbS,#nbT{color:var(--y)}`;
D.head.appendChild(css);
function modal(id, html, wide, z) {
  let m = g(id); if (!m) { m = D.createElement('div'); m.id = id; m.className = 'mb'; if (z) m.style.zIndex = z; D.body.appendChild(m) }
  m.innerHTML = `<div class=mc${wide ? ' style="max-width:920px"' : ''}>${html}</div>`; m.classList.add('open'); return m;
}
const shut = id => g(id) && g(id).classList.remove('open');

/* ===== Student login ===== */
function login() {
  modal('nbL', `<div class=mh>NetBuilder · Class login</div><div class=md style="max-width:380px"><label>ADMIN NO (5 or 6 digits)<input id=nbA inputmode=numeric maxlength=6 autocomplete=off value="${sg('last', '')}"></label>
  <div id=nbE style="color:var(--r);font-size:.78rem;min-height:1em"></div><button class=sm id=nbGo>Start</button><button id=nbTch>Teacher Hub</button></div>`, 0, 100);
  const go = () => { const a = g('nbA').value.trim(); if (!/^\d{5,6}$/.test(a)) { g('nbE').textContent = 'Enter your 5 or 6 digit ADMIN NO (numbers only).'; return }
    rec = norm(sg('rec_' + a, { admin: a })); shut('nbL'); D.body.classList.add('nb-in'); persist(); loadLevel(lv.id) };
  g('nbGo').onclick = go; g('nbA').onkeydown = e => { if (e.key == 'Enter') go() }; g('nbTch').onclick = openHub; g('nbA').focus();
}
function logout() { if (rec) persist(); rec = null; login() }

/* ===== HUD: student id, points, level timer ===== */
const hudEl = D.querySelector('.hud');
hudEl.insertAdjacentHTML('beforeend', '<div id=nbU></div><div id=nbS></div><div id=nbT></div><button id=nbSv>💾 Save results</button><button id=nbHub>🎓 Teacher</button><button id=nbOut>Log out</button>');
g('nbSv').onclick = () => rec && saveM(); g('nbHub').onclick = openHub; g('nbOut').onclick = logout;
function hud() { if (!rec) return; g('nbU').textContent = '👤 ' + rec.admin; g('nbS').textContent = tot(rec) + ' pts'; const x = LR(cur); g('nbT').textContent = '⏱ ' + x.spent + 's' + (x.done ? ' ✓' : '') }
function saveM() {
  persist();
  modal('nbV', `<div class=mh>My results · ${rec.admin} · ${tot(rec)} pts<button onclick="document.getElementById('nbV').classList.remove('open')">Close</button></div><div class=md>
  <p class=nbm>Give your teacher one of these files, or copy the code below and paste it into the Teacher Hub.</p>
  <div class=tbar><button class=sm id=nbJ>Download .json</button><button class=sm id=nbC>Download .csv</button></div>
  <textarea readonly style="min-height:90px">${block(rec)}</textarea></div>`, 0, 95);
  g('nbJ').onclick = () => dl(`netbuilder_${rec.admin}.json`, JSON.stringify(rec, null, 1), 'application/json');
  g('nbC').onclick = () => dl(`netbuilder_${rec.admin}.csv`, toCSV(rec), 'text/csv');
}

/* ===== Hooks into the game (functions are globals in script.js) ===== */
const wrap = (n, f) => { const o = window[n]; window[n] = (...a) => f(o, ...a) };
wrap('loadLevel', (o, id) => { o(id); cur = lv.id; runs = 0; if (rec) hud() });
wrap('test', (o, d) => { demo = !!d; if (rec && !d) { runs++; LR(cur).runs++ } return o(d) });
wrap('openSol', o => { if (rec) { if (!confirm('Viewing the solution costs 25% of this level’s points. Show it?')) return; LR(cur).sol++; persist() } o() });
wrap('startSim', o => { if (rec) { LR(cur).sim++; persist() } o() });
wrap('openNotes', (o, t) => { if (rec) { LR(cur).notes++; persist() } o(t) });
wrap('logM', (o, t, c) => {
  o(t, c); if (!rec || !/^LEVEL COMPLETE/.test(t)) return;
  if (demo) return o('Watch-only run: no points. Build it yourself and press Run Test to score.', 'i');
  const x = LR(cur), s = levelPts(cur, x.spent, x, runs); x.done = 1;
  if (s.pts > x.points) { x.points = s.pts; x.time = x.spent }
  o(`SCORE +${s.pts} pts (base ${s.b}, time ${x.spent}s ×${s.tf.toFixed(2)}, penalties ${Math.round(s.pen * 100)}%). Total ${tot(rec)}.`, 'o'); persist();
});
wrap('showQ', o => { o(); qT = Date.now() });
wrap('ans', (o, i) => {
  const b = D.querySelectorAll('.qo'); let msg = '';
  if (rec && b.length && !b[0].disabled) {
    const q = qs[qi], k = QZ.indexOf(q), ok = i == q[3], t = (Date.now() - qT) / 1000, d = q[0] == 'I' ? 2 : 1;
    const pts = ok ? Math.round(10 * d * Math.max(.5, 1.25 - t / 40)) : 0, e = rec.quiz[k];
    if (!e || pts > e.pts) rec.quiz[k] = { ok, pts, time: Math.round(t) }; persist(); msg = ` +${pts} pts`;
  }
  o(i); if (msg && g('qf')) g('qf').firstChild.append(msg);
});
['mousedown', 'keydown', 'touchstart'].forEach(e => D.addEventListener(e, () => lastIn = Date.now()));
/* Active-time clock: counts only while the tab is visible and the student is interacting */
setInterval(() => { if (!rec) return; const x = LR(cur); if (!x.done && !D.hidden && Date.now() - lastIn < 60000) { x.spent++; if (x.spent % 5 == 0) persist() } hud() }, 1000);

/* ===== Teacher Hub ===== */
function merge(a, b) {
  const r = norm(a); r.updated = Math.max(a.updated || 0, b.updated || 0);
  for (const i in b.levels) { const x = r.levels[i], y = b.levels[i]; if (!x || (y.points || 0) > (x.points || 0) || (y.done && !x.done)) r.levels[i] = { ...newL(), ...y } }
  for (const i in b.quiz) { const x = r.quiz[i], y = b.quiz[i]; if (!x || (y.pts || 0) > (x.pts || 0)) r.quiz[i] = y }
  return r;
}
function fromCSV(t) {
  const m = {}; t.split(/\r?\n/).forEach(l => { const c = l.split(',').map(s => s.trim());
    if (!/^\d{5,6}$/.test(c[0])) return; const r = m[c[0]] || (m[c[0]] = norm({ admin: c[0] }));
    if (c[1] == 'L') r.levels[c[2]] = { ...newL(), done: +c[3], points: +c[4], time: +c[5], runs: +c[6] || 0, sol: +c[7] || 0 };
    else if (c[1] == 'Q') r.quiz[c[2]] = { ok: !!+c[3], pts: +c[4], time: +c[5] } });
  return Object.values(m);
}
function ingest(text) {
  const t = text.trim(); let out = [];
  try {
    if (t[0] == '{' || t[0] == '[') out = [].concat(JSON.parse(t));
    else if (/NBRESULT:/.test(t)) t.split(/\s+/).forEach(w => { if (w.startsWith('NBRESULT:')) out.push(JSON.parse(atob(w.slice(9)))) });
    else out = fromCSV(t);
  } catch (e) { return null }
  return out;
}
function add(list) {
  let n = 0, u = 0, bad = 0;
  list.forEach(r => { if (!r || !/^\d{5,6}$/.test(String(r.admin))) { bad++; return } r = norm(r); if (cls[r.admin]) { u++; cls[r.admin] = merge(cls[r.admin], r) } else { n++; cls[r.admin] = r } });
  ss('class', cls); return `Imported: ${n} new, ${u} merged (duplicates), ${bad} rejected.`;
}
function openHub() {
  const m = modal('nbH', '', 1, 110);
  if (!unlocked) {
    m.firstChild.innerHTML = `<div class=mh>Teacher Hub<button id=nbX>Close</button></div><div class=md style="max-width:340px"><label>Teacher PIN<input id=nbP type=password></label><div id=nbPE style="color:var(--r);font-size:.78rem"></div><button class=sm id=nbPG>Unlock</button></div>`;
    const go = () => { if (g('nbP').value === sg('pin', DEFAULT_PIN)) { unlocked = true; hub() } else g('nbPE').textContent = 'Wrong PIN.' };
    g('nbPG').onclick = go; g('nbP').onkeydown = e => { if (e.key == 'Enter') go() }; g('nbX').onclick = () => shut('nbH'); g('nbP').focus();
  } else hub();
}
function hub(msg = '') {
  const ids = Object.keys(cls), rows = ids.map(a => ({ a, r: cls[a], t: tot(cls[a]) })).sort((x, y) => y.t - x.t || timeOf(x.r) - timeOf(y.r));
  const avg = (a, f) => a.length ? Math.round(a.reduce((s, x) => s + f(x), 0) / a.length) : '-';
  const lvRows = LEVELS.map(l => { const e = ids.map(a => cls[a].levels[l.id]).filter(Boolean), d = e.filter(x => x.done);
    return `<tr><td>${l.title}</td><td>${d.length}/${ids.length}</td><td>${avg(d, x => x.points)}</td><td>${avg(d, x => x.time)}s</td><td>${e.filter(x => hintsOf(x) > 0).length}</td><td>${avg(e, x => x.runs)}</td></tr>` }).join('');
  const rk = rows.map((x, i) => `<tr class=cl data-a="${x.a}"><td>${i + 1}</td><td>${x.a}</td><td><b>${x.t}</b></td><td>${doneOf(x.r)}/${LEVELS.length}</td><td>${sum(x.r.quiz, q => q.pts)}</td><td>${sum(x.r.levels, hintsOf)}</td><td>${timeOf(x.r)}s</td></tr>`).join('');
  modal('nbH', `<div class=mh>Teacher Hub · Class marks (${ids.length} students)<button id=nbX>Close</button></div><div class=md>
  <div class=tbar><label class=nbm>Import files <input id=nbF type=file multiple accept=".json,.csv,.txt"></label><button class=sm id=nbXp>Export Master CSV</button><button id=nbPin>Change PIN</button><button id=nbClr>Clear class data</button></div>
  <label>Or paste summary blocks / CSV / JSON<textarea id=nbPaste style="min-height:60px"></textarea></label><div class=tbar><button class=sm id=nbImp>Import pasted</button><span class=nbm id=nbMsg>${msg}</span></div>
  <b>Class high-score table</b><table class=nbt><tr><th>#</th><th>ADMIN NO</th><th>Points</th><th>Levels</th><th>Quiz pts</th><th>Hints</th><th>Time</th></tr>${rk || '<tr><td colspan=7>No students imported yet.</td></tr>'}</table>
  <div id=nbDet class=nbm>Click a student for per-level detail.</div>
  <b>Per-level completion &amp; hint usage</b><table class=nbt><tr><th>Level</th><th>Completed</th><th>Avg pts</th><th>Avg time</th><th>Used hints</th><th>Avg runs</th></tr>${lvRows}</table></div>`, 1, 110);
  g('nbX').onclick = () => shut('nbH');
  g('nbF').onchange = async e => { let s = ''; for (const f of e.target.files) { const l = ingest(await f.text()); s += l ? `${f.name}: ${add(l)} ` : `${f.name}: unreadable. ` } hub(s) };
  g('nbImp').onclick = () => { const l = ingest(g('nbPaste').value); hub(l ? add(l) : 'Could not read the pasted text.') };
  g('nbXp').onclick = () => {
    const h = ['Rank', 'AdminNo', 'TotalPts', 'LevelsDone', 'QuizPts', 'QuizCorrect', 'Hints', 'TotalTime_s'];
    LEVELS.forEach(l => h.push(`L${l.id}_pts`, `L${l.id}_time_s`, `L${l.id}_hints`));
    const b = rows.map((x, i) => [i + 1, x.a, x.t, doneOf(x.r), sum(x.r.quiz, q => q.pts), sum(x.r.quiz, q => q.ok ? 1 : 0), sum(x.r.levels, hintsOf), timeOf(x.r),
      ...LEVELS.flatMap(l => { const y = x.r.levels[l.id] || {}; return [y.points || 0, y.done ? y.time : '', hintsOf(y)] })].join(','));
    dl('netbuilder_master_class.csv', [h.join(','), ...b].join('\n'), 'text/csv') };
  g('nbPin').onclick = () => { const p = prompt('New teacher PIN (4+ characters):'); if (p && p.length >= 4) { ss('pin', p); hub('PIN changed on this device.') } };
  g('nbClr').onclick = () => { if (confirm('Delete ALL imported class data on this device?')) { cls = {}; ss('class', cls); hub('Class data cleared.') } };
  D.querySelectorAll('#nbH tr.cl').forEach(tr => tr.onclick = () => { const r = cls[tr.dataset.a];
    g('nbDet').innerHTML = `<b>${r.admin}</b><table class=nbt><tr><th>Level</th><th>Done</th><th>Pts</th><th>Time</th><th>Runs</th><th>Solution views</th><th>Simulate</th></tr>` +
      LEVELS.map(l => { const y = r.levels[l.id] || {}; return `<tr><td>${l.id}</td><td>${y.done ? '✓' : '–'}</td><td>${y.points || 0}</td><td>${y.done ? y.time + 's' : '-'}</td><td>${y.runs || 0}</td><td>${y.sol || 0}</td><td>${y.sim || 0}</td></tr>` }).join('') + '</table>' });
}

login();
})();
