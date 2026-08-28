import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { 
  Menu, X, Home, MessageSquare, Users, ShoppingCart, 
  Wrench, Package, Tag, CreditCard, User, Truck, BarChart2, 
  FileText, Shield, Settings, Bell, Percent, Award, Star, LogOut 
} from 'lucide-react';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase.from('profiles').select('role').eq('id', user.id) as any);
        if (data && data.length > 0) setRole(data[0].role || null);
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  const isAdmin = role === 'administrator';
  const isManager = role === 'manager';
  const isStaff = role === 'laundry_staff' || role === 'delivery_staff';
  const isAuthorized = isAdmin || isManager || isStaff;

  const navLinks = [
    { name: 'Dashboard', path: isStaff ? "/laundrystaff" : isManager ? "/manager" : "/admin", icon: Home },
    { name: 'Messages', path: "/admin/chat", icon: MessageSquare },
    { name: 'Customers', path: isAdmin ? "/admin/customers" : "/admin/staff-customers", icon: Users },
    { name: 'Orders', path: "/admin/orders", icon: ShoppingCart, authorized: isAuthorized },
    { name: 'Services', path: "/admin/services", icon: Wrench, adminOnly: true },
    { name: 'Items', path: "/admin/items", icon: Package, adminOnly: true },
    { name: 'Pricing', path: "/admin/pricing", icon: Tag, adminOnly: true },
    { name: 'Inventory', path: "/admin/inventory", icon: Package, authorized: isAdmin || isManager },
    { name: 'Payments', path: "/admin/payments", icon: CreditCard, authorized: isAdmin || isManager },
    { name: 'Employees', path: "/admin/employees", icon: User, authorized: isAdmin || isManager },
    { name: 'Deliveries', path: "/admin/deliveries", icon: Truck, authorized: isAdmin || isManager },
    { name: 'Analytics', path: "/admin/analytics", icon: BarChart2, authorized: isAdmin || isManager },
    { name: 'Reports', path: "/admin/reports", icon: FileText, authorized: isAdmin || isManager },
    { name: 'Audit Logs', path: "/admin/audit", icon: Shield, adminOnly: true },
    { name: 'Settings', path: "/admin/settings", icon: Settings, adminOnly: true },
    { name: 'Notifications', path: "/admin/notifications", icon: Bell, adminOnly: true },
    { name: 'Discounts', path: "/admin/discounts", icon: Percent, adminOnly: true },
    { name: 'Loyalty', path: "/admin/loyalty", icon: Award, adminOnly: true },
    { name: 'Reviews', path: "/admin/reviews", icon: Star, adminOnly: true },
  ];

  const filteredLinks = navLinks.filter(link => 
    (!link.adminOnly || isAdmin) && 
    (!link.authorized || isAuthorized)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col h-full transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="h-16 flex items-center px-6 border-b font-bold text-primary-600 text-xl flex-shrink-0">Laundry Portal</div>
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {filteredLinks.map(link => (
            <a 
              key={link.path} 
              href={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <link.icon size={20} />
              {link.name}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t flex-shrink-0">
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
