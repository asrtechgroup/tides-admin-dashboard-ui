import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const roleDashboardMap: Record<string, string> = {
  Admin: '/admin-dashboard',
  Engineer: '/engineer-dashboard',
  Planner: '/planner-dashboard',
  Viewer: '/viewer-dashboard',
};

const Login = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, user } = useAuth();

  // Role-based redirect after login using backend user role
  if (isAuthenticated && user) {
    const dashboardPath = roleDashboardMap[user.role] || '/viewer-dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);   // ✅ pass username, not email
      toast.success('Successfully logged in!');
    } catch (error) {
      setError('Invalid username or password. Please try again.');
      setPassword('');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-stone-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-stone-800">TIDES Admin</CardTitle>
          <CardDescription className="text-stone-600">
            Technology-Integrated Development for Estimation & Sustainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-stone-500 space-y-1">
            <div className="font-medium">Demo Credentials:</div>
            <div>Admin: admin / admin123</div>
            <div>Engineer: engineer / eng123</div>
            <div>Planner: planner / plan123</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
