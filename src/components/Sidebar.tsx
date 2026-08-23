import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarDaysIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  UserIcon,
  BellIcon,
  CogIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  ClockIcon,
  UserPlusIcon,
  ReceiptPercentIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  UsersIcon as UsersIconSolid, 
  CalendarDaysIcon as CalendarDaysIconSolid, 
  AcademicCapIcon as AcademicCapIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid,
  CogIcon as CogIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  BanknotesIcon as BanknotesIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  ClockIcon as ClockIconSolid,
  UserPlusIcon as UserPlusIconSolid,
  ReceiptPercentIcon as ReceiptPercentIconSolid,
  ScaleIcon as ScaleIconSolid
} from '@heroicons/react/24/solid';
import Logo from './Logo';
import VersionInfo from './VersionInfo';
import { useTheme } from '../hooks/useTheme';
import { useSidebar } from '../contexts/SidebarContext';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconActive: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count?: number;
}

const navigation: NavigationItem[] = [
  { 
    name: 'Tableau de bord', 
    href: '/', 
    icon: HomeIcon, 
    iconActive: HomeIconSolid 
  },
  { 
    name: 'Employés', 
    href: '/employees', 
    icon: UsersIcon, 
    iconActive: UsersIconSolid 
  },
  { 
    name: 'Organigramme', 
    href: '/organization', 
    icon: BuildingOfficeIcon, 
    iconActive: BuildingOfficeIconSolid 
  },
  { 
    name: 'Recrutement', 
    href: '/recruitment', 
    icon: BriefcaseIcon, 
    iconActive: BriefcaseIconSolid 
  },
  { 
    name: 'Intégration', 
    href: '/onboarding', 
    icon: UserPlusIcon, 
    iconActive: UserPlusIconSolid 
  },
  { 
    name: 'Absences', 
    href: '/absences', 
    icon: CalendarDaysIcon, 
    iconActive: CalendarDaysIconSolid 
  },
  { 
    name: 'Présences', 
    href: '/attendance', 
    icon: ClockIcon, 
    iconActive: ClockIconSolid 
  },
  { 
    name: 'Formations', 
    href: '/trainings', 
    icon: AcademicCapIcon, 
    iconActive: AcademicCapIconSolid 
  },
  { 
    name: 'Paie', 
    href: '/payroll', 
    icon: BanknotesIcon, 
    iconActive: BanknotesIconSolid 
  },
  { 
    name: 'Notes de frais', 
    href: '/expenses', 
    icon: ReceiptPercentIcon, 
    iconActive: ReceiptPercentIconSolid 
  },
  { 
    name: 'Documents', 
    href: '/documents', 
    icon: DocumentTextIcon, 
    iconActive: DocumentTextIconSolid 
  },
  { 
    name: 'Évaluations', 
    href: '/evaluations', 
    icon: ShieldCheckIcon, 
    iconActive: ShieldCheckIconSolid 
  },
  { 
    name: 'Statistiques', 
    href: '/statistics', 
    icon: ChartBarIcon, 
    iconActive: ChartBarIconSolid 
  },
  { 
    name: 'Conformité', 
    href: '/compliance', 
    icon: ScaleIcon, 
    iconActive: ScaleIconSolid 
  },
  { 
    name: 'Workflows', 
    href: '/workflow-management', 
    icon: ArrowPathIcon, 
    iconActive: ArrowPathIconSolid 
  }
];

const secondaryNavigation: NavigationItem[] = [
  { 
    name: 'Profil', 
    href: '/profile', 
    icon: UserIcon, 
    iconActive: UserIconSolid 
  },
  { 
    name: 'Notifications', 
    href: '/notifications', 
    icon: BellIcon, 
    iconActive: BellIconSolid,
    count: 3
  },
  { 
    name: 'Paramètres', 
    href: '/settings', 
    icon: CogIcon, 
    iconActive: CogIconSolid 
  }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { isOpen, isMobile, isCollapsed, closeSidebar } = useSidebar();
  const { user } = useAuth();
  const { canAccessPage } = usePermissions();

  const visibleNavigation = navigation.filter((item) => canAccessPage(item.href));
  const visibleSecondary = secondaryNavigation.filter((item) => canAccessPage(item.href));

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div 
      className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${isOpen && !isCollapsed ? 'w-64' : isOpen && isCollapsed ? 'w-16' : 'w-64'}
        shadow-lg h-full flex flex-col
        transform transition-all duration-300 ease-in-out
      `}
      style={{
        background: isDarkMode 
          ? 'linear-gradient(to bottom, #0f172a, #1e293b)' 
          : 'linear-gradient(to bottom, #1c3d8f, #1a3580)'
      }}
    >
      {/* Bouton de fermeture pour mobile */}
      {isMobile && (
        <div className="flex justify-end p-2">
          <button
            onClick={closeSidebar}
            className="text-white hover:text-gray-300 p-2"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Logo */}
      <div className={`flex h-16 shrink-0 items-center px-4 border-b ${isDarkMode ? 'border-slate-600' : 'border-blue-700'} border-opacity-30`}>
        <Logo 
          size={isCollapsed && !isMobile ? "sm" : "md"} 
          showText={!isCollapsed || isMobile}
          className="w-full"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto sidebar-scroll">
        {/* Primary Navigation */}
        <div className="space-y-1 pt-4">
          {visibleNavigation.map((item) => {
            const Icon = isActive(item.href) ? item.iconActive : item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={isMobile ? closeSidebar : undefined}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}
                  ${isActive(item.href)
                    ? isDarkMode 
                      ? 'bg-slate-700 text-white border-r-2 border-yellow-400'
                      : 'bg-red-500 bg-opacity-50 text-white border-r-2 border-yellow-400'
                    : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }
                `}
                title={isCollapsed && !isMobile ? item.name : undefined}
              >
                <Icon className={`${isCollapsed && !isMobile ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.count && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-900 bg-yellow-400 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="pt-4 mt-4 border-t border-white border-opacity-20">
          <div className="space-y-1">
            {visibleSecondary.map((item) => {
              const Icon = isActive(item.href) ? item.iconActive : item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={isMobile ? closeSidebar : undefined}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}
                    ${isActive(item.href)
                      ? isDarkMode 
                        ? 'bg-slate-700 text-white border-r-2 border-yellow-400'
                        : 'bg-red-500 bg-opacity-50 text-white border-r-2 border-yellow-400'
                      : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                    }
                  `}
                  title={isCollapsed && !isMobile ? item.name : undefined}
                >
                  <Icon className={`${isCollapsed && !isMobile ? '' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                  {(!isCollapsed || isMobile) && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.count && (
                        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-900 bg-yellow-400 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Version Info */}
      {(!isCollapsed || isMobile) && (
        <div className={`px-4 py-2 border-t ${isDarkMode ? 'border-slate-600' : 'border-blue-700'} border-opacity-20`}>
          <VersionInfo 
            variant="sidebar" 
            className={`text-center ${isDarkMode ? 'text-slate-400 bg-slate-700' : 'text-blue-200 bg-blue-800 bg-opacity-30'}`}
          />
        </div>
      )}

      {/* User Profile */}
      <div className={`border-t ${isDarkMode ? 'border-slate-600' : 'border-blue-700'} border-opacity-30 p-4`}>
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-cnu-blue-600 border-2 border-yellow-400 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'RH'}
              </span>
            </div>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-blue-200'} truncate`}>
                {user?.email || ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
