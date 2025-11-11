import React, { useState } from 'react';
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'Bafuafua Mande',
      lastName: 'Victor',
      email: 'bafuafua.victor@ena.cd',
      phone: '+243 999 123 456',
      position: 'Directeur Administratif',
      department: 'Administration'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      absenceAlerts: true,
      trainingReminders: true,
      birthdayNotifications: true,
      systemUpdates: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    appearance: {
      theme: 'light',
      language: 'fr',
      dateFormat: 'dd/MM/yyyy',
      timezone: 'Africa/Kinshasa'
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Apparence', icon: PaintBrushIcon }
  ];

  const updateSetting = (category: string, key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Personnelles</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              value={settings.profile.firstName}
              onChange={(e) => updateSetting('profile', 'firstName', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={settings.profile.lastName}
              onChange={(e) => updateSetting('profile', 'lastName', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Poste</label>
            <input
              type="text"
              value={settings.profile.position}
              disabled
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <input
              type="text"
              value={settings.profile.department}
              disabled
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ena-blue-600 hover:bg-ena-blue-700">
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Préférences de Notification</h3>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => {
            const labels = {
              emailNotifications: 'Notifications par email',
              pushNotifications: 'Notifications push',
              absenceAlerts: 'Alertes d\'absence',
              trainingReminders: 'Rappels de formation',
              birthdayNotifications: 'Notifications d\'anniversaire',
              systemUpdates: 'Mises à jour système'
            };
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    {labels[key as keyof typeof labels]}
                  </label>
                </div>
                <button
                  onClick={() => updateSetting('notifications', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    value ? 'bg-ena-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sécurité</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">
                Authentification à deux facteurs
              </label>
              <p className="text-sm text-gray-500">
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </p>
            </div>
            <button
              onClick={() => updateSetting('security', 'twoFactorAuth', !settings.security.twoFactorAuth)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                settings.security.twoFactorAuth ? 'bg-ena-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Délai d'expiration de session (minutes)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expiration du mot de passe (jours)
            </label>
            <select
              value={settings.security.passwordExpiry}
              onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value={30}>30 jours</option>
              <option value={60}>60 jours</option>
              <option value={90}>90 jours</option>
              <option value={180}>180 jours</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ena-blue-600 hover:bg-ena-blue-700 mr-3">
          <KeyIcon className="h-4 w-4 mr-2" />
          Changer le mot de passe
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Télécharger les données
        </button>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Apparence et Localisation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Thème</label>
            <select
              value={settings.appearance.theme}
              onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Langue</label>
            <select
              value={settings.appearance.language}
              onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="sw">Swahili</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Format de date</label>
            <select
              value={settings.appearance.dateFormat}
              onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
            <select
              value={settings.appearance.timezone}
              onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ena-blue-500 focus:border-ena-blue-500"
            >
              <option value="Africa/Kinshasa">Africa/Kinshasa (WAT)</option>
              <option value="Africa/Lubumbashi">Africa/Lubumbashi (CAT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div 
        className="rounded-lg p-6 text-white"
        style={{
          background: 'linear-gradient(to right, #1c3d8f, #1a3580)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <CogIcon className="h-8 w-8 mr-3" />
              Paramètres
            </h1>
            <p className="text-blue-100">
              Gérez vos préférences et paramètres de compte
            </p>
          </div>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
            <KeyIcon className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="bg-white shadow rounded-lg">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200">
            <nav className="space-y-1 p-4">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-left ${
                      activeTab === tab.id
                        ? 'bg-ena-blue-50 text-ena-blue-700 border-r-2 border-ena-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="mr-3 h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
