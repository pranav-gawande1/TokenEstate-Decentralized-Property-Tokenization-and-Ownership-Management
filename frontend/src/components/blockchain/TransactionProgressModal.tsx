import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { HashDisplay } from '../ui/HashDisplay';
import { ExplorerLink } from '../ui/ExplorerLink';
import { CheckCircle2, Loader2, AlertCircle, Shield } from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export type TxStep = 'preparing' | 'signing' | 'confirming' | 'confirmed' | 'failed';

interface TransactionProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: TxStep;
  txHash?: string;
  blockNumber?: number;
  title: string;
  actionDescription: string;
  errorMessage?: string;
  onSuccessDone?: () => void;
}

export const TransactionProgressModal: React.FC<TransactionProgressModalProps> = ({
  isOpen,
  onClose,
  step,
  txHash,
  blockNumber,
  title,
  actionDescription,
  errorMessage,
  onSuccessDone,
}) => {
  const stepsList = [
    { key: 'preparing', label: 'Transaction payload prepared' },
    { key: 'signing', label: 'Wallet signature requested' },
    { key: 'confirming', label: 'Waiting for Polygon block consensus' },
    { key: 'confirmed', label: 'Transaction confirmed on blockchain state' },
  ];

  const getStepStatus = (index: number) => {
    const currentIndex = ['preparing', 'signing', 'confirming', 'confirmed'].indexOf(step);
    if (step === 'failed') return 'failed';
    if (currentIndex > index) return 'completed';
    if (currentIndex === index) return 'current';
    return 'upcoming';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step === 'confirmed' || step === 'failed') onClose();
      }}
      title={title}
      subtitle={actionDescription}
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="space-y-3">
          {stepsList.map((s, idx) => {
            const status = getStepStatus(idx);
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : status === 'current' ? (
                    <Loader2 className="w-5 h-5 text-slate-800 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    status === 'completed'
                      ? 'text-slate-900 font-medium'
                      : status === 'current'
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {step === 'failed' && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Transaction Failed</p>
              <p className="mt-0.5 text-red-700">{errorMessage || 'User rejected signature or gas limit exceeded.'}</p>
            </div>
          </div>
        )}

        {step === 'confirmed' && txHash && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span>Transaction Hash</span>
              <HashDisplay hash={txHash} truncateLength={8} />
            </div>
            {blockNumber && (
              <div className="flex items-center justify-between text-slate-500">
                <span>Block Height</span>
                <span className="font-mono text-slate-800 font-medium">#{blockNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-slate-500">
              <span>Network</span>
              <span className="font-medium text-slate-800">{APP_CONFIG.network.name}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <ExplorerLink type="tx" value={txHash} label="View on PolygonScan" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          {(step === 'confirmed' || step === 'failed') && (
            <Button
              variant={step === 'confirmed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => {
                if (onSuccessDone && step === 'confirmed') onSuccessDone();
                onClose();
              }}
            >
              {step === 'confirmed' ? 'Done' : 'Close'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
