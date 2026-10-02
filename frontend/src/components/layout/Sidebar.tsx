import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  FileCheck2,
  ArrowRightLeft,
  ShoppingBag,
  QrCode,
  ShieldCheck,
  History,
  AlertTriangle,
  Settings,
  Layers,
  FileSearch,
  Shield,
  X,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import type { UserRole } from '../../types';

export const Sidebar: React.FC<{ className?: string; onCloseMobile?: () => void }> = ({
  className = '',
  onCloseMobile,
}) => {
  const { role, switchRole } = useWallet();

  const primaryItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Properties', href: '/properties', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Register Property', href: '/properties/register', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Tokenization', href: '/tokenization', icon: <Layers className="w-4 h-4" /> },
    { label: 'Transfers & Escrow', href: '/transfers', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { label: 'Cadastral Deeds', href: '/documents', icon: <FileCheck2 className="w-4 h-4" /> },
  ];

  const verificationItems = [
    { label: 'QR Verification', href: '/verification/qr', icon: <QrCode className="w-4 h-4" /> },
    { label: 'Document Hash Check', href: '/verification/document', icon: <FileSearch className="w-4 h-4" /> },
    { label: 'Audit Trail', href: '/audit', icon: <History className="w-4 h-4" /> },
  ];

  const institutionalItems = [
    {
      label: 'Registrar Review',
      href: '/government/registrations',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'Gov',
    },
    {
      label: 'Fraud & Conflict Check',
      href: '/admin/fraud-detection',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: 'Audit',
    },
  ];

  const settingsItems = [
    { label: 'Platform Settings', href: '/settings/profile', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className={`w-64 bg-[#0A1021] text-slate-300 border-r border-slate-800/90 flex flex-col justify-between shrink-0 select-none shadow-sm ${className}`}>
      {/* Brand Header */}
      {/* <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-[#070D1D] shrink-0">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">Cadastra</span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-1 py-0.2 rounded">
                Web3
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono tracking-tight">Polygon Cadastre</span>
          </div>
        </NavLink>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-whitw hover:text-white p-1 rounded-md hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div> */}

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Core Workspace Section */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
            Cadastral Workspace
          </span>
          <nav className="space-y-1">
            {primaryItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/dashboard' || item.href === '/properties'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Verification & Trust Section */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
            Verification & Audit
          </span>
          <nav className="space-y-1">
            {verificationItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Institutional & Registrar Portals */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
            Institutional Portals
          </span>
          <nav className="space-y-1">
            {institutionalItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  item.badge === 'Gov' 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' 
                    : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                }`}>
                  {item.badge}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div>
          <nav className="space-y-1">
            {settingsItems.map(item => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Role Switcher Drawer Foot */}
      <div className="p-4 border-t border-slate-800/90 bg-[#060B17]">
        <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
          Switch Test Persona
        </p>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {(['owner', 'buyer', 'officer', 'auditor'] as UserRole[]).map(r => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2 py-1.5 rounded-md text-left transition-colors font-medium capitalize truncate cursor-pointer ${
                role === r
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {r === 'officer' ? 'Registrar' : r}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
