import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from '../wallet/WalletButton';
import { NetworkBadge } from '../wallet/NetworkBadge';
import { WalletModal } from '../wallet/WalletModal';
import {
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const { role } = useWallet();

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Properties', href: '/properties' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Verification', href: '/verification' },
    { label: 'Transfers', href: '/transfers' },
    { label: 'Audit Trail', href: '/audit' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B132B] text-white border-b border-slate-800/90 shadow-sm">

      {/* =====================================================
          DESKTOP HEADER
      ====================================================== */}

      <div className="w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center gap-4">

        {/* =================================================
            LOGO
        ================================================== */}

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

        {/* =================================================
            NAVIGATION
        ================================================== */}

        {/* <nav className="hidden lg:flex items-center gap-1 ml-6 flex-1">
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
        </nav> */}

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">

          <div className="hidden sm:flex">
            <NetworkBadge />
          </div>

          {!localStorage.getItem('token') ? (
            <div className="hidden sm:flex items-center gap-1">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition-colors">
                Log in
              </Link>
              <Link to="/signup" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
                Sign up
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
              className="hidden sm:flex text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition-colors"
            >
              Log out
            </button>
          )}

          <WalletButton />

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

          <div className="mb-4">
            <NetworkBadge />
          </div>

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

            {!localStorage.getItem('token') ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-center text-slate-300 bg-slate-800 hover:text-white hover:bg-slate-700"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-center text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="block w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-center text-slate-300 bg-slate-800 hover:text-white hover:bg-slate-700"
              >
                Log out
              </button>
            )}

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

            {role === 'officer' && (
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

            {role === 'auditor' && (
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

      {/* Global wallet modal */}
      <WalletModal />

    </header>
  );
};