import { useState } from 'react';
import { 
  UsersIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { 
  useEmployees, 
  useDashboardStats,
  useAbsences,
  useTrainings
} from '../hooks/api';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  // React Query hooks
  const { data: employees, isLoading: employeesLoading, error: employeesError } = useEmployees();
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: absences } = useAbsences({ status: 'pending' });
  const { data: trainings } = useTrainings({ status: 'upcoming' });

  // Loading state
  if (employeesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (employeesError || statsError) {
    return (
      <ErrorMessage 
        message="Erreur lors du chargement du tableau de bord" 
        error={employeesError || statsError}
      />
    );
  }

  const stats = dashboardStats || {
    totalEmployees: employees?.length || 0,
    activeEmployees: employees?.filter(e => e.status === 'active').length || 0,
    pendingAbsences: absences?.length || 0,
    upcomingTrainings: trainings?.length || 0
  };

  const statCards = [
    {
      name: 'Total Employés',
      value: stats.totalEmployees,
      change: '+2',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      name: 'Employés Actifs',
      value: stats.activeEmployees,
      change: '+1',
      changeType: 'increase',
      icon: UsersIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      name: 'Demandes d\'Absence',
      value: stats.pendingAbsences,
      change: '-1',
      changeType: 'decrease',
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      name: 'Formations Prévues',
      value: stats.upcomingTrainings,
      change: '+2',
      changeType: 'increase',
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  // Données pour les graphiques
  const departmentData = [
    { name: 'Administration', employees: 8, color: '#1c3d8f' },
    { name: 'RH', employees: 4, color: '#059669' },
    { name: 'Académique', employees: 12, color: '#7c3aed' },
    { name: 'Sécurité', employees: 6, color: '#dc2626' }
  ];

  const absenceData = [
    { type: 'Congés', count: 12, color: '#3b82f6' },
    { type: 'Maladie', count: 5, color: '#ef4444' },
    { type: 'Personnel', count: 3, color: '#f59e0b' },
    { type: 'Formation', count: 2, color: '#10b981' }
  ];

  const recentActivities = [
    { 
      id: 1, 
      type: 'Nouvelle embauche', 
      description: 'Fatou Diallo a rejoint l\'équipe Administration', 
      time: '2 heures',
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      id: 2, 
      type: 'Demande d\'absence', 
      description: 'Grace Kabila a demandé des congés du 1er au 15 juillet', 
      time: '4 heures',
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      id: 3, 
      type: 'Formation', 
      description: 'Formation Leadership programmée pour le 1er août', 
      time: '1 jour',
      icon: AcademicCapIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      id: 4, 
      type: 'Évaluation', 
      description: 'Évaluation annuelle de Pierre Tshisekedi terminée', 
      time: '2 jours',
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      id: 5, 
      type: 'Anniversaire', 
      description: 'C\'est l\'anniversaire de Claude Mujinga aujourd\'hui', 
      time: '6 heures',
      icon: BellIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Formation en Leadership',
      date: new Date('2025-08-01'),
      type: 'Formation',
      participants: 20
    },
    {
      id: 2,
      title: 'Réunion équipe RH',
      date: new Date('2025-06-28'),
      type: 'Réunion',
      participants: 4
    },
    {
      id: 3,
      title: 'Évaluation trimestrielle',
      date: new Date('2025-06-30'),
      type: 'Évaluation',
      participants: 15
    }
  ];

  const quickActions = [
    {
      name: 'Ajouter un employé',
      href: '/employees',
      icon: UsersIcon,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Nouvelle absence',
      href: '/absences',
      icon: CalendarIcon,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Planifier formation',
      href: '/trainings',
      icon: AcademicCapIcon,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Voir statistiques',
      href: '/statistics',
      icon: ChartBarIcon,
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Bonjour ${user?.firstName || 'Employé'}`}
        description="Bienvenue sur SICNU — Commission nationale UNESCO-RDC"
        icon={ChartBarIcon}
      />

      {/* Stats Cards avec taille réduite */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-1`}>{stat.name}</p>
                <div className="flex items-center justify-between">
                  <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'increase' ? '↗' : '↘'} {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} rounded-full p-2 ml-2`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card>
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Actions Rapides</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className={`${action.color} text-white p-3 rounded-lg text-center transition-colors duration-200`}
            >
              <action.icon className="h-5 w-5 mx-auto mb-1" />
              <span className="text-xs font-medium">{action.name}</span>
            </a>
          ))}
        </div>
      </Card>

      {/* Graphiques et activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par département */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Répartition par Département</h3>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </select>
          </div>
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-sm text-gray-700">{dept.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        backgroundColor: dept.color,
                        width: `${(dept.employees / stats.totalEmployees) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{dept.employees}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activités récentes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Activités Récentes</h3>
            <a href="/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Voir tout
            </a>
          </div>
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`${activity.bgColor} rounded-full p-2 mt-0.5`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Il y a {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Événements à venir et absences */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Événements à venir */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Événements à Venir</h3>
            <a href="/trainings" className="text-sm text-cnu-blue-600 hover:text-cnu-blue-800 font-medium">
              Voir planning
            </a>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {format(event.date, 'dd MMMM yyyy', { locale: fr })} • {event.participants} participants
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.type === 'Formation' ? 'bg-purple-100 text-purple-800' :
                  event.type === 'Réunion' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Types d'absences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Types d'Absences</h3>
            <a href="/absences" className="text-sm text-cnu-blue-600 hover:text-cnu-blue-800 font-medium">
              Gérer absences
            </a>
          </div>
          <div className="space-y-3">
            {absenceData.map((absence) => (
              <div key={absence.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: absence.color }}
                  />
                  <span className="text-sm text-gray-700">{absence.type}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{absence.count} demandes</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {absenceData.reduce((sum, item) => sum + item.count, 0)}
              </p>
              <p className="text-sm text-gray-600">Total des demandes ce mois</p>
            </div>
          </div>
        </div>
      </div>

      {/* Anniversaires et notifications importantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anniversaires du mois */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg shadow-sm border border-pink-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-pink-600" />
              Anniversaires ce Mois
            </h3>
            <span className="text-sm text-pink-600 font-medium">{stats.birthdaysThisMonth} anniversaires</span>
          </div>
          <div className="space-y-3">
            {(employees || [])
              .filter(emp => {
                const birthMonth = new Date(emp.dateOfBirth).getMonth();
                const currentMonth = new Date().getMonth();
                return birthMonth === currentMonth;
              })
              .slice(0, 3)
              .map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                  <div className="h-8 w-8 bg-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(employee.dateOfBirth), 'dd MMMM', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Nouvelles embauches */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <UsersIcon className="h-5 w-5 mr-2 text-green-600" />
              Nouvelles Embauches
            </h3>
            <span className="text-sm text-green-600 font-medium">{stats.newHiresThisMonth} ce mois</span>
          </div>
          <div className="space-y-3">
            {(employees || [])
              .filter(emp => {
                const hireMonth = new Date(emp.hireDate).getMonth();
                const hireYear = new Date(emp.hireDate).getFullYear();
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return hireMonth === currentMonth && hireYear === currentYear;
              })
              .slice(0, 3)
              .map((employee) => (
                <div key={employee.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg">
                  <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {employee.position} - {format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
