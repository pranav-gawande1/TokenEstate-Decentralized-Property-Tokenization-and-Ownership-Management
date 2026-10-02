import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { DEMO_WALLETS, APP_CONFIG } from '../../constants';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { UserCheck, Wallet, Bell, Shield, CheckCircle2, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { wallet, role, currentRoleInfo, switchNetwork, switchRole } = useWallet();
  const [activeTab, setActiveTab] = useState('profile');
  const toast = useToast();

  const [notificationConfig, setNotificationConfig] = useState({
    onRegistration: true,
    onApproval: true,
    onTransferRequest: true,
    onEscrowRelease: true,
    emailAddress: 'officer.cadastra@gov.in',
  });

  const settingsTabs = [
    { id: 'profile', label: 'Cadastral Profile' },
    { id: 'wallet', label: 'Web3 & Network' },
    { id: 'notifications', label: 'Alert Preferences' },
    { id: 'security', label: 'Security & Contracts' },
  ];

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated successfully.', 'Saved');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your connected Web3 wallet, cadastral persona authority, notifications, and smart contract connections.
        </p>
      </div>

      <div className="border-b border-slate-200 pb-3">
        <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader
            title="Cadastral Identity & Authority Level"
            subtitle="Current authenticated persona for statutory land actions"
          />
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentRoleInfo.name}</h3>
                  <p className="text-xs text-slate-500">{currentRoleInfo.label}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Authenticated Role
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <Input
                label="Full Name / Officer Designation"
                value={currentRoleInfo.name}
                readOnly
              />
              <Input
                label="Cadastral Jurisdiction"
                value="Haveli District & Pune Urban Subdivision (Maharashtra)"
                readOnly
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Signing Wallet Address
              </label>
              <AddressDisplay address={wallet.address || ''} truncateLength={10} showExplorerLink />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Wallet & Network */}
      {activeTab === 'wallet' && (
        <Card>
          <CardHeader
            title="Connected Web3 Wallet & RPC Network"
            subtitle="Polygon consensus state and provider status"
          />
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Connected Network:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  {APP_CONFIG.network.name} (Chain ID: {APP_CONFIG.network.chainId})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Wallet Balance:</span>
                <span className="font-mono font-bold text-slate-900">{wallet.balanceMatic} MATIC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">RPC Endpoint:</span>
                <span className="font-mono text-slate-600">{APP_CONFIG.network.rpcUrl}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => switchNetwork('polygon-amoy')}>
                Verify Network Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader
            title="Statutory Transaction & Escrow Alerts"
            subtitle="Configure real-time notifications for deed registrations and transfer milestones"
          />
          <CardContent className="space-y-4 text-xs">
            <Input
              label="Email Notification Address"
              value={notificationConfig.emailAddress}
              onChange={e => setNotificationConfig({ ...notificationConfig, emailAddress: e.target.value })}
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationConfig.onRegistration}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onRegistration: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-700">Notify when new parcel registration is submitted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationConfig.onApproval}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onApproval: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-700">Notify when Sub-Registrar signs approval on-chain</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationConfig.onTransferRequest}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onTransferRequest: e.target.checked })}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-700">Notify when escrow purchase request is received</span>
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full">
              <Button variant="primary" size="sm" onClick={handleSaveNotifications}>
                Save Preferences
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Tab: Security & Contracts */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader
            title="Deployed Smart Contracts & Security Parameters"
            subtitle="Verified contracts running on Polygon Amoy EVM"
          />
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-1 font-mono">
                <span className="font-sans font-semibold text-slate-800">LandRegistry Core Contract:</span>
                <AddressDisplay address={APP_CONFIG.contracts.landRegistry} truncateLength={6} showExplorerLink />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-1 font-mono">
                <span className="font-sans font-semibold text-slate-800">PropertyNFT (ERC-721):</span>
                <AddressDisplay address={APP_CONFIG.contracts.propertyNFT} truncateLength={6} showExplorerLink />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-1 font-mono">
                <span className="font-sans font-semibold text-slate-800">EscrowManager Contract:</span>
                <AddressDisplay address={APP_CONFIG.contracts.escrowManager} truncateLength={6} showExplorerLink />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-1 font-mono">
                <span className="font-sans font-semibold text-slate-800">AuditLogger Contract:</span>
                <AddressDisplay address={APP_CONFIG.contracts.auditLogger} truncateLength={6} showExplorerLink />
              </div>
            </div>

            <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
              <strong className="text-slate-800 block mb-0.5">Key Custody Architecture:</strong>
              Cadastra does not store private keys or seed phrases in frontend local storage or server databases. All cryptographic signatures are produced via external wallet providers (MetaMask / Hardware wallets) using EIP-712 standard domain hashes.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
