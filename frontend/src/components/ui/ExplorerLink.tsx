import React from 'react';
import { ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

interface ExplorerLinkProps {
  type: 'tx' | 'address' | 'block' | 'token';
  value: string;
  label?: string;
  className?: string;
}

export const ExplorerLink: React.FC<ExplorerLinkProps> = ({
  type,
  value,
  label,
  className = '',
}) => {
  let path = 'tx';
  if (type === 'address') path = 'address';
  if (type === 'block') path = 'block';
  if (type === 'token') path = 'token';

  const url = `${APP_CONFIG.network.explorerUrl}/${path}/${value}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 underline decoration-slate-300 hover:decoration-slate-800 transition-colors ${className}`}
    >
      <span>{label || 'View on PolygonScan'}</span>
      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
    </a>
  );
};
