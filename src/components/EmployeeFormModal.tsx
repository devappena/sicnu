import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../hooks/useToast';
import type { Employee } from '../types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'> | Employee) => void;
  employee?: Employee | null;
  title: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: string;
  hireDate: string;
  dateOfBirth: string;
  status: Employee['status'];
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  title
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hireDate: '',
    dateOfBirth: '',
    status: 'active',
    address: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Départements disponibles
  const departments = [
    'Ressources Humaines',
    'Finance',
    'Informatique',
    'Administration',
    'Formation',
    'Sécurité',
    'Maintenance'
  ];

  // Postes disponibles par département
  const positionsByDepartment: Record<string, string[]> = {
    'Ressources Humaines': ['Directeur RH', 'Gestionnaire RH', 'Assistant RH', 'Recruteur'],
    'Finance': ['Directeur Financier', 'Comptable', 'Analyste Financier', 'Caissier'],
    'Informatique': ['Directeur IT', 'Développeur', 'Administrateur Système', 'Support Technique'],
    'Administration': ['Secrétaire', 'Agent Administratif', 'Coordinateur', 'Assistant de Direction'],
    'Formation': ['Formateur', 'Coordinateur Pédagogique', 'Assistant Formation'],
    'Sécurité': ['Chef Sécurité', 'Agent de Sécurité', 'Gardien'],
    'Maintenance': ['Technicien', 'Électricien', 'Plombier', 'Agent d\'Entretien']
  };

  // Initialiser le formulaire quand l'employé change
  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
        hireDate: employee.hireDate.toISOString().split('T')[0],
        dateOfBirth: employee.dateOfBirth.toISOString().split('T')[0],
        status: employee.status,
        address: employee.address || '',
        emergencyContactName: employee.emergencyContact?.name || '',
        emergencyContactPhone: employee.emergencyContact?.phone || '',
        emergencyContactRelationship: employee.emergencyContact?.relationship || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        salary: '',
        hireDate: new Date().toISOString().split('T')[0],
        dateOfBirth: '',
        status: 'active',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
      });
    }
    setErrors({});
  }, [employee, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Réinitialiser la position si le département change
    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        position: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validation des champs obligatoires
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.position.trim()) newErrors.position = 'Le poste est requis';
    if (!formData.department.trim()) newErrors.department = 'Le département est requis';
    if (!formData.salary.trim()) {
      newErrors.salary = 'Le salaire est requis';
    } else if (isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      newErrors.salary = 'Le salaire doit être un nombre positif';
    }
    if (!formData.hireDate.trim()) newErrors.hireDate = 'La date d\'embauche est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('error', 'Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        hireDate: new Date(formData.hireDate),
        dateOfBirth: new Date(formData.dateOfBirth),
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        },
        ...(employee && { id: employee.id })
      };

      onSave(employeeData as Employee);
      showToast('success', 
        employee ? 'Employé modifié' : 'Employé créé', 
        employee ? 'Les informations ont été mises à jour' : 'Le nouvel employé a été ajouté'
      );
      onClose();
    } catch {
      showToast('error', 'Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Informations personnelles */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                Informations personnelles
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Prénom de l'employé"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Nom de l'employé"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Section Contact */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Informations de contact
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="email@ena.cd"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+243 997873337"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="input-field"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>
            </div>

            {/* Section Professionnel */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                Informations professionnelles
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Département *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`input-field ${errors.department ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`input-field ${errors.position ? 'border-red-500' : ''}`}
                    disabled={!formData.department}
                  >
                    <option value="">Sélectionner un poste</option>
                    {formData.department && positionsByDepartment[formData.department]?.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire (CDF) *
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`input-field ${errors.salary ? 'border-red-500' : ''}`}
                    placeholder="500000"
                    min="0"
                    step="1000"
                  />
                  {errors.salary && (
                    <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche *
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    className={`input-field ${errors.hireDate ? 'border-red-500' : ''}`}
                  />
                  {errors.hireDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.hireDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="on_leave">En congé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section Contact d'urgence */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                Contact d'urgence
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone d'urgence
                  </label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+243 997873337"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relation
                  </label>
                  <select
                    name="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Sélectionner la relation</option>
                    <option value="parent">Parent</option>
                    <option value="conjoint">Conjoint(e)</option>
                    <option value="frere_soeur">Frère/Sœur</option>
                    <option value="ami">Ami(e)</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    {employee ? 'Mettre à jour' : 'Créer l\'employé'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
