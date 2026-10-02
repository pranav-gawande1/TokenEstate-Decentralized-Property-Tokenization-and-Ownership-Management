import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

interface AddressDisplayProps {
  address: string;
  truncateLength?: number;
  showCopy?: boolean;
  showExplorerLink?: boolean;
  className?: string;
  label?: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  truncateLength = 4,
  showCopy = true,
  showExplorerLink = false,
  className = '',
  label,
}) => {
  const [copied, setCopied] = useState(false);

  if (!address) return <span className="text-slate-400 font-mono text-xs">N/A</span>;

  const truncated =
    address.length > truncateLength * 2 + 2
      ? `${address.slice(0, truncateLength + 2)}...${address.slice(-truncateLength)}`
      : address;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded border border-slate-200/80 ${className}`}
      title={address}
    >
      {label && <span className="font-sans font-medium text-slate-500 mr-0.5">{label}:</span>}
      <span className="tabular-nums font-medium">{truncated}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied address' : 'Copy address to clipboard'}
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
      {showExplorerLink && (
        <a
          href={`${APP_CONFIG.network.explorerUrl}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View address on PolygonScan"
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </span>
  );
};
