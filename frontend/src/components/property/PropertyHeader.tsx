import React from 'react';
import type { Property } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { AddressDisplay } from '../ui/AddressDisplay';
import { MapPin, Building, Calendar, Layers, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import samplePropertyImage from '../../assets/images/property_bengaluru_estate_1790929235008.jpg';

export const PropertyHeader: React.FC<{
  property: Property;
  actions?: React.ReactNode;
}> = ({ property, actions }) => {
  return (
    <div className="bg-gradient-to-br from-[#0B132B] via-[#101A38] to-[#080E20] text-white rounded-2xl border border-slate-800 p-6 md:p-7 shadow-md relative overflow-hidden">
      {/* Subtle blueprint grid accents */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-700/80 shrink-0 shadow-md bg-slate-900">
            <img
              src={property.image || samplePropertyImage}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = samplePropertyImage;
              }}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded">
                {property.id}
              </span>
              <span>·</span>
              <span className="text-slate-300">Survey {property.surveyNumber}</span>
              <span>·</span>
              <span className="text-slate-400 font-mono">Ref: {property.governmentRegistrationRef}</span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              {property.title}
            </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              {property.address}, {property.city}, {property.state} - {property.pinCode}
            </span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              {property.propertyType}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Registered {property.registrationDate}
            </span>
          </div>
        </div>
      </div>

        <div className="flex flex-wrap items-center gap-2 md:self-start">
          <StatusBadge status={property.status} size="md" />
          {property.isTokenized && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-purple-950/80 text-purple-200 border border-purple-800/80 px-2.5 py-1 rounded shadow-inner">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              NFT #{property.tokenId}
            </span>
          )}
          {actions}
        </div>
      </div>

      {/* Meta Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        <div>
          <p className="text-slate-400 font-medium">Recorded Owner</p>
          <div className="mt-1">
            <AddressDisplay address={property.currentOwnerAddress} truncateLength={4} showExplorerLink />
          </div>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Total Area</p>
          <p className="font-bold text-white tabular-nums text-sm mt-1">
            {property.areaSqFt.toLocaleString()} sq.ft
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Government Valuation</p>
          <p className="font-bold text-white tabular-nums text-sm mt-1 font-mono">
            ₹{(property.valuationInINR).toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">Smart Contract State</p>
          <p className="font-semibold tabular-nums mt-1 flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Polygon Verified
          </p>
        </div>
      </div>
    </div>
  );
};
