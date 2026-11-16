// ===================== ЗАПУСК =====================
const App = {
  start() {
    loadVocab(); Audio.init();
    const resumed = Store.resume();
    if (resumed) (Store.state.custom.words || []).forEach(w => addWord(w)), Object.assign(CUSTOM_LESSONS, Store.state.custom.lessons || {});
    applyTheme();
    $("#menuBtn").onclick = e => { e.stopPropagation(); $("#side").classList.toggle("open"); };
    document.addEventListener("click", e => { const sd = $("#side"); if (sd.classList.contains("open") && !sd.contains(e.target)) sd.classList.remove("open"); });
    window.addEventListener("hashchange", route);
    window.addEventListener("beforeunload", () => { tick(); Store.flush(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) { tick(); Store.flush(); } });
    setInterval(tick, 60000);
    route();
    // Возможности платформы подключаются асинхронно; без них приложение работает локально.
    if (window.claude?.use) { Cloud.init(); Audio.initCap(); Mic.initCap(); AI.initCap(); } else { App.cloudReady(); }
  },
  cloudReady() { this.updateCloudBox(); if (Cloud.db && Cloud.uid && LS.get("ep_last", "") === "cloud_" + Cloud.uid && Store.mode !== "cloud") Cloud.connect().then(() => { (S().custom.words || []).forEach(w => addWord(w)); Object.assign(CUSTOM_LESSONS, S().custom.lessons || {}); applyTheme(); route(); }); },
  updateCloudBox() {
    const box = $("#cloudTxt"); if (!box) return;
    if (Cloud.db && Cloud.uid) { box.innerHTML = `Вы вошли в claude.ai — прогресс будет сохраняться в облаке и доступен на любом устройстве.`; if (!$("#cloudBtn")) box.insertAdjacentHTML("afterend", `<button class="btn acc" id="cloudBtn">Продолжить с аккаунтом Claude</button>`); $("#cloudBtn").onclick = async () => { $("#cloudBtn").disabled = true; const ok = await Cloud.connect(); if (ok) { (S().custom.words || []).forEach(w => addWord(w)); Object.assign(CUSTOM_LESSONS, S().custom.lessons || {}); App.afterLogin(!S().history.length); } else { toast("Не удалось подключиться к облаку"); $("#cloudBtn").disabled = false; } }; }
    else box.textContent = window.claude?.use ? "Облачное хранилище недоступно в этом просмотре (нужен вход в claude.ai). Используйте локальный профиль." : "Облачное хранилище недоступно. Используйте локальный профиль ниже.";
  },
  afterLogin(isNew) { markActive(); Store.save(true); applyTheme(); location.hash = isNew ? "diagnostic" : "home"; route(); },
  refreshAI() { if (CUR === "writing" || CUR === "chat" || CUR === "speaking" || CUR.startsWith("lesson-")) route(); }
};
App.start();
