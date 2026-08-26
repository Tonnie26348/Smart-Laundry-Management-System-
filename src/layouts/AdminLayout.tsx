import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-primary-600">Laundry Portal</div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600 flex-wrap">
              {/* Common Links */}
              <a href={isStaff ? "/laundrystaff" : isManager ? "/manager" : "/admin"} className="hover:text-primary-600">Dashboard</a>
              
              <a href="/admin/chat" className="hover:text-primary-600">Messages</a>
              <a href="/admin/staff-customers" className="hover:text-primary-600">Customers</a>

              {/* Operational Links */}
              {isAuthorized && (
                <>
                <a href="/admin/orders" className="hover:text-primary-600">Orders</a>
                {isAdmin && <a href="/admin/customers" className="hover:text-primary-600">Customers</a>}
                {isAdmin && <a href="/admin/services" className="hover:text-primary-600">Services</a>}
                {isAdmin && <a href="/admin/items" className="hover:text-primary-600">Items</a>}
                {isAdmin && <a href="/admin/pricing" className="hover:text-primary-600">Pricing</a>}
                {(isAdmin || isManager) && <a href="/admin/inventory" className="hover:text-primary-600">Inventory</a>}
                {(isAdmin || isManager) && <a href="/admin/payments" className="hover:text-primary-600">Payments</a>}
                {(isAdmin || isManager) && <a href="/admin/employees" className="hover:text-primary-600">Employees</a>}
                {(isAdmin || isManager) && <a href="/admin/deliveries" className="hover:text-primary-600">Deliveries</a>}
                {(isAdmin || isManager) && <a href="/admin/analytics" className="hover:text-primary-600">Analytics</a>}
                {(isAdmin || isManager) && <a href="/admin/reports" className="hover:text-primary-600">Reports</a>}
              </>
            )}

            {/* Admin-Only Links */}
            {isAdmin && (
              <>
                <a href="/admin/audit" className="hover:text-primary-600">Audit Logs</a>
                <a href="/admin/settings" className="hover:text-primary-600">Settings</a>
                <a href="/admin/notifications" className="hover:text-primary-600">Notifications</a>
                <a href="/admin/discounts" className="hover:text-primary-600">Discounts</a>
                <a href="/admin/loyalty" className="hover:text-primary-600">Loyalty</a>
                <a href="/admin/reviews" className="hover:text-primary-600">Reviews</a>
              </>
            )}
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
