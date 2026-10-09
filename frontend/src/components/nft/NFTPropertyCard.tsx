import React from 'react';
import type { Property } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { ExplorerLink } from '../ui/ExplorerLink';
import { ShieldCheck, Layers, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import samplePropertyImage from '../../assets/images/property_bengaluru_estate_1790929235008.jpg';

export const NFTPropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual Column */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              ERC-721 Cadastral Asset
            </span>
            <span className="text-xs font-mono bg-purple-950/80 text-purple-200 border border-purple-800/80 px-2 py-0.5 rounded">
              Token #{property.tokenId || '1042'}
            </span>
          </div>

          <div className="relative z-10 my-6">
            <div className="aspect-4/3 rounded-lg overflow-hidden border border-slate-800 shadow-md bg-slate-950">
              <img
                src={property.image || samplePropertyImage}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = samplePropertyImage;
                }}
              />
            </div>
          </div>

          <div className="relative z-10 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Standard:</span>
              <span className="text-slate-200 font-mono">ERC-721 Non-Fungible Token</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Network:</span>
              <span className="text-slate-200">{APP_CONFIG.network.name}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Contract:</span>
              <span className="text-slate-200 font-mono">
                {(property.tokenContract || APP_CONFIG.contracts.propertyNFT).slice(0, 10)}...
              </span>
            </div>
          </div>
        </div>

        {/* Right Details Column */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-500">
                {property.id} · Survey {property.surveyNumber}
              </span>
              <StatusBadge status={property.status} />
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-snug">
              {property.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {property.address}, {property.city}, {property.state}
            </p>

            {/* Cadastral Specs */}
            <div className="grid grid-cols-2 gap-4 mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-400">Area</p>
                <p className="font-semibold text-slate-900 tabular-nums">
                  {property.areaSqFt.toLocaleString()} sq.ft
                </p>
              </div>
              <div>
                <p className="text-slate-400">Classification</p>
                <p className="font-semibold text-slate-900">{property.landType}</p>
              </div>
              <div>
                <p className="text-slate-400">Current Owner</p>
                <div className="mt-0.5">
                  <AddressDisplay address={property.currentOwnerAddress} truncateLength={4} showExplorerLink />
                </div>
              </div>
              <div>
                <p className="text-slate-400">Valuation</p>
                <p className="font-semibold text-slate-900 font-mono tabular-nums">
                  {property.valuationInMATIC.toLocaleString()} MATIC (₹{(property.valuationInINR / 100000).toFixed(1)}L)
                </p>
              </div>
            </div>

            {/* Verified Documents Snapshot */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Anchored Instruments ({property.documents.length})</p>
              <div className="space-y-1.5">
                {property.documents.slice(0, 2).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{doc.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">{doc.sha256Hash.slice(0, 10)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              The NFT represents the property's digital blockchain record. Legal ownership remains subject to applicable government and legal verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
