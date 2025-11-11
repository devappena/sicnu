import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  CalendarIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import NavbarLogo from './NavbarLogo';
import NotificationPanel from './NotificationPanel';
import NotificationCenter from './NotificationCenter';
import { useScrollPosition } from '../hooks/useScrollPosition';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: HomeIcon },
  { name: 'Employés', href: '/employees', icon: UsersIcon },
  { name: 'Absences', href: '/absences', icon: CalendarIcon },
  { name: 'Formations', href: '/trainings', icon: AcademicCapIcon },
  { name: 'Statistiques', href: '/statistics', icon: ChartBarIcon },
];

export default function Navbar() {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const scrolled = useScrollPosition();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-ena-blue/95 to-blue-700/95 backdrop-blur-sm shadow-xl' 
        : 'bg-gradient-to-r from-ena-blue to-blue-700 shadow-lg'
    } border-b border-blue-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavbarLogo />
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'border-ena-gold text-ena-gold bg-blue-700'
                        : 'border-transparent text-blue-100 hover:text-white hover:border-blue-300 hover:bg-blue-700'
                    } inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-all duration-200 rounded-t-lg`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications avec nouveau centre */}
            <NotificationCenter />

            {/* Settings */}
            <button className="p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded-lg transition-all duration-200">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            {/* User Profile */}
            <Link to="/profile" className="flex items-center space-x-2 hover:bg-blue-700 rounded-lg p-2 transition-all duration-200">
              <UserCircleIcon className="h-8 w-8 text-blue-100" />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-white">Admin ENA</div>
                <div className="text-xs text-blue-200">admin@ena.cd</div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden bg-gradient-to-r from-ena-blue to-blue-700 fixed top-16 left-0 right-0 z-40">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? 'bg-blue-700 border-ena-gold text-ena-gold'
                    : 'border-transparent text-blue-100 hover:text-white hover:bg-blue-700'
                } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-all duration-200`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Panneau de notifications */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </nav>
  );
}
