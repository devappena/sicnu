import React, { useState } from 'react';
import { 
  XMarkIcon, 
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';

interface TrainingRequestData {
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
}

interface TrainingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingRequestData) => void;
}

const TrainingRequestModal: React.FC<TrainingRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<TrainingRequestData>({
    title: '',
    category: '',
    priority: '',
    duration: '',
    targetDate: '',
    participants: 1,
    budget: '',
    justification: '',
    objectives: '',
    preferredTrainer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'technique', label: 'Formation Technique' },
    { value: 'management', label: 'Management & Leadership' },
    { value: 'soft-skills', label: 'Compétences Relationnelles' },
    { value: 'securite', label: 'Sécurité & Conformité' },
    { value: 'langues', label: 'Langues Étrangères' },
    { value: 'bureautique', label: 'Bureautique & Outils' },
    { value: 'juridique', label: 'Juridique & Réglementaire' },
    { value: 'qualite', label: 'Qualité & Processus' }
  ];

  const priorities = [
    { value: 'low', label: 'Normale', color: 'text-green-600' },
    { value: 'medium', label: 'Importante', color: 'text-yellow-600' },
    { value: 'high', label: 'Urgente', color: 'text-red-600' }
  ];

  const durations = [
    { value: '0.5', label: '1/2 journée (4h)' },
    { value: '1', label: '1 jour (8h)' },
    { value: '2', label: '2 jours (16h)' },
    { value: '3', label: '3 jours (24h)' },
    { value: '5', label: '1 semaine (40h)' },
    { value: 'custom', label: 'Durée personnalisée' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.justification) {
      showToast('error', 'Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.justification.length < 50) {
      showToast('error', 'Erreur', 'La justification doit contenir au moins 50 caractères');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(formData);
      showToast('success', 'Demande envoyée', 'Votre demande de formation a été transmise');
      handleReset();
      onClose();
    } catch (_error) {
      showToast('error', 'Erreur', 'Impossible d\'envoyer la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      category: '',
      priority: '',
      duration: '',
      targetDate: '',
      participants: 1,
      budget: '',
      justification: '',
      objectives: '',
      preferredTrainer: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <DocumentPlusIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Demande de Formation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre de la formation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la formation demandée *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Formation React avancé, Gestion de projet Agile..."
              required
            />
          </div>

          {/* Catégorie et priorité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez la priorité</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Durée et date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée souhaitée
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez la durée</option>
                {durations.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date cible
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Participants et budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de participants
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget estimé (optionnel)
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: 2000€, À déterminer..."
              />
            </div>
          </div>

          {/* Formateur préféré */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formateur préféré (optionnel)
            </label>
            <input
              type="text"
              value={formData.preferredTrainer}
              onChange={(e) => setFormData({ ...formData, preferredTrainer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nom du formateur ou organisme souhaité"
            />
          </div>

          {/* Objectifs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectifs d'apprentissage
            </label>
            <textarea
              rows={3}
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Quelles compétences souhaitez-vous acquérir ou améliorer ?"
            />
          </div>

          {/* Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Justification de la demande *
            </label>
            <textarea
              rows={4}
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Expliquez pourquoi cette formation est nécessaire, son impact sur votre travail..."
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum 50 caractères. Décrivez l'impact professionnel attendu.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.category || formData.justification.length < 50}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <DocumentPlusIcon className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingRequestModal;
