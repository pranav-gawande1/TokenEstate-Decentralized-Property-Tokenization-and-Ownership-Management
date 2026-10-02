import type { Property, PropertyStatus, PropertyDocument } from '../../types';
import { INITIAL_PROPERTIES, FRAUD_CHECKS } from '../mockData';
import { auditService } from './auditService';
import { walletService } from './walletService';
import { APP_CONFIG } from '../../constants';

class PropertyService {
  private properties: Property[] = [...INITIAL_PROPERTIES];
  private listeners: Array<() => void> = [];

  constructor() {
    // Load from localStorage if present for interactive persistence
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cadastra_properties');
      if (stored) {
        try {
          this.properties = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse cached properties', e);
        }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadastra_properties', JSON.stringify(this.properties));
    }
    this.listeners.forEach(l => l());
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  public async getAllProperties(): Promise<Property[]> {
    return [...this.properties];
  }

  public async getPropertyById(id: string): Promise<Property | null> {
    const found = this.properties.find(p => p.id === id);
    return found ? { ...found } : null;
  }

  public async getPropertiesByOwner(ownerAddress: string): Promise<Property[]> {
    return this.properties.filter(
      p => p.currentOwnerAddress.toLowerCase() === ownerAddress.toLowerCase()
    );
  }

  public async getPendingProperties(): Promise<Property[]> {
    return this.properties.filter(p => p.status === 'pending_verification');
  }

  public async getMarketplaceProperties(): Promise<Property[]> {
    // Properties that are verified or tokenized
    return this.properties.filter(p => p.status === 'tokenized' || p.status === 'verified');
  }

  public async registerProperty(data: Omit<Property, 'id' | 'status' | 'registrationDate' | 'isTokenized' | 'governmentRegistrationRef'>): Promise<{ property: Property; txHash: string; blockNumber: number }> {
    const currentCount = this.properties.length + 1;
    const newId = `PROP-00${currentCount}`;
    const txHash = await walletService.signTransaction('registerProperty', { id: newId, survey: data.surveyNumber });
    const blockNumber = 15490000 + Math.floor(Math.random() * 5000);
    const regRef = `IGR-MH-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newProperty: Property = {
      ...data,
      id: newId,
      status: 'pending_verification',
      registrationDate: new Date().toISOString().split('T')[0],
      isTokenized: false,
      governmentRegistrationRef: regRef,
    };

    this.properties.unshift(newProperty);
    this.persist();

    // Log to Blockchain Audit Trail
    auditService.recordEvent({
      propertyId: newId,
      eventType: 'PropertyRegistered',
      actorAddress: data.currentOwnerAddress,
      role: 'Owner',
      blockNumber,
      txHash,
      details: `Cadastral registration submitted for Survey ${data.surveyNumber} in ${data.city}.`
    });

    return { property: newProperty, txHash, blockNumber };
  }

  public async approveProperty(id: string, officerAddress: string, notes?: string): Promise<{ success: boolean; txHash: string }> {
    const property = this.properties.find(p => p.id === id);
    if (!property) throw new Error('Property not found');

    const txHash = await walletService.signTransaction('approveProperty', { id, officerAddress });
    const blockNumber = 15491000 + Math.floor(Math.random() * 5000);

    property.status = 'verified';
    // Mark documents as verified too
    property.documents = property.documents.map(doc => ({
      ...doc,
      verificationStatus: 'verified',
      verifiedBy: officerAddress,
      verifiedAt: new Date().toISOString(),
    }));

    this.persist();

    auditService.recordEvent({
      propertyId: id,
      eventType: 'PropertyApproved',
      actorAddress: officerAddress,
      role: 'Government Registrar',
      blockNumber,
      txHash,
      details: notes || `Cadastral survey & legal deeds verified and approved on Polygon blockchain.`
    });

    return { success: true, txHash };
  }

  public async rejectProperty(id: string, officerAddress: string, reason: string): Promise<{ success: boolean; txHash: string }> {
    const property = this.properties.find(p => p.id === id);
    if (!property) throw new Error('Property not found');

    const txHash = await walletService.signTransaction('rejectProperty', { id, reason });
    const blockNumber = 15491200 + Math.floor(Math.random() * 5000);

    property.status = 'rejected';
    this.persist();

    auditService.recordEvent({
      propertyId: id,
      eventType: 'PropertyRejected',
      actorAddress: officerAddress,
      role: 'Government Registrar',
      blockNumber,
      txHash,
      details: `Registration rejected by Registrar. Reason: ${reason}`
    });

    return { success: true, txHash };
  }

  public async attachDocument(propertyId: string, doc: PropertyDocument): Promise<void> {
    const property = this.properties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');

    property.documents.push(doc);
    this.persist();

    const txHash = await walletService.signTransaction('attachDocument', { propertyId, cid: doc.ipfsCid });
    auditService.recordEvent({
      propertyId,
      eventType: 'DocumentAdded',
      actorAddress: property.currentOwnerAddress,
      role: 'Owner',
      blockNumber: 15491500,
      txHash,
      details: `Attached ${doc.type} (${doc.name}) with IPFS CID ${doc.ipfsCid.slice(0, 16)}...`
    });
  }

  public async tokenizeProperty(propertyId: string, ownerAddress: string): Promise<{ tokenId: string; txHash: string; contractAddress: string }> {
    const property = this.properties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');
    if (property.status !== 'verified') throw new Error('Only government verified properties can be tokenized');

    const tokenId = `${Math.floor(1000 + Math.random() * 9000)}`;
    const txHash = await walletService.signTransaction('mintPropertyNFT', { propertyId, tokenId, ownerAddress });
    const contractAddress = APP_CONFIG.contracts.propertyNFT;

    property.isTokenized = true;
    property.status = 'tokenized';
    property.tokenId = tokenId;
    property.tokenContract = contractAddress;
    property.mintTxHash = txHash;

    this.persist();

    auditService.recordEvent({
      propertyId,
      eventType: 'NFTMinted',
      actorAddress: ownerAddress,
      role: 'Owner',
      blockNumber: 15492000,
      txHash,
      details: `Minted ERC-721 Property NFT #${tokenId} on Polygon Amoy network.`
    });

    return { tokenId, txHash, contractAddress };
  }

  public async transferOwnership(propertyId: string, newOwnerAddress: string, transferTxHash: string): Promise<void> {
    const property = this.properties.find(p => p.id === propertyId);
    if (!property) throw new Error('Property not found');

    const previousOwner = property.currentOwnerAddress;
    property.currentOwnerAddress = newOwnerAddress;
    property.status = 'tokenized';
    this.persist();

    auditService.recordEvent({
      propertyId,
      eventType: 'TransferCompleted',
      actorAddress: newOwnerAddress,
      role: 'Smart Contract Escrow',
      blockNumber: 15493000,
      txHash: transferTxHash,
      details: `Transferred legal blockchain token #${property.tokenId || 'N/A'} from ${previousOwner.slice(0, 8)}... to ${newOwnerAddress.slice(0, 8)}...`
    });
  }

  public getFraudReport(propertyId: string) {
    if (FRAUD_CHECKS[propertyId]) {
      return FRAUD_CHECKS[propertyId];
    }
    const prop = this.properties.find(p => p.id === propertyId);
    return {
      propertyId,
      surveyNumber: prop ? prop.surveyNumber : 'N/A',
      isUniquePropertyId: true,
      isUniqueSurveyNumber: true,
      ownerWalletValid: true,
      documentsVerified: prop ? prop.status === 'verified' || prop.status === 'tokenized' : false,
      previousOwnershipClean: true,
      nftUnique: true,
      conflictDetected: false,
      lastAudited: new Date().toISOString(),
    };
  }
}

export const propertyService = new PropertyService();
