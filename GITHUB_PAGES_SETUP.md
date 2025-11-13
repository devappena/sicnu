# Configuration pour GitHub Pages

Ce projet utilise une solution pour gérer le routing React Router sur GitHub Pages.

## Problème
GitHub Pages ne supporte pas nativement le routing côté client (SPA). Quand vous accédez à `/dashboard`, GitHub cherche un fichier `dashboard.html` qui n'existe pas.

## Solution implémentée

### 1. Fichier `404.html`
Redirige toutes les URLs non trouvées vers `index.html` avec les paramètres préservés.

### 2. Script dans `index.html`
Restaure l'URL d'origine après la redirection depuis `404.html`.

### 3. Configuration Vite
- `base: './'` - Chemin de base relatif pour les assets

## Déploiement

### Option 1 : GitHub Actions (Recommandé)
Créez `.github/workflows/deploy.yml` :

\`\`\`yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
\`\`\`

### Option 2 : Build local et push
\`\`\`bash
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git main:gh-pages
\`\`\`

## Configuration du repo GitHub

1. Allez dans **Settings** > **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** / **/ (root)**
4. Sauvegardez

## Variables d'environnement

Si votre repo s'appelle `mon-repo` et n'est pas à la racine :
- Modifiez `vite.config.ts` : `base: '/mon-repo/'`
- Modifiez `404.html` : `pathSegmentsToKeep = 1`

Si à la racine (domaine custom) :
- Gardez `base: './'`
- `pathSegmentsToKeep = 0`

## Test en local

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Liens utiles
- [Solution SPA GitHub Pages](https://github.com/rafgraph/spa-github-pages)
- [Vite deployment](https://vitejs.dev/guide/static-deploy.html#github-pages)
