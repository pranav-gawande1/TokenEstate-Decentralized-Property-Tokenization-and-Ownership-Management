import type { Property, PropertyDocument } from '../../types';
import { FRAUD_CHECKS } from '../mockData';
import { auditService } from './auditService';
import { APP_CONFIG } from '../../constants';
import { apiRequest } from '../api';

const PROPERTY_ENDPOINT = '/api/v1/api/v1/properties';

class PropertyService {
  private properties: Property[] = [];
  private listeners: Array<() => void> = [];

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private extractList(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.properties)) return response.properties;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.data)) return response.data;

    return [];

  }

  private extractProperty(response: any): any {
    return response?.property ?? response?.data ?? response;
  }

  private mapProperty(value: any): Property {
    const coordinates = value.coordinates ?? {};

    const statusMap: Record<string, Property['status']> = {
      pending: 'pending_verification',
      submitted: 'pending_verification',
      pending_verification: 'pending_verification',
      verified: 'verified',
      approved: 'verified',
      rejected: 'rejected',
      tokenized: 'tokenized',
    };

    const rawStatus = String(value.status ?? 'pending_verification')
      .toLowerCase()
      .replace(/[\s-]+/g, '_');

    const status =
      statusMap[rawStatus] ?? 'pending_verification';

    const rawDocuments = value.documents ?? [];

    const documents: PropertyDocument[] = Array.isArray(rawDocuments)
      ? rawDocuments.map((doc: any) => ({
        ...doc,
        ipfsCid: doc.ipfsCid ?? doc.ipfs_cid ?? doc.cid ?? '',
        verificationStatus:
          doc.verificationStatus ??
          doc.verification_status ??
          'pending',
        verifiedBy: doc.verifiedBy ?? doc.verified_by,
        verifiedAt: doc.verifiedAt ?? doc.verified_at,
      }) as PropertyDocument)
      : [];

    return {
      ...value,
      id: String(
        value.id ?? value.property_id ?? value.propertyId ?? '',
      ),
      title: value.title ?? value.name ?? '',
      surveyNumber: String(
        value.surveyNumber ?? value.survey_number ?? '',
      ),
      propertyType:
        value.propertyType ?? value.property_type ?? '',
      address: value.address ?? '',
      city: value.city ?? '',
      state: value.state ?? '',
      district: value.district ?? '',
      pinCode: String(
        value.pinCode ?? value.pin_code ?? value.pincode ?? '',
      ),
      areaSqFt: Number(
        value.areaSqFt ??
        value.area_sq_ft ??
        value.area_sqft ??
        value.area ??
        0,
      ),
      landType: value.landType ?? value.land_type ?? '',
      coordinates: {
        lat: Number(
          coordinates.lat ??
          coordinates.latitude ??
          value.latitude ??
          0,
        ),
        lng: Number(
          coordinates.lng ??
          coordinates.longitude ??
          value.longitude ??
          0,
        ),
      },
      currentOwnerAddress:
        value.currentOwnerAddress ??
        value.current_owner_address ??
        value.owner_wallet ??
        value.owner_address ??
        '',
      ownershipType:
        value.ownershipType ?? value.ownership_type ?? '',
      registrationDate:
        value.registrationDate ??
        value.registration_date ??
        value.created_at ??
        '',
      status,
      governmentRegistrationRef:
        value.governmentRegistrationRef ??
        value.government_registration_ref ??
        '',
      valuationInINR: Number(
        value.valuationInINR ??
        value.valuation_in_inr ??
        value.valuation_inr ??
        0,
      ),
      valuationInMATIC: Number(
        value.valuationInMATIC ??
        value.valuation_in_matic ??
        0,
      ),
      isTokenized: Boolean(
        value.isTokenized ??
        value.is_tokenized ??
        status === 'tokenized',
      ),
      tokenId: value.tokenId ?? value.token_id,
      tokenContract:
        value.tokenContract ?? value.token_contract,
      mintTxHash:
        value.mintTxHash ?? value.mint_tx_hash,
      image: value.image ?? value.image_url ?? '',
      documents,
    } as Property;

  }

  public async getAllProperties(): Promise<Property[]> {
    const response = await apiRequest<any>({
      endpoint: PROPERTY_ENDPOINT,
      method: 'GET',
    });

    this.properties = this.extractList(response).map((item) =>
      this.mapProperty(item),
    );

    this.notify();

    return [...this.properties];


  }

  public async getPropertyById(
    id: string,
  ): Promise<Property | null> {
    const response = await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(id)}`,
      method: 'GET',
    });

    const property = this.mapProperty(
      this.extractProperty(response),
    );

    const index = this.properties.findIndex(
      (item) => item.id === property.id,
    );

    if (index >= 0) {
      this.properties[index] = property;
    } else {
      this.properties.unshift(property);
    }

    this.notify();

    return property;


  }

  public async getPropertiesByOwner(
    ownerAddress: string,
  ): Promise<Property[]> {
    const properties = await this.getAllProperties();

    return properties.filter(
      (property) =>
        property.currentOwnerAddress.toLowerCase() ===
        ownerAddress.toLowerCase(),
    );
  }

  public async getPendingProperties(): Promise<Property[]> {
    const properties = await this.getAllProperties();

    return properties.filter(
      (property) =>
        property.status === 'pending_verification',
    );

  }

  public async getMarketplaceProperties(): Promise<Property[]> {
    const properties = await this.getAllProperties();

    return properties.filter(
      (property) =>
        property.status === 'verified' ||
        property.status === 'tokenized',
    );

  }

  public async registerProperty(
    data: Omit<
      Property,
      | 'id'
      | 'status'
      | 'registrationDate'
      | 'isTokenized'
      | 'governmentRegistrationRef'
    >,
  ): Promise<{
    property: Property;
    txHash: string;
    blockNumber: number;
  }> {
    const payload = {
      title: data.title,
      survey_number: data.surveyNumber,
      property_type: data.propertyType,
      address: data.address,
      city: data.city,
      state: data.state,
      district: data.district,
      pin_code: data.pinCode,
      area_sq_ft: data.areaSqFt,
      land_type: data.landType,
      latitude: data.coordinates?.lat,
      longitude: data.coordinates?.lng,
      current_owner_address: data.currentOwnerAddress,
      ownership_type: data.ownershipType,
      valuation_in_inr: data.valuationInINR,
      valuation_in_matic: data.valuationInMATIC,
    };

    const response = await apiRequest<any>({
      endpoint: PROPERTY_ENDPOINT,
      method: 'POST',
      body: payload,
    });

    const result = this.extractProperty(response);
    const property = this.mapProperty(result);

    const txHash = String(
      response?.tx_hash ??
      response?.txHash ??
      result?.tx_hash ??
      result?.txHash ??
      '',
    );

    const blockNumber = Number(
      response?.block_number ??
      response?.blockNumber ??
      result?.block_number ??
      result?.blockNumber ??
      0,
    );

    this.properties = [
      property,
      ...this.properties.filter(
        (item) => item.id !== property.id,
      ),
    ];

    this.notify();

    if (txHash) {
      auditService.recordEvent({
        propertyId: property.id,
        eventType: 'PropertyRegistered',
        actorAddress: property.currentOwnerAddress,
        role: 'Owner',
        blockNumber,
        txHash,
        details: `Property registration submitted for Survey ${property.surveyNumber} in ${property.city}.`,
      });
    }

    return { property, txHash, blockNumber };


  }

  public async approveProperty(
    id: string,
    officerAddress: string,
    notes?: string,
  ): Promise<{ success: boolean; txHash: string }> {
    const response = await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(id)}/approve`,
      method: 'POST',
      body: {
        officer_address: officerAddress,
        notes,
      },
    });

    await this.getAllProperties();

    return {
      success: response?.success ?? true,
      txHash: response?.tx_hash ?? response?.txHash ?? '',
    };
  }

  public async rejectProperty(
    id: string,
    officerAddress: string,
    reason: string,
  ): Promise<{ success: boolean; txHash: string }> {
    const response = await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(id)}/reject`,
      method: 'POST',
      body: {
        officer_address: officerAddress,
        reason,
      },
    });

    await this.getAllProperties();

    return {
      success: response?.success ?? true,
      txHash: response?.tx_hash ?? response?.txHash ?? '',
    };

  }

  public async attachDocument(
    propertyId: string,
    doc: PropertyDocument,
  ): Promise<void> {
    await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(propertyId)}/documents`,
      method: 'POST',
      body: {
        ...doc,
        ipfs_cid: doc.ipfsCid,
      },
    });

    await this.getAllProperties();

  }

  public async tokenizeProperty(
    propertyId: string,
    ownerAddress: string,
  ): Promise<{
    tokenId: string;
    txHash: string;
    contractAddress: string;
  }> {
    const response = await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(propertyId)}/tokenize`,
      method: 'POST',
      body: {
        owner_address: ownerAddress,
      },
    });

    await this.getAllProperties();

    const tokenId = String(
      response?.token_id ?? response?.tokenId ?? '',
    );

    const txHash = String(
      response?.tx_hash ?? response?.txHash ?? '',
    );

    const contractAddress = String(
      response?.contract_address ??
      response?.contractAddress ??
      APP_CONFIG.contracts.propertyNFT,
    );

    if (!tokenId || !txHash) {
      throw new Error(
        'The backend did not return a token ID and transaction hash.',
      );
    }

    return { tokenId, txHash, contractAddress };


  }

  public async transferOwnership(
    propertyId: string,
    newOwnerAddress: string,
    transferTxHash: string,
  ): Promise<void> {
    await apiRequest<any>({
      endpoint: `${PROPERTY_ENDPOINT}/${encodeURIComponent(propertyId)}/transfer`,
      method: 'POST',
      body: {
        new_owner_address: newOwnerAddress,
        transaction_hash: transferTxHash,
      },
    });

    await this.getAllProperties();


  }

  public async getFraudReport(propertyId: string) {
    if (FRAUD_CHECKS[propertyId]) {
      return FRAUD_CHECKS[propertyId];
    }

    const property = await this.getPropertyById(propertyId);

    return {
      propertyId,
      surveyNumber: property?.surveyNumber ?? 'N/A',
      isUniquePropertyId: true,
      isUniqueSurveyNumber: true,
      ownerWalletValid: Boolean(
        property?.currentOwnerAddress,
      ),
      documentsVerified:
        property?.status === 'verified' ||
        property?.status === 'tokenized',
      previousOwnershipClean: true,
      nftUnique: true,
      conflictDetected: false,
      lastAudited: new Date().toISOString(),
    };

  }
}

export const propertyService = new PropertyService();
