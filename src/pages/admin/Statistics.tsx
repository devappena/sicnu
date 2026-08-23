import React, { useMemo, useState } from 'react';
import {
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockAbsences, mockEmployees, mockTrainings } from '../../data/mockData';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import {
  CustomAreaChart,
  CustomBarChart,
  CustomMultiLineChart,
  CustomPieChart,
} from '../../components/Charts';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { downloadStatisticsReport } from '../../utils/exportUtils';

const DEPT_COLORS = ['#1c3d8f', '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#ef4444'];

const MONTHLY_RECRUITMENT = [
  { month: 'Jan', recrues: 5, demissions: 2 },
  { month: 'Fév', recrues: 8, demissions: 1 },
  { month: 'Mar', recrues: 12, demissions: 3 },
  { month: 'Avr', recrues: 6, demissions: 4 },
  { month: 'Mai', recrues: 9, demissions: 2 },
  { month: 'Juin', recrues: 15, demissions: 1 },
  { month: 'Juil', recrues: 11, demissions: 5 },
  { month: 'Août', recrues: 7, demissions: 3 },
  { month: 'Sep', recrues: 13, demissions: 2 },
  { month: 'Oct', recrues: 9, demissions: 4 },
  { month: 'Nov', recrues: 6, demissions: 6 },
  { month: 'Déc', recrues: 4, demissions: 3 },
];

const ATTENDANCE_DATA = [
  { month: 'Jan', present: 92, absent: 8, retard: 3 },
  { month: 'Fév', present: 88, absent: 12, retard: 5 },
  { month: 'Mar', present: 95, absent: 5, retard: 2 },
  { month: 'Avr', present: 91, absent: 9, retard: 4 },
  { month: 'Mai', present: 89, absent: 11, retard: 6 },
  { month: 'Juin', present: 94, absent: 6, retard: 3 },
  { month: 'Juil', present: 93, absent: 7, retard: 4 },
  { month: 'Août', present: 90, absent: 10, retard: 5 },
  { month: 'Sep', present: 96, absent: 4, retard: 2 },
  { month: 'Oct', present: 92, absent: 8, retard: 3 },
  { month: 'Nov', present: 87, absent: 13, retard: 7 },
  { month: 'Déc', present: 89, absent: 11, retard: 5 },
];

const SALARY_EVOLUTION = [
  { month: 'Jan', moyenne: 850000 },
  { month: 'Fév', moyenne: 870000 },
  { month: 'Mar', moyenne: 890000 },
  { month: 'Avr', moyenne: 910000 },
  { month: 'Mai', moyenne: 930000 },
  { month: 'Juin', moyenne: 950000 },
];

const PERFORMANCE_METRICS = [
  { month: 'Jan', satisfaction: 78, productivite: 82, engagement: 75 },
  { month: 'Fév', satisfaction: 80, productivite: 85, engagement: 78 },
  { month: 'Mar', satisfaction: 82, productivite: 88, engagement: 80 },
  { month: 'Avr', satisfaction: 79, productivite: 83, engagement: 77 },
  { month: 'Mai', satisfaction: 85, productivite: 90, engagement: 82 },
  { month: 'Juin', satisfaction: 87, productivite: 92, engagement: 85 },
];

const ABSENCE_TYPE_DATA = [
  { name: 'Congés Annuels', value: 45, color: '#1c3d8f' },
  { name: 'Maladie', value: 25, color: '#ef4444' },
  { name: 'Personnel', value: 20, color: '#f59e0b' },
  { name: 'Maternité/Paternité', value: 10, color: '#10b981' },
];

const PERIODS = [
  { value: '3mois', label: '3 derniers mois', months: 3 },
  { value: '6mois', label: '6 derniers mois', months: 6 },
  { value: '1an', label: '1 année', months: 12 },
] as const;

type StatsView = 'overview' | 'employees' | 'attendance' | 'absences' | 'training';

const VIEWS: Array<{
  value: StatsView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { value: 'overview', label: "Vue d'ensemble", icon: ChartBarIcon },
  { value: 'employees', label: 'Employés', icon: UserGroupIcon },
  { value: 'attendance', label: 'Présences', icon: ClockIcon },
  { value: 'absences', label: 'Absences', icon: CalendarIcon },
  { value: 'training', label: 'Formations', icon: AcademicCapIcon },
];

const ABSENCE_TYPE_LABELS: Record<string, string> = {
  vacation: 'Congés annuels',
  sick: 'Maladie',
  personal: 'Personnel',
  maternity: 'Maternité',
  paternity: 'Paternité',
};

const ABSENCE_STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Refusée',
};

const TRAINING_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Planifiée',
  'in-progress': 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif',
  on_leave: 'En congé',
};

function employeeName(employeeId: string): string {
  const employee = mockEmployees.find((item) => item.id === employeeId);
  return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
}

const RECENT_ACTIVITIES = [
  { type: 'Nouvelle inscription', description: 'Formation Leadership — 3 participants', time: '10:30', priority: 'low' },
  { type: 'Demande d\'absence', description: 'Congé maladie — 2 jours', time: '09:15', priority: 'medium' },
  { type: 'Évaluation terminée', description: 'Bilan annuel département IT', time: '16:45', priority: 'high' },
];

function takeLast<T>(items: T[], count: number): T[] {
  return items.slice(-Math.min(count, items.length));
}

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

function KpiCard({ stat }: { stat: StatCard }) {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`p-4 lg:p-5 rounded-lg border min-h-[140px] ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className={`p-2 rounded-lg ${stat.color}`}>
          <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
        </div>
        <h3 className={`text-xs lg:text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          {stat.title}
        </h3>
      </div>
      <p className={`text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {stat.value}
      </p>
      <div className="flex items-center space-x-1.5 mt-2">
        {stat.changeType === 'increase' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />}
        {stat.changeType === 'decrease' && <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />}
        <span
          className={`text-xs lg:text-sm font-medium ${
            stat.changeType === 'increase'
              ? 'text-green-600 dark:text-green-400'
              : stat.changeType === 'decrease'
                ? 'text-red-600 dark:text-red-400'
                : isDarkMode
                  ? 'text-slate-400'
                  : 'text-gray-500'
          }`}
        >
          {stat.changeType === 'neutral' ? 'Stable' : `${Math.abs(stat.change)}%`}
        </span>
        {stat.changeType !== 'neutral' && (
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>vs dernier</span>
        )}
      </div>
      <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{stat.description}</p>
    </div>
  );
}

export default function Statistics() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof PERIODS)[number]['value']>('6mois');
  const [selectedView, setSelectedView] = useState<StatsView>('overview');

  const monthCount = PERIODS.find((period) => period.value === selectedPeriod)?.months ?? 6;

  const kpis = useMemo<StatCard[]>(() => {
    const totalEmployees = mockEmployees.length;
    const activeEmployees = mockEmployees.filter((employee) => employee.status === 'active').length;
    const avgSalary = totalEmployees
      ? mockEmployees.reduce((sum, employee) => sum + employee.salary, 0) / totalEmployees
      : 0;
    const absentEmployees = new Set(mockAbsences.map((absence) => absence.employeeId)).size;
    const attendanceRate = totalEmployees
      ? ((totalEmployees - absentEmployees) / totalEmployees) * 100
      : 0;

    return [
      {
        title: 'Employés actifs',
        value: activeEmployees,
        change: 5.2,
        changeType: 'increase',
        icon: UserGroupIcon,
        color: 'bg-blue-500',
        description: `${totalEmployees} employés au total`,
      },
      {
        title: 'Taux de présence',
        value: `${attendanceRate.toFixed(1)}%`,
        change: 2.1,
        changeType: 'increase',
        icon: ClockIcon,
        color: 'bg-green-500',
        description: 'Moyenne mensuelle',
      },
      {
        title: 'Formations actives',
        value: mockTrainings.filter((training) => training.status === 'in-progress').length,
        change: 1.5,
        changeType: 'decrease',
        icon: AcademicCapIcon,
        color: 'bg-purple-500',
        description: `${mockTrainings.length} formations au total`,
      },
      {
        title: 'Salaire moyen',
        value: `${Math.round(avgSalary).toLocaleString('fr-FR')} CDF`,
        change: 3.8,
        changeType: 'increase',
        icon: BanknotesIcon,
        color: 'bg-yellow-500',
        description: 'Évolution annuelle',
      },
      {
        title: 'Demandes d\'absence',
        value: mockAbsences.filter((absence) => absence.status === 'pending').length,
        change: 0,
        changeType: 'neutral',
        icon: CalendarIcon,
        color: 'bg-orange-500',
        description: 'En attente d\'approbation',
      },
      {
        title: 'Départements',
        value: new Set(mockEmployees.map((employee) => employee.department)).size,
        change: 0,
        changeType: 'neutral',
        icon: BuildingOfficeIcon,
        color: 'bg-indigo-500',
        description: 'Répartition organisationnelle',
      },
    ];
  }, []);

  const departmentData = useMemo(() => {
    const grouped = mockEmployees.reduce(
      (acc, employee) => {
        if (!acc[employee.department]) {
          acc[employee.department] = { employes: 0, budget: 0 };
        }
        acc[employee.department].employes += 1;
        acc[employee.department].budget += employee.salary;
        return acc;
      },
      {} as Record<string, { employes: number; budget: number }>,
    );

    return Object.entries(grouped).map(([name, data], index) => ({
      name,
      employes: data.employes,
      budget: data.budget,
      color: DEPT_COLORS[index % DEPT_COLORS.length],
      presence: 88 + (name.length % 10),
      formations: (name.length % 5) + 1,
      performance: 75 + (name.charCodeAt(0) % 20),
    }));
  }, []);

  const statusDistribution = useMemo(() => {
    const labels: Record<string, string> = {
      active: 'Actifs',
      inactive: 'Inactifs',
      on_leave: 'En congé',
    };
    const counts = mockEmployees.reduce((acc, employee) => {
      acc[employee.status] = (acc[employee.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([status, value]) => ({
      name: labels[status] ?? status,
      value,
    }));
  }, []);

  const absenceTypeFromMocks = useMemo(() => {
    const counts = mockAbsences.reduce((acc, absence) => {
      acc[absence.type] = (acc[absence.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([type, value]) => ({
      name: ABSENCE_TYPE_LABELS[type] ?? type,
      value,
    }));
  }, []);

  const trainingStatusData = useMemo(() => {
    const counts = mockTrainings.reduce((acc, training) => {
      acc[training.status] = (acc[training.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([status, value]) => ({
      name: TRAINING_STATUS_LABELS[status] ?? status,
      value,
    }));
  }, []);

  const recruitmentData = takeLast(MONTHLY_RECRUITMENT, monthCount);
  const attendanceData = takeLast(ATTENDANCE_DATA, monthCount);
  const salaryEvolution = takeLast(SALARY_EVOLUTION, monthCount);
  const performanceMetrics = takeLast(PERFORMANCE_METRICS, monthCount);

  const handleExport = (format: 'json' | 'csv') => {
    downloadStatisticsReport(format);
    showToast(
      'success',
      format === 'json' ? 'Rapport complet téléchargé.' : 'Tableau Excel téléchargé.',
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques RH"
        description="Analyses, indicateurs et tendances du personnel de la CNU-RDC"
        icon={ChartBarIcon}
      >
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value as typeof selectedPeriod)}
            className="px-3 py-2 rounded-lg border text-sm text-gray-900 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleExport('json')}
            className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            title="Télécharger le rapport complet (employés, absences, formations)"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Rapport complet
          </button>
          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="bg-white text-cnu-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 flex items-center gap-2"
            title="Ouvrir la liste des employés dans Excel"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Excel
          </button>
        </div>
      </PageHeader>

      <Card padding="sm">
        <div className="flex gap-1 overflow-x-auto">
          {VIEWS.map((view) => {
            const Icon = view.icon;
            const isActive = selectedView === view.value;
            return (
              <button
                key={view.value}
                type="button"
                onClick={() => setSelectedView(view.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? isDarkMode
                      ? 'bg-blue-900/30 text-blue-300'
                      : 'bg-cnu-blue-100 text-cnu-blue-700'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-700'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((stat) => (
          <KpiCard key={stat.title} stat={stat} />
        ))}
      </div>

      {selectedView === 'overview' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomBarChart
                data={departmentData}
                xKey="name"
                yKey="employes"
                title="Répartition du personnel par département"
                height={300}
                color="#1c3d8f"
              />
            </Card>
            <Card>
              <CustomPieChart
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                title="Répartition par statut"
                height={300}
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomMultiLineChart
                data={recruitmentData}
                xKey="month"
                lines={[
                  { key: 'recrues', name: 'Nouvelles recrues', color: '#10b981' },
                  { key: 'demissions', name: 'Démissions', color: '#ef4444' },
                ]}
                title="Évolution du personnel"
                height={300}
              />
            </Card>
            <Card>
              <CustomAreaChart
                data={salaryEvolution}
                xKey="month"
                yKey="moyenne"
                title="Évolution du salaire moyen (CDF)"
                height={300}
                color="#f59e0b"
              />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomMultiLineChart
                data={performanceMetrics}
                xKey="month"
                lines={[
                  { key: 'satisfaction', name: 'Satisfaction (%)', color: '#3b82f6' },
                  { key: 'productivite', name: 'Productivité (%)', color: '#10b981' },
                  { key: 'engagement', name: 'Engagement (%)', color: '#f59e0b' },
                ]}
                title="Indicateurs de performance"
                height={300}
              />
            </Card>
            <Card>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Activités récentes
              </h3>
              <div className="space-y-3">
                {RECENT_ACTIVITIES.map((activity) => (
                  <div
                    key={activity.type}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      isDarkMode ? 'border-slate-600 bg-slate-700/50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.priority === 'high'
                          ? 'bg-red-500'
                          : activity.priority === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activity.type}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        {activity.description}
                      </p>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {selectedView === 'employees' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomBarChart
                data={departmentData}
                xKey="name"
                yKey="employes"
                title="Employés par département"
                height={300}
                color="#1c3d8f"
              />
            </Card>
            <Card>
              <CustomPieChart
                data={statusDistribution}
                dataKey="value"
                nameKey="name"
                title="Répartition par statut"
                height={300}
              />
            </Card>
          </div>
          <Card>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Liste des employés
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <tr>
                    {['Nom', 'Poste', 'Département', 'Statut', 'Salaire'].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-500'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {mockEmployees.map((employee) => (
                    <tr key={employee.id} className={isDarkMode ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {employee.position}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {EMPLOYEE_STATUS_LABELS[employee.status]}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                        {employee.salary.toLocaleString('fr-FR')} CDF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'attendance' && (
        <>
          <Card>
            <CustomMultiLineChart
              data={attendanceData}
              xKey="month"
              lines={[
                { key: 'present', name: 'Présence (%)', color: '#10b981' },
                { key: 'absent', name: 'Absences (%)', color: '#ef4444' },
                { key: 'retard', name: 'Retards (%)', color: '#f59e0b' },
              ]}
              title="Suivi de l'assiduité"
              height={350}
            />
          </Card>
          <Card>
            <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Présence par département
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <tr>
                    {['Département', 'Effectif', 'Taux de présence', 'Performance'].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-500'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {departmentData.map((dept) => (
                    <tr key={dept.name} className={isDarkMode ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: dept.color }} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {dept.name}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {dept.employes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`font-medium ${
                            dept.presence > 90 ? 'text-green-600' : dept.presence > 85 ? 'text-yellow-600' : 'text-red-600'
                          }`}
                        >
                          {dept.presence}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className={`w-16 rounded-full h-2 mr-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <div
                              className={`h-2 rounded-full ${
                                dept.performance > 85 ? 'bg-green-500' : dept.performance > 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${dept.performance}%` }}
                            />
                          </div>
                          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                            {dept.performance}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'absences' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomPieChart
                data={absenceTypeFromMocks.length ? absenceTypeFromMocks : ABSENCE_TYPE_DATA}
                dataKey="value"
                nameKey="name"
                title="Types d'absences"
                height={300}
              />
            </Card>
            <Card>
              <CustomBarChart
                data={departmentData}
                xKey="name"
                yKey="employes"
                title="Effectifs concernés"
                height={300}
                color="#f59e0b"
              />
            </Card>
          </div>
          <Card>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Demandes d'absence
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <tr>
                    {['Employé', 'Type', 'Période', 'Motif', 'Statut'].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-500'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {mockAbsences.map((absence) => (
                    <tr key={absence.id} className={isDarkMode ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {employeeName(absence.employeeId)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {ABSENCE_TYPE_LABELS[absence.type]}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {format(absence.startDate, 'dd MMM yyyy', { locale: fr })} — {format(absence.endDate, 'dd MMM yyyy', { locale: fr })}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {absence.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            absence.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : absence.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {ABSENCE_STATUS_LABELS[absence.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'training' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CustomPieChart
                data={trainingStatusData}
                dataKey="value"
                nameKey="name"
                title="Statut des formations"
                height={300}
              />
            </Card>
            <Card>
              <CustomBarChart
                data={departmentData}
                xKey="name"
                yKey="formations"
                title="Formations par département"
                height={300}
                color="#8b5cf6"
              />
            </Card>
          </div>
          <Card>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Formations
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}>
                  <tr>
                    {['Formation', 'Formateur', 'Participants', 'Statut', 'Début'].map((header) => (
                      <th
                        key={header}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-500'
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {mockTrainings.map((training) => (
                    <tr key={training.id} className={isDarkMode ? 'hover:bg-slate-700/40' : 'hover:bg-gray-50'}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {training.title}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {training.instructor}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {training.enrolledEmployees.length}/{training.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {TRAINING_STATUS_LABELS[training.status]}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                        {format(training.startDate, 'dd MMM yyyy', { locale: fr })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
