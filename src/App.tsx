import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/AppProvider';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { CustomerLayout } from './layouts/CustomerLayout';

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const OrderWizard = lazy(() => import('./pages/OrderWizard').then(m => ({ default: m.OrderWizard })));
const ServiceList = lazy(() => import('./components/ServiceList').then(m => ({ default: m.ServiceList })));
const CustomerProfile = lazy(() => import('./components/CustomerProfile').then(m => ({ default: m.CustomerProfile })));

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/services" element={<div className="p-8"><ServiceList /></div>} />

          {/* Protected Customer Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerDashboard />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders/new" element={
            <ProtectedRoute>
              <CustomerLayout>
                <OrderWizard />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerProfile />
              </CustomerLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
      <NetworkStatusIndicator />
    </AppProvider>
  );
}

export default App;
