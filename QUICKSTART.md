# 🚀 Quick Start - 5 Minutes pour Démarrer!

## Checklist Rapide

### ✅ 1. Créer l'app Spotify (2 minutes)

1. Allez sur: https://developer.spotify.com/dashboard
2. Cliquez sur "Create app"
3. Nom: `Spotify Vinyl Player`
4. Redirect URI: `http://localhost:3000/callback` ⚠️ IMPORTANT
5. Cochez "Web API"
6. Copiez votre **Client ID**

### ✅ 2. Configurer le projet (1 minute)

Créez le fichier `.env` à la racine du projet:

```bash
VITE_SPOTIFY_CLIENT_ID=VOTRE_CLIENT_ID_ICI
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### ✅ 3. Installer et lancer (2 minutes)

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

### ✅ 4. Se connecter

1. Cliquez sur "Connect with Spotify"
2. Autorisez l'application
3. Lancez une chanson sur Spotify
4. Profitez! 🎵

---

## 📌 Points Importants

- ⭐ **Spotify Premium requis** pour contrôler la lecture
- 🔄 **Synchronisation automatique** toutes les 2 secondes
- 🎨 **Style mignon** avec esthétique bullet journal
- 💿 **Vinyle animé** qui tourne avec votre musique

---

Pour plus de détails, consultez [SETUP_GUIDE.md](./SETUP_GUIDE.md)

