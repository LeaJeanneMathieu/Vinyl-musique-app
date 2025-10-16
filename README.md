# 🎵 Spotify Vinyl Player

Une application Electron mignonne qui affiche vos chansons Spotify actuelles dans un tourne-disque virtuel avec une esthétique bullet journal!

![Cute Vinyl Player](https://img.shields.io/badge/style-cute-ff69b4)
![Spotify](https://img.shields.io/badge/spotify-connected-1DB954)

## ✨ Fonctionnalités

- 🎨 **Design Mignon**: Esthétique bullet journal avec des couleurs pastel
- 💿 **Tourne-Disque Animé**: Visualisation d'un vinyle qui tourne avec la pochette de l'album
- 🎵 **Informations en Direct**: Affiche le titre, l'artiste et l'album de la chanson en cours
- 🎮 **Contrôles de Lecture**: Previous, Play/Pause, Next
- 🔄 **Synchronisation Automatique**: Mise à jour en temps réel avec votre lecture Spotify
- 🔐 **Authentification Sécurisée**: OAuth 2.0 avec PKCE

## 📋 Prérequis

1. **Compte Spotify Premium** (nécessaire pour l'API de contrôle de lecture)
2. **Node.js** (v18 ou supérieur)
3. **Application Spotify Developer**

## 🚀 Configuration

### 1. Créer une Application Spotify

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Cliquez sur "Create app"
3. Remplissez les détails:
   - **App name**: Spotify Vinyl Player
   - **App description**: A cute vinyl player for Spotify
   - **Redirect URI**: `http://localhost:3000/callback`
   - **API/SDK**: Cochez "Web API"
4. Sauvegardez et notez votre **Client ID**

### 2. Configuration de l'Environnement

1. Créez un fichier `.env` à la racine du projet:

```bash
VITE_SPOTIFY_CLIENT_ID=votre_client_id_ici
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### 3. Installation

```bash
# Installer les dépendances
npm install
```

## 🎮 Utilisation

### Mode Développement

```bash
# Démarrer l'application en mode dev
npm run dev
```

### Build de Production

```bash
# Construire l'application
npm run electron:build
```

L'application sera générée dans le dossier `release/`.

## 🎨 Fonctionnement

1. **Lancer l'application**
2. **Se connecter avec Spotify**: Cliquez sur le bouton "Connect with Spotify"
3. **Autoriser l'application** dans votre navigateur
4. **Jouer de la musique** sur n'importe quel appareil Spotify
5. **Profiter** de la visualisation du tourne-disque!

## 🛠️ Technologies Utilisées

- **Electron**: Framework desktop
- **React + TypeScript**: Interface utilisateur
- **Vite**: Build tool moderne et rapide
- **Spotify Web API**: Intégration musicale
- **CSS Animations**: Animations fluides du vinyle

## 📁 Structure du Projet

```
/
├── src/
│   ├── main/              # Processus principal Electron
│   │   ├── main.ts        # Point d'entrée Electron
│   │   └── preload.ts     # Script preload
│   └── renderer/          # Application React
│       ├── components/    # Composants React
│       ├── styles/        # Fichiers CSS
│       ├── types/         # Types TypeScript
│       ├── utils/         # Utilitaires (auth, API)
│       ├── App.tsx        # Composant principal
│       └── main.tsx       # Point d'entrée React
├── index.html
├── package.json
└── vite.config.ts
```

## 🎯 Fonctionnalités des Composants

### VinylPlayer
- Affiche un disque vinyle SVG animé
- Affiche la pochette de l'album au centre
- Rotation synchronisée avec la lecture
- Informations de la piste

### PlayerControls
- Boutons Previous, Play/Pause, Next
- Style mignon avec effets d'ombre
- Intégration complète avec l'API Spotify

### SpotifyAuth
- Authentification OAuth sécurisée
- Interface de connexion attrayante
- Gestion des tokens avec refresh

## ⚠️ Notes Importantes

- **Spotify Premium requis**: L'API de contrôle de lecture nécessite un compte Premium
- **Appareil actif**: Spotify doit être en cours de lecture sur au moins un appareil
- **Limitations de l'API**: Rafraîchissement toutes les 2 secondes pour éviter les limites de taux

## 🐛 Dépannage

### L'application ne se connecte pas
- Vérifiez que votre `Client ID` est correct dans le fichier `.env`
- Assurez-vous que `http://localhost:3000/callback` est dans vos Redirect URIs

### Aucune musique ne s'affiche
- Lancez Spotify et jouez une chanson sur n'importe quel appareil
- Vérifiez que vous avez un compte Spotify Premium

### Erreurs de lecture
- Assurez-vous qu'un appareil Spotify est actif
- Essayez de redémarrer l'application

## 📝 Licence

MIT

## 💝 Fait avec amour

Créé avec 💖 et beaucoup de ☕

