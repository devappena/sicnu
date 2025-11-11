# ⚡ DÉMARRAGE RAPIDE - Migration React Query

> **Temps de lecture : 3 minutes**  
> **Temps de finalisation : 20 minutes**

---

## 🎯 Objectif

Migrer votre application React du pattern **useState + useEffect** vers **React Query** pour :
- ✅ Cache automatique
- ✅ Synchronisation entre composants
- ✅ Moins de code (-38%)
- ✅ Meilleures performances

---

## 📚 Documentation disponible (139 KB)

| Fichier | Quand le lire |
|---------|---------------|
| **README_MIGRATION_REACT_QUERY.md** | ⭐ **COMMENCER ICI** |
| **INDEX_DOCUMENTATION.md** | Navigation complète |
| **MIGRATION_GUIDE.md** | Patterns de migration |
| **EXEMPLE_MIGRATION_EMPLOYEES.md** | Cas pratique complet |
| **TEMPLATES_REACT_QUERY.md** | Copier-coller rapide |
| **PHASE_3_REPORT.md** | Rapport technique |
| **GUIDE_VISUEL_MIGRATION.md** | Schémas et visuels |

---

## ⚡ Actions immédiates (20 min)

### 1. Créer `useSettings.ts` manuellement (10 min)

**Pourquoi ?** Bug de duplication dans l'outil automatique.

**Comment ?**
1. Ouvrir VS Code
2. Créer `src/hooks/api/useSettings.ts`
3. Copier le template de `PHASE_3_REPORT.md` (chercher "Template useSettings.ts")
4. Coller et sauvegarder

---

### 2. Mettre à jour `index.ts` (1 min)

**Fichier :** `src/hooks/api/index.ts`

```typescript
// Dé-commenter cette ligne :
export * from './useSettings';
```

---

### 3. Configurer QueryClient (5 min)

**Fichier :** `src/main.tsx`

**Installer DevTools (optionnel) :**
```bash
npm install @tanstack/react-query-devtools
```

**Ajouter :**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Dans le render :
<QueryClientProvider client={queryClient}>
  <App />
  {import.meta.env.DEV && <ReactQueryDevtools />}
</QueryClientProvider>
```

---

### 4. Valider (3 min)

```bash
npm run build
npm run dev
```

---

## 🚀 Première migration (2h)

**Page recommandée :** Dashboard (simple)

### Étapes :

1. **Ouvrir** `MIGRATION_GUIDE.md` → Pattern 1 (Fetch simple)
2. **Lire** `EXEMPLE_MIGRATION_EMPLOYEES.md` → Comprendre le flow
3. **Choisir** un template dans `TEMPLATES_REACT_QUERY.md`
4. **Remplacer** `useState + useEffect` par le hook React Query
5. **Tester** avec React Query DevTools (F12)

### Exemple rapide :

**AVANT :**
```tsx
const [employees, setEmployees] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchEmployees = async () => {
    setIsLoading(true);
    const response = await axios.get('/api/employees');
    setEmployees(response.data);
    setIsLoading(false);
  };
  fetchEmployees();
}, []);
```

**APRÈS :**
```tsx
import { useEmployees } from '@/hooks/api';

const { data, isLoading } = useEmployees({ page: 1, limit: 20 });
```

**Réduction :** 12 lignes → 3 lignes (-75%)

---

## 🎓 Hooks disponibles (95+)

### Import unique :
```typescript
import { 
  useEmployees, useCreateEmployee, useUpdateEmployee,
  useAbsences, useApproveAbsence,
  useTrainings, useEnrollTraining,
  useDashboardStats,
  // ... 95+ hooks au total
} from '@/hooks/api';
```

### Catégories :
- 🔐 **Auth** : login, logout, register... (9 hooks)
- 👥 **Employees** : CRUD, search, stats... (12 hooks)
- 🏖️ **Absences** : CRUD, approval... (11 hooks)
- 📚 **Trainings** : CRUD, enrollment... (12 hooks)
- 💰 **Payroll** : generation, validation... (10 hooks)
- 📊 **Statistics** : dashboard, reports... (10 hooks)
- 🔔 **Notifications** : CRUD, preferences... (14 hooks)
- ⏰ **Timesheets** : clock in/out, approval... (18 hooks)

**Total : 95+ hooks** (voir `INDEX_DOCUMENTATION.md` pour la liste complète)

---

## 📖 Templates disponibles (10)

Dans `TEMPLATES_REACT_QUERY.md` :

1. ✅ Liste simple avec recherche
2. ✅ Formulaire de création
3. ✅ Formulaire de modification
4. ✅ Suppression avec confirmation
5. ✅ Dashboard multi-queries
6. ✅ Filtres avancés
7. ✅ Détails avec requête conditionnelle
8. ✅ Toggle/Switch optimistic update
9. ✅ Export avec progression
10. ✅ Workflow d'approbation

**Usage :** Copier-coller → Adapter → Tester

---

## 🆘 Problèmes courants

| Erreur | Solution rapide |
|--------|-----------------|
| `Cannot read 'data' of undefined` | Utiliser `data?.data` |
| Cache ne se rafraîchit pas | Vérifier invalidation dans le hook |
| Trop de re-renders | Augmenter `staleTime` |
| Hook introuvable | Vérifier `import { ... } from '@/hooks/api'` |

**Plus de détails :** `MIGRATION_GUIDE.md` → Section Troubleshooting

---

## 📊 Résultats attendus

### Métriques (exemple page Employees) :
- **Code :** 485 lignes → 300 lignes (-38%)
- **Performance :** 0.5s → 0.2s (cache)
- **Filtrage :** 500ms → 50ms (serveur)
- **Synchronisation :** Automatique entre composants

### Avant/Après :
```
AVANT : useState + useEffect + mock data
├─ 8 états à gérer
├─ Filtrage client-side
├─ Pas de cache
└─ Synchronisation manuelle

APRÈS : React Query hooks
├─ 4 états UI
├─ Filtrage serveur
├─ Cache automatique
└─ Synchronisation automatique
```

---

## ✅ Checklist complète

### Phase 3 - Finalisation (20 min)
- [ ] Créer `useSettings.ts` manuellement
- [ ] Mettre à jour `index.ts`
- [ ] Configurer `QueryClient` dans `main.tsx`
- [ ] Valider le build

### Phase 4 - Migration composants (2-3 jours)
- [ ] Dashboard (2h)
- [ ] Employees (4h)
- [ ] Absences (3h)
- [ ] Trainings (3h)
- [ ] Profile (2h)

### Phase 5 - Tests & Validation (1 jour)
- [ ] Tester toutes les mutations
- [ ] Vérifier l'invalidation du cache
- [ ] Tester les états loading/error
- [ ] Valider la synchronisation

---

## 🎯 Prochaines étapes

1. ✅ **MAINTENANT** : Lire `README_MIGRATION_REACT_QUERY.md`
2. ✅ **Dans 20 min** : Finaliser Phase 3 (useSettings.ts + config)
3. ✅ **Aujourd'hui** : Migrer Dashboard (2h)
4. ✅ **Cette semaine** : Migrer Employees, Absences, Trainings
5. ✅ **Semaine prochaine** : Validation formulaires + Tests

---

## 📞 Ressources

- **Documentation complète :** Voir tous les fichiers .md dans le dossier racine
- **TanStack Query :** https://tanstack.com/query/v5
- **Templates :** `TEMPLATES_REACT_QUERY.md`
- **Troubleshooting :** `MIGRATION_GUIDE.md`

---

## 🎉 Résumé

✅ **7 guides** de migration (139 KB)  
✅ **95+ hooks** React Query prêts  
✅ **10 templates** copier-coller  
✅ **1 exemple** complet (Employees)  
✅ **20 minutes** pour finaliser  

**Vous avez TOUT pour réussir !** 🚀

---

**Créé le :** 4 novembre 2025  
**Statut :** Phase 3 à 90% (useSettings.ts à finaliser)  
**Temps estimé :** 20 minutes pour 100%  

👉 **ACTION IMMÉDIATE :** Ouvrir `README_MIGRATION_REACT_QUERY.md`
