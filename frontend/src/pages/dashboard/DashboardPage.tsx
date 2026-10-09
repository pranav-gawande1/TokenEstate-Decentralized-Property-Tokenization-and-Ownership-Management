import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { propertyService } from '../../services/blockchain/propertyService';
import { transferService } from '../../services/blockchain/transferService';
import { auditService } from '../../services/blockchain/auditService';
import type { Property, TransferRequest, AuditEvent } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import {
  Building2,
  ShieldCheck,
  Layers,
  ArrowRightLeft,
  PlusCircle,
  Clock,
  ArrowRight,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { wallet, role, currentRoleInfo } = useWallet();
  const [properties, setProperties] = useState<Property[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const allProps = await propertyService.getAllProperties();
      console.log("Data: ", allProps)
      setProperties(allProps);
      setTransfers(transferService.getAllTransfers());
      setRecentAudits(auditService.getAllEvents().slice(0, 5));
      setIsLoading(false);
    };

    load();
    const unsubTrans = transferService.subscribe(load);
    const unsubAudit = auditService.subscribe(load);

    return () => {
      unsubTrans();
      unsubAudit();
    };
  }, []);

  const totalRegistered = properties.length;
  const totalVerified = properties.filter(p => p.status === 'verified' || p.status === 'tokenized').length;
  const totalTokenized = properties.filter(p => p.isTokenized).length;
  const pendingTransfers = transfers.filter(t => t.status === 'under_review' || t.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Role Greeting */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0B132B] via-[#101A38] to-[#080E20] text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-md">
        {/* Subtle geometric cadastral background accents */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px)',
            backgroundSize: '24px 24px, 48px 48px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-950/80 text-blue-300 border border-blue-800/60 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Polygon Amoy State Machine Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentRoleInfo.name}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <span>Authority: <strong className="text-white font-medium">{currentRoleInfo.label}</strong></span>
              <span className="text-slate-600">·</span>
              <span className="font-mono text-slate-400">{wallet.address?.slice(0, 10)}...{wallet.address?.slice(-6)}</span>
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2.5">
            <Link to="/properties/register">
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Register Land Parcel
              </Button>
            </Link>
            {role === 'officer' && (
              <Link to="/government/registrations">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60"
                  leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
                >
                  Registrar Queue
                </Button>
              </Link>
            )}
            <Link to="/verification/qr">
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700"
              >
                Verify Pass
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top Metric Cards - Rich and Color-Coded */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Registered Parcels */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 border-t-4 border-t-blue-600 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Registered Parcels</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">{totalRegistered}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-blue-700 mt-2 font-medium">
            <span>● Smart Contract State</span>
          </div>
        </div>

        {/* Verified Records */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 border-t-4 border-t-emerald-600 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Verified Titles</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono tabular-nums">{totalVerified}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-2 font-medium">
            <span>✓ Sub-Registrar Sanctioned</span>
          </div>
        </div>

        {/* Tokenized Properties */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 border-t-4 border-t-purple-600 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">Tokenized Parcels</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-700 font-mono tabular-nums">{totalTokenized}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-purple-700 mt-2 font-medium">
            <span>● ERC-721 Active Deeds</span>
          </div>
        </div>

        {/* Pending Transfers / Escrow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 border-t-4 border-t-amber-500 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">In Escrow Custody</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono tabular-nums">{pendingTransfers}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 mt-2 font-medium">
            <span>⏱ Multi-Sig Locked Funds</span>
          </div>
        </div>
      </div>

      {/* Role-Specific Alert Banner */}
      {role === 'officer' && (
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-900">Government Registrar Action Required</p>
              <p className="text-emerald-800">
                You have pending cadastral intake dossiers awaiting physical survey concordance and digital signature.
              </p>
            </div>
          </div>
          <Link to="/government/registrations">
            <Button variant="success" size="sm">
              Review Queue
            </Button>
          </Link>
        </div>
      )}

      {/* My Properties & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Properties Grid Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Registered Cadastral Parcels
            </h2>
            <Link to="/properties" className="text-xs font-semibold text-slate-800 hover:underline flex items-center gap-1">
              View All ({properties.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.slice(0, 4).map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>

        {/* Right Activity & Escrow Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Escrow Requests */}
          <Card>
            <CardHeader
              title="Escrow Transfers"
              subtitle="Current settlement state"
              action={
                <Link to="/transfers" className="text-xs font-semibold text-slate-800 hover:underline">
                  All
                </Link>
              }
            />
            <CardContent className="space-y-3">
              {transfers.slice(0, 3).map(tr => (
                <div key={tr.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900">{tr.id}</span>
                    <StatusBadge status={tr.escrowState} />
                  </div>
                  <p className="font-medium text-slate-800 truncate">{tr.propertyTitle}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>{tr.agreedPriceMATIC.toLocaleString()} MATIC</span>
                    <Link to={`/transfers/${tr.id}`} className="text-slate-900 font-semibold hover:underline">
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Blockchain Audit Log Stream */}
          <Card>
            <CardHeader
              title="Immutable Event Stream"
              subtitle="Latest consensus block emissions"
              action={
                <Link to="/audit" className="text-xs font-semibold text-slate-800 hover:underline">
                  Audit
                </Link>
              }
            />
            <CardContent className="space-y-3">
              {recentAudits.map(evt => (
                <div key={evt.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-800">{evt.eventType}</span>
                    <span className="font-mono">#{evt.blockNumber}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed text-[11px]">{evt.details}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <HashDisplay hash={evt.txHash} truncateLength={4} showExplorerLink={false} />
                    <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
