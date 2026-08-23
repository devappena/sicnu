import React, { useState } from 'react';
import { CalendarIcon, UserGroupIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AbsenceCalendar from '../../components/AbsenceCalendar';
import AbsenceFormModal from '../../components/AbsenceFormModal';
import AbsenceApprovalModal from '../../components/AbsenceApprovalModal';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { 
  useAbsences, 
  useCreateAbsence, 
  useApproveAbsence, 
  useRejectAbsence,
  useEmployees 
} from '../../hooks/api';
import type { Absence } from '../../types';
import { useToast } from '../../hooks/useToast';
import { mockLeaveBalances, mockEmployees } from '../../data/mockData';
import { annualLeaveEntitlementDays, canTakeAnnualLeave, LEGAL_DISCLAIMER } from '../../legal/rdc';

const Absences: React.FC = () => {
  // Local state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // React Query hooks
  const { data: absences, isLoading: absencesLoading, error: absencesError } = useAbsences();
  const { data: employees } = useEmployees();
  const createAbsence = useCreateAbsence();
  const approveAbsence = useApproveAbsence();
  const rejectAbsence = useRejectAbsence();
  const { showToast } = useToast();

  // Loading state
  if (absencesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (absencesError) {
    return (
      <ErrorMessage 
        message="Erreur lors du chargement des absences" 
        error={absencesError}
      />
    );
  }

  const absencesList = absences || [];
  const employeesList = employees || [];

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesList.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Inconnu';
  };

  const handleCreateAbsence = (absenceData: Partial<Absence>) => {
    createAbsence.mutate(absenceData as Omit<Absence, 'id'>, {
      onSuccess: () => {
        setIsFormOpen(false);
        showToast('success', 'Demande d\'absence créée avec succès');
      },
      onError: (error) => {
        showToast('error', 'Erreur', `Impossible de créer la demande: ${error.message}`);
      }
    });
  };

  const handleApprove = (absence: Absence) => {
    approveAbsence.mutate(absence.id, {
      onSuccess: () => {
        setIsApprovalOpen(false);
        showToast('success', 'Absence approuvée');
      },
      onError: (error) => {
        showToast('error', 'Erreur', `Impossible d'approuver l'absence: ${error.message}`);
      }
    });
  };

  const handleReject = (absence: Absence, reason?: string) => {
    rejectAbsence.mutate(
      { id: absence.id, reason: reason || '' },
      {
        onSuccess: () => {
          setIsApprovalOpen(false);
          showToast('info', 'Absence rejetée');
        },
        onError: (error) => {
          showToast('error', 'Erreur', `Impossible de rejeter l'absence: ${error.message}`);
        }
      }
    );
  };

  const openApprovalModal = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsApprovalOpen(true);
  };

  const getStatusColor = (status: Absence['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingAbsences = absencesList.filter(abs => abs.status === 'pending');
  const approvedAbsences = absencesList.filter(abs => abs.status === 'approved');
  const rejectedAbsences = absencesList.filter(abs => abs.status === 'rejected');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des Absences"
        description="Gérez les demandes d'absence et les congés"
        icon={CalendarIcon}
        action={{
          label: 'Nouvelle demande',
          onClick: () => setIsFormOpen(true)
        }}
      />

      <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
        Congés selon le Code du travail (Loi 015/2002) : 1 jour ouvrable par mois, +1 jour tous les 5 ans d’ancienneté, ouverture après 12 mois. {LEGAL_DISCLAIMER}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockLeaveBalances.slice(0, 3).map((balance) => {
          const employee = employeesList.find((item) => item.id === balance.employeeId)
            ?? mockEmployees.find((item) => item.id === balance.employeeId);
          const legalDays = employee
            ? annualLeaveEntitlementDays(employee.hireDate, employee.dateOfBirth)
            : balance.annualLeave.total;
          const eligible = employee ? canTakeAnnualLeave(employee.hireDate) : true;
          return (
            <Card key={balance.employeeId} padding="sm">
              <p className="text-sm font-medium text-gray-900">
                {employee ? `${employee.firstName} ${employee.lastName}` : `Agent ${balance.employeeId}`}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Droit légal {legalDays} j. · {eligible ? 'Ouvert' : 'Pas encore 12 mois'}
              </p>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex justify-between"><span>Congés annuels</span><span>{balance.annualLeave.remaining}/{legalDays}</span></div>
                <div className="flex justify-between"><span>Maladie</span><span>{balance.sickLeave.remaining}/{balance.sickLeave.total}</span></div>
                <div className="flex justify-between"><span>Personnel</span><span>{balance.personalLeave.remaining}/{balance.personalLeave.total}</span></div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{absences.length}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAbsences.length}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approuvées</p>
              <p className="text-2xl font-bold text-green-600">{approvedAbsences.length}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejetées</p>
              <p className="text-2xl font-bold text-red-600">{rejectedAbsences.length}</p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Sélecteur de vue */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <CalendarIcon className="h-5 w-5 inline mr-2" />
          Calendrier
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-md ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <UserGroupIcon className="h-5 w-5 inline mr-2" />
          Liste
        </button>
      </div>

      {/* Contenu principal */}
      {viewMode === 'calendar' ? (
        <Card>
          <AbsenceCalendar />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {absences.map((absence) => (
                  <tr key={absence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEmployeeName(absence.employeeId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{absence.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(absence.startDate), 'dd MMM yyyy', { locale: fr })}
                        {' - '}
                        {format(new Date(absence.endDate), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(absence.status)}`}>
                        {absence.status === 'pending' && 'En attente'}
                        {absence.status === 'approved' && 'Approuvée'}
                        {absence.status === 'rejected' && 'Rejetée'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {absence.status === 'pending' && (
                        <button
                          onClick={() => openApprovalModal(absence)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Traiter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      {isFormOpen && (
        <AbsenceFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateAbsence}
        />
      )}

      {isApprovalOpen && selectedAbsence && (
        <AbsenceApprovalModal
          isOpen={isApprovalOpen}
          absence={selectedAbsence}
          onClose={() => setIsApprovalOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default Absences;
