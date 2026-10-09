
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  UserPlus,
  User,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';

const API_URL = 'http://localhost:8000/api/v1/auth';

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username:
            name.trim().replace(/\s+/g, '').toLowerCase() ||
            email.split('@')[0],
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item: { msg?: string }) => item.msg).join(', ')
          : data.detail;

        throw new Error(message || 'Unable to create your account.');
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        navigate('/dashboard');
      } else {
        // Registration succeeded, but the API did not return a token.
        // Send the user to login instead of assuming they are authenticated.
        navigate('/login', {
          state: { message: 'Account created. Please log in.' },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Network error. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-6 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <UserPlus className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Join TokenEstate to manage your property securely.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Enter your full name"
          />

          <Input
            label="Email Address"
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="h-5 w-5" />}
            placeholder="you@example.com"
          />

          <div className="relative">
            <Input
              label="Password"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-5 w-5" />}
              placeholder="At least 8 characters"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-900"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Select
            label="Account Role"
            id="role"
            name="role"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'owner', label: 'Property Owner' },
              { value: 'buyer', label: 'Buyer' },
              { value: 'officer', label: 'Government Officer' },
            ]}
          />

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span>
              I agree to the{' '}
              <Link
                to="/terms"
                className="font-medium text-slate-900 underline"
              >
                Terms and Conditions
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            leftIcon={
              isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )
            }
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-slate-900 underline hover:text-slate-700"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}

