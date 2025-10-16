# 🎯 Votre Configuration Personnalisée

## ✅ Client ID Spotify Configuré!

Votre Client ID: `0756fa5c35774331ba050a44e441e874`

## 📝 Configuration du fichier .env

Copiez et collez ce contenu dans votre fichier `.env` (à la racine du projet):

```bash
VITE_SPOTIFY_CLIENT_ID=0756fa5c35774331ba050a44e441e874
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

## 🚀 Commandes pour Démarrer

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm run dev
```

## ✅ Checklist Finale

- [x] Client ID Spotify obtenu
- [ ] Vérifier que `http://localhost:3000/callback` est dans vos Redirect URIs sur Spotify Dashboard
- [ ] Créer/Modifier le fichier `.env` avec la config ci-dessus
- [ ] Lancer `npm install`
- [ ] Lancer `npm run dev`
- [ ] Se connecter avec Spotify
- [ ] Lancer une chanson sur Spotify (Premium requis pour les contrôles)

## 🎵 C'est Prêt!

Une fois ces étapes complétées, votre application fonctionnera parfaitement!

### Rappel Important:
⚠️ Assurez-vous que dans votre [Spotify Dashboard](https://developer.spotify.com/dashboard), vous avez bien ajouté:
```
http://localhost:3000/callback
```
dans les **Redirect URIs** de votre application!

