import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../constants';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#0B132B] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Cadastra
              </span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Enterprise Web3 land records infrastructure providing cryptographically verified cadastral parcel registration, IPFS document provenance, and ERC-721 title deed tokenization.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Smart Contracts deployed on Polygon Amoy (Chain ID: 80002)
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/properties" className="hover:text-white transition-colors">Property Ledger</Link></li>
              <li><Link to="/properties/register" className="hover:text-white transition-colors">Cadastral Intake</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/tokenization" className="hover:text-white transition-colors">ERC-721 Minting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Verification</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/verification/qr" className="hover:text-white transition-colors">QR Verification</Link></li>
              <li><Link to="/verification/document" className="hover:text-white transition-colors">Deed Hash Check</Link></li>
              <li><Link to="/audit" className="hover:text-white transition-colors">Event Audit Trail</Link></li>
              <li><a href={APP_CONFIG.network.explorerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Polygon Explorer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs uppercase tracking-wider">Institutional</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/government/registrations" className="hover:text-white transition-colors">Registrar Portal</Link></li>
              <li><Link to="/admin/fraud-detection" className="hover:text-white transition-colors">Fraud Checks</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Architecture</Link></li>
              <li><Link to="/settings/profile" className="hover:text-white transition-colors">Account Settings</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Statutory Notice:</strong> {APP_CONFIG.legalDisclaimer}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-3 text-slate-500">
            <span>© {new Date().getFullYear()} Cadastra Web3 Infrastructure Platform. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span>IPFS Storage</span>
              <span>·</span>
              <span>ERC-721 Token Standard</span>
              <span>·</span>
              <span>Polygon Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
