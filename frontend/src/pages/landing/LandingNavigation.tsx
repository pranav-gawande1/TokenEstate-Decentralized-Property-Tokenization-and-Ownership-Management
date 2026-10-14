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

import { getActiveRole, hasModulePermission } from '../../utils/permissions';

export const LandingNavigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { role: walletRole } = useWallet();
  const currentRole = getActiveRole(walletRole);

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

  const canBuyer = hasModulePermission('buyer', currentRole);
  const canOwner = hasModulePermission('owner', currentRole);
  const canVerification = hasModulePermission('verification', currentRole);
  const canAudit = hasModulePermission('audit', currentRole);
  const canInstitutional = hasModulePermission('institutional', currentRole);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Properties', href: '/properties' },
    ...(canBuyer ? [{ label: 'Marketplace', href: '/marketplace' }] : []),
    ...(canVerification ? [{ label: 'Verification', href: '/verification' }] : []),
    { label: 'Transfers', href: '/transfers' },
    ...(canAudit ? [{ label: 'Audit Trail', href: '/audit' }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B132B] text-white border-b border-slate-800/90 shadow-sm">

      <div className="w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-4">

        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <Shield className="w-4 h-4 text-white" />
          </div>

          <span className="text-lg font-extrabold tracking-tight">
            Cadastra
          </span>

          <span className="hidden sm:inline-flex text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1.5 py-0.5 rounded">
            WEB3
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-6 flex-1">
          {navLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              location.pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`
                  whitespace-nowrap
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  font-medium
                  transition-colors

                  ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">

          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex">
                <NetworkBadge />
              </div>
              <WalletButton />
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-300 hover:text-white bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 transition-colors cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="
              lg:hidden
              p-2
              rounded-lg
              text-slate-300
              hover:text-white
              hover:bg-slate-800
              transition-colors
            "
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B132B] px-4 py-4">

          {isAuthenticated && (
            <div className="mb-4 flex flex-col gap-2">
              <NetworkBadge />
              <WalletButton />
            </div>
          )}

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.href ||
                location.pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    block
                    px-3
                    py-2.5
                    rounded-lg
                    text-sm
                    font-medium

                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile actions */}

          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="
                  block
                  w-full
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  font-semibold
                  text-center
                  text-red-300
                  bg-red-950/60
                  hover:bg-red-900/80
                  border
                  border-red-800/60
                  cursor-pointer
                "
              >
                Log Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    block
                    w-full
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    font-semibold
                    text-center
                    text-slate-200
                    bg-slate-800
                    hover:bg-slate-700
                  "
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="
                    block
                    w-full
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    font-semibold
                    text-center
                    text-white
                    bg-blue-600
                    hover:bg-blue-500
                  "
                >
                  Sign Up
                </Link>
              </div>
            )}

            {canOwner && (
              <Link
                to="/properties/register"
                onClick={() => setMobileMenuOpen(false)}
                className="
                  block
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  text-center
                  text-white
                  bg-blue-600
                  hover:bg-blue-700
                "
              >
                Register New Property
              </Link>
            )}

            {canInstitutional && (
              <Link
                to="/government/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className="
                  block
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  text-center
                  text-emerald-300
                  bg-emerald-950/80
                  border
                  border-emerald-800/80
                "
              >
                Government Registrar Desk
              </Link>
            )}

            {(currentRole === 'auditor' || currentRole === 'admin') && (
              <Link
                to="/admin/fraud-detection"
                onClick={() => setMobileMenuOpen(false)}
                className="
                  block
                  w-full
                  px-3
                  py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  text-center
                  text-amber-300
                  bg-amber-950/80
                  border
                  border-amber-800/80
                "
              >
                Compliance & Fraud Console
              </Link>
            )}

          </div>
        </div>
      )}

    </header>
  );
};