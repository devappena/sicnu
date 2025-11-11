import React, { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon, 
  ArrowDownTrayIcon, 
  CheckCircleIcon,
  XMarkIcon,
  WifiIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '../hooks/usePWA';
import { BounceButton, FadeIn, SlideIn } from './Animations';

const PWAInstallPrompt: React.FC = () => {
  const { canInstall, install, isInstalled, isOffline, updateAvailable, updateApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà interagi avec le prompt
    const hasInteractedBefore = localStorage.getItem('pwa-install-interaction');
    if (!hasInteractedBefore && canInstall && !isInstalled) {
      // Attendre 30 secondes avant de montrer le prompt
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled]);

  const handleInstall = async () => {
    await install();
    setShowPrompt(false);
    setHasInteracted(true);
    localStorage.setItem('pwa-install-interaction', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setHasInteracted(true);
    localStorage.setItem('pwa-install-interaction', 'true');
  };

  const handleUpdate = () => {
    updateApp();
  };

  if (isInstalled) {
    return null; // Ne pas afficher si déjà installé
  }

  return (
    <>
      {/* Prompt d'installation */}
      {showPrompt && canInstall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <FadeIn>
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Installer ENA RH
                    </h3>
                    <p className="text-sm text-gray-600">
                      Application Progressive Web
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Profitez d'une expérience améliorée :
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Accès rapide depuis votre écran d'accueil</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Fonctionnement hors ligne</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Notifications push en temps réel</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>Interface native et fluide</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <BounceButton
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Installer maintenant
                </BounceButton>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Plus tard
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      )}

      {/* Indicateur de mise à jour */}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 z-50">
          <SlideIn direction="up">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    Mise à jour disponible
                  </h4>
                  <p className="text-sm text-gray-600">
                    Une nouvelle version est prête
                  </p>
                </div>
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-green-700"
                >
                  Mettre à jour
                </button>
              </div>
            </div>
          </SlideIn>
        </div>
      )}

      {/* Indicateur hors ligne */}
      {isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <SlideIn direction="down">
            <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <WifiIcon className="h-5 w-5" />
              <span className="font-medium">Mode hors ligne</span>
            </div>
          </SlideIn>
        </div>
      )}

      {/* Bouton flottant pour les fonctionnalités PWA */}
      {canInstall && !showPrompt && !hasInteracted && (
        <div className="fixed bottom-4 left-4 z-40">
          <BounceButton
            onClick={() => setShowPrompt(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
          </BounceButton>
        </div>
      )}
    </>
  );
};

// Composant pour les paramètres PWA
export const PWASettings: React.FC = () => {
  const { isSupported, isInstalled, canInstall, install } = usePWA();

  if (!isSupported) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">
          Progressive Web App non supportée
        </h3>
        <p className="text-sm text-gray-600">
          Votre navigateur ne supporte pas les PWA.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <CogIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            Progressive Web App
          </h3>
          <p className="text-sm text-gray-600">
            Paramètres d'installation et fonctionnalités
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Status d'installation</p>
            <p className="text-sm text-gray-600">
              {isInstalled ? 'Installée' : 'Non installée'}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>

        {canInstall && !isInstalled && (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Installation</p>
              <p className="text-sm text-gray-600">
                Installer l'app sur votre appareil
              </p>
            </div>
            <button
              onClick={install}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700"
            >
              Installer
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">Hors ligne</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <BellIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Notifications</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
              <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Native</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
