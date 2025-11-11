import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { mockEmployees, mockAbsences, mockTrainings } from '../../data/mockData';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { AnimatedBarChart, AnimatedPieChart, AnimatedLineChart } from '../../components/AnimatedCharts';
import { downloadStatisticsReport } from '../../utils/exportUtils';
import StatDetailModal from '../../components/StatDetailModal';

// Types pour les statistiques
interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

// Composant de carte statistique avancée
function AdvancedStatCard({ stat, onClick }: { stat: StatCard, onClick?: () => void }) {
  const { isDarkMode } = useTheme();
  
  const getChangeIcon = () => {
    if (stat.changeType === 'increase') {
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    } else if (stat.changeType === 'decrease') {
      return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getChangeColor = () => {
    if (stat.changeType === 'increase') return 'text-green-600 dark:text-green-400';
    if (stat.changeType === 'decrease') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div 
      className={`
        p-4 lg:p-6 transition-all rounded-lg border 
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        ${onClick ? 'hover:shadow-lg cursor-pointer hover:scale-[1.02]' : 'hover:shadow-lg'}
        min-h-[140px] lg:min-h-[160px]
      `}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-2 mb-3">
          <div className={`p-2 rounded-lg ${stat.color}`}>
            <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <h3 className={`text-xs lg:text-sm font-medium leading-tight ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            {stat.title}
          </h3>
        </div>
        
        <div className="flex-1 space-y-2">
          <p className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {stat.value}
          </p>
          
          <div className="flex items-center space-x-1.5">
            {getChangeIcon()}
            <span className={`text-xs lg:text-sm font-medium ${getChangeColor()}`}>
              {Math.abs(stat.change)}%
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              vs dernier
            </span>
          </div>
          
          <p className={`text-xs leading-tight ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {stat.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant de tableau de données
function DataTable({ data, title }: { data: Record<string, string | number>[], title: string }) {
  const { isDarkMode } = useTheme();
  
  if (!data.length) return null;
  
  const columns = Object.keys(data[0]);
  
  return (
    <Card className="p-6">
      <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              {columns.map(column => (
                <th
                  key={column}
                  className={`text-left py-3 px-4 text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'} hover:${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}
              >
                {columns.map(column => (
                  <td
                    key={column}
                    className={`py-3 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function StatisticsAdvanced() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const [selectedView, setSelectedView] = useState<'overview' | 'employees' | 'attendance' | 'training' | 'finance'>('overview');
  
  // États pour les modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStatDetail, setSelectedStatDetail] = useState<{ title: string; content: React.ReactNode } | null>(null);

  // Vérification des droits d'accès
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  // Fonction pour afficher les détails d'une statistique
  const showStatDetail = (title: string, content: React.ReactNode) => {
    setSelectedStatDetail({ title, content });
    setIsDetailModalOpen(true);
  };

  // Calcul des statistiques en temps réel
  const stats = useMemo(() => {
    const totalEmployees = mockEmployees.length;
    const activeEmployees = mockEmployees.filter(e => e.status === 'active').length;
    const totalTrainings = mockTrainings.length;
    
    // Calculs avancés
    const avgSalary = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees;
    const absentEmployees = new Set(mockAbsences.map(a => a.employeeId)).size;
    const attendanceRate = ((totalEmployees - absentEmployees) / totalEmployees) * 100;
    
    const statCards: StatCard[] = [
      {
        title: 'Employés Actifs',
        value: activeEmployees,
        change: 5.2,
        changeType: 'increase',
        icon: UserGroupIcon,
        color: 'bg-blue-500',
        description: `${totalEmployees} employés au total`
      },
      {
        title: 'Taux de Présence',
        value: `${attendanceRate.toFixed(1)}%`,
        change: 2.1,
        changeType: 'increase',
        icon: ClockIcon,
        color: 'bg-green-500',
        description: 'Moyenne mensuelle'
      },
      {
        title: 'Formations Actives',
        value: mockTrainings.filter(t => t.status === 'in-progress').length,
        change: -1.5,
        changeType: 'decrease',
        icon: AcademicCapIcon,
        color: 'bg-purple-500',
        description: `${totalTrainings} formations au total`
      },
      {
        title: 'Salaire Moyen',
        value: `${(avgSalary / 1000).toFixed(0)}k €`,
        change: 3.8,
        changeType: 'increase',
        icon: CurrencyEuroIcon,
        color: 'bg-yellow-500',
        description: 'Évolution annuelle positive'
      },
      {
        title: 'Demandes d\'Absence',
        value: mockAbsences.filter(a => a.status === 'pending').length,
        change: 0,
        changeType: 'neutral',
        icon: CalendarIcon,
        color: 'bg-orange-500',
        description: 'En attente d\'approbation'
      },
      {
        title: 'Départements',
        value: new Set(mockEmployees.map(e => e.department)).size,
        change: 0,
        changeType: 'neutral',
        icon: BuildingOfficeIcon,
        color: 'bg-indigo-500',
        description: 'Répartition organisationnelle'
      }
    ];

    return statCards;
  }, []);

  // Données pour les graphiques
  const departmentData = useMemo(() => {
    const deptCounts = mockEmployees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deptCounts).map(([name, value]) => ({
      name,
      value
    }));
  }, []);

  const salaryByDepartment = useMemo(() => {
    const deptSalaries = mockEmployees.reduce((acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = { total: 0, count: 0 };
      }
      acc[emp.department].total += emp.salary;
      acc[emp.department].count += 1;
      return acc;
    }, {} as Record<string, { total: number, count: number }>);

    return Object.entries(deptSalaries).map(([name, data]) => ({
      name,
      value: Math.round(data.total / data.count / 1000) // en milliers
    }));
  }, []);

  // Données pour les graphiques camembert
  const statusDistribution = useMemo(() => {
    const statusCounts = mockEmployees.reduce((acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name === 'active' ? 'Actifs' : name === 'inactive' ? 'Inactifs' : 'En congé',
      value,
      color: name === 'active' ? '#10b981' : name === 'inactive' ? '#ef4444' : '#f59e0b'
    }));
  }, []);

  // Données pour les graphiques linéaires
  const monthlyEvolution = useMemo(() => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
    return months.map((month, index) => ({
      name: month,
      employees: 88 + index * 2 + Math.floor(Math.random() * 5),
      formations: 12 + index + Math.floor(Math.random() * 3),
      absences: 8 - index + Math.floor(Math.random() * 3)
    }));
  }, []);

  const recentActivities = useMemo(() => {
    return [
      {
        type: 'Nouvelle inscription',
        description: 'Formation Leadership - 3 participants',
        timestamp: '2025-07-03T10:30:00Z',
        priority: 'low'
      },
      {
        type: 'Demande d\'absence',
        description: 'Congé maladie - 2 jours',
        timestamp: '2025-07-03T09:15:00Z',
        priority: 'medium'
      },
      {
        type: 'Évaluation terminée',
        description: 'Bilan annuel département IT',
        timestamp: '2025-07-02T16:45:00Z',
        priority: 'high'
      }
    ];
  }, []);

  const periods = [
    { value: '1month', label: '1 mois' },
    { value: '3months', label: '3 mois' },
    { value: '6months', label: '6 mois' },
    { value: '1year', label: '1 an' }
  ];

  const views = [
    { value: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
    { value: 'employees', label: 'Employés', icon: UserGroupIcon },
    { value: 'attendance', label: 'Présences', icon: ClockIcon },
    { value: 'training', label: 'Formations', icon: AcademicCapIcon },
    { value: 'finance', label: 'Finances', icon: CurrencyEuroIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <PageHeader
        title="Statistiques Avancées"
        description="Tableaux de bord et analyses détaillées des données RH"
        icon={ChartBarIcon}
      >
        <div className="flex items-center space-x-4">
          {/* Sélecteur de période */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={`
              px-4 py-2 rounded-lg border font-medium focus:outline-none focus:ring-2 focus:ring-ena-blue-500
              ${isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
              }
            `}
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>

          {/* Bouton d'export */}
          {isAdmin && (
            <button 
              onClick={() => downloadStatisticsReport('json')}
              className="bg-ena-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-ena-blue-700 transition-colors flex items-center space-x-2"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          )}
        </div>
      </PageHeader>

      {/* Navigation des vues */}
      <Card className="p-4">
        <div className="flex space-x-1">
          {views.map(view => (
            <button
              key={view.value}
              onClick={() => setSelectedView(view.value as 'overview' | 'employees' | 'attendance' | 'training' | 'finance')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${selectedView === view.value
                  ? 'bg-ena-blue-100 text-ena-blue-700 dark:bg-ena-blue-900/20 dark:text-ena-blue-300'
                  : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <AdvancedStatCard 
            key={index} 
            stat={stat} 
            onClick={() => showStatDetail(
              stat.title,
              <div className="space-y-4">
                <p>Détails de la statistique <strong>{stat.title}</strong></p>
                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-sm">Valeur actuelle: <strong>{stat.value}</strong></p>
                  <p className="text-sm">Évolution: <strong>{stat.change > 0 ? '+' : ''}{stat.change}%</strong></p>
                  <p className="text-sm">Description: {stat.description}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cliquez sur les autres statistiques pour voir plus de détails.
                </p>
              </div>
            )}
          />
        ))}
      </div>

      {/* Contenu selon la vue sélectionnée */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedBarChart 
              data={departmentData} 
              title="Employés par Département" 
            />
            <AnimatedPieChart 
              data={statusDistribution}
              title="Répartition par Statut"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedBarChart 
              data={salaryByDepartment} 
              title="Salaire Moyen par Département" 
              unit="k€"
            />
            <AnimatedLineChart
              data={monthlyEvolution}
              lines={[
                { key: 'employees', color: '#3b82f6', name: 'Employés' },
                { key: 'formations', color: '#10b981', name: 'Formations' },
                { key: 'absences', color: '#ef4444', name: 'Absences' }
              ]}
              title="Évolution Mensuelle"
              height={250}
            />
          </div>
        </div>
      )}

      {selectedView === 'employees' && (
        <div className="grid grid-cols-1 gap-6">
          <DataTable 
            data={mockEmployees.slice(0, 10).map(emp => ({
              nom: `${emp.firstName} ${emp.lastName}`,
              poste: emp.position,
              département: emp.department,
              statut: emp.status,
              salaire: `${(emp.salary / 1000).toFixed(0)}k €`
            }))}
            title="Employés Récents"
          />
        </div>
      )}

      {selectedView === 'attendance' && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Analyse des Présences
            </h3>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Fonctionnalité en cours de développement...
            </p>
          </Card>
        </div>
      )}

      {selectedView === 'training' && (
        <div className="grid grid-cols-1 gap-6">
          <DataTable 
            data={mockTrainings.slice(0, 8).map(training => ({
              formation: training.title,
              formateur: training.instructor,
              participants: `${training.enrolledEmployees.length}/${training.capacity}`,
              statut: training.status,
              début: format(training.startDate, 'dd/MM/yyyy')
            }))}
            title="Formations en Cours"
          />
        </div>
      )}

      {selectedView === 'finance' && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Analyse Financière
            </h3>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Fonctionnalité en cours de développement...
            </p>
          </Card>
        </div>
      )}

      {/* Activités récentes */}
      <Card className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Activités Récentes
        </h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${isDarkMode ? 'border-slate-600 bg-slate-700/50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.priority === 'high' ? 'bg-red-500' :
                activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div className="flex-1">
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activity.type}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                  {activity.description}
                </p>
              </div>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {format(new Date(activity.timestamp), 'HH:mm')}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal de détails */}
      <StatDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStatDetail(null);
        }}
        title={selectedStatDetail?.title || ''}
      >
        {selectedStatDetail?.content}
      </StatDetailModal>
    </div>
  );
}
