import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';

interface HeaderProps {
  title: string;
}

const TopHeader: React.FC<HeaderProps> = ({ title }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentDate = format(new Date(), 'EEEE dd MMMM yyyy', { locale: fr });

  // Fermer le menu utilisateur quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Raccourci clavier pour la recherche globale
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K ou Cmd+K pour ouvrir la recherche
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setShowGlobalSearch(true);
      }
      // Escape pour fermer la recherche
      if (event.key === 'Escape' && showGlobalSearch) {
        setShowGlobalSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showGlobalSearch]);

  const handleLogout = () => {
    logout();
    showToast('success', 'Déconnexion', 'Vous avez été déconnecté avec succès');
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || user.firstName?.charAt(1) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'Utilisateur';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  const handleSearchClick = () => {
    setShowGlobalSearch(true);
  };

  const handleSearchClose = () => {
    setShowGlobalSearch(false);
  };
  
  return (
    <header 
      className="sticky top-0 z-40 shadow-sm border-b border-opacity-30"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(to right, #0f172a, #1e293b)' 
          : 'linear-gradient(to right, #1c3d8f, #1a3580)',
        borderColor: isDarkMode ? '#475569' : '#1a3580'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Bouton hamburger */}
            <button
              onClick={toggleSidebar}
              className="hamburger-btn p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Page title and breadcrumb */}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              <p className={`text-sm capitalize ${isDarkMode ? 'text-slate-300' : 'text-blue-200'}`}>{currentDate}</p>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
              </div>
              <button
                onClick={handleSearchClick}
                className={`block w-full pl-10 pr-3 py-2 border border-opacity-50 rounded-md leading-5 bg-white bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-opacity-30 sm:text-sm text-left ${
                  isDarkMode 
                    ? 'border-slate-500 placeholder-slate-300' 
                    : 'border-blue-300 placeholder-blue-200'
                }`}
              >
                <span className="text-blue-200">Rechercher... (Ctrl+K)</span>
              </button>
            </div>
          </div>

          {/* Mobile search button */}
          <div className="md:hidden">
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Recherche globale"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 rounded-md ${
                isDarkMode 
                  ? 'text-slate-300 hover:text-white' 
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-cnu-blue-600 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-blue-200'}`}>{user?.role || 'Utilisateur'}</p>
                  </div>
                  <ChevronDownIcon className="hidden md:block h-4 w-4 text-blue-200" />
                </div>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-3" />
                      Mon profil
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Cog6ToothIcon className="h-4 w-4 mr-3" />
                      Paramètres
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/about');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      À propos
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/demande-role');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ShieldCheckIcon className="h-4 w-4 mr-3" />
                      Demander un rôle
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche globale */}
      {showGlobalSearch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <div 
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleSearchClose}
            />
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <GlobalSearch onClose={handleSearchClose} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
