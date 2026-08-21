import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatusIndicator = () => {
  const isOnline = useNetworkStatus();
  if (isOnline) return null;
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
      You are currently offline. Some features are unavailable.
    </div>
  );
};
