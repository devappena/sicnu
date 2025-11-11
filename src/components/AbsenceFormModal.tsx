import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  DocumentArrowUpIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import type { Absence } from '../types';

interface AbsenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (absenceData: Omit<Absence, 'id' | 'status' | 'approvedBy'>) => void;
  employeeId?: string;
}

export default function AbsenceFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employeeId 
}: AbsenceFormModalProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    employeeId: employeeId || '',
    type: 'vacation' as const,
    startDate: '',
    endDate: '',
    reason: '',
    documents: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const absenceTypes = [
    { value: 'vacation', label: 'Congé payé', icon: '🏖️' },
    { value: 'sick', label: 'Congé maladie', icon: '🏥' },
    { value: 'personal', label: 'Congé personnel', icon: '👤' },
    { value: 'maternity', label: 'Congé maternité', icon: '👶' },
    { value: 'paternity', label: 'Congé paternité', icon: '👨‍👶' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'L\'employé est requis';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (startDate > endDate) {
        newErrors.endDate = 'La date de fin doit être après la date de début';
      }

      if (startDate < new Date()) {
        newErrors.startDate = 'La date de début ne peut pas être dans le passé';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'La raison est requise';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'La raison doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSubmitting(true);

    try {
      const absenceData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      };

      await onSubmit(absenceData);
      
      showToast('success', 'Demande d\'absence soumise avec succès');
      
      // Reset form
      setFormData({
        employeeId: employeeId || '',
        type: 'vacation',
        startDate: '',
        endDate: '',
        reason: '',
        documents: []
      });
      
      onClose();
    } catch {
      showToast('error', 'Erreur lors de la soumission de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Ici on simule l'upload - en production, on ferait un vrai upload
    const fileNames = files.map(f => f.name);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...fileNames]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const calculateDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
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
          inline-block w-full max-w-2xl px-6 py-6 my-8 text-left align-middle transition-all transform
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          border rounded-xl shadow-xl sm:align-middle
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-ena-blue-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-ena-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Nouvelle demande d'absence
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
            {/* Type d'absence */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Type d'absence *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {absenceTypes.map(type => (
                  <label
                    key={type.value}
                    className={`
                      relative flex items-center p-4 border rounded-lg cursor-pointer transition-all
                      ${formData.type === type.value
                        ? 'border-ena-blue-500 bg-ena-blue-50 ring-2 ring-ena-blue-200'
                        : isDarkMode 
                          ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' 
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Date de début *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-ena-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    ${errors.startDate ? 'border-red-500' : ''}
                  `}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  Date de fin *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-ena-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                    ${errors.endDate ? 'border-red-500' : ''}
                  `}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Durée calculée */}
            {calculateDuration() > 0 && (
              <div className={`
                p-3 rounded-lg border-l-4 border-ena-blue-500 
                ${isDarkMode ? 'bg-slate-700' : 'bg-ena-blue-50'}
              `}>
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 text-ena-blue-600 mr-2" />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-ena-blue-800'}`}>
                    Durée: {calculateDuration()} jour{calculateDuration() > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Raison */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Raison de l'absence *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={4}
                placeholder="Expliquez la raison de votre demande d'absence..."
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-ena-blue-500
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                  ${errors.reason ? 'border-red-500' : ''}
                `}
              />
              <div className="flex justify-between mt-1">
                {errors.reason && (
                  <p className="text-sm text-red-600">{errors.reason}</p>
                )}
                <p className={`text-sm ml-auto ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {formData.reason.length}/500
                </p>
              </div>
            </div>

            {/* Documents justificatifs */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Documents justificatifs (optionnel)
              </label>
              <div className={`
                border-2 border-dashed rounded-lg p-4 text-center transition-colors
                ${isDarkMode 
                  ? 'border-slate-600 hover:border-slate-500 bg-slate-700' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }
              `}>
                <DocumentArrowUpIcon className={`mx-auto h-8 w-8 mb-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                <label className="cursor-pointer">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-ena-blue-400' : 'text-ena-blue-600'}`}>
                    Cliquer pour ajouter des fichiers
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  PDF, DOC, JPG, PNG (max 5MB par fichier)
                </p>
              </div>

              {/* Liste des documents */}
              {formData.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`
                        flex items-center justify-between p-2 rounded-lg
                        ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}
                      `}
                    >
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {doc}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className={`
                          p-1 rounded hover:bg-red-100 text-red-600 transition-colors
                          ${isDarkMode ? 'hover:bg-red-900/20' : ''}
                        `}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                    : 'bg-ena-blue-600 hover:bg-ena-blue-700'
                  }
                `}
              >
                {isSubmitting ? 'Soumission...' : 'Soumettre la demande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
