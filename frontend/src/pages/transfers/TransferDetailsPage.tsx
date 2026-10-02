import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transferService } from '../../services/blockchain/transferService';
import { useWallet } from '../../context/WalletContext';
import type { TransferRequest } from '../../types';
import { EscrowStatusCard } from '../../components/transfer/EscrowStatusCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { ExplorerLink } from '../../components/ui/ExplorerLink';
import { ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const TransferDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { role, wallet } = useWallet();
  const [transfer, setTransfer] = useState<TransferRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = () => {
    if (!id) return;
    const found = transferService.getTransferById(id);
    setTransfer(found);
  };

  useEffect(() => {
    loadData();
    return transferService.subscribe(loadData);
  }, [id]);

  if (!transfer) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Transfer Dossier Not Found</h2>
        <p className="text-xs text-slate-500">The transfer ID {id} does not exist in the active ledger.</p>
        <Link to="/transfers">
          <Button variant="primary" size="sm">
            Back to Transfers
          </Button>
        </Link>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await transferService.approveTransferByGovernment(
        transfer.id,
        wallet.address || '0xAB309F14a601569BdB21E885B9E780c109A0191D'
      );
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    setIsLoading(true);
    try {
      await transferService.finalizeTransferAndReleaseEscrow(transfer.id);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-mono font-bold text-slate-900">{transfer.id}</span>
            <span>·</span>
            <span className="font-mono">{transfer.propertyId}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Escrow Conveyance Dossier
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={transfer.status} size="md" />
          <StatusBadge status={transfer.escrowState} size="md" />
        </div>
      </div>

      {/* Escrow Visual State Machine */}
      <EscrowStatusCard
        state={transfer.escrowState}
        amountMATIC={transfer.agreedPriceMATIC}
        platformFeeMATIC={transfer.platformFeeMATIC}
      />

      {/* Transfer Contract Details */}
      <Card>
        <CardHeader
          title="Escrow Parameters & Statutory Parties"
          subtitle="Governed by Cadastra EscrowManager multi-sig contract"
          action={
            transfer.txHash && (
              <ExplorerLink type="tx" value={transfer.txHash} label="View Escrow on PolygonScan" />
            )
          }
        />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block">Transferor (Vendor)</span>
              <p className="text-slate-500 text-[11px]">Original Beneficiary & Deed Holder</p>
              <AddressDisplay address={transfer.sellerAddress} truncateLength={6} showExplorerLink />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block">Transferee (Purchaser)</span>
              <p className="text-slate-500 text-[11px]">Deposited Consideration & Receiver of NFT</p>
              <AddressDisplay address={transfer.buyerAddress} truncateLength={6} showExplorerLink />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Agreed Value</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {transfer.agreedPriceMATIC.toLocaleString()} MATIC
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Fiat Parity</span>
              <span className="font-semibold text-slate-800">
                ₹{(transfer.agreedPriceINR / 100000).toFixed(1)} Lakh
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Escrow Created</span>
              <span className="text-slate-800 font-mono text-[11px]">
                {new Date(transfer.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Escrow Protocol</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Custody Active
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Link to="/transfers">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Transfers
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              {role === 'officer' && transfer.status === 'under_review' && (
                <Button
                  variant="success"
                  size="md"
                  onClick={handleApprove}
                  isLoading={isLoading}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  Sub-Registrar Sanction Conveyance
                </Button>
              )}

              {transfer.status === 'approved' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinalize}
                  isLoading={isLoading}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Execute Escrow Release & Relay Title
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
