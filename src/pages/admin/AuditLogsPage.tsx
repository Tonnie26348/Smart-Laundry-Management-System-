import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRole } from '@/hooks/useRole';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loading: roleLoading } = useRole();

  useEffect(() => {
    if (roleLoading) return;
    if (role !== 'administrator') {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching logs:', error);
      else setLogs(data || []);
      setLoading(false);
    };
    fetchLogs();
  }, [role, roleLoading]);

  if (roleLoading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (role !== 'administrator') return <AdminLayout><div className="p-4 text-red-500">Access Denied</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Action</th>
                  <th className="p-4 text-left">Entity</th>
                  <th className="p-4 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} className="border-t">
                    <td className="p-4 font-mono">{l.action}</td>
                    <td className="p-4">{l.entity_type}</td>
                    <td className="p-4">{new Date(l.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
