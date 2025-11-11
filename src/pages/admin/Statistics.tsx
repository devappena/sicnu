import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { mockEmployees, mockAbsences, mockTrainings } from '../../data/mockData';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { useToast } from '../../hooks/useToast';
import { 
  CustomBarChart, 
  CustomPieChart, 
  CustomLineChart, 
  CustomAreaChart,
  CustomMultiLineChart 
} from '../../components/Charts';

export default function Statistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6mois');
  const { showToast } = useToast();

  // Données enrichies pour les graphiques
  const departmentData = [
    { name: 'Administration', employes: 25, budget: 450000, color: '#1c3d8f' },
    { name: 'Finance', employes: 18, budget: 380000, color: '#f59e0b' },
    { name: 'RH', employes: 12, budget: 250000, color: '#10b981' },
    { name: 'IT', employes: 15, budget: 320000, color: '#8b5cf6' },
    { name: 'Juridique', employes: 8, budget: 180000, color: '#f97316' },
    { name: 'Communication', employes: 10, budget: 220000, color: '#ef4444' },
  ];

  const monthlyRecruitment = [
    { month: 'Jan', recrues: 5, budget: 50000, demissions: 2 },
    { month: 'Fév', recrues: 8, budget: 65000, demissions: 1 },
    { month: 'Mar', recrues: 12, budget: 85000, demissions: 3 },
    { month: 'Avr', recrues: 6, budget: 45000, demissions: 4 },
    { month: 'Mai', recrues: 9, budget: 70000, demissions: 2 },
    { month: 'Juin', recrues: 15, budget: 95000, demissions: 1 },
    { month: 'Juil', recrues: 11, budget: 80000, demissions: 5 },
    { month: 'Août', recrues: 7, budget: 55000, demissions: 3 },
    { month: 'Sep', recrues: 13, budget: 88000, demissions: 2 },
    { month: 'Oct', recrues: 9, budget: 72000, demissions: 4 },
    { month: 'Nov', recrues: 6, budget: 48000, demissions: 6 },
    { month: 'Déc', recrues: 4, budget: 35000, demissions: 3 },
  ];

  const attendanceData = [
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

  const salaryEvolution = [
    { month: 'Jan', moyenne: 850000, mediane: 780000, max: 1500000, min: 450000 },
    { month: 'Fév', moyenne: 870000, mediane: 800000, max: 1550000, min: 470000 },
    { month: 'Mar', moyenne: 890000, mediane: 820000, max: 1600000, min: 480000 },
    { month: 'Avr', moyenne: 910000, mediane: 840000, max: 1620000, min: 500000 },
    { month: 'Mai', moyenne: 930000, mediane: 860000, max: 1650000, min: 520000 },
    { month: 'Juin', moyenne: 950000, mediane: 880000, max: 1700000, min: 550000 },
  ];

  const trainingCategories = [
    { name: 'Leadership', value: 35, participants: 45, color: '#1c3d8f' },
    { name: 'Technique', value: 28, participants: 38, color: '#f59e0b' },
    { name: 'Langues', value: 20, participants: 25, color: '#10b981' },
    { name: 'Sécurité', value: 12, participants: 15, color: '#8b5cf6' },
    { name: 'Soft Skills', value: 15, participants: 20, color: '#f97316' },
  ];

  const performanceMetrics = [
    { month: 'Jan', satisfaction: 78, productivite: 82, engagement: 75 },
    { month: 'Fév', satisfaction: 80, productivite: 85, engagement: 78 },
    { month: 'Mar', satisfaction: 82, productivite: 88, engagement: 80 },
    { month: 'Avr', satisfaction: 79, productivite: 83, engagement: 77 },
    { month: 'Mai', satisfaction: 85, productivite: 90, engagement: 82 },
    { month: 'Juin', satisfaction: 87, productivite: 92, engagement: 85 },
  ];

  const absenceTypeData = [
    { name: 'Congés Annuels', value: 45, color: '#1c3d8f' }, 
    { name: 'Maladie', value: 25, color: '#ef4444' },
    { name: 'Personnel', value: 20, color: '#f59e0b' },
    { name: 'Maternité/Paternité', value: 10, color: '#10b981' },
  ];

  const quickStatActions = [
    {
      name: 'Rapport Mensuel',
      description: 'Générer le rapport du mois',
      icon: DocumentArrowDownIcon,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => exportData('monthly')
    },
    {
      name: 'Analyse Personnel',
      description: 'Vue détaillée des employés',
      icon: UserGroupIcon,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => exportData('personnel')
    },
    {
      name: 'Tendances Absences',
      description: 'Évolution des absences',
      icon: CalendarIcon,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      onClick: () => exportData('absences')
    },
    {
      name: 'Filtres Avancés',
      description: 'Personnaliser les vues',
      icon: FunnelIcon,
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => showToast('info', 'Filtres avancés à implémenter')
    }
  ];

  const exportData = (type: string) => {
    showToast('success', `Export ${type} en cours...`);
    // Simulation d'export
    setTimeout(() => {
      showToast('success', `Rapport ${type} exporté avec succès!`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Statistiques RH" 
        description="Analyses et métriques du personnel de l'ENA"
        icon={ChartBarIcon}
      />

      {/* Contrôles et filtres */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-medium text-gray-900">Tableau de Bord Analytique</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="3mois">3 derniers mois</option>
              <option value="6mois">6 derniers mois</option>
              <option value="1an">1 année</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStatActions.map((action) => (
            <button
              key={action.name}
              onClick={action.onClick}
              className={`${action.color} text-white p-4 rounded-lg text-center transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className="h-6 w-6 mx-auto mb-2" />
              <div className="text-sm font-medium">{action.name}</div>
              <div className="text-xs opacity-80 mt-1">{action.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Métriques principales améliorées */}
      <Card>
        <h3 className="text-lg font-medium mb-4 text-gray-900">Métriques Principales</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Total Employés</h3>
                <p className="text-3xl font-bold">{mockEmployees.length}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm opacity-90">+5.2% ce mois</span>
                </div>
              </div>
              <UserGroupIcon className="h-12 w-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Absences/Mois</h3>
                <p className="text-3xl font-bold">{mockAbsences.length}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-180" />
                  <span className="text-sm opacity-90">-2.1% ce mois</span>
                </div>
              </div>
              <CalendarIcon className="h-12 w-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Formations</h3>
                <p className="text-3xl font-bold">{mockTrainings.length}</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm opacity-90">+12.5% ce mois</span>
                </div>
              </div>
              <ChartBarIcon className="h-12 w-12 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Taux Présence</h3>
                <p className="text-3xl font-bold">92.5%</p>
                <div className="flex items-center mt-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  <span className="text-sm opacity-90">+1.8% ce mois</span>
                </div>
              </div>
              <UserGroupIcon className="h-12 w-12 opacity-80" />
            </div>
          </div>
        </div>
      </Card>

      {/* Première ligne de graphiques - côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CustomBarChart
            data={departmentData}
            xKey="name"
            yKey="employes"
            title="Répartition du Personnel par Département"
            height={300}
            color="#1c3d8f"
          />
        </Card>

        <Card>
          <CustomPieChart
            data={absenceTypeData}
            dataKey="value"
            nameKey="name"
            title="Types d'Absences (Répartition %)"
            height={300}
          />
        </Card>
      </div>

      {/* Deuxième ligne de graphiques - côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CustomMultiLineChart
            data={monthlyRecruitment}
            xKey="month"
            lines={[
              { key: 'recrues', name: 'Nouvelles Recrues', color: '#10b981' },
              { key: 'demissions', name: 'Démissions', color: '#ef4444' }
            ]}
            title="Évolution du Personnel (Mensuelle)"
            height={300}
          />
        </Card>

        <Card>
          <CustomAreaChart
            data={salaryEvolution}
            xKey="month"
            yKey="moyenne"
            title="Évolution Salaire Moyen (CDF)"
            height={300}
            color="#f59e0b"
          />
        </Card>
      </div>

      {/* Troisième ligne de graphiques - côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CustomBarChart
            data={departmentData}
            xKey="name"
            yKey="budget"
            title="Budget par Département (CDF)"
            height={300}
            color="#8b5cf6"
          />
        </Card>

        <Card>
          <CustomMultiLineChart
            data={performanceMetrics}
            xKey="month"
            lines={[
              { key: 'satisfaction', name: 'Satisfaction (%)', color: '#3b82f6' },
              { key: 'productivite', name: 'Productivité (%)', color: '#10b981' },
              { key: 'engagement', name: 'Engagement (%)', color: '#f59e0b' }
            ]}
            title="Indicateurs de Performance"
            height={300}
          />
        </Card>
      </div>

      {/* Graphique large - Présence et Absences (pleine largeur) */}
      <Card>
        <CustomMultiLineChart
          data={attendanceData}
          xKey="month"
          lines={[
            { key: 'present', name: 'Présence (%)', color: '#10b981' },
            { key: 'absent', name: 'Absences (%)', color: '#ef4444' },
            { key: 'retard', name: 'Retards (%)', color: '#f59e0b' }
          ]}
          title="Suivi de l'Assiduité (Tendance Annuelle)"
          height={350}
        />
      </Card>

      {/* Tableau de performance par département */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Détaillée par Département</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Effectif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget (CDF)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux Présence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentData.map((dept, index) => {
                const presence = (88 + Math.random() * 10).toFixed(1);
                const formations = Math.floor(Math.random() * 5) + 1;
                const performance = (75 + Math.random() * 20).toFixed(0);
                
                return (
                  <tr key={dept.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {dept.employes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dept.budget.toLocaleString()} CDF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${parseFloat(presence) > 90 ? 'text-green-600' : parseFloat(presence) > 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {presence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formations} formations
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${parseInt(performance) > 85 ? 'bg-green-500' : parseInt(performance) > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${performance}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{performance}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
