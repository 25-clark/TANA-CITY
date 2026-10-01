# TANA CITY — Site vitrine du club

Site web administrable pour le club de football **TANA CITY**.

## Fonctionnalités

- Pages : Accueil, Équipe, Programme, Galerie, Actualités, Contact
- Programme : entraînements, matchs, tournois, réunions + filtres
- Réservations en ligne sur les événements « réservables »
- Résultats de matchs
- Galerie type album + lightbox (images & vidéos)
- Admin protégé par mot de passe (page `/admin.html`, non listée dans le menu)

## Déploiement recommandé : GitHub + Vercel

### 1. Créer le dépôt GitHub

1. Va sur [github.com/new](https://github.com/new)
2. Nom du repo : par ex. `tana-city-site` (public ou privé)
3. **Ne coche pas** “Add a README” (le projet en a déjà un)
4. Clique **Create repository**

### 2. Pousser le code

Sur ton ordinateur, dans le dossier du projet :

```bash
cd club-vitrine
git init
git add .
git commit -m "Initial commit — TANA CITY site"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/tana-city-site.git
git push -u origin main
```

(Remplace `TON_USERNAME` et `tana-city-site` par ton compte et le nom du repo.)

### 3. Connecter Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. **Import** le dépôt GitHub `tana-city-site`
3. Laisse les réglages par défaut (Framework : Other / static)
4. Clique **Deploy**

À chaque `git push` sur `main`, Vercel redéploie automatiquement.

### Admin

- URL : `https://ton-projet.vercel.app/admin.html`
- Mot de passe : défini dans `js/admin.js` (`ADMIN_PASSWORD`)
- Aucun lien Admin n’apparaît sur le site public

### Modifications locales puis mise en ligne

```bash
# 1. Modifier les fichiers
# 2. Commit + push
git add .
git commit -m "Description du changement"
git push
# Vercel déploie tout seul en ~30 s
```

## Structure

```
club-vitrine/
├── index.html
├── equipe.html
├── programme.html
├── galerie.html
├── actualites.html
├── contact.html
├── admin.html          ← accès direct uniquement
├── css/style.css
├── js/
│   ├── config.js       # clés Supabase
│   ├── content.js      # contenu + Supabase / localStorage
│   ├── app.js          # site public
│   └── admin.js        # panneau admin
└── README.md
```

## Notes

- **Partage global** : configure Supabase (voir `SETUP-SUPABASE.md`) pour que tous les visiteurs voient les mêmes données.
- Sans Supabase : mode local (localStorage) uniquement.
- Images : privilégier des URLs WebP ; l’upload admin convertit en WebP/JPEG optimisé.
