import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import cnuLogo from '../../assets/images/cnu-logo.svg';
import { authenticateUser } from '../../data/mockUsers';
import { identity } from '../../config/identity';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Récupérer l'URL de redirection après connexion
  const from = location.state?.from?.pathname || '/';

  // Rediriger vers le dashboard si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulation d'authentification avec délai
    setTimeout(() => {
      // Authentifier avec le système de mock
      const authenticatedUser = authenticateUser(formData.email, formData.password);
      
      if (authenticatedUser) {
        const userData = {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          firstName: authenticatedUser.firstName,
          lastName: authenticatedUser.lastName,
          role: authenticatedUser.role,
          loginTime: new Date().toISOString()
        };
        
        login(userData);
        showToast('success', 'Connexion réussie !', `Bienvenue ${userData.firstName} ${userData.lastName}`);
        navigate(from, { replace: true });
      } else {
        showToast('error', 'Erreur de connexion', 'Email ou mot de passe incorrect');
        setErrors({ 
          email: 'Identifiants incorrects',
          password: 'Identifiants incorrects'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-cnu-blue via-blue-800 to-indigo-900 px-4 sm:px-6 lg:px-8">
      {/* Écran de chargement pendant la vérification de l'authentification */}
      {authLoading ? (
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center mb-4 p-2 animate-pulse">
            <img 
              src={cnuLogo} 
              alt={`Logo ${identity.orgShort}`} 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="text-white text-lg">Vérification de l'authentification...</div>
        </div>
      ) : (
        <div className="max-w-md w-full">
          {/* Logo et titre */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-3 p-2">
              <img 
                src={cnuLogo} 
                alt={`Logo ${identity.orgShort}`} 
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {identity.appName}
            </h2>
            <p className="mt-1 text-blue-100 text-sm">
              {identity.orgShort}
            </p>
            <p className="mt-1 text-blue-200 text-xs">
              {identity.appFullName}
            </p>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white rounded-lg shadow-xl p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Connexion
              </h3>
              <p className="text-gray-600 text-center mt-1 text-sm">
                Accédez à votre espace personnel
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
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre.email@comnat-unesco.cd"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/auth/forgot-password" className="font-medium text-cnu-blue hover:text-cnu-blue-700">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cnu-blue to-cnu-blue-700 hover:from-cnu-blue-700 hover:to-cnu-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link to="/auth/register" className="font-medium text-cnu-blue hover:text-cnu-blue-700">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
