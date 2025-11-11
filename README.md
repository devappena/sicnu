# 🏢 ENA Portail RH - Système de Gestion des Ressources Humaines

> Application moderne de gestion RH pour l'École Nationale d'Administration (ENA) - RDC

## 📋 Vue d'ensemble

Application web complète pour la gestion des ressources humaines incluant :
- 👥 Gestion des employés
- 📅 Gestion des absences et congés
- 📊 Évaluations de performance
- 🎓 Gestion des formations
- 💰 Gestion de la paie
- 📄 Gestion documentaire
- ⏰ Pointage et présences
- 🔐 Système de permissions granulaire (4 rôles)

## 🚀 Technologies

### Frontend Stack
- **React** 19.0.0 - Interface utilisateur
- **TypeScript** 5.5.3 - Typage statique
- **Vite** 6.0.7 - Build tool ultra-rapide
- **TanStack Query** 5.32.0 - Gestion d'état serveur
- **TailwindCSS** 3.4.1 - Styling utility-first
- **Zod** 3.24.1 - Validation de schémas
- **Axios** 1.7.2 - Client HTTP
- **Vitest** 3.2.4 - Testing framework
- **React Hook Form** 7.53.2 - Gestion de formulaires

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Permissions
- Login/Logout sécurisé (JWT)
- 4 rôles : `super_admin`, `admin`, `hr`, `employee`
- 25+ permissions granulaires
- Protected routes
- UI conditionnelle par rôle

### 👥 Gestion des Employés
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Recherche et filtres avancés
- Pagination
- Import/Export
- Historique des modifications

### 📅 Gestion des Absences
- Demandes de congés
- Workflow d'approbation
- Calendrier interactif
- Statistiques par employé
- Rapports mensuels

### 📊 Évaluations de Performance
- Création d'évaluations
- Objectifs et KPIs
- Feedback 360°
- Historique des évaluations

### 🎓 Formations
- Catalogue de formations
- Inscriptions
- Suivi des participations
- Certificats

### 💰 Paie
- Génération de bulletins
- Primes et déductions
- Historique des paiements
- Exports comptables

## 📁 Structure du Projet

```
ena-portail-rh/
├── src/
│   ├── api/                    # Services API
│   │   ├── index.ts           # Configuration Axios
│   │   └── services/          # 9 services (auth, employee, etc.)
│   ├── components/            # Composants réutilisables (60+)
│   │   ├── AbsenceCalendar.tsx
│   │   ├── EmployeeCard.tsx
│   │   ├── Modal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/              # Contextes React
│   │   ├── AuthContext.tsx
│   │   ├── ToastContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                 # Hooks personnalisés (95+)
│   │   ├── useEmployees.ts
│   │   ├── useAbsences.ts
│   │   ├── usePermissions.ts
│   │   └── ...
│   ├── pages/                 # Pages principales
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── Absences.tsx
│   │   └── ...
│   ├── providers/             # Providers React Query, etc.
│   ├── schemas/               # Schémas de validation Zod
│   │   ├── employee.schema.ts
│   │   ├── absence.schema.ts
│   │   └── auth.schema.ts
│   ├── test/                  # Tests (78 tests)
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── setup.ts
│   ├── types/                 # Types TypeScript
│   ├── utils/                 # Utilitaires
│   │   └── permissions.ts    # Logique des permissions
│   ├── App.tsx
│   └── main.tsx
├── public/                    # Assets statiques
├── vitest.config.ts          # Configuration tests
├── vite.config.ts            # Configuration Vite
├── tailwind.config.js        # Configuration Tailwind
├── tsconfig.json             # Configuration TypeScript
├── package.json
├── ROADMAP_FINAL.md          # Roadmap complète
├── TEST_SUMMARY.md           # Documentation tests
└── NEXT_STEPS.md             # Prochaines étapes
```

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Backend API configuré (voir configuration)

### Étapes

1. **Cloner le projet**
```bash
git clone [URL_DU_REPO]
cd ena-portail-rh
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration environnement**

Créer un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=ENA Portail RH
VITE_APP_VERSION=1.0.0
```

4. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 🧪 Tests

```bash
# Lancer les tests (mode watch)
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode UI
npm run test:ui
```

**Statistiques actuelles:**
- ✅ 78 tests (100% passing)
- ✅ Système de permissions 98.81% couvert
- ⏱️ Durée: ~35 secondes

## 📦 Build & Production

```bash
# Build pour production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔑 Système de Permissions

### Rôles

| Rôle | Description | Accès |
|------|-------------|-------|
| **super_admin** | Administrateur système | Accès total (inclut admin) |
| **admin** | Administrateur général | Gestion complète sauf super-admin |
| **hr** | Ressources Humaines | Employés, absences, formations |
| **employee** | Employé standard | Consultation limitée |

### Permissions (25+)

```typescript
// Exemples de permissions
'view_dashboard'           // Voir le tableau de bord
'view_employees'           // Voir les employés
'create_employee'          // Créer un employé
'edit_employee'            // Modifier un employé
'delete_employee'          // Supprimer un employé
'approve_absence'          // Approuver une absence
'view_payroll'            // Voir la paie
'manage_permissions'       // Gérer les permissions
// ... et 17+ autres
```

### Utilisation dans le code

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission, canCreateEmployee, isAdmin } = usePermissions();
  
  return (
    <>
      {canCreateEmployee && <Button>Créer employé</Button>}
      {hasPermission('approve_absence') && <ApproveButton />}
      {isAdmin && <AdminPanel />}
    </>
  );
}
```

## 🗺️ Routes Protégées

```tsx
// Routes principales
/                      - Login (public)
/dashboard            - Tableau de bord (auth required)
/employees            - Gestion employés (hr+)
/absences             - Gestion absences (hr+)
/performance          - Évaluations (hr+)
/training             - Formations (hr+)
/payroll              - Paie (admin+)
/recruitment          - Recrutement (hr+)
/documents            - Documents (auth)
/time-tracking        - Pointage (auth)
/reports              - Rapports (admin+)
/settings             - Paramètres (admin+)
```

## 🔌 Backend API

### Configuration requise

Le frontend s'attend à un backend REST API avec les endpoints suivants :

```
POST   /api/auth/login           - Authentification
POST   /api/auth/logout          - Déconnexion
GET    /api/auth/me              - Utilisateur courant

GET    /api/employees            - Liste employés
POST   /api/employees            - Créer employé
GET    /api/employees/:id        - Détails employé
PUT    /api/employees/:id        - Modifier employé
DELETE /api/employees/:id        - Supprimer employé

GET    /api/absences             - Liste absences
POST   /api/absences             - Créer absence
PUT    /api/absences/:id         - Modifier absence
POST   /api/absences/:id/approve - Approuver absence

// ... et autres endpoints pour chaque module
```

### Format de réponse attendu

```json
{
  "success": true,
  "data": { ... },
  "message": "Opération réussie"
}
```

## 📊 État du Projet

### ✅ Complété (Phase 1-8)

- [x] Phase 1: Nettoyage & Modernisation
- [x] Phase 2: Services API (9 services)
- [x] Phase 3: React Query (95+ hooks)
- [x] Phase 4: Migration Composants (60+)
- [x] Phase 5: Validation Zod (4 schémas)
- [x] Phase 6: Configuration Backend
- [x] Phase 7: Système de Permissions
- [x] Phase 8: Tests & Qualité (78 tests)

### 🔮 Options Futures (Non implémentées)

Voir `NEXT_STEPS.md` pour les 7 options disponibles :
1. Tests Approfondis (recommandé)
2. PWA & Offline Mode
3. Optimisations Performance
4. Animations & UX
5. Accessibilité & i18n
6. Analytics & Monitoring
7. Documentation Complète

## 🤝 Contribution

### Standards de code

- TypeScript strict mode
- ESLint + Prettier
- Composants fonctionnels uniquement
- Hooks React Query pour data fetching
- Zod pour validation
- TailwindCSS pour styling

### Workflow Git

```bash
# Créer une branche
git checkout -b feature/ma-feature

# Commit avec message clair
git commit -m "feat: ajout de la fonctionnalité X"

# Push et créer PR
git push origin feature/ma-feature
```

## 📚 Documentation

- **ROADMAP_FINAL.md** - Vue d'ensemble complète du projet
- **TEST_SUMMARY.md** - Documentation des tests
- **NEXT_STEPS.md** - Options pour la suite
- **Ce README.md** - Guide de démarrage

## 🐛 Résolution de Problèmes

### Problèmes courants

**Erreur: Cannot connect to backend**
```bash
# Vérifier que le backend tourne
# Vérifier VITE_API_URL dans .env
```

**Erreur: Tests qui échouent**
```bash
# Nettoyer node_modules
rm -rf node_modules
npm install
npm test
```

**Build qui échoue**
```bash
# Vérifier les types
npm run type-check

# Nettoyer et rebuild
rm -rf dist
npm run build
```

## 📞 Support

Pour toute question ou problème :
- 📧 Email: [VOTRE_EMAIL]
- 💬 Slack: [VOTRE_SLACK]
- 🐛 Issues: [GITHUB_ISSUES_URL]

## 📄 Licence

[MIT License](LICENSE) - École Nationale d'Administration (ENA)

---

## 🎯 Démarrage Rapide (TL;DR)

```bash
# Installation
npm install

# Configuration
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Dev
npm run dev

# Tests
npm test

# Build
npm run build
```

**Login par défaut (à configurer côté backend):**
- Email: `admin@ena.cd`
- Password: `[À_DÉFINIR]`

---

**Version:** 1.0.0  
**Dernière mise à jour:** 2025-01-15  
**Status:** ✅ Phase 8 Complétée - Production Ready (Frontend)

