import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/AppProvider';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CustomerList = lazy(() => import('./components/CustomerList').then(m => ({ default: m.CustomerList })));
const ServiceList = lazy(() => import('./components/ServiceList').then(m => ({ default: m.ServiceList })));

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<div className="flex h-screen items-center justify-center bg-gray-50"><h1 className="text-4xl font-bold text-primary-600">Smart Laundry System</h1></div>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/services" element={<ServiceList />} />
        </Routes>
      </Suspense>
      <NetworkStatusIndicator />
    </AppProvider>
  );
}

export default App;
