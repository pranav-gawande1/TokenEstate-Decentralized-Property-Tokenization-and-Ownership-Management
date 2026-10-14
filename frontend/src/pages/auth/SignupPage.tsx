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
  Shield,
  ArrowLeft,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../../services/authService';

interface RoleOption {
  id: string;
  title: string;
  desc: string;
  icon: typeof Building2;
  badge: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'owner',
    title: 'Property Owner',
    desc: 'List parcels & mint ERC-721 deeds',
    icon: Building2,
    badge: 'Seller',
  },
  {
    id: 'buyer',
    title: 'Buyer / Investor',
    desc: 'Browse land & fund smart escrow',
    icon: Sparkles,
    badge: 'Investor',
  },
  {
    id: 'officer',
    title: 'Government Officer',
    desc: 'Review cadastral deeds & certify',
    icon: ShieldCheck,
    badge: 'Registrar',
  },
  {
    id: 'admin',
    title: 'System Admin',
    desc: 'Platform governance & overrides',
    icon: Shield,
    badge: 'Authority',
  },
];

export function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the platform Terms and Conditions.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const derivedUsername =
        cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_') ||
        name.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');

      await authService.register({
        username: derivedUsername,
        email: cleanEmail,
        password,
        full_name: name.trim(),
        role,
        wallet_address: '',
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create your account. Please check your details and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1F] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Glows & Cadastral Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#6366f1 1px, transparent 1px)',
          backgroundSize: '36px 36px, 72px 72px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Cadastra
            </span>
            <span className="hidden sm:inline-flex text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-md">
              WEB3
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Polygon Amoy 80002
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-3.5 py-1.5 rounded-lg transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Showcase (hidden on mobile, visible on lg) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Real Estate Protocol
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Digital <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Property Ownership.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Join TokenEstate to register cadastral survey numbers, tokenize land
                parcels into ERC-721 NFTs, and transact safely via EVM multi-sig escrow.
              </p>
            </div>

            {/* Checklist of assurances */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Statutory Land Records tied to Polygon Amoy consensus</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encumbrance & fraud prevention forensics on deed uploads</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Role-Based Access Control verified on every state change</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pre-configured testnet wallets with zero real-gas cost</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Government Cadastral Sandbox
              </p>
              <p className="text-[11px] text-blue-400/80">
                Accounts are registered directly into the platform database and bound
                to Polygon Amoy smart contract authorities.
              </p>
            </div>
          </div>

          {/* Right Column: Signup Form Card */}
          <div className="w-full lg:col-span-7 max-w-lg mx-auto">
            <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative">
              <div className="space-y-1.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-3">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Create your account
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select your cadastral persona and set up your credentials.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Full Name <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Sharma"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 text-white text-sm pl-10 pr-4 py-2.5 transition-all placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Email Address <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 text-white text-sm pl-10 pr-4 py-2.5 transition-all placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between"
                  >
                    <span>
                      Password <span className="text-blue-400">*</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Min 8 characters</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 text-white text-sm pl-10 pr-10 py-2.5 transition-all placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((curr) => !curr)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Account Role Visual Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Account Persona / Role <span className="text-blue-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = role === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setRole(opt.id)}
                          className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/15 shadow-sm shadow-blue-500/20'
                              : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  isSelected ? 'text-white' : 'text-slate-200'
                                }`}
                              >
                                {opt.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/30 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>{' '}
                    and Cadastral Verification Policy.
                  </span>
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-blue-600/30 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Cadastra Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-20 py-4 border-t border-slate-800/60 bg-slate-950/40 text-center text-xs text-slate-500">
        © 2026 Cadastra Web3. Decentralized Cadastral & Land Registry Engine.
      </footer>
    </div>
  );
}
