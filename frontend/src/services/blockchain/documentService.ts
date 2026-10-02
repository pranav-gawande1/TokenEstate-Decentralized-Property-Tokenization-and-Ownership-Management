import { IPFSService } from '../ipfs/ipfsService';
import { propertyService } from './propertyService';
import type { PropertyDocument } from '../../types';

export interface VerificationResult {
  matches: boolean;
  computedHash: string;
  expectedHash?: string;
  ipfsCid?: string;
  document?: PropertyDocument;
  propertyId?: string;
  verifiedAt: string;
  discrepancyNote?: string;
}

class DocumentService {
  /**
   * Verify an uploaded file against a known property document
   */
  public async verifyFileAgainstDocument(
    file: File,
    propertyId: string,
    documentId: string
  ): Promise<VerificationResult> {
    const computedHash = await IPFSService.calculateFileHash(file);
    const property = await propertyService.getPropertyById(propertyId);
    if (!property) {
      return {
        matches: false,
        computedHash,
        verifiedAt: new Date().toISOString(),
        discrepancyNote: 'Property record not found on blockchain.',
      };
    }

    const doc = property.documents.find(d => d.id === documentId);
    if (!doc) {
      return {
        matches: false,
        computedHash,
        propertyId,
        verifiedAt: new Date().toISOString(),
        discrepancyNote: 'Document record not found in property ledger.',
      };
    }

    const matches = doc.sha256Hash.toLowerCase() === computedHash.toLowerCase();

    return {
      matches,
      computedHash,
      expectedHash: doc.sha256Hash,
      ipfsCid: doc.ipfsCid,
      document: doc,
      propertyId,
      verifiedAt: new Date().toISOString(),
      discrepancyNote: matches
        ? undefined
        : 'CRITICAL INTEGRITY FAILURE: The cryptographic SHA-256 hash of this file does not match the immutable blockchain record.',
    };
  }

  /**
   * Verify by IPFS CID or Document Hash directly
   */
  public async verifyByCidOrHash(query: string): Promise<VerificationResult | null> {
    const cleanQuery = query.trim().toLowerCase();
    const properties = await propertyService.getAllProperties();

    for (const prop of properties) {
      for (const doc of prop.documents) {
        if (
          doc.sha256Hash.toLowerCase() === cleanQuery ||
          doc.ipfsCid.toLowerCase() === cleanQuery ||
          doc.id.toLowerCase() === cleanQuery
        ) {
          return {
            matches: true,
            computedHash: doc.sha256Hash,
            expectedHash: doc.sha256Hash,
            ipfsCid: doc.ipfsCid,
            document: doc,
            propertyId: prop.id,
            verifiedAt: new Date().toISOString(),
          };
        }
      }
    }

    return null;
  }
}

export const documentService = new DocumentService();
