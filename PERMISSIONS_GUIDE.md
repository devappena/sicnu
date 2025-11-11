# 🔐 Guide du Système de Permissions et Rôles

## 📋 Vue d'ensemble

Le système de permissions permet de contrôler précisément qui peut accéder à quelles pages et fonctionnalités. Il supporte 4 niveaux de rôles avec des permissions granulaires.

---

## 👥 Hiérarchie des Rôles

### 1. Super Admin (super_admin)
**Accès complet à TOUT** - Niveau le plus élevé

✅ **Peut faire :**
- Toutes les actions possibles dans l'application
- Gérer les paramètres système
- Approuver les changements de rôle
- Gérer tous les utilisateurs sans restriction

📊 **Pages accessibles :**
- ✅ Toutes les pages sans exception

### 2. Admin (admin)
**Gestion complète** - Niveau administratif

✅ **Peut faire :**
- Gérer les employés (CRUD complet)
- Approuver absences, formations, timesheets
- Gérer la paie
- Voir statistiques avancées
- Gérer les workflows
- Approuver changements de rôle

❌ **Ne peut PAS :**
- Accéder aux paramètres système sensibles (réservé super_admin)

📊 **Pages accessibles :**
- ✅ Dashboard, Employés, Absences, Formations
- ✅ Timesheet, Paie, Documents, Évaluations
- ✅ Statistiques, Statistiques Avancées
- ✅ Gestion Workflow
- ❌ Paramètres système

### 3. RH (hr)
**Gestion Ressources Humaines** - Niveau RH

✅ **Peut faire :**
- Modifier les employés (pas créer/supprimer)
- Approuver absences et formations
- Créer et gérer les formations
- Voir les évaluations
- Gérer les documents RH
- Approuver timesheets

❌ **Ne peut PAS :**
- Créer/supprimer des employés
- Gérer la paie
- Voir statistiques avancées
- Gérer les workflows
- Approuver changements de rôle

📊 **Pages accessibles :**
- ✅ Dashboard, Employés (lecture/modification)
- ✅ Absences, Formations, Timesheet
- ✅ Documents, Évaluations
- ✅ Statistiques (basiques)
- ❌ Paie, Statistiques Avancées, Workflow, Paramètres

### 4. Employé (employee)
**Consultation et gestion personnelle** - Niveau utilisateur

✅ **Peut faire :**
- Voir ses propres informations
- Demander des absences (pour soi)
- Consulter les formations disponibles
- Gérer son timesheet
- Voir ses évaluations
- Demander changement de rôle

❌ **Ne peut PAS :**
- Modifier d'autres employés
- Approuver des demandes
- Accéder à la paie
- Voir statistiques
- Gérer paramètres/workflow

📊 **Pages accessibles :**
- ✅ Dashboard, Profil, Notifications
- ✅ Employés (lecture seule)
- ✅ Absences (créer pour soi), Formations (consulter)
- ✅ Timesheet (son propre), Documents
- ✅ Évaluations (ses propres)
- ✅ Demande de rôle
- ❌ Paie, Statistiques, Workflow, Paramètres

---

## 🛠️ Utilisation dans le Code

### 1. Hook usePermissions

Le hook principal pour vérifier les permissions :

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const {
    // Rôle utilisateur
    userRole, // 'super_admin' | 'admin' | 'hr' | 'employee'
    
    // Vérifications de rôle
    isAdmin,         // true si admin ou super_admin
    isSuperAdmin,    // true si super_admin
    isHR,           // true si hr
    isEmployee,     // true si employee
    
    // Vérifications de permissions
    canCreateEmployee,
    canEditEmployee,
    canDeleteEmployee,
    canApproveAbsence,
    canManagePayroll,
    // ... et bien d'autres
    
    // Helpers
    getRoleLabel,    // Ex: "Super Administrateur"
    getRoleColor,    // Ex: "bg-purple-100 text-purple-800"
  } = usePermissions();
  
  return (
    <div>
      {canCreateEmployee && (
        <button>Créer Employé</button>
      )}
    </div>
  );
}
```

### 2. Protection des Routes

Dans `App.tsx`, protéger les routes avec `allowedRoles` :

```typescript
// Route accessible à tous les utilisateurs authentifiés
<Route path="dashboard" element={<Dashboard />} />

// Route réservée aux admin et super_admin
<Route 
  path="payroll" 
  element={
    <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
      <Payroll />
    </ProtectedRoute>
  } 
/>

// Route réservée uniquement au super_admin
<Route 
  path="settings" 
  element={
    <ProtectedRoute allowedRoles={['super_admin']}>
      <Settings />
    </ProtectedRoute>
  } 
/>
```

### 3. Affichage Conditionnel dans les Composants

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function EmployeeList() {
  const { 
    canCreateEmployee, 
    canDeleteEmployee,
    isAdmin 
  } = usePermissions();

  return (
    <div>
      <h1>Liste des Employés</h1>
      
      {/* Bouton visible seulement si permission */}
      {canCreateEmployee && (
        <button onClick={handleCreate}>
          + Nouvel Employé
        </button>
      )}
      
      {/* Section admin uniquement */}
      {isAdmin && (
        <div className="admin-panel">
          <h2>Panneau Administration</h2>
          {/* ... */}
        </div>
      )}
      
      {/* Actions conditionnelles */}
      <table>
        {employees.map(emp => (
          <tr key={emp.id}>
            <td>{emp.name}</td>
            <td>
              {canDeleteEmployee && (
                <button onClick={() => handleDelete(emp.id)}>
                  Supprimer
                </button>
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
```

### 4. Badges de Rôle

Afficher le rôle d'un utilisateur avec style :

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function UserProfile() {
  const { getRoleLabel, getRoleColor } = usePermissions();

  return (
    <div>
      <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor()}`}>
        {getRoleLabel()}
      </span>
    </div>
  );
}
```

---

## 📊 Matrice des Permissions

| Permission | super_admin | admin | hr | employee |
|-----------|-------------|-------|-----|----------|
| **Dashboard** |
| Voir dashboard | ✅ | ✅ | ✅ | ✅ |
| **Employés** |
| Voir liste | ✅ | ✅ | ✅ | ✅ (limité) |
| Créer employé | ✅ | ✅ | ❌ | ❌ |
| Modifier employé | ✅ | ✅ | ✅ | ❌ |
| Supprimer employé | ✅ | ✅ | ❌ | ❌ |
| **Absences** |
| Voir absences | ✅ | ✅ | ✅ | ✅ (siennes) |
| Créer absence | ✅ | ✅ | ✅ | ✅ (pour soi) |
| Approuver absence | ✅ | ✅ | ✅ | ❌ |
| **Formations** |
| Voir formations | ✅ | ✅ | ✅ | ✅ |
| Créer formation | ✅ | ✅ | ✅ | ❌ |
| Gérer formations | ✅ | ✅ | ✅ | ❌ |
| **Paie** |
| Voir paie | ✅ | ✅ | ❌ | ❌ |
| Gérer paie | ✅ | ✅ | ❌ | ❌ |
| **Statistiques** |
| Voir stats basiques | ✅ | ✅ | ✅ | ❌ |
| Voir stats avancées | ✅ | ✅ | ❌ | ❌ |
| **Système** |
| Gérer workflow | ✅ | ✅ | ❌ | ❌ |
| Gérer paramètres | ✅ | ❌ | ❌ | ❌ |
| Approuver rôle | ✅ | ✅ | ❌ | ❌ |

---

## 🎨 Exemples Pratiques

### Exemple 1 : Formulaire d'Employé

```typescript
function EmployeeForm({ employee, mode }) {
  const { 
    canCreateEmployee, 
    canEditEmployee,
    canDeleteEmployee 
  } = usePermissions();

  // Bloquer l'accès si pas les permissions
  if (mode === 'create' && !canCreateEmployee) {
    return <div>Vous n'avez pas les droits de créer un employé</div>;
  }
  
  if (mode === 'edit' && !canEditEmployee) {
    return <div>Vous n'avez pas les droits de modifier cet employé</div>;
  }

  return (
    <form>
      {/* Champs du formulaire */}
      
      <div className="actions">
        {mode === 'edit' && canDeleteEmployee && (
          <button type="button" onClick={handleDelete}>
            Supprimer
          </button>
        )}
        
        <button type="submit">
          {mode === 'create' ? 'Créer' : 'Modifier'}
        </button>
      </div>
    </form>
  );
}
```

### Exemple 2 : Menu Sidebar Dynamique

```typescript
function Sidebar() {
  const { 
    isAdmin, 
    isSuperAdmin,
    canViewPayroll,
    canViewStatistics 
  } = usePermissions();

  const menuItems = [
    { label: 'Dashboard', path: '/', visible: true },
    { label: 'Employés', path: '/employees', visible: true },
    { label: 'Absences', path: '/absences', visible: true },
    { label: 'Formations', path: '/trainings', visible: true },
    { label: 'Paie', path: '/payroll', visible: canViewPayroll },
    { label: 'Statistiques', path: '/statistics', visible: canViewStatistics },
    { label: 'Workflow', path: '/workflow-management', visible: isAdmin },
    { label: 'Paramètres', path: '/settings', visible: isSuperAdmin },
  ];

  return (
    <nav>
      {menuItems.filter(item => item.visible).map(item => (
        <Link key={item.path} to={item.path}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

### Exemple 3 : Boutons d'Action Conditionnels

```typescript
function AbsenceCard({ absence }) {
  const { canApproveAbsence, isEmployee } = usePermissions();

  return (
    <div className="card">
      <h3>{absence.employeeName}</h3>
      <p>{absence.reason}</p>
      
      {/* Employé peut voir ses propres absences */}
      {isEmployee && absence.status === 'pending' && (
        <button onClick={() => handleCancel(absence.id)}>
          Annuler ma demande
        </button>
      )}
      
      {/* Admin/HR peut approuver */}
      {canApproveAbsence && absence.status === 'pending' && (
        <div className="actions">
          <button onClick={() => handleApprove(absence.id)}>
            Approuver
          </button>
          <button onClick={() => handleReject(absence.id)}>
            Rejeter
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Changement de Rôle

Les utilisateurs peuvent demander un changement de rôle via la page `/demande-role`.

**Workflow :**
1. Employé demande un nouveau rôle (ex: employee → hr)
2. Admin/Super Admin reçoit notification
3. Admin/Super Admin approuve ou rejette
4. Rôle mis à jour automatiquement

**Règles de gestion :**
- `super_admin` peut gérer tous les rôles
- `admin` peut gérer `hr` et `employee`
- `hr` et `employee` ne peuvent pas gérer de rôles

---

## 🚨 Gestion des Erreurs

### Page Unauthorized (403)

Quand un utilisateur essaie d'accéder à une page sans permission :

```typescript
// Redirection automatique par ProtectedRoute
<Navigate to="/unauthorized" replace />
```

La page `/unauthorized` affiche :
- ✅ Message d'erreur clair
- ✅ Rôle actuel de l'utilisateur
- ✅ Suggestions d'actions
- ✅ Liens vers accueil ou page précédente

---

## ✅ Bonnes Pratiques

### 1. Toujours vérifier les permissions côté frontend ET backend
```typescript
// Frontend (UX)
{canDeleteEmployee && <button>Supprimer</button>}

// Backend (Sécurité)
if (!user.hasPermission('delete_employee')) {
  throw new ForbiddenError();
}
```

### 2. Utiliser les raccourcis du hook
```typescript
// ❌ Mauvais
const { hasPermission } = usePermissions();
if (hasPermission('create_employee')) { ... }

// ✅ Bon
const { canCreateEmployee } = usePermissions();
if (canCreateEmployee) { ... }
```

### 3. Grouper les vérifications de rôle
```typescript
// ❌ Mauvais
if (role === 'admin' || role === 'super_admin') { ... }

// ✅ Bon
const { isAdmin } = usePermissions();
if (isAdmin) { ... }
```

### 4. Protéger les routes sensibles
```typescript
// ❌ Mauvais - Pas de protection
<Route path="settings" element={<Settings />} />

// ✅ Bon - Protection avec rôles
<Route 
  path="settings" 
  element={
    <ProtectedRoute allowedRoles={['super_admin']}>
      <Settings />
    </ProtectedRoute>
  } 
/>
```

---

## 📝 Checklist d'Implémentation

Quand vous créez une nouvelle fonctionnalité :

- [ ] Définir quels rôles peuvent y accéder
- [ ] Ajouter la permission dans `permissions.ts` si nécessaire
- [ ] Protéger la route dans `App.tsx`
- [ ] Utiliser `usePermissions` dans le composant
- [ ] Afficher/cacher les boutons selon permissions
- [ ] Tester avec chaque rôle (super_admin, admin, hr, employee)
- [ ] Vérifier la page Unauthorized fonctionne
- [ ] Documenter les permissions dans les commentaires

---

## 🔍 Debugging

### Voir les permissions d'un rôle

```typescript
import { getRolePermissions } from '@/utils/permissions';

console.log('Permissions admin:', getRolePermissions('admin'));
console.log('Permissions employee:', getRolePermissions('employee'));
```

### Tester l'accès à une page

```typescript
import { canAccessPage } from '@/utils/permissions';

console.log('Admin peut accéder /payroll:', canAccessPage('admin', '/payroll')); // true
console.log('Employee peut accéder /payroll:', canAccessPage('employee', '/payroll')); // false
```

---

**Version**: 1.0.0  
**Dernière mise à jour**: Novembre 2025
