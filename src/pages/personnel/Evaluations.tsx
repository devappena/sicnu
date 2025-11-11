import React, { useState } from 'react';
import { 
  StarIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockPerformanceReviews, mockEmployees } from '../../data/mockData';
import { useToast } from '../../hooks/useToast';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import type { PerformanceReview } from '../../types';

// Composant EvaluationCard
interface EvaluationCardProps {
  review: PerformanceReview;
  onView: (review: PerformanceReview) => void;
  onEdit: (review: PerformanceReview) => void;
}

function EvaluationCard({ review, onView, onEdit }: EvaluationCardProps) {
  const employee = mockEmployees.find(emp => emp.id === review.employeeId);
  const reviewer = mockEmployees.find(emp => emp.id === review.reviewerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'submitted':
        return 'Soumis';
      case 'draft':
        return 'Brouillon';
      default:
        return 'Inconnu';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <div className="space-y-4">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {employee ? `${employee.firstName[0]}${employee.lastName[0]}` : 'N/A'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu'}
              </h3>
              <p className="text-sm text-gray-500">{employee?.position || 'Position inconnue'}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(review.status)}`}>
            {getStatusText(review.status)}
          </span>
        </div>

        {/* Détails */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Période</p>
            <p className="font-medium">{review.period}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Note globale</p>
            <div className="flex items-center space-x-1">
              <span className="font-bold text-lg">{review.overallRating}</span>
              <div className="flex">
                {renderStars(review.overallRating)}
              </div>
            </div>
          </div>
        </div>

        {/* Évaluateur et Date */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Évaluateur</p>
            <p className="font-medium">{reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : 'Non assigné'}</p>
          </div>
          <div>
            <p className="text-gray-500">Date d'évaluation</p>
            <p className="font-medium">
              {review.completedDate 
                ? format(new Date(review.completedDate), 'dd MMM yyyy', { locale: fr })
                : 'Non complétée'
              }
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-3 border-t">
          <button
            onClick={() => onView(review)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Voir
          </button>
          <button
            onClick={() => onEdit(review)}
            className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Éditer
          </button>
        </div>
      </div>
    </Card>
  );
}

const Evaluations: React.FC = () => {
  const [reviews] = useState<PerformanceReview[]>(mockPerformanceReviews);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const { showToast } = useToast();

  const periods = [
    { value: 'all', label: 'Toutes les périodes' },
    { value: '2025-S1', label: '2025 - Premier semestre' },
    { value: '2024-S2', label: '2024 - Deuxième semestre' },
    { value: '2024-S1', label: '2024 - Premier semestre' }
  ];

  const filteredReviews = reviews.filter(review => {
    if (selectedPeriod === 'all') return true;
    return review.period === selectedPeriod;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length 
    : 0;

  const completedReviews = reviews.filter(review => review.status === 'approved').length;
  const pendingReviews = reviews.filter(review => review.status === 'submitted').length;
  const draftReviews = reviews.filter(review => review.status === 'draft').length;

  // Actions rapides
  const quickActions = [
    {
      title: 'Nouvelle Évaluation',
      icon: PlusIcon,
      color: 'blue',
      description: 'Créer une nouvelle évaluation de performance',
      action: () => showToast('info', 'Fonctionnalité de création d\'évaluation à implémenter')
    },
    {
      title: 'Rapport Annuel',
      icon: DocumentTextIcon,
      color: 'purple',
      description: 'Générer un rapport annuel des évaluations',
      action: () => showToast('info', 'Génération de rapport annuel à implémenter')
    },
    {
      title: 'Modèles d\'Évaluation',
      icon: ClipboardDocumentCheckIcon,
      color: 'indigo',
      description: 'Gérer les modèles d\'évaluation',
      action: () => showToast('info', 'Gestion des modèles d\'évaluation à implémenter')
    },
    {
      title: 'Calibrage',
      icon: ChartBarIcon,
      color: 'emerald',
      description: 'Calibrer les notes d\'évaluation',
      action: () => showToast('info', 'Calibrage des évaluations à implémenter')
    }
  ];

  const handleViewReview = (review: PerformanceReview) => {
    showToast('info', `Affichage de l'évaluation de ${mockEmployees.find(e => e.id === review.employeeId)?.firstName || 'l\'employé'}`);
  };

  const handleEditReview = (review: PerformanceReview) => {
    showToast('info', `Édition de l'évaluation de ${mockEmployees.find(e => e.id === review.employeeId)?.firstName || 'l\'employé'}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Évaluations de Performance"
        description="Suivi et gestion des évaluations des employés"
        icon={ClipboardDocumentCheckIcon}
      />

      {/* Filtres */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="select-input"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Note Moyenne</h3>
              <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
            </div>
            <StarIcon className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Complétées</h3>
              <p className="text-2xl font-bold">{completedReviews}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">En Attente</h3>
              <p className="text-2xl font-bold">{pendingReviews}</p>
            </div>
            <CalendarIcon className="h-8 w-8 opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Brouillons</h3>
              <p className="text-2xl font-bold">{draftReviews}</p>
            </div>
            <DocumentTextIcon className="h-8 w-8 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-gradient-to-br ${
                action.color === 'blue' ? 'from-blue-400 to-blue-600' :
                action.color === 'purple' ? 'from-purple-400 to-purple-600' :
                action.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                'from-emerald-400 to-emerald-600'
              } text-white rounded-lg p-6 shadow-sm`}
              onClick={action.action}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
                <action.icon className="h-8 w-8 opacity-80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des évaluations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Évaluations ({filteredReviews.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <EvaluationCard
              key={review.id}
              review={review}
              onView={handleViewReview}
              onEdit={handleEditReview}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
