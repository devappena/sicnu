 import React, { useState } from 'react';
import { 
  AcademicCapIcon, 
  CalendarIcon, 
  UserGroupIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PlayIcon,
  EyeIcon,
  PencilIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChartBarIcon,
  UsersIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import TrainingFormModal from '../../components/TrainingFormModal';
import TrainingEnrollmentModal from '../../components/TrainingEnrollmentModal';
import TrainingRequestModal from '../../components/TrainingRequestModal';
import TrainingCalendar from '../../components/TrainingCalendar';
import { useToast } from '../../hooks/useToast';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../contexts/AuthContext';
import { 
  useTrainings, 
  useCreateTraining, 
  useUpdateTraining, 
  useEnrollTraining 
} from '../../hooks/api';
import type { Training } from '../../types';

// Composant de statistiques
function TrainingStats({ trainings }: { trainings: Training[] }) {
  const { isDarkMode } = useTheme();
  
  const stats = {
    total: trainings.length,
    scheduled: trainings.filter(t => t.status === 'scheduled').length,
    inProgress: trainings.filter(t => t.status === 'in-progress').length,
    completed: trainings.filter(t => t.status === 'completed').length,
    totalEnrolled: trainings.reduce((sum, t) => sum + t.enrolledEmployees.length, 0),
    averageCapacity: Math.round(trainings.reduce((sum, t) => sum + (t.enrolledEmployees.length / t.capacity * 100), 0) / trainings.length)
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      <div className={`bg-ena-blue text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <AcademicCapIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.total}</div>
        <div className="text-xs opacity-90">Total</div>
      </div>
      
      <div className={`bg-yellow-500 text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <CalendarIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.scheduled}</div>
        <div className="text-xs opacity-90">Planifiées</div>
      </div>
      
      <div className={`bg-purple-500 text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <PlayIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.inProgress}</div>
        <div className="text-xs opacity-90">En cours</div>
      </div>
      
      <div className={`bg-green-500 text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <CheckCircleIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.completed}</div>
        <div className="text-xs opacity-90">Terminées</div>
      </div>

      <div className={`bg-indigo-500 text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <UsersIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.totalEnrolled}</div>
        <div className="text-xs opacity-90">Participants</div>
      </div>

      <div className={`bg-orange-500 text-white p-4 rounded-lg text-center ${isDarkMode ? 'shadow-lg' : 'shadow'}`}>
        <ChartBarIcon className="h-6 w-6 mx-auto mb-2" />
        <div className="text-lg font-bold">{stats.averageCapacity}%</div>
        <div className="text-xs opacity-90">Taux moyen</div>
      </div>
    </div>
  );
}

// Composant TrainingCard amélioré
interface TrainingCardProps {
  training: Training;
  onViewDetails: (training: Training) => void;
  onEdit: (training: Training) => void;
  currentUserId?: string;
  viewMode: 'grid' | 'list' | 'calendar';
  canEdit?: boolean;
}

function TrainingCard({ training, onViewDetails, onEdit, currentUserId, viewMode, canEdit = false }: TrainingCardProps) {
  const { isDarkMode } = useTheme();

  const isEnrolled = currentUserId ? training.enrolledEmployees.includes(currentUserId) : false;
  const availableSpots = training.capacity - training.enrolledEmployees.length;
  const isFull = availableSpots <= 0;
  const occupancyRate = Math.round((training.enrolledEmployees.length / training.capacity) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'in-progress':
        return 'bg-ena-blue/10 text-ena-blue border-ena-blue/20 dark:bg-ena-blue/20 dark:text-ena-blue';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'in-progress': return 'En cours';
      case 'scheduled': return 'Planifiée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnue';
    }
  };

  const calculateDuration = () => {
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className={`
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
        border rounded-lg p-4 hover:shadow-md transition-shadow duration-200
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-ena-blue-100 flex items-center justify-center flex-shrink-0">
              <AcademicCapIcon className="h-6 w-6 text-ena-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-1">
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                  {training.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
                  {getStatusText(training.status)}
                </span>
                {isEnrolled && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Inscrit(e)
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className={`flex items-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{format(new Date(training.startDate), 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{calculateDuration()}</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  <span>{training.enrolledEmployees.length}/{training.capacity} ({occupancyRate}%)</span>
                </div>
                <div className={`flex items-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  <span className="truncate">{training.instructor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
            <button 
              onClick={() => onViewDetails(training)}
              className="p-2 bg-ena-blue-50 text-ena-blue-700 rounded-lg hover:bg-ena-blue-100 transition-colors"
              title="Voir détails"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            {canEdit && (
              <button
                onClick={() => onEdit(training)}
                className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title="Modifier"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vue grille (mode par défaut)
  return (
    <div className={`
      ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
      border rounded-lg p-4 hover:shadow-md transition-shadow duration-200
    `}>
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-ena-blue-100 flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-ena-blue-600" />
          </div>
          <div>
            <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {training.title}
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {calculateDuration()}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(training.status)}`}>
          {getStatusText(training.status)}
        </span>
      </div>

      {/* Description */}
      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-4 line-clamp-2`}>
        {training.description}
      </p>

      {/* Détails */}
      <div className="space-y-2 mb-4">
        <div className={`flex items-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span>
            {format(new Date(training.startDate), 'dd/MM/yyyy', { locale: fr })}
          </span>
        </div>
        <div className={`flex items-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <UserGroupIcon className="h-4 w-4 mr-2" />
          <span>{training.enrolledEmployees.length}/{training.capacity} participants</span>
        </div>
        {training.location && (
          <div className={`flex items-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span>{training.location}</span>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Occupation
          </span>
          <span className={`text-xs font-medium ${
            isFull ? 'text-red-600' : 'text-ena-blue-600'
          }`}>
            {occupancyRate}%
          </span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? 'bg-slate-600' : ''}`}>
          <div 
            className={`h-2 rounded-full transition-all ${
              isFull ? 'bg-red-500' : 'bg-ena-blue-500'
            }`}
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
      </div>

      {/* Statut d'inscription */}
      {isEnrolled && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Vous êtes inscrit(e)
          </span>
        </div>
      )}

      {/* Formateur */}
      <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-4`}>
        <span className="font-medium">Formateur:</span> {training.instructor}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onViewDetails(training)}
          className="flex-1 bg-ena-blue-50 text-ena-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-ena-blue-100 transition-colors flex items-center justify-center"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          Voir détails
        </button>
        {canEdit && (
          <button
            onClick={() => onEdit(training)}
            className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            title="Modifier"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TrainingsNew() {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // React Query hooks
  const { data: trainings, isLoading, error } = useTrainings();
  const createTraining = useCreateTraining();
  const updateTraining = useUpdateTraining();
  const enrollTraining = useEnrollTraining();
  
  // Local state
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  
  // Droits selon le rôle de l'utilisateur
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const canManageTrainings = isAdmin;
  const canCreateTrainings = isAdmin;

  const trainingsList = trainings || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorMessage 
        message="Erreur lors du chargement des formations" 
        error={error}
      />
    );
  }

  // Filtrage et recherche
  const filteredTrainings = trainingsList.filter(training => {
    const matchesStatus = selectedStatus === 'all' || training.status === selectedStatus;
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleNewTraining = () => {
    setEditingTraining(null);
    setIsFormModalOpen(true);
  };

  const handleEditTraining = (training: Training) => {
    setEditingTraining(training);
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (training: Training) => {
    setSelectedTraining(training);
    setIsEnrollmentModalOpen(true);
  };

  const handleCreateTraining = async (trainingData: Omit<Training, 'id' | 'enrolledEmployees' | 'participants'>) => {
    createTraining.mutate(trainingData, {
      onSuccess: () => {
        showToast('success', 'Formation créée avec succès');
        setIsFormModalOpen(false);
        setEditingTraining(null);
      },
      onError: (error) => {
        showToast('error', `Erreur lors de la création: ${error.message}`);
      }
    });
  };

  const handleUpdateTraining = async (trainingData: Omit<Training, 'id' | 'enrolledEmployees' | 'participants'>) => {
    if (!editingTraining) return;
    
    updateTraining.mutate(
      { id: editingTraining.id, data: trainingData },
      {
        onSuccess: () => {
          showToast('success', 'Formation mise à jour avec succès');
          setIsFormModalOpen(false);
          setEditingTraining(null);
        },
        onError: (error) => {
          showToast('error', `Erreur lors de la mise à jour: ${error.message}`);
        }
      }
    );
  };

  const handleEnroll = async (trainingId: string, employeeId: string, notes?: string) => {
    enrollTraining.mutate(
      { trainingId, employeeId, notes },
      {
        onSuccess: () => {
          showToast('success', 'Inscription réussie');
          setIsEnrollmentModalOpen(false);
          setSelectedTraining(null);
        },
        onError: (error) => {
          showToast('error', `Erreur lors de l'inscription: ${error.message}`);
        }
      }
    );
  };

  const handleTrainingRequest = async (_requestData: {
    title: string;
    category: string;
    priority: string;
    duration: string;
    targetDate: string;
    participants: number;
    budget: string;
    justification: string;
    objectives: string;
    preferredTrainer: string;
  }) => {
    // Ici, on enverrait la demande au backend
    // TODO: Implémenter l'envoi vers l'API backend
    showToast('success', 'Demande envoyée', 'Votre demande de formation a été transmise aux RH');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Centre de Formations"
        description={`${filteredTrainings.length} formation(s) disponible(s)`}
        icon={AcademicCapIcon}
      >
        <div className="flex gap-3">
          {/* Bouton demande de formation (accessible à tous) */}
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            Demander une formation
          </button>
          
          {/* Bouton création (admin seulement) */}
          {canCreateTrainings && (
            <button
              onClick={handleNewTraining}
              className="bg-ena-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ena-blue-700 transition-colors flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Formation
            </button>
          )}
        </div>
      </PageHeader>

      {/* Statistiques */}
      <TrainingStats trainings={trainings} />

      {/* Filtres et recherche */}
      <Card>
        <div className="space-y-4">
          {/* Barre de recherche */}
          <div>
            <input
              type="text"
              placeholder="Rechercher une formation, formateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-ena-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Filtres et modes de vue */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filtres de statut */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Toutes', count: trainings.length },
                { key: 'scheduled', label: 'Planifiées', count: trainings.filter(t => t.status === 'scheduled').length },
                { key: 'in-progress', label: 'En cours', count: trainings.filter(t => t.status === 'in-progress').length },
                { key: 'completed', label: 'Terminées', count: trainings.filter(t => t.status === 'completed').length },
                { key: 'cancelled', label: 'Annulées', count: trainings.filter(t => t.status === 'cancelled').length }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedStatus(filter.key as typeof selectedStatus)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedStatus === filter.key
                      ? 'bg-ena-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    selectedStatus === filter.key
                      ? 'bg-ena-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-slate-300'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Modes de vue */}
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-600 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Vue grille"
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-600 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Vue liste"
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-600 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Vue calendrier"
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Liste des formations */}
      {filteredTrainings.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucune formation trouvée'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              {searchTerm 
                ? `Aucune formation ne correspond à "${searchTerm}".`
                : selectedStatus === 'all' 
                  ? 'Aucune formation disponible pour le moment.' 
                  : `Aucune formation ${selectedStatus === 'scheduled' ? 'planifiée' : selectedStatus === 'in-progress' ? 'en cours' : selectedStatus === 'completed' ? 'terminée' : 'annulée'}.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-ena-blue-600 hover:text-ena-blue-500 text-sm font-medium"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        </Card>
      ) : viewMode === 'calendar' ? (
        <TrainingCalendar 
          trainings={filteredTrainings}
          onTrainingClick={handleViewDetails}
        />
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-4"
        }>
          {filteredTrainings.map(training => (
            <TrainingCard
              key={training.id}
              training={training}
              onViewDetails={handleViewDetails}
              onEdit={handleEditTraining}
              currentUserId={user?.id}
              viewMode={viewMode}
              canEdit={canManageTrainings}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TrainingFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTraining(null);
        }}
        onSubmit={editingTraining ? handleUpdateTraining : handleCreateTraining}
        training={editingTraining}
      />

      <TrainingEnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => {
          setIsEnrollmentModalOpen(false);
          setSelectedTraining(null);
        }}
        training={selectedTraining}
        employee={user ? { 
          id: user.id, 
          firstName: user.firstName, 
          lastName: user.lastName, 
          email: user.email,
          phone: '',
          department: 'Non spécifié',
          position: 'Non spécifié',
          salary: 0,
          hireDate: new Date(),
          status: 'active' as const,
          photo: '',
          address: '',
          dateOfBirth: new Date(),
          emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
          }
        } : null}
        onEnroll={handleEnroll}
        isAlreadyEnrolled={selectedTraining?.enrolledEmployees.includes(user?.id || '') || false}
      />

      <TrainingRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleTrainingRequest}
      />
    </div>
  );
}
