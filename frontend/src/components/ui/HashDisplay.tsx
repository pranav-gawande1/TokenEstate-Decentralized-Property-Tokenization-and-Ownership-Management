import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

interface HashDisplayProps {
  hash: string;
  truncateLength?: number;
  showCopy?: boolean;
  showExplorerLink?: boolean;
  isBlock?: boolean;
  className?: string;
}

export const HashDisplay: React.FC<HashDisplayProps> = ({
  hash,
  truncateLength = 6,
  showCopy = true,
  showExplorerLink = true,
  isBlock = false,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  if (!hash) return <span className="text-slate-400 font-mono text-xs">N/A</span>;

  const truncated =
    hash.length > truncateLength * 2 + 2
      ? `${hash.slice(0, truncateLength + 2)}...${hash.slice(-truncateLength)}`
      : hash;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const explorerPath = isBlock ? `block/${hash}` : `tx/${hash}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 ${className}`}
      title={hash}
    >
      <span className="tabular-nums font-medium">{truncated}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied hash' : 'Copy hash to clipboard'}
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
      {showExplorerLink && (
        <a
          href={`${APP_CONFIG.network.explorerUrl}/${explorerPath}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View transaction on PolygonScan"
          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
          onClick={e => e.stopPropagation()}
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </span>
  );
};
