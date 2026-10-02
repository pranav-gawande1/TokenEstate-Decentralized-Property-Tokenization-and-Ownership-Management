import type { TransferRequest, TransferStatus, EscrowState } from '../../types';
import { INITIAL_TRANSFERS } from '../mockData';
import { walletService } from './walletService';
import { propertyService } from './propertyService';
import { auditService } from './auditService';

class TransferService {
  private transfers: TransferRequest[] = [...INITIAL_TRANSFERS];
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cadastra_transfers');
      if (cached) {
        try {
          this.transfers = JSON.parse(cached);
        } catch (e) {
          console.error('Failed to parse cached transfers', e);
        }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadastra_transfers', JSON.stringify(this.transfers));
    }
    this.listeners.forEach(l => l());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public getAllTransfers(): TransferRequest[] {
    return [...this.transfers];
  }

  public getTransferById(id: string): TransferRequest | null {
    const found = this.transfers.find(t => t.id === id);
    return found ? { ...found } : null;
  }

  public getTransfersBySeller(sellerAddress: string): TransferRequest[] {
    return this.transfers.filter(
      t => t.sellerAddress.toLowerCase() === sellerAddress.toLowerCase()
    );
  }

  public getTransfersByBuyer(buyerAddress: string): TransferRequest[] {
    return this.transfers.filter(
      t => t.buyerAddress.toLowerCase() === buyerAddress.toLowerCase()
    );
  }

  public getPendingGovernmentApprovals(): TransferRequest[] {
    return this.transfers.filter(
      t => t.status === 'under_review' || t.status === 'pending'
    );
  }

  public async initiatePurchaseRequest(params: {
    propertyId: string;
    propertyTitle: string;
    sellerAddress: string;
    buyerAddress: string;
    agreedPriceINR: number;
    agreedPriceMATIC: number;
    tokenId?: string;
  }): Promise<{ transfer: TransferRequest; txHash: string }> {
    const platformFeeMATIC = Math.round(params.agreedPriceMATIC * 0.01);
    const escrowAmountMATIC = params.agreedPriceMATIC + platformFeeMATIC;

    // Simulate smart contract escrow locking tx
    const txHash = await walletService.signTransaction('initiateEscrowDeposit', {
      propertyId: params.propertyId,
      amount: escrowAmountMATIC,
    });

    const newTransfer: TransferRequest = {
      id: `TRX-REQ-${Math.floor(800 + Math.random() * 200)}`,
      propertyId: params.propertyId,
      propertyTitle: params.propertyTitle,
      sellerAddress: params.sellerAddress,
      buyerAddress: params.buyerAddress,
      agreedPriceINR: params.agreedPriceINR,
      agreedPriceMATIC: params.agreedPriceMATIC,
      platformFeeMATIC,
      escrowAmountMATIC,
      status: 'under_review',
      escrowState: 'payment_locked',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tokenId: params.tokenId,
      txHash,
    };

    this.transfers.unshift(newTransfer);
    this.persist();

    auditService.recordEvent({
      propertyId: params.propertyId,
      eventType: 'TransferRequested',
      actorAddress: params.buyerAddress,
      role: 'Buyer',
      blockNumber: 15494000,
      txHash,
      details: `Escrow deposit locked: ${escrowAmountMATIC} MATIC for ${params.propertyTitle}. Pending government registrar sanction.`
    });

    return { transfer: newTransfer, txHash };
  }

  public async approveTransferByGovernment(transferId: string, officerAddress: string): Promise<{ txHash: string }> {
    const transfer = this.transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer request not found');

    const txHash = await walletService.signTransaction('approveCadastralTransfer', {
      transferId,
      officerAddress,
    });

    transfer.officerApprovalAddress = officerAddress;
    transfer.status = 'approved';
    transfer.escrowState = 'transfer_approved';
    transfer.updatedAt = new Date().toISOString();
    this.persist();

    auditService.recordEvent({
      propertyId: transfer.propertyId,
      eventType: 'TransferApproved',
      actorAddress: officerAddress,
      role: 'Government Registrar',
      blockNumber: 15495000,
      txHash,
      details: `Sub-Registrar sanctioned transfer deed and authorized smart escrow release.`
    });

    return { txHash };
  }

  public async finalizeTransferAndReleaseEscrow(transferId: string): Promise<{ txHash: string }> {
    const transfer = this.transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer request not found');

    const txHash = await walletService.signTransaction('executeEscrowTransferAndRelease', {
      transferId,
      newOwner: transfer.buyerAddress,
    });

    transfer.status = 'completed';
    transfer.escrowState = 'payment_released';
    transfer.updatedAt = new Date().toISOString();
    this.persist();

    // Update real property owner
    await propertyService.transferOwnership(transfer.propertyId, transfer.buyerAddress, txHash);

    return { txHash };
  }

  public async cancelTransfer(transferId: string, reason: string): Promise<{ txHash: string }> {
    const transfer = this.transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer request not found');

    const txHash = await walletService.signTransaction('cancelEscrowTransfer', {
      transferId,
      reason,
    });

    transfer.status = 'cancelled';
    transfer.escrowState = 'payment_pending';
    transfer.updatedAt = new Date().toISOString();
    this.persist();

    auditService.recordEvent({
      propertyId: transfer.propertyId,
      eventType: 'TransferCancelled',
      actorAddress: walletService.getState().address || transfer.sellerAddress,
      role: 'Participant / Registrar',
      blockNumber: 15496000,
      txHash,
      details: `Escrow transfer cancelled and refund issued. Reason: ${reason}`
    });

    return { txHash };
  }
}

export const transferService = new TransferService();
