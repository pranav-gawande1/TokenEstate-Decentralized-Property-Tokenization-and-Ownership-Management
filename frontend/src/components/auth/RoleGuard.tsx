import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard, Lock } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import {
  AppModule,
  getActiveRole,
  hasModulePermission,
  getModuleName,
} from '../../utils/permissions';
import { Button } from '../ui/Button';

interface RoleGuardProps {
  module: AppModule;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  module,
  children,
  fallback,
}) => {
  const { user } = useAuth();
  const { role: walletRole } = useWallet();
  const currentRole = user?.role ? user.role.toLowerCase() : getActiveRole(walletRole);
  const isAllowed = hasModulePermission(module, currentRole);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const moduleName = getModuleName(module);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-slate-900 border border-red-500/30 shadow-2xl text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-950/80 text-red-300 border border-red-800/60 uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" /> 403 Forbidden
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-slate-300">
            Your current role <strong className="text-white capitalize">"{currentRole}"</strong> is denied permission to access the{' '}
            <strong className="text-blue-400">{moduleName}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-left text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span>Enforced Rule:</span>
            <span className="text-red-400 font-bold">Role-Based Access Control</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span>Target Module:</span>
            <span className="text-slate-200">{module}</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span>Active Persona:</span>
            <span className="text-slate-200 capitalize">{currentRole}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white"
              leftIcon={<LayoutDashboard className="w-4 h-4" />}
            >
              Return to Dashboard
            </Button>
          </Link>

          {currentRole === 'buyer' && (
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
              >
                Go to Marketplace
              </Button>
            </Link>
          )}

          {currentRole === 'owner' && (
            <Link to="/properties" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
              >
                My Properties
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
