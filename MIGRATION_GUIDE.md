# 🚀 Guide de Migration vers React Query

## Table des matières
1. [Introduction](#introduction)
2. [Configuration initiale](#configuration-initiale)
3. [Patterns de migration](#patterns-de-migration)
4. [Exemples avant/après](#exemples-avantaprès)
5. [Checklist de migration](#checklist-de-migration)
6. [Troubleshooting](#troubleshooting)

---

## Introduction

Ce guide vous accompagne dans la migration des composants React utilisant `useState` + `useEffect` pour la gestion des données serveur vers **React Query** avec nos hooks personnalisés.

### Bénéfices de la migration

✅ **Moins de code** : Suppression de useState, useEffect, isLoading manuel  
✅ **Cache automatique** : Pas de re-fetch inutile des mêmes données  
✅ **Synchronisation** : Invalidation intelligente du cache entre composants  
✅ **UX améliorée** : États de chargement, erreurs, optimistic updates  
✅ **TypeScript** : Types automatiques pour toutes les réponses API  
✅ **DevTools** : Inspection du cache et des requêtes en temps réel  

---

## Configuration initiale

### 1. Installer React Query DevTools (optionnel)

```bash
npm install @tanstack/react-query-devtools
```

### 2. Configurer le QueryClient dans `main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './index.css';

// Configuration globale du QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute (les données restent "fraîches")
      gcTime: 5 * 60 * 1000, // 5 minutes (garde en cache)
      retry: 1, // 1 seule retry en cas d'erreur
      refetchOnWindowFocus: false, // Pas de re-fetch au focus
      refetchOnReconnect: true, // Re-fetch à la reconnexion
    },
    mutations: {
      retry: 0, // Pas de retry pour les mutations
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools visible uniquement en développement */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </StrictMode>
);
```

### 3. Variables d'environnement

Vérifier que `.env.development` contient :

```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
VITE_DEBUG=true
VITE_API_TIMEOUT=30000
```

---

## Patterns de migration

### Pattern 1️⃣ : Fetch simple avec useState + useEffect

#### ❌ AVANT (ancien pattern)

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {employees.map(emp => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </div>
  );
}
```

**Problèmes :**
- 3 états à gérer manuellement (data, loading, error)
- Pas de cache → re-fetch à chaque visite
- Pas de gestion de la synchronisation
- Logique fetch dupliquée partout

#### ✅ APRÈS (React Query)

```tsx
import { useEmployees } from '@/hooks/api';
import { LoadingSpinner, ErrorMessage, EmployeeCard } from '@/components';

function EmployeeList() {
  const { data, isLoading, error } = useEmployees({ page: 1, limit: 20 });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      {data?.data.map(emp => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </div>
  );
}
```

**Avantages :**
- **90% moins de code** (3 lignes vs 25 lignes)
- Cache automatique (1ère visite = fetch, suivantes = cache)
- Types TypeScript automatiques
- États gérés par React Query

---

### Pattern 2️⃣ : Fetch avec paramètres/filtres

#### ❌ AVANT

```tsx
import { useState, useEffect } from 'react';

function EmployeeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!searchQuery && !department) return;
      
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (department) params.append('department', department);
        
        const response = await axios.get(`/api/employees?${params}`);
        setEmployees(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce
    const timer = setTimeout(fetchFiltered, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, department]);

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Rechercher..."
      />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Tous les départements</option>
        <option value="IT">IT</option>
        <option value="RH">RH</option>
      </select>
      
      {isLoading ? <LoadingSpinner /> : (
        employees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)
      )}
    </div>
  );
}
```

#### ✅ APRÈS

```tsx
import { useState } from 'react';
import { useEmployeeSearch } from '@/hooks/api';

function EmployeeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');

  // Le hook gère automatiquement le debounce et le cache
  const { data: employees, isLoading } = useEmployeeSearch({
    query: searchQuery,
    department,
  });

  return (
    <div>
      <input 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        placeholder="Rechercher..."
      />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option value="">Tous les départements</option>
        <option value="IT">IT</option>
        <option value="RH">RH</option>
      </select>
      
      {isLoading ? <LoadingSpinner /> : (
        employees?.data.map(emp => <EmployeeCard key={emp.id} employee={emp} />)
      )}
    </div>
  );
}
```

**Note :** Le hook `useEmployeeSearch` est configuré avec `enabled: query.length > 0` pour éviter les requêtes vides.

---

### Pattern 3️⃣ : Création/Modification (Mutations)

#### ❌ AVANT

```tsx
import { useState } from 'react';
import axios from 'axios';

function CreateEmployeeModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post('/api/employees', formData);
      onSuccess(response.data); // Notifier le parent
      onClose();
      
      // Problème : le parent doit manuellement rafraîchir la liste !
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Erreur' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.firstName} 
        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
      />
      {/* ... autres champs ... */}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Création...' : 'Créer'}
      </button>
      {errors.submit && <ErrorMessage message={errors.submit} />}
    </form>
  );
}
```

#### ✅ APRÈS

```tsx
import { useState } from 'react';
import { useCreateEmployee } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';

function CreateEmployeeModal({ onClose }) {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const { showToast } = useToast();
  
  // Mutation avec gestion automatique du cache
  const createEmployee = useCreateEmployee();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createEmployee.mutateAsync(formData);
      showToast('success', 'Employé créé avec succès');
      onClose();
      
      // ✅ Le cache de la liste est automatiquement invalidé !
      // ✅ Tous les composants utilisant useEmployees() se rafraîchissent !
      
    } catch (err) {
      showToast('error', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.firstName} 
        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
      />
      {/* ... autres champs ... */}
      
      <button type="submit" disabled={createEmployee.isPending}>
        {createEmployee.isPending ? 'Création...' : 'Créer'}
      </button>
      {createEmployee.error && <ErrorMessage message={createEmployee.error.message} />}
    </form>
  );
}
```

**Avantages :**
- ✅ Invalidation automatique du cache (liste + stats)
- ✅ Tous les composants se synchronisent automatiquement
- ✅ Pas besoin de callback `onSuccess` pour notifier le parent
- ✅ États `isPending` et `error` gérés par la mutation

---

### Pattern 4️⃣ : Optimistic Updates (Mise à jour instantanée)

#### ❌ AVANT

```tsx
function ToggleEmployeeStatus({ employeeId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    
    // Optimistic update local
    setStatus(newStatus);
    setIsUpdating(true);
    
    try {
      await axios.patch(`/api/employees/${employeeId}/status`, { status: newStatus });
    } catch (err) {
      // Rollback en cas d'erreur
      setStatus(currentStatus);
      alert('Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button onClick={handleToggle} disabled={isUpdating}>
      {status === 'active' ? 'Désactiver' : 'Activer'}
    </button>
  );
}
```

#### ✅ APRÈS

```tsx
import { useToggleEmployeeStatus } from '@/hooks/api';

function ToggleEmployeeStatus({ employeeId, currentStatus }) {
  const toggleStatus = useToggleEmployeeStatus();

  const handleToggle = () => {
    toggleStatus.mutate({ 
      id: employeeId, 
      status: currentStatus === 'active' ? 'inactive' : 'active' 
    });
    
    // ✅ L'optimistic update est géré automatiquement par le hook
    // ✅ Rollback automatique en cas d'erreur
    // ✅ Cache invalidé après succès
  };

  return (
    <button onClick={handleToggle} disabled={toggleStatus.isPending}>
      {currentStatus === 'active' ? 'Désactiver' : 'Activer'}
    </button>
  );
}
```

---

### Pattern 5️⃣ : Requêtes multiples parallèles

#### ❌ AVANT

```tsx
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [statsRes, employeesRes, absencesRes] = await Promise.all([
          axios.get('/api/statistics/dashboard'),
          axios.get('/api/employees?limit=5'),
          axios.get('/api/absences/pending')
        ]);
        
        setStats(statsRes.data);
        setEmployees(employeesRes.data);
        setAbsences(absencesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <StatsOverview stats={stats} />
      <RecentEmployees employees={employees} />
      <PendingAbsences absences={absences} />
    </div>
  );
}
```

#### ✅ APRÈS

```tsx
import { useDashboardStats, useEmployees, usePendingAbsences } from '@/hooks/api';

function Dashboard() {
  // Les 3 requêtes s'exécutent en parallèle automatiquement
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: employees, isLoading: employeesLoading } = useEmployees({ limit: 5 });
  const { data: absences, isLoading: absencesLoading } = usePendingAbsences();

  const isLoading = statsLoading || employeesLoading || absencesLoading;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <StatsOverview stats={stats} />
      <RecentEmployees employees={employees?.data} />
      <PendingAbsences absences={absences?.data} />
    </div>
  );
}
```

**Avantages :**
- ✅ Requêtes parallèles automatiques
- ✅ Cache indépendant pour chaque ressource
- ✅ Refetch sélectif (seule la donnée modifiée se rafraîchit)

---

### Pattern 6️⃣ : Pagination

#### ❌ AVANT

```tsx
function EmployeesPaginated() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/employees?page=${currentPage}&limit=20`);
        setEmployees(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [currentPage]);

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : (
        employees.map(emp => <EmployeeCard key={emp.id} employee={emp} />)
      )}
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

#### ✅ APRÈS

```tsx
import { useState } from 'react';
import { useEmployees } from '@/hooks/api';

function EmployeesPaginated() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading } = useEmployees({ 
    page: currentPage, 
    limit: 20 
  });

  return (
    <div>
      {isLoading ? <LoadingSpinner /> : (
        data?.data.map(emp => <EmployeeCard key={emp.id} employee={emp} />)
      )}
      
      <Pagination 
        currentPage={currentPage}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

**Bonus :** React Query met en cache chaque page séparément !

---

### Pattern 7️⃣ : Requêtes conditionnelles

#### ❌ AVANT

```tsx
function EmployeeDetails({ employeeId }) {
  const [employee, setEmployee] = useState(null);
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployee = async () => {
      const response = await axios.get(`/api/employees/${employeeId}`);
      setEmployee(response.data);
    };

    fetchEmployee();
  }, [employeeId]);

  useEffect(() => {
    if (!employee) return; // Attendre que l'employé soit chargé

    const fetchAbsences = async () => {
      const response = await axios.get(`/api/absences?employeeId=${employee.id}`);
      setAbsences(response.data);
    };

    fetchAbsences();
  }, [employee]);

  return <div>...</div>;
}
```

#### ✅ APRÈS

```tsx
import { useEmployee, useAbsencesByEmployee } from '@/hooks/api';

function EmployeeDetails({ employeeId }) {
  // 1ère requête : charger l'employé
  const { data: employee } = useEmployee(employeeId);
  
  // 2ème requête : charger ses absences (uniquement si employé chargé)
  const { data: absences } = useAbsencesByEmployee(
    employee?.id, 
    { enabled: !!employee }
  );

  return <div>...</div>;
}
```

**Note :** Le paramètre `enabled` empêche la 2ème requête de s'exécuter avant que `employee` soit disponible.

---

## Exemples avant/après complets

### Exemple 1 : Page Employés complète

#### ❌ AVANT (120 lignes)

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch initial et à chaque changement de filtre
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: '20'
        });
        
        if (searchQuery) params.append('search', searchQuery);
        if (department) params.append('department', department);
        
        const response = await axios.get(`/api/employees?${params}`);
        setEmployees(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchEmployees, 300); // Debounce
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, department]);

  const handleCreate = async (formData) => {
    setIsCreating(true);
    try {
      await axios.post('/api/employees', formData);
      setIsCreateModalOpen(false);
      
      // Rafraîchir manuellement la liste
      const response = await axios.get('/api/employees?page=1&limit=20');
      setEmployees(response.data.data);
      setCurrentPage(1);
    } catch (err) {
      alert('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (!confirm('Confirmer la suppression ?')) return;
    
    try {
      await axios.delete(`/api/employees/${employeeId}`);
      
      // Rafraîchir manuellement
      const response = await axios.get(`/api/employees?page=${currentPage}&limit=20`);
      setEmployees(response.data.data);
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="filters">
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher..."
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Tous</option>
          <option value="IT">IT</option>
        </select>
        <button onClick={() => setIsCreateModalOpen(true)}>
          Nouvel employé
        </button>
      </div>

      <div className="employee-list">
        {employees.map(emp => (
          <EmployeeCard 
            key={emp.id} 
            employee={emp}
            onDelete={() => handleDelete(emp.id)}
          />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {isCreateModalOpen && (
        <CreateEmployeeModal 
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}
```

#### ✅ APRÈS (45 lignes)

```tsx
import { useState } from 'react';
import { useEmployees, useDeleteEmployee } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';

function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showToast } = useToast();

  // Fetch automatique avec cache et debounce
  const { data, isLoading, error } = useEmployees({ 
    page: currentPage, 
    limit: 20,
    search: searchQuery,
    department 
  });

  const deleteEmployee = useDeleteEmployee();

  const handleDelete = async (employeeId: string) => {
    if (!confirm('Confirmer la suppression ?')) return;
    
    try {
      await deleteEmployee.mutateAsync(employeeId);
      showToast('success', 'Employé supprimé');
      // ✅ Cache automatiquement invalidé, liste rafraîchie
    } catch (err) {
      showToast('error', err.message);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <div className="filters">
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher..."
        />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Tous</option>
          <option value="IT">IT</option>
        </select>
        <button onClick={() => setIsCreateModalOpen(true)}>
          Nouvel employé
        </button>
      </div>

      <div className="employee-list">
        {data?.data.map(emp => (
          <EmployeeCard 
            key={emp.id} 
            employee={emp}
            onDelete={() => handleDelete(emp.id)}
          />
        ))}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={data?.pagination.totalPages || 1}
        onPageChange={setCurrentPage}
      />

      {isCreateModalOpen && (
        <CreateEmployeeModal 
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}
```

**Réduction : 120 lignes → 45 lignes (63% moins de code)**

---

## Checklist de migration

### Phase 1 : Configuration
- [ ] Installer `@tanstack/react-query-devtools`
- [ ] Configurer `QueryClientProvider` dans `main.tsx`
- [ ] Ajouter `ReactQueryDevtools` (dev uniquement)
- [ ] Vérifier `.env.development`
- [ ] Tester que le serveur démarre sans erreur

### Phase 2 : Migration par page (recommandé)

**Ordre suggéré :**

1. [ ] **Pages simples d'abord** (Dashboard, Profile)
   - Remplacer `useState` + `useEffect` par hooks React Query
   - Tester le cache (ouvrir DevTools)
   - Vérifier la synchronisation entre onglets

2. [ ] **Pages avec formulaires** (Employees, Absences)
   - Migrer les listes vers `useEmployees()`, `useAbsences()`
   - Remplacer les soumissions de formulaire par mutations
   - Tester l'invalidation du cache

3. [ ] **Pages avec filtres/recherche** (Trainings, Timesheets)
   - Utiliser les hooks `useSearch` avec `enabled`
   - Tester le debounce automatique

4. [ ] **Pages complexes** (Statistics, WorkflowManagement)
   - Combiner plusieurs hooks
   - Gérer les requêtes conditionnelles

### Phase 3 : Optimisations
- [ ] Configurer `staleTime` personnalisé par type de données
- [ ] Ajouter `prefetch` sur les liens (hover)
- [ ] Implémenter optimistic updates sur toggles/switches
- [ ] Configurer la persistance du cache (localStorage)

### Phase 4 : Tests
- [ ] Tester toutes les mutations (create, update, delete)
- [ ] Vérifier l'invalidation du cache après mutations
- [ ] Tester les requêtes conditionnelles
- [ ] Vérifier les états de loading/error
- [ ] Tester la pagination

---

## Troubleshooting

### Problème 1 : "Cannot read property 'data' of undefined"

**Cause :** Accès à `data` avant que la requête soit résolue.

**Solution :**
```tsx
// ❌ MAUVAIS
const { data } = useEmployees();
return <div>{data.data.length}</div>; // Erreur !

// ✅ BON
const { data } = useEmployees();
return <div>{data?.data.length || 0}</div>;

// ✅ MEILLEUR
const { data, isLoading } = useEmployees();
if (isLoading) return <LoadingSpinner />;
return <div>{data.data.length}</div>;
```

---

### Problème 2 : Les données ne se rafraîchissent pas après mutation

**Cause :** Le hook de mutation n'invalide pas le bon cache.

**Solution :** Vérifier que les `queryKeys` correspondent.

```tsx
// Dans le hook useCreateEmployee
export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => employeeService.create(data),
    onSuccess: () => {
      // ✅ Invalider les LISTES d'employés
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      
      // ✅ Invalider les statistiques aussi
      queryClient.invalidateQueries({ queryKey: employeeKeys.statistics() });
    },
  });
}
```

---

### Problème 3 : Trop de re-renders

**Cause :** `staleTime` trop court ou `refetchOnWindowFocus: true`.

**Solution :**
```tsx
// Configuration globale dans main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Désactiver
    },
  },
});
```

---

### Problème 4 : "Query key already exists"

**Cause :** Essayer de créer plusieurs hooks avec la même `queryKey`.

**Solution :** Utiliser des paramètres pour différencier :
```tsx
// ❌ MAUVAIS - Même clé
useQuery({ queryKey: ['employees'], ... });
useQuery({ queryKey: ['employees'], ... });

// ✅ BON - Clés différentes
useQuery({ queryKey: ['employees', 'list'], ... });
useQuery({ queryKey: ['employees', 'detail', id], ... });
```

---

### Problème 5 : Le cache ne se vide jamais

**Cause :** `gcTime` (garbage collection time) trop long.

**Solution :**
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000, // 5 minutes (par défaut : 5min)
    },
  },
});
```

---

### Problème 6 : "Network Error" en développement

**Cause :** L'API backend n'est pas démarrée ou mauvaise URL.

**Solution :**
1. Vérifier `.env.development` : `VITE_API_BASE_URL=http://localhost:3000/api`
2. Démarrer le backend : `cd backend && npm run dev`
3. Vérifier que le port est correct

**Workaround temporaire (mock) :**
```tsx
// Dans src/api/client.ts
import { AxiosError } from 'axios';

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.code === 'ERR_NETWORK') {
      console.warn('Backend non disponible, utilisation des données mock');
      // Retourner des données mock
      return { data: mockData };
    }
    return Promise.reject(error);
  }
);
```

---

## Ressources

### Documentation officielle
- [TanStack Query v5](https://tanstack.com/query/v5/docs/react/overview)
- [React Query DevTools](https://tanstack.com/query/v5/docs/react/devtools)

### Nos fichiers de référence
- `src/hooks/api/useEmployees.ts` - Exemple complet avec 12 hooks
- `src/hooks/api/useAbsences.ts` - Workflow d'approbation
- `PHASE_3_REPORT.md` - Documentation complète Phase 3

### Aide
- Ouvrir les DevTools React Query (F12 → onglet "React Query")
- Inspecter le cache, les requêtes en cours, les mutations
- Vérifier les `queryKeys` et les temps de cache

---

**Date :** 4 novembre 2025  
**Version :** 1.0  
**Prochaine étape :** Migrer 1 page simple (Dashboard) puis documenter les résultats  

---

## Quick Reference : Tous les hooks disponibles

```typescript
// Authentication
import { 
  useCurrentUser, useLogin, useRegister, useLogout,
  useForgotPassword, useResetPassword, useChangePassword
} from '@/hooks/api';

// Employees
import { 
  useEmployees, useEmployee, useCreateEmployee, useUpdateEmployee,
  useDeleteEmployee, useEmployeeSearch, useEmployeesByDepartment,
  useEmployeeStatistics, useToggleEmployeeStatus, useExportEmployees
} from '@/hooks/api';

// Absences
import { 
  useAbsences, useAbsence, usePendingAbsences, useAbsencesByEmployee,
  useAbsenceBalance, useCreateAbsence, useUpdateAbsence, useDeleteAbsence,
  useApproveAbsence, useRejectAbsence, useCheckAbsenceConflicts
} from '@/hooks/api';

// Trainings
import { 
  useTrainings, useTraining, useUpcomingTrainings, useTrainingParticipants,
  useCreateTraining, useUpdateTraining, useDeleteTraining,
  useEnrollTraining, useUnenrollTraining, useCompleteTraining,
  useGenerateCertificate
} from '@/hooks/api';

// Payroll
import { 
  usePayslips, usePayslip, usePayslipsByEmployee, usePayrollStatistics,
  useGenerateMonthPayroll, useValidatePayslip, useMarkAsPaid,
  useDownloadPayslipPDF, useSendPayslipEmail
} from '@/hooks/api';

// Statistics
import { 
  useDashboardStats, useEmployeeStats, useAbsenceStats,
  useTrainingStats, usePayrollStats, useTrends,
  useGenerateReport, useReports, useDownloadReport
} from '@/hooks/api';

// Notifications
import { 
  useNotifications, useUnreadNotificationsCount,
  useMarkAsRead, useMarkAllAsRead, useSendNotification,
  useNotificationPreferences, useUpdateNotificationPreferences
} from '@/hooks/api';

// Timesheets
import { 
  useTimesheets, useTimesheet, useTimesheetsByEmployee,
  useTimesheetSummary, usePendingTimesheets, useCurrentTimesheet,
  useClockIn, useClockOut, useCreateTimesheet, useUpdateTimesheet,
  useApproveTimesheets, useDetectTimesheetAnomalies
} from '@/hooks/api';
```

**Total : 95+ hooks prêts à l'emploi !**
