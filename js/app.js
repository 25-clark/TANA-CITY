// App commune : navigation, lightbox, rendu

let currentGallery = [];
let currentIndex = 0;

const TYPE_LABELS = {
  match: "Match",
  entrainement: "Entraînement",
  tournoi: "Tournoi",
  reunion: "Réunion",
  autre: "Événement",
};
const TYPE_COLORS = {
  match: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  entrainement: "bg-primary/20 text-primary border-primary/30",
  tournoi: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  reunion: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  autre: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};



// SVG icons (inline, responsive-friendly)
const ICONS = {
  home: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>',
  team: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 4a4 4 0 10-8 0"/></svg>',
  calendar: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg>',
  register: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>',
  gallery: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  news: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v8a2 2 0 01-2 2z"/></svg>',
  contact: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
  phone: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>',
  map: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  clock: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  pay: '<svg class="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
};

function decorateNavIcons() {
  const map = {
    "index.html": ICONS.home,
    "equipe.html": ICONS.team,
    "programme.html": ICONS.calendar,
    "inscription.html": ICONS.register,
    "galerie.html": ICONS.gallery,
    "actualites.html": ICONS.news,
    "contact.html": ICONS.contact,
  };
  document.querySelectorAll("#nav-menu a, #mobile-menu a").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (map[href] && !a.querySelector(".icon-svg")) {
      a.insertAdjacentHTML("afterbegin", map[href] + " ");
    }
  });
}

function initSite() {
  const content = getContent();
  if (typeof decorateNavIcons === 'function') decorateNavIcons();
  applyTheme(content);

  // Header scroll
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // Mobile menu
  const toggle = document.getElementById("menu-toggle");
  const mobile = document.getElementById("mobile-menu");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => mobile.classList.toggle("hidden"));
  }

  // Site name & logo
  const siteName = content.site.name || "Club FC";
  document.querySelectorAll("#site-name, #footer-name").forEach((el) => {
    if (el) el.textContent = siteName;
  });
  document.title = document.title.replace("Club de Football", siteName);

  const logoImg = document.getElementById("site-logo");
  const logoFallback = document.getElementById("logo-fallback");
  if (content.site.logo && logoImg) {
    logoImg.src = content.site.logo;
    logoImg.classList.remove("hidden");
    if (logoFallback) logoFallback.classList.add("hidden");
  }

  // Footer contact
  const footerContact = document.getElementById("footer-contact");
  if (footerContact && content.contact) {
    footerContact.innerHTML = `
      <li>${content.contact.email || ""}</li>
      <li>${content.contact.phone || ""}</li>
      <li>${content.contact.address || ""}</li>
    `;
  }

  const footerText = document.getElementById("footer-text");
  if (footerText && content.footer) footerText.textContent = content.footer.text || "";

  const copyright = document.getElementById("copyright");
  if (copyright) copyright.textContent = `© ${new Date().getFullYear()} ${siteName}. Tous droits réservés.`;

  // Lightbox events
  setupLightbox();
}

function setupLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;

  document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev")?.addEventListener("click", () => navigateLightbox(-1));
  document.getElementById("lightbox-next")?.addEventListener("click", () => navigateLightbox(1));

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

function openLightbox(items, index) {
  currentGallery = items;
  currentIndex = index;
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.add("active");
  document.body.style.overflow = "hidden";
  renderLightboxItem();
}

function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("active");
  document.body.style.overflow = "";
  const content = document.getElementById("lightbox-content");
  if (content) content.innerHTML = "";
}

function navigateLightbox(dir) {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
  renderLightboxItem();
}

function renderLightboxItem() {
  const item = currentGallery[currentIndex];
  const container = document.getElementById("lightbox-content");
  const caption = document.getElementById("lightbox-caption");
  if (!container || !item) return;

  if (item.type === "video") {
    if (item.isYoutube || (item.src && item.src.includes("youtube"))) {
      const src = item.src.includes("embed") ? item.src : item.src.replace("watch?v=", "embed/");
      container.innerHTML = `<iframe src="${src}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      container.innerHTML = `<video src="${item.src}" controls autoplay class="max-h-[85vh] rounded-lg"></video>`;
    }
  } else {
    container.innerHTML = `<img src="${item.src}" alt="${item.title || ""}" loading="eager">`;
  }

  if (caption) {
    caption.textContent = [item.title, item.description].filter(Boolean).join(" — ");
  }
}

// ========== HOME ==========
function renderHome() {
  const content = getContent();

  // Hero
  const heroTitle = document.getElementById("hero-title");
  const heroSub = document.getElementById("hero-subtitle");
  const heroDesc = document.getElementById("hero-description");
  const heroImg = document.getElementById("hero-image");
  if (heroTitle) heroTitle.textContent = content.hero.title;
  if (heroSub) heroSub.textContent = content.hero.subtitle;
  if (heroDesc) heroDesc.textContent = content.hero.description;
  if (heroImg && content.hero.image) heroImg.src = content.hero.image;

  // Stats — enrichir Joueurs / Catégories depuis l'effectif (dossiers)
  const statsGrid = document.getElementById("stats-grid");
  if (statsGrid) {
    let stats = (content.stats || []).map((s) => ({ ...s }));
    if (typeof getRosterStats === "function") {
      const rs = getRosterStats(content);
      let hasP = false, hasC = false;
      stats = stats.map((s) => {
        if (/joueur/i.test(s.label)) { hasP = true; return { ...s, value: String(rs.players) }; }
        if (/catégor/i.test(s.label)) { hasC = true; return { ...s, value: String(rs.categories) }; }
        return s;
      });
      if (!hasP) stats.unshift({ label: "Joueurs", value: String(rs.players) });
      if (!hasC) stats.splice(1, 0, { label: "Catégories", value: String(rs.categories) });
    }
    statsGrid.innerHTML = stats
      .map(
        (s) => `
      <div>
        <div class="text-3xl md:text-4xl font-display font-bold text-primary mb-1">${s.value}</div>
        <div class="text-gray-400 text-sm uppercase tracking-wider">${s.label}</div>
      </div>`
      )
      .join("");
  }

  // About
  const aboutTitle = document.getElementById("about-title");
  const aboutText = document.getElementById("about-text");
  const aboutImg = document.getElementById("about-image");
  if (aboutTitle) aboutTitle.textContent = content.about.title;
  if (aboutText) aboutText.textContent = content.about.text;
  if (aboutImg && content.about.image) aboutImg.src = content.about.image;

  // News preview
  const newsPreview = document.getElementById("news-preview");
  if (newsPreview && content.news) {
    newsPreview.innerHTML = content.news
      .slice(0, 3)
      .map(
        (n) => `
      <article class="news-card">
        <div class="aspect-video overflow-hidden">
          <img src="${n.image}" alt="${n.title}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <div class="p-5">
          <time class="text-xs text-primary font-medium">${formatDate(n.date)}</time>
          <h3 class="font-semibold text-lg mt-1 mb-2 line-clamp-2">${n.title}</h3>
          <p class="text-gray-400 text-sm line-clamp-2">${n.excerpt}</p>
        </div>
      </article>`
      )
      .join("");
  }

  // Gallery preview (album style)
  const galPreview = document.getElementById("gallery-preview");
  if (galPreview && content.gallery) {
    const items = content.gallery.slice(0, 8);
    galPreview.innerHTML = items
      .map(
        (g, i) => `
      <div class="album-item" data-index="${i}" onclick="openLightbox(getContent().gallery, ${i})">
        ${
          g.type === "video"
            ? `<div class="play-badge"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
               <img src="${g.thumb || g.src.replace("embed/", "hqdefault.jpg").replace("https://www.youtube.com/", "https://img.youtube.com/vi/").split("?")[0] + "/hqdefault.jpg" || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400"}" alt="${g.title}" loading="lazy">`
            : `<img src="${g.src}" alt="${g.title || ""}" loading="lazy">`
        }
        <div class="caption">${g.title || ""}</div>
      </div>`
      )
      .join("");
  }

  // CTA
  const ctaTitle = document.getElementById("cta-title");
  const ctaText = document.getElementById("cta-text");
  if (ctaTitle) ctaTitle.textContent = content.cta.title;
  if (ctaText) ctaText.textContent = content.cta.text;

  // Prochains événements
  if (typeof renderHomeEventsPreview === "function") renderHomeEventsPreview();
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ========== EQUIPE ==========
function renderTeam() {
  const content = getContent();
  const title = document.getElementById("page-title");
  const desc = document.getElementById("page-desc");
  if (title) title.textContent = content.team.title;
  if (desc) desc.textContent = content.team.description;

  const grid = document.getElementById("players-grid");
  if (grid && content.team.players) {
    grid.innerHTML = content.team.players
      .map(
        (p) => `
      <div class="player-card">
        <div class="aspect-square overflow-hidden relative">
          <img src="${p.photo}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy">
          ${p.number ? `<span class="absolute top-3 right-3 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-lg">${p.number}</span>` : ""}
        </div>
        <div class="p-4 text-center">
          <h3 class="font-semibold text-lg">${p.name}</h3>
          <p class="text-primary text-sm font-medium">${p.role}</p>
          ${p.bio ? `<p class="text-gray-400 text-sm mt-2">${p.bio}</p>` : ""}
        </div>
      </div>`
      )
      .join("");
  }
}

// ========== GALERIE ==========
function renderGallery() {
  const content = getContent();
  const grid = document.getElementById("gallery-full");
  if (!grid || !content.gallery) return;

  grid.classList.add("gallery-masonry");
  grid.classList.remove("album-grid");

  const sizes = ["size-sm", "size-md", "size-lg", "size-md", "size-sm", "size-lg"];
  grid.innerHTML = content.gallery
    .map((g, i) => {
      const sizeClass = g.size || sizes[i % sizes.length];
      return `
    <div class="album-item ${sizeClass}" onclick="openLightbox(getContent().gallery, ${i})">
      ${
        g.type === "video"
          ? `<div class="play-badge"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
             <img src="${getVideoThumb(g)}" alt="${g.title || ""}" loading="lazy">`
          : `<img src="${g.src}" alt="${g.title || ""}" loading="lazy" decoding="async">`
      }
      <div class="caption">${g.title || ""}</div>
    </div>`;
    })
    .join("");
}

function getVideoThumb(g) {
  if (g.thumb) return g.thumb;
  if (g.isYoutube || (g.src && g.src.includes("youtube"))) {
    let id = "";
    if (g.src.includes("embed/")) id = g.src.split("embed/")[1]?.split("?")[0];
    else if (g.src.includes("v=")) id = g.src.split("v=")[1]?.split("&")[0];
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=60";
}

// ========== ACTUALITES ==========
function renderNews() {
  const content = getContent();
  const list = document.getElementById("news-list");
  if (!list || !content.news) return;

  list.innerHTML = content.news
    .map(
      (n) => `
    <article class="news-card flex flex-col md:flex-row overflow-hidden">
      <div class="md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
        <img src="${n.image}" alt="${n.title}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <div class="p-6 md:w-3/5 flex flex-col justify-center">
        <time class="text-xs text-primary font-medium">${formatDate(n.date)}</time>
        <h2 class="font-display text-xl md:text-2xl font-bold mt-1 mb-3">${n.title}</h2>
        <p class="text-gray-300 leading-relaxed">${n.content || n.excerpt}</p>
      </div>
    </article>`
    )
    .join("");
}

// ========== CONTACT ==========
function renderContact() {
  const content = getContent();
  const c = content.contact || {};
  const box = document.getElementById("contact-info") || document.getElementById("contact-details");
  if (!box) return;
  box.innerHTML = `
    <div class="contact-icon-row mb-4">
      <div class="icon-wrap text-primary">${ICONS.contact}</div>
      <div><p class="text-xs text-gray-500 uppercase">Email</p><a class="text-white hover:text-primary" href="mailto:${c.email || ""}">${c.email || "—"}</a></div>
    </div>
    <div class="contact-icon-row mb-4">
      <div class="icon-wrap text-primary">${ICONS.phone}</div>
      <div><p class="text-xs text-gray-500 uppercase">Téléphone</p><a class="text-white hover:text-primary" href="tel:${(c.phone || "").replace(/\s/g, "")}">${c.phone || "—"}</a></div>
    </div>
    <div class="contact-icon-row mb-4">
      <div class="icon-wrap text-primary">${ICONS.map}</div>
      <div><p class="text-xs text-gray-500 uppercase">Adresse</p><p>${c.address || "—"}</p></div>
    </div>
    <div class="contact-icon-row">
      <div class="icon-wrap text-primary">${ICONS.clock}</div>
      <div><p class="text-xs text-gray-500 uppercase">Horaires</p><p>${c.hours || "—"}</p></div>
    </div>`;
}

// ========== PROGRAMME / EVENTS ==========

function renderProgramme() {
  const content = getContent();
  let currentFilter = "all";

  const list = document.getElementById("events-list");
  const resultsList = document.getElementById("results-list");

  function getReservedSeats(eventId) {
    return (content.reservations || [])
      .filter((r) => r.eventId === eventId && r.status !== "cancelled")
      .reduce((sum, r) => sum + (r.seats || 1), 0);
  }

  function renderEvents() {
    if (!list) return;
    const today = new Date().toISOString().slice(0, 10);
    let events = (content.events || []).slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    if (currentFilter !== "all") {
      events = events.filter((e) => e.type === currentFilter);
    }
    const upcoming = events.filter((e) => e.date >= today);
    const past = events.filter((e) => e.date < today);

    if (!events.length) {
      list.innerHTML = '<p class="text-center text-gray-500 py-12">Aucun événement pour ce filtre.</p>';
      return;
    }

    const renderCard = (e, isPast) => {
      const reserved = getReservedSeats(e.id);
      const remaining = e.capacity ? Math.max(0, e.capacity - reserved) : null;
      const typeClass = TYPE_COLORS[e.type] || TYPE_COLORS.autre;
      const typeLabel = TYPE_LABELS[e.type] || e.type;
      return `
        <article class="bg-gray-900/60 border border-white/8 rounded-2xl p-5 ${isPast ? "opacity-60" : ""}">
          <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${typeClass}">${typeLabel}</span>
              ${e.category ? `<span class="text-xs text-gray-400">${e.category}</span>` : ""}
              ${isPast ? '<span class="text-xs text-gray-500">Passé</span>' : ""}
            </div>
            <div class="text-right text-sm">
              <div class="font-semibold">${formatDate(e.date)}</div>
              <div class="text-gray-400">${e.time}${e.endTime ? " – " + e.endTime : ""}</div>
            </div>
          </div>
          <h3 class="font-semibold text-lg mb-1">${e.title}</h3>
          ${e.opponent ? `<p class="text-sm text-gray-400 mb-2">${e.home ? "vs" : "@"} ${e.opponent}</p>` : ""}
          <p class="text-gray-400 text-sm mb-3">${e.description || ""}</p>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-gray-500 flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              ${e.location || ""}
            </p>
            ${
              false && e.bookable && !isPast
                ? `<button onclick="openReserveModal(${e.id})" class="btn-primary text-sm px-4 py-2 rounded-full font-medium ${remaining === 0 ? "opacity-50 cursor-not-allowed" : ""}" ${remaining === 0 ? "disabled" : ""}>
                    ${remaining === 0 ? "Complet" : `Réserver${remaining != null ? ` (${remaining} places)` : ""}`}
                   </button>`
                : ""
            }
          </div>
        </article>`;
    };

    list.innerHTML =
      (upcoming.length
        ? upcoming.map((e) => renderCard(e, false)).join("")
        : '<p class="text-center text-gray-500 py-6">Aucun événement à venir.</p>') +
      (past.length
        ? '<h3 class="text-sm uppercase tracking-wider text-gray-500 mt-10 mb-4">Événements passés</h3>' +
          past.map((e) => renderCard(e, true)).join("")
        : "");
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active", "bg-primary", "text-white");
        b.classList.add("bg-white/10");
      });
      btn.classList.add("active", "bg-primary", "text-white");
      btn.classList.remove("bg-white/10");
      currentFilter = btn.dataset.filter;
      renderEvents();
    });
  });

  renderEvents();

  if (resultsList && content.results) {
    resultsList.innerHTML = content.results
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((r) => {
        const us = r.home ? r.scoreHome : r.scoreAway;
        const them = r.home ? r.scoreAway : r.scoreHome;
        const result = us > them ? "V" : us < them ? "D" : "N";
        const resultColor = result === "V" ? "text-green-400" : result === "D" ? "text-red-400" : "text-gray-400";
        return `
          <div class="flex items-center justify-between bg-gray-900/50 border border-white/5 rounded-xl px-4 py-3">
            <div class="flex items-center gap-3">
              <span class="font-display font-bold text-lg w-8 ${resultColor}">${result}</span>
              <div>
                <p class="font-medium">${r.home ? "TANA CITY" : r.opponent} ${r.scoreHome} – ${r.scoreAway} ${r.home ? r.opponent : "TANA CITY"}</p>
                <p class="text-xs text-gray-500">${formatDate(r.date)} · ${r.competition || ""}</p>
              </div>
            </div>
          </div>`;
      })
      .join("");
  }

  setupReserveModal();
}

function setupReserveModal() {
  const modal = document.getElementById("reserve-modal");
  if (!modal) return;

  document.getElementById("reserve-close")?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });

  document.getElementById("reserve-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventId = +document.getElementById("reserve-event-id").value;
    const reservation = {
      id: Date.now(),
      eventId,
      name: document.getElementById("reserve-name").value.trim(),
      email: document.getElementById("reserve-email").value.trim(),
      phone: document.getElementById("reserve-phone").value.trim(),
      seats: +document.getElementById("reserve-seats").value || 1,
      message: document.getElementById("reserve-message").value.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const result = await saveReservation(reservation);
    if (!result.ok) {
      alert("Erreur lors de la réservation : " + (result.error || "réessayez"));
      return;
    }
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.getElementById("reserve-form").reset();
    alert("Réservation enregistrée ! Le club vous contactera pour confirmation.");
    location.reload();
  });
}

function openReserveModal(eventId) {
  const content = getContent();
  const event = (content.events || []).find((e) => e.id === eventId);
  if (!event) return;
  document.getElementById("reserve-event-id").value = eventId;
  document.getElementById("reserve-event-title").textContent = event.title + " — " + formatDate(event.date) + " à " + event.time;
  const modal = document.getElementById("reserve-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

window.openReserveModal = openReserveModal;

function renderHomeEventsPreview() {
  const container = document.getElementById("events-preview");
  if (!container) return;
  const content = getContent();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = (content.events || [])
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 3);
  if (!upcoming.length) {
    container.innerHTML = '<p class="text-gray-500 text-center col-span-full">Aucun événement à venir.</p>';
    return;
  }
  container.innerHTML = upcoming
    .map((e) => {
      const typeLabel = TYPE_LABELS[e.type] || e.type;
      const typeClass = TYPE_COLORS[e.type] || TYPE_COLORS.autre;
      return `
        <a href="programme.html" class="block bg-gray-900/50 border border-white/5 rounded-xl p-4 hover:border-primary/40 transition-colors">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full border ${typeClass}">${typeLabel}</span>
            <span class="text-xs text-gray-400">${formatDate(e.date)} · ${e.time}</span>
          </div>
          <h3 class="font-semibold">${e.title}</h3>
          <p class="text-sm text-gray-500 mt-1">${e.location || ""}</p>
        </a>`;
    })
    .join("");
}
