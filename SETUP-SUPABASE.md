# Configurer Supabase — pour que tout le monde voie les modifications

Sans cette config, le site fonctionne en **mode local** (chaque navigateur a ses propres données).  
Avec Supabase, **tous les visiteurs** voient le même contenu, et l’admin enregistre dans le cloud.

---

## Étape 1 — Créer un compte Supabase (gratuit)

1. Va sur [https://supabase.com](https://supabase.com)
2. **Start your project** → connexion GitHub ou email
3. **New project**
   - Name : `tana-city` (ou autre)
   - Database password : **note-le** (fort)
   - Region : la plus proche (ex. Frankfurt / Singapore)
4. Attends ~2 minutes que le projet soit prêt

---

## Étape 2 — Créer les tables (SQL)

1. Dans le menu gauche : **SQL Editor** → **New query**
2. Colle **tout** le script ci-dessous → **Run**

```sql
-- Contenu global du site (1 seule ligne JSON)
create table if not exists site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into site_content (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Réservations (insert public autorisé)
create table if not exists reservations (
  id bigint generated always as identity primary key,
  event_id bigint,
  name text not null,
  email text not null,
  phone text,
  seats int default 1,
  message text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Sécurité (RLS)
alter table site_content enable row level security;
alter table reservations enable row level security;

-- Lecture publique du contenu
drop policy if exists "public_read_content" on site_content;
create policy "public_read_content"
  on site_content for select
  using (true);

-- Écriture contenu : uniquement utilisateurs connectés (admin)
drop policy if exists "auth_write_content" on site_content;
create policy "auth_write_content"
  on site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Réservations : tout le monde peut lire et créer
drop policy if exists "public_read_reservations" on reservations;
create policy "public_read_reservations"
  on reservations for select using (true);

drop policy if exists "public_insert_reservations" on reservations;
create policy "public_insert_reservations"
  on reservations for insert with check (true);

-- Admin peut modifier / supprimer les réservations
drop policy if exists "auth_update_reservations" on reservations;
create policy "auth_update_reservations"
  on reservations for update
  using (auth.role() = 'authenticated');

drop policy if exists "auth_delete_reservations" on reservations;
create policy "auth_delete_reservations"
  on reservations for delete
  using (auth.role() = 'authenticated');
```

Tu dois voir **Success**.

---

## Étape 3 — Créer le compte admin

1. Menu **Authentication** → **Users** → **Add user** → **Create new user**
2. Email : par ex. `admin@tanacity.mg` (celui que tu utiliseras pour te connecter)
3. Password : par ex. `L0c4l@dmin` (ou un mot de passe plus fort)
4. Coche **Auto Confirm User**
5. **Create user**

---

## Étape 4 — Récupérer URL + clé

1. Menu **Project Settings** (engrenage) → **API**
2. Copie :
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public** key (longue chaîne qui commence par `eyJ...`)

---

## Étape 5 — Coller dans le projet

Ouvre le fichier `js/config.js` et remplis :

```js
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Enregistre le fichier.

---

## Étape 6 — Déployer (Git + Vercel)

```bash
cd TANA-CITY   # ou club-vitrine
git add .
git commit -m "Connect Supabase for shared content"
git push origin main
```

Vercel redéploie automatiquement.

---

## Étape 7 — Première connexion admin

1. Ouvre `https://ton-site.vercel.app/admin.html`
2. Email + mot de passe du compte créé à l’étape 3
3. Modifie le contenu → **Enregistrer**
4. Ouvre le site en navigation privée (ou un autre appareil) → les changements doivent apparaître

Le bandeau sous le formulaire de login indique :
- **Mode cloud (Supabase)** si la config est bonne
- **Mode local** sinon

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Mode local » après config | Vérifie URL/clé dans `config.js`, pas d’espace, puis redéploie |
| Erreur RLS / permission denied | Relance le script SQL de l’étape 2 |
| Login échoue | User bien créé + Auto Confirm dans Authentication |
| Réservation OK mais pas visible admin | Recharge la page admin après login |
| Images trop lourdes (base64) | Préfère des URLs (Cloudinary, Imgur…) plutôt que l’upload base64 |

---

## Sécurité

- La clé **anon** est publique (normale pour un site front)
- Seul un utilisateur **Authentication** peut modifier `site_content`
- Les visiteurs peuvent seulement **lire** le contenu et **créer** des réservations
'''
