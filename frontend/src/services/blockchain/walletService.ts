import { DEMO_WALLETS, APP_CONFIG } from '../../constants';
import type { UserRole, WalletState, Web3Network } from '../../types/index';

class WalletService {
  private state: WalletState = {
    isConnected: true,
    address: DEMO_WALLETS.owner.address,
    network: 'polygon-amoy',
    balanceMatic: '42.85',
    isConnecting: false,
    error: null,
  };

  private currentRole: UserRole = 'owner';
  private listeners: Array<(state: WalletState, role: UserRole) => void> = [];

  constructor() {
    // Check if browser has MetaMask
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      // Future Web3 provider ready
    }
  }

  public getState(): WalletState {
    return { ...this.state };
  }

  public getCurrentRole(): UserRole {
    return this.currentRole;
  }

  public subscribe(listener: (state: WalletState, role: UserRole) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState(), this.currentRole);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getState(), this.currentRole));
  }

  public async connectWallet(providerType: 'metamask' | 'demo' = 'demo'): Promise<WalletState> {
    this.state.isConnecting = true;
    this.state.error = null;
    this.notify();

    // Emulate Web3 provider handshake latency
    await new Promise(r => setTimeout(r, 600));

    if (providerType === 'metamask' && typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          this.state.address = accounts[0];
          this.state.isConnected = true;
          this.state.isConnecting = false;
          this.notify();
          return this.getState();
        }
      } catch (err: any) {
        console.warn('Fallback to demo account:', err);
      }
    }

    // Default to role demo address
    const demo = DEMO_WALLETS[this.currentRole];
    this.state = {
      isConnected: true,
      address: demo.address,
      network: 'polygon-amoy',
      balanceMatic: demo.balance.split(' ')[0],
      isConnecting: false,
      error: null,
    };
    this.notify();
    return this.getState();
  }

  public disconnectWallet() {
    this.state = {
      isConnected: false,
      address: null,
      network: 'polygon-amoy',
      balanceMatic: '0.00',
      isConnecting: false,
      error: null,
    };
    this.notify();
  }

  public switchRole(newRole: UserRole) {
    this.currentRole = newRole;
    const demo = DEMO_WALLETS[newRole];
    this.state.address = demo.address;
    this.state.balanceMatic = demo.balance.split(' ')[0];
    this.state.isConnected = true;
    this.notify();
  }

  public async switchNetwork(targetNetwork: Web3Network = 'polygon-amoy'): Promise<boolean> {
    this.state.isConnecting = true;
    this.notify();
    await new Promise(r => setTimeout(r, 450));
    this.state.network = targetNetwork;
    this.state.isConnecting = false;
    this.notify();
    return true;
  }

  public async signTransaction(actionName: string, payload: Record<string, any>): Promise<string> {
    // Simulates cryptographic EIP-712 / personal_sign
    await new Promise(r => setTimeout(r, 700));
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `0x${randomHex}`;
  }
}

export const walletService = new WalletService();
