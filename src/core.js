"use strict";
// ===================== УТИЛИТЫ =====================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const today = () => new Date().toISOString().slice(0, 10);
const norm = s => String(s || "").toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:"«»]/g, "").replace(/\s+/g, " ").trim();
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const lv = l => `<span class="lv lv-${l}">${l}</span>`;
const POS = {n:"сущ.",v:"глагол",adj:"прил.",adv:"нареч.",prep:"предлог",pron:"местоим.",conj:"союз",phr:"выражение",num:"числит.",det:"определит.",int:"междом."};
function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }
function modal(html) { closeModal(); const bg = document.createElement("div"); bg.className = "modal-bg"; bg.id = "modal"; bg.innerHTML = `<div class="modal"><button class="icon-btn x" data-act="closeModal" aria-label="Закрыть">✕</button>${html}</div>`; bg.addEventListener("click", e => { if (e.target === bg) closeModal(); }); document.body.appendChild(bg); return bg; }
function closeModal() { $("#modal")?.remove(); }
async function sha(s) { try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); } catch { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return "x" + h; } }
const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }, del(k) { try { localStorage.removeItem(k); } catch {} } };

// ===================== СЛОВАРЬ =====================
const VOCAB = []; const VBYID = {};
function parseExtras(s) { const o = {}; (s || "").split(";").forEach(p => { const m = p.match(/^([fsacm]):(.*)$/); if (m) o[m[1]] = m[2].trim(); }); return o; }
function addWord(w) { if (!w.id) w.id = w.level + ":" + w.word.toLowerCase(); if (VBYID[w.id]) Object.assign(VBYID[w.id], w); else { VOCAB.push(w); VBYID[w.id] = w; } return w; }
function loadVocab() {
  for (const L of LEVELS) (VOCAB_RAW[L] || "").trim().split("\n").forEach(line => {
    const f = line.split("|"); if (f.length < 8) return;
    const x = parseExtras(f[8]);
    addWord({ level: L, word: f[0].trim(), pos: f[1], ru: f[2], ipa: f[3], rupr: f[4], ex: f[5], exru: f[6], topic: f[7], forms: x.f || "", syn: x.s || "", ant: x.a || "", col: x.c || "", mis: x.m || "" });
  });
}
// Приблизительная русская запись по IPA — для слов, добавленных без подсказки
function ipaToRu(ipa) {
  const map = [["tʃ","ч"],["dʒ","дж"],["aɪə","айэ"],["aʊə","ауэ"],["eɪ","эй"],["aɪ","ай"],["ɔɪ","ой"],["aʊ","ау"],["əʊ","оу"],["oʊ","оу"],["ɪə","иэ"],["eə","эа"],["ʊə","уэ"],["iː","и:"],["uː","у:"],["ɑː","а:"],["ɔː","о:"],["ɜː","ё:"],["ɝ","ё:"],["θ","с"],["ð","з"],["ʃ","ш"],["ʒ","ж"],["ŋ","нг"],["æ","э"],["ʌ","а"],["ɒ","о"],["ɪ","и"],["ʊ","у"],["ə","э"],["e","э"],["i","и"],["u","у"],["a","а"],["o","о"],["p","п"],["b","б"],["t","т"],["d","д"],["k","к"],["ɡ","г"],["g","г"],["f","ф"],["v","в"],["s","с"],["z","з"],["h","х"],["m","м"],["n","н"],["l","л"],["r","р"],["j","й"],["w","у"]];
  let s = (ipa || "").replace(/[\/\[\]]/g, ""), out = "", stress = false;
  while (s.length) {
    if (s[0] === "ˈ") { stress = true; s = s.slice(1); continue; }
    if ("ˌ.ː ".includes(s[0])) { if (s[0] === " ") out += " "; s = s.slice(1); continue; }
    const m = map.find(([k]) => s.startsWith(k));
    if (!m) { s = s.slice(1); continue; }
    let r = m[1];
    if (stress && /[аэиоуёы]/.test(r)) { r = r.replace(/([аэиоуёы])/, "$1́"); stress = false; }
    out += r; s = s.slice(m[0].length);
  }
  return out;
}
function soundTips(ipa) { return Object.entries(SOUND_TIPS).filter(([k]) => k === "r" ? false : (ipa || "").includes(k)).map(([, v]) => v); }

// ===================== ХРАНИЛИЩЕ И ПРОФИЛИ =====================
const DEFAULT_STATE = () => ({ v: 2, profile: { name: "", level: "A1", created: Date.now(), goal: "DET" }, words: {}, fav: [], lists: {}, personal: {}, mistakes: [], history: [], grammar: {}, levelExams: {}, activity: {}, streak: { last: "", count: 0 }, skill: { Reading: [], Listening: [], Writing: [], Speaking: [], Vocabulary: [], Grammar: [] }, det: {}, mocks: [], daily: { date: "", done: {} }, settings: { theme: "light", accent: "en-GB", rate: 1, engine: "auto", dailyNew: 10, dailyReview: 20 }, custom: { words: [], lessons: {}, exercises: [] }, gen: {} });
const Store = {
  key: null, state: DEFAULT_STATE(), cloud: null, cloudRef: null, saveT: null, mode: "local",
  profiles() { return LS.get("ep_profiles", {}); },
  async register(name, pass) {
    const ps = this.profiles(); const k = "p_" + name.toLowerCase().trim();
    if (!name.trim()) throw "Введите имя"; if (ps[k]) throw "Такой профиль уже есть на этом устройстве";
    ps[k] = { name: name.trim(), hash: pass ? await sha(k + pass) : "" }; LS.set("ep_profiles", ps);
    this.key = k; this.state = DEFAULT_STATE(); this.state.profile.name = name.trim(); this.save(true); LS.set("ep_last", k);
  },
  async login(name, pass) {
    const ps = this.profiles(); const k = "p_" + name.toLowerCase().trim(); const p = ps[k];
    if (!p) throw "Профиль не найден"; if (p.hash && p.hash !== await sha(k + pass)) throw "Неверный пароль";
    this.key = k; this.state = Object.assign(DEFAULT_STATE(), LS.get("ep_s_" + k, {})); LS.set("ep_last", k);
  },
  logout() { this.flush(); LS.del("ep_last"); this.key = null; this.state = DEFAULT_STATE(); },
  resume() { const k = LS.get("ep_last", null); if (k && this.profiles()[k]) { this.key = k; this.state = Object.assign(DEFAULT_STATE(), LS.get("ep_s_" + k, {})); for (const f of ["settings", "skill", "custom"]) this.state[f] = Object.assign(DEFAULT_STATE()[f], this.state[f]); return true; } return false; },
  save(now) { if (!this.key) return; LS.set("ep_s_" + this.key, this.state); clearTimeout(this.saveT); this.saveT = setTimeout(() => this.pushCloud(), now ? 50 : 2500); },
  flush() { clearTimeout(this.saveT); if (this.key) LS.set("ep_s_" + this.key, this.state); this.pushCloud(); },
  async pushCloud() { if (!this.cloudRef || this.mode !== "cloud") return; try { await this.cloudRef.set({ json: JSON.stringify(this.state), updated: Date.now() }); Cloud.status("сохранено в облаке"); } catch (e) { Cloud.status("ошибка облачного сохранения"); } },
};
// Облачный слой: аккаунт claude.ai (user) + база (db). Если недоступны — работаем локально.
const Cloud = {
  db: null, user: null, uid: null, shared: null,
  status(t) { const el = $("#cloudStatus"); if (el) el.textContent = t; },
  async init() {
    if (!window.claude?.use) return;
    try { this.user = await claude.use("user"); } catch {}
    try { this.db = await claude.use("db"); } catch {}
    if (this.user) { try { this.uid = await this.user.id(); } catch {} }
    if (this.db) this.loadShared();
    App.cloudReady();
  },
  async connect() {
    if (!this.db || !this.uid) return false;
    const ref = this.db.collection("data/users/" + this.uid).doc("state");
    let snap = null; try { snap = await ref.get(); } catch {}
    const remote = snap && (snap.data ? snap.data() : snap);
    Store.key = "cloud_" + this.uid; Store.cloudRef = ref; Store.mode = "cloud";
    const local = LS.get("ep_s_" + Store.key, null);
    let st = null;
    if (remote && remote.json) { try { st = JSON.parse(remote.json); } catch {} }
    if (!st && local) st = local;
    Store.state = Object.assign(DEFAULT_STATE(), st || {});
    for (const f of ["settings", "skill", "custom"]) Store.state[f] = Object.assign(DEFAULT_STATE()[f], Store.state[f]);
    if (!Store.state.profile.name) { try { const me = await this.user.me(); Store.state.profile.name = me?.name || ""; } catch {} }
    LS.set("ep_last", Store.key); Store.save(true); return true;
  },
  async loadShared() {
    try { const s = await this.db.doc("content/custom").get(); const d = s && (s.data ? s.data() : s); if (d && d.json) { const c = JSON.parse(d.json); (c.words || []).forEach(w => addWord(w)); Object.assign(CUSTOM_LESSONS, c.lessons || {}); this.shared = c; } } catch {}
  },
  async publishShared(c) { if (!this.db) throw "Облачная база недоступна"; await this.db.doc("content/custom").set({ json: JSON.stringify(c), updated: Date.now() }); }
};
const CUSTOM_LESSONS = {};
const S = () => Store.state;

// ===================== АКТИВНОСТЬ И СТАТИСТИКА =====================
let sessionStart = Date.now();
function tick() { const s = S(); const d = today(); const mins = Math.round((Date.now() - sessionStart) / 60000); if (mins >= 1) { s.activity[d] = (s.activity[d] || 0) + mins; sessionStart = Date.now(); Store.save(); } }
function markActive() {
  const s = S(), d = today(); if (!s.activity[d]) s.activity[d] = 0;
  if (s.streak.last !== d) { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); s.streak.count = s.streak.last === y ? s.streak.count + 1 : 1; s.streak.last = d; }
}
function record(section, skill, score, total, meta) {
  const s = S(); markActive();
  s.history.push({ d: Date.now(), section, skill, score, total, meta }); if (s.history.length > 600) s.history.splice(0, 100);
  if (skill && s.skill[skill]) { s.skill[skill].push(Math.round(100 * score / Math.max(1, total))); if (s.skill[skill].length > 40) s.skill[skill].shift(); }
  Store.save();
}
function logMistake(section, q, user, correct, expl) {
  const s = S(); const key = norm(q) + "|" + norm(correct);
  const ex = s.mistakes.find(m => m.key === key);
  let m = ex; if (ex) { ex.count++; ex.date = Date.now(); ex.user = user; ex.fixed = false; } else { m = { key, section, q, user, correct, expl: expl || "", date: Date.now(), count: 1, fixed: false }; s.mistakes.unshift(m); }
  if (s.mistakes.length > 400) s.mistakes.pop(); Store.save(); return m;
}
const avg = a => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : null;
function skillAvg(k) { return avg(S().skill[k].slice(-10)); }

// ===================== ИНТЕРВАЛЬНОЕ ПОВТОРЕНИЕ (SM-2) =====================
const SRS = {
  get(id) { return S().words[id]; },
  grade(id, g) { // g: 0 не знаю, 1 сложно, 2 хорошо, 3 очень легко
    const s = S(); const w = s.words[id] || { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0, seen: 0, first: Date.now() };
    const q = [1, 3, 4, 5][g]; w.seen++; w.last = Date.now();
    if (q < 3) { w.reps = 0; w.lapses++; w.interval = 0; w.due = Date.now() + 10 * 60000; }
    else { w.reps++; w.interval = w.reps === 1 ? (g === 3 ? 3 : 1) : w.reps === 2 ? (g === 3 ? 7 : 3) : Math.round(w.interval * w.ease * (g === 3 ? 1.3 : 1)); w.due = Date.now() + w.interval * 864e5; }
    w.ease = Math.max(1.3, w.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    s.words[id] = w; markActive(); Store.save(); return w;
  },
  status(id) { const w = S().words[id]; if (!w) return "new"; if (w.interval >= 21) return "known"; if (w.reps === 0) return "learning"; return "review"; },
  due() { const n = Date.now(); return Object.entries(S().words).filter(([id, w]) => w.due <= n && VBYID[id]).map(([id]) => id); },
  learned() { return Object.values(S().words).filter(w => w.reps > 0).length; },
  weak() { return Object.entries(S().words).filter(([id, w]) => VBYID[id] && (w.lapses >= 2 || (w.reps === 0 && w.seen > 0))).map(([id]) => id); }
};
const STATUS_RU = { new: "новое", learning: "изучается", review: "на повторении", known: "выучено" };

// ===================== ОЗВУЧКА =====================
const Audio = {
  tts: null, voices: [], speakingEl: null,
  init() { const load = () => { try { this.voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); } catch {} }; try { load(); speechSynthesis.onvoiceschanged = load; } catch {} },
  async initCap() { try { this.tts = await claude.use("tts"); } catch {} },
  voiceFor(accent, idx = 0) { const want = accent.toLowerCase(); const vs = this.voices.filter(v => v.lang.toLowerCase().replace("_", "-") === want); const list = vs.length ? vs : this.voices; return list.length ? list[idx % list.length] : null; },
  hasBrowser() { return typeof speechSynthesis !== "undefined" && this.voices.length > 0; },
  async speak(text, opt = {}) {
    const st = S().settings; const rate = opt.rate || st.rate || 1; const accent = opt.accent || st.accent;
    const engine = st.engine;
    const useBrowser = (engine === "browser" || (engine === "auto" && (opt.accent || !this.tts))) && this.hasBrowser();
    this.stop();
    if (useBrowser) {
      return new Promise(res => { const u = new SpeechSynthesisUtterance(text); const v = this.voiceFor(accent, opt.voiceIdx || 0); if (v) { u.voice = v; u.lang = v.lang; } else u.lang = accent; u.rate = Math.max(0.5, Math.min(1.5, rate)); u.onend = u.onerror = () => res(); speechSynthesis.speak(u); });
    }
    if (this.tts) { try { await this.tts.speak(text, { language: "en", rate: Math.max(0.7, Math.min(1.5, rate)), voice: opt.voice }); } catch (e) { if (e?.code !== "viewer_stopped") toast("Озвучка недоступна: " + (e?.code || "ошибка")); } return; }
    toast("Озвучка недоступна в этом браузере");
  },
  async speakLines(lines, opt = {}) { // lines: [[speaker,text]]
    const st = S().settings; const vmap = {}; const tv = ["buttery", "airy", "glassy", "rounded"]; let i = 0;
    if (this.tts && st.engine !== "browser" && !opt.accent) { this.stop(); try { await this.tts.speak(lines.map(([sp, t]) => { if (!(sp in vmap)) vmap[sp] = tv[i++ % 4]; return { text: t, voice: vmap[sp], language: "en", rate: opt.rate || st.rate }; })); } catch {} return; }
    for (const [sp, t] of lines) { if (!(sp in vmap)) vmap[sp] = i++; if (this.cancelled) break; await this.speak(t, { ...opt, voiceIdx: vmap[sp] }); }
  },
  stop() { try { speechSynthesis.cancel(); } catch {} try { this.tts?.stop(); } catch {} }
};
function spk(text, extra = "") { return `<button class="icon-btn" data-act="say" data-t="${esc(text)}" ${extra} title="Прослушать" aria-label="Прослушать">🔊</button>`; }

// ===================== ДИКТОВКА (распознавание речи) =====================
const Mic = {
  d: null, rec: null, active: false, onText: null, text: "", partial: "",
  async initCap() { try { this.d = await claude.use("dictation"); if (this.d) { this.d.onPartial(({ text }) => { this.partial = text; this.emit(); }); this.d.onFinal(({ text }) => { this.text += (this.text ? " " : "") + text; this.partial = ""; this.emit(); }); this.d.onState(({ state }) => { this.active = state === "listening"; this.emitState(); }); } } catch {} },
  available() { return !!this.d || !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
  emit() { this.onText && this.onText((this.text + " " + this.partial).trim()); },
  emitState() { $$(".mic").forEach(b => { b.classList.toggle("on", this.active); b.innerHTML = this.active ? "⏹ Остановить" : "🎙 Говорить"; }); },
  start(onText) {
    this.text = ""; this.partial = ""; this.onText = onText;
    if (this.d) { this.d.start().catch(e => { toast(e?.code === "not_granted" ? "Доступ к микрофону не разрешён — введите ответ текстом" : "Не удалось включить микрофон"); this.active = false; this.emitState(); }); this.active = true; this.emitState(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast("Распознавание речи недоступно — введите ответ текстом"); return; }
    try { const r = new SR(); r.lang = "en-US"; r.continuous = true; r.interimResults = true; r.onresult = e => { let f = "", p = ""; for (const x of e.results) (x.isFinal ? (f += x[0].transcript + " ") : (p += x[0].transcript)); this.text = f.trim(); this.partial = p; this.emit(); }; r.onend = () => { this.active = false; this.emitState(); }; r.onerror = () => { toast("Микрофон недоступен — введите ответ текстом"); }; r.start(); this.rec = r; this.active = true; this.emitState(); } catch { toast("Микрофон недоступен"); }
  },
  async stop() { if (this.d) { try { await this.d.stop(); } catch {} } if (this.rec) { try { this.rec.stop(); } catch {} } this.active = false; this.emitState(); return (this.text + " " + this.partial).trim(); }
};

// ===================== AI-СЕРВИС =====================
// Сервисный слой: запросы к Claude идут через платформу (ключи не хранятся в коде страницы).
const AI = {
  s: null, ok: false,
  async initCap() { try { this.s = await claude.use("sample"); this.ok = !!this.s; } catch {} App.refreshAI(); },
  async json(prompt, tier = "default") { if (!this.s) throw { code: "unavailable" }; return await this.s.json(prompt, { modelTier: tier }); },
  async text(input, opts = {}) { if (!this.s) throw { code: "unavailable" }; const r = await this.s(input, { cache: false, ...opts }); return r.text; },
  errMsg(e) { return e?.code === "not_granted" ? "AI-проверка не разрешена в этом просмотре." : e?.code === "rate_limited" ? "Слишком много запросов — подождите минуту." : e?.code === "unavailable" ? "AI недоступен в этом просмотре — показана базовая проверка." : "AI-проверка не удалась: " + (e?.message || e?.code || "ошибка"); },
  async checkWriting(task, text, level) {
    const prompt = `You are an expert English teacher for Russian-speaking learners preparing for the Duolingo English Test. Check the learner's text.
Task: ${task}
Learner's target CEFR level: ${level}
Learner's text:
"""${text}"""
Return ONLY JSON with this shape:
{"corrected":"full corrected text","errors":[{"original":"exact wrong fragment","fix":"correction","type":"grammar|spelling|punctuation|word choice|structure|coherence","explanation_ru":"short explanation in Russian"}],"natural":"a more natural, fluent version at about ${level}+ level","scores":{"grammar":0-10,"spelling":0-10,"punctuation":0-10,"vocabulary":0-10,"structure":0-10,"coherence":0-10,"task":0-10},"estimated_cefr":"A1..C2","tips_ru":["3-5 concrete tips in Russian"],"useful_phrases":["3-5 English phrases that would improve the answer"]}
Do not invent errors. If the text is correct, return an empty errors array.`;
    return await this.json(prompt, "default");
  },
  async checkSpeaking(question, transcript, level) {
    const prompt = `You are an English speaking examiner for Russian-speaking learners. The learner answered a spoken question; below is an automatic speech-to-text transcript (it may contain recognition errors, and you cannot hear pronunciation, stress or intonation).
Question: ${question}
Target level: ${level}
Transcript: """${transcript}"""
Return ONLY JSON: {"errors":[{"original":"","fix":"","explanation_ru":""}],"improved":"improved model answer","scores":{"grammar":0-10,"vocabulary":0-10,"completeness":0-10,"coherence":0-10},"fluency_note_ru":"what can be inferred about fluency from length/fillers/repetition — be honest about limits","estimated_cefr":"","tips_ru":["..."],"useful_phrases":["..."]}`;
    return await this.json(prompt, "default");
  },
  async genLesson(title, level) {
    const prompt = `Create a complete English grammar lesson for Russian-speaking learners. Topic: "${title}". CEFR level: ${level}. All explanations in Russian; examples in natural modern English with Russian translations. Use only correct, well-established grammar rules.
Return ONLY JSON: {"explain":"HTML string with <p>, <b>, <i>, <ul><li> — clear explanation in Russian, 2-4 paragraphs","formulas":["sentence formulas"],"aff":[["English","Русский"]],"neg":[["English","Русский"]],"q":[["English","Русский"]],"table":"optional HTML <table class='t'> or empty string","exceptions":"HTML string (Russian) about exceptions and special cases","mistakes":["typical mistakes of Russian speakers, in Russian, with the correct form in <b>"],"ex":[{"q":"exercise question with ___","o":["option1","option2","option3"],"a":0,"e":"explanation in Russian"}],"quiz":[{"q":"","o":["","",""],"a":0,"e":""}],"summary":"one-paragraph summary in Russian"}
Provide 6 exercises (multiple choice, "a" is the 0-based index of the correct option) and 3 quiz questions.`;
    return await this.json(prompt, "complex");
  }
};
// Базовая (офлайн) проверка письма — честно ограниченная
const RULES = [
  [/\bi\b(?!')/g, "I", "Местоимение I всегда пишется с заглавной буквы.", "spelling"],
  [/\bi'm\b/g, "I'm", "I'm — с заглавной буквы.", "spelling"],
  [/\b(I|you|we|they) am agree\b/gi, "$1 agree", "agree — глагол; am не нужен: I agree.", "grammar"],
  [/\b(I|you|we|they) (is|are) agree\b/gi, "$1 agree", "agree — глагол, to be не нужен.", "grammar"],
  [/\b(he|she|it) don't\b/gi, "$1 doesn't", "С he/she/it отрицание — doesn't.", "grammar"],
  [/\b(he|she|it) have\b/gi, "$1 has", "С he/she/it — has.", "grammar"],
  [/\bdid(n't| not)? (\w+ )?(went|saw|came|took|made|bought|ate|wrote|had)\b/gi, null, "После did глагол стоит в начальной форме (did go, didn't see).", "grammar"],
  [/\bpeople is\b/gi, "people are", "people — множественное число: people are.", "grammar"],
  [/\b(informations|advices|furnitures|knowledges|homeworks|luggages|researches)\b/gi, m => m.slice(0, -1), "Это неисчисляемое существительное — без -s.", "grammar"],
  [/\bmore (better|worse|bigger|smaller|easier|harder)\b/gi, "$1", "Двойное сравнение: достаточно одной формы (better).", "grammar"],
  [/\bexplain me\b/gi, "explain to me", "explain something to somebody.", "word choice"],
  [/\bmarried with\b/gi, "married to", "married to somebody.", "word choice"],
  [/\bsince (\d+|two|three|four|five|ten) (years|months|days|weeks)\b/gi, "for $1 $2", "С периодом времени — for, since — с точкой отсчёта.", "grammar"],
  [/\ba ([aeio]\w+)/gi, "an $1", "Перед гласным звуком — an.", "grammar"],
  [/\bdepend from\b/gi, "depend on", "depend on.", "word choice"],
  [/\b(we|they|you) was\b/gi, "$1 were", "С we/you/they — were (was только с I, he, she, it).", "grammar"],
  [/\bin the internet\b/gi, "on the internet", "on the internet.", "word choice"],
  [/\bmake (a )?(mistake|homework)s?\b/gi, null, "Сочетания: make a mistake, но do homework.", "word choice"],
  [/\b(recieve|beleive|untill|wich|becouse|freind|adress|tommorow|definately|goverment|enviroment|beautifull|realy|wierd|seperate|accomodation|occured|begining|studing)\b/gi, m => ({recieve:"receive",beleive:"believe",untill:"until",wich:"which",becouse:"because",freind:"friend",adress:"address",tommorow:"tomorrow",definately:"definitely",goverment:"government",enviroment:"environment",beautifull:"beautiful",realy:"really",wierd:"weird",seperate:"separate",accomodation:"accommodation",occured:"occurred",begining:"beginning",studing:"studying"})[m.toLowerCase()], "Орфографическая ошибка.", "spelling"]
];
const LINKERS = ["however", "moreover", "therefore", "although", "because", "for example", "for instance", "in addition", "on the other hand", "firstly", "secondly", "finally", "in conclusion", "as a result", "furthermore", "whereas", "despite", "while", "so", "but", "also", "to sum up", "nevertheless", "consequently"];
function basicCheck(text) {
  let corrected = text; const errors = [];
  const seenE = new Set();
  for (const [re, rep, expl, type] of RULES) {
    const m = text.match(re); if (!m) continue;
    const skipA = frag => re.source.startsWith("\\ba (") && /^a (use|uni|euro|one|once|u\w)/i.test(frag);
    const fixOf = frag => { let f = typeof rep === "function" ? rep(frag) : frag.replace(new RegExp(re.source, re.flags.replace("g", "")), rep); if (/^[A-Z]/.test(frag) && /^[a-z]/.test(f)) f = f[0].toUpperCase() + f.slice(1); return f; };
    m.forEach(frag => { if (skipA(frag)) return; const fix = rep === null ? "—" : fixOf(frag); const k = frag + "→" + fix; if (seenE.has(k)) return; seenE.add(k); errors.push({ original: frag, fix, type: type || "grammar", explanation_ru: expl }); });
    if (rep !== null) corrected = corrected.replace(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"), frag => skipA(frag) ? frag : fixOf(frag));
  }
  const sents = text.split(/(?<=[.!?])\s+/).filter(x => x.trim());
  sents.forEach(s0 => { const s = s0.trim(); if (/^[a-z]/.test(s)) { errors.push({ original: s.slice(0, 18) + "…", fix: s[0].toUpperCase() + s.slice(1, 18) + "…", type: "punctuation", explanation_ru: "Предложение начинается с заглавной буквы." }); corrected = corrected.replace(s, s[0].toUpperCase() + s.slice(1)); } });
  if (text.trim() && !/[.!?]$/.test(text.trim())) { errors.push({ original: "…" + text.trim().slice(-12), fix: "…" + text.trim().slice(-12) + ".", type: "punctuation", explanation_ru: "В конце предложения нужен знак препинания." }); corrected = corrected.trim() + "."; }
  if (/ {2,}/.test(text)) errors.push({ original: "двойные пробелы", fix: "один пробел", type: "punctuation", explanation_ru: "Лишние пробелы." });
  if (/\s[,.]/.test(text)) errors.push({ original: "пробел перед знаком", fix: "без пробела", type: "punctuation", explanation_ru: "Перед запятой и точкой пробел не ставится." });
  const words = (text.toLowerCase().match(/[a-z']+/g) || []); const uniq = new Set(words);
  const ttr = words.length ? uniq.size / words.length : 0; const avgLen = sents.length ? words.length / sents.length : 0;
  const linkers = LINKERS.filter(l => new RegExp("\\b" + l + "\\b", "i").test(text));
  return { corrected, errors, stats: { words: words.length, sentences: sents.length, ttr: Math.round(ttr * 100), avgLen: Math.round(avgLen * 10) / 10, linkers } };
}

// ===================== РОУТЕР И ДЕЙСТВИЯ =====================
const ACT = {}; const VIEWS = {};
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const f = ACT[el.dataset.act]; if (f) { e.preventDefault(); f(el, e); }
});
ACT.closeModal = () => closeModal();
ACT.say = el => { Audio.speak(el.dataset.t, { rate: el.dataset.rate ? +el.dataset.rate : undefined, accent: el.dataset.acc || undefined }); };
ACT.go = el => { location.hash = el.dataset.to; };
const NAV = [["home", "🏠", "Главная"], ["mylevel", "🎯", "Мой уровень"], ["vocab", "📚", "Vocabulary"], ["grammar", "🧩", "Grammar"], ["reading", "📖", "Reading"], ["listening", "🎧", "Listening"], ["writing", "✍️", "Writing"], ["speaking", "🗣", "Speaking"], ["det", "🦉", "DET Preparation"], ["mock", "⏱", "Mock Test"], ["-"], ["progress", "📈", "Мой прогресс"], ["personal", "⭐", "Личный словарь"], ["mistakes", "📓", "Журнал ошибок"], ["dictionary", "🔎", "Словарь EN–RU"], ["phrases", "💬", "Фразы и идиомы"], ["wordformation", "🧬", "Словообразование"], ["chat", "🤖", "Собеседник"], ["-"], ["settings", "⚙️", "Настройки"], ["admin", "🛠", "Админ-панель"]];
function renderNav(cur) {
  const base = cur.split("-")[0];
  const map = { level: "mylevel", diagnostic: "mylevel", lesson: "grammar", read: "reading", listen: "listening", study: "vocab", topic: "vocab", daily: "home" };
  const on = map[base] || cur;
  $("#nav").innerHTML = NAV.map(n => n[0] === "-" ? `<div class="sep"></div>` : `<a href="#${n[0]}" class="${on === n[0] || (n[0] === "det" && base === "det") ? "on" : ""}"><span class="ic">${n[1]}</span>${n[2]}</a>`).join("");
}
let CUR = "";
function route() {
  Audio.stop(); clearAllTimers(); closeModal(); $("#side").classList.remove("open");
  let h = decodeURIComponent(location.hash.slice(1)) || "home";
  if (!Store.key && h !== "login") h = "login";
  CUR = h; renderNav(h);
  const name = Object.keys(VIEWS).sort((a, b) => b.length - a.length).find(k => h === k || h.startsWith(k + "-"));
  const arg = name && h.length > name.length ? h.slice(name.length + 1) : "";
  const v = $("#view"); v.className = "view"; void v.offsetWidth;
  try { v.innerHTML = ""; (VIEWS[name] || VIEWS.home)(v, arg); } catch (e) { console.error(e); v.innerHTML = `<div class="err"><b>Ошибка отображения страницы.</b><br>${esc(e.message || e)}</div>`; }
  window.scrollTo(0, 0); tick();
}
const TIMERS = new Set();
function clearAllTimers() { TIMERS.forEach(t => clearInterval(t)); TIMERS.clear(); }
function countdown(el, sec, onEnd) { let left = sec; const fmt = () => { const m = Math.floor(left / 60), s = left % 60; el.textContent = `${m}:${String(s).padStart(2, "0")}`; el.classList.toggle("low", left <= 10); }; fmt(); const t = setInterval(() => { left--; fmt(); if (left <= 0) { clearInterval(t); TIMERS.delete(t); onEnd && onEnd(); } }, 1000); TIMERS.add(t); return { stop() { clearInterval(t); TIMERS.delete(t); }, left: () => left }; }
function applyTheme() { document.documentElement.dataset.theme = S().settings.theme === "dark" || (S().settings.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"; }
