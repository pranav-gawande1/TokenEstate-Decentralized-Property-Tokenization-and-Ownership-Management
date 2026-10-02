import React from 'react';
import type { Property } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { MapPin, Compass, FileSpreadsheet, Shield } from 'lucide-react';

export const PropertyDetails: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="space-y-6">
      {/* Cadastral Information Grid */}
      <Card>
        <CardHeader
          title="Cadastral & Land Records Specifications"
          subtitle="Immutable geographic and revenue jurisdiction metadata recorded on Polygon smart contract."
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Cadastral Survey Number</span>
              <p className="font-mono font-semibold text-slate-900 text-sm">{property.surveyNumber}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Government Registration Ref</span>
              <p className="font-mono font-medium text-slate-800">{property.governmentRegistrationRef}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Land Classification Type</span>
              <p className="font-medium text-slate-800">{property.landType}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Title Ownership Type</span>
              <p className="font-medium text-slate-800">{property.ownershipType}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">District / Sub-District</span>
              <p className="font-medium text-slate-800">{property.district}, {property.state}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">PIN / Postal Code</span>
              <p className="font-mono font-medium text-slate-800">{property.pinCode}</p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Total Boundary Area</span>
              <p className="font-semibold text-slate-900 tabular-nums">
                {property.areaSqFt.toLocaleString()} sq.ft ({(property.areaSqFt / 43560).toFixed(3)} Acres)
              </p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">GPS Coordinates</span>
              <p className="font-mono font-medium text-slate-800">
                {property.coordinates.lat.toFixed(4)}° N, {property.coordinates.lng.toFixed(4)}° E
              </p>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Equivalent Token Valuation</span>
              <p className="font-mono font-semibold text-slate-900 tabular-nums">
                {property.valuationInMATIC.toLocaleString()} MATIC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cadastral GIS & Location Visualization */}
      <Card>
        <CardHeader
          title="Cadastral Parcel Visualization & Survey Coordinates"
          subtitle="Simulated municipal GIS parcel boundary with verified satellite benchmarks."
        />
        <CardContent>
          <div className="relative rounded-lg border border-slate-200 bg-slate-100 overflow-hidden p-6 aspect-21/9 flex flex-col justify-between">
            {/* Background grid pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-200">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>Cadastral Coordinate Benchmark: Pune/Zone-4</span>
              </div>
              <span className="font-mono text-[11px] bg-slate-900 text-white px-2 py-0.5 rounded">
                Polygon Geocoded Node
              </span>
            </div>

            {/* Simulated cadastral boundary shape */}
            <div className="relative z-10 flex flex-col items-center justify-center my-4">
              <div className="w-48 h-28 border-2 border-dashed border-slate-700 bg-slate-800/5 rounded-lg flex flex-col items-center justify-center text-center p-3">
                <MapPin className="w-5 h-5 text-slate-800 mb-1" />
                <span className="text-[11px] font-semibold text-slate-900">{property.surveyNumber}</span>
                <span className="text-[10px] text-slate-500 font-mono">{property.areaSqFt} sq.ft</span>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500">
              <span>Latitude: {property.coordinates.lat}</span>
              <span>Longitude: {property.coordinates.lng}</span>
              <span>Datum: WGS84 Universal Transverse Mercator</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
