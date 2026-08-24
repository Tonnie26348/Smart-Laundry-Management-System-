/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const authResponse = await authService.login(email, password);
      
      const { data: profiles, error: profileError } = await (supabase
        .from('profiles')
        .select('role')
        .eq('id', authResponse.user.id) as any);

      if (profileError) {
        setError('Error fetching profile: ' + profileError.message);
        setLoading(false);
        return;
      }

      const profile = profiles && profiles.length > 0 ? profiles[0] : null;

      if (!profile) {
        setError('Profile not found. Please contact support.');
        setLoading(false);
        return;
      }

      switch (profile.role) {
        case 'administrator':
          navigate('/admin');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'laundry_staff':
          navigate('/laundrystaff');
          break;
        case 'delivery_staff':
          navigate('/deliverystaff');
          break;
        case 'customer':
          navigate('/dashboard');
          break;
        default:
          setError('Unknown role: ' + profile.role);
          setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 font-medium hover:underline">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
};
