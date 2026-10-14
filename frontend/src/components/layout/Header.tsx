import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  LogOut,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { NetworkBadge } from '../../components/wallet/NetworkBadge';
import { WalletButton } from '../../components/wallet/WalletButton';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const { role } = useWallet();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('token') || localStorage.getItem('user'));
  });

  const handleLogout = async () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.warn('SignOut error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login', { replace: true });
    }
  };


  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A1021] backdrop-blur-md text-white border-b border-slate-800 shadow-sm">
      <div className="mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <Shield className="w-4 h-4 text-white" />
          </div>

          <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
            Cadastra
          </span>

          <span className="hidden sm:inline-flex text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded">
            WEB3
          </span>
        </Link>

        {/* Actions: Logout if authenticated, otherwise Login & Signup */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 px-3.5 py-1.5 text-sm font-medium text-slate-200 hover:bg-slate-700/70 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-blue-600/30 hover:bg-blue-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};