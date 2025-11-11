# 🎨 Templates de composants React Query

Ce fichier contient des templates prêts à copier-coller pour accélérer la migration vers React Query.

---

## Template 1 : Liste simple avec recherche

```tsx
import { useState } from 'react';
import { useEmployees } from '@/hooks/api';
import { LoadingSpinner, ErrorMessage, Card } from '@/components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useEmployees({
    page: currentPage,
    limit: 20,
    search: searchQuery,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <Card>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset à la page 1
            }}
            className="pl-10 w-full rounded-md border-gray-300"
          />
        </div>
      </Card>

      {/* Résultats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map(item => (
          <Card key={item.id}>
            <h3>{item.firstName} {item.lastName}</h3>
            <p className="text-gray-600">{item.email}</p>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {data && data.data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

---

## Template 2 : Formulaire de création

```tsx
import { useState } from 'react';
import { useCreateEmployee } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { Modal, Button } from '@/components';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });

  const { showToast } = useToast();
  const createEmployee = useCreateEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createEmployee.mutateAsync(formData);
      showToast('success', 'Employé créé avec succès');
      onClose();
      // ✅ Le cache est automatiquement invalidé
      // ✅ La liste se rafraîchit automatiquement
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la création');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nouvel employé">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Département</label>
          <select
            required
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Sélectionner...</option>
            <option value="IT">Informatique</option>
            <option value="RH">Ressources Humaines</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={createEmployee.isPending}
            isLoading={createEmployee.isPending}
          >
            {createEmployee.isPending ? 'Création...' : 'Créer'}
          </Button>
        </div>

        {createEmployee.error && (
          <p className="text-sm text-red-600 mt-2">
            {createEmployee.error.message}
          </p>
        )}
      </form>
    </Modal>
  );
}
```

---

## Template 3 : Formulaire de modification

```tsx
import { useState, useEffect } from 'react';
import { useUpdateEmployee } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { Modal, Button } from '@/components';
import type { Employee } from '@/types';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export default function EditEmployeeModal({ isOpen, onClose, employee }: EditEmployeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    department: employee.department,
  });

  const { showToast } = useToast();
  const updateEmployee = useUpdateEmployee();

  // Réinitialiser le formulaire quand l'employé change
  useEffect(() => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
    });
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateEmployee.mutateAsync({
        id: employee.id,
        data: formData,
      });
      showToast('success', 'Employé modifié avec succès');
      onClose();
      // ✅ Cache invalidé automatiquement
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la modification');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'employé">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mêmes champs que le formulaire de création */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        {/* ... autres champs ... */}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={updateEmployee.isPending}
            isLoading={updateEmployee.isPending}
          >
            {updateEmployee.isPending ? 'Modification...' : 'Modifier'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
```

---

## Template 4 : Suppression avec confirmation

```tsx
import { useDeleteEmployee } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { ConfirmModal } from '@/components';

interface DeleteEmployeeConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
}

export default function DeleteEmployeeConfirm({
  isOpen,
  onClose,
  employeeId,
  employeeName,
}: DeleteEmployeeConfirmProps) {
  const { showToast } = useToast();
  const deleteEmployee = useDeleteEmployee();

  const handleConfirm = async () => {
    try {
      await deleteEmployee.mutateAsync(employeeId);
      showToast('success', `${employeeName} a été supprimé`);
      onClose();
      // ✅ Liste rafraîchie automatiquement
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirmer la suppression"
      message={`Êtes-vous sûr de vouloir supprimer ${employeeName} ?`}
      confirmText="Supprimer"
      confirmVariant="danger"
      isLoading={deleteEmployee.isPending}
    />
  );
}
```

---

## Template 5 : Dashboard avec plusieurs queries

```tsx
import { 
  useDashboardStats, 
  useEmployees, 
  usePendingAbsences 
} from '@/hooks/api';
import { LoadingSpinner, ErrorMessage, StatCard } from '@/components';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: employees, isLoading: employeesLoading } = useEmployees({ limit: 5 });
  const { data: absences, isLoading: absencesLoading } = usePendingAbsences();

  const isLoading = statsLoading || employeesLoading || absencesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total employés"
          value={stats?.totalEmployees || 0}
          icon="users"
        />
        <StatCard
          title="Absences en attente"
          value={stats?.pendingAbsences || 0}
          icon="calendar"
        />
        {/* ... autres stats ... */}
      </div>

      {/* Employés récents */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Nouveaux employés</h2>
        {employeesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {employees?.data.map(emp => (
              <div key={emp.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{emp.firstName} {emp.lastName}</p>
                  <p className="text-sm text-gray-600">{emp.department}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Absences en attente */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Absences à approuver</h2>
        {absencesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {absences?.data.map(absence => (
              <div key={absence.id} className="border-l-4 border-yellow-400 pl-4">
                <p className="font-medium">{absence.employeeName}</p>
                <p className="text-sm text-gray-600">
                  {absence.startDate} - {absence.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Template 6 : Filtres avancés

```tsx
import { useState } from 'react';
import { useEmployees } from '@/hooks/api';
import { Card } from '@/components';

export default function EmployeesWithFilters() {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    position: '',
    minSalary: '',
    maxSalary: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useEmployees({
    page: currentPage,
    limit: 20,
    ...filters, // Tous les filtres passés au hook
  });

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset à la page 1
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: '',
      status: '',
      position: '',
      minSalary: '',
      maxSalary: '',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="rounded-md border-gray-300"
          />

          <select
            value={filters.department}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="">Tous les départements</option>
            <option value="IT">IT</option>
            <option value="RH">RH</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>

          <button
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Réinitialiser
          </button>
        </div>

        {/* Filtres salaire */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            placeholder="Salaire min"
            value={filters.minSalary}
            onChange={(e) => updateFilter('minSalary', e.target.value)}
            className="rounded-md border-gray-300"
          />
          <input
            type="number"
            placeholder="Salaire max"
            value={filters.maxSalary}
            onChange={(e) => updateFilter('maxSalary', e.target.value)}
            className="rounded-md border-gray-300"
          />
        </div>
      </Card>

      {/* Résultats */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.data.map(item => (
            <Card key={item.id}>{/* ... */}</Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Template 7 : Détails avec requête conditionnelle

```tsx
import { useEmployee, useAbsencesByEmployee } from '@/hooks/api';
import { LoadingSpinner, ErrorMessage } from '@/components';

interface EmployeeDetailsProps {
  employeeId: string | null;
}

export default function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  // 1ère query : charger l'employé
  const { 
    data: employee, 
    isLoading: employeeLoading,
    error: employeeError 
  } = useEmployee(employeeId, { 
    enabled: !!employeeId // Ne charge que si employeeId existe
  });

  // 2ème query : charger ses absences (conditionnelle)
  const { 
    data: absences, 
    isLoading: absencesLoading 
  } = useAbsencesByEmployee(employee?.id, {
    enabled: !!employee // Ne charge que si employee est chargé
  });

  if (!employeeId) {
    return <p className="text-gray-500">Sélectionnez un employé</p>;
  }

  if (employeeLoading) return <LoadingSpinner />;
  if (employeeError) return <ErrorMessage message={employeeError.message} />;
  if (!employee) return <ErrorMessage message="Employé introuvable" />;

  return (
    <div className="space-y-6">
      {/* Informations employé */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {employee.firstName} {employee.lastName}
        </h2>
        <p className="text-gray-600">{employee.email}</p>
        <p className="text-gray-600">{employee.department}</p>
      </div>

      {/* Historique absences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Historique des absences</h3>
        {absencesLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-3">
            {absences?.data.map(absence => (
              <div key={absence.id} className="border-l-4 border-blue-400 pl-4">
                <p className="font-medium">{absence.type}</p>
                <p className="text-sm text-gray-600">
                  {absence.startDate} - {absence.endDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Template 8 : Toggle/Switch avec optimistic update

```tsx
import { useToggleEmployeeStatus } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';

interface EmployeeStatusToggleProps {
  employeeId: string;
  currentStatus: 'active' | 'inactive';
}

export default function EmployeeStatusToggle({ 
  employeeId, 
  currentStatus 
}: EmployeeStatusToggleProps) {
  const { showToast } = useToast();
  const toggleStatus = useToggleEmployeeStatus();

  const handleToggle = async () => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      await toggleStatus.mutateAsync({
        id: employeeId,
        status: newStatus,
      });
      // ✅ L'optimistic update est géré automatiquement par le hook
      // ✅ Rollback automatique en cas d'erreur
      showToast('success', 'Statut modifié');
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={toggleStatus.isPending}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        ${currentStatus === 'active' 
          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
          : 'bg-red-100 text-red-800 hover:bg-red-200'
        }
        ${toggleStatus.isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {toggleStatus.isPending ? 'Modification...' : (
        currentStatus === 'active' ? 'Actif' : 'Inactif'
      )}
    </button>
  );
}
```

---

## Template 9 : Export avec progression

```tsx
import { useState } from 'react';
import { useExportEmployees } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function ExportButton() {
  const [format, setFormat] = useState<'csv' | 'excel'>('excel');
  const { showToast } = useToast();
  const exportEmployees = useExportEmployees();

  const handleExport = async () => {
    try {
      const blob = await exportEmployees.mutateAsync({ format });
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `employees_${new Date().toISOString()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showToast('success', 'Export réussi');
    } catch (err: any) {
      showToast('error', err.message || 'Erreur lors de l\'export');
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'csv' | 'excel')}
        className="rounded-md border-gray-300"
      >
        <option value="excel">Excel</option>
        <option value="csv">CSV</option>
      </select>

      <button
        onClick={handleExport}
        disabled={exportEmployees.isPending}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ena-blue-600 hover:bg-ena-blue-700"
      >
        {exportEmployees.isPending ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Export en cours...
          </>
        ) : (
          <>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Exporter
          </>
        )}
      </button>
    </div>
  );
}
```

---

## Template 10 : Workflow d'approbation

```tsx
import { useApproveAbsence, useRejectAbsence } from '@/hooks/api';
import { useToast } from '@/hooks/useToast';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AbsenceApprovalProps {
  absenceId: string;
  employeeName: string;
}

export default function AbsenceApproval({ absenceId, employeeName }: AbsenceApprovalProps) {
  const { showToast } = useToast();
  const approveAbsence = useApproveAbsence();
  const rejectAbsence = useRejectAbsence();

  const handleApprove = async () => {
    try {
      await approveAbsence.mutateAsync(absenceId);
      showToast('success', `Absence de ${employeeName} approuvée`);
      // ✅ Liste des absences en attente rafraîchie automatiquement
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Raison du refus :');
    if (!reason) return;

    try {
      await rejectAbsence.mutateAsync({ id: absenceId, reason });
      showToast('success', `Absence de ${employeeName} refusée`);
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const isLoading = approveAbsence.isPending || rejectAbsence.isPending;

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
      >
        <CheckIcon className="h-4 w-4 mr-1" />
        Approuver
      </button>

      <button
        onClick={handleReject}
        disabled={isLoading}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
      >
        <XMarkIcon className="h-4 w-4 mr-1" />
        Refuser
      </button>
    </div>
  );
}
```

---

## Utilisation des templates

### Étapes pour utiliser un template :

1. **Copier** le template correspondant à votre besoin
2. **Remplacer** les imports par les bons chemins de votre projet
3. **Adapter** les noms de types (`Employee`, `Absence`, etc.)
4. **Personnaliser** le style et le layout selon vos besoins
5. **Tester** le composant

### Import paths à adapter :

```tsx
// Adapter selon votre structure
import { useEmployees } from '@/hooks/api'; // ou '../../hooks/api'
import { LoadingSpinner } from '@/components'; // ou '../../components'
import { useToast } from '@/hooks/useToast'; // ou '../../hooks/useToast'
import type { Employee } from '@/types'; // ou '../../types'
```

---

**Date :** 4 novembre 2025  
**Version :** 1.0  
**Templates :** 10 composants prêts à l'emploi  
**Prochaine étape :** Copier-coller et adapter à vos besoins !  
