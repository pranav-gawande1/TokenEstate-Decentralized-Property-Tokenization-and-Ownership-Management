import React from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, Maximize2, ShieldCheck, ArrowRight } from 'lucide-react';
import { AddressDisplay } from '../ui/AddressDisplay';
import samplePropertyImage from '../../assets/images/property_bengaluru_estate_1790929235008.jpg';

export const PropertyCard: React.FC<{
  property: Property;
  showActions?: boolean;
}> = ({ property, showActions = true }) => {
  return (
    <div className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col">
      {/* Property Visual */}
      <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
        <img
          src={property.image || samplePropertyImage}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = samplePropertyImage;
          }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 drop-shadow-sm">
          <StatusBadge status={property.status} />
        </div>
        {property.isTokenized && (
          <div className="absolute top-3 right-3 bg-slate-950/90 text-purple-200 border border-purple-700/60 backdrop-blur-md text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold shadow-xs">
            NFT #{property.tokenId}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded text-[11px]">{property.id}</span>
            <span>·</span>
            <span className="font-mono text-slate-500 text-[11px] truncate max-w-[150px]">{property.surveyNumber}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{property.city}, {property.state}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
            <div>
              <p className="text-[11px] text-slate-500">Area</p>
              <p className="font-bold text-slate-800 tabular-nums">
                {property.areaSqFt.toLocaleString()} sq.ft
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Valuation</p>
              <p className="font-bold text-slate-900 tabular-nums font-mono">
                ₹{(property.valuationInINR / 100000).toFixed(1)} Lakh
              </p>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Owner:</span>
            <AddressDisplay address={property.currentOwnerAddress} truncateLength={3} showCopy={false} />
          </div>

          {showActions && (
            <Link
              to={`/properties/${property.id}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              <span>View Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
