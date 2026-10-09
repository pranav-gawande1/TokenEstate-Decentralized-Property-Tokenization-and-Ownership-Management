import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Mail, Lock, UserPlus, User } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name.replace(/\s+/g, '').toLowerCase() || email.split('@')[0],
          full_name: name,
          email: email,
          password: password,
          role: role
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
        alert(errData.detail || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error', error);
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
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-slate-900 hover:text-slate-800 underline">
              Log in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-5 w-5" />}
              placeholder="John Doe"
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-5 w-5" />}
              placeholder="Password"
            />
            <Select
              label="Role"
              id="role"
              name="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: 'owner', label: 'Property Owner' },
                { value: 'buyer', label: 'Buyer' },
                { value: 'officer', label: 'Government Officer' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-900">
              I agree to the{' '}
              <a href="#" className="font-medium text-slate-900 hover:text-slate-800 underline">
                Terms and Conditions
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<UserPlus className="h-5 w-5" />}
          >
            Create account
          </Button>
        </form>
      </Card>
    </div>
  );
}
