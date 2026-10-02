import React from 'react';
import type { Property } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { ExplorerLink } from '../ui/ExplorerLink';
import { UserCheck, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const PropertyOwnership: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Recorded Blockchain Title & Ownership Structure"
          subtitle="Cryptographically verified beneficiary wallet and deed concordance."
        />
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Current Registered Beneficiary</p>
                  <p className="text-sm font-semibold text-slate-900">Primary Titleholder</p>
                  <div className="mt-1">
                    <AddressDisplay address={property.currentOwnerAddress} truncateLength={6} showExplorerLink />
                  </div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-500">Title Classification</p>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">{property.ownershipType}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Registration Ref: {property.governmentRegistrationRef}</p>
              </div>
            </div>

            {/* Tokenized Title status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">ERC-721 Digital Title Deed</span>
                  {property.isTokenized ? (
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Minted & Active
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Not Tokenized
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[11px]">
                  Smart contract standard conforming to EIP-721 cadastral metadata specifications.
                </p>
                {property.isTokenized && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Token ID:</span>
                      <span className="font-bold text-slate-900">#{property.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Smart Contract:</span>
                      <AddressDisplay address={property.tokenContract || APP_CONFIG.contracts.propertyNFT} truncateLength={4} />
                    </div>
                    {property.mintTxHash && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mint Tx:</span>
                        <HashDisplay hash={property.mintTxHash} truncateLength={4} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Statutory Land Revenue Record</span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Indexed
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  State Department of Land Resources record verified with 7/12 extract / RoR concordance.
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jurisdiction:</span>
                    <span className="text-slate-800 font-medium">{property.district}, {property.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Survey No.:</span>
                    <span className="text-slate-800 font-mono font-medium">{property.surveyNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">Statutory Legal & Product Disclaimer</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {APP_CONFIG.legalDisclaimer}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
