import React, { useState, Suspense } from 'react';
import {
  UsersIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  FireIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  mockEmployees,
  mockAbsences
} from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import { FadeIn, SlideIn, StaggerChildren, ScaleIn } from '../components/Animations';

// Données mock pour le dashboard avancé
const quickActions = [
  { name: 'Nouvelle Absence', color: 'bg-blue-600', icon: CalendarIcon },
  { name: 'Rapport Mensuel', color: 'bg-green-600', icon: ChartBarIcon },
  { name: 'Nouvel Employé', color: 'bg-purple-600', icon: UsersIcon },
  { name: 'Formation', color: 'bg-orange-600', icon: AcademicCapIcon },
];

const recentActivities = [
  {
    id: 1,
    message: 'Jean Dupont a soumis une demande de congé pour la semaine prochaine',
    time: '5 min',
    icon: CalendarIcon,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    message: 'Marie Martin a terminé sa formation en gestion de projet',
    time: '1h',
    icon: AcademicCapIcon,
    color: 'bg-green-500',
  },
  {
    id: 3,
    message: 'Alerte: Budget RH dépassé de 5% ce mois',
    time: '2h',
    icon: ExclamationTriangleIcon,
    color: 'bg-red-500',
  },
  {
    id: 4,
    message: 'Nouveau rapport de satisfaction employé disponible',
    time: '3h',
    icon: ChartBarIcon,
    color: 'bg-purple-500',
  },
];

const aiSuggestions = [
  {
    id: 1,
    title: 'Optimisation des Horaires',
    description: 'Réorganiser les équipes pour réduire les heures supplémentaires de 15%',
    impact: 'high',
    icon: ClockIcon,
  },
  {
    id: 2,
    title: 'Formation Recommandée',
    description: 'Leadership pour les managers - amélioration prédite de 20% de la satisfaction',
    impact: 'medium',
    icon: LightBulbIcon,
  },
  {
    id: 3,
    title: 'Rétention des Talents',
    description: 'Identifier et retenir les employés à risque de départ',
    impact: 'high',
    icon: TrendingUpIcon,
  },
];

// Composant Activités Récentes
const RecentActivities: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
        <BellIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        <StaggerChildren 
          delay={150}
          children={recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className={`p-2 rounded-lg ${activity.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 line-clamp-2">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">il y a {activity.time}</p>
                </div>
              </div>
            );
          })}
        />
      </div>
    </Card>
  );
};

// Composant Actions Rapides
const QuickActions: React.FC = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
      <div className="grid grid-cols-2 gap-3">
        <StaggerChildren 
          delay={100}
          children={quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.name}
                className={`${action.color} text-white p-4 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group`}
              >
                <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                {action.name}
              </button>
            );
          })}
        />
      </div>
    </Card>
  );
};

// Composant Suggestions IA
const AISuggestions: React.FC = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case 'high': return 'Impact Élevé';
      case 'medium': return 'Impact Moyen';
      case 'low': return 'Impact Faible';
      default: return 'Impact Inconnu';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <LightBulbIcon className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Suggestions IA</h3>
      </div>
      <div className="space-y-4">
        {aiSuggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <FadeIn key={suggestion.id} delay={index * 200}>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                        {getImpactLabel(suggestion.impact)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium">
                      Appliquer la suggestion →
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </Card>
  );
};

// Composant Météo RH
const HRWeather: React.FC = () => {
  const weatherData = {
    overall: 'Ensoleillé',
    temperature: '85°',
    description: 'Excellente santé organisationnelle',
    metrics: [
      { label: 'Satisfaction', value: 85, color: 'bg-green-400' },
      { label: 'Productivité', value: 78, color: 'bg-blue-400' },
      { label: 'Rétention', value: 92, color: 'bg-purple-400' },
      { label: 'Engagement', value: 73, color: 'bg-yellow-400' },
    ]
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-4xl">☀️</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Météo RH</h3>
          <p className="text-sm text-gray-600">{weatherData.description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-3xl font-bold text-gray-900">{weatherData.temperature}</span>
          <p className="text-sm text-gray-600">{weatherData.overall}</p>
        </div>
        <FireIcon className="h-8 w-8 text-orange-500" />
      </div>

      <div className="space-y-2">
        {weatherData.metrics.map((metric, index) => (
          <FadeIn key={metric.label} delay={index * 100}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.color} transition-all duration-1000`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{metric.value}%</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Card>
  );
};

// Composant principal
const DashboardAdvanced: React.FC = () => {
  const [isLoading] = useState(false);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec animations */}
      <FadeIn>
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <SlideIn direction="left">
            <h1 className="text-3xl font-bold mb-2">Bonjour {user?.firstName || 'Employé'}</h1>
            <p className="text-blue-100">Intelligence artificielle au service de vos ressources humaines</p>
          </SlideIn>
          <SlideIn direction="right" delay={300}>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-300" />
                <span className="text-sm">Système opérationnel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Temps réel</span>
              </div>
            </div>
          </SlideIn>
        </div>
      </FadeIn>

      {/* Analytics prédictifs */}
      <ScaleIn>
        <Suspense fallback={<LoadingSpinner />}>
          <PredictiveAnalytics employees={mockEmployees} absences={mockAbsences} />
        </Suspense>
      </ScaleIn>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-2 space-y-6">
          <SlideIn direction="left">
            <RecentActivities />
          </SlideIn>
          
          <SlideIn direction="left" delay={200}>
            <AISuggestions />
          </SlideIn>
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          <SlideIn direction="right">
            <QuickActions />
          </SlideIn>
          
          <SlideIn direction="right" delay={200}>
            <HRWeather />
          </SlideIn>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdvanced;
