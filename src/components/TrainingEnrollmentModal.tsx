import React, { useState } from 'react';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import type { Training, Employee } from '../types';

interface TrainingEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: Training | null;
  employee: Employee | null;
  onEnroll: (trainingId: string, employeeId: string, notes?: string) => void;
  isAlreadyEnrolled?: boolean;
}

export default function TrainingEnrollmentModal({ 
  isOpen, 
  onClose, 
  training, 
  employee,
  onEnroll,
  isAlreadyEnrolled = false
}: TrainingEnrollmentModalProps) {
  const { isDarkMode } = useTheme();
  
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const calculateDuration = () => {
    if (!training) return '';
    
    const start = new Date(training.startDate);
    const end = new Date(training.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
  };

  const getAvailableSpots = () => {
    if (!training) return 0;
    return training.capacity - training.enrolledEmployees.length;
  };

  const isFull = () => {
    return getAvailableSpots() <= 0;
  };

  const canEnroll = () => {
    if (!training || !employee) return false;
    if (isAlreadyEnrolled) return false;
    if (isFull()) return false;
    if (training.status !== 'scheduled') return false;
    return true;
  };

  const handleEnroll = async () => {
    if (!training || !employee || !canEnroll()) return;

    setIsSubmitting(true);

    try {
      await onEnroll(training.id, employee.id, notes);
      setShowConfirmation(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setShowConfirmation(false);
        setNotes('');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in-progress':
        return 'En cours';
      case 'scheduled':
        return 'Planifiée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnue';
    }
  };

  if (!isOpen || !training) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`
          inline-block w-full max-w-3xl px-6 py-6 my-8 text-left align-middle transition-all transform
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          border rounded-xl shadow-xl sm:align-middle
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cnu-blue-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-cnu-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Détails de la formation
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}
              `}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Confirmation Success */}
          {showConfirmation && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-700">
              <div className="flex items-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">
                    Inscription réussie !
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Vous êtes maintenant inscrit(e) à cette formation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informations de la formation */}
          <div className="space-y-6">
            {/* Titre et statut */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {training.title}
                </h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(training.status)}`}>
                  {getStatusText(training.status)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={`
              p-4 rounded-lg
              ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}
              border
            `}>
              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Description
              </h5>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {training.description}
              </p>
            </div>

            {/* Détails */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dates */}
              <div className={`
                p-4 rounded-lg
                ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
                border
              `}>
                <div className="flex items-center space-x-3 mb-3">
                  <CalendarIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                  <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Dates et horaires
                  </h5>
                </div>
                <div className="space-y-2">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Début:</span> {format(new Date(training.startDate), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Fin:</span> {format(new Date(training.endDate), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-cnu-blue-400' : 'text-cnu-blue-600'}`}>
                    Durée: {calculateDuration()}
                  </p>
                </div>
              </div>

              {/* Capacité et formateur */}
              <div className={`
                p-4 rounded-lg
                ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
                border
              `}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserGroupIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <div>
                      <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Participants
                      </h5>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {training.enrolledEmployees.length}/{training.capacity} inscrits
                      </p>
                      <div className={`w-full bg-gray-200 rounded-full h-2 mt-1 ${isDarkMode ? 'bg-slate-600' : ''}`}>
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            isFull() ? 'bg-red-500' : 'bg-cnu-blue-500'
                          }`}
                          style={{ width: `${(training.enrolledEmployees.length / training.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <AcademicCapIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                    <div>
                      <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Formateur
                      </h5>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                        {training.instructor}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lieu */}
            {training.location && (
              <div className={`
                p-4 rounded-lg
                ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
                border
              `}>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                  <div>
                    <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Lieu
                    </h5>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {training.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Alertes */}
            {!canEnroll() && (
              <div className={`
                p-4 rounded-lg border-l-4
                ${isAlreadyEnrolled 
                  ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20' 
                  : isFull() 
                    ? 'bg-red-50 border-red-500 dark:bg-red-900/20'
                    : 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20'
                }
              `}>
                <div className="flex items-center">
                  <ExclamationTriangleIcon className={`w-6 h-6 mr-3 ${
                    isAlreadyEnrolled ? 'text-blue-600' : isFull() ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className={`font-medium ${
                      isAlreadyEnrolled 
                        ? 'text-blue-800 dark:text-blue-200' 
                        : isFull() 
                          ? 'text-red-800 dark:text-red-200'
                          : 'text-yellow-800 dark:text-yellow-200'
                    }`}>
                      {isAlreadyEnrolled 
                        ? 'Déjà inscrit(e)' 
                        : isFull() 
                          ? 'Formation complète'
                          : 'Inscription non disponible'
                      }
                    </h4>
                    <p className={`text-sm ${
                      isAlreadyEnrolled 
                        ? 'text-blue-600 dark:text-blue-300' 
                        : isFull() 
                          ? 'text-red-600 dark:text-red-300'
                          : 'text-yellow-600 dark:text-yellow-300'
                    }`}>
                      {isAlreadyEnrolled 
                        ? 'Vous êtes déjà inscrit(e) à cette formation.'
                        : isFull() 
                          ? 'Cette formation a atteint sa capacité maximale.'
                          : 'Cette formation n\'est plus ouverte aux inscriptions.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Formulaire d'inscription */}
            {canEnroll() && !showConfirmation && (
              <div className={`
                p-4 rounded-lg
                ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
                border
              `}>
                <h5 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notes (optionnel)
                </h5>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ajoutez des commentaires ou questions concernant cette formation..."
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                  `}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-slate-600">
            <button
              onClick={onClose}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-700 border-slate-600' 
                  : 'text-gray-700 hover:bg-gray-50 border-gray-300'
                }
                border
              `}
            >
              Fermer
            </button>
            
            {canEnroll() && !showConfirmation && (
              <button
                onClick={handleEnroll}
                disabled={isSubmitting}
                className={`
                  px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-cnu-blue-600 hover:bg-cnu-blue-700'
                  }
                `}
              >
                {isSubmitting ? 'Inscription...' : 'S\'inscrire à la formation'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
