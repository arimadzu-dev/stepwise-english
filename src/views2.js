// ===================== GRAMMAR =====================
VIEWS.grammar = v => {
  const s = S(); const L0 = s.profile.level;
  v.innerHTML = `<h1>Grammar</h1><p class="sub">Полная программа от A1 до C2: ${Object.values(GRAMMAR_TOPICS).flat().length} тем. Каждый урок — объяснение на русском, формулы, примеры, типичные ошибки, упражнения и мини-тест.</p>
  <input type="search" id="gs" placeholder="Поиск темы: Present Perfect, артикли, inversion…" style="margin-bottom:12px"><div class="tabs" id="gt">${LEVELS.map(l => `<button class="tab ${l === L0 ? "on" : ""}" data-l="${l}">${l}</button>`).join("")}</div><div id="gl" class="grid g3"></div>
  <p class="muted" style="font-size:13px;margin-top:12px">✍️ — урок написан и проверен вручную; ✨ — урок создаётся AI по запросу и сохраняется в вашем профиле (можно заменить авторским через админ-панель).</p>`;
  const card = (L, t) => { const [n, id] = t.split("|"); const hand = GRAMMAR_LESSONS[id] || CUSTOM_LESSONS[id]; return `<a class="card link" href="#lesson-${id}" style="text-decoration:none;color:inherit;padding:12px 14px"><div class="row between">${lv(L)}${s.grammar[id] ? `<span class="pill">✓ ${s.grammar[id]}%</span>` : ""}</div><b style="display:block;margin-top:6px">${esc(n)}</b><div class="muted" style="font-size:12px">${hand ? "✍️ авторский урок" : s.gen[id] ? "✨ сохранённый AI-урок" : "✨ AI-урок по запросу"}</div></a>`; };
  const draw = L => { $("#gl").innerHTML = GRAMMAR_TOPICS[L].map(t => card(L, t)).join(""); };
  $$("#gt .tab").forEach(t => t.onclick = () => { $$("#gt .tab").forEach(x => x.classList.toggle("on", x === t)); draw(t.dataset.l); }); draw(L0);
  $("#gs").oninput = e => { const q = norm(e.target.value); if (!q) return draw($("#gt .tab.on").dataset.l); $("#gl").innerHTML = LEVELS.flatMap(L => GRAMMAR_TOPICS[L].filter(t => norm(t).includes(q)).map(t => card(L, t))).join("") || '<p class="muted">Не найдено.</p>'; };
};
function topicMeta(id) { for (const L of LEVELS) { const t = GRAMMAR_TOPICS[L].find(x => x.split("|")[1] === id); if (t) return { L, title: t.split("|")[0] }; } return null; }
VIEWS.lesson = (v, id) => {
  const meta = topicMeta(id) || { L: "A1", title: id }; const s = S();
  const les = GRAMMAR_LESSONS[id] || CUSTOM_LESSONS[id] || s.gen[id];
  if (!les) {
    v.innerHTML = `<a href="#grammar">← Grammar</a><div class="row" style="margin:10px 0">${lv(meta.L)}<h1 style="margin:0">${esc(meta.title)}</h1></div>
    <div class="card stack"><p>Для этой темы ещё нет авторского урока. Его можно создать с помощью AI — он будет содержать объяснение на русском, формулы, примеры, типичные ошибки, 6 упражнений и мини-тест, и сохранится в вашем профиле.</p><p class="muted" style="font-size:13px">AI-материалы проходят автоматическую проверку структуры, но могут содержать неточности. Если заметите ошибку — отредактируйте урок в админ-панели.</p><div class="row"><button class="btn pri" id="genB" ${AI.ok ? "" : "disabled"}>✨ Создать урок</button>${AI.ok ? "" : `<span class="muted">AI недоступен в этом просмотре. Откройте страницу на claude.ai, будучи авторизованным.</span>`}</div><div id="genSt"></div></div>`;
    $("#genB").onclick = async () => { $("#genB").disabled = true; $("#genSt").innerHTML = `<p class="muted">⏳ Готовим урок (до минуты)…</p>`; try { const L = await AI.genLesson(meta.title, meta.L); if (!L || !L.explain || !Array.isArray(L.ex)) throw { message: "неполный ответ" }; L.ex = L.ex.filter(x => Array.isArray(x.o) && Number.isInteger(x.a) && x.a < x.o.length); L.quiz = (L.quiz || []).filter(x => Array.isArray(x.o) && Number.isInteger(x.a) && x.a < x.o.length); L.level = meta.L; L.title = meta.title; L.ai = true; s.gen[id] = L; Store.save(true); route(); } catch (e) { $("#genSt").innerHTML = `<div class="err">${esc(AI.errMsg(e))}</div>`; $("#genB").disabled = false; } };
    return;
  }
  const exl = arr => (arr || []).map(([en, ru]) => `<div class="ex"><div class="row">${esc(en)} ${spk(en)}</div><div class="ru">${esc(ru)}</div></div>`).join("");
  const all = GRAMMAR_TOPICS[meta.L].map(t => t.split("|")[1]); const k = all.indexOf(id);
  v.innerHTML = `<a href="#grammar">← Grammar</a><div class="row" style="margin:10px 0">${lv(meta.L)}<h1 style="margin:0">${esc(les.title || meta.title)}</h1>${les.ai ? `<span class="pill">✨ AI-урок</span>` : ""}</div>
  <div class="tabs" id="lt">${["Теория", "Упражнения", "Мини-тест"].map((t, i) => `<button class="tab ${i ? "" : "on"}" data-i="${i}">${t}</button>`).join("")}</div>
  <div id="lp0" class="stack"><div class="card">${les.explain}</div>
  ${(les.formulas || []).length ? `<div class="card"><h3>Формулы</h3>${les.formulas.map(f => `<div class="formula">${esc(f)}</div>`).join("")}</div>` : ""}
  <div class="grid g3"><div class="card"><h3>➕ Утверждение</h3>${exl(les.aff)}</div><div class="card"><h3>➖ Отрицание</h3>${exl(les.neg)}</div><div class="card"><h3>❓ Вопрос</h3>${exl(les.q)}</div></div>
  ${les.table ? `<div class="card" style="overflow-x:auto"><h3>Таблица</h3>${les.table}</div>` : ""}
  ${les.exceptions ? `<div class="card warn"><h3>Исключения и особые случаи</h3>${les.exceptions}</div>` : ""}
  ${(les.mistakes || []).length ? `<div class="card"><h3>Типичные ошибки русскоязычных учеников</h3><ul>${les.mistakes.map(m => `<li>${m}</li>`).join("")}</ul></div>` : ""}
  <div class="card note"><h3>Итоговое повторение</h3><p>${esc(les.summary || "")}</p></div>
  <div class="row"><button class="btn pri" id="toEx">К упражнениям →</button></div></div>
  <div id="lp1" class="hide"></div><div id="lp2" class="hide"></div>
  <div class="row between" style="margin-top:18px">${k > 0 ? `<a href="#lesson-${all[k - 1]}">← ${esc(GRAMMAR_TOPICS[meta.L][k - 1].split("|")[0])}</a>` : "<span></span>"}${k < all.length - 1 ? `<a href="#lesson-${all[k + 1]}">${esc(GRAMMAR_TOPICS[meta.L][k + 1].split("|")[0])} →</a>` : ""}</div>`;
  const show = i => { $$("#lt .tab").forEach(x => x.classList.toggle("on", +x.dataset.i === i)); [0, 1, 2].forEach(j => $("#lp" + j).classList.toggle("hide", j !== i));
    if (i === 1) runQuiz($("#lp1"), les.ex || [], { section: "Grammar: " + meta.title, skill: "Grammar", meta: { route: "lesson-" + id }, onDone: (sc, t) => { $("#lp1").innerHTML = resultCard(sc, t) + `<div class="row" style="margin-top:10px;justify-content:center"><button class="btn pri" id="toQ">Мини-тест →</button></div>`; $("#toQ").onclick = () => show(2); } });
    if (i === 2) runQuiz($("#lp2"), les.quiz || [], { section: "Grammar: " + meta.title, skill: "Grammar", onDone: (sc, t) => { const p = Math.round(100 * sc / t); s.grammar[id] = Math.max(s.grammar[id] || 0, p); markDaily("grammar"); Store.save(); $("#lp2").innerHTML = resultCard(sc, t) + `<div class="note" style="margin-top:10px">Тема отмечена как пройденная (${p}%).</div>`; } }); };
  $$("#lt .tab").forEach(t => t.onclick = () => show(+t.dataset.i)); $("#toEx").onclick = () => show(1);
};

// ===================== READING =====================
VIEWS.reading = v => {
  v.innerHTML = `<h1>Reading</h1><p class="sub">Тексты A1–C2. Нажмите на любое слово, чтобы увидеть перевод, IPA и русскую подсказку и добавить его в личный словарь.</p><div class="grid g3">${READING.map(r => `<a class="card link stack" href="#read-${r.id}" style="text-decoration:none;color:inherit"><div class="row between">${lv(r.level)}${bestScore("read-" + r.id)}</div><h3>${esc(r.title)}</h3><div class="muted" style="font-size:13px">${esc(r.topic)} · ${r.text.split(/\s+/).length} слов · ${r.qs.length} вопросов</div></a>`).join("")}</div>`;
};
function bestScore(key) { const h = S().history.filter(x => x.meta?.key === key); if (!h.length) return ""; const b = Math.max(...h.map(x => Math.round(100 * x.score / x.total))); return `<span class="pill">лучший ${b}%</span>`; }
function lookup(word) { const w = norm(word).replace(/'s$/, ""); if (!w) return null; const cands = [w, w.replace(/ies$/, "y"), w.replace(/es$/, ""), w.replace(/s$/, ""), w.replace(/ed$/, ""), w.replace(/ed$/, "e"), w.replace(/ing$/, ""), w.replace(/ing$/, "e"), w.replace(/ly$/, ""), w.replace(/(.)\1ing$/, "$1"), w.replace(/(.)\1ed$/, "$1")]; for (const c of cands) { const f = VOCAB.find(x => norm(x.word) === c); if (f) return f; } const f2 = VOCAB.find(x => x.forms && x.forms.toLowerCase().split(/[,\s]+/).includes(w)); return f2 || null; }
function clickableText(t) { return t.split("\n").map(p => `<p>${p.replace(/([A-Za-z][A-Za-z'’-]*)/g, m => `<span class="tw">${m}</span>`)}</p>`).join(""); }
function bindLookup(root, unknown) {
  root.addEventListener("click", async e => { const sp = e.target.closest(".tw"); if (!sp) return; $$(".pop").forEach(p => p.remove()); const word = sp.textContent; const w = lookup(word); unknown && unknown.add(w ? w.id : word.toLowerCase());
    const pop = document.createElement("div"); pop.className = "pop"; const r = sp.getBoundingClientRect(); pop.style.left = Math.min(window.innerWidth - 310, r.left + window.scrollX) + "px"; pop.style.top = r.bottom + window.scrollY + 6 + "px";
    pop.innerHTML = w ? `<b>${esc(w.word)}</b> ${spk(w.word)}<div><span class="ipa">/${esc(w.ipa)}/</span> <span class="rupr">≈ ${esc(w.rupr)}</span></div><div>${esc(w.ru)}</div><div class="row" style="margin-top:6px"><button class="btn sm" data-act="word" data-id="${esc(w.id)}">Карточка</button><button class="btn sm pri" id="addP">+ В словарь</button></div>` : `<b>${esc(word)}</b> ${spk(word)}<div class="muted" id="aiTr" style="font-size:13px">Слова нет во встроенной базе.</div>${AI.ok ? `<button class="btn sm" id="aiB" style="margin-top:6px">✨ Перевести с AI</button>` : ""}`;
    document.body.appendChild(pop); Audio.speak(w ? w.word : word);
    const ap = $("#addP", pop); if (ap) ap.onclick = () => { S().personal[w.id] = { added: Date.now() }; Store.save(); toast("Добавлено в личный словарь"); pop.remove(); };
    const ab = $("#aiB", pop); if (ab) ab.onclick = async () => { ab.disabled = true; try { const ctx = sp.closest("p")?.textContent.slice(0, 400); const r = await AI.json(`Translate the English word "${word}" as used in this context into Russian for a learner. Context: "${ctx}". Return JSON {"lemma":"","ru":"","pos":"n|v|adj|adv|prep|conj|phr","ipa":"British IPA without slashes","ru_pron":"approximate pronunciation in Cyrillic with stress mark","example":"short natural example sentence","example_ru":""}`, "quick"); const nw = addWord({ level: "B1", word: r.lemma || word.toLowerCase(), pos: r.pos || "n", ru: r.ru, ipa: r.ipa || "", rupr: r.ru_pron || ipaToRu(r.ipa), ex: r.example || ctx, exru: r.example_ru || "", topic: "personal", forms: "", syn: "", ant: "", col: "", mis: "", ai: true }); S().custom.words.push(nw); S().personal[nw.id] = { added: Date.now() }; Store.save(); $("#aiTr", pop).innerHTML = `<span class="ipa">/${esc(nw.ipa)}/</span> <span class="rupr">≈ ${esc(nw.rupr)}</span><br>${esc(nw.ru)} <span class="pill">добавлено в личный словарь</span>`; } catch (e) { $("#aiTr", pop).textContent = AI.errMsg(e); } };
    setTimeout(() => document.addEventListener("click", function h(ev) { if (!pop.contains(ev.target) && ev.target !== sp) { pop.remove(); document.removeEventListener("click", h); } }), 0);
  });
}
function qItems(qs) { return qs.map(q => q.t === "tf" ? { q: (q.q), o: ["True (верно)", "False (неверно)", "Not given (не сказано)"], a: { T: 0, F: 1, NG: 2 }[q.a], e: "" } : q.t === "gap" ? { q: q.q, a: q.a } : { q: q.q, o: q.o, a: q.a }); }
VIEWS.read = (v, id) => {
  const r = READING.find(x => x.id === id); if (!r) return VIEWS.reading(v);
  const unknown = new Set();
  v.innerHTML = `<a href="#reading">← Reading</a><div class="row" style="margin:10px 0">${lv(r.level)}<h1 style="margin:0">${esc(r.title)}</h1></div>
  <div class="grid" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:16px" id="rgrid"><div class="card"><div class="row between"><span class="muted" style="font-size:13px">Нажмите на слово для перевода</span><div class="row">${spk(r.text.replace(/\n/g, " "))}<button class="btn sm" id="hlB">🖍 Ключевые слова</button></div></div><div class="reading-text" id="rt">${clickableText(r.text)}</div></div><div id="rq"></div></div>`;
  if (innerWidth < 880) $("#rgrid").style.gridTemplateColumns = "1fr";
  bindLookup($("#rt"), unknown);
  $("#hlB").onclick = () => { const keys = (r.key || []).map(k => k.toLowerCase()); $$("#rt .tw").forEach(sp => { if (keys.some(k => k.split(" ")[0] === sp.textContent.toLowerCase().replace(/[’']s$/, ""))) sp.classList.toggle("hl"); }); };
  runQuiz($("#rq"), qItems(r.qs), { section: "Reading: " + r.title, skill: "Reading", meta: { key: "read-" + id, route: "read-" + id }, onDone: (sc, t, res) => { markDaily("reading");
    const un = [...unknown].map(x => VBYID[x]).filter(Boolean); const keyw = (r.key || []).map(k => lookup(k)).filter(Boolean);
    $("#rq").innerHTML = resultCard(sc, t) + `<div class="card stack" style="margin-top:12px"><h3>Разбор</h3>${res.map(x => `<div class="${x.ok ? "note" : "err"}" style="font-size:14px">${x.ok ? "✓" : "✗"} ${esc(x.q)}${x.ok ? "" : `<br>Ваш ответ: ${esc(x.user)} · Верно: <b>${esc(x.right)}</b>`}</div>`).join("")}</div>
    <div class="card stack" style="margin-top:12px"><h3>Незнакомые слова (${un.length + [...unknown].filter(x => !VBYID[x]).length})</h3>${un.length ? un.map(w => `<div class="row between"><span><b>${esc(w.word)}</b> — ${esc(w.ru)}</span><button class="btn sm" data-addw="${esc(w.id)}">+ В словарь</button></div>`).join("") : '<span class="muted">Вы не открывали перевод слов.</span>'}${keyw.length ? `<div class="muted" style="font-size:13px">Ключевые слова текста: ${keyw.map(w => esc(w.word)).join(", ")}</div>` : ""}<button class="btn" id="addAll" ${un.length ? "" : "disabled"}>Добавить все в личный словарь</button></div>`;
    $$("[data-addw]").forEach(b => b.onclick = () => { S().personal[b.dataset.addw] = { added: Date.now() }; Store.save(); b.textContent = "✓"; b.disabled = true; });
    $("#addAll").onclick = () => { un.forEach(w => S().personal[w.id] = { added: Date.now() }); Store.save(); toast("Слова добавлены"); }; } });
};

// ===================== LISTENING =====================
VIEWS.listening = v => {
  v.innerHTML = `<h1>Listening</h1><p class="sub">Диалоги, монологи, интервью и лекции. Регулируйте скорость, выбирайте британский или американский акцент, слушайте повторно. Транскрипт открывается после выполнения заданий.</p>
  <div class="grid g3">${LISTENING.map(r => `<a class="card link stack" href="#listen-${r.id}" style="text-decoration:none;color:inherit"><div class="row between">${lv(r.level)}${bestScore("listen-" + r.id)}</div><h3>${esc(r.title)}</h3><div class="muted" style="font-size:13px">${esc(r.kind)} · ${r.qs.length} вопроса</div></a>`).join("")}
  <a class="card link stack" href="#det-listen-type" style="text-decoration:none;color:inherit"><span class="pill">DET</span><h3>Listen and Type</h3><div class="muted" style="font-size:13px">Диктант предложений</div></a><a class="card link stack" href="#study-audio" style="text-decoration:none;color:inherit"><span class="pill">Слова</span><h3>Аудирование слов</h3><div class="muted" style="font-size:13px">Услышать и написать</div></a></div>`;
};
function playerUI(id) { return `<div class="card stack"><div class="row"><button class="btn pri" id="${id}Play">▶ Слушать</button><button class="btn" id="${id}Stop">⏹</button><span class="pill" id="${id}Cnt">прослушано: 0</span></div><div class="row"><label class="f" style="margin:0">Скорость</label>${[0.75, 0.9, 1, 1.15].map(r => `<button class="chip ${r === 1 ? "on" : ""}" data-rate="${r}">${r}×</button>`).join("")}<label class="f" style="margin:0 0 0 10px">Акцент</label><button class="chip on" data-acc="">Авто</button><button class="chip" data-acc="en-GB">🇬🇧 UK</button><button class="chip" data-acc="en-US">🇺🇸 US</button></div><p class="muted" style="font-size:12px;margin:0">Аудио синтезируется (Text-to-Speech). Выбор акцента зависит от голосов, установленных в вашем браузере.</p></div>`; }
function bindPlayer(root, id, getLines) { let rate = 1, acc = "", n = 0; $$("[data-rate]", root).forEach(c => c.onclick = () => { rate = +c.dataset.rate; $$("[data-rate]", root).forEach(x => x.classList.toggle("on", x === c)); }); $$("[data-acc]", root).forEach(c => c.onclick = () => { acc = c.dataset.acc; $$("[data-acc]", root).forEach(x => x.classList.toggle("on", x === c)); });
  $("#" + id + "Play").onclick = async () => { n++; $("#" + id + "Cnt").textContent = "прослушано: " + n; Audio.cancelled = false; await Audio.speakLines(getLines(), { rate, accent: acc || undefined }); }; $("#" + id + "Stop").onclick = () => { Audio.cancelled = true; Audio.stop(); }; }
VIEWS.listen = (v, id) => {
  const r = LISTENING.find(x => x.id === id); if (!r) return VIEWS.listening(v);
  v.innerHTML = `<a href="#listening">← Listening</a><div class="row" style="margin:10px 0">${lv(r.level)}<h1 style="margin:0">${esc(r.title)}</h1><span class="pill">${esc(r.kind)}</span></div>${playerUI("lp")}<div id="lq" style="margin-top:14px"></div><div class="card hide" id="trs" style="margin-top:14px"><h3>Транскрипт</h3><div class="reading-text" id="trt"></div></div>`;
  bindPlayer(v, "lp", () => r.lines);
  runQuiz($("#lq"), qItems(r.qs), { section: "Listening: " + r.title, skill: "Listening", meta: { key: "listen-" + id, route: "listen-" + id }, onDone: (sc, t) => { markDaily("listening"); $("#lq").innerHTML = resultCard(sc, t); $("#trs").classList.remove("hide"); $("#trt").innerHTML = r.lines.map(([sp, tx]) => `<p><b>${sp === "W" ? "Woman" : "Man"}:</b> ${clickableText(tx).replace(/^<p>|<\/p>$/g, "")}</p>`).join(""); bindLookup($("#trt")); } });
};

// ===================== WRITING =====================
VIEWS.writing = (v, id) => {
  const L = S().profile.level;
  if (!id) { v.innerHTML = `<h1>Writing</h1><p class="sub">Задания от простых предложений до академических эссе. После отправки — разбор грамматики, орфографии, пунктуации, лексики, структуры и связности с объяснениями на русском.</p>
    <div class="${AI.ok ? "note" : "warn"}" style="margin-bottom:14px">${AI.ok ? "✨ Подключена AI-проверка: подробный разбор каждой ошибки." : "AI-проверка недоступна в этом просмотре — работает базовая проверка (типичные ошибки, орфография частых слов, пунктуация, статистика текста). Она не находит все ошибки."}</div>
    <div class="grid g3">${WRITING.map(w => `<a class="card link stack" href="#writing-${w.id}" style="text-decoration:none;color:inherit"><div class="row between">${lv(w.level)}<span class="pill">${esc(w.type)}</span></div><div>${esc(w.prompt)}</div><div class="muted" style="font-size:12px">от ${w.min} слов</div></a>`).join("")}
    <a class="card link stack" href="#det-write-photo" style="text-decoration:none;color:inherit"><span class="pill">DET</span><b>Описание фотографии</b></a></div>`; return; }
  const w = WRITING.find(x => x.id === id); if (!w) return (location.hash = "writing");
  writingTask(v, { back: "writing", level: w.level, title: w.type, prompt: w.prompt, ru: w.ru, min: w.min, ref: w.ref, skill: "Writing", section: "Writing: " + w.type });
};
function writingTask(v, o) {
  v.innerHTML = `<a href="#${o.back}">← Назад</a><div class="row" style="margin:10px 0">${lv(o.level)}<h1 style="margin:0">${esc(o.title)}</h1>${o.time ? `<span class="timer" id="wt"></span>` : ""}</div>
  ${o.photo ? `<div style="margin-bottom:12px">${o.photo}</div>` : ""}<div class="card stack"><b style="font-size:16px">${esc(o.prompt)}</b>${o.ru ? `<div class="muted">${esc(o.ru)}</div>` : ""}
  <textarea id="wta" placeholder="Пишите здесь по-английски…" spellcheck="false"></textarea><div class="row between"><span class="muted" id="wc">0 слов${o.min ? " / цель " + o.min : ""}</span><button class="btn pri" id="wsend">Отправить на проверку</button></div></div><div id="wres" style="margin-top:14px"></div>`;
  const ta = $("#wta"); const dk = "draft_" + o.section; try { ta.value = sessionStorage.getItem(dk) || ""; } catch {}
  const cnt = () => { const n = (ta.value.match(/[A-Za-z']+/g) || []).length; $("#wc").textContent = n + " слов" + (o.min ? " / цель " + o.min : ""); try { sessionStorage.setItem(dk, ta.value); } catch {} }; ta.oninput = cnt; cnt();
  let timer; if (o.time) timer = countdown($("#wt"), o.time, () => { toast("Время вышло"); $("#wsend").click(); });
  $("#wsend").onclick = async () => { timer?.stop(); const text = ta.value.trim(); if (!text) return toast("Напишите ответ"); ta.disabled = true; $("#wsend").disabled = true; await showWritingFeedback($("#wres"), o, text); try { sessionStorage.removeItem(dk); } catch {} if (o.onDone) o.onDone(text); };
}
function diffHtml(a, b) { const A = a.split(/(\s+)/), B = b.split(/(\s+)/); const n = A.length, m = B.length; const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0)); for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]); let i = 0, j = 0, out = ""; while (i < n && j < m) { if (A[i] === B[j]) { out += esc(A[i]); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { out += `<del>${esc(A[i])}</del>`; i++; } else { out += `<ins>${esc(B[j])}</ins>`; j++; } } while (i < n) out += `<del>${esc(A[i++])}</del>`; while (j < m) out += `<ins>${esc(B[j++])}</ins>`; return out; }
async function showWritingFeedback(box, o, text) {
  const base = basicCheck(text); const st = base.stats;
  const statHtml = `<div class="grid g4"><div class="card"><div class="stat-l">Слов</div><div class="stat">${st.words}</div></div><div class="card"><div class="stat-l">Предложений</div><div class="stat">${st.sentences}</div></div><div class="card"><div class="stat-l">Разнообразие лексики</div><div class="stat">${st.ttr}%</div></div><div class="card"><div class="stat-l">Связующие слова</div><div class="stat">${st.linkers.length}</div></div></div>`;
  box.innerHTML = `<div class="card"><p class="muted">⏳ Проверяем текст…</p></div>`;
  let r = null, aiErr = null;
  if (AI.ok) { try { r = await AI.checkWriting(o.prompt, text, o.level); } catch (e) { aiErr = e; } }
  if (r && r.corrected) {
    const sc = r.scores || {}; const vals = Object.values(sc).filter(x => typeof x === "number"); const tot = vals.reduce((a, b) => a + b, 0), max = vals.length * 10;
    record(o.section, o.skill || "Writing", tot, max || 1, { route: CUR });
    (r.errors || []).forEach(e => logMistake(o.section, `«${e.original}» в вашем тексте`, e.original, e.fix, e.explanation_ru));
    const RU = { grammar: "Грамматика", spelling: "Орфография", punctuation: "Пунктуация", vocabulary: "Словарь", structure: "Структура", coherence: "Логика и связность", task: "Выполнение задания" };
    box.innerHTML = `<div class="stack">${statHtml}<div class="card stack"><div class="row between"><h2>Результат проверки</h2><span class="pill">≈ ${esc(r.estimated_cefr || "—")} (оценка AI)</span></div>
    <div class="grid g4">${Object.entries(sc).map(([k, x]) => `<div><div class="stat-l">${RU[k] || k}</div><div class="bar"><i style="width:${x * 10}%"></i></div><b>${x}/10</b></div>`).join("")}</div></div>
    <div class="card"><h3>Ваш ответ и исправления</h3><div class="diff reading-text" style="font-size:15.5px">${diffHtml(text, r.corrected)}</div></div>
    <div class="card stack"><h3>Найденные ошибки (${(r.errors || []).length})</h3>${(r.errors || []).length ? r.errors.map(e => `<div class="err" style="font-size:14px"><span class="pill">${esc(e.type)}</span> <del style="color:var(--bad)">${esc(e.original)}</del> → <b style="color:var(--good)">${esc(e.fix)}</b><br>${esc(e.explanation_ru)}</div>`).join("") : '<div class="note">Ошибок не найдено — отлично!</div>'}</div>
    <div class="card"><h3>Исправленный вариант</h3><p>${esc(r.corrected)}</p></div>
    <div class="card"><h3>Более естественный вариант</h3><div class="row">${spk(r.natural || "")}</div><p>${esc(r.natural || "")}</p></div>
    <div class="grid g2"><div class="card"><h3>Рекомендации</h3><ul>${(r.tips_ru || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div><div class="card"><h3>Полезные выражения</h3><ul>${(r.useful_phrases || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div>
    <p class="muted" style="font-size:12.5px">Оценка выполнена AI и является ориентиром, а не официальным баллом.</p></div>`;
    return r;
  }
  const score = Math.max(0, 10 - base.errors.length) + Math.min(5, Math.floor(st.words / Math.max(1, (o.min || 20)) * 5)) + Math.min(3, st.linkers.length) + (st.ttr > 60 ? 2 : st.ttr > 45 ? 1 : 0);
  record(o.section, o.skill || "Writing", score, 20, { route: CUR });
  base.errors.forEach(e => logMistake(o.section, `«${e.original}» в вашем тексте`, e.original, e.fix, e.explanation_ru));
  box.innerHTML = `<div class="stack">${aiErr ? `<div class="warn">${esc(AI.errMsg(aiErr))}</div>` : `<div class="warn">Показана базовая проверка: она распознаёт частые ошибки русскоязычных учеников, но не заменяет проверку преподавателем или AI.</div>`}${statHtml}
  <div class="card"><h3>Ваш ответ и исправления</h3><div class="diff reading-text" style="font-size:15.5px">${diffHtml(text, base.corrected)}</div></div>
  <div class="card stack"><h3>Найденные ошибки (${base.errors.length})</h3>${base.errors.length ? base.errors.map(e => `<div class="err" style="font-size:14px"><span class="pill">${esc(e.type)}</span> <del style="color:var(--bad)">${esc(e.original)}</del> → <b style="color:var(--good)">${esc(e.fix)}</b><br>${esc(e.explanation_ru)}</div>`).join("") : '<div class="note">Базовая проверка не нашла типичных ошибок.</div>'}</div>
  ${o.ref ? `<div class="card"><h3>Эталонный вариант</h3><p>${esc(o.ref)}</p></div>` : ""}
  <div class="card"><h3>Рекомендации</h3><ul>${[o.min && st.words < o.min ? `Текст короче цели (${st.words} из ${o.min} слов) — раскройте мысль подробнее, добавьте пример.` : "", st.linkers.length < 2 && st.sentences > 2 ? "Добавьте связующие слова: however, for example, as a result, in addition." : "", st.ttr < 50 && st.words > 30 ? "Лексика повторяется — используйте синонимы." : "", st.avgLen < 7 && st.sentences > 2 ? "Предложения очень короткие — объединяйте их союзами (because, although, which)." : "", st.avgLen > 28 ? "Предложения слишком длинные — разделите некоторые на два." : "", "Перечитайте текст: проверьте окончания -s у глаголов с he/she/it и артикли."].filter(Boolean).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div>`;
}

// ===================== SPEAKING =====================
VIEWS.speaking = v => {
  const L = S().profile.level; const qs = SPEAKING;
  v.innerHTML = `<h1>Speaking</h1><p class="sub">Прослушайте вопрос, ответьте голосом — система распознает речь и проанализирует ответ. Можно также ввести ответ текстом.</p>
  <div class="warn" style="margin-bottom:14px;font-size:14px"><b>Честно о возможностях:</b> ${Mic.available() ? "распознавание речи превращает ваш ответ в текст." : "распознавание речи в этом браузере недоступно — используйте ввод текстом."} Грамматика, словарь и полнота анализируются по тексту${AI.ok ? " с помощью AI" : " базовой проверкой"}. Точно оценить отдельные звуки, ударение и интонацию по тексту невозможно — для этого сравнивайте свою речь с эталоном в тренажёре произношения.</div>
  <div class="row" style="margin-bottom:12px"><a class="btn" href="#study-pron">🎙 Тренажёр произношения слов</a><a class="btn" href="#chat">🤖 Разговорный тренажёр</a><a class="btn" href="#det-speak-photo">📷 Описать фото (DET)</a></div>
  <div class="tabs" id="spt">${LEVELS.map(l => `<button class="tab ${l === L ? "on" : ""}" data-l="${l}">${l}</button>`).join("")}</div><div id="spl" class="grid g2"></div>`;
  const draw = l => { $("#spl").innerHTML = qs.map((q, i) => [q, i]).filter(([q]) => q.level === l).map(([q, i]) => `<div class="card link stack" data-act="spq" data-i="${i}"><div class="row between">${lv(q.level)}<span class="pill">${esc(q.type)}</span></div><b>${esc(q.q)}</b></div>`).join("") || `<p class="muted">Для этого уровня используйте задания DET и разговорный тренажёр.</p>`; };
  $$("#spt .tab").forEach(t => t.onclick = () => { $$("#spt .tab").forEach(x => x.classList.toggle("on", x === t)); draw(t.dataset.l); }); draw(L);
};
ACT.spq = el => { const q = SPEAKING[+el.dataset.i]; speakTask($("#view"), { back: "speaking", level: q.level, title: q.type, prompt: q.q, tips: q.tips, section: "Speaking: " + q.type }); };
function speakTask(v, o) {
  v.innerHTML = `<a href="#${o.back}">← Назад</a><div class="row" style="margin:10px 0">${lv(o.level)}<h1 style="margin:0">${esc(o.title)}</h1><span class="timer hide" id="st"></span></div>
  ${o.photo ? `<div style="margin-bottom:12px">${o.photo}</div>` : ""}<div class="card stack"><div class="row"><b style="font-size:17px">${esc(o.prompt)}</b>${o.noAudio ? "" : spk(o.prompt)}</div>${o.bullets ? `<ul>${o.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
  ${o.tips ? `<div class="muted" style="font-size:13.5px">Полезные фразы: ${o.tips.map(esc).join(" · ")}</div>` : ""}
  <div class="row">${Mic.available() ? `<button class="btn acc mic" id="smic">🎙 Говорить</button>` : ""}<span class="muted" id="sstate"></span></div>
  <label class="f">Транскрипт ответа ${Mic.available() ? "(заполняется автоматически, можно исправить)" : "(введите ответ текстом)"}</label><textarea id="sta" style="min-height:110px" placeholder="Ваш ответ…"></textarea>
  <div class="row between"><span class="muted" id="swc"></span><button class="btn pri" id="ssend">Получить разбор</button></div></div><div id="sres" style="margin-top:14px"></div>`;
  const ta = $("#sta"); let t0 = 0, dur = 0, timer;
  ta.oninput = () => $("#swc").textContent = (ta.value.match(/[A-Za-z']+/g) || []).length + " слов";
  if (o.prep) { $("#st").classList.remove("hide"); $("#sstate").textContent = "Подготовка…"; timer = countdown($("#st"), o.prep, () => { $("#sstate").textContent = "Время отвечать!"; if (o.time) timer = countdown($("#st"), o.time, () => { if (Mic.active) $("#smic").click(); $("#ssend").click(); }); }); }
  const mb = $("#smic"); if (mb) mb.onclick = async () => { if (Mic.active) { ta.value = await Mic.stop() || ta.value; dur = (Date.now() - t0) / 1000; ta.oninput(); } else { t0 = Date.now(); Mic.start(t => { ta.value = t; ta.oninput(); }); } };
  $("#ssend").onclick = async () => { timer?.stop(); if (Mic.active) { ta.value = await Mic.stop() || ta.value; dur = (Date.now() - t0) / 1000; } const t = ta.value.trim(); if (!t) return toast("Сначала ответьте на вопрос"); $("#ssend").disabled = true; await speakFeedback($("#sres"), o, t, dur); markDaily("out"); o.onDone && o.onDone(t); };
}
async function speakFeedback(box, o, text, dur) {
  const words = (text.match(/[A-Za-z']+/g) || []); const fillers = (text.match(/\b(uh|um|erm|er|like|you know)\b/gi) || []).length; const wpm = dur > 3 ? Math.round(words.length / dur * 60) : null;
  const flu = `<div class="grid g4"><div class="card"><div class="stat-l">Слов</div><div class="stat">${words.length}</div></div><div class="card"><div class="stat-l">Темп</div><div class="stat">${wpm ? wpm + " сл/мин" : "—"}</div></div><div class="card"><div class="stat-l">Слова-паразиты</div><div class="stat">${fillers}</div></div><div class="card"><div class="stat-l">Полнота</div><div class="stat">${words.length >= 60 ? "✓" : words.length >= 30 ? "≈" : "мало"}</div></div></div><p class="muted" style="font-size:12.5px">${wpm ? `Естественный темп в разговоре — примерно 110–160 слов в минуту. ` : ""}Произношение отдельных звуков, ударение и интонацию по тексту оценить невозможно; разборчивость косвенно видна по тому, насколько верно распознан ваш ответ.</p>`;
  box.innerHTML = `<div class="card"><p class="muted">⏳ Анализируем ответ…</p></div>`;
  let r = null, err = null; if (AI.ok) { try { r = await AI.checkSpeaking(o.prompt, text, o.level); } catch (e) { err = e; } }
  if (r) {
    const sc = r.scores || {}; const vals = Object.values(sc).filter(x => typeof x === "number"); record(o.section, "Speaking", vals.reduce((a, b) => a + b, 0), vals.length * 10 || 1);
    (r.errors || []).forEach(e => logMistake(o.section, `«${e.original}» в устном ответе`, e.original, e.fix, e.explanation_ru));
    const RU = { grammar: "Грамматика", vocabulary: "Словарь", completeness: "Полнота", coherence: "Связность" };
    box.innerHTML = `<div class="stack">${flu}<div class="card stack"><div class="row between"><h2>Разбор ответа</h2><span class="pill">≈ ${esc(r.estimated_cefr || "—")} (оценка AI)</span></div><div class="grid g4">${Object.entries(sc).map(([k, x]) => `<div><div class="stat-l">${RU[k] || k}</div><div class="bar"><i style="width:${x * 10}%"></i></div><b>${x}/10</b></div>`).join("")}</div><div class="muted">${esc(r.fluency_note_ru || "")}</div></div>
    <div class="card stack"><h3>Ошибки</h3>${(r.errors || []).length ? r.errors.map(e => `<div class="err" style="font-size:14px"><del>${esc(e.original)}</del> → <b>${esc(e.fix)}</b><br>${esc(e.explanation_ru)}</div>`).join("") : '<div class="note">Грамматических ошибок не найдено.</div>'}</div>
    <div class="card"><h3>Улучшенный ответ</h3><div class="row">${spk(r.improved || "")}<button class="btn sm" data-act="say" data-t="${esc(r.improved || "")}" data-rate="0.8">🐢</button></div><p>${esc(r.improved || "")}</p></div>
    <div class="grid g2"><div class="card"><h3>Советы</h3><ul>${(r.tips_ru || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul></div><div class="card"><h3>Чтобы звучать естественнее</h3><ul>${(r.useful_phrases || []).map(t => `<li>${esc(t)} ${spk(t)}</li>`).join("")}</ul></div></div></div>`;
    return;
  }
  const base = basicCheck(text); record(o.section, "Speaking", Math.min(10, words.length / 8) + Math.max(0, 10 - base.errors.length * 2), 20);
  box.innerHTML = `<div class="stack">${err ? `<div class="warn">${esc(AI.errMsg(err))}</div>` : `<div class="warn">AI-анализ недоступен — показан базовый разбор по тексту.</div>`}${flu}<div class="card stack"><h3>Найденные ошибки</h3>${base.errors.filter(e => e.type !== "punctuation").map(e => `<div class="err" style="font-size:14px"><del>${esc(e.original)}</del> → <b>${esc(e.fix)}</b><br>${esc(e.explanation_ru)}</div>`).join("") || '<div class="note">Типичных ошибок не найдено.</div>'}</div>${o.tips ? `<div class="card"><h3>Полезные выражения</h3><ul>${o.tips.map(t => `<li>${esc(t)} ${spk(t)}</li>`).join("")}</ul></div>` : ""}</div>`;
}

// ===================== РАЗГОВОРНЫЙ ТРЕНАЖЁР =====================
const CHAT = { msgs: [], topic: "Everyday life", level: null };
VIEWS.chat = v => {
  CHAT.level = CHAT.level || S().profile.level;
  v.innerHTML = `<h1>English Conversation Simulator</h1><p class="sub">Виртуальный собеседник подстраивает сложность под ваш уровень, мягко исправляет ошибки и предлагает новые слова — но не переводит за вас.</p>
  ${AI.ok ? "" : `<div class="warn" style="margin-bottom:12px">Собеседнику нужен AI, а он недоступен в этом просмотре. Откройте страницу на claude.ai, будучи авторизованным.</div>`}
  <div class="card stack"><div class="row"><label class="f" style="margin:0">Тема</label><select id="ctop" style="width:auto">${["Everyday life", "Travel", "Work and career", "University life", "Hobbies", "Technology", "Environment", "Food and cooking", "Job interview (role-play)", "At the hotel (role-play)", "DET speaking practice"].map(t => `<option ${t === CHAT.topic ? "selected" : ""}>${t}</option>`).join("")}</select><label class="f" style="margin:0">Уровень</label><select id="clev" style="width:auto">${LEVELS.map(l => `<option ${l === CHAT.level ? "selected" : ""}>${l}</option>`).join("")}</select><button class="btn sm" id="cnew">Новый разговор</button></div>
  <div class="chat" id="chatBox"></div><div class="row"><textarea id="cin" style="min-height:52px;flex:1" placeholder="Напишите по-английски…"></textarea><div class="stack" style="margin:0">${Mic.available() ? `<button class="btn mic" id="cmic">🎙 Говорить</button>` : ""}<button class="btn pri" id="csend" ${AI.ok ? "" : "disabled"}>Отправить</button></div></div><label class="row muted" style="font-size:13px"><input type="checkbox" id="cvoice" ${S().settings.chatVoice ? "checked" : ""}> Озвучивать ответы собеседника</label></div>`;
  const box = $("#chatBox");
  const draw = () => { box.innerHTML = CHAT.msgs.map(m => m.role === "user" ? `<div class="msg me">${esc(m.content)}</div>` : `<div class="msg bot">${esc(m.reply || m.content)} ${spk(m.reply || m.content)}${m.correction ? `<div class="corr">✏️ ${esc(m.correction)}</div>` : ""}${m.words?.length ? `<div class="corr" style="background:var(--teal-soft)">📌 ${m.words.map(esc).join(" · ")}</div>` : ""}</div>`).join("") || `<p class="muted">Начните разговор: например, «Hi! How are you?»</p>`; box.scrollTop = box.scrollHeight; };
  draw();
  $("#ctop").onchange = e => { CHAT.topic = e.target.value; }; $("#clev").onchange = e => { CHAT.level = e.target.value; };
  $("#cnew").onclick = () => { CHAT.msgs = []; draw(); };
  $("#cvoice").onchange = e => { S().settings.chatVoice = e.target.checked; Store.save(); };
  const cm = $("#cmic"); if (cm) cm.onclick = async () => { if (Mic.active) { $("#cin").value = await Mic.stop() || $("#cin").value; } else Mic.start(t => $("#cin").value = t); };
  const send = async () => { const t = $("#cin").value.trim(); if (!t || !AI.ok) return; if (Mic.active) await Mic.stop(); $("#cin").value = ""; CHAT.msgs.push({ role: "user", content: t }); draw(); $("#csend").disabled = true; box.insertAdjacentHTML("beforeend", `<div class="msg bot muted" id="typing">…</div>`); box.scrollTop = box.scrollHeight;
    const sys = `You are a friendly English conversation partner for a Russian-speaking learner at CEFR ${CHAT.level}. Topic: ${CHAT.topic}. Speak ONLY English, using vocabulary and grammar suitable for ${CHAT.level} (slightly above to stretch them). Keep replies to 1-3 sentences and always end with a question that invites the learner to say more. Never translate their message; if they write in Russian, encourage them to try in English and offer a starting phrase. Return ONLY JSON: {"reply":"your reply","correction":"if the learner's LAST message had errors: the corrected sentence + a very short explanation in Russian; otherwise empty string","words":["0-2 useful new words or phrases from your reply with Russian translation, e.g. 'commute — ездить на работу'"]}`;
    const hist = CHAT.msgs.slice(-12).map(m => ({ role: m.role, content: m.role === "user" ? m.content : (m.reply || m.content) }));
    try { const r = await AI.s.json([{ role: "user", content: sys + "\n\nConversation so far follows. Respond to the last learner message." }, { role: "assistant", content: "Understood." }, ...hist], { modelTier: "quick", cache: false }); CHAT.msgs.push({ role: "assistant", reply: r.reply, correction: r.correction, words: r.words || [] }); if (r.correction) logMistake("Собеседник", t, t, r.correction, ""); markActive(); Store.save(); if (S().settings.chatVoice) Audio.speak(r.reply); }
    catch (e) { CHAT.msgs.push({ role: "assistant", content: "⚠️ " + AI.errMsg(e) }); }
    $("#typing")?.remove(); $("#csend").disabled = false; draw(); };
  $("#csend").onclick = send; $("#cin").onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
};
