import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/blockchain/propertyService';
import type { Property, FraudCheckReport } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Scale,
  Search,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FraudDetectionPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reports, setReports] = useState<Record<string, FraudCheckReport>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState<string>('PROP-001');

  const runAuditScan = async () => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 600));

    const all = await propertyService.getAllProperties();
    setProperties(all);

    const checkMap: Record<string, FraudCheckReport> = {};
    const seenSurveys = new Set<string>();

    all.forEach(p => {
      const isDuplicateSurvey = seenSurveys.has(p.surveyNumber.toLowerCase());
      seenSurveys.add(p.surveyNumber.toLowerCase());

      const report = propertyService.getFraudReport(p.id);
      if (isDuplicateSurvey) {
        checkMap[p.id] = {
          ...report,
          isUniqueSurveyNumber: false,
          conflictDetected: true,
          conflictReason: 'Potential Duplicate Survey: Survey number already associated with another registered parcel in this taluka ledger.',
        };
      } else {
        checkMap[p.id] = report;
      }
    });

    setReports(checkMap);
    setIsScanning(false);
  };

  useEffect(() => {
    runAuditScan();
  }, []);

  const currentReport = reports[selectedPropId] || {
    propertyId: selectedPropId,
    surveyNumber: 'SRV-MH-PUN-402/1A',
    isUniquePropertyId: true,
    isUniqueSurveyNumber: true,
    ownerWalletValid: true,
    documentsVerified: true,
    previousOwnershipClean: true,
    nftUnique: true,
    conflictDetected: false,
    lastAudited: new Date().toISOString(),
  };

  const selectedProp = properties.find(p => p.id === selectedPropId);

  const checks = [
    { label: 'Property ID Ledger Integrity', status: currentReport.isUniquePropertyId, note: 'Unique primary identifier in smart contract registry' },
    { label: 'Revenue Survey Number Concordance', status: currentReport.isUniqueSurveyNumber, note: 'No overlapping boundary or duplicate cadastral index' },
    { label: 'Beneficiary Wallet Cryptographic Signature', status: currentReport.ownerWalletValid, note: 'Valid EIP-712 non-repudiation signature on record' },
    { label: 'Deed Checksums (SHA-256 vs IPFS)', status: currentReport.documentsVerified, note: 'All attached legal instruments match unaltered hashes' },
    { label: 'Chain of Title & Encumbrance Caveats', status: currentReport.previousOwnershipClean, note: 'No conflicting transfers or active lis pendens' },
    { label: 'EIP-721 Digital Token Singularity', status: currentReport.nftUnique, note: 'Token ID mapped strictly 1:1 with cadastral parcel' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span>Cadastral Compliance & Heuristic Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Fraud, Duplicate & Boundary Conflict Detection
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated consensus heuristics auditing double-registrations, conflicting survey polygons, and deed tampering.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={runAuditScan}
          isLoading={isScanning}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Re-Run Heuristic Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Property List for Audit */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              title="Audited Parcels Ledger"
              subtitle="Select a property to view heuristic integrity check"
            />
            <CardContent className="space-y-2">
              {properties.map(p => {
                const rep = reports[p.id];
                const hasConflict = rep?.conflictDetected;
                const isSelected = p.id === selectedPropId;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPropId(p.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">{p.id}</span>
                        <span className="text-[11px] text-slate-500 font-mono">Survey {p.surveyNumber}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-0.5">{p.title}</p>
                    </div>

                    <div>
                      {hasConflict ? (
                        <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          Conflict
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Passed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Check Results */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader
              title={`Integrity Report: ${selectedProp?.title || selectedPropId}`}
              subtitle={`Survey: ${selectedProp?.surveyNumber} · Last Audited: ${new Date(currentReport.lastAudited).toLocaleTimeString()}`}
              action={
                currentReport.conflictDetected ? (
                  <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                    Discrepancy Detected
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    All 6 Heuristics Passed
                  </span>
                )
              }
            />
            <CardContent className="space-y-4">
              {currentReport.conflictDetected && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Potential Conflict Detected</span>
                  </div>
                  <p className="text-red-800">{currentReport.conflictReason}</p>
                  <div className="pt-2">
                    <Link to={`/properties/${selectedPropId}`}>
                      <Button variant="danger" size="sm">
                        Review Conflicting Records
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="space-y-2 text-xs">
                {checks.map((chk, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-lg border border-slate-200 flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{chk.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{chk.note}</p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {chk.status ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Passed
                        </span>
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Under Review
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Statutory Legal Boundary Notice */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700 block">
                  Heuristic Scope & Limitations Notice
                </span>
                <p className="text-[11px] leading-relaxed">
                  Blockchain integrity checks detect digital duplication, cryptographic hash alterations, and smart contract ownership discrepancies. Blockchain consensus does not substitute for on-the-ground physical boundary demarcations, physical surveyor benchmarks, or testamentary disputes pending in revenue civil courts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
