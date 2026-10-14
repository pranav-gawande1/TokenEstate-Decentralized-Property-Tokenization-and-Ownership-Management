import React from 'react';
import { useWallet } from '../../context/WalletContext';
import { Wallet, ChevronDown } from 'lucide-react';
import { DEMO_WALLETS } from '../../constants';

export const WalletButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, role, openWalletModal } = useWallet();

  if (!wallet.isConnected || !wallet.address) {
    return (
      <button
        onClick={openWalletModal}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer ${className}`}
      >
        <Wallet className="w-3.5 h-3.5" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  const truncated = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;

  return (
    <button
      onClick={openWalletModal}
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700/80 bg-gradient-to-b from-slate-800/90 to-slate-900/90 hover:from-slate-750 hover:to-slate-850 hover:border-slate-600 text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.98] ${className}`}
    >
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
      </div>
      <span className="font-mono tabular-nums font-semibold tracking-tight text-slate-100">{truncated}</span>
      <span className="hidden sm:inline-block text-slate-600 font-sans">|</span>
      <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/50 text-blue-300 font-sans text-[10px] font-semibold tracking-wide uppercase">
        {DEMO_WALLETS[role].role === 'officer'
          ? 'Registrar'
          : DEMO_WALLETS[role].role === 'auditor'
          ? 'Auditor'
          : DEMO_WALLETS[role].role === 'buyer'
          ? 'Buyer'
          : 'Owner'}
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:translate-y-0.5" />
    </button>
  );
};
