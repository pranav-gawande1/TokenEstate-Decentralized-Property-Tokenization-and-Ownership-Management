import { APP_CONFIG } from '../../constants';
import { propertyService } from './propertyService';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  properties: {
    propertyId: string;
    surveyNumber: string;
    areaSqFt: number;
    coordinates: { lat: number; lng: number };
    governmentRegistrationRef: string;
    contractAddress: string;
    standard: string;
  };
}

class NFTService {
  public async getNFTDetails(propertyId: string): Promise<NFTMetadata | null> {
    const property = await propertyService.getPropertyById(propertyId);
    if (!property || !property.isTokenized) return null;

    return {
      name: `${property.title} - NFT #${property.tokenId || '1042'}`,
      description: `Official ERC-721 tokenized digital cadastral asset for ${property.address}, ${property.city}. Certified by Department of Land Resources.`,
      image: property.image,
      external_url: `https://cadastra.gov.in/property/${property.id}`,
      attributes: [
        { trait_type: 'Property ID', value: property.id },
        { trait_type: 'Survey Number', value: property.surveyNumber },
        { trait_type: 'Property Type', value: property.propertyType },
        { trait_type: 'State', value: property.state },
        { trait_type: 'City', value: property.city },
        { trait_type: 'Area (sq.ft)', value: property.areaSqFt },
        { trait_type: 'Token ID', value: property.tokenId || '1042' },
        { trait_type: 'Token Standard', value: 'ERC-721' },
        { trait_type: 'Network', value: 'Polygon Amoy' },
      ],
      properties: {
        propertyId: property.id,
        surveyNumber: property.surveyNumber,
        areaSqFt: property.areaSqFt,
        coordinates: property.coordinates,
        governmentRegistrationRef: property.governmentRegistrationRef,
        contractAddress: property.tokenContract || APP_CONFIG.contracts.propertyNFT,
        standard: 'ERC-721',
      },
    };
  }
}

export const nftService = new NFTService();
