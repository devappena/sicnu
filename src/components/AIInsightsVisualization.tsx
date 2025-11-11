import React from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { type PredictionResult, type DepartmentInsight, type TrainingRecommendation } from '../utils/aiPredictions';
import Card from './Card';
import { FadeIn, SlideIn } from './Animations';

interface AIInsightsVisualizationProps {
  predictions: PredictionResult[];
  departmentInsights: DepartmentInsight[];
  trainingRecommendations: TrainingRecommendation[];
}

// Composant pour les graphiques en barres simplifiés
const SimpleBarChart: React.FC<{
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  maxValue?: number;
}> = ({ data, title, maxValue = 100 }) => {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChartBarIcon className="h-5 w-5 text-blue-600" />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-gray-600 truncate">
              {item.name}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color}`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
            <div className="w-10 text-sm font-semibold text-gray-700 text-right">
              {item.value}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Composant pour le radar de performance départementale
const DepartmentPerformanceRadar: React.FC<{ insights: DepartmentInsight[] }> = ({ insights }) => {
  const topDepartments = insights
    .sort((a, b) => b.avgPerformance - a.avgPerformance)
    .slice(0, 5);

  return (
    <SimpleBarChart
      data={topDepartments.map(dept => ({
        name: dept.department.substring(0, 8),
        value: dept.avgPerformance,
        color: dept.avgPerformance >= 80 ? 'bg-green-500' : 
               dept.avgPerformance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
      }))}
      title="Performance Départementale"
      maxValue={100}
    />
  );
};

// Composant pour la distribution des risques
const RiskDistribution: React.FC<{ predictions: PredictionResult[] }> = ({ predictions }) => {
  const turnoverPredictions = predictions.filter(p => p.riskType === 'turnover');
  const burnoutPredictions = predictions.filter(p => p.riskType === 'burnout');
  
  const riskCounts = {
    turnover: {
      high: turnoverPredictions.filter(p => p.riskLevel === 'high').length,
      medium: turnoverPredictions.filter(p => p.riskLevel === 'medium').length,
      low: turnoverPredictions.filter(p => p.riskLevel === 'low').length
    },
    burnout: {
      high: burnoutPredictions.filter(p => p.riskLevel === 'high').length,
      medium: burnoutPredictions.filter(p => p.riskLevel === 'medium').length,
      low: burnoutPredictions.filter(p => p.riskLevel === 'low').length
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
        Distribution des Risques
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Turnover */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Risque de Turnover</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Élevé</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-red-100 rounded h-2">
                  <div 
                    className="h-2 bg-red-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.turnover.high / (turnoverPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-red-600">{riskCounts.turnover.high}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Moyen</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-yellow-100 rounded h-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.turnover.medium / (turnoverPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-yellow-600">{riskCounts.turnover.medium}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Faible</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-green-100 rounded h-2">
                  <div 
                    className="h-2 bg-green-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.turnover.low / (turnoverPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-green-600">{riskCounts.turnover.low}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Burnout */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Risque de Burnout</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Élevé</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-red-100 rounded h-2">
                  <div 
                    className="h-2 bg-red-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.burnout.high / (burnoutPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-red-600">{riskCounts.burnout.high}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Moyen</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-yellow-100 rounded h-2">
                  <div 
                    className="h-2 bg-yellow-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.burnout.medium / (burnoutPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-yellow-600">{riskCounts.burnout.medium}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Faible</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-green-100 rounded h-2">
                  <div 
                    className="h-2 bg-green-500 rounded transition-all duration-1000"
                    style={{ width: `${(riskCounts.burnout.low / (burnoutPredictions.length || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-green-600">{riskCounts.burnout.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Composant pour les tendances de formation
const TrainingTrends: React.FC<{ recommendations: TrainingRecommendation[] }> = ({ recommendations }) => {
  const trainingCategories = recommendations.flatMap(r => 
    r.recommendedTrainings.map(t => t.category)
  );
  
  const categoryCounts = trainingCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  return (
    <SimpleBarChart
      data={sortedCategories.map(([category, count]) => ({
        name: category.substring(0, 10),
        value: (count / trainingCategories.length) * 100,
        color: 'bg-blue-500'
      }))}
      title="Tendances Formations Demandées"
      maxValue={100}
    />
  );
};

// Composant pour les KPIs en temps réel
const RealTimeKPIs: React.FC<{ predictions: PredictionResult[]; insights: DepartmentInsight[] }> = ({ 
  predictions, 
  insights 
}) => {
  const highRiskEmployees = predictions.filter(p => p.riskLevel === 'high').length;
  const avgPerformance = insights.length > 0 ? 
    Math.round(insights.reduce((sum, d) => sum + d.avgPerformance, 0) / insights.length) : 0;
  const totalEmployees = predictions.length / 2; // Divisé par 2 car on a turnover + burnout par employé
  const healthScore = Math.max(0, 100 - (highRiskEmployees / totalEmployees) * 100);

  const kpis = [
    {
      label: 'Score Santé RH',
      value: Math.round(healthScore),
      unit: '%',
      icon: CheckCircleIcon,
      color: healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600',
      bgColor: healthScore >= 80 ? 'bg-green-50' : healthScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      label: 'Performance Globale',
      value: avgPerformance,
      unit: '%',
      icon: ArrowTrendingUpIcon,
      color: avgPerformance >= 80 ? 'text-green-600' : avgPerformance >= 70 ? 'text-yellow-600' : 'text-red-600',
      bgColor: avgPerformance >= 80 ? 'bg-green-50' : avgPerformance >= 70 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      label: 'Employés à Risque',
      value: highRiskEmployees,
      unit: '',
      icon: ExclamationTriangleIcon,
      color: highRiskEmployees <= 2 ? 'text-green-600' : highRiskEmployees <= 5 ? 'text-yellow-600' : 'text-red-600',
      bgColor: highRiskEmployees <= 2 ? 'bg-green-50' : highRiskEmployees <= 5 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      label: 'Départements Actifs',
      value: insights.length,
      unit: '',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ChartBarIcon className="h-5 w-5 text-blue-600" />
        KPIs Temps Réel
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <SlideIn key={kpi.label} direction="up" delay={index * 100}>
              <div className={`${kpi.bgColor} rounded-lg p-4 text-center`}>
                <Icon className={`h-6 w-6 ${kpi.color} mx-auto mb-2`} />
                <div className={`text-2xl font-bold ${kpi.color}`}>
                  {kpi.value}{kpi.unit}
                </div>
                <div className="text-xs text-gray-600 mt-1">{kpi.label}</div>
              </div>
            </SlideIn>
          );
        })}
      </div>
    </Card>
  );
};

// Composant principal
const AIInsightsVisualization: React.FC<AIInsightsVisualizationProps> = ({
  predictions,
  departmentInsights,
  trainingRecommendations
}) => {
  return (
    <div className="space-y-6">
      {/* KPIs en temps réel */}
      <FadeIn>
        <RealTimeKPIs predictions={predictions} insights={departmentInsights} />
      </FadeIn>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SlideIn direction="left">
          <DepartmentPerformanceRadar insights={departmentInsights} />
        </SlideIn>
        
        <SlideIn direction="right">
          <RiskDistribution predictions={predictions} />
        </SlideIn>
      </div>

      {/* Tendances formation */}
      <SlideIn direction="up" delay={200}>
        <TrainingTrends recommendations={trainingRecommendations} />
      </SlideIn>

      {/* Résumé exécutif */}
      <FadeIn delay={400}>
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
          <div className="flex items-start gap-3">
            <AcademicCapIcon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">💡 Insights Exécutifs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800">
                <div>
                  <p className="font-medium mb-1">🎯 Actions Prioritaires</p>
                  <ul className="space-y-1 text-xs">
                    <li>• {predictions.filter(p => p.riskLevel === 'high').length} entretiens urgents à planifier</li>
                    <li>• {departmentInsights.filter(d => d.avgPerformance < 70).length} départements nécessitent attention</li>
                    <li>• {trainingRecommendations.length} plans de formation à valider</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">📈 Tendances Positives</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Performance moyenne : {Math.round(departmentInsights.reduce((sum, d) => sum + d.avgPerformance, 0) / departmentInsights.length)}%</li>
                    <li>• Prédictions mises à jour en temps réel</li>
                    <li>• Système de recommandations actif</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

export default AIInsightsVisualization;
