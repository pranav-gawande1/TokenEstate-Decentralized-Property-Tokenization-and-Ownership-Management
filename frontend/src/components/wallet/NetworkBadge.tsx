import React from 'react';
import { useWallet } from '../../context/WalletContext';

export const NetworkBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { wallet, switchNetwork } = useWallet();

  const isPolygon = wallet.network === 'polygon-amoy';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
      isPolygon 
        ? 'bg-purple-950/70 text-purple-200 border-purple-800/60 shadow-xs' 
        : 'bg-amber-950/80 text-amber-200 border-amber-800/80'
    } ${className}`}>
      <span className={`w-2 h-2 rounded-full ${isPolygon ? 'bg-purple-400' : 'bg-amber-400'} shrink-0 animate-pulse`} />
      <span className="font-semibold font-mono whitespace-nowrap">
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
