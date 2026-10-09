import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Mail, Lock, LogIn } from 'lucide-react';

const DEMO_ACCOUNTS: Record<string, {email: string, password: string}> = {
  admin: { email: 'admin@tokenestate.io', password: 'adminpassword123' },
  officer: { email: 'officer@tokenestate.io', password: 'officerpassword123' },
  owner: { email: 'owner@tokenestate.io', password: 'ownerpassword123' },
  buyer: { email: 'buyer@tokenestate.io', password: 'buyerpassword123' },
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    if (selectedRole && DEMO_ACCOUNTS[selectedRole]) {
      setEmail(DEMO_ACCOUNTS[selectedRole].email);
      setPassword(DEMO_ACCOUNTS[selectedRole].password);
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username_or_email: email,
          password: password
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/dashboard');
      } else {
        const errData = await response.json();
        alert(errData.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error', error);
      alert('Network error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Log in to your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-slate-900 hover:text-slate-800 underline">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Select
              label="Quick Login (Demo Accounts)"
              id="demo-role"
              name="demo-role"
              value={role}
              onChange={handleRoleSelect}
              options={[
                { value: '', label: '-- Select a Demo User --' },
                { value: 'admin', label: 'Admin (admin@tokenestate.io)' },
                { value: 'officer', label: 'Government Officer (officer@tokenestate.io)' },
                { value: 'owner', label: 'Property Owner (owner@tokenestate.io)' },
                { value: 'buyer', label: 'Buyer (buyer@tokenestate.io)' }
              ]}
              helperText="Selecting a role will auto-fill the credentials below."
            />
            <Input
              label="Email address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-5 w-5" />}
              placeholder="Email address"
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-slate-900 hover:text-slate-800 underline">
                Forgot password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<LogIn className="h-5 w-5" />}
          >
            Log in
          </Button>
        </form>
      </Card>
    </div>
  );
}
