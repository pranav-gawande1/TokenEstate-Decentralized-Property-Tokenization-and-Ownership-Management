import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  LogOut,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import { NetworkBadge } from '../../components/wallet/NetworkBadge';
import { WalletButton } from '../../components/wallet/WalletButton';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };


  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A1021]/95 backdrop-blur-md text-white border-b border-slate-800 shadow-sm">
      <div className="mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-[#0A1021] rounded-[10px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-cyan-300 transition-all">
                Tokenize<span className="text-blue-500">Estate</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-extrabold tracking-widest text-cyan-300 bg-cyan-950/80 border border-cyan-700/60 px-1.5 py-0.2 rounded shadow-xs">
                WEB3
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide -mt-0.5 hidden sm:block">
              Decentralized Land & Asset Registry
            </span>
          </div>
        </Link>

        {/* Actions: Network + Wallet + Logout if authenticated, otherwise Login & Signup */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex">
                <NetworkBadge />
              </div>
              <WalletButton />
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </>
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