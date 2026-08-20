import { AppProvider } from './app/AppProvider';

function App() {
  return (
    <AppProvider>
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h1 className="text-4xl font-bold text-primary-600">Smart Laundry System</h1>
      </div>
    </AppProvider>
  );
}

export default App;
