import React from 'react';
import type { BlockchainTx } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { ExplorerLink } from '../ui/ExplorerLink';
import { CheckCircle2, Clock, XCircle, Code, Layers } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const BlockchainTransactionCard: React.FC<{ tx: BlockchainTx }> = ({ tx }) => {
  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <span>Transaction Details</span>
            {tx.status === 'confirmed' ? (
              <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirmed
              </span>
            ) : tx.status === 'pending' ? (
              <span className="text-xs font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </span>
            ) : (
              <span className="text-xs font-medium text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 inline-flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                Failed
              </span>
            )}
          </div>
        }
        subtitle="Cryptographic state receipt verified on Polygon Amoy testnet."
        action={<ExplorerLink type="tx" value={tx.hash} label="View on PolygonScan" />}
      />
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Transaction Hash</span>
            <HashDisplay hash={tx.hash} truncateLength={10} />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-slate-400 block">Block Height</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-sm">#{tx.blockNumber}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-mono text-[11px]">{new Date(tx.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium">Invoked Method:</span>
            <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded">
              {tx.functionName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium">Origin Address (From):</span>
            <AddressDisplay address={tx.from} truncateLength={8} showExplorerLink />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium">Smart Contract (To):</span>
            <AddressDisplay address={tx.to} truncateLength={8} showExplorerLink />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium">Network / Chain ID:</span>
            <span className="font-medium text-slate-800">{tx.network}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
            <span className="text-slate-500 font-medium">Gas Consumption & Fee:</span>
            <span className="font-mono text-slate-800">
              {tx.gasUsed} · <span className="font-bold text-slate-900">{tx.gasFeeMATIC}</span>
            </span>
          </div>
        </div>

        {/* Emitted Event Logs */}
        {tx.eventLogs && tx.eventLogs.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-slate-500" />
              Decoded Smart Contract Event Logs ({tx.eventLogs.length})
            </h4>

            <div className="space-y-2">
              {tx.eventLogs.map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>event</span>
                    <span className="text-white">{log.name}</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
