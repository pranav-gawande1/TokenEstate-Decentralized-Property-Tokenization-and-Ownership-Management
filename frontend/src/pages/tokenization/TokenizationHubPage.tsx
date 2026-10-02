import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/blockchain/propertyService';
import { useWallet } from '../../context/WalletContext';
import type { Property } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { ExplorerLink } from '../../components/ui/ExplorerLink';
import { APP_CONFIG } from '../../constants';
import { Layers, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const TokenizationHubPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId?: string }>();
  const { wallet } = useWallet();

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{ tokenId: string; txHash: string; contractAddress: string } | null>(null);

  const loadProperties = async () => {
    const all = await propertyService.getAllProperties();
    setProperties(all);

    if (propertyId) {
      const match = all.find(p => p.id === propertyId);
      if (match) setSelectedProperty(match);
    } else {
      // Pick first eligible property if available
      const eligible = all.find(p => p.status === 'verified' && !p.isTokenized);
      if (eligible) setSelectedProperty(eligible);
      else if (all.length > 0) setSelectedProperty(all[0]);
    }
  };

  useEffect(() => {
    loadProperties();
    return propertyService.subscribe(loadProperties);
  }, [propertyId]);

  const eligibleList = properties.filter(p => p.status === 'verified' && !p.isTokenized);
  const tokenizedList = properties.filter(p => p.isTokenized);

  const handleExecuteMint = async () => {
    if (!selectedProperty) return;
    setIsMinting(true);
    try {
      const res = await propertyService.tokenizeProperty(
        selectedProperty.id,
        wallet.address || selectedProperty.currentOwnerAddress
      );
      setMintResult(res);
      setIsMintModalOpen(false);
      loadProperties();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Cadastral Asset Tokenization Studio
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Mint EIP-721 non-fungible tokens representing authenticated land parcels certified by the Sub-Registrar.
        </p>
      </div>

      {/* Mint Success Banner */}
      {mintResult && (
        <Card className="border-purple-300 bg-purple-50/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-purple-950">
                  Cadastral NFT Minted Successfully!
                </h3>
                <p className="text-xs text-purple-800">
                  ERC-721 digital deed token is now anchored to the beneficiary's Polygon wallet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono bg-white p-4 rounded-xl border border-purple-200">
              <div>
                <span className="text-slate-400 block font-sans">Token ID</span>
                <span className="font-bold text-purple-900 text-sm">#{mintResult.tokenId}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Smart Contract</span>
                <AddressDisplay address={mintResult.contractAddress} truncateLength={4} />
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Mint Transaction</span>
                <HashDisplay hash={mintResult.txHash} truncateLength={4} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <ExplorerLink type="tx" value={mintResult.txHash} label="View Transaction on PolygonScan" />
              <Button variant="primary" size="sm" onClick={() => setMintResult(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tokenization Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Eligible properties queue */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader
              title="Tokenization Pipeline"
              subtitle="Properties eligible for ERC-721 minting"
            />
            <CardContent className="space-y-3">
              {eligibleList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No verified unminted properties currently queued.
                </div>
              ) : (
                eligibleList.map(p => {
                  const isSelected = selectedProperty?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProperty(p)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-slate-900">{p.id}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-xs font-semibold text-slate-900">{p.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.city} · Survey {p.surveyNumber}</p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-600">
                        <span>{p.areaSqFt.toLocaleString()} sq.ft</span>
                        <span className="font-mono font-semibold">{p.valuationInMATIC.toLocaleString()} MATIC</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Already Tokenized Registry */}
          <Card>
            <CardHeader
              title={`Minted Digital Deeds (${tokenizedList.length})`}
              subtitle="Live ERC-721 tokens on Polygon"
            />
            <CardContent className="space-y-2">
              {tokenizedList.map(t => (
                <div
                  key={t.id}
                  onClick={() => setSelectedProperty(t)}
                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-purple-700">Token #{t.tokenId}</span>
                    <p className="text-slate-800 font-medium truncate max-w-[180px]">{t.title}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {t.mintTxHash ? `${t.mintTxHash.slice(0, 8)}...` : 'Minted'}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Selected Property Minting Console */}
        <div className="lg:col-span-7">
          {selectedProperty ? (
            <Card className="border-slate-300">
              <CardHeader
                title={`Cadastral Asset: ${selectedProperty.title}`}
                subtitle={`Survey: ${selectedProperty.surveyNumber} · Assigned ID: ${selectedProperty.id}`}
                action={<StatusBadge status={selectedProperty.status} />}
              />
              <CardContent className="space-y-6">
                {/* Requirements check */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    EIP-721 Tokenization Eligibility Gate
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <span>Government Sub-Registrar Sanction</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approved
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <span>IPFS Deed Hashes Verified</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {selectedProperty.documents.length} Deeds Anchored
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                      <span>No Encumbrance Flags on Record</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Clear Title
                      </span>
                    </div>
                  </div>
                </div>

                {/* Minting Specifications */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-sans">Token Standard</span>
                    <span className="text-slate-900 font-bold">ERC-721 Standard</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-sans">Target Chain</span>
                    <span className="text-slate-900 font-bold">{APP_CONFIG.network.name}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-sans">Beneficiary Wallet</span>
                    <AddressDisplay address={selectedProperty.currentOwnerAddress} truncateLength={4} />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-sans">Token Valuation</span>
                    <span className="text-slate-900 font-bold">{selectedProperty.valuationInMATIC.toLocaleString()} MATIC</span>
                  </div>
                </div>

                {/* Important Disclaimer */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    The NFT represents the property's digital blockchain record. Legal ownership remains subject to applicable government and legal verification.
                  </p>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  {selectedProperty.isTokenized ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-medium">Already tokenized as NFT #{selectedProperty.tokenId}</span>
                      <Link to={`/properties/${selectedProperty.id}`}>
                        <Button variant="outline" size="sm">
                          Inspect Dossier
                        </Button>
                      </Link>
                    </div>
                  ) : selectedProperty.status !== 'verified' ? (
                    <p className="text-xs text-slate-400">
                      Property requires government Sub-Registrar approval prior to tokenization.
                    </p>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setIsMintModalOpen(true)}
                      leftIcon={<Layers className="w-4 h-4" />}
                    >
                      Mint Property NFT
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
              Select a property from the left to inspect tokenization specifications.
            </div>
          )}
        </div>
      </div>

      {/* Mint Confirmation Dialog */}
      {selectedProperty && (
        <ConfirmDialog
          isOpen={isMintModalOpen}
          onClose={() => setIsMintModalOpen(false)}
          onConfirm={handleExecuteMint}
          title="Mint Property NFT (ERC-721)"
          description="This action executes mintPropertyNFT() on the Polygon Amoy smart contract. A unique token ID will be assigned and recorded on the immutable ledger."
          confirmText="Confirm & Mint"
          isLoading={isMinting}
          metaDetails={[
            { label: 'Token Standard', value: 'ERC-721' },
            { label: 'Network', value: APP_CONFIG.network.name },
            { label: 'Property ID', value: selectedProperty.id },
            { label: 'Survey Number', value: selectedProperty.surveyNumber },
            { label: 'Beneficiary Wallet', value: selectedProperty.currentOwnerAddress },
          ]}
        />
      )}
    </div>
  );
};
