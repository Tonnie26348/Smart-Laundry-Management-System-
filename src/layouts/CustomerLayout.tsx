import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { 
  Menu, Home, ShoppingCart, CreditCard, MessageSquare, 
  Bell, Award, Star, User, LogOut 
} from 'lucide-react';

export const CustomerLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase.from('profiles').select('full_name').eq('id', user.id) as any);
        if (data && data.length > 0) setUserName(data[0].full_name);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Dashboard', path: "/dashboard", icon: Home },
    { name: 'Orders', path: "/orders", icon: ShoppingCart },
    { name: 'Payments', path: "/payments", icon: CreditCard },
    { name: 'Messages', path: "/messages", icon: MessageSquare },
    { name: 'Notifications', path: "/notifications", icon: Bell },
    { name: 'Loyalty', path: "/loyalty", icon: Award },
    { name: 'Reviews', path: "/reviews", icon: Star },
    { name: 'Profile', path: "/profile", icon: User },
  ];

  const NavLinks = () => (
    <>
      {navLinks.map(link => (
        <a 
          key={link.path} 
          href={link.path}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <link.icon size={20} />
          {link.name}
        </a>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="h-16 flex items-center px-6 border-b font-bold text-primary-600 text-xl flex-shrink-0">Smart Laundry</div>
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t flex-shrink-0">
          <div className="px-4 py-2 text-sm text-gray-500 mb-2 truncate">Hi, {userName}</div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut size={20} className="mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <header className="bg-white border-b h-16 flex items-center px-4 md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </Button>
        </header>
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
      
      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};
