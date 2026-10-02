import { APP_CONFIG } from '../../constants';

export class IPFSService {
  /**
   * Generates a deterministic or simulated IPFS CID v1 representation
   */
  public static generateCID(hash: string): string {
    const cleanHash = hash.replace(/^0x/, '').slice(0, 48);
    return `bafybei${cleanHash}7u4i3o2p1m0`;
  }

  /**
   * Calculates actual SHA-256 cryptographic hash of a File using Web Crypto API
   */
  public static async calculateFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const digestBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(digestBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hex}`;
  }

  /**
   * Calculates SHA-256 hash of a string/payload
   */
  public static async calculateStringHash(text: string): Promise<string> {
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const digestBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(digestBuffer));
    const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hex}`;
  }

  /**
   * Simulates uploading a file to IPFS node and pinning
   */
  public static async uploadToIPFS(file: File): Promise<{ cid: string; hash: string; size: string }> {
    // Simulate network pin latency
    await new Promise(r => setTimeout(r, 600));
    const hash = await this.calculateFileHash(file);
    const cid = this.generateCID(hash);
    const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    return { cid, hash, size };
  }

  public static getGatewayUrl(cid: string): string {
    return `${APP_CONFIG.ipfsGateway}/${cid}`;
  }
}
