# 🚀 Guide de Déploiement

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Build de Production](#build-de-production)
3. [Déploiement sur Serveur](#déploiement-sur-serveur)
4. [Déploiement Cloud](#déploiement-cloud)
5. [Configuration Nginx/Apache](#configuration-nginxapache)
6. [Variables d'Environnement](#variables-denvironnement)
7. [Optimisations](#optimisations)
8. [Monitoring & Rollback](#monitoring--rollback)

---

## ✅ Prérequis

### Système
- Node.js >= 18.x
- npm >= 9.x ou pnpm >= 8.x
- Git

### Accès
- Accès SSH au serveur de production
- Droits d'administration sur le serveur web
- Accès au repository Git
- Variables d'environnement de production

---

## 🏗️ Build de Production

### 1. Préparation

```bash
# Cloner le projet
git clone https://github.com/ena-rh/portail-rh.git
cd portail-rh

# Installer les dépendances
npm install

# Créer le fichier .env.production
cp .env.example .env.production
```

### 2. Configuration .env.production

```bash
# API Configuration
VITE_API_BASE_URL=https://api.ena-rh.cd/api
VITE_APP_ENV=production
VITE_API_TIMEOUT=30000

# Désactiver les logs et devtools
VITE_ENABLE_API_LOGGING=false
VITE_ENABLE_REACT_QUERY_DEVTOOLS=false

# Authentication
VITE_TOKEN_STORAGE_KEY=ena-auth-token
VITE_REFRESH_TOKEN_KEY=ena-refresh-token

# React Query - Cache plus long en production
VITE_QUERY_STALE_TIME=300000  # 5 minutes
VITE_QUERY_CACHE_TIME=600000  # 10 minutes
```

### 3. Build

```bash
# Build de production
npm run build

# Vérifier le dossier dist/
ls -lh dist/
```

**Output attendu**:
```
dist/
├── assets/
│   ├── index-[hash].js      # ~1.95 MB (554 KB gzipped)
│   ├── index-[hash].css     # ~50 KB
│   └── [autres assets]
├── index.html
└── manifest.json
```

### 4. Test Local du Build

```bash
# Servir le build localement
npm run preview

# Ou avec serve
npx serve -s dist -p 4173
```

Tester sur: `http://localhost:4173`

### 5. Validation Pré-Déploiement

**Checklist**:
- [ ] `npm run build` réussit sans erreur
- [ ] Taille du bundle < 2 MB
- [ ] Test du build en local fonctionne
- [ ] Variables d'environnement correctes
- [ ] Assets correctement chargés
- [ ] Connexion à l'API de production OK

---

## 🖥️ Déploiement sur Serveur

### Option 1: VPS Linux (Ubuntu/Debian)

#### Prérequis Serveur
```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Nginx
sudo apt install nginx -y

# Installer Node.js (optionnel pour build sur serveur)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Déploiement
```bash
# 1. Transférer les fichiers
scp -r dist/ user@server:/var/www/ena-portail-rh/

# Ou avec rsync
rsync -avz --delete dist/ user@server:/var/www/ena-portail-rh/

# 2. Sur le serveur, définir les permissions
sudo chown -R www-data:www-data /var/www/ena-portail-rh
sudo chmod -R 755 /var/www/ena-portail-rh
```

### Option 2: Déploiement Automatisé (GitHub Actions)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Create .env.production
        run: |
          echo "VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }}" >> .env.production
          echo "VITE_APP_ENV=production" >> .env.production
          echo "VITE_ENABLE_API_LOGGING=false" >> .env.production
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v2.1.5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          SOURCE: "dist/"
          TARGET: "/var/www/ena-portail-rh/"
```

---

## ☁️ Déploiement Cloud

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Configuration via vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "https://api.ena-rh.cd/api"
  }
}
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configuration via netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://api.ena-rh.cd/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload vers S3
aws s3 sync dist/ s3://ena-portail-rh/ --delete

# Invalider le cache CloudFront
aws cloudfront create-invalidation \
  --distribution-id E1234567890 \
  --paths "/*"
```

---

## 🔧 Configuration Nginx/Apache

### Nginx

Créer `/etc/nginx/sites-available/ena-portail-rh`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name portail-rh.ena-rdc.cd;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name portail-rh.ena-rdc.cd;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/portail-rh.ena-rdc.cd/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portail-rh.ena-rdc.cd/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root directory
    root /var/www/ena-portail-rh;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - toutes les routes vers index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optionnel)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Activer le site**:
```bash
sudo ln -s /etc/nginx/sites-available/ena-portail-rh /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Apache

Créer `/etc/apache2/sites-available/ena-portail-rh.conf`:

```apache
<VirtualHost *:80>
    ServerName portail-rh.ena-rdc.cd
    Redirect permanent / https://portail-rh.ena-rdc.cd/
</VirtualHost>

<VirtualHost *:443>
    ServerName portail-rh.ena-rdc.cd
    DocumentRoot /var/www/ena-portail-rh

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/portail-rh.ena-rdc.cd/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/portail-rh.ena-rdc.cd/privkey.pem

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>

    # Cache static files
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
        ExpiresByType font/woff2 "access plus 1 year"
    </IfModule>

    # SPA routing
    <Directory /var/www/ena-portail-rh>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

**Activer le site**:
```bash
sudo a2ensite ena-portail-rh
sudo a2enmod rewrite ssl headers expires
sudo systemctl reload apache2
```

---

## 🔐 Variables d'Environnement

### Gestion Sécurisée

**NE JAMAIS committer les fichiers .env de production !**

#### .gitignore
```bash
# Environment files
.env
.env.local
.env.development
.env.production
.env.*.local
```

#### Secrets Management

**Option 1: Variables d'environnement serveur**
```bash
# Sur le serveur
echo 'export VITE_API_BASE_URL=https://api.ena-rh.cd/api' >> /etc/environment
source /etc/environment
```

**Option 2: CI/CD Secrets (GitHub)**
```
Settings > Secrets and variables > Actions
- VITE_API_BASE_URL
- VITE_TOKEN_STORAGE_KEY
- SSH_PRIVATE_KEY
```

**Option 3: Vault (HashiCorp)**
```bash
vault kv put secret/ena-rh \
  VITE_API_BASE_URL=https://api.ena-rh.cd/api \
  VITE_TOKEN_STORAGE_KEY=ena-auth-token
```

---

## ⚡ Optimisations

### 1. Bundle Optimization

**vite.config.ts**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['@headlessui/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### 2. Lazy Loading

```typescript
// Routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Employees = lazy(() => import('./pages/Employees'));

// Composants lourds
const Charts = lazy(() => import('./components/Charts'));
```

### 3. Image Optimization

```bash
# Installer sharp pour l'optimisation
npm install -D vite-plugin-image-optimizer

# vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

plugins: [
  ViteImageOptimizer({
    png: { quality: 80 },
    jpeg: { quality: 80 },
  }),
]
```

### 4. PWA Configuration

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.ena-rh\.cd\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60, // 1 heure
            },
          },
        },
      ],
    },
  }),
]
```

---

## 📊 Monitoring & Rollback

### Health Checks

**Script de surveillance**:
```bash
#!/bin/bash
# health-check.sh

URL="https://portail-rh.ena-rdc.cd"
STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" $URL)

if [ $STATUS -eq 200 ]; then
  echo "✅ Site OK - $STATUS"
  exit 0
else
  echo "❌ Site DOWN - $STATUS"
  # Alerte
  curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK \
    -d '{"text":"⚠️ Portail RH DOWN - Status: '$STATUS'"}'
  exit 1
fi
```

**Cron job**:
```bash
# Vérifier toutes les 5 minutes
*/5 * * * * /path/to/health-check.sh
```

### Performance Monitoring

**Google Analytics / Plausible**:
```typescript
// src/utils/analytics.ts
export const trackPageView = (url: string) => {
  if (import.meta.env.PROD) {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
    });
  }
};
```

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 0.1,
  });
}
```

### Rollback Procedure

**Version avec Git tags**:
```bash
# Tag la version actuelle avant déploiement
git tag -a v1.2.0 -m "Release 1.2.0"
git push origin v1.2.0

# En cas de problème, rollback
git checkout v1.1.9
npm run build
# Redéployer
```

**Backup automatique**:
```bash
#!/bin/bash
# backup-before-deploy.sh

BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup
tar -czf $BACKUP_DIR/ena-portail-rh-$TIMESTAMP.tar.gz \
  /var/www/ena-portail-rh

# Garder seulement les 10 derniers backups
ls -t $BACKUP_DIR/*.tar.gz | tail -n +11 | xargs rm -f
```

**Restauration**:
```bash
# Lister les backups
ls -lh /var/www/backups/

# Restaurer
tar -xzf /var/www/backups/ena-portail-rh-20240115_143000.tar.gz -C /
sudo systemctl reload nginx
```

---

## 🎯 Checklist Finale

### Pré-Déploiement
- [ ] Tests passent (npm test)
- [ ] Build réussit (npm run build)
- [ ] Variables d'environnement configurées
- [ ] .env.production créé et vérifié
- [ ] Bundle size acceptable (< 2 MB)
- [ ] SSL/TLS configuré
- [ ] CORS configuré sur le backend
- [ ] Backup créé

### Post-Déploiement
- [ ] Site accessible (https://portail-rh.ena-rdc.cd)
- [ ] Login fonctionne
- [ ] API connectée
- [ ] Assets chargent correctement
- [ ] Pas d'erreurs console
- [ ] Redirections HTTPS OK
- [ ] Headers de sécurité présents
- [ ] Performance acceptable (Lighthouse > 90)
- [ ] Monitoring activé

### Tests en Production
```bash
# Test de charge
ab -n 1000 -c 10 https://portail-rh.ena-rdc.cd/

# Test SSL
ssllabs.com/ssltest/analyze.html?d=portail-rh.ena-rdc.cd

# Test Performance
lighthouse https://portail-rh.ena-rdc.cd --view
```

---

## 📞 Support

En cas de problème lors du déploiement:

1. **Vérifier les logs Nginx**:
```bash
sudo tail -f /var/log/nginx/error.log
```

2. **Vérifier les permissions**:
```bash
sudo chown -R www-data:www-data /var/www/ena-portail-rh
sudo chmod -R 755 /var/www/ena-portail-rh
```

3. **Test de configuration**:
```bash
sudo nginx -t
sudo systemctl status nginx
```

4. **Contacter l'équipe**:
- Email: dev@ena-rdc.cd
- Slack: #ena-rh-support

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2024
