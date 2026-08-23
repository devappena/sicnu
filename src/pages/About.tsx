import React from 'react';
import { Link } from 'react-router-dom';
import { 
  InformationCircleIcon,
  CodeBracketIcon,
  ServerIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import VersionInfo from '../components/VersionInfo';
import cnuLogo from '../assets/images/cnu-logo.svg';
import { identity } from '../config/identity';

const About: React.FC = () => {
  const buildDate = new Date().toLocaleDateString('fr-FR');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center text-sm font-medium text-cnu-blue hover:text-cnu-blue-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Retour au tableau de bord
          </Link>
          
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
              <img 
                src={cnuLogo} 
                alt={`Logo ${identity.orgShort}`} 
                className="h-16 w-16 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {identity.appName}
            </h1>
            <p className="text-xl text-gray-600">
              {identity.orgName}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Version Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <InformationCircleIcon className="h-8 w-8 text-cnu-blue mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Informations Version</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <VersionInfo variant="badge" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build:</span>
                <span className="font-mono text-sm text-gray-800">{buildDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Environnement:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                  Production
                </span>
              </div>
            </div>
          </div>

          {/* Technologies Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CodeBracketIcon className="h-8 w-8 text-cnu-blue mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Technologies</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Frontend:</span>
                <span className="text-gray-800">React 18 + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UI Framework:</span>
                <span className="text-gray-800">Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Icons:</span>
                <span className="text-gray-800">Heroicons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build Tool:</span>
                <span className="text-gray-800">Vite</span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-cnu-blue mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Authentification:</span>
                <span className="text-gray-800">JWT Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chiffrement:</span>
                <span className="text-gray-800">HTTPS/TLS 1.3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stockage:</span>
                <span className="text-gray-800">LocalStorage (sécurisé)</span>
              </div>
            </div>
          </div>

          {/* System Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <ServerIcon className="h-8 w-8 text-cnu-blue mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Système</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Navigateur:</span>
                <span className="text-gray-800">{navigator.userAgent.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Langue:</span>
                <span className="text-gray-800">Français (FR)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timezone:</span>
                <span className="text-gray-800">UTC+1 (WAT)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fonctionnalités Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-cnu-blue/10 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Gestion du Personnel</h3>
              <p className="text-sm text-gray-600">Profils employés, évaluations, et gestion des équipes</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Gestion du Temps</h3>
              <p className="text-sm text-gray-600">Absences, congés, et suivi des heures</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Formation</h3>
              <p className="text-sm text-gray-600">Planification et suivi des formations</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Finances</h3>
              <p className="text-sm text-gray-600">Paie, documents financiers, et rapports</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Administration</h3>
              <p className="text-sm text-gray-600">Paramètres, notifications, et statistiques</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Rapports</h3>
              <p className="text-sm text-gray-600">Tableaux de bord et analyses avancées</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {identity.orgName} — Tous droits réservés</p>
          <p className="mt-1">{identity.appFullName}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
