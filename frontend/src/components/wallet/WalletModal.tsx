import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useWallet } from '../../context/WalletContext';
import { DEMO_WALLETS, APP_CONFIG } from '../../constants';
import type { UserRole } from '../../types';
import { Wallet, Shield, Check, ExternalLink, ArrowRight, UserCheck } from 'lucide-react';
import { AddressDisplay } from '../ui/AddressDisplay';

export const WalletModal: React.FC = () => {
  const {
    wallet,
    role,
    isWalletModalOpen,
    closeWalletModal,
    connectWallet,
    disconnectWallet,
    switchRole,
    switchNetwork,
  } = useWallet();

  const roles: { role: UserRole; title: string; desc: string; address: string }[] = [
    {
      role: 'owner',
      title: DEMO_WALLETS.owner.label,
      desc: 'Register land parcels, manage deeds, mint ERC-721 property tokens',
      address: DEMO_WALLETS.owner.address,
    },
    {
      role: 'buyer',
      title: DEMO_WALLETS.buyer.label,
      desc: 'Browse tokenized registry, initiate escrow purchase, verify provenance',
      address: DEMO_WALLETS.buyer.address,
    },
    {
      role: 'officer',
      title: DEMO_WALLETS.officer.label,
      desc: 'Review surveys & deeds, issue on-chain approval, sanction transfers',
      address: DEMO_WALLETS.officer.address,
    },
    {
      role: 'auditor',
      title: DEMO_WALLETS.auditor.label,
      desc: 'Inspect tamper-evident ledger events, fraud checks & double-registration flags',
      address: DEMO_WALLETS.auditor.address,
    },
  ];

  return (
    <Modal
      isOpen={isWalletModalOpen}
      onClose={closeWalletModal}
      title="Web3 Account & Cadastral Authority"
      subtitle="Connect a Web3 provider or select an authenticated institutional cadastral role."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {wallet.isConnected ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Connected Session
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active on Polygon Amoy
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div>
                <p className="text-xs font-semibold text-slate-900">{DEMO_WALLETS[role].name}</p>
                <div className="mt-1">
                  <AddressDisplay address={wallet.address || ''} truncateLength={6} showExplorerLink />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Balance</p>
                <p className="text-sm font-semibold font-mono text-slate-900">
                  {wallet.balanceMatic} MATIC
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-xs text-slate-600 mb-3">No Web3 wallet currently connected.</p>
            <div className="flex justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => connectWallet('metamask')}
                leftIcon={<Wallet className="w-4 h-4" />}
              >
                Connect MetaMask
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => connectWallet('demo')}
              >
                Connect Demo Provider
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Switch Cadastral Persona / Role
          </label>
          <div className="space-y-2">
            {roles.map(r => {
              const isActive = role === r.role && wallet.isConnected;
              return (
                <div
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isActive
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{r.title}</p>
                      {isActive && (
                        <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.2 rounded font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">
                      {r.address.slice(0, 10)}...{r.address.slice(-6)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
                        Select <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Cadastra Smart Contract Suite
          </span>
          <a
            href={APP_CONFIG.network.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-slate-800 transition-colors"
          >
            Amoy Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Modal>
  );
};
