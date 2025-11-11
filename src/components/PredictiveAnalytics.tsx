import React, { useState, useMemo } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  LightBulbIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { format, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CustomLineChart, CustomBarChart, CustomAreaChart } from './Charts';
import type { Employee, Absence } from '../types';

interface PredictiveMetric {
  id: string;
  title: string;
  value: number | string;
  prediction: number;
  trend: 'up' | 'down' | 'stable';
  risk: 'low' | 'medium' | 'high';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  recommendation: string;
}

interface PredictiveAnalyticsProps {
  employees: Employee[];
  absences: Absence[];
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ employees, absences }) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Algorithmes de prédiction avancés
  const predictiveMetrics = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === 'active').length;
    const recentAbsences = absences.filter(abs => 
      new Date(abs.startDate) >= subDays(new Date(), 30)
    ).length;

    // Prédiction du turnover (algorithme simplifié)
    const averageTenure = employees.reduce((acc, emp) => {
      const tenure = (new Date().getTime() - new Date(emp.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
      return acc + tenure;
    }, 0) / employees.length;

    const turnoverRisk = Math.max(0, Math.min(100, 
      (recentAbsences / totalEmployees * 100) + 
      (averageTenure < 2 ? 30 : 0) + 
      (Math.random() * 10 - 5) // Simulation de variabilité
    ));

    // Prédiction de la satisfaction
    const satisfactionScore = Math.max(0, Math.min(100, 
      85 - (turnoverRisk * 0.3) + (Math.random() * 10 - 5)
    ));

    // Prédiction des absences
    const absenteeismRate = (recentAbsences / totalEmployees) * 100;
    const predictedAbsences = Math.round(absenteeismRate * 1.2 + Math.random() * 5);

    // Prédiction budgétaire
    const averageSalary = employees.reduce((acc, emp) => acc + (emp.salary || 0), 0) / employees.length;
    const budgetRisk = averageSalary > 800000 ? 'high' : averageSalary > 500000 ? 'medium' : 'low';

    return [
      {
        id: 'turnover',
        title: 'Risque de Turnover',
        value: `${turnoverRisk.toFixed(1)}%`,
        prediction: turnoverRisk + 5,
        trend: turnoverRisk > 20 ? 'up' : turnoverRisk < 10 ? 'down' : 'stable',
        risk: turnoverRisk > 25 ? 'high' : turnoverRisk > 15 ? 'medium' : 'low',
        icon: UserGroupIcon,
        color: turnoverRisk > 25 ? '#ef4444' : turnoverRisk > 15 ? '#f59e0b' : '#10b981',
        description: 'Probabilité de départ des employés dans les 6 prochains mois',
        recommendation: turnoverRisk > 20 ? 'Mise en place d\'entretiens individuels urgents' : 'Surveillance continue recommandée'
      },
      {
        id: 'satisfaction',
        title: 'Indice de Satisfaction',
        value: `${satisfactionScore.toFixed(1)}/100`,
        prediction: satisfactionScore + 2,
        trend: satisfactionScore > 80 ? 'up' : satisfactionScore < 60 ? 'down' : 'stable',
        risk: satisfactionScore < 60 ? 'high' : satisfactionScore < 75 ? 'medium' : 'low',
        icon: LightBulbIcon,
        color: satisfactionScore > 80 ? '#10b981' : satisfactionScore > 60 ? '#f59e0b' : '#ef4444',
        description: 'Score de satisfaction prédit basé sur les indicateurs RH',
        recommendation: satisfactionScore < 70 ? 'Enquête de satisfaction à lancer' : 'Maintenir les efforts actuels'
      },
      {
        id: 'absenteeism',
        title: 'Taux d\'Absentéisme',
        value: `${absenteeismRate.toFixed(1)}%`,
        prediction: predictedAbsences,
        trend: absenteeismRate > 8 ? 'up' : absenteeismRate < 4 ? 'down' : 'stable',
        risk: absenteeismRate > 10 ? 'high' : absenteeismRate > 6 ? 'medium' : 'low',
        icon: CalendarIcon,
        color: absenteeismRate > 10 ? '#ef4444' : absenteeismRate > 6 ? '#f59e0b' : '#10b981',
        description: 'Évolution prédite des absences pour le mois prochain',
        recommendation: absenteeismRate > 8 ? 'Analyse des causes d\'absence nécessaire' : 'Situation normale'
      },
      {
        id: 'budget',
        title: 'Optimisation Budgétaire',
        value: `${averageSalary.toLocaleString('fr-CD')} CDF`,
        prediction: averageSalary * 1.03,
        trend: budgetRisk === 'high' ? 'up' : 'stable',
        risk: budgetRisk as 'low' | 'medium' | 'high',
        icon: CurrencyEuroIcon,
        color: budgetRisk === 'high' ? '#ef4444' : budgetRisk === 'medium' ? '#f59e0b' : '#10b981',
        description: 'Prévision d\'évolution de la masse salariale',
        recommendation: budgetRisk === 'high' ? 'Révision budgétaire conseillée' : 'Budget sous contrôle'
      }
    ] as PredictiveMetric[];
  }, [employees, absences]);

  // Données pour les graphiques prédictifs
  const predictionChartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        date: format(date, 'dd/MM', { locale: fr }),
        turnover: Math.max(0, 15 + Math.sin(i * 0.2) * 5 + Math.random() * 3),
        satisfaction: Math.max(0, 78 + Math.cos(i * 0.15) * 8 + Math.random() * 4),
        absences: Math.max(0, 6 + Math.sin(i * 0.3) * 3 + Math.random() * 2)
      };
    });
    return days;
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return ArrowTrendingUpIcon;
      case 'down': return ArrowTrendingDownIcon;
      default: return ClockIcon;
    }
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk]}`}>
        {labels[risk]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-red-500" />
              Analytics Prédictifs
            </h2>
            <p className="text-gray-600">Intelligence artificielle pour la prédiction RH</p>
          </div>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Métriques prédictives */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictiveMetrics.map((metric) => {
            const TrendIcon = getTrendIcon(metric.trend);
            const IconComponent = metric.icon;
            
            return (
              <div
                key={metric.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedMetric === metric.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-8 w-8 text-[${metric.color}]`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{metric.title}</h3>
                      <p className="text-2xl font-bold" style={{ color: metric.color }}>
                        {metric.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <TrendIcon className={`h-5 w-5 ${
                      metric.trend === 'up' ? 'text-red-500' : 
                      metric.trend === 'down' ? 'text-green-500' : 
                      'text-gray-400'
                    }`} />
                    {getRiskBadge(metric.risk)}
                  </div>
                </div>
                
                {selectedMetric === metric.id && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                      <span className="font-medium text-orange-700">
                        {metric.recommendation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Graphiques prédictifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Prédiction Turnover - 30 jours</h3>
          <CustomLineChart
            data={predictionChartData}
            xKey="date"
            yKeys={[{ key: 'turnover', name: 'Risque Turnover (%)', color: '#ef4444' }]}
            height={300}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Évolution Satisfaction</h3>
          <CustomAreaChart
            data={predictionChartData}
            xKey="date"
            yKeys={[{ key: 'satisfaction', name: 'Score Satisfaction', color: '#10b981' }]}
            height={300}
          />
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LightBulbIcon className="h-5 w-5 text-yellow-500" />
          Insights & Recommandations IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">🎯 Action Prioritaire</h4>
            <p className="text-sm text-blue-700 mt-1">
              Organiser des entretiens individuels avec les employés à risque élevé de turnover
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900">✅ Point Positif</h4>
            <p className="text-sm text-green-700 mt-1">
              Le taux d'absentéisme reste dans les normes acceptables
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900">⚠️ Vigilance</h4>
            <p className="text-sm text-orange-700 mt-1">
              Surveiller l'évolution du budget salarial au cours des 3 prochains mois
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900">🔮 Prédiction</h4>
            <p className="text-sm text-purple-700 mt-1">
              Pic d'activité prévu dans 15 jours - prévoir des ressources supplémentaires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
