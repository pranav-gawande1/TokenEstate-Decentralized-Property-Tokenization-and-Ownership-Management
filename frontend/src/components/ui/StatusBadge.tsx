import React from 'react';
import type { PropertyStatus, TransferStatus, EscrowState } from '../../types';

interface StatusBadgeProps {
  status: PropertyStatus | TransferStatus | EscrowState | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      // Property Statuses
      case 'verified':
        return {
          label: 'Verified Record',
          dot: 'bg-emerald-600',
          textColor: 'text-emerald-800',
          bg: 'bg-emerald-50 border-emerald-200',
        };
      case 'tokenized':
        return {
          label: 'Tokenized (ERC-721)',
          dot: 'bg-blue-600',
          textColor: 'text-blue-800',
          bg: 'bg-blue-50 border-blue-200',
        };
      case 'pending_verification':
      case 'pending':
        return {
          label: 'Pending Verification',
          dot: 'bg-amber-600',
          textColor: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'under_review':
        return {
          label: 'Under Review',
          dot: 'bg-amber-600',
          textColor: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'approved':
        return {
          label: 'Approved',
          dot: 'bg-emerald-600',
          textColor: 'text-emerald-800',
          bg: 'bg-emerald-50 border-emerald-200',
        };
      case 'completed':
        return {
          label: 'Transfer Completed',
          dot: 'bg-slate-700',
          textColor: 'text-slate-800',
          bg: 'bg-slate-100 border-slate-200',
        };
      case 'rejected':
      case 'flagged':
        return {
          label: 'Rejected / Disputed',
          dot: 'bg-red-600',
          textColor: 'text-red-800',
          bg: 'bg-red-50 border-red-200',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          dot: 'bg-slate-400',
          textColor: 'text-slate-600',
          bg: 'bg-slate-100 border-slate-200',
        };
      // Escrow States
      case 'payment_locked':
        return {
          label: 'Escrow Locked',
          dot: 'bg-amber-600',
          textColor: 'text-amber-800',
          bg: 'bg-amber-50 border-amber-200',
        };
      case 'transfer_approved':
        return {
          label: 'Transfer Approved',
          dot: 'bg-blue-600',
          textColor: 'text-blue-800',
          bg: 'bg-blue-50 border-blue-200',
        };
      case 'payment_released':
        return {
          label: 'Funds Released',
          dot: 'bg-emerald-600',
          textColor: 'text-emerald-800',
          bg: 'bg-emerald-50 border-emerald-200',
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          dot: 'bg-slate-500',
          textColor: 'text-slate-700',
          bg: 'bg-slate-50 border-slate-200',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded border ${config.bg} ${config.textColor} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} aria-hidden="true" />
      <span className="whitespace-nowrap capitalize">{config.label}</span>
    </span>
  );
};
