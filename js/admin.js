// Admin panel logic
// Mot de passe local (si Supabase non configuré) :
const LOCAL_ADMIN_PASSWORD = "L0c4l@dmin";

let content = null;

// Indicateur mode
document.addEventListener("DOMContentLoaded", async () => {
  const modeEl = document.getElementById("login-mode");
  if (modeEl) {
    modeEl.textContent = isSupabaseConfigured()
      ? "Mode cloud (Supabase) — les changements sont visibles par tous"
      : "Mode local — configure Supabase (js/config.js) pour un partage global";
  }
  // Session Supabase existante ?
  const client = getSupabase();
  if (client) {
    const { data } = await client.auth.getSession();
    if (data?.session) {
      await loadContent(true);
      content = getContent();
      showAdmin();
      return;
    }
  } else if (sessionStorage.getItem(ADMIN_PASS_KEY) === "ok") {
    await loadContent(true);
    content = getContent();
    showAdmin();
  }
});

document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("admin-email")?.value?.trim() || "";
  const pass = document.getElementById("password").value;
  const errEl = document.getElementById("login-error");
  if (errEl) {
    errEl.classList.add("hidden");
    errEl.textContent = "";
  }

  const client = getSupabase();
  if (client) {
    if (!email) {
      if (errEl) {
        errEl.textContent = "Email requis (compte créé dans Supabase Auth)";
        errEl.classList.remove("hidden");
      }
      return;
    }
    const { error } = await client.auth.signInWithPassword({ email, password: pass });
    if (error) {
      if (errEl) {
        errEl.textContent = error.message || "Identifiants incorrects";
        errEl.classList.remove("hidden");
      }
      return;
    }
    await loadContent(true);
    content = getContent();
    showAdmin();
    return;
  }

  // Mode local
  if (pass === LOCAL_ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_PASS_KEY, "ok");
    await loadContent(true);
    content = getContent();
    showAdmin();
  } else {
    if (errEl) {
      errEl.textContent = "Mot de passe incorrect";
      errEl.classList.remove("hidden");
    } else {
      alert("Mot de passe incorrect");
    }
  }
});

document.getElementById("btn-logout")?.addEventListener("click", async () => {
  sessionStorage.removeItem(ADMIN_PASS_KEY);
  const client = getSupabase();
  if (client) await client.auth.signOut();
  location.reload();
});

function showAdmin() {
  if (!content) content = getContent();
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("admin-panel").classList.remove("hidden");
  applyTheme(content);
  document.getElementById("admin-site-name").textContent = content.site.name;
  populateForm();
  setupTabs();
  setupEditors();
  refreshInscriptionsAdmin();
  ["filter-mp-month", "filter-mp-search"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", () => { if (typeof renderMonthlyPayments === "function") renderMonthlyPayments(); });
    document.getElementById(id)?.addEventListener("input", () => { if (typeof renderMonthlyPayments === "function") renderMonthlyPayments(); });
  });
  document.getElementById("mp-player")?.addEventListener("change", (e) => {
    const opt = e.target.options[e.target.selectedIndex];
    if (opt && opt.value !== "") {
      const cat = document.getElementById("mp-category");
      if (cat && opt.dataset.cat) cat.value = opt.dataset.cat;
      const name = document.getElementById("mp-name");
      if (name && opt.dataset.name) name.value = opt.dataset.name;
    }
  });
  // Filtres inscriptions
  ["filter-category", "filter-gender", "filter-age", "filter-payment", "filter-status", "filter-search"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el || el.dataset.bound) return;
    el.dataset.bound = "1";
    el.addEventListener(id === "filter-search" ? "input" : "change", () => renderInscriptionsAdmin());
  });
  const ref = document.getElementById("btn-refresh-ins");
  if (ref && !ref.dataset.bound) {
    ref.dataset.bound = "1";
    ref.addEventListener("click", () => refreshInscriptionsAdmin());
  }
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("active", "bg-primary", "text-white");
        b.classList.add("bg-white/5");
      });
      btn.classList.add("active", "bg-primary", "text-white");
      btn.classList.remove("bg-white/5");
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.add("hidden"));
      document.getElementById("tab-" + btn.dataset.tab)?.classList.remove("hidden");
    });
  });
}

function populateForm() {
  document.getElementById("site-name-input").value = content.site.name || "";
  document.getElementById("site-logo-input").value = content.site.logo || "";
  document.getElementById("primary-color").value = content.site.primaryColor || "#16a34a";
  document.getElementById("accent-color").value = content.site.accentColor || "#22c55e";
  document.getElementById("footer-text-input").value = content.footer?.text || "";
  const pi = content.paymentInfo || {};
  const pr = document.getElementById("pay-receiver");
  if (pr) pr.value = pi.receiverName || "";
  const pm = document.getElementById("pay-mvola");
  if (pm) pm.value = pi.mvola || "";
  const po = document.getElementById("pay-orange");
  if (po) po.value = pi.orangeMoney || "";
  const pe = document.getElementById("pay-especes");
  if (pe) pe.value = pi.especesNote || "";
  const pin = document.getElementById("pay-instructions");
  if (pin) pin.value = pi.instructions || "";
  document.getElementById("cta-title-input").value = content.cta?.title || "";
  document.getElementById("cta-text-input").value = content.cta?.text || "";

  document.getElementById("hero-subtitle").value = content.hero?.subtitle || "";
  document.getElementById("hero-title").value = content.hero?.title || "";
  document.getElementById("hero-desc").value = content.hero?.description || "";
  document.getElementById("hero-image").value = content.hero?.image || "";
  document.getElementById("about-title").value = content.about?.title || "";
  document.getElementById("about-text").value = content.about?.text || "";
  document.getElementById("about-image").value = content.about?.image || "";

  document.getElementById("team-title").value = content.team?.title || "";
  document.getElementById("team-desc").value = content.team?.description || "";

  document.getElementById("contact-email").value = content.contact?.email || "";
  document.getElementById("contact-phone").value = content.contact?.phone || "";
  document.getElementById("contact-address").value = content.contact?.address || "";
  document.getElementById("contact-hours").value = content.contact?.hours || "";

  renderStatsEditor();
  renderPlayersEditor();
  renderNewsEditor();
  renderGalleryEditor();
  if (typeof renderRosterFolders === 'function') renderRosterFolders();
  if (typeof fillMpPlayerSelect === 'function') fillMpPlayerSelect();
  if (typeof renderMonthlyPayments === 'function') renderMonthlyPayments();
}

function setupEditors() {
  document.getElementById("logo-file")?.addEventListener("change", (e) => {
    fileToWebpOrBase64(e.target.files[0], (url) => {
      document.getElementById("site-logo-input").value = url;
    });
  });
  document.getElementById("hero-image-file")?.addEventListener("change", (e) => {
    fileToWebpOrBase64(e.target.files[0], (url) => {
      document.getElementById("hero-image").value = url;
    });
  });
  document.getElementById("about-image-file")?.addEventListener("change", (e) => {
    fileToWebpOrBase64(e.target.files[0], (url) => {
      document.getElementById("about-image").value = url;
    });
  });

              document.getElementById("gallery-file-input")?.addEventListener("change", (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      fileToWebpOrBase64(file, (url) => {
        content.gallery = content.gallery || [];
        content.gallery.push({
          id: Date.now() + Math.random(),
          type: "image",
          src: url,
          title: file.name.replace(/\.[^.]+$/, ""),
          description: "",
        });
        renderGalleryEditor();
      }, 1200);
    });
    e.target.value = "";
  });

  document.getElementById("btn-save")?.addEventListener("click", saveAll);
  document.getElementById("btn-export")?.addEventListener("click", () => {
    collectFormToContent();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "club-content.json";
    a.click();
  });
  document.getElementById("import-json")?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        content = mergeContent(JSON.parse(reader.result));
        await saveContent(content);
        populateForm();
        alert("Import réussi !");
      } catch {
        alert("Fichier JSON invalide");
      }
    };
    reader.readAsText(file);
  });
  document.getElementById("btn-reset")?.addEventListener("click", async () => {
    if (confirm("Réinitialiser tout le contenu aux valeurs par défaut ?")) {
      content = await resetContent();
      populateForm();
      alert("Réinitialisé et enregistré.");
    }
  });
}

function fileToWebpOrBase64(file, cb, maxWidth = 1600) {
  if (!file || !file.type.startsWith("image/")) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = () => {
    const canvas = document.createElement("canvas");
    let w = img.width;
    let h = img.height;
    if (w > maxWidth) {
      h = (h * maxWidth) / w;
      w = maxWidth;
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);
    let dataUrl;
    try {
      dataUrl = canvas.toDataURL("image/webp", 0.82);
      if (!dataUrl.startsWith("data:image/webp")) {
        dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      }
    } catch {
      dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    }
    URL.revokeObjectURL(url);
    cb(dataUrl);
  };
  img.src = url;
}

function renderStatsEditor() {
  const el = document.getElementById("stats-editor");
  if (!el) return;
  el.innerHTML = (content.stats || [])
    .map(
      (s, i) => `
    <div class="flex gap-2 items-center">
      <input type="text" class="admin-input flex-1" data-stat-label="${i}" value="${escapeAttr(s.label)}" placeholder="Label">
      <input type="text" class="admin-input w-24" data-stat-value="${i}" value="${escapeAttr(s.value)}" placeholder="Valeur">
      <button type="button" class="text-red-400 hover:text-red-300 px-2" onclick="removeStat(${i})">✕</button>
    </div>`
    )
    .join("");
}

function removeStat(i) {
  content.stats.splice(i, 1);
  renderStatsEditor();
}

function renderPlayersEditor() {
  const el = document.getElementById("players-editor");
  if (!el) return;
  el.innerHTML = (content.team?.players || [])
    .map(
      (p, i) => `
    <div class="border border-white/10 rounded-xl p-4 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-400">#${i + 1}</span>
        <button type="button" class="text-red-400 text-sm" onclick="removePlayer(${i})">Supprimer</button>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div><label class="admin-label">Nom</label><input class="admin-input" data-player-name="${i}" value="${escapeAttr(p.name)}"></div>
        <div><label class="admin-label">Rôle / Poste</label><input class="admin-input" data-player-role="${i}" value="${escapeAttr(p.role)}"></div>
        <div><label class="admin-label">Numéro</label><input class="admin-input" data-player-number="${i}" value="${escapeAttr(p.number || "")}"></div>
        <div class="md:col-span-2"><label class="admin-label">Photo (URL ou upload)</label>
          <input class="admin-input mb-1" data-player-photo="${i}" value="${escapeAttr(p.photo || "")}" placeholder="https://...">
          <input type="file" accept="image/*" data-player-photo-file="${i}" class="text-sm text-gray-400">
          ${p.photo ? `<img src="${p.photo}" class="mt-2 w-16 h-16 object-cover rounded-lg" alt="">` : ""}
        </div>
        <div class="md:col-span-2"><label class="admin-label">Bio</label><input class="admin-input" data-player-bio="${i}" value="${escapeAttr(p.bio || "")}"></div>
      </div>
    </div>`
    )
    .join("");
}

function removePlayer(i) {
  content.team.players.splice(i, 1);
  renderPlayersEditor();
}

function renderNewsEditor() {
  const el = document.getElementById("news-editor");
  if (!el) return;
  el.innerHTML = (content.news || [])
    .map(
      (n, i) => `
    <div class="border border-white/10 rounded-xl p-4 space-y-3">
      <div class="flex justify-between">
        <span class="text-sm text-gray-400">Actualité #${i + 1}</span>
        <button type="button" class="text-red-400 text-sm" onclick="removeNews(${i})">Supprimer</button>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div class="md:col-span-2"><label class="admin-label">Titre</label><input class="admin-input" data-news-title="${i}" value="${escapeAttr(n.title)}"></div>
        <div><label class="admin-label">Date</label><input type="date" class="admin-input" data-news-date="${i}" value="${n.date || ""}"></div>
        <div class="md:col-span-2"><label class="admin-label">Image (URL ou upload)</label>
          <input class="admin-input mb-1" data-news-image="${i}" value="${escapeAttr(n.image || "")}" placeholder="https://...">
          <input type="file" accept="image/*" data-news-image-file="${i}" class="text-sm text-gray-400">
        </div>
        <div class="md:col-span-2"><label class="admin-label">Extrait</label><textarea class="admin-input" rows="2" data-news-excerpt="${i}">${escapeHtml(n.excerpt || "")}</textarea></div>
        <div class="md:col-span-2"><label class="admin-label">Contenu complet</label><textarea class="admin-input" rows="4" data-news-content="${i}">${escapeHtml(n.content || "")}</textarea></div>
      </div>
    </div>`
    )
    .join("");
}

function removeNews(i) {
  content.news.splice(i, 1);
  renderNewsEditor();
}

function renderGalleryEditor() {
  const el = document.getElementById("gallery-editor");
  if (!el) return;
  el.innerHTML = (content.gallery || [])
    .map(
      (g, i) => `
    <div class="border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4">
      <div class="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-800">
        ${
          g.type === "video"
            ? `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400">VIDÉO</div>`
            : g.src
            ? `<img src="${g.src}" class="w-full h-full object-cover" alt="">`
            : `<div class="w-full h-full flex items-center justify-center text-xs text-gray-500">Pas d'image</div>`
        }
      </div>
      <div class="flex-1 space-y-2">
        <div class="flex justify-between">
          <span class="text-xs uppercase tracking-wider text-gray-500">${g.type}</span>
          <button type="button" class="text-red-400 text-sm" onclick="removeGallery(${i})">Supprimer</button>
        </div>
        <input class="admin-input text-sm" data-gal-title="${i}" value="${escapeAttr(g.title || "")}" placeholder="Titre">
        <input class="admin-input text-sm" data-gal-src="${i}" value="${escapeAttr(g.src || "")}" placeholder="URL image ou embed YouTube">
        <input type="file" accept="image/*" data-gal-file="${i}" class="text-sm text-gray-400">
        <p class="text-xs text-gray-500">URL ou upload fichier (images)</p>
        <input class="admin-input text-sm" data-gal-desc="${i}" value="${escapeAttr(g.description || "")}" placeholder="Description">
      </div>
    </div>`
    )
    .join("");
}

function removeGallery(i) {
  content.gallery.splice(i, 1);
  renderGalleryEditor();
  if (typeof renderRosterFolders === 'function') renderRosterFolders();
}

function collectFormToContent() {
  if (typeof collectRosterFromForm === 'function') collectRosterFromForm();
  content.site.name = document.getElementById("site-name-input").value;
  content.site.logo = document.getElementById("site-logo-input").value;
  content.site.primaryColor = document.getElementById("primary-color").value;
  content.site.accentColor = document.getElementById("accent-color").value;
  content.footer = content.footer || {};
  content.footer.text = document.getElementById("footer-text-input").value;
  content.paymentInfo = content.paymentInfo || {};
  content.paymentInfo.receiverName = document.getElementById("pay-receiver")?.value || "";
  content.paymentInfo.mvola = document.getElementById("pay-mvola")?.value || "";
  content.paymentInfo.orangeMoney = document.getElementById("pay-orange")?.value || "";
  content.paymentInfo.especesNote = document.getElementById("pay-especes")?.value || "";
  content.paymentInfo.instructions = document.getElementById("pay-instructions")?.value || "";
  content.cta = content.cta || {};
  content.cta.title = document.getElementById("cta-title-input").value;
  content.cta.text = document.getElementById("cta-text-input").value;

  content.hero.subtitle = document.getElementById("hero-subtitle").value;
  content.hero.title = document.getElementById("hero-title").value;
  content.hero.description = document.getElementById("hero-desc").value;
  content.hero.image = document.getElementById("hero-image").value;
  content.about.title = document.getElementById("about-title").value;
  content.about.text = document.getElementById("about-text").value;
  content.about.image = document.getElementById("about-image").value;

  content.team.title = document.getElementById("team-title").value;
  content.team.description = document.getElementById("team-desc").value;

  content.contact.email = document.getElementById("contact-email").value;
  content.contact.phone = document.getElementById("contact-phone").value;
  content.contact.address = document.getElementById("contact-address").value;
  content.contact.hours = document.getElementById("contact-hours").value;

  document.querySelectorAll("[data-stat-label]").forEach((inp) => {
    const i = +inp.dataset.statLabel;
    if (content.stats[i]) content.stats[i].label = inp.value;
  });
  document.querySelectorAll("[data-stat-value]").forEach((inp) => {
    const i = +inp.dataset.statValue;
    if (content.stats[i]) content.stats[i].value = inp.value;
  });

  document.querySelectorAll("[data-player-name]").forEach((inp) => {
    const i = +inp.dataset.playerName;
    if (content.team.players[i]) content.team.players[i].name = inp.value;
  });
  document.querySelectorAll("[data-player-role]").forEach((inp) => {
    const i = +inp.dataset.playerRole;
    if (content.team.players[i]) content.team.players[i].role = inp.value;
  });
  document.querySelectorAll("[data-player-number]").forEach((inp) => {
    const i = +inp.dataset.playerNumber;
    if (content.team.players[i]) content.team.players[i].number = inp.value;
  });
  document.querySelectorAll("[data-player-photo]").forEach((inp) => {
    const i = +inp.dataset.playerPhoto;
    if (content.team.players[i]) content.team.players[i].photo = inp.value;
  });
  document.querySelectorAll("[data-player-bio]").forEach((inp) => {
    const i = +inp.dataset.playerBio;
    if (content.team.players[i]) content.team.players[i].bio = inp.value;
  });

  document.querySelectorAll("[data-news-title]").forEach((inp) => {
    const i = +inp.dataset.newsTitle;
    if (content.news[i]) content.news[i].title = inp.value;
  });
  document.querySelectorAll("[data-news-date]").forEach((inp) => {
    const i = +inp.dataset.newsDate;
    if (content.news[i]) content.news[i].date = inp.value;
  });
  document.querySelectorAll("[data-news-image]").forEach((inp) => {
    const i = +inp.dataset.newsImage;
    if (content.news[i]) content.news[i].image = inp.value;
  });
  document.querySelectorAll("[data-news-excerpt]").forEach((inp) => {
    const i = +inp.dataset.newsExcerpt;
    if (content.news[i]) content.news[i].excerpt = inp.value;
  });
  document.querySelectorAll("[data-news-content]").forEach((inp) => {
    const i = +inp.dataset.newsContent;
    if (content.news[i]) content.news[i].content = inp.value;
  });

  document.querySelectorAll("[data-gal-title]").forEach((inp) => {
    const i = +inp.dataset.galTitle;
    if (content.gallery[i]) content.gallery[i].title = inp.value;
  });
  document.querySelectorAll("[data-gal-src]").forEach((inp) => {
    const i = +inp.dataset.galSrc;
    if (content.gallery[i]) {
      content.gallery[i].src = inp.value;
      content.gallery[i].isYoutube = inp.value.includes("youtube") || inp.value.includes("youtu.be");
    }
  });
  document.querySelectorAll("[data-gal-desc]").forEach((inp) => {
    const i = +inp.dataset.galDesc;
    if (content.gallery[i]) content.gallery[i].description = inp.value;
  });
}

async function saveAll() {
  collectFormToContent();
  const status = document.getElementById("save-status");
  if (status) {
    status.classList.remove("hidden");
    status.textContent = "Enregistrement…";
    status.className = "text-center text-sm text-amber-400 mt-2";
  }
  const ok = await saveContent(content);
  if (ok) {
    // Recharger depuis le cloud pour confirmer
    try {
      content = await loadContent(true);
    } catch (_) {}
    if (status) {
      status.className = "text-center text-sm text-green-400 mt-2";
      status.textContent = isSupabaseConfigured()
        ? "✓ Enregistré dans le cloud — visible par tous (Équipe, galerie, programme inclus)"
        : "✓ Enregistré localement seulement";
      setTimeout(() => status.classList.add("hidden"), 6000);
    }
    applyTheme(content);
    document.getElementById("admin-site-name").textContent = content.site.name;
  } else if (status) {
    status.className = "text-center text-sm text-red-400 mt-2";
    status.textContent = "Échec de l'enregistrement — vois le message d'erreur";
  }
}

function escapeAttr(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

window.removeStat = removeStat;
window.removePlayer = removePlayer;
window.removeNews = removeNews;
window.removeGallery = removeGallery;

// --- Events / Results / Reservations editors ---
function renderEventsEditor() {
  const el = document.getElementById("events-editor");
  if (!el) return;
  content.events = content.events || [];
  el.innerHTML = content.events
    .map(
      (e, i) => `
    <div class="border border-white/10 rounded-xl p-4 space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-400">#${i + 1} · ${e.type || ""}</span>
        <button type="button" class="text-red-400 text-sm" onclick="removeEvent(${i})">Supprimer</button>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div class="md:col-span-2"><label class="admin-label">Titre</label><input class="admin-input" data-ev-title="${i}" value="${escapeAttr(e.title || "")}"></div>
        <div><label class="admin-label">Type</label>
          <select class="admin-input" data-ev-type="${i}">
            <option value="match" ${e.type === "match" ? "selected" : ""}>Match</option>
            <option value="entrainement" ${e.type === "entrainement" ? "selected" : ""}>Entraînement</option>
            <option value="tournoi" ${e.type === "tournoi" ? "selected" : ""}>Tournoi</option>
            <option value="reunion" ${e.type === "reunion" ? "selected" : ""}>Réunion</option>
            <option value="autre" ${e.type === "autre" ? "selected" : ""}>Autre</option>
          </select>
        </div>
        <div><label class="admin-label">Catégorie</label><input class="admin-input" data-ev-cat="${i}" value="${escapeAttr(e.category || "")}" placeholder="Senior, U15..."></div>
        <div><label class="admin-label">Date</label><input type="date" class="admin-input" data-ev-date="${i}" value="${e.date || ""}"></div>
        <div class="flex gap-2">
          <div class="flex-1"><label class="admin-label">Début</label><input type="time" class="admin-input" data-ev-time="${i}" value="${e.time || ""}"></div>
          <div class="flex-1"><label class="admin-label">Fin</label><input type="time" class="admin-input" data-ev-end="${i}" value="${e.endTime || ""}"></div>
        </div>
        <div class="md:col-span-2"><label class="admin-label">Lieu</label><input class="admin-input" data-ev-loc="${i}" value="${escapeAttr(e.location || "")}"></div>
        <div class="md:col-span-2"><label class="admin-label">Description</label><textarea class="admin-input" rows="2" data-ev-desc="${i}">${escapeHtml(e.description || "")}</textarea></div>
        <div><label class="admin-label">Adversaire (matchs)</label><input class="admin-input" data-ev-opp="${i}" value="${escapeAttr(e.opponent || "")}"></div>
        <div class="flex items-center gap-4 pt-6">
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" data-ev-home="${i}" ${e.home ? "checked" : ""}> Domicile</label>
          <label class="flex items-center gap-2 text-sm"><input type="checkbox" data-ev-book="${i}" ${e.bookable ? "checked" : ""}> Réservable</label>
        </div>
        <div><label class="admin-label">Capacité (si réservable)</label><input type="number" class="admin-input" data-ev-cap="${i}" value="${e.capacity || ""}" min="0"></div>
      </div>
    </div>`
    )
    .join("");
}

function removeEvent(i) {
  content.events.splice(i, 1);
  renderEventsEditor();
}
window.removeEvent = removeEvent;

function renderResultsEditor() {
  const el = document.getElementById("results-editor");
  if (!el) return;
  content.results = content.results || [];
  el.innerHTML = content.results
    .map(
      (r, i) => `
    <div class="border border-white/10 rounded-xl p-4 grid md:grid-cols-3 gap-3 items-end">
      <div><label class="admin-label">Date</label><input type="date" class="admin-input" data-res-date="${i}" value="${r.date || ""}"></div>
      <div><label class="admin-label">Adversaire</label><input class="admin-input" data-res-opp="${i}" value="${escapeAttr(r.opponent || "")}"></div>
      <div><label class="admin-label">Compétition</label><input class="admin-input" data-res-comp="${i}" value="${escapeAttr(r.competition || "")}"></div>
      <div><label class="admin-label">Score nous</label><input type="number" class="admin-input" data-res-home="${i}" value="${r.scoreHome ?? 0}"></div>
      <div><label class="admin-label">Score eux</label><input type="number" class="admin-input" data-res-away="${i}" value="${r.scoreAway ?? 0}"></div>
      <div class="flex items-center justify-between gap-2">
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" data-res-is-home="${i}" ${r.home ? "checked" : ""}> À domicile</label>
        <button type="button" class="text-red-400 text-sm" onclick="removeResult(${i})">✕</button>
      </div>
    </div>`
    )
    .join("");
}

function removeResult(i) {
  content.results.splice(i, 1);
  renderResultsEditor();
}
window.removeResult = removeResult;

function renderReservationsList() {
  const el = document.getElementById("reservations-list");
  if (!el) return;
  content.reservations = content.reservations || [];
  if (!content.reservations.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm">Aucune réservation pour le moment.</p>';
    return;
  }
  const eventsById = Object.fromEntries((content.events || []).map((e) => [e.id, e]));
  el.innerHTML = content.reservations
    .slice()
    .reverse()
    .map((r) => {
      const ev = eventsById[r.eventId];
      const statusColor =
        r.status === "confirmed" ? "text-green-400" : r.status === "cancelled" ? "text-red-400" : "text-amber-400";
      return `
      <div class="border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <p class="font-medium">${escapeAttr(r.name)} · ${r.seats || 1} place(s)</p>
          <p class="text-sm text-gray-400">${escapeAttr(r.email)} ${r.phone ? "· " + escapeAttr(r.phone) : ""}</p>
          <p class="text-sm text-gray-500 mt-1">${ev ? ev.title + " — " + (ev.date || "") : "Événement #" + r.eventId}</p>
          ${r.message ? `<p class="text-xs text-gray-500 mt-1">« ${escapeAttr(r.message)} »</p>` : ""}
          <p class="text-xs ${statusColor} mt-1 uppercase">${r.status || "pending"}</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400" onclick="setReservationStatus(${r.id}, 'confirmed')">Confirmer</button>
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400" onclick="setReservationStatus(${r.id}, 'cancelled')">Annuler</button>
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-white/10" onclick="deleteReservation(${r.id})">Suppr.</button>
        </div>
      </div>`;
    })
    .join("");
}

async function setReservationStatus(id, status) {
  try {
    await updateReservationStatus(id, status);
    const r = (content.reservations || []).find((x) => x.id === id);
    if (r) r.status = status;
    renderReservationsList();
  } catch (e) {
    alert("Erreur: " + (e.message || e));
  }
}
async function deleteReservation(id) {
  try {
    await deleteReservationDb(id);
    content.reservations = (content.reservations || []).filter((x) => x.id !== id);
    renderReservationsList();
  } catch (e) {
    alert("Erreur: " + (e.message || e));
  }
}
window.setReservationStatus = setReservationStatus;
window.deleteReservation = deleteReservation;


// --- Robust event binding (delegation) so buttons always work ---
function bindAdminActions() {
  // Already bound?
  if (window.__adminBound) return;
  window.__adminBound = true;

  // Upload images dynamiques (joueurs, actus)
  document.addEventListener("change", (e) => {
    const tEl = e.target;
    if (tEl.matches("[data-player-photo-file]")) {
      const i = +tEl.dataset.playerPhotoFile;
      const file = tEl.files && tEl.files[0];
      if (!file) return;
      fileToWebpOrBase64(file, (url) => {
        const inp = document.querySelector(`[data-player-photo="${i}"]`);
        if (inp) inp.value = url;
        if (content.team?.players?.[i]) content.team.players[i].photo = url;
      }, 800);
    }
    if (tEl.matches("[data-news-image-file]")) {
      const i = +tEl.dataset.newsImageFile;
      const file = tEl.files && tEl.files[0];
      if (!file) return;
      fileToWebpOrBase64(file, (url) => {
        const inp = document.querySelector(`[data-news-image="${i}"]`);
        if (inp) inp.value = url;
        if (content.news?.[i]) content.news[i].image = url;
      }, 1200);
    }
    if (tEl.matches("[data-roster-photo-file]")) {
      const i = +tEl.dataset.rosterPhotoFile;
      const file = tEl.files && tEl.files[0];
      if (!file) return;
      fileToWebpOrBase64(file, (url) => {
        const inp = document.querySelector(`[data-roster-photo="${i}"]`);
        if (inp) inp.value = url;
        if (content.roster?.[i]) content.roster[i].photo = url;
      }, 800);
    }
    if (tEl.matches("[data-gal-file]")) {
      const i = +tEl.dataset.galFile;
      const file = tEl.files && tEl.files[0];
      if (!file) return;
      fileToWebpOrBase64(file, (url) => {
        const inp = document.querySelector(`[data-gal-src="${i}"]`);
        if (inp) inp.value = url;
        if (content.gallery?.[i]) {
          content.gallery[i].src = url;
          content.gallery[i].type = "image";
        }
        // refresh preview without losing other fields if possible
        const preview = inp?.closest(".border")?.querySelector("img");
        if (preview) preview.src = url;
        else renderGalleryEditor();
      }, 1200);
    }
  });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, label, [data-action]");
    if (!t) return;
    const id = t.id;

    if (id === "btn-add-payment") {
      addMonthlyPaymentFromForm();
    }
    if (id === "btn-refresh-mp") {
      renderMonthlyPayments();
    }
    if (id === "add-roster-player") {
      content.roster = content.roster || [];
      content.roster.push({
        id: Date.now(),
        firstName: "Nouveau",
        lastName: "Joueur",
        category: "U13",
        gender: "M",
        birthDate: "",
        photo: "",
        number: "",
      });
      renderRosterFolders();
    }
    if (id === "sync-stats-roster") {
      collectRosterFromForm();
      syncStatsFromRoster();
    }
    if (id === "add-stat") {
      content.stats = content.stats || [];
      content.stats.push({ label: "Nouveau", value: "0" });
      renderStatsEditor();
    }
    if (id === "add-player") {
      content.team.players = content.team.players || [];
      content.team.players.push({ name: "Nouveau joueur", role: "Poste", number: "", photo: "", bio: "" });
      renderPlayersEditor();
    }
    if (id === "add-news") {
      content.news = content.news || [];
      content.news.unshift({
        id: Date.now(),
        title: "Nouvelle actualité",
        excerpt: "",
        date: new Date().toISOString().slice(0, 10),
        image: "",
        content: "",
      });
      renderNewsEditor();
    }
    if (id === "add-gallery-image") {
      content.gallery = content.gallery || [];
      content.gallery.push({ id: Date.now(), type: "image", src: "", title: "", description: "" });
      renderGalleryEditor();
    }
    if (id === "add-gallery-video") {
      content.gallery = content.gallery || [];
      content.gallery.push({
        id: Date.now(),
        type: "video",
        src: "https://www.youtube.com/embed/VIDEO_ID",
        title: "Vidéo",
        description: "",
        isYoutube: true,
      });
      renderGalleryEditor();
    }
    if (id === "add-gallery-upload") {
      document.getElementById("gallery-file-input")?.click();
    }
    if (id === "add-event") {
      content.events = content.events || [];
      content.events.push({
        id: Date.now(),
        title: "Nouvel événement",
        type: "entrainement",
        date: new Date().toISOString().slice(0, 10),
        time: "19:00",
        endTime: "21:00",
        location: "",
        description: "",
        bookable: false,
        capacity: 20,
        category: "Senior",
      });
      renderEventsEditor();
    }
    if (id === "add-result") {
      content.results = content.results || [];
      content.results.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        opponent: "",
        scoreHome: 0,
        scoreAway: 0,
        home: true,
        competition: "Championnat",
      });
      renderResultsEditor();
    }
  });
}

// Patch populate / collect without breaking setup
(function patchAdmin() {
  const origPopulate = populateForm;
  populateForm = function () {
    origPopulate();
    renderEventsEditor();
    renderResultsEditor();
    renderReservationsList();
  };

  const origCollect = collectFormToContent;
  collectFormToContent = function () {
    origCollect();
    document.querySelectorAll("[data-ev-title]").forEach((inp) => {
      const i = +inp.dataset.evTitle;
      if (content.events[i]) content.events[i].title = inp.value;
    });
    document.querySelectorAll("[data-ev-type]").forEach((inp) => {
      const i = +inp.dataset.evType;
      if (content.events[i]) content.events[i].type = inp.value;
    });
    document.querySelectorAll("[data-ev-cat]").forEach((inp) => {
      const i = +inp.dataset.evCat;
      if (content.events[i]) content.events[i].category = inp.value;
    });
    document.querySelectorAll("[data-ev-date]").forEach((inp) => {
      const i = +inp.dataset.evDate;
      if (content.events[i]) content.events[i].date = inp.value;
    });
    document.querySelectorAll("[data-ev-time]").forEach((inp) => {
      const i = +inp.dataset.evTime;
      if (content.events[i]) content.events[i].time = inp.value;
    });
    document.querySelectorAll("[data-ev-end]").forEach((inp) => {
      const i = +inp.dataset.evEnd;
      if (content.events[i]) content.events[i].endTime = inp.value;
    });
    document.querySelectorAll("[data-ev-loc]").forEach((inp) => {
      const i = +inp.dataset.evLoc;
      if (content.events[i]) content.events[i].location = inp.value;
    });
    document.querySelectorAll("[data-ev-desc]").forEach((inp) => {
      const i = +inp.dataset.evDesc;
      if (content.events[i]) content.events[i].description = inp.value;
    });
    document.querySelectorAll("[data-ev-opp]").forEach((inp) => {
      const i = +inp.dataset.evOpp;
      if (content.events[i]) content.events[i].opponent = inp.value;
    });
    document.querySelectorAll("[data-ev-home]").forEach((inp) => {
      const i = +inp.dataset.evHome;
      if (content.events[i]) content.events[i].home = inp.checked;
    });
    document.querySelectorAll("[data-ev-book]").forEach((inp) => {
      const i = +inp.dataset.evBook;
      if (content.events[i]) content.events[i].bookable = inp.checked;
    });
    document.querySelectorAll("[data-ev-cap]").forEach((inp) => {
      const i = +inp.dataset.evCap;
      if (content.events[i]) content.events[i].capacity = inp.value ? +inp.value : null;
    });
    document.querySelectorAll("[data-res-date]").forEach((inp) => {
      const i = +inp.dataset.resDate;
      if (content.results[i]) content.results[i].date = inp.value;
    });
    document.querySelectorAll("[data-res-opp]").forEach((inp) => {
      const i = +inp.dataset.resOpp;
      if (content.results[i]) content.results[i].opponent = inp.value;
    });
    document.querySelectorAll("[data-res-comp]").forEach((inp) => {
      const i = +inp.dataset.resComp;
      if (content.results[i]) content.results[i].competition = inp.value;
    });
    document.querySelectorAll("[data-res-home]").forEach((inp) => {
      const i = +inp.dataset.resHome;
      if (content.results[i]) content.results[i].scoreHome = +inp.value;
    });
    document.querySelectorAll("[data-res-away]").forEach((inp) => {
      const i = +inp.dataset.resAway;
      if (content.results[i]) content.results[i].scoreAway = +inp.value;
    });
    document.querySelectorAll("[data-res-is-home]").forEach((inp) => {
      const i = +inp.dataset.resIsHome;
      if (content.results[i]) content.results[i].home = inp.checked;
    });
  };
})();




// ========== ROSTER (dossiers par catégorie) ==========
function renderRosterFolders() {
  const el = document.getElementById("roster-folders");
  if (!el) return;
  content.roster = content.roster || [];
  const cats = {};
  content.roster.forEach((p, i) => {
    const c = p.category || "Sans catégorie";
    if (!cats[c]) cats[c] = [];
    cats[c].push({ ...p, _i: i });
  });
  const order = ["U7","U9","U11","U13","U15","U17","U20","Senior","Féminines","Loisir","Sans catégorie"];
  const keys = Object.keys(cats).sort((a, b) => {
    const ia = order.indexOf(a); const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  if (!keys.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm">Aucun joueur dans l\'effectif. Cliquez sur + Ajouter un joueur.</p>';
    return;
  }
  el.innerHTML = keys.map((cat) => {
    const list = cats[cat];
    const id = "folder-" + cat.replace(/\s+/g, "_");
    return `
    <details class="border border-white/10 rounded-xl overflow-hidden" open>
      <summary class="cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 flex justify-between items-center font-medium">
        <span>📁 ${escapeAttr(cat)}</span>
        <span class="text-sm text-gray-400">${list.length} joueur(s)</span>
      </summary>
      <div class="p-3 space-y-3 border-t border-white/5">
        ${list.map((p) => `
          <div class="border border-white/10 rounded-lg p-3 grid md:grid-cols-2 gap-2">
            <div><label class="admin-label">Prénom</label><input class="admin-input" data-roster-fn="${p._i}" value="${escapeAttr(p.firstName || "")}"></div>
            <div><label class="admin-label">Nom</label><input class="admin-input" data-roster-ln="${p._i}" value="${escapeAttr(p.lastName || "")}"></div>
            <div><label class="admin-label">Catégorie</label>
              <select class="admin-input" data-roster-cat="${p._i}">
                ${["U7","U9","U11","U13","U15","U17","U20","Senior","Féminines","Loisir"].map((c) =>
                  `<option value="${c}" ${(p.category||"")===c?"selected":""}>${c}</option>`
                ).join("")}
              </select>
            </div>
            <div><label class="admin-label">Sexe</label>
              <select class="admin-input" data-roster-gender="${p._i}">
                <option value="M" ${p.gender==="M"?"selected":""}>M</option>
                <option value="F" ${p.gender==="F"?"selected":""}>F</option>
              </select>
            </div>
            <div><label class="admin-label">Naissance</label><input type="date" class="admin-input" data-roster-birth="${p._i}" value="${p.birthDate||""}"></div>
            <div><label class="admin-label">N°</label><input class="admin-input" data-roster-num="${p._i}" value="${escapeAttr(p.number||"")}"></div>
            <div class="md:col-span-2"><label class="admin-label">Photo (URL ou upload)</label>
              <input class="admin-input mb-1" data-roster-photo="${p._i}" value="${escapeAttr(p.photo||"")}" placeholder="https://...">
              <input type="file" accept="image/*" data-roster-photo-file="${p._i}" class="text-sm text-gray-400">
            </div>
            <div class="md:col-span-2 flex justify-end">
              <button type="button" class="text-red-400 text-sm" onclick="removeRosterPlayer(${p._i})">Supprimer</button>
            </div>
          </div>
        `).join("")}
      </div>
    </details>`;
  }).join("");
}

function removeRosterPlayer(i) {
  content.roster.splice(i, 1);
  renderRosterFolders();
}
window.removeRosterPlayer = removeRosterPlayer;

function collectRosterFromForm() {
  document.querySelectorAll("[data-roster-fn]").forEach((inp) => {
    const i = +inp.dataset.rosterFn;
    if (content.roster[i]) content.roster[i].firstName = inp.value;
  });
  document.querySelectorAll("[data-roster-ln]").forEach((inp) => {
    const i = +inp.dataset.rosterLn;
    if (content.roster[i]) content.roster[i].lastName = inp.value;
  });
  document.querySelectorAll("[data-roster-cat]").forEach((inp) => {
    const i = +inp.dataset.rosterCat;
    if (content.roster[i]) content.roster[i].category = inp.value;
  });
  document.querySelectorAll("[data-roster-gender]").forEach((inp) => {
    const i = +inp.dataset.rosterGender;
    if (content.roster[i]) content.roster[i].gender = inp.value;
  });
  document.querySelectorAll("[data-roster-birth]").forEach((inp) => {
    const i = +inp.dataset.rosterBirth;
    if (content.roster[i]) content.roster[i].birthDate = inp.value;
  });
  document.querySelectorAll("[data-roster-num]").forEach((inp) => {
    const i = +inp.dataset.rosterNum;
    if (content.roster[i]) content.roster[i].number = inp.value;
  });
  document.querySelectorAll("[data-roster-photo]").forEach((inp) => {
    const i = +inp.dataset.rosterPhoto;
    if (content.roster[i]) content.roster[i].photo = inp.value;
  });
}

function syncStatsFromRoster() {
  const rs = getRosterStats(content);
  content.stats = content.stats || [];
  // Update or set Joueurs / Catégories
  let foundP = false, foundC = false;
  content.stats.forEach((s) => {
    if (/joueur/i.test(s.label)) { s.value = String(rs.players); foundP = true; }
    if (/catégor/i.test(s.label)) { s.value = String(rs.categories); foundC = true; }
  });
  if (!foundP) content.stats.unshift({ label: "Joueurs", value: String(rs.players) });
  if (!foundC) content.stats.splice(1, 0, { label: "Catégories", value: String(rs.categories) });
  renderStatsEditor();
  alert("Stats mises à jour : " + rs.players + " joueurs, " + rs.categories + " catégories actives.");
}



// ========== PAIEMENTS MENSUELS ==========
function fillMpPlayerSelect() {
  const sel = document.getElementById("mp-player");
  if (!sel) return;
  const roster = content.roster || [];
  sel.innerHTML = '<option value="">— Choisir dans l\'effectif —</option>' +
    roster.map((r, i) => {
      const label = `${r.firstName || ""} ${r.lastName || ""} (${r.category || ""})`.trim();
      return `<option value="${i}" data-cat="${escapeAttr(r.category || "")}" data-name="${escapeAttr((r.firstName || "") + " " + (r.lastName || ""))}">${escapeAttr(label)}</option>`;
    }).join("");
}

function renderMonthlyPayments() {
  const el = document.getElementById("monthly-payments-list");
  if (!el) return;
  content.monthlyPayments = content.monthlyPayments || [];
  const monthF = document.getElementById("filter-mp-month")?.value || "";
  const q = (document.getElementById("filter-mp-search")?.value || "").toLowerCase().trim();
  let list = content.monthlyPayments.slice().sort((a, b) => (b.month || "").localeCompare(a.month || "") || (b.paidAt || "").localeCompare(a.paidAt || ""));
  if (monthF) list = list.filter((x) => x.month === monthF);
  if (q) list = list.filter((x) => `${x.playerName} ${x.ref} ${x.category}`.toLowerCase().includes(q));
  if (!list.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm">Aucun paiement pour ces filtres.</p>';
    return;
  }
  const methodLabel = { mvola: "MVola", orange_money: "Orange Money", especes: "Espèces", virement: "Virement", autre: "Autre" };
  el.innerHTML = list.map((x) => `
    <div class="border border-white/10 rounded-xl p-3 flex flex-wrap justify-between gap-2 items-start">
      <div>
        <p class="font-semibold">${escapeAttr(x.playerName || "")} <span class="text-gray-400 font-normal text-sm">${escapeAttr(x.category || "")}</span></p>
        <p class="text-sm text-gray-400">Mois : <span class="text-white">${escapeAttr(x.month || "")}</span> · Date : ${escapeAttr(x.paidAt || "—")}</p>
        <p class="text-sm">${x.amount != null ? Number(x.amount).toLocaleString("fr-FR") + " Ar" : "—"} · ${methodLabel[x.method] || x.method || ""}</p>
        <p class="text-xs text-primary font-mono">Réf. : ${escapeAttr(x.ref || "—")}</p>
        ${x.notes ? `<p class="text-xs text-gray-500">${escapeAttr(x.notes)}</p>` : ""}
      </div>
      <button type="button" class="text-red-400 text-sm" onclick="removeMonthlyPayment('${x.id}')">Supprimer</button>
    </div>
  `).join("");
}

function removeMonthlyPayment(id) {
  content.monthlyPayments = (content.monthlyPayments || []).filter((x) => String(x.id) !== String(id));
  renderMonthlyPayments();
}
window.removeMonthlyPayment = removeMonthlyPayment;

function addMonthlyPaymentFromForm() {
  const sel = document.getElementById("mp-player");
  let playerName = (document.getElementById("mp-name")?.value || "").trim();
  let category = (document.getElementById("mp-category")?.value || "").trim();
  if (sel && sel.value !== "") {
    const opt = sel.options[sel.selectedIndex];
    if (opt) {
      playerName = playerName || opt.dataset.name || opt.textContent;
      category = category || opt.dataset.cat || "";
    }
  }
  if (!playerName) {
    alert("Indiquez un joueur (effectif ou nom libre).");
    return;
  }
  const month = document.getElementById("mp-month")?.value;
  if (!month) {
    alert("Choisissez le mois (période).");
    return;
  }
  content.monthlyPayments = content.monthlyPayments || [];
  content.monthlyPayments.unshift({
    id: String(Date.now()),
    playerName,
    category,
    month,
    paidAt: document.getElementById("mp-date")?.value || "",
    amount: +document.getElementById("mp-amount")?.value || 0,
    method: document.getElementById("mp-method")?.value || "",
    ref: (document.getElementById("mp-ref")?.value || "").trim(),
    notes: (document.getElementById("mp-notes")?.value || "").trim(),
  });
  // clear form partial
  const nameEl = document.getElementById("mp-name");
  if (nameEl) nameEl.value = "";
  const refEl = document.getElementById("mp-ref");
  if (refEl) refEl.value = "";
  renderMonthlyPayments();
  alert("Paiement ajouté. Cliquez sur Enregistrer pour le cloud.");
}


// ========== INSCRIPTIONS ADMIN ==========
let _inscriptionsCache = [];

async function refreshInscriptionsAdmin() {
  _inscriptionsCache = await loadInscriptions();
  renderInscriptionsAdmin();
}

function ageFromBirth(iso) {
  if (!iso) return "";
  const b = new Date(iso);
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
}

function renderInscriptionsAdmin() {
  const el = document.getElementById("inscriptions-list");
  if (!el) return;
  const cat = document.getElementById("filter-category")?.value || "";
  const gender = document.getElementById("filter-gender")?.value || "";
  const ageRange = document.getElementById("filter-age")?.value || "";
  const pay = document.getElementById("filter-payment")?.value || "";
  const status = document.getElementById("filter-status")?.value || "";
  const q = (document.getElementById("filter-search")?.value || "").toLowerCase().trim();

  let list = _inscriptionsCache.slice();
  if (cat) list = list.filter((x) => x.category === cat);
  if (gender) list = list.filter((x) => x.gender === gender);
  if (pay) list = list.filter((x) => x.paymentStatus === pay);
  if (status) list = list.filter((x) => x.status === status);
  if (ageRange) {
    const [amin, amax] = ageRange.split("-").map(Number);
    list = list.filter((x) => {
      const a = ageFromBirth(x.birthDate);
      if (a === "" || a === null || a === undefined) return false;
      return a >= amin && a <= amax;
    });
  }
  if (q) {
    list = list.filter(
      (x) =>
        `${x.firstName} ${x.lastName} ${x.parentName} ${x.category || ""}`.toLowerCase().includes(q)
    );
  }

  const countEl = document.getElementById("ins-count");
  if (countEl) countEl.textContent = `${list.length} inscription(s) affichée(s) / ${_inscriptionsCache.length} au total`;

  if (!list.length) {
    el.innerHTML = '<p class="text-gray-500 text-sm">Aucune inscription pour ces filtres.</p>';
    return;
  }

  const payLabel = { unpaid: "Non payé", pending: "À valider", paid: "Payé" };
  const stLabel = { pending: "En attente", accepted: "Accepté", rejected: "Refusé" };
  const payColor = { unpaid: "text-red-400", pending: "text-amber-400", paid: "text-green-400" };

  el.innerHTML = list
    .map((x) => {
      const age = ageFromBirth(x.birthDate);
      return `
      <div class="border border-white/10 rounded-xl p-4 space-y-2">
        <div class="flex flex-wrap justify-between gap-2">
          <div class="flex gap-3">
            ${x.photoUrl ? `<img src="${x.photoUrl}" alt="" class="w-14 h-14 rounded-lg object-cover border border-white/10">` : `<div class="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-500">Photo</div>`}
            <div>
            <p class="font-semibold text-lg">${escapeAttr(x.firstName)} ${escapeAttr(x.lastName)}
              <span class="text-sm font-normal text-gray-400">${x.gender === "F" ? "♀" : "♂"} ${age !== "" ? "· " + age + " ans" : ""}</span>
            </p>
            <p class="text-sm text-primary">${escapeAttr(x.category || "—")}</p>
            </div>
          </div>
          <div class="text-right text-sm">
            <p class="${payColor[x.paymentStatus] || ""}">${payLabel[x.paymentStatus] || x.paymentStatus} · ${x.paymentAmount || 0} Ar</p>
            <p class="text-gray-400">${stLabel[x.status] || x.status}</p>
          </div>
        </div>
        <p class="text-sm text-gray-400">Parent : ${escapeAttr(x.parentName)} · ${escapeAttr(x.parentPhone)} ${x.parentEmail ? "· " + escapeAttr(x.parentEmail) : ""}</p>
        ${x.paymentRef ? `<p class="text-xs text-gray-500">Paiement : ${escapeAttr(x.paymentMethod || "")} · réf. ${escapeAttr(x.paymentRef)}</p>` : ""}
        ${x.medicalNotes ? `<p class="text-xs text-amber-200/80">Médical : ${escapeAttr(x.medicalNotes)}</p>` : ""}
        <div class="flex flex-wrap gap-2 pt-2">
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400" onclick="adminInsUpdate(${x.id}, {paymentStatus:'paid', paymentDate: new Date().toISOString().slice(0,10)})">Marquer payé</button>
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-primary/20 text-primary" onclick="adminInsUpdate(${x.id}, {status:'accepted'})">Accepter</button>
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-white/10" onclick="adminInsUpdate(${x.id}, {status:'rejected'})">Refuser</button>
          <button type="button" class="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400" onclick="adminInsDelete(${x.id})">Supprimer</button>
        </div>
      </div>`;
    })
    .join("");
}

async function adminInsUpdate(id, patch) {
  try {
    await updateInscription(id, patch);
    await refreshInscriptionsAdmin();
  } catch (e) {
    alert("Erreur : " + (e.message || e));
  }
}
async function adminInsDelete(id) {
  if (!confirm("Supprimer cette inscription ?")) return;
  try {
    await deleteInscription(id);
    await refreshInscriptionsAdmin();
  } catch (e) {
    alert("Erreur : " + (e.message || e));
  }
}
window.adminInsUpdate = adminInsUpdate;
window.adminInsDelete = adminInsDelete;


// Always bind once
bindAdminActions();


