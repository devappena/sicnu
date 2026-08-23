import React, { useState } from 'react';
import { 
  XMarkIcon, 
  AcademicCapIcon, 
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import type { Training } from '../types';

interface TrainingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trainingData: Omit<Training, 'id' | 'enrolledEmployees' | 'participants'>) => void;
  training?: Training | null; // Pour l'édition
}

export default function TrainingFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  training 
}: TrainingFormModalProps) {
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    title: training?.title || '',
    description: training?.description || '',
    startDate: training?.startDate ? format(training.startDate, 'yyyy-MM-dd') : '',
    endDate: training?.endDate ? format(training.endDate, 'yyyy-MM-dd') : '',
    startTime: training?.startDate ? format(training.startDate, 'HH:mm') : '09:00',
    endTime: training?.endDate ? format(training.endDate, 'HH:mm') : '17:00',
    instructor: training?.instructor || '',
    capacity: training?.capacity || 20,
    location: training?.location || '',
    status: training?.status || 'scheduled' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trainingCategories = [
    { value: 'leadership', label: 'Leadership & Management', icon: '👑' },
    { value: 'technical', label: 'Compétences Techniques', icon: '💻' },
    { value: 'communication', label: 'Communication', icon: '🗣️' },
    { value: 'legal', label: 'Droit & Réglementation', icon: '⚖️' },
    { value: 'finance', label: 'Finance & Gestion', icon: '💰' },
    { value: 'safety', label: 'Sécurité & Santé', icon: '🛡️' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 20) {
      newErrors.description = 'La description doit contenir au moins 20 caractères';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (startDateTime >= endDateTime) {
        newErrors.endDate = 'La date/heure de fin doit être après la date/heure de début';
      }

      if (startDateTime < new Date()) {
        newErrors.startDate = 'La date de début ne peut pas être dans le passé';
      }
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Le formateur est requis';
    }

    if (formData.capacity < 1 || formData.capacity > 100) {
      newErrors.capacity = 'La capacité doit être entre 1 et 100 participants';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const trainingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: startDateTime,
        endDate: endDateTime,
        instructor: formData.instructor.trim(),
        capacity: formData.capacity,
        location: formData.location.trim(),
        status: formData.status
      };

      await onSubmit(trainingData);
      
      // Reset form if not editing
      if (!training) {
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          startTime: '09:00',
          endTime: '17:00',
          instructor: '',
          capacity: 20,
          location: '',
          status: 'scheduled'
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else {
        return `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      }
    }
    return '0 heure';
  };

  if (!isOpen) return null;

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
          inline-block w-full max-w-4xl px-6 py-6 my-8 text-left align-middle transition-all transform
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
                {training ? 'Modifier la formation' : 'Nouvelle formation'}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Titre */}
              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Titre de la formation *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="ex: Formation en Leadership Administratif"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${errors.title ? 'border-red-500' : ''}
                  `}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Formateur */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Formateur *
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  placeholder="ex: Dr. Jean-Pierre Mukendi"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    ${errors.instructor ? 'border-red-500' : ''}
                  `}
                />
                {errors.instructor && (
                  <p className="mt-1 text-sm text-red-600">{errors.instructor}</p>
                )}
              </div>

              {/* Capacité */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Nombre de participants max *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    ${errors.capacity ? 'border-red-500' : ''}
                  `}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                placeholder="Décrivez les objectifs, le contenu et les compétences à acquérir..."
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  ${errors.description ? 'border-red-500' : ''}
                `}
              />
              <div className="flex justify-between mt-1">
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
                <p className={`text-sm ml-auto ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {formData.description.length}/1000
                </p>
              </div>
            </div>

            {/* Dates et heures */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      ${errors.startDate ? 'border-red-500' : ''}
                    `}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                      ${errors.endDate ? 'border-red-500' : ''}
                    `}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className={`
                      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                      ${isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                      }
                    `}
                  />
                </div>
              </div>
            </div>

            {errors.startDate && (
              <p className="text-sm text-red-600">{errors.startDate}</p>
            )}
            {errors.endDate && (
              <p className="text-sm text-red-600">{errors.endDate}</p>
            )}

            {/* Durée calculée */}
            {formData.startDate && formData.endDate && (
              <div className={`
                p-3 rounded-lg border-l-4 border-cnu-blue-500 
                ${isDarkMode ? 'bg-slate-700' : 'bg-cnu-blue-50'}
              `}>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 text-cnu-blue-600 mr-2" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-cnu-blue-800'}`}>
                    Durée: {calculateDuration()}
                  </span>
                </div>
              </div>
            )}

            {/* Localisation et statut */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lieu */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Lieu (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="ex: Salle de conférence CNU, Kinshasa"
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                  `}
                />
              </div>

              {/* Statut */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cnu-blue-500 focus:border-cnu-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                >
                  <option value="scheduled">Planifiée</option>
                  <option value="in-progress">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-600">
              <button
                type="button"
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
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-cnu-blue-600 hover:bg-cnu-blue-700'
                  }
                `}
              >
                {isSubmitting 
                  ? 'Enregistrement...' 
                  : training 
                    ? 'Mettre à jour' 
                    : 'Créer la formation'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
