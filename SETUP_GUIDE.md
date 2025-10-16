# 🎯 Guide de Configuration - Spotify Vinyl Player

Ce guide vous accompagne pas à pas pour configurer et lancer votre application Spotify Vinyl Player.

## 📝 Étape 1: Configuration Spotify Developer (IMPORTANT!)

### 1.1 Créer un compte développeur Spotify

1. Allez sur [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Connectez-vous avec votre compte Spotify (ou créez-en un)
3. Acceptez les conditions d'utilisation des développeurs

### 1.2 Créer une nouvelle application

1. Cliquez sur le bouton **"Create app"**
2. Remplissez le formulaire:
   ```
   App name: Spotify Vinyl Player
   App description: A cute vinyl player desktop app
   Website: http://localhost:3000 (ou laissez vide)
   Redirect URIs: http://localhost:3000/callback
   ```
3. Cochez **"Web API"** dans la section APIs used
4. Acceptez les termes et conditions
5. Cliquez sur **"Save"**

### 1.3 Récupérer vos identifiants

1. Sur la page de votre application, cliquez sur **"Settings"**
2. Vous verrez votre **Client ID** - copiez-le!
3. Le **Client Secret** n'est pas nécessaire pour cette application (nous utilisons PKCE)

### 1.4 Configurer les Redirect URIs

⚠️ **TRÈS IMPORTANT** - Vérifiez que vous avez bien ajouté:
```
http://localhost:3000/callback
```

Sans cela, l'authentification ne fonctionnera pas!

## 🔧 Étape 2: Configuration du Projet

### 2.1 Créer le fichier .env

1. À la racine du projet, créez un fichier nommé `.env`
2. Ajoutez le contenu suivant:

```bash
VITE_SPOTIFY_CLIENT_ID=COLLEZ_VOTRE_CLIENT_ID_ICI
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

3. Remplacez `COLLEZ_VOTRE_CLIENT_ID_ICI` par votre Client ID copié précédemment

**Exemple:**
```bash
VITE_SPOTIFY_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### 2.2 Installer les dépendances

Ouvrez un terminal dans le dossier du projet et exécutez:

```bash
npm install
```

Cela peut prendre quelques minutes.

## 🚀 Étape 3: Lancer l'Application

### Mode Développement

```bash
npm run dev
```

Cette commande va:
1. Démarrer le serveur de développement Vite
2. Compiler l'application React
3. Lancer l'application Electron

L'application devrait s'ouvrir automatiquement!

## 🎵 Étape 4: Se Connecter à Spotify

1. Cliquez sur le bouton **"Connect with Spotify"**
2. Votre navigateur s'ouvrira avec la page d'autorisation Spotify
3. Connectez-vous à Spotify si nécessaire
4. Cliquez sur **"Accepter"** pour autoriser l'application
5. Vous serez redirigé vers l'application

## ✅ Étape 5: Utiliser l'Application

1. **Ouvrez Spotify** sur n'importe quel appareil (téléphone, ordinateur, web player)
2. **Lancez une chanson**
3. **L'application affichera** automatiquement:
   - La pochette de l'album sur le vinyle
   - Le titre de la chanson
   - L'artiste
   - L'album

4. **Utilisez les contrôles** pour:
   - ⏮️ Piste précédente
   - ⏯️ Lecture/Pause
   - ⏭️ Piste suivante

## ⚠️ Prérequis Important

### Spotify Premium Requis

L'API Spotify Web nécessite un compte **Spotify Premium** pour:
- Contrôler la lecture (play/pause/skip)
- Lire l'état de lecture en temps réel

Si vous avez un compte gratuit, vous pouvez toujours:
- Voir les informations de la chanson en cours
- Mais **pas** contrôler la lecture depuis l'application

## 🐛 Résolution de Problèmes

### Erreur: "Failed to authenticate"

**Solution:**
- Vérifiez que votre `VITE_SPOTIFY_CLIENT_ID` dans le fichier `.env` est correct
- Assurez-vous que `http://localhost:3000/callback` est bien dans vos Redirect URIs

### Erreur: "No playback state"

**Solution:**
- Ouvrez Spotify sur un appareil et lancez une chanson
- Attendez quelques secondes (l'app rafraîchit toutes les 2 secondes)
- Vérifiez que vous avez un compte Spotify Premium

### L'application ne se lance pas

**Solution:**
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install

# Relancer
npm run dev
```

### Le vinyle ne tourne pas

**Solution:**
- Vérifiez qu'une chanson est en cours de lecture sur Spotify
- L'animation s'arrête automatiquement en pause

## 📦 Build de Production

Pour créer une version standalone de l'application:

```bash
npm run electron:build
```

L'application sera créée dans le dossier `release/`.

## 🎨 Personnalisation

Tous les styles sont dans le dossier `src/renderer/styles/`.

Variables CSS principales (dans `index.css`):
- `--accent-pink`: Couleur rose principale
- `--accent-peach`: Couleur pêche
- `--accent-lavender`: Couleur lavande
- `--bg-primary`: Couleur de fond

## 💡 Conseils

- **Gardez Spotify ouvert** pour une meilleure expérience
- **Utilisez des écouteurs/enceintes** pour profiter de la musique
- **L'application se synchronise automatiquement** - pas besoin de recharger

## 🆘 Besoin d'aide?

Si vous rencontrez des problèmes:
1. Vérifiez que vous avez suivi toutes les étapes
2. Consultez la section de résolution de problèmes
3. Vérifiez les logs dans la console de développement (Cmd+Option+I sur Mac)

---

Bon voyage musical! 🎵✨

