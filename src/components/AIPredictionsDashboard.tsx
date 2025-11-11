import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  ChartBarIcon,
  AcademicCapIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  FireIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { 
  predictTurnoverRisk,
  predictBurnoutRisk,
  generateTrainingRecommendations,
  generateDepartmentInsights,
  mockEmployees,
  type PredictionResult,
  type TrainingRecommendation,
  type DepartmentInsight
} from '../utils/aiPredictions';
import Card from './Card';
import AIInsightsVisualization from './AIInsightsVisualization';
import { FadeIn, SlideIn, StaggerChildren } from './Animations';

interface AIPredictionsDashboardProps {
  className?: string;
}

// Composant pour afficher les risques de turnover
const TurnoverRiskCard: React.FC<{ predictions: PredictionResult[] }> = ({ predictions }) => {
  const turnoverPredictions = predictions.filter(p => p.riskType === 'turnover');
  const highRiskEmployees = turnoverPredictions.filter(p => p.riskLevel === 'high');
  const mediumRiskEmployees = turnoverPredictions.filter(p => p.riskLevel === 'medium');

  return (
    <Card className="p-6 border-l-4 border-red-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Prédictions Turnover</h3>
          <p className="text-sm text-gray-600">Analyse IA des risques de départ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Risque Élevé</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{highRiskEmployees.length}</p>
          <p className="text-xs text-red-600">employés</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Risque Moyen</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{mediumRiskEmployees.length}</p>
          <p className="text-xs text-yellow-600">employés</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Taux Global</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {turnoverPredictions.length > 0 ? Math.round((highRiskEmployees.length / turnoverPredictions.length) * 100) : 0}%
          </p>
          <p className="text-xs text-green-600">risque moyen</p>
        </div>
      </div>

      {highRiskEmployees.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Actions recommandées :</h4>
          <ul className="space-y-1">
            {highRiskEmployees.slice(0, 3).map((employee, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Entretien individuel avec {employee.employeeName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

// Composant pour afficher les risques de burnout
const BurnoutRiskCard: React.FC<{ risks: PredictionResult[] }> = ({ risks }) => {
  const burnoutPredictions = risks.filter(r => r.riskType === 'burnout');
  const highRiskCount = burnoutPredictions.filter(r => r.riskLevel === 'high').length;
  const averageScore = burnoutPredictions.length > 0 ? 
    burnoutPredictions.reduce((sum, r) => sum + r.probability, 0) / burnoutPredictions.length : 0;

  return (
    <Card className="p-6 border-l-4 border-orange-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <FireIcon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Détection Burnout</h3>
          <p className="text-sm text-gray-600">Analyse IA du bien-être des équipes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Employés à risque</p>
              <p className="text-2xl font-bold text-orange-600">{highRiskCount}</p>
            </div>
            <FireIcon className="h-8 w-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Score moyen</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}%</p>
            </div>
            <ArrowTrendingDownIcon className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Mesures préventives actives</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">Télétravail flexible</span>
          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">Pause bien-être</span>
          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">Support psychologique</span>
        </div>
      </div>
    </Card>
  );
};

// Composant pour les recommandations de formation
const TrainingRecommendationsCard: React.FC<{ recommendations: TrainingRecommendation[] }> = ({ recommendations }) => {
  const highPriorityTrainings = recommendations.flatMap(r => 
    r.recommendedTrainings.filter(t => t.priority === 'high')
  );

  return (
    <Card className="p-6 border-l-4 border-blue-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <AcademicCapIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Recommandations Formation</h3>
          <p className="text-sm text-gray-600">Suggestions IA pour le développement des compétences</p>
        </div>
      </div>

      <div className="space-y-3">
        {highPriorityTrainings.slice(0, 3).map((training, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{training.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{training.reason}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {training.category}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    training.priority === 'high' ? 'bg-red-100 text-red-700' :
                    training.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {training.priority === 'high' ? 'Urgent' : 
                     training.priority === 'medium' ? 'Important' : 'Normal'}
                  </span>
                </div>
              </div>
              <LightBulbIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500">
          💡 {recommendations.length} employés avec recommandations • Mise à jour temps réel
        </p>
      </div>
    </Card>
  );
};

// Composant pour les analytics départementales
const DepartmentAnalyticsCard: React.FC<{ analytics: DepartmentInsight[] }> = ({ analytics }) => {
  const topPerforming = analytics.sort((a, b) => b.avgPerformance - a.avgPerformance)[0];
  const needsAttention = analytics.filter(a => a.avgPerformance < 70);

  return (
    <Card className="p-6 border-l-4 border-green-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <ChartBarIcon className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Analytics Départementales</h3>
          <p className="text-sm text-gray-600">Performance et recommandations par équipe</p>
        </div>
      </div>

      {topPerforming && (
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <span className="font-medium text-green-900">Département le plus performant</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-800">{topPerforming.department}</p>
              <p className="text-sm text-green-600">{topPerforming.recommendations[0] || 'Excellente performance'}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{topPerforming.avgPerformance}%</p>
              <p className="text-xs text-green-600">score performance</p>
            </div>
          </div>
        </div>
      )}

      {needsAttention.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Départements nécessitant attention :</h4>
          {needsAttention.map((dept, index) => (
            <div key={index} className="bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-yellow-800">{dept.department}</p>
                  <p className="text-sm text-yellow-600">{dept.recommendations[0] || 'Analyse en cours'}</p>
                </div>
                <span className="text-yellow-600 font-bold">{dept.avgPerformance}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

// Composant principal
const AIPredictionsDashboard: React.FC<AIPredictionsDashboardProps> = ({ className = '' }) => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [trainingRecommendations, setTrainingRecommendations] = useState<TrainingRecommendation[]>([]);
  const [departmentAnalytics, setDepartmentAnalytics] = useState<DepartmentInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      setIsLoading(true);
      try {
        // Simulation d'un délai de chargement pour l'effet d'animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Générer des prédictions pour tous les employés mockés
        const allPredictions: PredictionResult[] = [];
        
        // Générer des prédictions de turnover et burnout pour chaque employé
        mockEmployees.forEach(employee => {
          const turnoverPred = predictTurnoverRisk(employee);
          const burnoutPred = predictBurnoutRisk(employee);
          allPredictions.push(turnoverPred, burnoutPred);
        });
        
        setPredictions(allPredictions);
        
        // Générer des recommandations de formation pour quelques employés
        const trainingRecs = mockEmployees.slice(0, 5).map(emp => generateTrainingRecommendations(emp));
        setTrainingRecommendations(trainingRecs);
        
        // Générer des analytics départementales
        const deptAnalytics = generateDepartmentInsights(mockEmployees);
        setDepartmentAnalytics(deptAnalytics);
        
      } catch (error) {
        console.error('Erreur lors du chargement des prédictions IA:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPredictions();
  }, []);

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span className="text-gray-600">Analyse IA en cours...</span>
          </div>
        </Card>
      </div>
    );
  }

  const turnoverPredictions = predictions.filter(p => p.riskType === 'turnover');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec résumé global */}
      <FadeIn>
        <Card className="p-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prédictions IA Avancées</h2>
              <p className="text-blue-100">
                Analyse prédictive en temps réel de votre capital humain
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {turnoverPredictions.length > 0 ? 
                    Math.round((turnoverPredictions.filter(p => p.riskLevel === 'high').length / turnoverPredictions.length) * 100) : 0}%
                </p>
                <p className="text-xs text-blue-100">Risque global</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{trainingRecommendations.length}</p>
                <p className="text-xs text-blue-100">Recommandations</p>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>

      {/* Grille des prédictions */}
      <StaggerChildren>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left">
            <TurnoverRiskCard predictions={predictions} />
          </SlideIn>
          
          <SlideIn direction="right">
            <BurnoutRiskCard risks={predictions} />
          </SlideIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SlideIn direction="left" delay={200}>
            <TrainingRecommendationsCard recommendations={trainingRecommendations} />
          </SlideIn>
          
          <SlideIn direction="right" delay={200}>
            <DepartmentAnalyticsCard analytics={departmentAnalytics} />
          </SlideIn>
        </div>
      </StaggerChildren>

      {/* Visualisations avancées */}
      <FadeIn delay={600}>
        <AIInsightsVisualization 
          predictions={predictions}
          departmentInsights={departmentAnalytics}
          trainingRecommendations={trainingRecommendations}
        />
      </FadeIn>

      {/* Section actions rapides */}
      <FadeIn delay={400}>
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">🚀 Actions Rapides Recommandées</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-gray-900">Entretiens urgents</p>
                <p className="text-sm text-gray-600">
                  {turnoverPredictions.filter(p => p.riskLevel === 'high').length} employés à risque élevé
                </p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
              <AcademicCapIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">Planifier formations</p>
                <p className="text-sm text-gray-600">{trainingRecommendations.length} suggestions disponibles</p>
              </div>
            </button>
            
            <button className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left">
              <ChartBarIcon className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">Rapport détaillé</p>
                <p className="text-sm text-gray-600">Export analytics complet</p>
              </div>
            </button>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
};

export default AIPredictionsDashboard;
