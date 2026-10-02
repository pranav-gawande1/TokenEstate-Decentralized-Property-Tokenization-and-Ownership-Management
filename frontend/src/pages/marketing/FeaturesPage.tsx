import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Building,
  ShieldCheck,
  Database,
  Layers,
  Lock,
  History,
  QrCode,
  FileSearch,
  Scale,
  ArrowRight,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: 'Decentralized Cadastral Intake',
      desc: 'Multi-step parcel intake capturing revenue survey coordinates, GIS benchmarks, and boundary polygons.',
      icon: <Building className="w-5 h-5 text-slate-700" />,
      link: '/properties/register',
    },
    {
      title: 'Sub-Registrar Officer Console',
      desc: 'Dedicated institutional portal for revenue officers to cross-reference state records and issue digital signatures.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      link: '/government/registrations',
    },
    {
      title: 'IPFS Document Provenance',
      desc: 'Permanent distributed file storage preserving stamped sale deeds and cadastral maps via content-addressed CIDs.',
      icon: <Database className="w-5 h-5 text-blue-700" />,
      link: '/documents',
    },
    {
      title: 'Client-Side SHA-256 Verification',
      desc: 'Browser-native Web Crypto hashing allowing instant detection of modified or forged deeds without server uploads.',
      icon: <FileSearch className="w-5 h-5 text-slate-700" />,
      link: '/verification/document',
    },
    {
      title: 'ERC-721 Property Tokenization',
      desc: 'Mint official non-fungible tokens mapped to surveyed land parcels adhering to standard EIP-721 metadata.',
      icon: <Layers className="w-5 h-5 text-purple-700" />,
      link: '/tokenization',
    },
    {
      title: 'Smart Multi-Sig Escrow',
      desc: 'Safely custody buyer consideration on-chain with conditional release upon registrar conveyancing sanction.',
      icon: <Lock className="w-5 h-5 text-amber-700" />,
      link: '/transfers',
    },
    {
      title: 'Heuristic Conflict & Fraud Checks',
      desc: 'Automated algorithms alerting auditors to overlapping survey boundaries or attempted double-pledging.',
      icon: <Scale className="w-5 h-5 text-red-700" />,
      link: '/admin/fraud-detection',
    },
    {
      title: 'Field QR Code Passes',
      desc: 'Cryptographically signed QR codes for instant mobile inspection by bank appraisers and legal surveyors.',
      icon: <QrCode className="w-5 h-5 text-slate-700" />,
      link: '/verification/qr',
    },
    {
      title: 'Non-Repudiation Audit Stream',
      desc: 'Exhaustive transaction history indexing every state change with gas receipts and decoded smart contract event logs.',
      icon: <History className="w-5 h-5 text-slate-700" />,
      link: '/audit',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Architecture & Specifications
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Enterprise Cadastral Features
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Comprehensive Web3 capabilities built specifically for statutory land administration and legal-grade title records.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <CardHeader
              title={
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span>{feat.title}</span>
                </div>
              }
            />
            <CardContent className="text-xs text-slate-600 leading-relaxed">
              {feat.desc}
            </CardContent>
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex justify-end">
              <Link
                to={feat.link}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 inline-flex items-center gap-1"
              >
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
