import { AppProvider } from './app/AppProvider';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function NetworkStatusIndicator() {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
      You are currently offline. Some features are unavailable.
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-primary-600">Smart Laundry System</h1>
      </div>
      <NetworkStatusIndicator />
    </AppProvider>
  );
}

export default App;
