import React from 'react';
import type { TransferRequest } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { ArrowRight, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TransferRequestCard: React.FC<{
  transfer: TransferRequest;
  onApprove?: (id: string) => void;
  onFinalize?: (id: string) => void;
  onCancel?: (id: string) => void;
  currentRole?: string;
  isActionLoading?: boolean;
}> = ({
  transfer,
  onApprove,
  onFinalize,
  onCancel,
  currentRole,
  isActionLoading = false,
}) => {
  return (
    <Card className="hover:border-slate-300 transition-colors">
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono font-bold text-slate-900">{transfer.id}</span>
              <span>·</span>
              <span className="font-mono text-slate-700">{transfer.propertyId}</span>
              {transfer.tokenId && (
                <>
                  <span>·</span>
                  <span className="font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded font-medium">
                    NFT #{transfer.tokenId}
                  </span>
                </>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mt-1">
              {transfer.propertyTitle}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={transfer.status} />
            <StatusBadge status={transfer.escrowState} />
          </div>
        </div>

        {/* Counterparties & Valuation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Transferor (Seller)</span>
            <AddressDisplay address={transfer.sellerAddress} truncateLength={4} showExplorerLink />
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Transferee (Buyer)</span>
            <AddressDisplay address={transfer.buyerAddress} truncateLength={4} showExplorerLink />
          </div>
          <div>
            <span className="text-slate-400 block mb-1">Agreed Consideration</span>
            <p className="font-semibold text-slate-900 font-mono text-sm tabular-nums">
              {transfer.agreedPriceMATIC.toLocaleString()} MATIC
            </p>
            <p className="text-[11px] text-slate-500">₹{(transfer.agreedPriceINR / 100000).toFixed(1)} Lakh</p>
          </div>
        </div>

        {/* Transaction & Escrow Meta */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Escrow Hash:</span>
            {transfer.txHash ? (
              <HashDisplay hash={transfer.txHash} truncateLength={5} />
            ) : (
              <span className="font-mono text-slate-400">Pending</span>
            )}
          </div>
          <div>
            <span>Initiated: {new Date(transfer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Role-Aware Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <Link
            to={`/transfers/${transfer.id}`}
            className="text-xs font-semibold text-slate-800 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span>Inspect Escrow Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2">
            {currentRole === 'officer' && transfer.status === 'under_review' && onApprove && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onApprove(transfer.id)}
                isLoading={isActionLoading}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                Sanction Conveyance
              </Button>
            )}

            {transfer.status === 'approved' && onFinalize && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onFinalize(transfer.id)}
                isLoading={isActionLoading}
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Release Escrow & Convey NFT
              </Button>
            )}

            {(transfer.status === 'pending' || transfer.status === 'under_review') && onCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCancel(transfer.id)}
                disabled={isActionLoading}
              >
                Cancel / Refund
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
