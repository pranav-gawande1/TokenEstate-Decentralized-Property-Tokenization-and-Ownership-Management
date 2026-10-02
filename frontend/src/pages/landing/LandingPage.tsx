import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  ShieldCheck,
  FileCheck2,
  Layers,
  ArrowRightLeft,
  QrCode,
  FileSearch,
  Database,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Building,
  Scale,
  Cpu,
} from 'lucide-react';
import { NFTPropertyCard } from '../../components/nft/NFTPropertyCard';
import { INITIAL_PROPERTIES } from '../../services/mockData';
import { APP_CONFIG } from '../../constants';

export const LandingPage: React.FC = () => {
  const sampleTokenized = INITIAL_PROPERTIES[0];

  const trustMetrics = [
    { label: 'Blockchain Network', value: 'Polygon Amoy', sub: 'EVM State Machine' },
    { label: 'Storage Standard', value: 'IPFS / CIDv1', sub: 'Content Addressable' },
    { label: 'Title Deed Standard', value: 'ERC-721', sub: 'Cadastral Tokenization' },
    { label: 'Integrity Protocol', value: 'SHA-256', sub: 'Deed Checksums' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Register Property',
      desc: 'Applicant records cadastral survey numbers, GPS coordinates, and owner wallet identity.',
    },
    {
      num: '02',
      title: 'Upload Documents',
      desc: 'Sale deeds, 7/12 extracts, and maps are cryptographically hashed and pinned to IPFS nodes.',
    },
    {
      num: '03',
      title: 'Government Verification',
      desc: 'Sub-registrar inspects encumbrances, validates deeds, and issues an on-chain approval signature.',
    },
    {
      num: '04',
      title: 'Tokenize Property',
      desc: 'An ERC-721 NFT is minted to the owner wallet representing the official digital parcel record.',
    },
    {
      num: '05',
      title: 'Transfer Ownership',
      desc: 'Multi-sig smart contract escrow locks buyer consideration and conveys title upon registrar sanction.',
    },
  ];

  const coreFeatures = [
    {
      title: 'Property Registration',
      desc: 'Comprehensive multi-step cadastral parcel intake covering revenue survey numbers, boundary coordinates, and ownership types.',
      icon: <Building className="w-5 h-5 text-slate-700" />,
      link: '/properties/register',
    },
    {
      title: 'Government Verification',
      desc: 'Sub-registrar dashboard for cross-referencing state revenue archives, checking duplicate caveats, and signing approvals on Polygon.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      link: '/government/registrations',
    },
    {
      title: 'IPFS Document Storage',
      desc: 'Permanent, decentralized deed and survey map archiving with content-addressed CIDv1 representations.',
      icon: <Database className="w-5 h-5 text-blue-700" />,
      link: '/documents',
    },
    {
      title: 'Document Hash Verification',
      desc: 'Client-side Web Crypto SHA-256 calculation allowing anyone to verify whether a physical document has been tampered with.',
      icon: <FileSearch className="w-5 h-5 text-slate-700" />,
      link: '/verification/document',
    },
    {
      title: 'Property Tokenization',
      desc: 'Converts sanctioned municipal land records into tamper-evident ERC-721 non-fungible tokens with full metadata schema.',
      icon: <Layers className="w-5 h-5 text-purple-700" />,
      link: '/tokenization',
    },
    {
      title: 'Smart Contract Escrow',
      desc: 'Conditional multi-sig escrow protocol locking buyer consideration until statutory registrar conveyancing approval.',
      icon: <Lock className="w-5 h-5 text-amber-700" />,
      link: '/transfers',
    },
    {
      title: 'Chain of Title History',
      desc: 'Unbroken chronologies of all registration, validation, certification, and transfer transactions recorded on-chain.',
      icon: <ArrowRightLeft className="w-5 h-5 text-slate-700" />,
      link: '/audit',
    },
    {
      title: 'QR Cadastral Verification',
      desc: 'Instant field verification for banking institutions, buyers, and legal surveyors via cryptographically signed QR codes.',
      icon: <QrCode className="w-5 h-5 text-slate-700" />,
      link: '/verification/qr',
    },
    {
      title: 'Fraud & Conflict Detection',
      desc: 'Automated heuristics scanning double-registrations, overlapping survey numbers, and unauthorized transfers.',
      icon: <Scale className="w-5 h-5 text-red-700" />,
      link: '/admin/fraud-detection',
    },
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section with Deep Midnight Blue Architecture */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#101C42] to-[#0A1128] text-white py-16 md:py-24 border-b border-slate-800">
        {/* Subtle holographic grid mesh */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px)',
            backgroundSize: '32px 32px, 64px 64px',
            backgroundPosition: '0 0, 16px 16px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-3 py-1 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Polygon EVM Cadastral State Machine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance leading-[1.15]">
                Trust Every Property. <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Verify Every Record.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                A blockchain-powered platform for secure property registration, document verification, tokenized ownership, and transparent ownership history.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/properties/register">
                  <Button variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-500 text-white shadow-md border-0" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Register a Property
                  </Button>
                </Link>
                <Link to="/verification/qr">
                  <Button variant="outline" size="lg" className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700">
                    Verify a Property
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-slate-800/50">
                    Explore Marketplace
                  </Button>
                </Link>
              </div>

              {/* Proof Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
                {trustMetrics.map((m, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <p className="font-bold text-white font-mono text-sm">{m.value}</p>
                    <p className="text-slate-300 font-medium mt-0.5">{m.label}</p>
                    <p className="text-[11px] text-slate-400">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-700 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xs">
                <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-950 relative border border-slate-800">
                  <img
                    src="/src/assets/images/hero_property_cadastral_1790929046782.jpg"
                    alt="Cadastral Land Parcel Blueprint"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">
                        Polygon Amoy #15489021
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Consensus Verified
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold mt-2 text-white">
                      Maharashtra Cadastral Zone 4 · Survey 402/1A
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      0x7f83b1657ff1fc53b92dc18148a1d65d...
                    </p>
                  </div>
                </div>

                {/* Floating verified badge */}
                <div className="p-4 bg-slate-950/90 rounded-xl mt-3 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-white">Cadastral Deed Authenticated</p>
                    <p className="text-[11px] text-slate-400">Government Sub-Registrar Digital Signature</p>
                  </div>
                  <Link
                    to="/verification/document"
                    className="font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Verify <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Operational Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            How Cadastral Tokenization Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A 5-stage sovereign verification lifecycle connecting physical revenue deeds to decentralized tokenized assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div
              key={st.num}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xl font-bold text-slate-300 block mb-2">
                  {st.num}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Stage {i + 1}</span>
                {i < 4 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Built for Institutional Trust & Legal Integrity
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered specifically for government land departments, financial institutions, and property buyers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={feat.link}
                  className="text-xs font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
                >
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blockchain Architecture Visual Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Technical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              End-to-End Decentralized Execution Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Separation of concerns between client state, EVM contract execution, and off-chain content-addressed IPFS storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Pipeline 1: Wallet & Smart Contracts */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase">
                Consensus & Token State Pipeline
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>01. User / Officer Wallet</span>
                  <span className="text-slate-400">MetaMask EIP-712</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>02. Web3 Client Engine</span>
                  <span className="text-slate-400">Ethers.js / Viem</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>03. LandRegistry & Escrow Contracts</span>
                  <span className="text-slate-400">Solidity 0.8.20</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between text-emerald-400">
                  <span>04. Polygon Network Consensus</span>
                  <span>Amoy State Root</span>
                </div>
              </div>
            </div>

            {/* Pipeline 2: Document & IPFS */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h3 className="text-xs font-mono font-bold text-blue-400 uppercase">
                IPFS Document Provenance Pipeline
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>01. Land Deeds & Survey Maps</span>
                  <span className="text-slate-400">PDF / TIFF Binary</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>02. Cryptographic Digest</span>
                  <span className="text-slate-400">SHA-256 Checksum</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>03. InterPlanetary File System</span>
                  <span className="text-slate-400">Pinned CIDv1</span>
                </div>
                <div className="text-center text-slate-500">↓</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between text-blue-400">
                  <span>04. On-Chain Immutability</span>
                  <span>Contract Hash Reference</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tokenized NFT Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tokenized Parcel Sample
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              ERC-721 Digital Cadastral Deed
            </h2>
          </div>
          <Link to="/marketplace">
            <Button variant="outline" size="sm">
              View All Tokenized Properties
            </Button>
          </Link>
        </div>

        <NFTPropertyCard property={sampleTokenized} />
      </section>

      {/* Security & Cryptographic Rigor */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-100 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Cryptographic Signatures</h3>
            <p className="text-slate-600 leading-relaxed">
              Every deed certification and title transfer requires an authorized private key signature verified by EVM consensus.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Multi-Sig Escrow Custody</h3>
            <p className="text-slate-600 leading-relaxed">
              Consideration remains locked in smart escrow contracts until both counterparty agreements and registrar sanctions are finalized.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Non-Repudiation Audit Logs</h3>
            <p className="text-slate-600 leading-relaxed">
              Every action emits an immutable transaction log indexed across block headers, creating an indelible historical record.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
