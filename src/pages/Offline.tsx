import { Button } from '@/components/ui/Button';

export const OfflinePage = () => (
  <div className="flex h-screen flex-col items-center justify-center p-6 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">You're Offline</h1>
    <p className="text-gray-600 mb-8 max-w-sm">
      It looks like you've lost your internet connection. 
      Some features are unavailable while offline.
    </p>
    <Button onClick={() => window.location.reload()}>Try Reconnecting</Button>
  </div>
);
