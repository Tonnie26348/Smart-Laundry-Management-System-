import { cn } from '@/utils/cn';

interface NavigationItem {
  name: string;
  href: string;
  adminOnly?: boolean;
}

const menuItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Employees', href: '/admin/employees', adminOnly: true },
  { name: 'Services', href: '/admin/services' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Inventory', href: '/admin/inventory' },
  { name: 'Payments', href: '/admin/payments' },
  { name: 'Deliveries', href: '/admin/deliveries' },
  { name: 'Discounts', href: '/admin/discounts' },
  { name: 'Loyalty', href: '/admin/loyalty' },
  { name: 'Reviews', href: '/admin/reviews' },
  { name: 'Reports', href: '/admin/reports' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Notifications', href: '/admin/notifications' },
  { name: 'Audit Logs', href: '/admin/audit-logs', adminOnly: true },
  { name: 'Settings', href: '/admin/settings', adminOnly: true },
];

export const AdminSidebar = ({ userRole, activePath }: { userRole: string; activePath: string }) => {
  const visibleItems = menuItems.filter(item => !item.adminOnly || userRole === 'administrator');

  return (
    <div className="w-64 bg-gray-900 h-screen text-white p-4 flex flex-col gap-2">
      <h2 className="text-lg font-bold px-2 py-4 border-b border-gray-800 text-primary-500">
        Smart Laundry Admin
      </h2>
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto mt-4">
        {visibleItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-colors",
              activePath === item.href 
                ? "bg-primary-600 text-white font-medium" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            )}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};
