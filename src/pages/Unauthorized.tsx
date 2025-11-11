import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldExclamationIcon,
  HomeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();
  const { getRoleLabel } = usePermissions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icône d'erreur */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 opacity-20 blur-xl rounded-full"></div>
            <ShieldExclamationIcon className="relative h-24 w-24 text-red-500" />
          </div>
        </div>

        {/* Message d'erreur */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Accès refusé
          </h2>
          <p className="text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>

        {/* Informations utilisateur */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2">
            <div className="text-sm text-gray-500">
              Connecté en tant que
            </div>
            <div className="text-base font-medium text-gray-900">
              {user.email}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Rôle : {getRoleLabel()}
            </div>
          </div>
        )}

        {/* Message d'aide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 Que faire ?
          </h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Vérifiez que vous êtes connecté avec le bon compte</li>
            <li>• Contactez un administrateur pour obtenir les accès nécessaires</li>
            <li>• Si vous pensez qu'il s'agit d'une erreur, signalez-le à l'équipe technique</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Page précédente
          </button>
        </div>

        {/* Contact support */}
        <div className="text-sm text-gray-500">
          Besoin d'aide ?{' '}
          <Link 
            to="/about" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Contactez le support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
