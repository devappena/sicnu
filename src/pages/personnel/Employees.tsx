import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  FunnelIcon, 
  UsersIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserGroupIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ConfirmModal from '../../components/ConfirmModal';
import EmployeeFormModal from '../../components/EmployeeFormModal';
import EmployeeDetailModal from '../../components/EmployeeDetailModal';
import ExportMenu from '../../components/ExportMenu';
import Pagination, { usePagination } from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useToast } from '../../hooks/useToast';
import { 
  useEmployees, 
  useCreateEmployee, 
  useUpdateEmployee, 
  useDeleteEmployee 
} from '../../hooks/api';
import type { Employee } from '../../types';

// Composant EmployeeCard
interface EmployeeCardProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => void;
}

function EmployeeCard({ employee, onView, onEdit, onDelete }: EmployeeCardProps) {
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'on_leave':
        return 'Congé';
      default:
        return 'Inconnu';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-ena-blue-300 hover:shadow-sm transition-all duration-200 p-3">
      {/* Header avec avatar et statut */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-ena-blue-500 to-ena-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
          {getStatusText(employee.status)}
        </span>
      </div>

      {/* Nom et poste */}
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight truncate">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-xs text-gray-600 truncate">{employee.position}</p>
        <p className="text-xs text-ena-blue-600 font-medium truncate">{employee.department}</p>
      </div>

      {/* Informations compactes */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-600">
          <EnvelopeIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{employee.email}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <PhoneIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{employee.phone}</span>
        </div>
      </div>

      {/* Salaire et date d'embauche */}
      <div className="flex justify-between items-center text-xs mb-3">
        <span className="font-medium text-green-600 truncate">
          {formatCurrency(employee.salary)}
        </span>
        <span className="text-gray-500">
          {format(new Date(employee.hireDate), 'dd/MM/yy', { locale: fr })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-1">
        <button
          onClick={() => onView(employee)}
          className="p-1.5 text-gray-500 hover:text-ena-blue-600 hover:bg-ena-blue-50 rounded transition-colors"
          title="Voir les détails"
        >
          <EyeIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onEdit(employee)}
          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
          title="Modifier"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Supprimer"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function Employees() {
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    employeeId: string;
    employeeName: string;
  }>({
    isOpen: false,
    employeeId: '',
    employeeName: ''
  });
  const [employeeModal, setEmployeeModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    mode: 'create' | 'edit';
  }>({
    isOpen: false,
    employee: null,
    mode: 'create'
  });
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    employee: Employee | null;
  }>({
    isOpen: false,
    employee: null
  });
  
  // React Query hooks
  const { data: employees, isLoading, error } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const { showToast } = useToast();

  const employeesList = employees || [];

  // Filtrage des employés
  const filteredEmployees = employeesList.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    currentData: paginatedEmployees,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange
  } = usePagination(filteredEmployees, 12);

  const departments = [...new Set(employeesList.map(emp => emp.department))];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        message="Erreur lors du chargement des employés" 
        error={error}
      />
    );
  }

  const handleViewEmployee = (employee: Employee) => {
    setDetailModal({
      isOpen: true,
      employee: employee
    });
  };

  const handleCloseDetailModal = () => {
    setDetailModal({
      isOpen: false,
      employee: null
    });
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeModal({
      isOpen: true,
      employee: employee,
      mode: 'edit'
    });
  };

  const handleCreateEmployee = () => {
    setEmployeeModal({
      isOpen: true,
      employee: null,
      mode: 'create'
    });
  };

  const handleSaveEmployee = (employeeData: Omit<Employee, 'id'> | Employee) => {
    if (employeeModal.mode === 'edit' && 'id' in employeeData) {
      // Mode édition avec React Query
      updateEmployee.mutate(
        { id: employeeData.id, data: employeeData },
        {
          onSuccess: () => {
            showToast('success', 'Employé modifié', 'Les informations ont été mises à jour avec succès.');
            setEmployeeModal({
              isOpen: false,
              employee: null,
              mode: 'create'
            });
          },
          onError: (error) => {
            showToast('error', 'Erreur', `Impossible de modifier l'employé: ${error.message}`);
          }
        }
      );
    } else {
      // Mode création avec React Query
      createEmployee.mutate(
        employeeData as Omit<Employee, 'id'>,
        {
          onSuccess: () => {
            showToast('success', 'Employé créé', 'Le nouvel employé a été ajouté avec succès.');
            setEmployeeModal({
              isOpen: false,
              employee: null,
              mode: 'create'
            });
          },
          onError: (error) => {
            showToast('error', 'Erreur', `Impossible de créer l'employé: ${error.message}`);
          }
        }
      );
    }
  };

  const handleCloseEmployeeModal = () => {
    setEmployeeModal({
      isOpen: false,
      employee: null,
      mode: 'create'
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employeesList.find(emp => emp.id === employeeId);
    if (employee) {
      setConfirmModal({
        isOpen: true,
        employeeId: employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`
      });
    }
  };

  const confirmDelete = () => {
    deleteEmployee.mutate(confirmModal.employeeId, {
      onSuccess: () => {
        showToast('success', 'Employé supprimé', `L'employé ${confirmModal.employeeName} a été supprimé avec succès.`);
        setConfirmModal({ isOpen: false, employeeId: '', employeeName: '' });
      },
      onError: (error) => {
        showToast('error', 'Erreur', `Impossible de supprimer l'employé: ${error.message}`);
        setConfirmModal({ isOpen: false, employeeId: '', employeeName: '' });
      }
    });
  };

  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, employeeId: '', employeeName: '' });
  };

  const handleAddEmployee = () => {
    handleCreateEmployee();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestion des Employés" 
        description={`${totalItems} employé(s) trouvé(s) sur ${employees.length} au total`}
        icon={UsersIcon}
      >
        <div className="flex items-center space-x-3">
          <ExportMenu 
            data={filteredEmployees.map(emp => ({
              'Prénom': emp.firstName,
              'Nom': emp.lastName,
              'Email': emp.email,
              'Téléphone': emp.phone,
              'Poste': emp.position,
              'Département': emp.department,
              'Statut': emp.status,
              'Date d\'embauche': format(emp.hireDate, 'dd/MM/yyyy', { locale: fr })
            }))}
            filename="employes_ena"
            title="Liste des Employés - ENA"
          />
          <button
            onClick={handleAddEmployee}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvel Employé
          </button>
        </div>
      </PageHeader>

      {/* Filters and Search */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              <option value="">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field appearance-none pr-10"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="on_leave">En congé</option>
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterDepartment('');
              setFilterStatus('');
            }}
            className="btn-secondary"
          >
            Réinitialiser
          </button>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-600 text-white p-6 rounded-lg text-center transition-colors duration-200 hover:opacity-90">
          <UsersIcon className="h-8 w-8 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">{employees.length}</div>
          <div className="text-sm font-medium opacity-90">Total Employés</div>
        </div>
        
        <div className="bg-green-500 text-white p-6 rounded-lg text-center transition-colors duration-200 hover:opacity-90">
          <UserGroupIcon className="h-8 w-8 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">
            {employees.filter(emp => emp.status === 'active').length}
          </div>
          <div className="text-sm font-medium opacity-90">Employés Actifs</div>
        </div>
        
        <div className="bg-yellow-500 text-white p-6 rounded-lg text-center transition-colors duration-200 hover:opacity-90">
          <UserPlusIcon className="h-8 w-8 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">
            {employees.filter(emp => emp.status === 'on_leave').length}
          </div>
          <div className="text-sm font-medium opacity-90">En Congé</div>
        </div>
        
        <div className="bg-purple-500 text-white p-6 rounded-lg text-center transition-colors duration-200 hover:opacity-90">
          <UsersIcon className="h-8 w-8 mx-auto mb-3" />
          <div className="text-2xl font-bold mb-1">
            {[...new Set(employees.map(emp => emp.department))].length}
          </div>
          <div className="text-sm font-medium opacity-90">Départements</div>
        </div>
      </div>

      {/* Employee Cards */}
      {paginatedEmployees.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterDepartment || filterStatus
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par ajouter un nouvel employé.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {paginatedEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={handleViewEmployee}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            className="mt-6"
          />
        </>
      )}
      
      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Supprimer l'employé"
        message={`Êtes-vous sûr de vouloir supprimer ${confirmModal.employeeName} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Modal de formulaire employé */}
      <EmployeeFormModal
        isOpen={employeeModal.isOpen}
        onClose={handleCloseEmployeeModal}
        onSave={handleSaveEmployee}
        employee={employeeModal.employee}
        title={employeeModal.mode === 'edit' ? 'Modifier l\'employé' : 'Nouvel employé'}
      />

      {/* Modal de détail employé */}
      <EmployeeDetailModal
        isOpen={detailModal.isOpen}
        onClose={handleCloseDetailModal}
        employee={detailModal.employee}
      />
    </div>
  );
}
