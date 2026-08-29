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
import { AdminLayout } from './layouts/AdminLayout';

const EditProfilePage = lazy(() => import('./pages/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const ChatListPage = lazy(() => import('./pages/admin/ChatListPage').then(m => ({ default: m.ChatListPage })));
const ChatPage = lazy(() => import('./pages/admin/ChatPage').then(m => ({ default: m.ChatPage })));
const StaffCustomersPage = lazy(() => import('./pages/admin/StaffCustomersPage').then(m => ({ default: m.StaffCustomersPage })));
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
const DeliveryStaffDashboard = lazy(() => import('./pages/admin/DeliveryStaffDashboard').then(m => ({ default: m.DeliveryStaffDashboard })));
const InspectionsPage = lazy(() => import('./pages/admin/InspectionsPage').then(m => ({ default: m.InspectionsPage })));
const PublicServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ServicesPage = lazy(() => import('./pages/admin/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ItemsPage = lazy(() => import('./pages/admin/ItemsPage').then(m => ({ default: m.ItemsPage })));
const PricingPage = lazy(() => import('./pages/admin/PricingPage').then(m => ({ default: m.PricingPage })));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage').then(m => ({ default: m.ReportsPage })));
const DeliveriesPage = lazy(() => import('./pages/admin/DeliveriesPage').then(m => ({ default: m.DeliveriesPage })));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const OrderWizard = lazy(() => import('./pages/OrderWizard').then(m => ({ default: m.OrderWizard })));
const ServiceList = lazy(() => import('./components/ServiceList').then(m => ({ default: m.ServiceList })));
const CustomerProfile = lazy(() => import('./components/CustomerProfile').then(m => ({ default: m.CustomerProfile })));
const CustomerMessagesPage = lazy(() => import('./pages/CustomerMessagesPage').then(m => ({ default: m.CustomerMessagesPage })));
const CustomerOrdersPage = lazy(() => import('./pages/CustomerOrdersPage').then(m => ({ default: m.CustomerOrdersPage })));
const CustomerPaymentsPage = lazy(() => import('./pages/CustomerPaymentsPage').then(m => ({ default: m.CustomerPaymentsPage })));
const CustomerNotificationsPage = lazy(() => import('./pages/CustomerNotificationsPage').then(m => ({ default: m.CustomerNotificationsPage })));
const CustomerLoyaltyPage = lazy(() => import('./pages/CustomerLoyaltyPage').then(m => ({ default: m.CustomerLoyaltyPage })));
const CustomerReviewsPage = lazy(() => import('./pages/CustomerReviewsPage').then(m => ({ default: m.CustomerReviewsPage })));
const MessagingPage = lazy(() => import('./pages/MessagingPage').then(m => ({ default: m.MessagingPage })));
const ReceiptsPage = lazy(() => import('./pages/ReceiptsPage').then(m => ({ default: m.ReceiptsPage })));
const StaffNotificationsPage = lazy(() => import('./pages/StaffNotificationsPage').then(m => ({ default: m.StaffNotificationsPage })));

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/services" element={<PublicServicesPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerDashboard />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerOrdersPage />
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
          <Route path="/payments" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerPaymentsPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerNotificationsPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/loyalty" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerLoyaltyPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/reviews" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerReviewsPage />
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
          <Route path="/messages" element={
            <ProtectedRoute>
              <CustomerLayout>
                <CustomerMessagesPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile/edit" element={
            <ProtectedRoute>
              <CustomerLayout>
                <EditProfilePage />
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
          <Route path="/deliverystaff" element={
            <ProtectedRoute>
              <DeliveryStaffDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/messaging" element={
            <ProtectedRoute>
              <MessagingPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/chat/:receiverId" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/chat" element={
            <ProtectedRoute>
              <ChatListPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/customers" element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff-customers" element={
            <ProtectedRoute>
              <StaffCustomersPage />
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
          <Route path="/staff/notifications" element={
            <ProtectedRoute>
              <AdminLayout>
                <StaffNotificationsPage />
              </AdminLayout>
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
          <Route path="/admin/items" element={
            <ProtectedRoute>
              <ItemsPage />
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
          <Route path="/admin/receipts" element={
            <ProtectedRoute>
              <AdminLayout>
                <ReceiptsPage />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/receipts" element={
            <ProtectedRoute>
              <CustomerLayout>
                <ReceiptsPage />
              </CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/deliveries" element={
            <ProtectedRoute>
              <DeliveriesPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
      <NetworkStatusIndicator />
    </AppProvider>
  );
}

export default App;
