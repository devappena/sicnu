import React, { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  BriefcaseIcon,
  KeyIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useToast } from '../../hooks/useToast';
import { useEmployee, useUpdateEmployee, useChangePassword } from '../../hooks/api';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'documents'>('info');

  // React Query hooks
  const { data: employee, isLoading, error } = useEmployee(user?.id || '');
  const updateEmployee = useUpdateEmployee();
  const changePassword = useChangePassword();

  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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
        message="Erreur lors du chargement du profil" 
        error={error}
      />
    );
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    updateEmployee.mutate(
      { id: employee.id, data: formData },
      {
        onSuccess: () => {
          showToast('success', 'Profil mis à jour avec succès');
        },
        onError: (error) => {
          showToast('error', `Erreur: ${error.message}`);
        }
      }
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('error', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast('error', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    changePassword.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      },
      {
        onSuccess: () => {
          showToast('success', 'Mot de passe modifié avec succès');
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        },
        onError: (error) => {
          showToast('error', `Erreur: ${error.message}`);
        }
      }
    );
  };

  const tabs = [
    { id: 'info' as const, label: 'Informations personnelles', icon: UserIcon },
    { id: 'security' as const, label: 'Sécurité', icon: KeyIcon },
    { id: 'documents' as const, label: 'Documents', icon: DocumentTextIcon },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Profil de ${user?.firstName} ${user?.lastName}`}
        description="Gérez vos informations personnelles et paramètres"
        icon={UserIcon}
      />

      {/* Photo de profil */}
      <Card>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:bg-gray-50">
              <CameraIcon className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-gray-600">{employee?.position || user?.role}</p>
            <p className="text-sm text-gray-500">{employee?.department || 'RH'}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Informations personnelles */}
      {activeTab === 'info' && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Informations professionnelles en lecture seule */}
            <div className="border-t pt-4 mt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Informations professionnelles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    <strong>Département:</strong> {employee?.department || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    <strong>Poste:</strong> {employee?.position || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm">
                    <strong>Date d'embauche:</strong> {employee?.hireDate || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Sécurité */}
      {activeTab === 'security' && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe actuel
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Modifier le mot de passe
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Documents */}
      {activeTab === 'documents' && (
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Contrat de travail</p>
                  <p className="text-sm text-gray-500">Dernière modification: 15 janv. 2024</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Télécharger
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Bulletins de paie</p>
                  <p className="text-sm text-gray-500">12 derniers mois disponibles</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Voir tout
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Certificats de formation</p>
                  <p className="text-sm text-gray-500">3 certificats</p>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Télécharger
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
