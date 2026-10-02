import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { propertyService } from '../../services/blockchain/propertyService';
import type { Property } from '../../types';
import { APP_CONFIG } from '../../constants';
import { QrCode, Search, CheckCircle2, ShieldCheck, AlertCircle, Camera, Upload, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QRVerificationPage: React.FC = () => {
  const [verificationId, setVerificationId] = useState('PROP-001');
  const [verifiedProperty, setVerifiedProperty] = useState<Property | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const handleVerify = async () => {
    if (!verificationId.trim()) return;
    setIsVerifying(true);
    setHasChecked(true);

    const prop = await propertyService.getPropertyById(verificationId.trim());
    setVerifiedProperty(prop);
    setIsVerifying(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Field Cadastral QR Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Instant on-site verification of property survey boundary records, digital title certificates, and current encumbrances.
        </p>
      </div>

      {/* QR Input Card */}
      <Card>
        <CardHeader
          title="Scan or Query Cadastral Verification Token"
          subtitle="Used by surveyors, revenue inspectors, mortgage appraisers, and legal counsel."
        />
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
            {/* Visual simulated QR code */}
            <div className="w-36 h-36 bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-28 h-28 text-slate-900" />
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-slate-900">
                Official Revenue Department Smart QR Pass
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan with mobile camera or enter the Cadastral Property ID directly to fetch the real-time Polygon consensus state.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Camera className="w-3.5 h-3.5" />}
                  onClick={handleVerify}
                >
                  Simulate QR Scanner
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={handleVerify}
                >
                  Upload QR Image
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              label="Cadastral Property ID or Token Identifier"
              placeholder="e.g., PROP-001 or 1042"
              value={verificationId}
              onChange={e => setVerificationId(e.target.value)}
              className="flex-1"
            />
            <div className="self-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleVerify}
                isLoading={isVerifying}
                leftIcon={<Search className="w-4 h-4" />}
              >
                Query Blockchain
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Result Card */}
      {hasChecked && (
        <Card className={verifiedProperty ? 'border-emerald-300 bg-white shadow-sm' : 'border-slate-300'}>
          {verifiedProperty ? (
            <CardContent className="space-y-6 p-6">
              {/* Green Verified Banner */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-emerald-950 uppercase tracking-wide">
                      PROPERTY VERIFIED ON POLYGON STATE
                    </h2>
                    <p className="text-xs text-emerald-800">
                      Official Cadastral Record is active, authenticated, and untampered.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded">
                  Consensus Confirmed
                </span>
              </div>

              {/* Data Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">Property Identifier</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{verifiedProperty.id}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">Revenue Survey Number</span>
                  <span className="font-mono font-bold text-slate-900">{verifiedProperty.surveyNumber}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">Blockchain Status</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified & Indexed
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">ERC-721 Digital Title</span>
                  {verifiedProperty.isTokenized ? (
                    <span className="font-mono font-bold text-purple-700">Token #{verifiedProperty.tokenId}</span>
                  ) : (
                    <span className="text-slate-500 font-medium">Eligible (Unminted)</span>
                  )}
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">Current Recorded Owner</span>
                  <AddressDisplay address={verifiedProperty.currentOwnerAddress} truncateLength={6} showExplorerLink />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-400 block">Government Approval</span>
                  <span className="text-emerald-700 font-medium">Sub-Registrar Endorsed</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Blockchain verification represents the recorded blockchain state and does not independently establish legal title. Official title conveyance is subject to municipal stamp duty, state registration acts, and statutory judicial rulings.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Link to={`/properties/${verifiedProperty.id}`}>
                  <Button variant="primary" size="sm">
                    View Full Cadastral Dossier
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-900">No Record Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active property token or cadastral record found for query "{verificationId}". Ensure the QR code was generated from an authorized platform deed.
              </p>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};
