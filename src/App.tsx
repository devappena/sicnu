import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReactQueryProvider } from './providers/ReactQueryProvider';
import { ToastProvider } from './contexts/ToastContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PushNotificationProvider } from './contexts/PushNotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import MobileOptimizer from './components/MobileOptimizer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ChatBotFloat from './components/ChatBotFloat';
import { AnimationStyles } from './components/Animations';
import Dashboard from './pages/Dashboard';
import DashboardOptimized from './pages/DashboardOptimized';
import SearchPage from './pages/SearchPage';

// Pages Personnel
import Employees from './pages/personnel/Employees';
import Profile from './pages/personnel/Profile';
import Evaluations from './pages/personnel/Evaluations';
import DemandeRole from './pages/DemandeRole';

// Pages Gestion du Temps
import Absences from './pages/time-management/Absences';
import Timesheet from './pages/time-management/Timesheet';
import Trainings from './pages/time-management/Trainings';

// Pages Finance
import Payroll from './pages/finance/Payroll';
import Documents from './pages/finance/Documents';

// Pages Administration
import Statistics from './pages/admin/Statistics';
import StatisticsAdvanced from './pages/admin/StatisticsAdvanced';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';
import WorkflowManagement from './pages/admin/WorkflowManagement';

// Pages Authentification
import { Login, Register, ForgotPassword } from './pages/auth';

// Page About
import About from './pages/About';

// Page Unauthorized
import Unauthorized from './pages/Unauthorized';

// Configuration React Query
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 2,
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       refetchOnWindowFocus: false,
//     },
//   },
// });

function App() {
  return (
    <>
      <AnimationStyles />
      <ReactQueryProvider>
        <AuthProvider>
          <PushNotificationProvider>
            <NotificationProvider>
              <ToastProvider>
                <SidebarProvider>
                  <MobileOptimizer>
                    <Router>
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
                          <Route path="dashboard-optimized" element={<DashboardOptimized />} />
                          <Route path="search" element={<SearchPage />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="notifications" element={<Notifications />} />
                          <Route path="about" element={<About />} />
                          <Route path="demande-role" element={<DemandeRole />} />
                          
                          {/* Pages avec accès selon les permissions */}
                          <Route path="employees" element={<Employees />} />
                          <Route path="absences" element={<Absences />} />
                          <Route path="trainings" element={<Trainings />} />
                          <Route path="timesheet" element={<Timesheet />} />
                          <Route path="documents" element={<Documents />} />
                          <Route path="evaluations" element={<Evaluations />} />
                          
                          {/* Pages admin/hr uniquement */}
                          <Route 
                            path="statistics" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'hr']}>
                                <Statistics />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Pages admin uniquement */}
                          <Route 
                            path="statistics-advanced" 
                            element={
                              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                                <StatisticsAdvanced />
                              </ProtectedRoute>
                            } 
                          />
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
                      
                      {/* Container de toasts global */}
                      <ToastContainer />
                      
                      {/* PWA Install Prompt */}
                      <PWAInstallPrompt />

                      {/* ChatBot IA Assistant */}
                      <ChatBotFloat />
                    </Router>
                  </MobileOptimizer>
                </SidebarProvider>
              </ToastProvider>
            </NotificationProvider>
          </PushNotificationProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </>
  );
}

export default App;
