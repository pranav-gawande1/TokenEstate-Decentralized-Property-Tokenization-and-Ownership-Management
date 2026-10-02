import type { Property, TransferRequest, AuditEvent, BlockchainTx, FraudCheckReport } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'PROP-001',
    title: 'The Orchard Estate Villa',
    surveyNumber: 'SRV-MH-PUN-402/1A',
    propertyType: 'Residential',
    address: 'Plot 42, Sector B, Koregaon Park Extension',
    city: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    pinCode: '411001',
    areaSqFt: 2400,
    landType: 'Freehold Non-Agricultural (NA)',
    coordinates: { lat: 18.5362, lng: 73.8941 },
    currentOwnerAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    ownershipType: 'Sole Ownership',
    registrationDate: '2025-11-14',
    status: 'tokenized',
    governmentRegistrationRef: 'IGR-MH-2025-098412',
    valuationInINR: 32500000,
    valuationInMATIC: 48500,
    isTokenized: true,
    tokenId: '1042',
    tokenContract: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    mintTxHash: '0x82ab6182c499fe18206d87192305ca7b9319de8215984210bc6a9812401827a5',
    image: '/src/assets/images/property_pune_villa_1790929193894.jpg',
    documents: [
      {
        id: 'DOC-1001',
        name: 'Registered Sale Deed (Registered No. 4182/2025)',
        type: 'Sale Deed',
        ipfsCid: 'bafybeicg2k3p4z6bcvx7j7w55w2t6n4f8x5z9a2q3r5t8y7u4i3o2p1m0',
        sha256Hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        fileSize: '4.8 MB',
        uploadDate: '2025-11-14',
        verificationStatus: 'verified',
        verifiedBy: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        verifiedAt: '2025-11-16T10:30:00Z',
        notes: 'Verified against Maharashtra Land Record Index-II database.'
      },
      {
        id: 'DOC-1002',
        name: 'Town Planning & Cadastral Survey Map',
        type: 'Survey Map',
        ipfsCid: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku',
        sha256Hash: '0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
        fileSize: '12.2 MB',
        uploadDate: '2025-11-14',
        verificationStatus: 'verified',
        verifiedBy: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        verifiedAt: '2025-11-16T11:15:00Z',
        notes: 'Coordinates benchmarked with District Collectorate GIS survey station.'
      },
      {
        id: 'DOC-1003',
        name: 'Municipal Corporation Tax Clearance & Mutation Certificate',
        type: 'Tax Receipt',
        ipfsCid: 'bafybeie5gq4jxvz4vt7tk56go43e4sfqz6qlp3ffwscuzk4vsmv4euhz3m',
        sha256Hash: '0xfc4146a8c6bfb5b487d605ff85ebcc3f4439c362089f21469e3e784534a413ff',
        fileSize: '1.9 MB',
        uploadDate: '2025-11-14',
        verificationStatus: 'verified',
        verifiedBy: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        verifiedAt: '2025-11-16T11:45:00Z'
      }
    ]
  },
  {
    id: 'PROP-002',
    title: 'Horizon Corporate Tower Floor 7',
    surveyNumber: 'SRV-MH-MUM-891/4C',
    propertyType: 'Commercial',
    address: 'Level 7, G-Block, Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    pinCode: '400051',
    areaSqFt: 5800,
    landType: 'Commercial Leasehold (99 Yrs MMRDA)',
    coordinates: { lat: 19.0657, lng: 72.8687 },
    currentOwnerAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    ownershipType: 'Corporate Title',
    registrationDate: '2026-01-20',
    status: 'pending_verification',
    governmentRegistrationRef: 'IGR-MH-2026-011894',
    valuationInINR: 98000000,
    valuationInMATIC: 146000,
    isTokenized: false,
    image: '/src/assets/images/property_mumbai_tower_1790929209448.jpg',
    documents: [
      {
        id: 'DOC-2001',
        name: 'MMRDA Sanctioned Lease Deed',
        type: 'Sale Deed',
        ipfsCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
        sha256Hash: '0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        fileSize: '8.4 MB',
        uploadDate: '2026-01-20',
        verificationStatus: 'pending',
        notes: 'Under review by Sub-Registrar Bandra.'
      },
      {
        id: 'DOC-2002',
        name: 'Fire Department No Objection Certificate (NOC)',
        type: 'NOC',
        ipfsCid: 'bafybeihkovi4f26g5r2j2f6zsdv3mfr7g4vdj3k37slv5zxfb4s4325kpm',
        sha256Hash: '0xef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        fileSize: '3.1 MB',
        uploadDate: '2026-01-20',
        verificationStatus: 'pending'
      }
    ]
  },
  {
    id: 'PROP-003',
    title: 'Serene Hills Eco Villa & Grounds',
    surveyNumber: 'SRV-KA-BLR-112/9B',
    propertyType: 'Residential',
    address: 'Survey 112, Whitefield North Corridor',
    city: 'Bengaluru',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    pinCode: '560066',
    areaSqFt: 1850,
    landType: 'A-Khata Residential Freehold',
    coordinates: { lat: 12.9716, lng: 77.7499 },
    currentOwnerAddress: '0x83216Ac9d048fB0762E4968C4a086B1a792E72F4',
    ownershipType: 'Sole Ownership',
    registrationDate: '2025-08-10',
    status: 'tokenized',
    governmentRegistrationRef: 'IGR-KA-2025-045129',
    valuationInINR: 24500000,
    valuationInMATIC: 36500,
    isTokenized: true,
    tokenId: '1057',
    tokenContract: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    mintTxHash: '0x39a184e1b8a90184c7980dc27d148b8941cb9820f182c1619478120bdae03512',
    image: '/src/assets/images/property_bengaluru_estate_1790929235008.jpg',
    documents: [
      {
        id: 'DOC-3001',
        name: 'BBMP A-Khata Certificate & Registered Deed',
        type: 'Mutation Certificate',
        ipfsCid: 'bafybeidb3l2n5y6xztg8h7v6c5b4n3m2l1k0j9h8g7f6d5s4a3p2o1i9u',
        sha256Hash: '0x15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225',
        fileSize: '5.2 MB',
        uploadDate: '2025-08-10',
        verificationStatus: 'verified',
        verifiedBy: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        verifiedAt: '2025-08-12T09:20:00Z'
      }
    ]
  },
  {
    id: 'PROP-004',
    title: 'Deccan Agri-Tech Logistics Park',
    surveyNumber: 'SRV-MH-SOL-319/2',
    propertyType: 'Industrial',
    address: 'National Highway 65 Industrial Hub, Solapur',
    city: 'Solapur',
    state: 'Maharashtra',
    district: 'Solapur',
    pinCode: '413006',
    areaSqFt: 18500,
    landType: 'Industrial Converted Zone',
    coordinates: { lat: 17.6599, lng: 75.9064 },
    currentOwnerAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    ownershipType: 'Corporate Title',
    registrationDate: '2026-02-15',
    status: 'verified',
    governmentRegistrationRef: 'IGR-MH-2026-033104',
    valuationInINR: 42000000,
    valuationInMATIC: 62500,
    isTokenized: false,
    image: '/src/assets/images/hero_property_cadastral_1790929046782.jpg',
    documents: [
      {
        id: 'DOC-4001',
        name: 'MIDC Industrial Land Allotment Letter',
        type: 'Sale Deed',
        ipfsCid: 'bafybeib7g6f5e4d3c2b1a0z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3h',
        sha256Hash: '0x8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
        fileSize: '6.7 MB',
        uploadDate: '2026-02-15',
        verificationStatus: 'verified',
        verifiedBy: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        verifiedAt: '2026-02-18T14:10:00Z'
      }
    ]
  }
];

export const INITIAL_TRANSFERS: TransferRequest[] = [
  {
    id: 'TRX-REQ-802',
    propertyId: 'PROP-001',
    propertyTitle: 'The Orchard Estate Villa',
    sellerAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    buyerAddress: '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9',
    agreedPriceINR: 32500000,
    agreedPriceMATIC: 48500,
    platformFeeMATIC: 485,
    escrowAmountMATIC: 48985,
    status: 'under_review',
    escrowState: 'payment_locked',
    createdAt: '2026-03-24T14:20:00Z',
    updatedAt: '2026-03-25T09:40:00Z',
    tokenId: '1042',
    txHash: '0x49f9810a9058b827dfec9642018836511b988f00127ca98218520bfd6725891a',
  },
  {
    id: 'TRX-REQ-791',
    propertyId: 'PROP-003',
    propertyTitle: 'Serene Hills Eco Villa & Grounds',
    sellerAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    buyerAddress: '0x83216Ac9d048fB0762E4968C4a086B1a792E72F4',
    agreedPriceINR: 24500000,
    agreedPriceMATIC: 36500,
    platformFeeMATIC: 365,
    escrowAmountMATIC: 36865,
    status: 'completed',
    escrowState: 'payment_released',
    createdAt: '2025-12-01T11:00:00Z',
    updatedAt: '2025-12-05T16:30:00Z',
    tokenId: '1057',
    officerApprovalAddress: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    txHash: '0x7bc89104081efb0108392186938b8128919f187a64917416bcba810012d4889c',
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'EVT-9008',
    propertyId: 'PROP-001',
    eventType: 'TransferRequested',
    actorAddress: '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9',
    role: 'Buyer',
    timestamp: '2026-03-24T14:20:00Z',
    blockNumber: 15489021,
    txHash: '0x49f9810a9058b827dfec9642018836511b988f00127ca98218520bfd6725891a',
    details: 'Initiated formal purchase escrow of 48,985 MATIC for token #1042.'
  },
  {
    id: 'EVT-9007',
    propertyId: 'PROP-001',
    eventType: 'NFTMinted',
    actorAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    role: 'Owner',
    timestamp: '2025-11-17T15:45:00Z',
    blockNumber: 14892015,
    txHash: '0x82ab6182c499fe18206d87192305ca7b9319de8215984210bc6a9812401827a5',
    details: 'Minted ERC-721 token #1042 representing Cadastral Record PROP-001.'
  },
  {
    id: 'EVT-9006',
    propertyId: 'PROP-001',
    eventType: 'PropertyApproved',
    actorAddress: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    role: 'Government Registrar',
    timestamp: '2025-11-16T12:00:00Z',
    blockNumber: 14890112,
    txHash: '0x1a82bc994017f8a91bc740156bb928174501ba83017fa78b2735160ab18d891b',
    details: 'Sub-Registrar verified deeds, boundaries and signed approval on Polygon state.'
  },
  {
    id: 'EVT-9005',
    propertyId: 'PROP-001',
    eventType: 'DocumentVerified',
    actorAddress: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    role: 'Government Registrar',
    timestamp: '2025-11-16T10:30:00Z',
    blockNumber: 14889890,
    txHash: '0x6e78912bc0915ab72109ba471629810afb0231889c1048b172a819c90471b023',
    details: 'Sale deed IPFS CID hash matched against state cadastral repository.'
  },
  {
    id: 'EVT-9004',
    propertyId: 'PROP-001',
    eventType: 'PropertyRegistered',
    actorAddress: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    role: 'Owner',
    timestamp: '2025-11-14T09:15:00Z',
    blockNumber: 14882100,
    txHash: '0x99a18206d87192305ca7b9319de8215984210bc6a9812401827a582ab6182c4',
    details: 'Applicant submitted initial cadastral parcel registration for Pune Survey 402/1A.'
  },
  {
    id: 'EVT-9003',
    propertyId: 'PROP-004',
    eventType: 'PropertyApproved',
    actorAddress: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    role: 'Government Registrar',
    timestamp: '2026-02-18T14:10:00Z',
    blockNumber: 15214002,
    txHash: '0x5391ab20914bc87129580a1b8745c10294876b5091726a804918e76290141a27',
    details: 'Industrial plot verified and sanctioned for tokenization pipeline.'
  }
];

export const INITIAL_TRANSACTIONS: BlockchainTx[] = [
  {
    hash: '0x82ab6182c499fe18206d87192305ca7b9319de8215984210bc6a9812401827a5',
    blockNumber: 14892015,
    timestamp: '2025-11-17T15:45:00Z',
    status: 'confirmed',
    from: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    to: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    contractAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    gasUsed: '142,850 units (62%)',
    gasFeeMATIC: '0.00428 MATIC',
    network: 'Polygon Amoy Testnet (80002)',
    functionName: 'mintPropertyNFT(string propertyId, string ipfsMetadataURI)',
    eventLogs: [
      { name: 'Transfer', data: { from: '0x0000000000000000000000000000000000000000', to: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1', tokenId: 1042 } },
      { name: 'PropertyTokenized', data: { propertyId: 'PROP-001', tokenId: 1042, timestamp: 1763394300 } }
    ]
  },
  {
    hash: '0x49f9810a9058b827dfec9642018836511b988f00127ca98218520bfd6725891a',
    blockNumber: 15489021,
    timestamp: '2026-03-24T14:20:00Z',
    status: 'confirmed',
    from: '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9',
    to: '0x610178dA211FEF7E417bC0e6FeD39F05609AD788',
    contractAddress: '0x610178dA211FEF7E417bC0e6FeD39F05609AD788',
    gasUsed: '188,410 units (74%)',
    gasFeeMATIC: '0.00565 MATIC',
    network: 'Polygon Amoy Testnet (80002)',
    functionName: 'depositEscrow(uint256 tokenId, uint256 agreedPrice)',
    eventLogs: [
      { name: 'EscrowLocked', data: { escrowId: 'TRX-REQ-802', buyer: '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9', amount: '48985000000000000000000' } }
    ]
  },
  {
    hash: '0x1a82bc994017f8a91bc740156bb928174501ba83017fa78b2735160ab18d891b',
    blockNumber: 14890112,
    timestamp: '2025-11-16T12:00:00Z',
    status: 'confirmed',
    from: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    to: '0x3F95C401fD1865c37E175bB88e6C503e19E923a1',
    contractAddress: '0x3F95C401fD1865c37E175bB88e6C503e19E923a1',
    gasUsed: '89,400 units (48%)',
    gasFeeMATIC: '0.00268 MATIC',
    network: 'Polygon Amoy Testnet (80002)',
    functionName: 'approvePropertyRegistration(string propertyId, string registrarCertHash)',
    eventLogs: [
      { name: 'RegistrationApproved', data: { propertyId: 'PROP-001', registrar: '0xAB309F14a601569BdB21E885B9E780c109A0191D' } }
    ]
  }
];

export const FRAUD_CHECKS: Record<string, FraudCheckReport> = {
  'PROP-001': {
    propertyId: 'PROP-001',
    surveyNumber: 'SRV-MH-PUN-402/1A',
    isUniquePropertyId: true,
    isUniqueSurveyNumber: true,
    ownerWalletValid: true,
    documentsVerified: true,
    previousOwnershipClean: true,
    nftUnique: true,
    conflictDetected: false,
    lastAudited: '2026-03-24T14:25:00Z',
  },
  'PROP-002': {
    propertyId: 'PROP-002',
    surveyNumber: 'SRV-MH-MUM-891/4C',
    isUniquePropertyId: true,
    isUniqueSurveyNumber: true,
    ownerWalletValid: true,
    documentsVerified: false,
    previousOwnershipClean: true,
    nftUnique: true,
    conflictDetected: false,
    lastAudited: '2026-03-20T10:00:00Z',
  }
};
