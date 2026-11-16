// ===================== ОБЩИЙ ДВИЖОК УПРАЖНЕНИЙ =====================
// items: {q, o?:[], a: index | [accepted strings], e?: объяснение}
function runQuiz(box, items, opt = {}) {
  let i = 0, score = 0; const res = [];
  const draw = () => {
    if (i >= items.length) { record(opt.section || "Упражнение", opt.skill, score, items.length, opt.meta); opt.onDone ? opt.onDone(score, items.length, res) : (box.innerHTML = resultCard(score, items.length, opt)); return; }
    const it = items[i];
    box.innerHTML = `<div class="card stack"><div class="row between"><span class="pill">${i + 1} / ${items.length}</span>${opt.timer ? '<span class="timer" id="qt"></span>' : ""}</div>
      <h3 style="font-family:var(--font);font-size:17px">${esc(it.q)}</h3>${it.audio ? spk(it.audio) : ""}
      ${it.o ? it.o.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("") : `<div class="row"><input type="text" id="gapIn" placeholder="Ваш ответ" autocomplete="off" style="flex:1;min-width:200px"><button class="btn pri" id="gapOk">Проверить</button></div>`}
      <div id="fb"></div></div>`;
    const finish = (ok, userAns, rightAns) => {
      if (ok) score++; else logMistake(opt.section || "Упражнение", it.q, userAns, rightAns, it.e);
      res.push({ q: it.q, ok, user: userAns, right: rightAns });
      $("#fb", box).innerHTML = `<div class="${ok ? "note" : "err"}" style="margin-top:10px"><span class="${ok ? "fb-ok" : "fb-no"}">${ok ? "✓ Верно!" : "✗ Неверно."}</span> ${ok ? "" : "Правильный ответ: <b>" + esc(rightAns) + "</b>."} ${it.e ? "<br>" + esc(it.e) : ""}</div><button class="btn pri" id="nextQ" style="margin-top:10px">Дальше →</button>`;
      $("#nextQ", box).onclick = () => { i++; draw(); }; $("#nextQ", box).focus();
    };
    if (it.o) $$(".opt", box).forEach(b => b.onclick = () => { if ($("#nextQ", box)) return; const k = +b.dataset.k; const ok = k === it.a; b.classList.add(ok ? "ok" : "no"); $$(".opt", box)[it.a].classList.add("ok"); finish(ok, it.o[k], it.o[it.a]); });
    else { const inp = $("#gapIn", box); inp.focus(); const go = () => { if ($("#nextQ", box)) return; const v = norm(inp.value); const ok = it.a.some(x => norm(x) === v); inp.disabled = true; finish(ok, inp.value || "(пусто)", it.a[0]); }; $("#gapOk", box).onclick = go; inp.onkeydown = e => { if (e.key === "Enter") go(); }; }
  };
  draw();
}
function resultCard(score, total, opt = {}) {
  const p = Math.round(100 * score / Math.max(1, total));
  return `<div class="card stack" style="text-align:center"><div class="stat">${score} / ${total}</div><div class="muted">${p}% правильных ответов</div><div class="bar"><i style="width:${p}%"></i></div>
  <p>${p >= 85 ? "Отлично! Материал усвоен." : p >= 60 ? "Хороший результат. Повторите ошибки в журнале." : "Стоит повторить тему и пройти упражнения ещё раз."}</p>
  <div class="row" style="justify-content:center"><button class="btn" data-act="go" data-to="mistakes">Журнал ошибок</button>${opt.again ? `<button class="btn pri" id="againBtn">Ещё раз</button>` : ""}</div></div>`;
}

// ===================== ВХОД =====================
VIEWS.login = v => {
  const ps = Object.entries(Store.profiles());
  v.innerHTML = `<div style="max-width:520px;margin:4vh auto" class="stack">
  <div class="brand" style="font-size:24px;padding:0"><span class="logo">St</span><div>Stepwise English<small>английский с нуля до C2 и подготовка к Duolingo English Test</small></div></div>
  <div class="card stack" id="cloudBox"><h3>☁️ Вход через аккаунт Claude</h3><p class="muted" id="cloudTxt">Проверяем доступность облачного хранилища…</p></div>
  <div class="card stack"><div class="tabs"><button class="tab on" data-m="reg">Регистрация</button><button class="tab" data-m="log">Вход</button></div>
  <div><label class="f">Имя</label><input type="text" id="lgName" placeholder="Например, Arman"></div>
  <div><label class="f">Пароль (необязательно)</label><input type="password" id="lgPass" placeholder="Защищает профиль на этом устройстве"></div>
  <div id="lgErr" class="fb-no"></div><button class="btn pri" id="lgBtn">Создать профиль</button>
  <p class="muted" style="font-size:13px">Локальный профиль хранится в этом браузере. Для синхронизации между устройствами войдите через аккаунт Claude.</p>
  ${ps.length ? `<div><label class="f">Профили на этом устройстве</label><div class="chips">${ps.map(([k, p]) => `<button class="chip" data-n="${esc(p.name)}">${esc(p.name)}${p.hash ? " 🔒" : ""}</button>`).join("")}</div></div>` : ""}</div></div>`;
  let mode = "reg";
  $$(".tab", v).forEach(t => t.onclick = () => { mode = t.dataset.m; $$(".tab", v).forEach(x => x.classList.toggle("on", x === t)); $("#lgBtn").textContent = mode === "reg" ? "Создать профиль" : "Войти"; });
  $$(".chip", v).forEach(c => c.onclick = () => { $("#lgName").value = c.dataset.n; $$(".tab", v)[1].click(); $("#lgPass").focus(); });
  $("#lgBtn").onclick = async () => { try { const n = $("#lgName").value, p = $("#lgPass").value; mode === "reg" ? await Store.register(n, p) : await Store.login(n, p); App.afterLogin(mode === "reg"); } catch (e) { $("#lgErr").textContent = e; } };
  App.updateCloudBox();
};

// ===================== ГЛАВНАЯ =====================
function dailyPlan() {
  const s = S(); const d = today(); if (s.daily.date !== d) { s.daily = { date: d, done: {} }; Store.save(); }
  const L = s.profile.level; const lessons = GRAMMAR_TOPICS[L].map(t => t.split("|")[1]); const nextG = lessons.find(id => !s.grammar[id] && (GRAMMAR_LESSONS[id] || CUSTOM_LESSONS[id])) || lessons.find(id => !s.grammar[id]) || lessons[0];
  const rd = READING.find(r => r.level === L) || READING[0]; const ls = LISTENING.find(r => r.level === L) || LISTENING[0];
  return [["words", `📚 ${s.settings.dailyNew} новых слов (${L})`, "study-new"], ["review", `🔁 Повторение: ${SRS.due().length} слов к повтору`, "study-review"], ["grammar", "🧩 Грамматика: " + (GRAMMAR_TOPICS[L].find(t => t.endsWith("|" + nextG)) || "").split("|")[0], "lesson-" + nextG], ["reading", "📖 Reading: " + rd.title, "read-" + rd.id], ["listening", "🎧 Listening: " + ls.title, "listen-" + ls.id], ["out", new Date().getDate() % 2 ? "✍️ Writing: короткий текст" : "🗣 Speaking: ответ на вопрос", new Date().getDate() % 2 ? "writing" : "speaking"]];
}
function markDaily(k) { const s = S(); if (s.daily.date === today()) { s.daily.done[k] = true; Store.save(); } }
function recommendations() {
  const out = []; const sk = ["Reading", "Listening", "Writing", "Speaking", "Vocabulary", "Grammar"].map(k => [k, skillAvg(k)]).filter(x => x[1] !== null);
  const RU = { Reading: "чтению", Listening: "аудированию", Writing: "письму", Speaking: "разговорной речи", Vocabulary: "словарю", Grammar: "грамматике" };
  const go = { Reading: "det-interactive-reading", Listening: "det-listen-type", Writing: "writing", Speaking: "speaking", Vocabulary: "study-review", Grammar: "grammar" };
  if (sk.length >= 2) { sk.sort((a, b) => b[1] - a[1]); const best = sk[0], worst = sk[sk.length - 1]; if (best[1] - worst[1] >= 10) out.push([`У тебя хорошие результаты по ${RU[best[0]]} (${best[1]}%), но есть трудности по ${RU[worst[0]]} (${worst[1]}%). Рекомендуем уделить больше времени именно этому навыку.`, go[worst[0]]]); }
  const mist = S().mistakes.filter(m => !m.fixed); if (mist.length >= 5) out.push([`В журнале ${mist.length} неисправленных ошибок — повтори их, чтобы они не закрепились.`, "mistakes"]);
  const weak = SRS.weak(); if (weak.length >= 5) out.push([`${weak.length} слов даются тебе тяжело — в режиме «Повторение ошибок» они появятся чаще.`, "study-errors"]);
  if (!S().history.some(h => h.section === "Диагностика")) out.push(["Пройди диагностический тест, чтобы определить свой стартовый уровень.", "diagnostic"]);
  if (!out.length) out.push(["Продолжай ежедневные занятия: регулярность важнее длительности.", "daily"]);
  return out;
}
VIEWS.home = v => {
  const s = S(); const plan = dailyPlan(); const done = plan.filter(p => s.daily.done[p[0]]).length;
  const learned = SRS.learned(); const due = SRS.due().length; const L = s.profile.level;
  const levelWords = VOCAB.filter(w => w.level === L); const lvLearned = levelWords.filter(w => SRS.status(w.id) !== "new").length;
  const last = s.history[s.history.length - 1];
  v.innerHTML = `<div class="hero stack"><div class="row between"><div><h1>${new Date().getHours() < 12 ? "Доброе утро" : new Date().getHours() < 18 ? "Добрый день" : "Добрый вечер"}, ${esc(s.profile.name || "друг")}!</h1><p class="sub">Твой уровень: <b>${L} — ${LEVEL_INFO[L].ru}</b> · Цель: Duolingo English Test</p></div><div class="stat">🔥 ${s.streak.count}</div></div>
  <div class="row"><button class="btn acc" data-act="go" data-to="${last && last.meta?.route ? last.meta.route : plan.find(p => !s.daily.done[p[0]])?.[2] || "study-new"}">▶ Продолжить обучение</button><button class="btn" data-act="go" data-to="mock" style="background:transparent;color:inherit;border-color:rgba(255,255,255,.3)">⏱ Пробный экзамен</button></div></div>
  <div class="grid g4" style="margin-top:14px">
  <div class="card"><div class="stat-l">Изучено слов</div><div class="stat">${learned}</div></div>
  <div class="card"><div class="stat-l">К повторению</div><div class="stat">${due}</div></div>
  <div class="card"><div class="stat-l">Уровень ${L}</div><div class="stat">${Math.round(100 * lvLearned / Math.max(1, levelWords.length))}%</div><div class="bar"><i style="width:${100 * lvLearned / Math.max(1, levelWords.length)}%"></i></div></div>
  <div class="card"><div class="stat-l">Сегодня</div><div class="stat">${s.activity[today()] || 0} мин</div></div></div>
  <div class="grid g2" style="margin-top:14px"><div class="card stack"><div class="row between"><h2>План на сегодня</h2><span class="pill">${done} / ${plan.length}</span></div>
  ${plan.map(p => `<a href="#${p[2]}" class="opt" style="text-decoration:none;color:inherit;${s.daily.done[p[0]] ? "opacity:.55" : ""}">${s.daily.done[p[0]] ? "✅" : "⬜"} ${esc(p[1])}</a>`).join("")}
  <p class="muted" style="font-size:13px">Количество заданий меняется в <a href="#settings">настройках</a>.</p></div>
  <div class="stack"><div class="card stack"><h2>Рекомендации</h2>${recommendations().map(r => `<div class="note">${esc(r[0])} <a href="#${r[1]}">Перейти →</a></div>`).join("")}</div>
  <div class="card"><h2>Быстрый доступ</h2><div class="grid g3" style="grid-template-columns:repeat(3,1fr)">${[["vocab", "📚", "Слова"], ["grammar", "🧩", "Грамматика"], ["det", "🦉", "DET"], ["reading", "📖", "Чтение"], ["listening", "🎧", "Аудио"], ["chat", "🤖", "Диалог"]].map(q => `<a href="#${q[0]}" class="card link" style="text-align:center;text-decoration:none;color:inherit;padding:12px"><div style="font-size:22px">${q[1]}</div><b style="font-size:13px">${q[2]}</b></a>`).join("")}</div></div></div></div>`;
};

// ===================== УРОВНИ =====================
VIEWS.mylevel = v => {
  const s = S();
  v.innerHTML = `<h1>Мой уровень</h1><p class="sub">Программа построена по шкале CEFR: каждый уровень опирается на предыдущий.</p>
  <div class="card row between" style="margin-bottom:14px"><div><b>Текущий уровень: ${lv(s.profile.level)} ${LEVEL_INFO[s.profile.level].ru}</b><div class="muted">Не уверены? Пройдите диагностику (~5 минут, ${DIAG.length} вопросов).</div></div><button class="btn pri" data-act="go" data-to="diagnostic">Диагностический тест</button></div>
  <div class="grid g3">${LEVELS.map(L => { const ws = VOCAB.filter(w => w.level === L); const lr = ws.filter(w => SRS.status(w.id) !== "new").length; const gt = GRAMMAR_TOPICS[L]; const gd = gt.filter(t => s.grammar[t.split("|")[1]]).length; const p = Math.round(100 * (lr / Math.max(1, ws.length) * 0.5 + gd / gt.length * 0.5)); return `<a href="#level-${L.toLowerCase()}" class="card link stack" style="text-decoration:none;color:inherit"><div class="row between">${lv(L)}${s.levelExams[L] ? `<span class="pill">экзамен ${s.levelExams[L]}%</span>` : ""}</div><h3>${LEVEL_INFO[L].name}<br><span class="muted" style="font-family:var(--font);font-weight:600">${LEVEL_INFO[L].ru}</span></h3><div class="muted" style="font-size:13px">${ws.length} слов · ${gt.length} тем грамматики</div><div class="bar"><i style="width:${p}%"></i></div><div class="muted" style="font-size:12px">Пройдено ${p}%</div></a>`; }).join("")}</div>`;
};
VIEWS.level = (v, arg) => {
  const L = arg.toUpperCase(); if (!LEVELS.includes(L)) return VIEWS.mylevel(v);
  const I = LEVEL_INFO[L]; const s = S(); const ws = VOCAB.filter(w => w.level === L); const topics = [...new Set(ws.map(w => w.topic))];
  const gt = GRAMMAR_TOPICS[L]; const gd = gt.filter(t => s.grammar[t.split("|")[1]]).length; const lr = ws.filter(w => SRS.status(w.id) !== "new").length;
  const idx = LEVELS.indexOf(L);
  v.innerHTML = `<div class="row"><a href="#mylevel">← Все уровни</a></div><div class="row" style="margin:10px 0">${lv(L)}<h1 style="margin:0">${I.name} — ${I.ru}</h1></div><p class="sub">${I.desc}</p>
  <div class="grid g2"><div class="card stack"><h3>После уровня вы сможете</h3><ul>${I.can.map(c => `<li>${c}</li>`).join("")}</ul><p class="muted" style="font-size:13px">Ориентир DET: ${I.det}. Это приблизительное неофициальное соответствие.</p></div>
  <div class="card stack"><h3>Прогресс уровня</h3><div>Слова: ${lr} / ${ws.length}</div><div class="bar"><i style="width:${100 * lr / Math.max(1, ws.length)}%"></i></div><div>Грамматика: ${gd} / ${gt.length}</div><div class="bar"><i style="width:${100 * gd / gt.length}%"></i></div>
  <div>Итоговый экзамен: ${s.levelExams[L] ? `<b>${s.levelExams[L]}%</b>` : "не сдан"}</div>
  <div class="row"><button class="btn pri" id="exBtn">Итоговый экзамен ${L}</button>${s.profile.level !== L ? `<button class="btn" id="setLv">Сделать текущим</button>` : ""}</div></div></div>
  <h2 style="margin-top:22px">Грамматика уровня</h2><div class="grid g3">${gt.map(t => { const [n, id] = t.split("|"); return `<a class="card link" href="#lesson-${id}" style="text-decoration:none;color:inherit;padding:12px 14px"><div class="row between"><b style="font-size:14px">${esc(n)}</b>${s.grammar[id] ? `<span class="pill">✓ ${s.grammar[id]}%</span>` : ""}</div><div class="muted" style="font-size:12px">${GRAMMAR_LESSONS[id] || CUSTOM_LESSONS[id] ? "Полный урок" : "Урок генерируется AI"}</div></a>`; }).join("")}</div>
  <h2 style="margin-top:22px">Словарь уровня: тематические уроки</h2><div class="grid g3">${topics.map(t => { const tw = ws.filter(w => w.topic === t); const k = tw.filter(w => SRS.status(w.id) !== "new").length; return `<a class="card link" href="#topic-${L.toLowerCase()}-${t}" style="text-decoration:none;color:inherit;padding:12px 14px"><b style="font-size:14px">${esc(TOPIC_NAMES[t] || t)}</b><div class="muted" style="font-size:12px">${k} / ${tw.length} слов</div><div class="bar" style="margin-top:6px"><i style="width:${100 * k / tw.length}%"></i></div></a>`; }).join("")}</div>
  <h2 style="margin-top:22px">Практика</h2><div class="grid g3">${READING.filter(r => r.level === L).map(r => `<a class="card link" href="#read-${r.id}" style="text-decoration:none;color:inherit">📖 <b>${esc(r.title)}</b><div class="muted" style="font-size:12px">Reading</div></a>`).join("")}${LISTENING.filter(r => r.level === L).map(r => `<a class="card link" href="#listen-${r.id}" style="text-decoration:none;color:inherit">🎧 <b>${esc(r.title)}</b><div class="muted" style="font-size:12px">Listening</div></a>`).join("")}<a class="card link" href="#study-level-${L}" style="text-decoration:none;color:inherit">🃏 <b>Тест по словам ${L}</b><div class="muted" style="font-size:12px">Английский → русский</div></a></div>
  <div class="note" style="margin-top:18px"><b>Рекомендация:</b> ${idx < 5 ? `когда пройдёте ≥70% слов и тем и сдадите итоговый экзамен на 75%+, переходите к уровню <a href="#level-${LEVELS[idx + 1].toLowerCase()}">${LEVELS[idx + 1]}</a>.` : "на уровне C2 сосредоточьтесь на чтении оригинальной литературы, академическом письме и пробных экзаменах DET."}</div>`;
  $("#setLv") && ($("#setLv").onclick = () => { s.profile.level = L; Store.save(); toast("Текущий уровень: " + L); route(); });
  $("#exBtn").onclick = () => levelExam(v, L);
};
function lessonItems(id) { const l = GRAMMAR_LESSONS[id] || CUSTOM_LESSONS[id] || S().gen[id]; return l ? [...(l.ex || []), ...(l.quiz || [])] : []; }
function vocabMC(words, n) { return pick(words, n).map(w => { const d = pick(VOCAB.filter(x => x.id !== w.id && x.pos === w.pos), 3).map(x => x.ru); const o = shuffle([w.ru, ...d]); return { q: `«${w.word}» — это…`, o, a: o.indexOf(w.ru), e: `${w.word} /${w.ipa}/ — ${w.ru}` }; }); }
function levelExam(v, L) {
  const ws = VOCAB.filter(w => w.level === L); let g = []; GRAMMAR_TOPICS[L].forEach(t => g.push(...lessonItems(t.split("|")[1]).filter(x => x.o)));
  const items = shuffle([...vocabMC(ws, 10), ...pick(g, 10), ...pick(DIAG.filter(d => d[0] === L), 4).map(d => ({ q: d[1], o: d[2], a: d[3] }))]);
  v.innerHTML = `<a href="#level-${L.toLowerCase()}">← Уровень ${L}</a><h1 style="margin-top:10px">Итоговый экзамен ${L}</h1><p class="sub">${items.length} вопросов: словарь и грамматика уровня. Проходной балл — 75%.</p><div id="qz"></div>`;
  runQuiz($("#qz"), items, { section: "Экзамен " + L, skill: "Grammar", onDone: (sc, tot) => { const p = Math.round(100 * sc / tot); S().levelExams[L] = Math.max(S().levelExams[L] || 0, p); Store.save(); $("#qz").innerHTML = resultCard(sc, tot) + `<div class="${p >= 75 ? "note" : "warn"}" style="margin-top:12px">${p >= 75 ? `🎉 Экзамен ${L} сдан! ${L !== "C2" ? `<a href="#level-${LEVELS[LEVELS.indexOf(L) + 1].toLowerCase()}">Перейти к следующему уровню →</a>` : ""}` : "Экзамен не сдан. Повторите темы с ошибками и попробуйте снова."}</div>`; } });
}
VIEWS.diagnostic = v => {
  v.innerHTML = `<a href="#mylevel">← Мой уровень</a><h1 style="margin-top:10px">Диагностический тест</h1><p class="sub">${DIAG.length} вопросов от A1 до C2. Отвечайте честно — если не знаете, выбирайте «Не знаю».</p><div id="qz"></div>`;
  const items = DIAG.map(d => ({ q: d[1], o: [...d[2], "Не знаю"], a: d[3], L: d[0] }));
  let i = 0; const per = {}; LEVELS.forEach(l => per[l] = [0, 0]);
  const draw = () => {
    if (i >= items.length) {
      let rec = "A1"; for (const l of LEVELS) { const [c, t] = per[l]; if (t && c / t >= 0.67) rec = l; else break; }
      const idx = LEVELS.indexOf(rec); const start = per[rec][0] / Math.max(1, per[rec][1]) >= 0.67 && rec !== "A1" && idx < 5 && per[LEVELS[idx + 1]][0] > 0 ? LEVELS[idx + 1] : rec;
      record("Диагностика", null, items.filter((x, k) => x.ok).length, items.length);
      $("#qz").innerHTML = `<div class="card stack"><h2>Ваш приблизительный уровень: ${lv(rec)} ${LEVEL_INFO[rec].ru}</h2><table class="t"><tr><th>Уровень</th><th>Верно</th></tr>${LEVELS.map(l => `<tr><td>${lv(l)}</td><td>${per[l][0]} / ${per[l][1]}</td></tr>`).join("")}</table><p>Рекомендуем начать с уровня <b>${start}</b>: так вы закрепите основу и не пропустите пробелы.</p><p class="muted" style="font-size:13px">Это быстрая оценка по ${DIAG.length} вопросам, а не официальный сертификат.</p><button class="btn pri" id="setL">Начать с ${start}</button></div>`;
      $("#setL").onclick = () => { S().profile.level = start; Store.save(); location.hash = "level-" + start.toLowerCase(); };
      return;
    }
    const it = items[i];
    $("#qz").innerHTML = `<div class="card stack"><div class="row between"><span class="pill">${i + 1} / ${items.length}</span></div><h3 style="font-family:var(--font)">${esc(it.q)}</h3>${it.o.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>`;
    $$(".opt").forEach(b => b.onclick = () => { const ok = +b.dataset.k === it.a; per[it.L][1]++; if (ok) per[it.L][0]++; it.ok = ok; i++; draw(); });
  };
  draw();
};

// ===================== VOCABULARY =====================
VIEWS.vocab = v => {
  const s = S(); const L0 = s.profile.level;
  v.innerHTML = `<h1>Vocabulary</h1><p class="sub">${VOCAB.length} слов и выражений с IPA, русской подсказкой, примерами и аудио. База пополняется через <a href="#admin">админ-панель</a> (импорт CSV/JSON).</p>
  <div class="grid g4" style="margin-bottom:14px">${[["study-new", "🃏", "Новые слова", "карточки " + L0], ["study-review", "🔁", "Повторение", SRS.due().length + " к повтору"], ["study-errors", "🩹", "Повторение ошибок", SRS.weak().length + " трудных"], ["personal", "⭐", "Личный словарь", Object.keys(s.personal).length + " слов"]].map(c => `<a href="#${c[0]}" class="card link" style="text-decoration:none;color:inherit"><div style="font-size:22px">${c[1]}</div><b>${c[2]}</b><div class="muted" style="font-size:12px">${c[3]}</div></a>`).join("")}</div>
  <div class="card stack"><h3>Режимы тренировки</h3><div class="chips">${MODES.map(m => `<a class="chip" href="#study-${m[0]}" style="text-decoration:none;color:inherit">${m[1]} ${m[2]}</a>`).join("")}</div>
  <div class="row"><label class="f" style="margin:0">Слова для тренировки:</label><select id="srcSel" style="width:auto">${LEVELS.map(l => `<option value="${l}" ${l === (s.settings.studySrc || L0) ? "selected" : ""}>Уровень ${l}</option>`).join("")}<option value="fav" ${s.settings.studySrc === "fav" ? "selected" : ""}>Избранное</option><option value="personal" ${s.settings.studySrc === "personal" ? "selected" : ""}>Личный словарь</option>${Object.keys(s.lists).map(n => `<option value="list:${esc(n)}" ${s.settings.studySrc === "list:" + n ? "selected" : ""}>Список: ${esc(n)}</option>`).join("")}</select></div></div>
  <h2 style="margin-top:20px">Категории</h2><div class="tabs" id="lvTabs">${LEVELS.map(l => `<button class="tab ${l === L0 ? "on" : ""}" data-l="${l}">${l} · ${VOCAB.filter(w => w.level === l).length}</button>`).join("")}</div><div id="cats" class="grid g3"></div>
  <h2 style="margin-top:20px">Поиск по словарю</h2><input type="search" id="vs" placeholder="Слово по-английски или по-русски…"><div id="vres" class="grid g2" style="margin-top:10px"></div>`;
  const drawCats = L => { const ws = VOCAB.filter(w => w.level === L); const ts = [...new Set(ws.map(w => w.topic))]; $("#cats").innerHTML = ts.map(t => { const tw = ws.filter(w => w.topic === t); const k = tw.filter(w => SRS.status(w.id) !== "new").length; return `<a class="card link" href="#topic-${L.toLowerCase()}-${t}" style="text-decoration:none;color:inherit;padding:12px 14px"><b style="font-size:14px">${esc(TOPIC_NAMES[t] || t)}</b><div class="muted" style="font-size:12px">${tw.length} слов · изучено ${k}</div></a>`; }).join(""); };
  $$("#lvTabs .tab").forEach(t => t.onclick = () => { $$("#lvTabs .tab").forEach(x => x.classList.toggle("on", x === t)); drawCats(t.dataset.l); }); drawCats(L0);
  $("#srcSel").onchange = e => { s.settings.studySrc = e.target.value; Store.save(); toast("Источник слов обновлён"); };
  $("#vs").oninput = e => { const q = norm(e.target.value); $("#vres").innerHTML = q.length < 2 ? "" : searchWords(q).slice(0, 30).map(wordRow).join("") || `<p class="muted">Ничего не найдено.</p>`; };
};
function searchWords(q) { q = norm(q); return VOCAB.filter(w => norm(w.word).includes(q) || norm(w.ru).includes(q)).sort((a, b) => (norm(b.word) === q) - (norm(a.word) === q) || (norm(a.word).startsWith(q) ? -1 : 1)); }
function wordRow(w) { const st = SRS.status(w.id); return `<div class="wcard" data-act="word" data-id="${esc(w.id)}"><div><b>${esc(w.word)}</b> <span class="ipa">/${esc(w.ipa)}/</span> <span class="rupr">[${esc(w.rupr)}]</span><div class="muted" style="font-size:13.5px">${esc(w.ru)} · ${POS[w.pos] || w.pos}</div></div><div class="row" style="gap:6px">${lv(w.level)}${spk(w.word)}</div><div class="muted" style="font-size:12px">${STATUS_RU[st]}${S().fav.includes(w.id) ? " · ⭐" : ""}</div></div>`; }
ACT.word = (el, e) => { if (e.target.closest("[data-act=say]")) return; wordCard(el.dataset.id); };
function wordCard(id) {
  const w = VBYID[id]; if (!w) return; const s = S(); const fav = s.fav.includes(id); const inP = !!s.personal[id]; const st = SRS.get(id);
  const tips = soundTips(w.ipa);
  modal(`<div class="stack"><div class="row">${lv(w.level)}<span class="pill">${POS[w.pos] || w.pos}</span><span class="pill">${esc(TOPIC_NAMES[w.topic] || w.topic)}</span></div>
  <div class="row" style="align-items:baseline"><h1 style="margin:0;font-size:32px">${esc(w.word)}</h1><span style="font-size:18px">— ${esc(w.ru)}</span></div>
  <div class="row"><span class="ipa" style="font-size:18px">/${esc(w.ipa)}/</span><span class="rupr" style="font-size:17px">≈ ${esc(w.rupr)}</span></div>
  <div class="row">${spk(w.word)}<button class="btn sm" data-act="say" data-t="${esc(w.word)}" data-rate="0.6">🐢 Медленно</button><button class="btn sm" data-act="say" data-t="${esc(w.word)}" data-acc="en-GB">🇬🇧 UK</button><button class="btn sm" data-act="say" data-t="${esc(w.word)}" data-acc="en-US">🇺🇸 US</button></div>
  <p class="muted" style="font-size:12.5px;margin:0">Русская запись — лишь приблизительная подсказка. Ориентируйтесь на IPA и аудио. IPA дана в британском варианте.</p>
  ${tips.length ? `<div class="warn" style="font-size:13.5px"><b>Сложные звуки:</b><br>${tips.map(esc).join("<br>")}</div>` : ""}
  <div class="ex"><div class="row">${esc(w.ex)} ${spk(w.ex)}</div><div class="ru">${esc(w.exru)}</div></div>
  ${w.forms ? `<div><b>Формы:</b> ${esc(w.forms)}</div>` : ""}${w.syn ? `<div><b>Синонимы:</b> ${esc(w.syn)}</div>` : ""}${w.ant ? `<div><b>Антонимы:</b> ${esc(w.ant)}</div>` : ""}${w.col ? `<div><b>Сочетания:</b> ${esc(w.col)}</div>` : ""}
  ${w.mis ? `<div class="err" style="font-size:14px"><b>Типичная ошибка:</b> ${esc(w.mis)}</div>` : ""}
  <div class="muted" style="font-size:13px">Статус: ${STATUS_RU[SRS.status(id)]}${st ? ` · повторений: ${st.seen} · следующее: ${new Date(st.due).toLocaleDateString("ru-RU")}` : ""}</div>
  <div class="row"><button class="btn ${fav ? "pri" : ""}" id="favB">${fav ? "★ В избранном" : "☆ В избранное"}</button><button class="btn ${inP ? "pri" : ""}" id="perB">${inP ? "✓ В личном словаре" : "+ В личный словарь"}</button><button class="btn" id="lstB">📋 В список</button></div></div>`);
  $("#favB").onclick = () => { const i = s.fav.indexOf(id); i >= 0 ? s.fav.splice(i, 1) : s.fav.push(id); Store.save(); wordCard(id); };
  $("#perB").onclick = () => { inP ? delete s.personal[id] : (s.personal[id] = { added: Date.now() }); Store.save(); wordCard(id); };
  $("#lstB").onclick = () => { const names = Object.keys(s.lists); modal(`<h2>Добавить в список</h2><div class="stack">${names.map(n => `<button class="opt" data-n="${esc(n)}">${esc(n)} (${s.lists[n].length})</button>`).join("")}<div class="row"><input type="text" id="newL" placeholder="Новый список" style="flex:1"><button class="btn pri" id="mkL">Создать</button></div></div>`); $$(".opt[data-n]").forEach(b => b.onclick = () => { const l = s.lists[b.dataset.n]; if (!l.includes(id)) l.push(id); Store.save(); toast("Добавлено"); wordCard(id); }); $("#mkL").onclick = () => { const n = $("#newL").value.trim(); if (!n) return; s.lists[n] = s.lists[n] || []; if (!s.lists[n].includes(id)) s.lists[n].push(id); Store.save(); toast("Список создан"); wordCard(id); }; };
}
VIEWS.topic = (v, arg) => {
  const [l, ...t] = arg.split("-"); const L = l.toUpperCase(); const T = t.join("-"); const ws = VOCAB.filter(w => w.level === L && w.topic === T);
  v.innerHTML = `<a href="#level-${l}">← Уровень ${L}</a><div class="row" style="margin:10px 0">${lv(L)}<h1 style="margin:0">${esc(TOPIC_NAMES[T] || T)}</h1></div><p class="sub">${ws.length} слов в теме</p>
  <div class="row" style="margin-bottom:14px"><button class="btn pri" id="tFlash">🃏 Учить карточками</button><button class="btn" id="tTest">✅ Тест по теме</button><button class="btn" id="tListen">🎧 Прослушать все</button></div><div class="grid g2">${ws.map(wordRow).join("")}</div>`;
  $("#tFlash").onclick = () => { STUDY_OVERRIDE = ws.map(w => w.id); location.hash = "study-cards"; };
  $("#tTest").onclick = () => { STUDY_OVERRIDE = ws.map(w => w.id); location.hash = "study-en2ru"; };
  $("#tListen").onclick = async () => { for (const w of ws) { await Audio.speak(w.word); await new Promise(r => setTimeout(r, 400)); if (CUR !== "topic-" + arg) break; } };
};
// ---------- Тренажёр слов: 8 режимов ----------
const MODES = [["cards", "🃏", "Карточки"], ["en2ru", "🇬🇧→🇷🇺", "Английский → Русский"], ["ru2en", "🇷🇺→🇬🇧", "Русский → Английский"], ["spell", "⌨️", "Написание"], ["audio", "🎧", "Аудирование"], ["sentence", "🧱", "Предложения"], ["pron", "🎙", "Произношение"], ["errors", "🩹", "Повторение ошибок"]];
let STUDY_OVERRIDE = null;
function studyPool(mode) {
  const s = S();
  if (STUDY_OVERRIDE) { const p = STUDY_OVERRIDE; STUDY_OVERRIDE = null; return p.map(id => VBYID[id]).filter(Boolean); }
  if (mode === "review") return SRS.due().map(id => VBYID[id]);
  if (mode === "errors") { const ids = new Set([...SRS.weak(), ...s.mistakes.filter(m => m.section === "Vocabulary" && !m.fixed).map(m => m.wid).filter(Boolean)]); return [...ids].map(id => VBYID[id]).filter(Boolean); }
  const src = s.settings.studySrc || s.profile.level;
  let ws = src === "fav" ? s.fav.map(id => VBYID[id]) : src === "personal" ? Object.keys(s.personal).map(id => VBYID[id]) : src.startsWith("list:") ? (s.lists[src.slice(5)] || []).map(id => VBYID[id]) : VOCAB.filter(w => w.level === src);
  ws = ws.filter(Boolean);
  if (mode === "new") return ws.filter(w => SRS.status(w.id) === "new").slice(0, s.settings.dailyNew);
  const due = ws.filter(w => SRS.get(w.id) && SRS.get(w.id).due <= Date.now()); const rest = shuffle(ws.filter(w => !due.includes(w)));
  return [...due, ...rest];
}
VIEWS.study = (v, arg) => {
  let mode = arg; if (arg.startsWith("level-")) { STUDY_OVERRIDE = VOCAB.filter(w => w.level === arg.slice(6)).map(w => w.id); mode = "en2ru"; }
  const pool = studyPool(mode);
  const M = { new: "Новые слова", review: "Повторение (интервальное)" }[mode] || (MODES.find(m => m[0] === mode) || [, , "Тренировка"])[2];
  v.innerHTML = `<a href="#vocab">← Vocabulary</a><h1 style="margin-top:10px">${esc(M)}</h1><div id="sb"></div>`;
  const box = $("#sb");
  if (!pool.length) { box.innerHTML = `<div class="card">${mode === "review" ? "🎉 Сейчас нечего повторять. Загляните позже или изучите новые слова." : mode === "errors" ? "Пока нет трудных слов — отлично!" : "В выбранном наборе нет слов."}<div class="row" style="margin-top:10px"><a class="btn pri" href="#study-new">Новые слова</a></div></div>`; return; }
  const n = Math.min(pool.length, mode === "new" ? S().settings.dailyNew : mode === "review" ? S().settings.dailyReview : 10);
  const words = mode === "new" || mode === "review" ? pool.slice(0, n) : pool.slice(0, n);
  const runner = { cards: flashcards, new: flashcards, review: flashcards, errors: flashcards, en2ru: mcMode, ru2en: mcMode, spell: typeMode, audio: typeMode, sentence: sentenceMode, pron: pronMode }[mode] || flashcards;
  runner(box, words, mode);
};
function studyDone(box, stats, mode) {
  if (mode === "new") markDaily("words"); if (mode === "review") markDaily("review");
  box.innerHTML = `<div class="card stack" style="text-align:center"><div style="font-size:40px">🎉</div><h2>Сессия завершена</h2><p>${stats}</p><div class="row" style="justify-content:center"><a class="btn" href="#vocab">К словарю</a><a class="btn pri" href="#study-review">Повторение</a></div></div>`;
}
function flashcards(box, words, mode) {
  let i = 0; const cnt = [0, 0, 0, 0];
  const draw = () => {
    if (i >= words.length) { record("Vocabulary", "Vocabulary", cnt[2] + cnt[3] + cnt[1] * 0.5, words.length, { route: "study-review" }); return studyDone(box, `Не знаю: ${cnt[0]} · Сложно: ${cnt[1]} · Хорошо: ${cnt[2]} · Легко: ${cnt[3]}`, mode); }
    const w = words[i];
    box.innerHTML = `<div class="card stack"><div class="row between"><span class="pill">${i + 1} / ${words.length}</span>${lv(w.level)}</div><div class="flash"><div class="w">${esc(w.word)}</div><div class="row"><span class="ipa">/${esc(w.ipa)}/</span><span class="rupr">≈ ${esc(w.rupr)}</span>${spk(w.word)}</div><div id="ans" class="hide stack"><div style="font-size:20px;font-weight:700">${esc(w.ru)}</div><div class="ex" style="text-align:left">${esc(w.ex)}<div class="ru">${esc(w.exru)}</div></div></div><button class="btn pri" id="show">Показать ответ</button></div><div id="grades" class="hide grid g4" style="grid-template-columns:repeat(4,1fr)">${["Не знаю", "Сложно", "Хорошо знаю", "Очень легко"].map((g, k) => `<button class="btn" data-g="${k}" style="justify-content:center">${g}</button>`).join("")}</div></div>`;
    if (S().settings.autoplay !== false) Audio.speak(w.word);
    $("#show", box).onclick = () => { $("#ans", box).classList.remove("hide"); $("#grades", box).classList.remove("hide"); $("#show", box).remove(); };
    $$("[data-g]", box).forEach(b => b.onclick = () => { const g = +b.dataset.g; cnt[g]++; SRS.grade(w.id, g); if (g === 0) { logMistake("Vocabulary", `${w.word} — перевод?`, "не вспомнил", w.ru, w.ex).wid = w.id; if (words.length < 40) words.push(w); } i++; draw(); });
  };
  draw();
}
function mcMode(box, words, mode) {
  const items = words.map(w => { const ru2en = mode === "ru2en"; const near = VOCAB.filter(x => x.id !== w.id && x.pos === w.pos && x.ru !== w.ru && Math.abs(LEVELS.indexOf(x.level) - LEVELS.indexOf(w.level)) <= 1); const d = pick(near.length >= 3 ? near : VOCAB.filter(x => x.id !== w.id && x.pos === w.pos && x.ru !== w.ru), 3); const o = shuffle([w, ...d]); return { w, q: ru2en ? `Как по-английски: «${w.ru}»?` : `Что значит «${w.word}»?`, o: o.map(x => ru2en ? x.word : x.ru), a: o.indexOf(w), audio: ru2en ? null : w.word, e: `${w.word} /${w.ipa}/ ≈ ${w.rupr} — ${w.ru}` }; });
  wordQuiz(box, items, mode);
}
function wordQuiz(box, items, mode) {
  let i = 0, sc = 0;
  const draw = () => {
    if (i >= items.length) { record("Vocabulary", "Vocabulary", sc, items.length); return studyDone(box, `Правильно: ${sc} из ${items.length}`, mode); }
    const it = items[i];
    box.innerHTML = `<div class="card stack"><span class="pill">${i + 1} / ${items.length}</span><h2 style="font-family:var(--font)">${esc(it.q)} ${it.audio ? spk(it.audio) : ""}</h2>${it.o.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}<div id="fb"></div></div>`;
    $$(".opt", box).forEach(b => b.onclick = () => { if ($("#nx", box)) return; const k = +b.dataset.k; const ok = k === it.a; b.classList.add(ok ? "ok" : "no"); $$(".opt", box)[it.a].classList.add("ok"); SRS.grade(it.w.id, ok ? 2 : 0); if (ok) sc++; else { logMistake("Vocabulary", it.q, it.o[k], it.o[it.a], it.e).wid = it.w.id; }
      $("#fb", box).innerHTML = `<div class="${ok ? "note" : "err"}">${ok ? "✓ Верно!" : "✗ Неверно."} ${esc(it.e)}</div><button class="btn pri" id="nx" style="margin-top:8px">Дальше →</button>`; $("#nx", box).onclick = () => { i++; draw(); }; Audio.speak(it.w.word); });
  };
  draw();
}
function typeMode(box, words, mode) {
  let i = 0, sc = 0;
  const draw = () => {
    if (i >= words.length) { record("Vocabulary", mode === "audio" ? "Listening" : "Vocabulary", sc, words.length); return studyDone(box, `Правильно: ${sc} из ${words.length}`, mode); }
    const w = words[i];
    box.innerHTML = `<div class="card stack"><span class="pill">${i + 1} / ${words.length}</span>${mode === "audio" ? `<h2 style="font-family:var(--font)">Напишите услышанное слово</h2><div class="row">${spk(w.word)}<button class="btn sm" data-act="say" data-t="${esc(w.word)}" data-rate="0.6">🐢 Медленно</button></div>` : `<h2 style="font-family:var(--font)">Напишите по-английски: «${esc(w.ru)}»</h2><div class="muted">${POS[w.pos] || ""} · подсказка: ${w.word.length} букв, начинается на «${esc(w.word[0])}»</div>`}
    <div class="row"><input type="text" id="ti" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;min-width:200px"><button class="btn pri" id="tc">Проверить</button></div><div id="fb"></div></div>`;
    if (mode === "audio") setTimeout(() => Audio.speak(w.word), 300);
    const inp = $("#ti", box); inp.focus();
    const check = () => { if ($("#nx", box)) return; const val = norm(inp.value); const ok = val === norm(w.word); const close = !ok && lev(val, norm(w.word)) <= 1; SRS.grade(w.id, ok ? 2 : close ? 1 : 0); if (ok) sc++; else { logMistake("Vocabulary", mode === "audio" ? `Аудио: ${w.word}` : `Написание: ${w.ru}`, inp.value, w.word, close ? "Почти! Одна буква." : "").wid = w.id; }
      $("#fb", box).innerHTML = `<div class="${ok ? "note" : "err"}">${ok ? "✓ Верно!" : close ? "≈ Почти верно — опечатка." : "✗ Неверно."} <b>${esc(w.word)}</b> /${esc(w.ipa)}/ — ${esc(w.ru)}</div><button class="btn pri" id="nx" style="margin-top:8px">Дальше →</button>`; $("#nx", box).onclick = () => { i++; draw(); }; };
    $("#tc", box).onclick = check; inp.onkeydown = e => { if (e.key === "Enter") ($("#nx", box) ? $("#nx", box).click() : check()); };
  };
  draw();
}
function lev(a, b) { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
function blankWord(ex, word) { const parts = word.toLowerCase().split(" "); const re = new RegExp("\\b" + parts[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[a-z]*", "i"); return re.test(ex) && parts.length === 1 ? ex.replace(re, "_____") : null; }
function sentenceMode(box, words, mode) {
  const items = words.map(w => { const b = blankWord(w.ex, w.word); if (!b) return null; const same = VOCAB.filter(x => x.id !== w.id && x.pos === w.pos && !x.word.includes(" ") && Math.abs(LEVELS.indexOf(x.level) - LEVELS.indexOf(w.level)) <= 1); const d = pick(same.length >= 3 ? same : VOCAB.filter(x => x.id !== w.id && x.pos === w.pos && !x.word.includes(" ")), 3); const o = shuffle([w, ...d]); const m = w.ex.match(new RegExp("\\b" + w.word + "[a-z]*", "i")); return { w, q: b + "  (" + w.exru + ")", o: o.map(x => x === w ? (m ? m[0] : w.word) : x.word), a: o.indexOf(w), e: w.ex }; }).filter(Boolean);
  if (!items.length) { box.innerHTML = `<div class="card">Для этих слов нет подходящих примеров. Выберите другой набор.</div>`; return; }
  wordQuiz(box, items, mode);
}
function pronMode(box, words, mode) {
  let i = 0, sc = 0;
  const draw = () => {
    if (i >= words.length) { record("Произношение", "Speaking", sc, words.length); return studyDone(box, `Распознано верно: ${sc} из ${words.length}`, mode); }
    const w = words[i]; const tips = soundTips(w.ipa);
    box.innerHTML = `<div class="card stack"><span class="pill">${i + 1} / ${words.length}</span><div class="flash" style="min-height:160px"><div class="w">${esc(w.word)}</div><div class="row"><span class="ipa">/${esc(w.ipa)}/</span><span class="rupr">≈ ${esc(w.rupr)}</span></div><div class="row">${spk(w.word)}<button class="btn sm" data-act="say" data-t="${esc(w.word)}" data-rate="0.6">🐢 Медленно</button></div></div>
    ${tips.length ? `<div class="warn" style="font-size:13.5px">${tips.map(esc).join("<br>")}</div>` : ""}
    <div class="row">${Mic.available() ? `<button class="btn acc mic" id="micB">🎙 Говорить</button>` : `<span class="muted">Распознавание речи недоступно в этом браузере — прослушайте и повторите вслух, затем оцените себя.</span>`}<button class="btn" id="selfOk">Я произнёс(ла) правильно</button><button class="btn" id="skip">Пропустить</button></div><div id="fb"></div>
    <p class="muted" style="font-size:12.5px">Обратная связь основана на распознавании речи: она показывает, понятно ли слово, но не может точно оценить отдельные звуки, ударение и интонацию.</p></div>`;
    const next = ok => { if (ok) sc++; SRS.grade(w.id, ok ? 2 : 1); i++; draw(); };
    $("#selfOk", box).onclick = () => next(true); $("#skip", box).onclick = () => { i++; draw(); };
    const mb = $("#micB", box); if (mb) mb.onclick = async () => { if (Mic.active) { const t = await Mic.stop(); const ok = norm(t).split(" ").includes(norm(w.word)) || norm(t) === norm(w.word); $("#fb", box).innerHTML = `<div class="${ok ? "note" : "warn"}">Распознано: «${esc(t || "—")}». ${ok ? "✓ Слово распознано — произношение разборчивое." : "Система не распознала слово. Прослушайте эталон медленно, обратите внимание на ударный слог и попробуйте ещё раз."}</div><button class="btn pri" id="nx" style="margin-top:8px">Дальше →</button>`; $("#nx", box).onclick = () => next(ok); } else Mic.start(t => { const f = $("#fb", box); if (f) f.innerHTML = `<div class="muted">Слышу: ${esc(t)}</div>`; }); };
  };
  draw();
}

// ===================== СЛОВАРЬ, ЛИЧНЫЙ СЛОВАРЬ, ФРАЗЫ, СЛОВООБРАЗОВАНИЕ =====================
VIEWS.dictionary = v => {
  v.innerHTML = `<h1>Англо-русский словарь</h1><p class="sub">Поиск по ${VOCAB.length} словам и выражениям. Фильтр по уровню CEFR.</p><div class="row"><input type="search" id="dq" placeholder="Например: environment или «погода»" style="flex:1;min-width:220px"><select id="dl" style="width:auto"><option value="">Все уровни</option>${LEVELS.map(l => `<option>${l}</option>`).join("")}</select></div><div id="dr" class="grid g2" style="margin-top:12px"></div>`;
  const run = () => { const q = $("#dq").value, L = $("#dl").value; let r = q.trim().length ? searchWords(q) : VOCAB.slice(); if (L) r = r.filter(w => w.level === L); $("#dr").innerHTML = r.slice(0, 60).map(wordRow).join("") + (r.length > 60 ? `<p class="muted">Показаны первые 60 из ${r.length}. Уточните запрос.</p>` : "") || `<p class="muted">Ничего не найдено.</p>`; };
  $("#dq").oninput = run; $("#dl").onchange = run; run();
};
VIEWS.personal = v => {
  const s = S(); const ids = Object.keys(s.personal).filter(id => VBYID[id]);
  v.innerHTML = `<h1>Личный словарь</h1><p class="sub">Слова, которые вы добавили из карточек, текстов и словаря.</p>
  <div class="row" style="margin-bottom:12px"><button class="btn pri" id="pStudy" ${ids.length ? "" : "disabled"}>🃏 Учить эти слова</button><a class="btn" href="#dictionary">+ Найти слово</a></div>
  ${ids.length ? `<div class="card" style="overflow-x:auto"><table class="t"><tr><th>Слово</th><th>Перевод</th><th>Произношение</th><th>Добавлено</th><th>Повторений</th><th>Статус</th><th></th></tr>${ids.map(id => { const w = VBYID[id], st = SRS.get(id); return `<tr><td><a href="#" data-act="word" data-id="${esc(id)}"><b>${esc(w.word)}</b></a></td><td>${esc(w.ru)}</td><td><span class="ipa">/${esc(w.ipa)}/</span> ${spk(w.word)}</td><td>${new Date(s.personal[id].added).toLocaleDateString("ru-RU")}</td><td>${st ? st.seen : 0}</td><td>${STATUS_RU[SRS.status(id)]}</td><td><button class="btn sm ghost" data-del="${esc(id)}">✕</button></td></tr>`; }).join("")}</table></div>` : `<div class="card">Пока пусто. Откройте любую карточку слова и нажмите «+ В личный словарь».</div>`}
  ${s.fav.length ? `<h2 style="margin-top:18px">Избранное (${s.fav.length})</h2><div class="grid g2">${s.fav.filter(id => VBYID[id]).map(id => wordRow(VBYID[id])).join("")}</div>` : ""}
  ${Object.keys(s.lists).length ? `<h2 style="margin-top:18px">Мои списки</h2><div class="grid g3">${Object.entries(s.lists).map(([n, l]) => `<div class="card"><b>${esc(n)}</b><div class="muted">${l.length} слов</div><div class="row" style="margin-top:8px"><button class="btn sm pri" data-ls="${esc(n)}">Учить</button><button class="btn sm" data-ld="${esc(n)}">Удалить</button></div></div>`).join("")}</div>` : ""}
  <h2 style="margin-top:18px">История изучения</h2><div class="card" style="overflow-x:auto">${Object.entries(s.words).filter(([id]) => VBYID[id]).sort((a, b) => (b[1].last || 0) - (a[1].last || 0)).slice(0, 25).map(([id, w]) => `<div class="row between" style="border-bottom:1px solid var(--line);padding:6px 0"><span><b>${esc(VBYID[id].word)}</b> — ${esc(VBYID[id].ru)}</span><span class="muted" style="font-size:13px">${new Date(w.last).toLocaleString("ru-RU")} · ${STATUS_RU[SRS.status(id)]}</span></div>`).join("") || '<span class="muted">Пока нет истории.</span>'}</div>`;
  $$("[data-del]", v).forEach(b => b.onclick = () => { delete s.personal[b.dataset.del]; Store.save(); route(); });
  $$("[data-ls]", v).forEach(b => b.onclick = () => { STUDY_OVERRIDE = s.lists[b.dataset.ls]; location.hash = "study-cards"; });
  $$("[data-ld]", v).forEach(b => b.onclick = () => { delete s.lists[b.dataset.ld]; Store.save(); route(); });
  $("#pStudy").onclick = () => { STUDY_OVERRIDE = ids; location.hash = "study-cards"; };
};
VIEWS.phrases = v => {
  const cats = Object.keys(PHRASES);
  v.innerHTML = `<h1>Фразы и идиомы</h1><p class="sub">Повседневные выражения, фразовые глаголы, идиомы и полезные фразы для Writing и Speaking.</p><div class="tabs" id="pt">${cats.map((c, i) => `<button class="tab ${i ? "" : "on"}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div><div id="pl" class="grid g2"></div>`;
  const draw = c => { $("#pl").innerHTML = PHRASES[c].map(p => `<div class="card stack"><div class="row between"><b style="font-size:16px">${esc(p[0])}</b>${spk(p[0])}</div><div>${esc(p[1])} <span class="rupr" style="font-size:13px">≈ ${esc(p[2])}</span></div><div class="muted" style="font-size:13.5px">💡 ${esc(p[3])}</div><div class="ex">${esc(p[4])} ${spk(p[4])}</div></div>`).join(""); };
  $$("#pt .tab").forEach(t => t.onclick = () => { $$("#pt .tab").forEach(x => x.classList.toggle("on", x === t)); draw(t.dataset.c); }); draw(cats[0]);
};
VIEWS.wordformation = v => {
  v.innerHTML = `<h1>Словообразование</h1><p class="sub">Семейства слов и правила образования частей речи — важно для заданий Fill in the Blanks и Read and Complete.</p>
  <div class="grid g2">${WORD_FAMILIES.map(f => `<div class="card"><table class="t">${f.map(([w, p, r]) => `<tr><td><b>${esc(w)}</b> ${spk(w)}</td><td><span class="pill">${POS[p]}</span></td><td>${esc(r)}</td></tr>`).join("")}</table></div>`).join("")}</div>
  <h2 style="margin-top:20px">Суффиксы и приставки</h2><div class="card"><table class="t"><tr><th>Аффикс</th><th>Образует</th><th>Примеры</th></tr>${AFFIXES.map(a => `<tr><td><b>${esc(a[0])}</b></td><td>${esc(a[1])}</td><td>${esc(a[2])}</td></tr>`).join("")}</table></div>
  <h2 style="margin-top:20px">Упражнение</h2><div id="wq"></div>`;
  const items = shuffle(WORD_FAMILIES.flatMap(f => { const base = f[0]; return f.slice(1).filter(x => x[1] !== base[1]).map(x => ({ q: `Образуйте ${POS[x[1]]} от «${base[0]}» со значением «${x[2]}»`, a: [x[0]], e: `${base[0]} → ${x[0]}` })); })).slice(0, 8);
  runQuiz($("#wq"), items, { section: "Словообразование", skill: "Vocabulary" });
};
