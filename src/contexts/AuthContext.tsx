import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/api';
import { authConfig } from '@/config/app.config';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const USER_STORAGE_KEY = 'sicnu_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function clearAuthStorage() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem('ena_user');
  localStorage.removeItem(authConfig.tokenStorageKey);
  localStorage.removeItem(authConfig.refreshTokenKey);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem(authConfig.tokenStorageKey);
        if (!token) {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem('ena_user');
          return;
        }

        const current = await authService.getCurrentUser();
        const userData: User = {
          id: current.id,
          email: current.email,
          firstName: current.firstName,
          lastName: current.lastName,
          role: current.role,
          loginTime: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } catch {
        clearAuthStorage();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    void authService.logout();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
