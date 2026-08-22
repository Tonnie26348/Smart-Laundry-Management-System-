import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRole } from '@/hooks/useRole';

export const SettingsPage = () => {
  const { role, loading: roleLoading } = useRole();

  if (roleLoading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (role !== 'administrator') return <AdminLayout>Access Denied</AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Admin settings will be configured here.</p>
      </div>
    </AdminLayout>
  );
};
