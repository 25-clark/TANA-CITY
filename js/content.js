// Contenu par défaut du site - modifiable via l'admin
const DEFAULT_CONTENT = {
  site: {
    name: "TANA CITY",
    logo: "assets/logo.png",
    primaryColor: "#16a34a",
    secondaryColor: "#0f172a",
    accentColor: "#22c55e",
  },
  hero: {
    title: "TANA CITY",
    subtitle: "Club de football",
    description: "Formation, compétition et esprit de club. Un projet sportif structuré pour les jeunes et les seniors à Antananarivo.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80&fm=webp",
  },
  about: {
    title: "Le club",
    text: "TANA CITY développe le football de formation et de compétition dans un cadre exigeant et bienveillant. Nos éducateurs accompagnent chaque joueur dans sa progression technique, physique et humaine. Le club s'appuie sur le respect, le fair-play et la régularité des entraînements.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80&fm=webp",
  },
  stats: [
    { label: "Joueurs", value: "0" },
    { label: "Catégories", value: "0" },
    { label: "Séances / semaine", value: "—" },
    { label: "Saison", value: "2025-26" },
  ],
  cta: {
    title: "Rejoindre TANA CITY",
    text: "Les inscriptions sont ouvertes selon les places disponibles. Déposez une demande en ligne ; le club vous recontactera pour la suite.",
  },
  contact: {
    email: "contact@tanacity.mg",
    phone: "+261 00 00 000 00",
    address: "Antananarivo, Madagascar",
    hours: "Entraînements : selon planning (voir Programme)",
  },
  social: {
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  },
  footer: {
    text: "TANA CITY — Club de football. Formation et compétition.",
  },
  paymentInfo: {
    receiverName: "Trésorerie TANA CITY",
    mvola: "",
    orangeMoney: "",
    especesNote: "Paiement en espèces possible au club, sur rendez-vous.",
    instructions: "Réglez la cotisation via MVola ou Orange Money aux coordonnées indiquées, ou en espèces au club. Indiquez éventuellement le numéro de transaction si le paiement a déjà été effectué.",
  },
  monthlyPayments: [],
  roster: [],
  team: {
    title: "Effectif senior",
    description: "Joueurs mis en avant sur la page Équipe. L'effectif complet par catégorie est géré dans l'administration (dossiers).",
    players: [],
  },
  news: [
    {
      id: 1,
      title: "Ouverture des inscriptions",
      excerpt: "Les demandes d'inscription pour la saison en cours sont reçues via le formulaire en ligne.",
      date: "2025-09-01",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80&fm=webp",
      content: "Les familles peuvent déposer une demande d'inscription sur le site. Après examen du dossier, le club confirme la place, les horaires de catégorie et les modalités de cotisation.",
    },
  ],
  gallery: [
    {
      id: 1,
      type: "image",
      src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&fm=webp",
      title: "Entraînement",
      description: "",
      size: "lg",
    },
    {
      id: 2,
      type: "image",
      src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80&fm=webp",
      title: "Match",
      description: "",
      size: "md",
    },
    {
      id: 3,
      type: "image",
      src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80&fm=webp",
      title: "Club",
      description: "",
      size: "sm",
    },
  ],
  events: [
    {
      id: 1,
      title: "Entraînement U13 / U15",
      type: "entrainement",
      date: "2025-10-10",
      time: "17:00",
      endTime: "18:30",
      location: "Terrain du club",
      description: "Séance technique et physique. Présence obligatoire pour les licenciés convoqués.",
      bookable: false,
      capacity: null,
      category: "U13-U15",
    },
    {
      id: 2,
      title: "Match amical",
      type: "match",
      date: "2025-10-18",
      time: "15:00",
      endTime: "17:00",
      location: "À confirmer",
      description: "Rencontre amicale. Composition et lieu communiqués aux familles concernées.",
      bookable: false,
      opponent: "À confirmer",
      home: true,
      category: "Senior",
    },
  ],
  results: [],
  reservations: [],
  sponsors: [],
};


const STORAGE_KEY = "fc_club_content_v2";
const ADMIN_PASS_KEY = "fc_admin_auth";

let _contentCache = null;
let _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;
  if (typeof supabase === "undefined" || !isSupabaseConfigured()) return null;
  _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _supabase;
}

/** Fusionne profondément les tableaux/objets utiles avec les défauts */
function mergeContent(stored) {
  const base = structuredClone(DEFAULT_CONTENT);
  if (!stored || typeof stored !== "object") return base;
  const merged = { ...base, ...stored };
  // Garder les sous-objets
  merged.site = { ...base.site, ...(stored.site || {}) };
  merged.hero = { ...base.hero, ...(stored.hero || {}) };
  merged.about = { ...base.about, ...(stored.about || {}) };
  merged.cta = { ...base.cta, ...(stored.cta || {}) };
  merged.contact = { ...base.contact, ...(stored.contact || {}) };
  merged.footer = { ...base.footer, ...(stored.footer || {}) };
  merged.team = { ...base.team, ...(stored.team || {}) };
  if (stored.team && stored.team.players) merged.team.players = stored.team.players;
  if (stored.stats) merged.stats = stored.stats;
  if (stored.news) merged.news = stored.news;
  if (stored.gallery) merged.gallery = stored.gallery;
  if (stored.events) merged.events = stored.events;
  if (stored.results) merged.results = stored.results;
  if (stored.reservations) merged.reservations = stored.reservations;
  if (stored.sponsors) merged.sponsors = stored.sponsors;
  if (stored.roster) merged.roster = stored.roster;
  if (stored.monthlyPayments) merged.monthlyPayments = stored.monthlyPayments;
  merged.paymentInfo = { ...base.paymentInfo, ...(stored.paymentInfo || {}) };
  return merged;
}

/**
 * Charge le contenu (Supabase si configuré, sinon localStorage).
 * À appeler avec await au chargement de chaque page.
 */
async function loadContent(force = false) {
  if (_contentCache && !force) return _contentCache;

  // 1) Supabase
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from("site_content")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      if (data && data.data) {
        _contentCache = mergeContent(data.data);
        // Charger aussi les réservations depuis la table dédiée
        try {
          const { data: res } = await client
            .from("reservations")
            .select("*")
            .order("created_at", { ascending: false });
          if (res) {
            _contentCache.reservations = res.map((r) => ({
              id: r.id,
              eventId: r.event_id,
              name: r.name,
              email: r.email,
              phone: r.phone || "",
              seats: r.seats || 1,
              message: r.message || "",
              status: r.status || "pending",
              createdAt: r.created_at,
            }));
          }
        } catch (e) {
          console.warn("Réservations:", e);
        }
        return _contentCache;
      }
      // Ligne absente : on initialise avec les défauts
      _contentCache = structuredClone(DEFAULT_CONTENT);
      return _contentCache;
    } catch (e) {
      console.warn("Supabase lecture impossible, fallback local:", e);
    }
  }

  // 2) localStorage fallback
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      _contentCache = mergeContent(JSON.parse(stored));
      return _contentCache;
    }
  } catch (e) {
    console.warn("localStorage:", e);
  }

  _contentCache = structuredClone(DEFAULT_CONTENT);
  return _contentCache;
}

/** Lecture synchrone du cache (après loadContent) */
function getContent() {
  return _contentCache || structuredClone(DEFAULT_CONTENT);
}

/**
 * Sauvegarde le contenu.
 * - Supabase si connecté en admin (session auth)
 * - sinon localStorage
 */
async function saveContent(content) {
  _contentCache = content;

  const client = getSupabase();
  if (client) {
    try {
      // Ne pas envoyer les réservations dans le JSON global (table séparée)
      const toSave = { ...content };
      delete toSave.reservations;

      const { error } = await client.from("site_content").upsert({
        id: 1,
        data: toSave,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      // Miroir local pour perf
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (_) {}
      return true;
    } catch (e) {
      console.error("Erreur sauvegarde Supabase:", e);
      alert(
        "Erreur de sauvegarde cloud : " +
          (e.message || e) +
          "\n\nVérifie que tu es connecté en admin et que les politiques RLS sont correctes."
      );
      return false;
    }
  }

  // localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    return true;
  } catch (e) {
    console.error("Erreur sauvegarde", e);
    alert("Erreur de sauvegarde (quota localStorage ?). Essayez de réduire la taille des images.");
    return false;
  }
}

async function resetContent() {
  const fresh = structuredClone(DEFAULT_CONTENT);
  _contentCache = fresh;
  localStorage.removeItem(STORAGE_KEY);
  const client = getSupabase();
  if (client) {
    try {
      await client.from("site_content").upsert({
        id: 1,
        data: fresh,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn(e);
    }
  }
  return fresh;
}

/** Enregistre une réservation (public OK) */
async function saveReservation(reservation) {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from("reservations")
        .insert({
          event_id: reservation.eventId,
          name: reservation.name,
          email: reservation.email,
          phone: reservation.phone || null,
          seats: reservation.seats || 1,
          message: reservation.message || null,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      return { ok: true, id: data.id };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e.message || String(e) };
    }
  }
  // Fallback local
  const content = getContent();
  content.reservations = content.reservations || [];
  content.reservations.push(reservation);
  await saveContent(content);
  return { ok: true, id: reservation.id };
}

async function updateReservationStatus(id, status) {
  const client = getSupabase();
  if (client) {
    const { error } = await client.from("reservations").update({ status }).eq("id", id);
    if (error) throw error;
    return true;
  }
  const content = getContent();
  const r = (content.reservations || []).find((x) => x.id === id);
  if (r) r.status = status;
  await saveContent(content);
  return true;
}

async function deleteReservationDb(id) {
  const client = getSupabase();
  if (client) {
    const { error } = await client.from("reservations").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  const content = getContent();
  content.reservations = (content.reservations || []).filter((x) => x.id !== id);
  await saveContent(content);
  return true;
}


/** Inscriptions (registre joueurs / enfants) — table séparée */
async function loadInscriptions() {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from("inscriptions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapInscriptionRow);
    } catch (e) {
      console.warn("inscriptions load:", e);
      return getLocalInscriptions();
    }
  }
  return getLocalInscriptions();
}

function mapInscriptionRow(r) {
  return {
    id: r.id,
    firstName: r.first_name,
    lastName: r.last_name,
    birthDate: r.birth_date,
    gender: r.gender || "",
    category: r.category || "",
    parentName: r.parent_name || "",
    parentPhone: r.parent_phone || "",
    parentEmail: r.parent_email || "",
    address: r.address || "",
    medicalNotes: r.medical_notes || "",
      photoUrl: r.photo_url || "",
    paymentStatus: r.payment_status || "unpaid",
    paymentAmount: r.payment_amount != null ? Number(r.payment_amount) : 0,
    paymentMethod: r.payment_method || "",
    paymentRef: r.payment_ref || "",
    paymentDate: r.payment_date || "",
    status: r.status || "pending",
    notes: r.notes || "",
    createdAt: r.created_at,
  };
}

function getLocalInscriptions() {
  try {
    return JSON.parse(localStorage.getItem("fc_inscriptions_v1") || "[]");
  } catch {
    return [];
  }
}

function setLocalInscriptions(list) {
  localStorage.setItem("fc_inscriptions_v1", JSON.stringify(list));
}

async function saveInscription(ins) {
  const client = getSupabase();
  if (client) {
    try {
      const row = {
        first_name: ins.firstName,
        last_name: ins.lastName,
        birth_date: ins.birthDate || null,
        gender: ins.gender || null,
        category: ins.category || null,
        parent_name: ins.parentName || null,
        parent_phone: ins.parentPhone || null,
        parent_email: ins.parentEmail || null,
        address: ins.address || null,
        medical_notes: ins.medicalNotes || null,
        photo_url: ins.photoUrl || null,
        payment_status: ins.paymentStatus || "unpaid",
        payment_amount: ins.paymentAmount || 0,
        payment_method: ins.paymentMethod || null,
        payment_ref: ins.paymentRef || null,
        status: ins.status || "pending",
        notes: ins.notes || null,
      };
      const { data, error } = await client.from("inscriptions").insert(row).select().single();
      if (error) throw error;
      return { ok: true, id: data.id };
    } catch (e) {
      console.error(e);
      return { ok: false, error: e.message || String(e) };
    }
  }
  const list = getLocalInscriptions();
  ins.id = Date.now();
  ins.createdAt = new Date().toISOString();
  list.unshift(ins);
  setLocalInscriptions(list);
  return { ok: true, id: ins.id };
}

async function updateInscription(id, patch) {
  const client = getSupabase();
  if (client) {
    const row = {};
    if (patch.paymentStatus != null) row.payment_status = patch.paymentStatus;
    if (patch.paymentAmount != null) row.payment_amount = patch.paymentAmount;
    if (patch.paymentMethod != null) row.payment_method = patch.paymentMethod;
    if (patch.paymentRef != null) row.payment_ref = patch.paymentRef;
    if (patch.paymentDate != null) row.payment_date = patch.paymentDate;
    if (patch.status != null) row.status = patch.status;
    if (patch.notes != null) row.notes = patch.notes;
    if (patch.category != null) row.category = patch.category;
    const { error } = await client.from("inscriptions").update(row).eq("id", id);
    if (error) throw error;
    return true;
  }
  const list = getLocalInscriptions().map((x) => (x.id === id ? { ...x, ...patch } : x));
  setLocalInscriptions(list);
  return true;
}

async function deleteInscription(id) {
  const client = getSupabase();
  if (client) {
    const { error } = await client.from("inscriptions").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
  setLocalInscriptions(getLocalInscriptions().filter((x) => x.id !== id));
  return true;
}


function getRosterStats(content) {
  const roster = content.roster || [];
  const cats = new Set(roster.map((p) => p.category).filter(Boolean));
  return {
    players: roster.length,
    categories: cats.size,
    byCategory: [...cats].sort().map((c) => ({
      category: c,
      count: roster.filter((p) => p.category === c).length,
    })),
  };
}

function applyTheme(content) {
  const root = document.documentElement;
  if (content.site.primaryColor) root.style.setProperty("--color-primary", content.site.primaryColor);
  if (content.site.accentColor) root.style.setProperty("--color-accent", content.site.accentColor);
  if (content.site.secondaryColor) root.style.setProperty("--color-secondary", content.site.secondaryColor);
}
