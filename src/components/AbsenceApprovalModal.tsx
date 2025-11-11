import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import type { Absence, Employee } from '../types';

interface AbsenceApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  absence: Absence | null;
  employee: Employee | null;
  onApprove: (absenceId: string, comments?: string) => void;
  onReject: (absenceId: string, reason: string) => void;
}

export default function AbsenceApprovalModal({ 
  isOpen, 
  onClose, 
  absence, 
  employee,
  onApprove,
  onReject 
}: AbsenceApprovalModalProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTypeText = (type: string) => {
    switch (type) {
      case 'vacation': return 'Congé payé';
      case 'sick': return 'Congé maladie';
      case 'personal': return 'Congé personnel';
      case 'maternity': return 'Congé maternité';
      case 'paternity': return 'Congé paternité';
      default: return 'Autre';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation': return '🏖️';
      case 'sick': return '🏥';
      case 'personal': return '👤';
      case 'maternity': return '👶';
      case 'paternity': return '👨‍👶';
      default: return '📅';
    }
  };

  const calculateDuration = () => {
    if (!absence) return 0;
    const start = new Date(absence.startDate);
    const end = new Date(absence.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async () => {
    if (!absence || !action) return;

    if (action === 'reject' && !comments.trim()) {
      showToast('error', 'Veuillez fournir une raison pour le rejet');
      return;
    }

    setIsSubmitting(true);

    try {
      if (action === 'approve') {
        await onApprove(absence.id, comments);
        showToast('success', 'Demande approuvée avec succès');
      } else {
        await onReject(absence.id, comments);
        showToast('info', 'Demande rejetée');
      }
      
      onClose();
      resetForm();
    } catch {
      showToast('error', 'Erreur lors du traitement de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAction(null);
    setComments('');
  };

  if (!isOpen || !absence || !employee) return null;

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
              <div className="p-2 bg-ena-blue-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-ena-blue-600" />
              </div>
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Traiter la demande d'absence
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

          {/* Informations de l'employé */}
          <div className={`
            p-4 rounded-lg mb-6
            ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'}
            border
          `}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-ena-blue-100 flex items-center justify-center">
                <span className="text-ena-blue-600 font-medium">
                  {employee.firstName[0]}{employee.lastName[0]}
                </span>
              </div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {employee.firstName} {employee.lastName}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {employee.position} • {employee.department}
                </p>
              </div>
            </div>
          </div>

          {/* Détails de la demande */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Type et durée */}
            <div className={`
              p-4 rounded-lg
              ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
              border
            `}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getTypeIcon(absence.type)}</span>
                <div>
                  <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getTypeText(absence.type)}
                  </h5>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {calculateDuration()} jour{calculateDuration() > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className={`
              p-4 rounded-lg
              ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
              border
            `}>
              <div className="flex items-start space-x-3">
                <CalendarIcon className={`w-5 h-5 mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                <div>
                  <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Période
                  </h5>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Du {format(new Date(absence.startDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Au {format(new Date(absence.endDate), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raison */}
          <div className={`
            p-4 rounded-lg mb-6
            ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
            border
          `}>
            <div className="flex items-start space-x-3">
              <DocumentTextIcon className={`w-5 h-5 mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              <div>
                <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Raison de l'absence
                </h5>
                <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  {absence.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {absence.documents && absence.documents.length > 0 && (
            <div className={`
              p-4 rounded-lg mb-6
              ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-200'}
              border
            `}>
              <h5 className={`font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Documents justificatifs
              </h5>
              <div className="space-y-2">
                {absence.documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center space-x-3 p-2 rounded
                      ${isDarkMode ? 'bg-slate-600' : 'bg-gray-50'}
                    `}
                  >
                    <DocumentTextIcon className="w-4 h-4 text-ena-blue-600" />
                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions de décision */}
          {!action ? (
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setAction('approve')}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                <span>Approuver</span>
              </button>
              <button
                onClick={() => setAction('reject')}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircleIcon className="w-5 h-5" />
                <span>Rejeter</span>
              </button>
            </div>
          ) : (
            <div className="mb-6">
              {/* Feedback visuel de l'action */}
              <div className={`
                p-4 rounded-lg mb-4 border-l-4
                ${action === 'approve' 
                  ? 'bg-green-50 border-green-500 dark:bg-green-900/20' 
                  : 'bg-red-50 border-red-500 dark:bg-red-900/20'
                }
              `}>
                <div className="flex items-center space-x-3">
                  {action === 'approve' ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h4 className={`font-medium ${
                      action === 'approve' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {action === 'approve' ? 'Approuver la demande' : 'Rejeter la demande'}
                    </h4>
                    <p className={`text-sm ${
                      action === 'approve' ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'
                    }`}>
                      {action === 'approve' 
                        ? 'La demande sera approuvée et l\'employé sera notifié.'
                        : 'La demande sera rejetée. Veuillez expliquer la raison.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Commentaires */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                  {action === 'approve' ? 'Commentaires (optionnel)' : 'Raison du rejet *'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  placeholder={
                    action === 'approve' 
                      ? "Ajoutez des commentaires si nécessaire..."
                      : "Expliquez pourquoi cette demande est rejetée..."
                  }
                  className={`
                    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ena-blue-500 focus:border-ena-blue-500
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                  `}
                />
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {comments.length}/500
                </p>
              </div>
            </div>
          )}

          {/* Actions finales */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-600">
            <button
              onClick={() => {
                if (action) {
                  setAction(null);
                  setComments('');
                } else {
                  onClose();
                  resetForm();
                }
              }}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg transition-colors
                ${isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-700 border-slate-600' 
                  : 'text-gray-700 hover:bg-gray-50 border-gray-300'
                }
                border
              `}
            >
              {action ? 'Retour' : 'Fermer'}
            </button>
            
            {action && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || (action === 'reject' && !comments.trim())}
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
                  ${isSubmitting || (action === 'reject' && !comments.trim())
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                {isSubmitting 
                  ? 'Traitement...' 
                  : action === 'approve' 
                    ? 'Confirmer l\'approbation' 
                    : 'Confirmer le rejet'
                }
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
