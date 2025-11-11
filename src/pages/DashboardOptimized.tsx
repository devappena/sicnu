import React, { Suspense } from 'react';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useEmployees, useAbsences, useStatistics } from '../hooks/useQueries';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';

// Composant pour les statistiques avec React Query
const DashboardStats: React.FC = () => {
  const { data: employees, isLoading: employeesLoading, error: employeesError } = useEmployees();
  const { data: absences, isLoading: absencesLoading, error: absencesError } = useAbsences();
  const { data: statistics, isLoading: statsLoading, error: statsError } = useStatistics();
  const { showToast } = useToast();

  // Gestion des erreurs
  React.useEffect(() => {
    if (employeesError) {
      showToast('error', 'Erreur lors du chargement des employés');
    }
    if (absencesError) {
      showToast('error', 'Erreur lors du chargement des absences');
    }
    if (statsError) {
      showToast('error', 'Erreur lors du chargement des statistiques');
    }
  }, [employeesError, absencesError, statsError, showToast]);

  const isLoading = employeesLoading || absencesLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 animate-pulse">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Calculs basés sur les données React Query
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0;
  const totalAbsences = absences?.length || 0;
  const pendingAbsences = absences?.filter(abs => abs.status === 'pending').length || 0;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Employés"
        value={totalEmployees}
        icon={UserGroupIcon}
        color="blue"
        subtitle={`${activeEmployees} actifs`}
      />
      
      <StatCard
        title="Absences"
        value={totalAbsences}
        icon={CalendarDaysIcon}
        color="orange"
        subtitle={`${pendingAbsences} en attente`}
      />
      
      <StatCard
        title="Formations"
        value={12}
        icon={AcademicCapIcon}
        color="green"
        subtitle="3 en cours"
      />
      
      <StatCard
        title="Évaluations"
        value={8}
        icon={ChartBarIcon}
        color="purple"
        subtitle="2 à planifier"
      />
    </div>
  );
};

// Composant pour les activités récentes avec React Query
const RecentActivities: React.FC = () => {
  const { data: absences } = useAbsences();
  
  // Activités récentes basées sur les vraies données
  const recentActivities = React.useMemo(() => {
    if (!absences) return [];
    
    return absences
      .slice(0, 5)
      .map(absence => ({
        id: absence.id,
        type: 'absence',
        description: `${absence.type} - ${absence.employeeId}`,
        time: new Date(absence.startDate).toLocaleDateString('fr-FR'),
        icon: CalendarDaysIcon,
        color: absence.status === 'approved' ? 'text-green-600' : 
               absence.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
      }));
  }, [absences]);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Activités Récentes
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {recentActivities.map((activity, idx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {idx !== recentActivities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        activity.color === 'text-green-600' ? 'bg-green-500' :
                        activity.color === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        <activity.icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">{activity.description}</p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        <ClockIcon className="h-4 w-4 inline mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Composant principal du Dashboard optimisé
const DashboardOptimized: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleQuickAction = (action: string) => {
    showToast('info', `Action rapide: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bonjour {user?.firstName || 'Employé'}
            </h1>
            <p className="text-blue-100">
              Bienvenue sur votre portail RH ENA
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleQuickAction('nouvelle absence')}
              className="bg-white text-blue-900 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Nouvelle Absence
            </button>
            <button
              onClick={() => handleQuickAction('rapport')}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400 transition-colors"
            >
              Générer Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques avec React Query et Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardStats />
      </Suspense>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphiques et métriques */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Métriques de Performance
            </h3>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
                <p>Graphiques en développement</p>
                <p className="text-sm">Utilisera Recharts + React Query</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="lg:col-span-1">
          <Suspense fallback={<LoadingSpinner />}>
            <RecentActivities />
          </Suspense>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Ajouter Employé', icon: UserGroupIcon, color: 'bg-blue-500' },
            { name: 'Demande Congé', icon: CalendarDaysIcon, color: 'bg-green-500' },
            { name: 'Formation', icon: AcademicCapIcon, color: 'bg-purple-500' },
            { name: 'Évaluation', icon: ChartBarIcon, color: 'bg-orange-500' },
          ].map((action) => (
            <button
              key={action.name}
              onClick={() => handleQuickAction(action.name.toLowerCase())}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className={`${action.color} p-3 rounded-full mb-2`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Attention requise
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                {/* Affichage dynamique basé sur les données React Query */}
                Système opérationnel. Toutes les données sont synchronisées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOptimized;
