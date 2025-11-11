# 🔌 Guide d'Intégration Backend

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration](#configuration)
3. [Structure de l'API](#structure-de-lapi)
4. [Authentification](#authentification)
5. [Gestion des Erreurs](#gestion-des-erreurs)
6. [CORS & Sécurité](#cors--sécurité)
7. [Tests avec le Backend](#tests-avec-le-backend)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

Le frontend ENA Portail RH est conçu pour se connecter à un backend REST API. Cette documentation détaille la configuration et l'intégration.

### Technologies Utilisées
- **HTTP Client**: Axios avec intercepteurs
- **State Management**: React Query pour le cache et la synchronisation
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schemas

---

## ⚙️ Configuration

### 1. Variables d'Environnement

Le projet utilise des fichiers `.env` pour la configuration:

```bash
# Développement
.env.development

# Production
.env.production

# Template (à copier)
.env.example
```

### 2. Configuration Développement

Créez `.env.development` basé sur `.env.example`:

```bash
# Configuration API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=true

# Authentication
VITE_TOKEN_STORAGE_KEY=ena-auth-token
VITE_REFRESH_TOKEN_KEY=ena-refresh-token

# React Query
VITE_ENABLE_REACT_QUERY_DEVTOOLS=true
VITE_QUERY_STALE_TIME=60000
VITE_QUERY_CACHE_TIME=300000
```

### 3. Configuration Production

Créez `.env.production`:

```bash
# Configuration API
VITE_API_BASE_URL=https://api.ena-rh.cd/api
VITE_APP_ENV=production
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=false

# Authentication
VITE_TOKEN_STORAGE_KEY=ena-auth-token
VITE_REFRESH_TOKEN_KEY=ena-refresh-token

# React Query
VITE_ENABLE_REACT_QUERY_DEVTOOLS=false
VITE_QUERY_STALE_TIME=300000
VITE_QUERY_CACHE_TIME=600000
```

### 4. Utilisation dans le Code

La configuration est centralisée dans `src/config/app.config.ts`:

```typescript
import { apiConfig } from '@/config/app.config';

// Utilisation
console.log(apiConfig.baseURL); // http://localhost:3000/api
console.log(apiConfig.timeout); // 30000
console.log(apiConfig.enableLogging); // true
```

---

## 🏗️ Structure de l'API

### Endpoints Requis

Le backend doit exposer les endpoints suivants:

#### Authentication (`/auth`)
```
POST   /auth/login              - Connexion
POST   /auth/logout             - Déconnexion
POST   /auth/refresh            - Rafraîchir le token
GET    /auth/me                 - Obtenir l'utilisateur connecté
POST   /auth/change-password    - Changer le mot de passe
```

#### Employees (`/employees`)
```
GET    /employees               - Liste paginée
GET    /employees/:id           - Détails d'un employé
POST   /employees               - Créer un employé
PUT    /employees/:id           - Mettre à jour
DELETE /employees/:id           - Supprimer
GET    /employees/search        - Rechercher
GET    /employees/export        - Exporter (CSV/Excel)
```

#### Absences (`/absences`)
```
GET    /absences                - Liste paginée
GET    /absences/:id            - Détails
POST   /absences                - Créer une demande
PUT    /absences/:id            - Mettre à jour
DELETE /absences/:id            - Supprimer
POST   /absences/:id/approve    - Approuver
POST   /absences/:id/reject     - Rejeter
GET    /absences/history        - Historique
```

#### Trainings (`/trainings`)
```
GET    /trainings               - Liste des formations
GET    /trainings/:id           - Détails
POST   /trainings               - Créer
PUT    /trainings/:id           - Mettre à jour
DELETE /trainings/:id           - Supprimer
POST   /trainings/:id/enroll    - S'inscrire
GET    /trainings/upcoming      - Formations à venir
```

#### Statistics (`/statistics`)
```
GET    /statistics/dashboard    - Statistiques du tableau de bord
GET    /statistics/employees    - Statistiques employés
GET    /statistics/absences     - Statistiques absences
GET    /statistics/trainings    - Statistiques formations
GET    /statistics/payroll      - Statistiques paie
```

### Format des Réponses

#### Succès (200 OK)
```json
{
  "success": true,
  "data": { /* données */ },
  "message": "Opération réussie"
}
```

#### Liste Paginée
```json
{
  "success": true,
  "data": [/* éléments */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### Erreur (4xx, 5xx)
```json
{
  "success": false,
  "error": "Message d'erreur",
  "code": "ERROR_CODE",
  "details": { /* optionnel */ }
}
```

---

## 🔐 Authentification

### 1. Flux d'Authentification

```mermaid
sequenceDiagram
    Client->>API: POST /auth/login (email, password)
    API-->>Client: 200 { token, refreshToken, user }
    Client->>localStorage: Stocker tokens
    Client->>API: GET /employees (Authorization: Bearer token)
    API-->>Client: 200 { data }
    
    Note over Client,API: Token expiré
    Client->>API: POST /auth/refresh (refreshToken)
    API-->>Client: 200 { token, refreshToken }
    Client->>localStorage: Mettre à jour tokens
```

### 2. Headers Requis

Le frontend envoie automatiquement les headers suivants:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Accept: application/json
```

### 3. Gestion des Tokens

Les tokens sont stockés dans `localStorage`:

```typescript
// Stockage après login
localStorage.setItem('ena-auth-token', token);
localStorage.setItem('ena-refresh-token', refreshToken);

// Récupération automatique (intercepteur)
const token = localStorage.getItem('ena-auth-token');
config.headers.Authorization = `Bearer ${token}`;

// Nettoyage après logout
localStorage.removeItem('ena-auth-token');
localStorage.removeItem('ena-refresh-token');
```

### 4. Rafraîchissement Automatique

Le client API gère automatiquement le rafraîchissement:

```typescript
// En cas de 401, tentative de rafraîchir
if (error.response?.status === 401) {
  const refreshToken = localStorage.getItem('ena-refresh-token');
  const { token } = await authService.refresh(refreshToken);
  localStorage.setItem('ena-auth-token', token);
  // Réessayer la requête originale
}
```

---

## ⚠️ Gestion des Erreurs

### Codes HTTP Gérés

Le frontend gère automatiquement les erreurs suivantes:

#### 401 Unauthorized
```typescript
// Redirection automatique vers login
localStorage.clear();
window.location.href = '/auth/login';
```

#### 403 Forbidden
```typescript
// Affichage message d'erreur
toast.error("Vous n'avez pas les permissions nécessaires");
```

#### 404 Not Found
```typescript
// Log et message utilisateur
console.error('Ressource non trouvée');
toast.error('La ressource demandée n\'existe pas');
```

#### 500 Server Error
```typescript
// Message d'erreur générique
toast.error('Une erreur serveur est survenue. Veuillez réessayer.');
```

### Format d'Erreur Attendu

Le backend doit retourner:

```json
{
  "success": false,
  "error": "Message lisible pour l'utilisateur",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Format d'email invalide"
  }
}
```

---

## 🔒 CORS & Sécurité

### Configuration CORS Backend

Le backend doit autoriser les requêtes du frontend:

#### Node.js/Express
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',           // Développement
    'https://portail-rh.ena-rdc.cd'    // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### Headers Requis
```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Sécurité des Tokens

#### Best Practices
- ✅ Utiliser HTTPS en production
- ✅ Tokens JWT avec expiration courte (1h)
- ✅ Refresh tokens avec expiration plus longue (7j)
- ✅ Stocker les tokens dans `localStorage` (pas de cookies pour SPA)
- ✅ Valider les tokens côté serveur à chaque requête
- ✅ Implémenter le rate limiting

#### Headers de Sécurité Recommandés
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## 🧪 Tests avec le Backend

### 1. Mock Server (Développement)

Pour tester sans backend, utiliser les mock services:

```typescript
// Désactiver temporairement React Query
const { data } = useEmployees();
// Remplacer par:
const data = mockEmployees;
```

### 2. Backend Local

```bash
# Démarrer le backend
cd backend
npm run dev  # Port 3000

# Démarrer le frontend
cd frontend
npm run dev  # Port 5173

# Vérifier la connexion
curl http://localhost:3000/api/health
```

### 3. Tests d'Intégration

```bash
# Variables d'environnement de test
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENABLE_API_LOGGING=true

# Exécuter les tests
npm run test
```

### 4. Vérifications

Checklist de connexion:

- [ ] Backend accessible (`curl http://localhost:3000/api/health`)
- [ ] CORS configuré correctement
- [ ] Login réussi (`POST /auth/login`)
- [ ] Token stocké dans localStorage
- [ ] Requêtes authentifiées fonctionnent
- [ ] Gestion des erreurs 401/403/500
- [ ] Rafraîchissement du token automatique

---

## 🔧 Troubleshooting

### Problème 1: CORS Error

**Erreur**: `Access to fetch blocked by CORS policy`

**Solution**:
```javascript
// Backend: Vérifier la configuration CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Problème 2: 401 Unauthorized

**Erreur**: Toutes les requêtes retournent 401

**Solutions**:
1. Vérifier que le token est stocké:
```javascript
console.log(localStorage.getItem('ena-auth-token'));
```

2. Vérifier le header Authorization:
```javascript
// Dans DevTools > Network > Headers
Authorization: Bearer <token>
```

3. Vérifier la validité du token (backend):
```bash
# Décoder le token JWT
jwt.verify(token, SECRET_KEY);
```

### Problème 3: Network Error

**Erreur**: `Network Error` ou `ERR_CONNECTION_REFUSED`

**Solutions**:
1. Vérifier que le backend est démarré
2. Vérifier l'URL dans `.env.development`
3. Vérifier le firewall/antivirus

### Problème 4: Timeout

**Erreur**: `timeout of 30000ms exceeded`

**Solutions**:
1. Augmenter le timeout:
```bash
VITE_API_TIMEOUT=60000
```

2. Optimiser les requêtes backend
3. Vérifier la connexion réseau

### Problème 5: Data Not Updating

**Problème**: Les données ne se rafraîchissent pas

**Solutions**:
1. Invalider le cache React Query:
```typescript
queryClient.invalidateQueries({ queryKey: ['employees'] });
```

2. Vérifier `staleTime` dans la config
3. Forcer le refetch:
```typescript
const { refetch } = useEmployees();
refetch();
```

---

## 📚 Ressources

### Documentation API
- [Swagger/OpenAPI](http://localhost:3000/api-docs) - Documentation interactive
- [Postman Collection](./postman/ena-rh.json) - Collection de tests

### Code Références
- `src/api/` - Services API
- `src/hooks/` - React Query hooks
- `src/config/app.config.ts` - Configuration centralisée

### Support
- GitHub Issues: [Créer un ticket](https://github.com/ena-rh/issues)
- Email: dev@ena-rdc.cd

---

**Dernière mise à jour**: 2024
**Version**: 1.0.0
