import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { ToastProvider } from './contexts/ToastContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import MobileOptimizer from './components/MobileOptimizer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ChatBot from './components/ChatBot';
import { AnimationStyles } from './components/Animations';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';

// Pages Personnel
import Employees from './pages/personnel/Employees';
import Profile from './pages/personnel/Profile';
import Evaluations from './pages/personnel/Evaluations';
import Recruitment from './pages/personnel/Recruitment';
import Organization from './pages/personnel/Organization';
import Onboarding from './pages/personnel/Onboarding';
import DemandeRole from './pages/DemandeRole';

// Pages Gestion du Temps
import Absences from './pages/time-management/Absences';
import Trainings from './pages/time-management/Trainings';
import Attendance from './pages/time-management/Attendance';

// Pages Finance
import Payroll from './pages/finance/Payroll';
import Documents from './pages/finance/Documents';
import Expenses from './pages/finance/Expenses';

// Pages Administration
import Statistics from './pages/admin/Statistics';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';
import WorkflowManagement from './pages/admin/WorkflowManagement';
import Compliance from './pages/admin/Compliance';

// Pages Authentification
import { Login, Register, ForgotPassword } from './pages/auth';

// Page About
import About from './pages/About';

// Page Unauthorized
import Unauthorized from './pages/Unauthorized';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <>
      <AnimationStyles />
      <ReactQueryProvider>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <SidebarProvider>
                <MobileOptimizer>
                  <Router basename={routerBasename}>
                      <Routes>
                        {/* Routes d'authentification */}
                        <Route path="/auth/login" element={<Login />} />
                        <Route path="/auth/register" element={<Register />} />
                        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                        
                        {/* Route 403 - Accès non autorisé */}
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        
                        {/* Routes principales protégées avec Layout */}
                        <Route path="/" element={
                          <ProtectedRoute>
                            <Layout />
                          </ProtectedRoute>
                        }>
                          {/* Pages accessibles à tous les rôles authentifiés */}
                          <Route index element={<Dashboard />} />
                          <Route path="search" element={<SearchPage />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="notifications" element={<Notifications />} />
                          <Route path="about" element={<About />} />
                          <Route path="demande-role" element={<DemandeRole />} />
                          
                          {/* Pages avec accès selon les permissions */}
                          <Route path="employees" element={<Employees />} />
                          <Route path="organization" element={<Organization />} />
                          <Route path="absences" element={<Absences />} />
                          <Route path="attendance" element={<Attendance />} />
                          <Route path="trainings" element={<Trainings />} />
                          <Route path="documents" element={<Documents />} />
                          <Route path="evaluations" element={<Evaluations />} />
                          <Route 
                            path="recruitment" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Recruitment />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="onboarding" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Onboarding />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="expenses" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Expenses />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Pages admin/hr uniquement */}
                          <Route 
                            path="statistics" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Statistics />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="statistics-advanced" element={<Navigate to="/statistics" replace />} />
                          
                          {/* Pages admin uniquement */}
                          <Route 
                            path="workflow-management" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <WorkflowManagement />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="payroll" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <Payroll />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="compliance" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Compliance />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Pages super_admin uniquement */}
                          <Route 
                            path="settings" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin']}>
                                <Settings />
                              </ProtectedRoute>
                            } 
                          />
                        </Route>
                      </Routes>
                      
                      {/* PWA Install Prompt */}
                      <PWAInstallPrompt />

                      {/* ChatBot IA Assistant */}
                      <ChatBot />
                  </Router>
                </MobileOptimizer>
              </SidebarProvider>
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </>
  );
}

export default App;
