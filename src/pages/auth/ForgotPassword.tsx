import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EnvelopeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../hooks/useToast';
import enaLogo from '../../assets/images/ena-logo.png';

const ForgotPassword: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulation d'envoi d'email
    setTimeout(() => {
      setEmailSent(true);
      showToast('success', 'Email envoyé !', 'Vérifiez votre boîte de réception');
      setIsLoading(false);
    }, 2000);
  };

  if (emailSent) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-ena-blue via-blue-800 to-indigo-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
              <EnvelopeIcon className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              Email envoyé !
            </h2>
            <p className="mt-2 text-blue-100">
              Vérifiez votre boîte de réception
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 text-center max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="mb-6">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <EnvelopeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instructions envoyées
              </h3>
              <p className="text-gray-600">
                Nous avons envoyé les instructions de réinitialisation à{' '}
                <strong>{email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-medium text-blue-900 mb-2">Étapes suivantes :</h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Vérifiez votre boîte de réception</li>
                  <li>Cliquez sur le lien dans l'email</li>
                  <li>Créez un nouveau mot de passe</li>
                  <li>Connectez-vous avec vos nouveaux identifiants</li>
                </ol>
              </div>

              <p className="text-sm text-gray-500">
                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  essayez à nouveau
                </button>
              </p>
            </div>

            <div className="mt-6">
              <Link 
                to="/auth/login"
                className="w-full bg-gradient-to-r from-ena-blue to-ena-blue-700 hover:from-ena-blue-700 hover:to-ena-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex justify-center items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-ena-blue via-blue-800 to-indigo-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center mb-4 p-2">
            <img 
              src={enaLogo} 
              alt="Logo ENA" 
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-blue-100">
            Réinitialisez votre mot de passe
          </p>
        </div>

        {/* Formulaire de récupération */}
        <div className="bg-white rounded-lg shadow-xl p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-900 text-center">
              Récupération de compte
            </h3>
            <p className="text-gray-600 text-center mt-2">
              Entrez votre email pour recevoir les instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({});
                  }
                }}
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                placeholder="votre.email@ena.cd"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Un email contenant les instructions de réinitialisation sera envoyé à cette adresse.
              </p>
            </div>

            {/* Bouton d'envoi */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-ena-blue to-ena-blue-700 hover:from-ena-blue-700 hover:to-ena-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Envoi en cours...</span>
                </div>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer les instructions
                </span>
              )}
            </button>
          </form>

          {/* Lien de retour */}
          <div className="mt-6 text-center">
            <Link 
              to="/auth/login" 
              className="inline-flex items-center text-sm font-medium text-ena-blue hover:text-ena-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
