import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase.from('profiles').select('full_name').eq('id', user.id).single() as any);
        if (data) setUserName(data.full_name);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">Smart Laundry</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Hi, {userName}</span>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600 flex-wrap">
              <a href="/dashboard" className="hover:text-primary-600">Dashboard</a>
              <a href="/orders" className="hover:text-primary-600">Orders</a>
              <a href="/payments" className="hover:text-primary-600">Payments</a>
              <a href="/notifications" className="hover:text-primary-600">Notifications</a>
              <a href="/loyalty" className="hover:text-primary-600">Loyalty</a>
              <a href="/reviews" className="hover:text-primary-600">Reviews</a>
              <a href="/profile" className="hover:text-primary-600">Profile</a>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
