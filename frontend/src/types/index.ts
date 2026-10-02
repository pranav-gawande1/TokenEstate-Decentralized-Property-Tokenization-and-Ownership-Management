export type UserRole = 'owner' | 'buyer' | 'officer' | 'auditor';

export type PropertyStatus = 
  | 'draft'
  | 'pending_verification'
  | 'verified'
  | 'rejected'
  | 'tokenized'
  | 'transferred';

export type DocumentType = 
  | 'Sale Deed'
  | 'Tax Receipt'
  | 'Mutation Certificate'
  | 'Survey Map'
  | 'NOC'
  | 'Identity Proof';

export interface PropertyDocument {
  id: string;
  name: string;
  type: DocumentType;
  ipfsCid: string;
  sha256Hash: string;
  fileSize: string;
  uploadDate: string;
  verificationStatus: 'verified' | 'pending' | 'flagged' | 'revoked';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  surveyNumber: string;
  propertyType: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';
  address: string;
  city: string;
  state: string;
  district: string;
  pinCode: string;
  areaSqFt: number;
  landType: string;
  coordinates: Coordinates;
  currentOwnerAddress: string;
  ownershipType: 'Sole Ownership' | 'Joint Tenancy' | 'Corporate Title';
  registrationDate: string;
  status: PropertyStatus;
  governmentRegistrationRef: string;
  valuationInINR: number;
  valuationInMATIC: number;
  isTokenized: boolean;
  tokenId?: string;
  tokenContract?: string;
  mintTxHash?: string;
  image: string;
  documents: PropertyDocument[];
}

export type EscrowState = 
  | 'payment_pending'
  | 'payment_locked'
  | 'verification_pending'
  | 'transfer_approved'
  | 'nft_transferred'
  | 'payment_released';

export type TransferStatus = 
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface TransferRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerAddress: string;
  buyerAddress: string;
  agreedPriceINR: number;
  agreedPriceMATIC: number;
  platformFeeMATIC: number;
  escrowAmountMATIC: number;
  status: TransferStatus;
  escrowState: EscrowState;
  createdAt: string;
  updatedAt: string;
  txHash?: string;
  officerApprovalAddress?: string;
  tokenId?: string;
}

export type AuditEventType = 
  | 'PropertyRegistered'
  | 'PropertyApproved'
  | 'PropertyRejected'
  | 'DocumentAdded'
  | 'DocumentVerified'
  | 'DocumentRevoked'
  | 'NFTMinted'
  | 'TransferRequested'
  | 'TransferApproved'
  | 'TransferCompleted'
  | 'TransferCancelled';

export interface AuditEvent {
  id: string;
  propertyId: string;
  eventType: AuditEventType;
  actorAddress: string;
  role: string;
  timestamp: string;
  blockNumber: number;
  txHash: string;
  details: string;
}

export interface BlockchainTx {
  hash: string;
  blockNumber: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  from: string;
  to: string;
  contractAddress: string;
  gasUsed: string;
  gasFeeMATIC: string;
  network: string;
  functionName: string;
  eventLogs: { name: string; data: Record<string, any> }[];
}

export interface FraudCheckReport {
  propertyId: string;
  surveyNumber: string;
  isUniquePropertyId: boolean;
  isUniqueSurveyNumber: boolean;
  ownerWalletValid: boolean;
  documentsVerified: boolean;
  previousOwnershipClean: boolean;
  nftUnique: boolean;
  conflictDetected: boolean;
  conflictReason?: string;
  lastAudited: string;
}

export type Web3Network = 'polygon-amoy' | 'polygon-mainnet' | 'ethereum' | 'unsupported';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: Web3Network;
  balanceMatic: string;
  isConnecting: boolean;
  error: string | null;
}
