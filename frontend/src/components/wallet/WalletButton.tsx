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
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs ${className}`}
    >
      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <span className="font-mono tabular-nums font-semibold text-slate-100">{truncated}</span>
      <span className="hidden sm:inline-block text-slate-500 font-sans">|</span>
      <span className="hidden sm:inline-block text-slate-300 font-sans text-[11px] font-medium">
        {DEMO_WALLETS[role].role === 'officer'
          ? 'Registrar'
          : DEMO_WALLETS[role].role === 'auditor'
          ? 'Auditor'
          : DEMO_WALLETS[role].role === 'buyer'
          ? 'Buyer'
          : 'Owner'}
      </span>
      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>
  );
};
