import React, { useState, useEffect } from 'react';
import { transferService } from '../../services/blockchain/transferService';
import { useWallet } from '../../context/WalletContext';
import type { TransferRequest } from '../../types';
import { TransferRequestCard } from '../../components/transfer/TransferRequestCard';
import { EscrowStatusCard } from '../../components/transfer/EscrowStatusCard';
import { Tabs } from '../../components/ui/Tabs';
import { EmptyState } from '../../components/ui/EmptyState';
import { ArrowRightLeft } from 'lucide-react';

export const TransfersPage: React.FC = () => {
  const { wallet, role } = useWallet();
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = () => {
    setTransfers(transferService.getAllTransfers());
  };

  useEffect(() => {
    loadData();
    return transferService.subscribe(loadData);
  }, []);

  const userAddress = (wallet.address || '').toLowerCase();

  const filteredTransfers = transfers.filter(t => {
    if (activeTab === 'incoming') {
      return t.sellerAddress.toLowerCase() === userAddress;
    }
    if (activeTab === 'outgoing') {
      return t.buyerAddress.toLowerCase() === userAddress;
    }
    if (activeTab === 'completed') {
      return t.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return t.status === 'cancelled';
    }
    return true;
  });

  const handleApproveByOfficer = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transferService.approveTransferByGovernment(
        id,
        wallet.address || '0xAB309F14a601569BdB21E885B9E780c109A0191D'
      );
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleFinalizeTransfer = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transferService.finalizeTransferAndReleaseEscrow(id);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelTransfer = async (id: string) => {
    setActionLoadingId(id);
    try {
      await transferService.cancelTransfer(id, 'Participant mutual withdrawal or statutory caveat.');
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const transferTabs = [
    { id: 'all', label: 'All Transfers', badge: transfers.length },
    {
      id: 'incoming',
      label: 'Incoming (Seller)',
      badge: transfers.filter(t => t.sellerAddress.toLowerCase() === userAddress).length,
    },
    {
      id: 'outgoing',
      label: 'Outgoing (Buyer)',
      badge: transfers.filter(t => t.buyerAddress.toLowerCase() === userAddress).length,
    },
    {
      id: 'completed',
      label: 'Completed',
      badge: transfers.filter(t => t.status === 'completed').length,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      badge: transfers.filter(t => t.status === 'cancelled').length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Cadastral Title Conveyance & Escrow
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor locked escrow deposits, government sub-registrar title sanctions, and ERC-721 token relays.
        </p>
      </div>

      {/* Escrow State Machine Visualizer */}
      <EscrowStatusCard
        state={transfers[0]?.escrowState || 'payment_locked'}
        amountMATIC={transfers[0]?.agreedPriceMATIC || 48500}
        platformFeeMATIC={transfers[0]?.platformFeeMATIC || 485}
      />

      {/* Tab Filter */}
      <div className="border-b border-slate-200 pb-3">
        <Tabs tabs={transferTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Transfer Requests List */}
      <div className="space-y-4">
        {filteredTransfers.length === 0 ? (
          <EmptyState
            icon={<ArrowRightLeft className="w-6 h-6 text-slate-400" />}
            title="No transfer requests found"
            description="There are currently no active or historical conveyance requests in this category."
          />
        ) : (
          filteredTransfers.map(tr => (
            <TransferRequestCard
              key={tr.id}
              transfer={tr}
              currentRole={role}
              onApprove={handleApproveByOfficer}
              onFinalize={handleFinalizeTransfer}
              onCancel={handleCancelTransfer}
              isActionLoading={actionLoadingId === tr.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
