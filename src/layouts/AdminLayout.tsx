import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase.from('profiles').select('role').eq('id', user.id) as any);
        if (data && data.length > 0) {
            setRole(data[0].role || null);
        }
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

  const NavLinks = () => (
    <>
      <a href={isStaff ? "/laundrystaff" : isManager ? "/manager" : "/admin"} className="block p-2 hover:text-primary-600">Dashboard</a>
      <a href="/admin/chat" className="block p-2 hover:text-primary-600">Messages</a>
      <a href={isAdmin ? "/admin/customers" : "/admin/staff-customers"} className="block p-2 hover:text-primary-600">Customers</a>

      {isAuthorized && (
        <>
          <a href="/admin/orders" className="block p-2 hover:text-primary-600">Orders</a>
          {isAdmin && <a href="/admin/services" className="block p-2 hover:text-primary-600">Services</a>}
          {isAdmin && <a href="/admin/items" className="block p-2 hover:text-primary-600">Items</a>}
          {isAdmin && <a href="/admin/pricing" className="block p-2 hover:text-primary-600">Pricing</a>}
          {(isAdmin || isManager) && <a href="/admin/inventory" className="block p-2 hover:text-primary-600">Inventory</a>}
          {(isAdmin || isManager) && <a href="/admin/payments" className="block p-2 hover:text-primary-600">Payments</a>}
          {(isAdmin || isManager) && <a href="/admin/employees" className="block p-2 hover:text-primary-600">Employees</a>}
          {(isAdmin || isManager) && <a href="/admin/deliveries" className="block p-2 hover:text-primary-600">Deliveries</a>}
          {(isAdmin || isManager) && <a href="/admin/analytics" className="block p-2 hover:text-primary-600">Analytics</a>}
          {(isAdmin || isManager) && <a href="/admin/reports" className="block p-2 hover:text-primary-600">Reports</a>}
        </>
      )}

      {isAdmin && (
        <>
          <a href="/admin/audit" className="block p-2 hover:text-primary-600">Audit Logs</a>
          <a href="/admin/settings" className="block p-2 hover:text-primary-600">Settings</a>
          <a href="/admin/notifications" className="block p-2 hover:text-primary-600">Notifications</a>
          <a href="/admin/discounts" className="block p-2 hover:text-primary-600">Discounts</a>
          <a href="/admin/loyalty" className="block p-2 hover:text-primary-600">Loyalty</a>
          <a href="/admin/reviews" className="block p-2 hover:text-primary-600">Reviews</a>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">Laundry Portal</div>
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                Menu
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-4 text-sm font-medium text-gray-600 flex-wrap">
              <NavLinks />
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden bg-white border-t p-4 text-sm font-medium text-gray-600">
                <NavLinks />
                <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start mt-2">Logout</Button>
            </div>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
