import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Building2,
  FileCheck2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { authService } from '../../services/authService';

interface DemoUser {
  label: string;
  role: string;
  email: string;
  pass: string;
  badgeColor: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    label: 'Admin',
    role: 'System Administrator',
    email: 'admin@tokenestate.io',
    pass: 'adminpassword123',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    label: 'Officer',
    role: 'Cadastral Officer',
    email: 'officer@tokenestate.io',
    pass: 'officerpassword123',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  {
    label: 'Owner',
    role: 'Property Owner (Seller)',
    email: 'owner@tokenestate.io',
    pass: 'ownerpassword123',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  },
  {
    label: 'Buyer',
    role: 'Investor / Buyer',
    email: 'buyer@tokenestate.io',
    pass: 'buyerpassword123',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const successMessage = (
    location.state as { message?: string } | null
  )?.message;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login({
        username_or_email: email.trim().toLowerCase(),
        password,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in. Please check your credentials.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (demo: DemoUser) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
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
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />

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
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Showcase (hidden on mobile, visible on lg) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Decentralized Land Governance
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                Authentic Deeds. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Cryptographic Trust.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log in to access your registered cadastral assets, view live
                on-chain approvals, and execute tamper-evident deed conveyances.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    3-Layer Forensic Verification
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dual Keccak-256 and SHA-256 hash checks with IPFS storage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    ERC-721 Property Tokenization
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Polygon smart contract state machine representing real-world title deeds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Statutory Sub-Registrar Escrow
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Automated multi-sig locking ensures funds release only upon official sanction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="w-full lg:col-span-7 max-w-md mx-auto">
            <div className="bg-slate-900/85 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60 relative">
              <div className="space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
                  <LogIn className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Enter your credentials or choose a pre-seeded demo role.
                </p>
              </div>

              {/* Quick Demo Logins Pill Bar */}
              <div className="mb-6 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[11px] font-mono font-medium text-slate-400 mb-2 flex items-center justify-between">
                  <span>Quick Demo Profiles:</span>
                  <span className="text-[10px] text-blue-400">Click to fill</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.label}
                      type="button"
                      onClick={() => handleSelectDemo(demo)}
                      className={`text-left px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${demo.badgeColor}`}
                      title={`${demo.role} (${demo.email})`}
                    >
                      <div className="font-bold text-[11px]">{demo.label}</div>
                      <div className="text-[9px] opacity-80 truncate">
                        {demo.email.split('@')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status / Error Alerts */}
              {successMessage && (
                <div
                  role="status"
                  className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Email Address or Username <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="text"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@tokenestate.io"
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-950/70 text-white text-sm pl-10 pr-4 py-2.5 transition-all placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-300 mb-1.5"
                  >
                    Password <span className="text-blue-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Log in to Cadastra</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-xs text-slate-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                  >
                    Create a free account
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
