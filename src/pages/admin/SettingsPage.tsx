import { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRole } from '@/hooks/useRole';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const SettingsPage = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role, loading: roleLoading } = useRole();

  useEffect(() => {
    if (roleLoading) return;
    if (role !== 'administrator') {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error) console.error('Error fetching settings:', error);
      else setSettings(data || []);
      setLoading(false);
    };
    fetchSettings();
  }, [role, roleLoading]);

  const updateSetting = async (key: string, newValue: any) => {
    const { error } = await supabase.from('system_settings').upsert({ key, value: newValue } as any);
    if (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting');
    } else {
      alert('Setting updated');
    }
  };

  if (roleLoading) return <AdminLayout><LoadingSpinner /></AdminLayout>;
  if (role !== 'administrator') return <AdminLayout><div className="p-4 text-red-500">Access Denied</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        {loading ? <LoadingSpinner /> : (
          <div className="bg-white shadow rounded-lg p-6 space-y-4">
            {settings.map(s => (
              <div key={s.key} className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="text-sm font-medium">{s.key}</label>
                  <Input 
                    value={typeof s.value === 'object' ? JSON.stringify(s.value) : s.value} 
                    onChange={(e) => {
                      const newSettings = settings.map(set => set.key === s.key ? {...set, value: e.target.value} : set);
                      setSettings(newSettings);
                    }}
                  />
                </div>
                <Button onClick={() => updateSetting(s.key, s.value)}>Save</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
