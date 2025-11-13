# Instructions de déploiement GitHub Pages

## ✅ Changements effectués

1. **`vite.config.ts`** - Ajout de `base: '/enarh/'` pour le chemin du repo
2. **`index.html`** - Script de redirection pour le routing SPA
3. **`public/404.html`** - Page 404 qui redirige vers index.html
4. **`.github/workflows/deploy.yml`** - GitHub Actions pour déploiement automatique

## 🚀 Étapes pour déployer

### 1. Activer GitHub Pages dans les paramètres du repo

1. Allez sur https://github.com/devappena/enarh/settings/pages
2. Dans **"Source"**, sélectionnez **"GitHub Actions"**
3. Sauvegardez

### 2. Pousser les changements

\`\`\`bash
cd ena-portail-rh
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
\`\`\`

### 3. Attendre le déploiement

- Allez dans l'onglet **"Actions"** de votre repo
- Attendez que le workflow "Deploy to GitHub Pages" se termine (icône verte ✓)
- Cela prend environ 2-5 minutes

### 4. Accéder au site

Votre site sera disponible à :
**https://devappena.github.io/enarh/**

## 🔍 Vérification locale avant de déployer

\`\`\`bash
# Build le projet
npm run build

# Prévisualiser le build
npm run preview
\`\`\`

Ouvrez http://localhost:4173/enarh/ et testez la navigation.

## ⚠️ Important

- Les routes `/dashboard`, `/employees`, `/profile` fonctionneront maintenant correctement
- Le script 404.html capture toutes les URLs et les redirige vers React Router
- Si vous renommez le repo, changez `base: '/nouveau-nom/'` dans `vite.config.ts`

## 🐛 Résolution des problèmes

### Les pages ne s'affichent toujours pas
1. Videz le cache du navigateur (Ctrl+Shift+R)
2. Vérifiez que GitHub Actions s'est bien exécuté
3. Vérifiez que GitHub Pages est activé avec source "GitHub Actions"

### Les assets (CSS/JS) ne chargent pas
- Vérifiez que `base: '/enarh/'` est correct dans `vite.config.ts`
- Vérifiez qu'il n'y a pas de `/` au début des imports dans le code

### Erreurs de build
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez les logs dans l'onglet Actions sur GitHub

## 📝 Configuration de l'API Backend

Le frontend est configuré pour appeler l'API backend. Pour la production :

1. Déployez le backend sur un serveur (Heroku, Railway, etc.)
2. Créez un fichier `.env.production` dans `ena-portail-rh` :

\`\`\`env
VITE_API_BASE_URL=https://votre-backend.com/api
VITE_APP_ENV=production
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=false
\`\`\`

3. Ajoutez les secrets dans GitHub :
   - Settings > Secrets and variables > Actions
   - Ajoutez `VITE_API_BASE_URL`

4. Modifiez `.github/workflows/deploy.yml` pour utiliser les secrets :

\`\`\`yaml
- name: Build
  run: npm run build
  env:
    NODE_ENV: production
    VITE_API_BASE_URL: \${{ secrets.VITE_API_BASE_URL }}
\`\`\`
