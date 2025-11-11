import React, { useState } from 'react';
import { 
  ShieldCheckIcon, 
  PaperAirplaneIcon,
  InformationCircleIcon,
  UserPlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

interface RoleRequest {
  roleRequested: string;
  justification: string;
  currentRole: string;
}

interface PersonnelRequest {
  requestType: string;
  department: string;
  position: string;
  urgency: string;
  justification: string;
  startDate: string;
}

const DemandeRole: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'role' | 'personnel'>('role');
  const [formData, setFormData] = useState<RoleRequest>({
    roleRequested: '',
    justification: '',
    currentRole: user?.role || 'employee'
  });
  const [personnelData, setPersonnelData] = useState<PersonnelRequest>({
    requestType: '',
    department: '',
    position: '',
    urgency: '',
    justification: '',
    startDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableRoles = [
    { value: 'hr_manager', label: 'Gestionnaire RH', description: 'Accès aux données RH et gestion des employés' },
    { value: 'department_manager', label: 'Chef de Département', description: 'Gestion d\'équipe et validation des demandes' },
    { value: 'payroll_manager', label: 'Gestionnaire Paie', description: 'Accès aux données de paie et salaires' },
    { value: 'admin', label: 'Administrateur', description: 'Accès étendu aux fonctionnalités système' }
  ];

  const departments = [
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'finance', label: 'Finance et Comptabilité' },
    { value: 'it', label: 'Informatique' },
    { value: 'marketing', label: 'Marketing et Communication' },
    { value: 'juridique', label: 'Juridique' },
    { value: 'formation', label: 'Formation et Développement' },
    { value: 'administration', label: 'Administration Générale' }
  ];

  const requestTypes = [
    { value: 'recrutement', label: 'Nouveau recrutement' },
    { value: 'remplacement', label: 'Remplacement temporaire' },
    { value: 'renfort', label: 'Renfort d\'équipe' },
    { value: 'stage', label: 'Stagiaire' },
    { value: 'consultant', label: 'Consultant externe' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Normale', color: 'text-green-600' },
    { value: 'medium', label: 'Importante', color: 'text-yellow-600' },
    { value: 'high', label: 'Urgente', color: 'text-red-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleRequested || !formData.justification.trim()) {
      showToast('error', 'Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ici, vous feriez un appel API réel
      // await api.post('/api/role-requests', formData);
      
      // Simulation d'une requête
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('success', 'Demande envoyée', 'Votre demande de rôle a été transmise aux administrateurs');
      setFormData({
        roleRequested: '',
        justification: '',
        currentRole: user?.role || 'employee'
      });
    } catch (_error) {
      showToast('error', 'Erreur', 'Impossible d\'envoyer la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePersonnelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personnelData.requestType || !personnelData.department || !personnelData.position || !personnelData.justification.trim()) {
      showToast('error', 'Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast('success', 'Demande envoyée', 'Votre demande de personnel a été transmise aux RH');
      setPersonnelData({
        requestType: '',
        department: '',
        position: '',
        urgency: '',
        justification: '',
        startDate: ''
      });
    } catch (_error) {
      showToast('error', 'Erreur', 'Impossible d\'envoyer la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Centre de demandes</h1>
              <p className="text-gray-600">Gérez vos demandes de rôles et de personnel</p>
            </div>
          </div>

          {/* Info utilisateur actuel */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Rôle actuel :</span> {user?.role || 'Employee'}
              </p>
              <p className="text-sm text-blue-700">
                Vos demandes seront examinées par les administrateurs compétents.
              </p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('role')}
                className={`py-3 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'role'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4" />
                  Demande de rôle
                </div>
              </button>
              <button
                onClick={() => setActiveTab('personnel')}
                className={`py-3 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'personnel'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlusIcon className="h-4 w-4" />
                  Demande de personnel
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Formulaire demande de rôle */}
        {activeTab === 'role' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sélection du rôle - Menu déroulant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle demandé *
                </label>
                <div className="relative">
                  <select
                    value={formData.roleRequested}
                    onChange={(e) => setFormData({ ...formData, roleRequested: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez un rôle</option>
                    {availableRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {formData.roleRequested && (
                  <p className="mt-1 text-sm text-gray-600">
                    {availableRoles.find(r => r.value === formData.roleRequested)?.description}
                  </p>
                )}
              </div>

              {/* Justification */}
              <div>
                <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
                  Justification de la demande *
                </label>
                <textarea
                  id="justification"
                  name="justification"
                  rows={4}
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Expliquez pourquoi vous avez besoin de ce rôle et comment vous comptez l'utiliser..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 50 caractères. Soyez précis sur vos besoins professionnels.
                </p>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => window.history.back()}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.roleRequested || formData.justification.length < 50}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulaire demande de personnel */}
        {activeTab === 'personnel' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handlePersonnelSubmit} className="space-y-6">
              {/* Type de demande */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de demande *
                </label>
                <div className="relative">
                  <select
                    value={personnelData.requestType}
                    onChange={(e) => setPersonnelData({ ...personnelData, requestType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez le type</option>
                    {requestTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Département */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <div className="relative">
                  <select
                    value={personnelData.department}
                    onChange={(e) => setPersonnelData({ ...personnelData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    required
                  >
                    <option value="">Sélectionnez le département</option>
                    {departments.map((dept) => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Poste demandé */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Poste/Fonction demandé(e) *
                </label>
                <input
                  type="text"
                  id="position"
                  value={personnelData.position}
                  onChange={(e) => setPersonnelData({ ...personnelData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Développeur Full-Stack, Assistant RH..."
                  required
                />
              </div>

              {/* Urgence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'urgence
                </label>
                <div className="relative">
                  <select
                    value={personnelData.urgency}
                    onChange={(e) => setPersonnelData({ ...personnelData, urgency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Sélectionnez l'urgence</option>
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Date de début souhaitée */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début souhaitée
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={personnelData.startDate}
                  onChange={(e) => setPersonnelData({ ...personnelData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Justification */}
              <div>
                <label htmlFor="personnelJustification" className="block text-sm font-medium text-gray-700 mb-2">
                  Justification de la demande *
                </label>
                <textarea
                  id="personnelJustification"
                  rows={4}
                  value={personnelData.justification}
                  onChange={(e) => setPersonnelData({ ...personnelData, justification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Expliquez le contexte, les besoins de l'équipe, l'impact sur les activités..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Décrivez les raisons de cette demande et l'impact sur votre département.
                </p>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => window.history.back()}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !personnelData.requestType || !personnelData.department || !personnelData.position || !personnelData.justification.trim()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="bg-yellow-50 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">À savoir :</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Les demandes de rôles sont traitées sous 2-3 jours ouvrables</li>
            <li>• Les demandes de personnel nécessitent validation budgétaire (5-10 jours)</li>
            <li>• Vous recevrez une notification par email de la décision</li>
            <li>• Vous pouvez suivre le statut de vos demandes dans "Mon profil"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemandeRole;
