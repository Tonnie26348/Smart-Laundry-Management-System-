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
const CustomersPage = lazy(() => import('./pages/admin/CustomersPage').then(m => ({ default: m.CustomersPage })));
const OrdersPage = lazy(() => import('./pages/admin/OrdersPage').then(m => ({ default: m.OrdersPage })));
const InventoryPage = lazy(() => import('./pages/admin/InventoryPage').then(m => ({ default: m.InventoryPage })));
const PaymentsPage = lazy(() => import('./pages/admin/PaymentsPage').then(m => ({ default: m.PaymentsPage })));
const EmployeesPage = lazy(() => import('./pages/admin/EmployeesPage').then(m => ({ default: m.EmployeesPage })));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('./pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const DiscountsPage = lazy(() => import('./pages/admin/DiscountsPage').then(m => ({ default: m.DiscountsPage })));
const LoyaltyPage = lazy(() => import('./pages/admin/LoyaltyPage').then(m => ({ default: m.LoyaltyPage })));
const ReviewsPage = lazy(() => import('./pages/admin/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const ManagerDashboard = lazy(() => import('./pages/admin/ManagerDashboard').then(m => ({ default: m.ManagerDashboard })));
const LaundryStaffDashboard = lazy(() => import('./pages/admin/LaundryStaffDashboard').then(m => ({ default: m.LaundryStaffDashboard })));
const InspectionsPage = lazy(() => import('./pages/admin/InspectionsPage').then(m => ({ default: m.InspectionsPage })));
const ServicesPage = lazy(() => import('./pages/admin/ServicesPage').then(m => ({ default: m.ServicesPage })));
const PricingPage = lazy(() => import('./pages/admin/PricingPage').then(m => ({ default: m.PricingPage })));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage').then(m => ({ default: m.ReportsPage })));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const OrderWizard = lazy(() => import('./pages/OrderWizard').then(m => ({ default: m.OrderWizard })));
const ServiceList = lazy(() => import('./components/ServiceList').then(m => ({ default: m.ServiceList })));
const CustomerProfile = lazy(() => import('./components/CustomerProfile').then(m => ({ default: m.CustomerProfile })));
const OfflinePage = lazy(() => import('./pages/Offline').then(m => ({ default: m.OfflinePage })));

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/services" element={<div className="p-8"><ServiceList /></div>} />
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
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager" element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/laundrystaff" element={
            <ProtectedRoute>
              <LaundryStaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/inspections" element={
            <ProtectedRoute>
              <InspectionsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/inventory" element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/payments" element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute>
              <EmployeesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute>
              <AuditLogsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/discounts" element={
            <ProtectedRoute>
              <DiscountsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/loyalty" element={
            <ProtectedRoute>
              <LoyaltyPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/services" element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
      <NetworkStatusIndicator />
    </AppProvider>
  );
}

export default App;
