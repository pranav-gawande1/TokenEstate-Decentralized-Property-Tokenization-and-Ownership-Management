import React from 'react';
import { useWallet } from '../../context/WalletContext';

export const NetworkBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, switchNetwork } = useWallet();

  const isPolygon = wallet.network === 'polygon-amoy';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
      isPolygon 
        ? 'bg-gradient-to-r from-purple-950/80 to-indigo-950/80 text-purple-200 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.15)]' 
        : 'bg-amber-950/80 text-amber-200 border-amber-800/80'
    } ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPolygon ? 'bg-purple-400' : 'bg-amber-400'}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isPolygon ? 'bg-purple-400' : 'bg-amber-400'}`} />
      </span>
      <span className="font-semibold font-mono text-[11px] tracking-wide whitespace-nowrap">
        {isPolygon ? 'Polygon Amoy' : 'Wrong Network'}
      </span>
      {!isPolygon && (
        <button
          onClick={() => switchNetwork('polygon-amoy')}
          className="ml-1 text-[11px] underline font-semibold text-amber-300 hover:text-white cursor-pointer"
        >
          Switch
        </button>
      )}
    </div>
  );
};
