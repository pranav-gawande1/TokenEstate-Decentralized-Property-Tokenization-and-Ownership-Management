import React from 'react';
import type { EscrowState } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck, Lock, Unlock, Layers } from 'lucide-react';

export const EscrowStatusCard: React.FC<{
  state: EscrowState;
  amountMATIC: number;
  platformFeeMATIC: number;
}> = ({ state, amountMATIC, platformFeeMATIC }) => {
  const steps: { key: EscrowState; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'payment_pending',
      title: 'Payment Deposit',
      desc: 'Buyer commits funds to smart contract',
      icon: <Lock className="w-4 h-4" />,
    },
    {
      key: 'payment_locked',
      title: 'Escrow Locked',
      desc: 'Tokens secured in multi-sig custody',
      icon: <Lock className="w-4 h-4" />,
    },
    {
      key: 'verification_pending',
      title: 'Registrar Review',
      desc: 'Officer examines encumbrances & title',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      key: 'transfer_approved',
      title: 'Transfer Sanctioned',
      desc: 'Sub-registrar signs clearance',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      key: 'nft_transferred',
      title: 'NFT Relayed',
      desc: 'ERC-721 conveyed to buyer wallet',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      key: 'payment_released',
      title: 'Settled',
      desc: 'Escrow proceeds released to seller',
      icon: <Unlock className="w-4 h-4" />,
    },
  ];

  const order = [
    'payment_pending',
    'payment_locked',
    'verification_pending',
    'transfer_approved',
    'nft_transferred',
    'payment_released',
  ];

  const currentIdx = order.indexOf(state);

  return (
    <Card>
      <CardHeader
        title="Smart Contract Multi-Sig Escrow Mechanism"
        subtitle="Automated funds lock-in and conditional settlement governed by Polygon smart contract."
        action={
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Escrow Value</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {(amountMATIC + platformFeeMATIC).toLocaleString()} MATIC
            </span>
          </div>
        }
      />
      <CardContent>
        {/* Horizontal Visual Step Machine */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((st, i) => {
            const isCompleted = currentIdx > i || state === 'payment_released';
            const isCurrent = currentIdx === i && state !== 'payment_released';

            return (
              <div
                key={st.key}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950 shadow-xs'
                    : isCurrent
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/30 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCurrent ? <Loader2 className="w-4 h-4 animate-spin" /> : st.icon}
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`}>0{i + 1}</span>
                </div>

                <p className="font-bold text-slate-900 line-clamp-1">{st.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Escrow Financial Ledger Breakdown */}
        <div className="mt-5 p-5 bg-gradient-to-br from-[#0B132B] via-[#101A38] to-[#0A1128] text-white rounded-2xl border border-slate-800 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Agreed Purchase Value</span>
            <span className="font-mono font-bold text-white text-sm tabular-nums">
              {amountMATIC.toLocaleString()} MATIC
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Protocol Escrow Fee (1%)</span>
            <span className="font-mono font-medium text-slate-300 tabular-nums">
              {platformFeeMATIC.toLocaleString()} MATIC
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Locked in Custody</span>
            <span className="font-mono font-bold text-cyan-300 text-sm tabular-nums">
              {(amountMATIC + platformFeeMATIC).toLocaleString()} MATIC
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Release Condition</span>
            <span className="font-medium text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Sub-Registrar Sanction
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
