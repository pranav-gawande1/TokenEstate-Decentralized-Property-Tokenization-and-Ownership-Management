import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyService } from '../../services/blockchain/propertyService';
import { transferService } from '../../services/blockchain/transferService';
import { useWallet } from '../../context/WalletContext';
import type { Property } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Search,
  MapPin,
  ShieldCheck,
  Lock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import samplePropertyImage from '../../assets/images/property_bengaluru_estate_1790929235008.jpg';

export const MarketplacePage: React.FC = () => {
  const { wallet } = useWallet();
  const {
    getAllProperties,
    loading: isPropertiesLoading,
    error: propertiesError,
  } = usePropertyService();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');

  // Purchase Modal State
  const [selectedToBuy, setSelectedToBuy] = useState<Property | null>(null);
  const [purchaseStep, setPurchaseStep] = useState<1 | 2 | 3>(1);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const [purchasedTxHash, setPurchasedTxHash] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('[MarketplacePage] Failed to load:', error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = properties.filter((p) => {
    if (typeFilter !== 'ALL' && p.propertyType !== typeFilter) return false;
    if (cityFilter !== 'ALL' && p.city !== cityFilter) return false;
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(t) ||
        p.city.toLowerCase().includes(t) ||
        p.surveyNumber.toLowerCase().includes(t) ||
        p.id.toLowerCase().includes(t)
      );
    }
    return true;
  });

  const handleInitiateEscrowPurchase = async () => {
    if (!selectedToBuy) return;
    setIsProcessingPurchase(true);

    try {
      const { txHash } = await transferService.initiatePurchaseRequest({
        propertyId: selectedToBuy.id,
        propertyTitle: selectedToBuy.title,
        sellerAddress: selectedToBuy.currentOwnerAddress,
        buyerAddress: wallet.address || '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9',
        agreedPriceINR: selectedToBuy.valuationInINR,
        agreedPriceMATIC: selectedToBuy.valuationInMATIC,
        tokenId: selectedToBuy.tokenId,
      });

      setPurchasedTxHash(txHash);
      setPurchaseStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tokenized Cadastral Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified land parcels and estates with on-chain EIP-721 digital title certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search location, title..."
              className="text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="ALL">All Property Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="ALL">All Jurisdictions</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Solapur">Solapur</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={load}
            isLoading={isPropertiesLoading}
            disabled={isPropertiesLoading}
            leftIcon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isPropertiesLoading ? 'animate-spin' : ''}`}
              />
            }
          >
            {isPropertiesLoading ? 'Fetching...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {propertiesError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Failed to load properties: {propertiesError}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={load}
            disabled={isPropertiesLoading}
            className="bg-white text-red-700 border-red-300 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Property Cards Grid or Skeletons or EmptyState */}
      {isPropertiesLoading && properties.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6 text-slate-400" />}
          title="No properties found"
          description={
            searchTerm || typeFilter !== 'ALL' || cityFilter !== 'ALL'
              ? 'No listings match your search query and filters. Try adjusting or clearing filters.'
              : 'There are currently no verified or tokenized properties available in the marketplace.'
          }
          actionLabel={
            searchTerm || typeFilter !== 'ALL' || cityFilter !== 'ALL'
              ? 'Clear Filters'
              : undefined
          }
          onAction={() => {
            setSearchTerm('');
            setTypeFilter('ALL');
            setCityFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Image */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={property.image || samplePropertyImage}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = samplePropertyImage;
                  }}
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={property.status} />
                </div>
                {property.isTokenized && (
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-white backdrop-blur-xs text-[11px] font-mono px-2 py-0.5 rounded font-medium">
                    NFT #{property.tokenId}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{property.propertyType}</span>
                    <span className="font-mono">{property.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {property.city}, {property.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Area</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {property.areaSqFt.toLocaleString()} sq.ft
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Valuation</span>
                      <span className="font-bold text-slate-900 font-mono tabular-nums">
                        {property.valuationInMATIC.toLocaleString()} MATIC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/properties/${property.id}`}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    View Dossier
                  </Link>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedToBuy(property);
                      setPurchaseStep(1);
                    }}
                    leftIcon={<Lock className="w-3.5 h-3.5" />}
                  >
                    Request Transfer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase / Escrow Transfer Modal */}
      {selectedToBuy && (
        <Modal
          isOpen={!!selectedToBuy}
          onClose={() => {
            if (!isProcessingPurchase) {
              setSelectedToBuy(null);
              setPurchasedTxHash(null);
            }
          }}
          title={
            purchaseStep === 1
              ? 'Review Cadastral Purchase & Escrow'
              : purchaseStep === 2
                ? 'Deposit Consideration into Smart Escrow'
                : 'Escrow Initiated Successfully'
          }
          subtitle={`Property: ${selectedToBuy.title} (Survey ${selectedToBuy.surveyNumber})`}
          maxWidth="md"
        >
          {purchaseStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Property Identifier:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedToBuy.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Owner:</span>
                  <AddressDisplay address={selectedToBuy.currentOwnerAddress} truncateLength={4} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer Wallet:</span>
                  <AddressDisplay
                    address={wallet.address || '0x9218d6e3B83F41bCbDe6aF7295D3a37C82C73AF9'}
                    truncateLength={4}
                  />
                </div>
                {selectedToBuy.isTokenized && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">ERC-721 Token ID:</span>
                    <span className="font-mono font-bold text-purple-700">#{selectedToBuy.tokenId}</span>
                  </div>
                )}
              </div>

              {/* Financial Escrow Breakdown */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Agreed Consideration:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedToBuy.valuationInMATIC.toLocaleString()} MATIC
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Smart Contract Protocol Fee (1%):</span>
                  <span className="font-mono">
                    {Math.round(selectedToBuy.valuationInMATIC * 0.01).toLocaleString()} MATIC
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Escrow Deposit:</span>
                  <span className="font-mono text-sm">
                    {(selectedToBuy.valuationInMATIC + Math.round(selectedToBuy.valuationInMATIC * 0.01)).toLocaleString()} MATIC
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedToBuy(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => setPurchaseStep(2)}>
                  Proceed to Escrow Deposit
                </Button>
              </div>
            </div>
          )}

          {purchaseStep === 2 && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                By signing, you lock{' '}
                <strong className="text-slate-900 font-mono">
                  {(selectedToBuy.valuationInMATIC + Math.round(selectedToBuy.valuationInMATIC * 0.01)).toLocaleString()} MATIC
                </strong>{' '}
                into the multi-sig EscrowManager contract on Polygon Amoy. Funds will only be released to the seller once the Sub-Registrar verifies and sanctions the statutory transfer deed.
              </p>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-1">
                <span className="font-semibold text-purple-900 block">Target Escrow Contract</span>
                <span className="font-mono text-[11px] text-purple-800 break-all">
                  {APP_CONFIG.contracts.escrowManager}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPurchaseStep(1)}
                  disabled={isProcessingPurchase}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleInitiateEscrowPurchase}
                  isLoading={isProcessingPurchase}
                  disabled={isProcessingPurchase}
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                >
                  {isProcessingPurchase ? 'Locking Funds...' : 'Confirm & Sign Escrow Lock'}
                </Button>
              </div>
            </div>
          )}

          {purchaseStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">Escrow Locked On-Chain</p>
                  <p className="text-emerald-800 text-[11px]">
                    Your transfer request has been queued for Sub-Registrar conveyance sanction.
                  </p>
                </div>
              </div>

              {purchasedTxHash && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Escrow Tx:</span>
                    <HashDisplay hash={purchasedTxHash} truncateLength={6} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-amber-700 font-semibold">Under Registrar Review</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <Link to="/transfers">
                  <Button variant="outline" size="sm">
                    Go to Transfers Dashboard
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedToBuy(null);
                    setPurchasedTxHash(null);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
