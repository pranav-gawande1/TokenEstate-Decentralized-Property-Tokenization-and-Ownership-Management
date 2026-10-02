export const APP_CONFIG = {
  appName: 'Cadastra Web3',
  tagline: 'Trust Every Property. Verify Every Record.',
  legalDisclaimer: 'Blockchain records provide a tamper-evident digital record of registered actions and ownership representations within the platform. Legal ownership of real-world property remains subject to applicable laws, government records, and authorized legal processes.',
  
  // Blockchain Network Config
  network: {
    name: 'Polygon Amoy Testnet',
    chainId: 80002,
    currencySymbol: 'POL / MATIC',
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
  },

  // Smart Contract Architecture
  contracts: {
    landRegistry: '0x3F95C401fD1865c37E175bB88e6C503e19E923a1',
    propertyNFT: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    escrowManager: '0x610178dA211FEF7E417bC0e6FeD39F05609AD788',
    auditLogger: '0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968',
  },

  ipfsGateway: 'https://ipfs.io/ipfs',
};

export const DEMO_WALLETS = {
  owner: {
    address: '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    label: 'Citizen / Property Owner',
    role: 'owner' as const,
    name: 'Vikramaditya Deshmukh',
    balance: '42.85 MATIC',
  },
  buyer: {
    address: '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9',
    label: 'Prospective Buyer / Investor',
    role: 'buyer' as const,
    name: 'Ananya Singhania',
    balance: '120.50 MATIC',
  },
  officer: {
    address: '0xAB309F14a601569BdB21E885B9E780c109A0191D',
    label: 'Government Registrar / Officer',
    role: 'officer' as const,
    name: 'Inspector Rajesh Kulkarni (Haveli District)',
    department: 'Department of Land Resources & Registration',
    balance: '15.20 MATIC',
  },
  auditor: {
    address: '0x5C808169A64Bbe156108166D1B28389369C97A14',
    label: 'Compliance Officer / Auditor',
    role: 'auditor' as const,
    name: 'Cadastral Oversight Directorate',
    balance: '8.40 MATIC',
  },
};
