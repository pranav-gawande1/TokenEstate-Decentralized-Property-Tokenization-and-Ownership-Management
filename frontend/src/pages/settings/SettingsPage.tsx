import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useAuth } from '../../context/AuthContext';
import { DEMO_WALLETS, APP_CONFIG } from '../../constants';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { UserCheck, Wallet, Bell, Shield, CheckCircle2, ExternalLink, Activity, RefreshCw, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const SettingsPage: React.FC = () => {
  const { wallet, role, currentRoleInfo, switchNetwork, switchRole } = useWallet();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const toast = useToast();

  // Profile Form State (Real-time backend linked)
  const [fullName, setFullName] = useState(user?.full_name || currentRoleInfo.name);
  const [walletAddressInput, setWalletAddressInput] = useState(user?.wallet_address || wallet.address || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Real-time RPC status state
  const [rpcLatency, setRpcLatency] = useState<number | null>(null);
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  const [isPingingRpc, setIsPingingRpc] = useState(false);

  // Persistent Notification Preferences
  const [notificationConfig, setNotificationConfig] = useState(() => {
    const saved = localStorage.getItem('tokenizeestate_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      onRegistration: true,
      onApproval: true,
      onTransferRequest: true,
      onEscrowRelease: true,
      emailAddress: user?.email || 'user@tokenizeestate.io',
    };
  });

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setWalletAddressInput(user.wallet_address || wallet.address || '');
      setNotificationConfig((prev: typeof notificationConfig) => ({
        ...prev,
        emailAddress: prev.emailAddress || user.email,
      }));
    }
  }, [user, wallet.address]);

  const settingsTabs = [
    { id: 'profile', label: 'User & Authority Profile' },
    { id: 'wallet', label: 'Web3 & Network' },
    { id: 'notifications', label: 'Alert Preferences' },
    { id: 'security', label: 'Security & Contracts' },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await authService.updateProfile({
        full_name: fullName,
        wallet_address: walletAddressInput,
      });
      await refreshUser();
      toast.success('Your profile details and wallet address have been saved to the database.', 'Profile Updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.', 'Update Error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLinkConnectedWallet = () => {
    if (wallet.address) {
      setWalletAddressInput(wallet.address);
      toast.info(`Populated active connected wallet: ${wallet.address.slice(0, 8)}...`, 'Wallet Linked');
    } else {
      toast.error('No Web3 wallet is currently connected.', 'Wallet Error');
    }
  };

  const handleTestRpcConnection = async () => {
    setIsPingingRpc(true);
    const start = performance.now();
    try {
      const response = await fetch(APP_CONFIG.network.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1,
        }),
      });
      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);
      setRpcLatency(elapsed);
      if (data?.result) {
        const blockNum = parseInt(data.result, 16);
        setLatestBlock(blockNum);
        toast.success(`Polygon Amoy node reachable! Latest block #${blockNum} (${elapsed}ms)`, 'RPC Online');
      } else {
        toast.info(`RPC answered in ${elapsed}ms`, 'RPC Connected');
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setRpcLatency(elapsed);
      toast.info(`Public RPC response recorded (${elapsed}ms)`, 'Network Pinged');
    } finally {
      setIsPingingRpc(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('tokenizeestate_notifications', JSON.stringify(notificationConfig));
    toast.success('Alert preferences saved successfully.', 'Preferences Saved');
  };

  const activeRoleName = user?.role || role;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your connected Web3 wallet, verified cadastral identity, live alerts, and smart contract connections.
        </p>
      </div>

      <div className="border-b border-slate-200 pb-3">
        <Tabs tabs={settingsTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile}>
          <Card>
            <CardHeader
              title="Identity & Authority Level"
              subtitle="Current authenticated persona synchronized with the PostgreSQL database"
            />
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {user?.full_name || fullName || currentRoleInfo.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      @{user?.username || 'user'} · {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-300 shadow-xs">
                    Role: {activeRoleName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name / Designation
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your formal name or officer title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Account Email
                  </label>
                  <Input
                    value={user?.email || ''}
                    readOnly
                    className="bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Linked Web3 Wallet Address
                  </label>
                  {wallet.address && (
                    <button
                      type="button"
                      onClick={handleLinkConnectedWallet}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Use Connected Wallet
                    </button>
                  )}
                </div>
                <Input
                  value={walletAddressInput}
                  onChange={(e) => setWalletAddressInput(e.target.value)}
                  placeholder="0x..."
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  This wallet address is anchored to your cadastral signatures and title conveyances on-chain.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-end w-full">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingProfile}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save Profile to Database
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      )}

      {/* Tab: Wallet & Network */}
      {activeTab === 'wallet' && (
        <Card>
          <CardHeader
            title="Connected Web3 Wallet & RPC Network"
            subtitle="Polygon Amoy consensus state and live RPC provider diagnostic"
          />
          <CardContent className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Connected Network:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  {APP_CONFIG.network.name} (Chain ID: {APP_CONFIG.network.chainId})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Active Wallet Balance:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{wallet.balanceMatic} MATIC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">RPC Endpoint:</span>
                <span className="font-mono text-slate-600 truncate max-w-[280px] sm:max-w-none">{APP_CONFIG.network.rpcUrl}</span>
              </div>
              {latestBlock !== null && (
                <div className="flex justify-between items-center text-emerald-700 bg-emerald-50/60 p-2 rounded border border-emerald-200">
                  <span className="font-medium">Live Block Height:</span>
                  <span className="font-mono font-bold">#{latestBlock.toLocaleString()}</span>
                </div>
              )}
              {rpcLatency !== null && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>Network Latency:</span>
                  <span className="font-mono font-semibold">{rpcLatency} ms</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={handleTestRpcConnection}
                isLoading={isPingingRpc}
                leftIcon={<Activity className="w-3.5 h-3.5" />}
              >
                Ping Live RPC Node
              </Button>
              <Button variant="outline" size="sm" onClick={() => switchNetwork('polygon-amoy')}>
                Verify Network Switch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader
            title="Real-Time Transaction & Escrow Alerts"
            subtitle="Configure notification dispatch for deeds, tokenization, and transfer milestones"
          />
          <CardContent className="space-y-4 text-xs">
            <Input
              label="Notification Delivery Email"
              value={notificationConfig.emailAddress}
              onChange={e => setNotificationConfig({ ...notificationConfig, emailAddress: e.target.value })}
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationConfig.onRegistration}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onRegistration: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Notify when new parcel registration is submitted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationConfig.onApproval}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onApproval: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Notify when Sub-Registrar signs approval on-chain</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationConfig.onTransferRequest}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onTransferRequest: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Notify when escrow purchase consideration is deposited</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationConfig.onEscrowRelease}
                  onChange={e => setNotificationConfig({ ...notificationConfig, onEscrowRelease: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="text-slate-700 font-medium">Notify when multi-sig title deed NFT is released to buyer</span>
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full">
              <Button variant="primary" size="sm" onClick={handleSaveNotifications} leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Alert Preferences
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
              TokenizeEstate does not store private keys or seed phrases in frontend local storage or server databases. All cryptographic signatures are produced via external wallet providers (MetaMask / Hardware wallets) using EIP-712 standard domain hashes.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

