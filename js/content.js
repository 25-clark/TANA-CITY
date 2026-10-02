// Contenu par défaut du site - modifiable via l'admin
const DEFAULT_CONTENT = {
  site: {
    name: "TANA CITY",
    logo: "assets/logo.png", // logo TANA CITY
    primaryColor: "#16a34a",
    secondaryColor: "#0f172a",
    accentColor: "#22c55e",
  },
  hero: {
    title: "TANA CITY",
    subtitle: "Bienvenue au",
    description: "Passion, esprit d'équipe et performance. Rejoignez-nous pour vivre le football autrement.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80&fm=webp",
  },
  about: {
    title: "Notre Club",
    text: "Fondé avec passion, notre club regroupe des joueurs de tous âges unis par l'amour du ballon rond. Nous cultivons les valeurs du sport : respect, fair-play et dépassement de soi. Que vous soyez joueur, supporter ou bénévole, il y a une place pour vous.",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80&fm=webp",
  },
  stats: [
    { label: "Joueurs", value: "120+" },
    { label: "Titres", value: "15" },
    { label: "Années", value: "25" },
    { label: "Équipes", value: "8" },
  ],
  cta: {
    title: "Rejoignez-nous !",
    text: "Venez vivre la passion du football avec nous. Inscriptions ouvertes pour toutes les catégories.",
  },
  contact: {
    email: "contact@tanacity.mg",
    phone: "01 23 45 67 89",
    address: "Stade Municipal, 123 Rue du Sport, 75000 Paris",
    hours: "Lun-Ven 18h-21h | Sam 9h-12h",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://x.com",
    youtube: "https://youtube.com",
  },
  footer: {
    text: "TANA CITY — Passion, discipline et esprit d'équipe.",
  },
  // Infos paiement cotisation (affichées à l'inscription)
  paymentInfo: {
    receiverName: "Trésorier TANA CITY",
    mvola: "034 00 000 00",
    orangeMoney: "032 00 000 00",
    especesNote: "Au club-house pendant les horaires d'ouverture",
    instructions: "Envoyez la cotisation au nom et numéro indiqués, puis notez éventuellement le n° de transaction ci-dessous.",
  },
  // Effectif complet par catégorie (dossiers) — distinct de l'Équipe (grands joueurs)
  monthlyPayments: [],
  roster: [
    { id: 1, firstName: "Jean", lastName: "Rakoto", category: "U13", gender: "M", birthDate: "2013-05-10", photo: "", number: "7" },
    { id: 2, firstName: "Marie", lastName: "Raso", category: "U15", gender: "F", birthDate: "2011-08-22", photo: "", number: "10" },
    { id: 3, firstName: "Paul", lastName: "Andry", category: "Senior", gender: "M", birthDate: "1998-01-15", photo: "", number: "9" },
  ],
  team: {
    title: "Notre Équipe",
    description: "Découvrez les joueurs et le staff qui font briller le club.",
    players: [
      { name: "Lucas Martin", role: "Gardien", number: "1", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80", bio: "Capitaine, 5 saisons au club." },
      { name: "Amine Benali", role: "Défenseur", number: "4", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80", bio: "Solide et expérimenté." },
      { name: "Thomas Dubois", role: "Milieu", number: "8", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80", bio: "Maître du milieu de terrain." },
      { name: "Karim Said", role: "Attaquant", number: "9", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80", bio: "Buteur star de l'équipe." },
      { name: "Sophie Leroy", role: "Entraîneur", number: "", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&q=80", bio: "Diplômée UEFA B." },
      { name: "Marc Petit", role: "Président", number: "", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80", bio: "À la tête du club depuis 2015." },
    ],
  },
  news: [
    {
      id: 1,
      title: "Victoire éclatante 3-1 contre les Rivaux",
      excerpt: "Une prestation solide de toute l'équipe a permis de décrocher les 3 points face à notre rival historique.",
      date: "2025-03-15",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80&fm=webp",
      content: "Ce samedi après-midi restera dans les annales. Face à un adversaire déterminé, nos joueurs ont su imposer leur rythme dès les premières minutes. Le premier but signé Karim Said à la 23e minute a libéré l'équipe. Un doublé de Thomas Dubois en seconde période a scellé le score. Bravo à tous !",
    },
    {
      id: 2,
      title: "Ouverture des inscriptions U13 / U15",
      excerpt: "Les inscriptions pour la saison 2025-2026 sont ouvertes. Places limitées !",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80&fm=webp",
      content: "Chers parents et jeunes footballeurs, le club ouvre officiellement les inscriptions pour les catégories U13 et U15. Venez nous rencontrer lors de la journée portes ouvertes le 22 mars. Équipement fourni, entraînements 2 fois par semaine.",
    },
    {
      id: 3,
      title: "Tournoi de printemps - Appel aux bénévoles",
      excerpt: "Le grand tournoi annuel approche. Nous avons besoin de vous !",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80&fm=webp",
      content: "Comme chaque année, le tournoi de printemps rassemblera plus de 30 équipes. Bénévoles recherchés pour l'organisation, l'accueil, le bar et les stands. Contactez-nous si vous souhaitez donner un coup de main.",
    },
  ],
  gallery: [
    { id: 1, type: "image", src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80&fm=webp", title: "Match de championnat", description: "Ambiance électrique au stade" },
    { id: 2, type: "image", src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80&fm=webp", title: "Célébration", description: "La joie après le but" },
    { id: 3, type: "image", src: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80&fm=webp", title: "Entraînement", description: "Préparation intensive" },
    { id: 4, type: "image", src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80&fm=webp", title: "Jeunes pousses", description: "L'avenir du club" },
    { id: 5, type: "image", src: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80&fm=webp", title: "Stade plein", description: "Supporters en feu" },
    { id: 6, type: "video", src: "https://www.youtube.com/embed/ScMzIvxBSi4", title: "Highlights du match", description: "Résumé vidéo de la dernière rencontre", isYoutube: true },
    { id: 7, type: "image", src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80&fm=webp", title: "Trophée", description: "Notre dernière coupe" },
    { id: 8, type: "image", src: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80&fm=webp", title: "Esprit d'équipe", description: "Tous ensemble" },
  ],
  // Programmes : entraînements, matchs, événements
  events: [
    {
      id: 1,
      title: "Entraînement Senior",
      type: "entrainement",
      date: "2026-10-03",
      time: "19:00",
      endTime: "21:00",
      location: "Stade Municipal - Terrain 1",
      description: "Séance technique + tactique. Présence obligatoire.",
      bookable: false,
      capacity: 25,
      category: "Senior",
    },
    {
      id: 2,
      title: "Match amical vs AS Rivale",
      type: "match",
      date: "2026-10-05",
      time: "15:00",
      endTime: "17:00",
      location: "Stade Municipal",
      description: "Match amical de préparation. Entrée libre pour les supporters.",
      bookable: false,
      opponent: "AS Rivale",
      home: true,
      category: "Senior",
    },
    {
      id: 3,
      title: "Entraînement U15",
      type: "entrainement",
      date: "2026-10-04",
      time: "10:00",
      endTime: "12:00",
      location: "Terrain annexe",
      description: "Travail physique et technique pour les U15.",
      bookable: false,
      capacity: 18,
      category: "U15",
    },
    {
      id: 4,
      title: "Tournoi de printemps - Journée 1",
      type: "tournoi",
      date: "2026-10-12",
      time: "09:00",
      endTime: "18:00",
      location: "Complexe sportif",
      description: "Première journée du tournoi annuel. Restauration sur place.",
      bookable: false,
      capacity: 200,
      category: "Tous",
    },
    {
      id: 5,
      title: "Assemblée générale",
      type: "reunion",
      date: "2026-10-20",
      time: "20:00",
      endTime: "22:00",
      location: "Salle club-house",
      description: "Assemblée générale ordinaire. Ordre du jour disponible au club.",
      bookable: false,
      category: "Direction",
    },
    {
      id: 6,
      title: "Match championnat - Journée 8",
      type: "match",
      date: "2026-10-11",
      time: "15:00",
      endTime: "17:00",
      location: "Stade adverse - Ville Voisine",
      description: "Déplacement. Rendez-vous parking club à 13h30.",
      bookable: false,
      opponent: "FC Ville Voisine",
      home: false,
      category: "Senior",
    },
  ],
  // Résultats de matchs
  results: [
    { id: 1, date: "2026-09-28", opponent: "AS Rivale", scoreHome: 3, scoreAway: 1, home: true, competition: "Championnat" },
    { id: 2, date: "2026-09-21", opponent: "US Nord", scoreHome: 1, scoreAway: 1, home: false, competition: "Championnat" },
    { id: 3, date: "2026-09-14", opponent: "Olympique Sud", scoreHome: 2, scoreAway: 0, home: true, competition: "Coupe" },
  ],
  // Réservations (stockées localement)
  reservations: [],
  // Sponsors
  sponsors: [
    { name: "SportShop", logo: "", url: "https://example.com", description: "Équipementier officiel" },
    { name: "Banque Locale", logo: "", url: "https://example.com", description: "Partenaire financier" },
    { name: "Café du Stade", logo: "", url: "https://example.com", description: "Restauration" },
  ],
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
