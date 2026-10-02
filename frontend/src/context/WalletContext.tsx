import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletService } from '../services/blockchain/walletService';
import type { UserRole, WalletState, Web3Network } from '../types';
import { DEMO_WALLETS, APP_CONFIG } from '../constants';
import { useToast } from './ToastContext';

interface WalletContextType {
  wallet: WalletState;
  role: UserRole;
  currentRoleInfo: typeof DEMO_WALLETS[UserRole];
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  connectWallet: (providerType?: 'metamask' | 'demo') => Promise<void>;
  disconnectWallet: () => void;
  switchRole: (role: UserRole) => void;
  switchNetwork: (network?: Web3Network) => Promise<void>;
  signAction: (actionName: string, payload: Record<string, any>) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(walletService.getState());
  const [role, setRole] = useState<UserRole>(walletService.getCurrentRole());
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = walletService.subscribe((newWallet, newRole) => {
      setWallet(newWallet);
      setRole(newRole);
    });
    return unsubscribe;
  }, []);

  const openWalletModal = useCallback(() => setIsWalletModalOpen(true), []);
  const closeWalletModal = useCallback(() => setIsWalletModalOpen(false), []);

  const connectWallet = useCallback(async (providerType: 'metamask' | 'demo' = 'demo') => {
    try {
      await walletService.connectWallet(providerType);
      toast.success('Wallet connected to Polygon Amoy network.', 'Wallet Connected');
      setIsWalletModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to connect wallet.', 'Connection Error');
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    walletService.disconnectWallet();
    toast.info('Wallet disconnected.', 'Disconnected');
  }, [toast]);

  const switchRole = useCallback((newRole: UserRole) => {
    walletService.switchRole(newRole);
    const demo = DEMO_WALLETS[newRole];
    toast.info(`Switched role to ${demo.label}`, 'Role Updated');
  }, [toast]);

  const switchNetwork = useCallback(async (network: Web3Network = 'polygon-amoy') => {
    await walletService.switchNetwork(network);
    toast.success(`Network set to ${APP_CONFIG.network.name}`, 'Network Switched');
  }, [toast]);

  const signAction = useCallback(async (actionName: string, payload: Record<string, any>) => {
    return await walletService.signTransaction(actionName, payload);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        role,
        currentRoleInfo: DEMO_WALLETS[role],
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        connectWallet,
        disconnectWallet,
        switchRole,
        switchNetwork,
        signAction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
