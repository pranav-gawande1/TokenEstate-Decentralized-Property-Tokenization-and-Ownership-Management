import React from 'react';
import type { AuditEvent } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { ExplorerLink } from '../ui/ExplorerLink';
import { ShieldCheck, Layers, ArrowRightLeft, FileCheck, CheckCircle } from 'lucide-react';

export const PropertyTimeline: React.FC<{ events: AuditEvent[] }> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PropertyRegistered':
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case 'PropertyApproved':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'NFTMinted':
        return <Layers className="w-4 h-4 text-purple-600" />;
      case 'TransferRequested':
      case 'TransferApproved':
      case 'TransferCompleted':
        return <ArrowRightLeft className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <Card>
      <CardHeader
        title="Cadastral Chain of Title & Provenance Timeline"
        subtitle="Cryptographically verified chronology of all registration, certification, minting, and conveyancing events."
      />
      <CardContent>
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((evt, idx) => (
            <div key={evt.id} className="relative group">
              {/* Event node */}
              <div className="absolute -left-[27px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-slate-300 group-hover:border-slate-800 flex items-center justify-center transition-colors">
                {getEventIcon(evt.eventType)}
              </div>

              {/* Event content */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 transition-colors hover:bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {evt.eventType.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-[11px] bg-slate-200/70 text-slate-700 px-2 py-0.2 rounded font-medium">
                      {evt.role}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {evt.details}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>Actor:</span>
                    <AddressDisplay address={evt.actorAddress} truncateLength={4} showExplorerLink />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Tx Hash:</span>
                    <HashDisplay hash={evt.txHash} truncateLength={4} />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-1">
                    <span>Block #{evt.blockNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
