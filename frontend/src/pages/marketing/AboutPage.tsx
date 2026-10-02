import React from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { Building, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 sm:px-6">
      <div className="space-y-4 text-center sm:text-left">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          About Cadastra
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Next-Generation Cadastral Infrastructure
        </h1>
        <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
          Cadastra provides an institutional bridge connecting sovereign municipal revenue land records with decentralized Ethereum/Polygon smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="The Problem"
            subtitle="Legacy land record vulnerabilities"
          />
          <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Traditional paper land records and centralized siloed registry databases are vulnerable to retroactive alterations, forged mutation extracts, double-mortgaging, and fraudulent conveyance deeds.
            </p>
            <p>
              Litigation over land titles constitutes over 60% of all civil court disputes in developing economies, stalling billions of dollars in infrastructure investments.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="The Solution"
            subtitle="Cryptographic proof of provenance"
          />
          <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              By anchoring the SHA-256 cryptographic digest of physical deeds to IPFS and committing survey boundaries to the Polygon blockchain, records become tamper-evident and impossible to falsify retroactively.
            </p>
            <p>
              ERC-721 tokenization allows clear digital chain-of-custody tracking while respecting statutory legal frameworks.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statutory Legal Disclaimer */}
      <div className="p-5 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <strong className="text-slate-900 font-semibold block">Statutory Legal Framework:</strong>
        <p className="leading-relaxed">
          {APP_CONFIG.legalDisclaimer}
        </p>
      </div>

      <div className="flex justify-center sm:justify-start gap-4">
        <Link to="/properties">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Public Ledger
          </Button>
        </Link>
        <Link to="/verification/qr">
          <Button variant="outline" size="md">
            Verify a Record
          </Button>
        </Link>
      </div>
    </div>
  );
};
