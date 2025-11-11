import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Employee, Absence, User } from '../types';

// Types pour le store global
interface GlobalState {
  // Utilisateur connecté
  currentUser: User | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: boolean;
  
  // Données mises en cache
  employees: Employee[];
  absences: Absence[];
  
  // Filtres et recherche
  searchQuery: string;
  selectedDepartment: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (loading: boolean) => void;
  
  // Actions pour les données
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  
  setAbsences: (absences: Absence[]) => void;
  addAbsence: (absence: Absence) => void;
  updateAbsence: (id: string, updates: Partial<Absence>) => void;
  removeAbsence: (id: string) => void;
  
  // Actions pour les filtres
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (department: string) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  clearFilters: () => void;
  
  // Actions pour les notifications
  addNotification: (notification: Omit<GlobalState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Actions utilitaires
  reset: () => void;
}

// State initial
const initialState = {
  currentUser: null,
  isAuthenticated: false,
  sidebarOpen: false,
  theme: 'light' as const,
  loading: false,
  employees: [],
  absences: [],
  searchQuery: '',
  selectedDepartment: '',
  dateRange: {
    start: null,
    end: null,
  },
  notifications: [],
};

// Store principal avec devtools et persistence
export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Actions utilisateur
        setCurrentUser: (user) => set({ currentUser: user }, false, 'setCurrentUser'),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }, false, 'setAuthenticated'),
        
        // Actions UI
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),
        setSidebarOpen: (open) => set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        setTheme: (theme) => set({ theme }, false, 'setTheme'),
        setLoading: (loading) => set({ loading }, false, 'setLoading'),
        
        // Actions pour les employés
        setEmployees: (employees) => set({ employees }, false, 'setEmployees'),
        addEmployee: (employee) => set(
          (state) => ({ employees: [...state.employees, employee] }),
          false,
          'addEmployee'
        ),
        updateEmployee: (id, updates) => set(
          (state) => ({
            employees: state.employees.map(emp => 
              emp.id === id ? { ...emp, ...updates } : emp
            )
          }),
          false,
          'updateEmployee'
        ),
        removeEmployee: (id) => set(
          (state) => ({ employees: state.employees.filter(emp => emp.id !== id) }),
          false,
          'removeEmployee'
        ),
        
        // Actions pour les absences
        setAbsences: (absences) => set({ absences }, false, 'setAbsences'),
        addAbsence: (absence) => set(
          (state) => ({ absences: [...state.absences, absence] }),
          false,
          'addAbsence'
        ),
        updateAbsence: (id, updates) => set(
          (state) => ({
            absences: state.absences.map(abs => 
              abs.id === id ? { ...abs, ...updates } : abs
            )
          }),
          false,
          'updateAbsence'
        ),
        removeAbsence: (id) => set(
          (state) => ({ absences: state.absences.filter(abs => abs.id !== id) }),
          false,
          'removeAbsence'
        ),
        
        // Actions pour les filtres
        setSearchQuery: (query) => set({ searchQuery: query }, false, 'setSearchQuery'),
        setSelectedDepartment: (department) => set({ selectedDepartment: department }, false, 'setSelectedDepartment'),
        setDateRange: (range) => set({ dateRange: range }, false, 'setDateRange'),
        clearFilters: () => set({ 
          searchQuery: '', 
          selectedDepartment: '', 
          dateRange: { start: null, end: null } 
        }, false, 'clearFilters'),
        
        // Actions pour les notifications
        addNotification: (notification) => set(
          (state) => ({
            notifications: [{
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date(),
              read: false,
            }, ...state.notifications]
          }),
          false,
          'addNotification'
        ),
        markNotificationAsRead: (id) => set(
          (state) => ({
            notifications: state.notifications.map(notif =>
              notif.id === id ? { ...notif, read: true } : notif
            )
          }),
          false,
          'markNotificationAsRead'
        ),
        clearNotification: (id) => set(
          (state) => ({
            notifications: state.notifications.filter(notif => notif.id !== id)
          }),
          false,
          'clearNotification'
        ),
        clearAllNotifications: () => set({ notifications: [] }, false, 'clearAllNotifications'),
        
        // Reset complet
        reset: () => set(initialState, false, 'reset'),
      }),
      {
        name: 'ena-rh-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ena-rh-store',
    }
  )
);

// Selectors pour une utilisation optimisée
export const useAuth = () => useGlobalStore((state) => ({
  currentUser: state.currentUser,
  isAuthenticated: state.isAuthenticated,
  setCurrentUser: state.setCurrentUser,
  setAuthenticated: state.setAuthenticated,
}));

export const useUI = () => useGlobalStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  theme: state.theme,
  loading: state.loading,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  setLoading: state.setLoading,
}));

export const useFilters = () => useGlobalStore((state) => ({
  searchQuery: state.searchQuery,
  selectedDepartment: state.selectedDepartment,
  dateRange: state.dateRange,
  setSearchQuery: state.setSearchQuery,
  setSelectedDepartment: state.setSelectedDepartment,
  setDateRange: state.setDateRange,
  clearFilters: state.clearFilters,
}));

export const useNotifications = () => useGlobalStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  markNotificationAsRead: state.markNotificationAsRead,
  clearNotification: state.clearNotification,
  clearAllNotifications: state.clearAllNotifications,
}));

// Hook pour les employés (combiné avec React Query)
export const useEmployeesStore = () => useGlobalStore((state) => ({
  employees: state.employees,
  setEmployees: state.setEmployees,
  addEmployee: state.addEmployee,
  updateEmployee: state.updateEmployee,
  removeEmployee: state.removeEmployee,
}));

// Hook pour les absences (combiné avec React Query)
export const useAbsencesStore = () => useGlobalStore((state) => ({
  absences: state.absences,
  setAbsences: state.setAbsences,
  addAbsence: state.addAbsence,
  updateAbsence: state.updateAbsence,
  removeAbsence: state.removeAbsence,
}));
