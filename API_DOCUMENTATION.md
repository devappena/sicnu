# Documentation de la couche API

## Vue d'ensemble

La couche API du projet ENA Portail RH est structurée de manière modulaire avec des services TypeScript fortement typés. Elle utilise Axios pour les requêtes HTTP et fournit une interface cohérente pour toutes les opérations backend.

## Architecture

```
src/api/
├── client.ts                      # Client HTTP configuré (Axios)
├── types.ts                       # Types génériques pour les API
├── index.ts                       # Point d'entrée centralisé
└── services/
    ├── auth.service.ts            # Authentification
    ├── employee.service.ts        # Gestion des employés
    ├── absence.service.ts         # Gestion des absences
    ├── training.service.ts        # Gestion des formations
    ├── payroll.service.ts         # Gestion de la paie
    ├── statistics.service.ts      # Statistiques et rapports
    ├── notification.service.ts    # Notifications
    ├── settings.service.ts        # Paramètres
    └── timesheet.service.ts       # Feuilles de temps
```

## Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
VITE_DEBUG=true
VITE_API_TIMEOUT=30000
```

### Client HTTP

Le client HTTP est configuré avec :
- **Base URL** : Depuis `VITE_API_BASE_URL`
- **Timeout** : 30 secondes par défaut
- **Authentification** : Bearer Token automatique
- **Intercepteurs** :
  - Request : Injection du token, logs en dev
  - Response : Gestion des erreurs 401, 403, 404, 422, 500

## Services disponibles

### 1. Authentication Service (`auth.service.ts`)

**Méthodes :**
- `login(credentials)` - Connexion
- `register(data)` - Inscription
- `logout()` - Déconnexion
- `getCurrentUser()` - Utilisateur actuel
- `refreshToken()` - Rafraîchir le token
- `forgotPassword(email)` - Mot de passe oublié
- `resetPassword(token, password)` - Réinitialiser
- `changePassword(oldPassword, newPassword)` - Changer
- `verifyToken(token)` - Vérifier validité

**Types :**
```typescript
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
```

### 2. Employee Service (`employee.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails employé
- `create(data)` - Créer
- `update(id, data)` - Modifier
- `delete(id)` - Supprimer
- `search(query)` - Rechercher
- `getByDepartment(id)` - Par département
- `getStatistics()` - Statistiques
- `export(format)` - Exporter
- `import(file)` - Importer
- `toggleStatus(id)` - Activer/Désactiver
- `getHistory(id)` - Historique

**Types :**
```typescript
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId: string;
  positionId: string;
  // ... autres champs
}
```

### 3. Absence Service (`absence.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails
- `create(data)` - Créer demande
- `update(id, data)` - Modifier
- `delete(id)` - Supprimer
- `approve(id, comment)` - Approuver
- `reject(id, comment)` - Rejeter
- `getPending()` - En attente
- `getByEmployee(id)` - Par employé
- `getBalance(employeeId)` - Solde congés
- `checkConflicts(data)` - Détecter conflits
- `export(params)` - Exporter

### 4. Training Service (`training.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails
- `create(data)` - Créer formation
- `update(id, data)` - Modifier
- `delete(id)` - Supprimer
- `enroll(trainingId, employeeId)` - Inscrire
- `unenroll(trainingId, employeeId)` - Désinscrire
- `getParticipants(id)` - Participants
- `getByEmployee(id)` - Par employé
- `getUpcoming()` - À venir
- `complete(id, employeeId, grade)` - Marquer terminé
- `cancel(id, reason)` - Annuler
- `generateCertificate(trainingId, employeeId)` - Certificat
- `export(params)` - Exporter

### 5. Payroll Service (`payroll.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails
- `getByEmployee(id, params)` - Par employé
- `generateMonth(month, year)` - Générer mois
- `generateSingle(data)` - Générer un
- `validate(id)` - Valider
- `markAsPaid(ids)` - Marquer payé
- `downloadPDF(id)` - Télécharger PDF
- `sendByEmail(id, email)` - Envoyer par email
- `getStatistics(params)` - Statistiques
- `export(params)` - Exporter

### 6. Statistics Service (`statistics.service.ts`)

**Méthodes :**
- `getDashboardStats()` - Stats dashboard
- `getEmployeeStats(params)` - Stats employés
- `getAbsenceStats(params)` - Stats absences
- `getTrainingStats(params)` - Stats formations
- `getPayrollStats(params)` - Stats paie
- `generateReport(config)` - Générer rapport
- `getReports(params)` - Historique rapports
- `downloadReport(id)` - Télécharger
- `deleteReport(id)` - Supprimer
- `getTrends(params)` - Tendances

**Types :**
```typescript
interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalAbsences: number;
  pendingAbsences: number;
  // ...
}
```

### 7. Notification Service (`notification.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails
- `markAsRead(id)` - Marquer lu
- `markAllAsRead()` - Tout marquer lu
- `delete(id)` - Supprimer
- `deleteAllRead()` - Supprimer lues
- `getUnreadCount()` - Nombre non lues
- `getPreferences()` - Préférences
- `updatePreferences(prefs)` - MAJ préférences
- `send(data)` - Envoyer
- `sendBulk(data)` - Envoi massif
- `getTemplates()` - Templates
- `createTemplate(data)` - Créer template
- `updateTemplate(id, data)` - MAJ template
- `deleteTemplate(id)` - Supprimer template
- `sendFromTemplate(data)` - Envoyer depuis template
- `subscribePush(subscription)` - S'abonner push
- `unsubscribePush()` - Se désabonner
- `test(data)` - Tester envoi

### 8. Settings Service (`settings.service.ts`)

**Méthodes :**
- `getUserSettings()` - Paramètres utilisateur
- `updateUserSettings(settings)` - MAJ utilisateur
- `resetUserSettings()` - Réinitialiser
- `getSystemSettings()` - Paramètres système
- `updateSystemSettings(settings)` - MAJ système
- `resetSystemSettings()` - Réinitialiser
- `getDepartments()` - Départements
- `createDepartment(data)` - Créer département
- `updateDepartment(id, data)` - MAJ département
- `deleteDepartment(id)` - Supprimer département
- `getPositions(departmentId)` - Postes
- `createPosition(data)` - Créer poste
- `updatePosition(id, data)` - MAJ poste
- `deletePosition(id)` - Supprimer poste
- `getLeaveTypes()` - Types de congés
- `createLeaveType(data)` - Créer type
- `updateLeaveType(id, data)` - MAJ type
- `deleteLeaveType(id)` - Supprimer type
- `exportSettings()` - Exporter
- `importSettings(file)` - Importer

**Types :**
```typescript
interface UserSettings {
  profile: { language, timezone, dateFormat, timeFormat };
  display: { theme, sidebarCollapsed, density, fontSize };
  notifications: { email, push, inApp, sound, desktop };
  privacy: { profileVisibility, showEmail, showPhone, allowMessages };
  calendar: { firstDayOfWeek, workingDays, workingHours, showWeekNumbers, defaultView };
}
```

### 9. Timesheet Service (`timesheet.service.ts`)

**Méthodes :**
- `getAll(params)` - Liste paginée
- `getById(id)` - Détails
- `getByEmployee(id, params)` - Par employé
- `getSummary(id, params)` - Résumé
- `clockIn(data)` - Pointer entrée
- `clockOut(id, data)` - Pointer sortie
- `create(data)` - Créer entrée manuelle
- `update(id, data)` - Modifier
- `delete(id)` - Supprimer
- `approve(data)` - Approuver/Rejeter
- `getPending(params)` - En attente
- `getCurrentEntry(employeeId)` - Entrée actuelle
- `getSchedule(employeeId)` - Emploi du temps
- `updateSchedule(employeeId, schedule)` - MAJ emploi du temps
- `getStatistics(params)` - Statistiques
- `export(params)` - Exporter
- `calculateHours(data)` - Calculer heures
- `detectAnomalies(params)` - Détecter anomalies

## Utilisation

### Import simple

```typescript
import { authService, employeeService } from '@/api';

// Connexion
const { data } = await authService.login({ 
  email: 'user@example.com', 
  password: 'password' 
});

// Liste employés
const { data: employees } = await employeeService.getAll({ 
  page: 1, 
  limit: 10 
});
```

### Avec React Query (recommandé)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { employeeService } from '@/api';

// Hook personnalisé
function useEmployees(params) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => employeeService.getAll(params)
  });
}

// Mutation
function useCreateEmployee() {
  return useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['employees']);
    }
  });
}
```

### Gestion des erreurs

```typescript
try {
  const { data } = await employeeService.create(employeeData);
  console.log('Employé créé:', data);
} catch (error) {
  if (error.status === 422) {
    // Erreurs de validation
    console.error('Validation:', error.data);
  } else {
    console.error('Erreur:', error.message);
  }
}
```

## Types de réponse

### ApiResponse<T>

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}
```

### PaginatedResponse<T>

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## Prochaines étapes

1. **Créer les hooks React Query** pour chaque service
2. **Remplacer les appels mock** dans les composants
3. **Implémenter les tests unitaires** pour les services
4. **Ajouter la gestion des erreurs** globale
5. **Configurer le backend** avec les mêmes endpoints

## Migration depuis l'API legacy

Les anciennes fonctions (`fetchEmployees`, `fetchAbsences`, etc.) sont toujours disponibles pour compatibilité mais marquées comme **LEGACY**. 

**Migration recommandée :**

```typescript
// ❌ Ancien (LEGACY)
import { fetchEmployees } from '@/api';
const employees = await fetchEmployees();

// ✅ Nouveau
import { employeeService } from '@/api';
const { data: employees } = await employeeService.getAll();
```

## Notes importantes

- Tous les services nécessitent une **authentification** (sauf auth.service)
- Le **token JWT** est géré automatiquement par le client
- Les **erreurs 401** déconnectent automatiquement l'utilisateur
- Le **timeout** par défaut est de 30 secondes
- Les **uploads** ont un timeout étendu à 5 minutes
