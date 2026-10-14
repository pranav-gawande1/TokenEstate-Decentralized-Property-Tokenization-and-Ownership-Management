import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  FileCheck2,
  ArrowRightLeft,
  ShoppingBag,
  ShieldCheck,
  History,
  AlertTriangle,
  Settings,
  Layers,
  FileSearch,
} from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { getActiveRole, hasModulePermission } from '../../utils/permissions';

export const Sidebar: React.FC<{ className?: string; onCloseMobile?: () => void }> = ({
  className = '',
  onCloseMobile,
}) => {
  const { role: walletRole } = useWallet();
  const currentRole = getActiveRole(walletRole);

  const canOwner = hasModulePermission('owner', currentRole);
  const canBuyer = hasModulePermission('buyer', currentRole);
  const canVerification = hasModulePermission('verification', currentRole);
  const canAudit = hasModulePermission('audit', currentRole);
  const canInstitutional = hasModulePermission('institutional', currentRole);

  const primaryItems = [
    { label: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'My Properties', href: '/properties', icon: <Building2 className="w-4 h-4" /> },
    ...(canOwner
      ? [{ label: 'Register Property', href: '/properties/register', icon: <PlusCircle className="w-4 h-4" /> }]
      : []),
    ...(canBuyer
      ? [{ label: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="w-4 h-4" /> }]
      : []),
    ...(canOwner
      ? [{ label: 'Tokenization', href: '/tokenization', icon: <Layers className="w-4 h-4" /> }]
      : []),
    { label: 'Transfers & Escrow', href: '/transfers', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { label: 'Cadastral Deeds', href: '/documents', icon: <FileCheck2 className="w-4 h-4" /> },
  ];

  const verificationItems = [
    ...(canVerification
      ? [{ label: 'Document Hash Check', href: '/verification/document', icon: <FileSearch className="w-4 h-4" /> }]
      : []),
    ...(canAudit
      ? [{ label: 'Audit Trail', href: '/audit', icon: <History className="w-4 h-4" /> }]
      : []),
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
    <aside
      className={`w-64 bg-[#0A1021] text-slate-300 border-r border-slate-800/90 flex flex-col justify-between shrink-0 select-none shadow-sm ${className}`}
    >
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Core Workspace Section */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
            Cadastral Workspace
          </span>
          <nav className="space-y-1">
            {primaryItems.map((item) => (
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

        {/* Verification & Audit Section (Hidden for Buyer & Owner) */}
        {verificationItems.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
              Verification & Audit
            </span>
            <nav className="space-y-1">
              {verificationItems.map((item) => (
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
        )}

        {/* Institutional & Registrar Portals (Hidden for Buyer & Owner) */}
        {canInstitutional && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
              Institutional Portals
            </span>
            <nav className="space-y-1">
              {institutionalItems.map((item) => (
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
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      item.badge === 'Gov'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {item.badge}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* Settings */}
        <div>
          <nav className="space-y-1">
            {settingsItems.map((item) => (
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
    </aside>
  );
};
