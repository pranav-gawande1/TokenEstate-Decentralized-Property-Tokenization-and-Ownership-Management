import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/blockchain/propertyService';
import { auditService } from '../../services/blockchain/auditService';
import { useWallet } from '../../context/WalletContext';
import type { Property, AuditEvent, PropertyDocument } from '../../types';
import { PropertyHeader } from '../../components/property/PropertyHeader';
import { PropertyDetails } from '../../components/property/PropertyDetails';
import { PropertyDocuments } from '../../components/property/PropertyDocuments';
import { PropertyTimeline } from '../../components/property/PropertyTimeline';
import { PropertyOwnership } from '../../components/property/PropertyOwnership';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { ExplorerLink } from '../../components/ui/ExplorerLink';
import { GovernmentApprovalPanel } from '../../components/government/GovernmentApprovalPanel';
import {
  Layers,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  FileSearch,
  ExternalLink,
  QrCode,
  AlertTriangle,
} from 'lucide-react';
import { APP_CONFIG } from '../../constants';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role, wallet } = useWallet();

  const [property, setProperty] = useState<Property | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);
    const found = await propertyService.getPropertyById(id);
    if (found) {
      setProperty(found);
      const evts = auditService.getEventsByProperty(id);
      setEvents(evts);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubProp = propertyService.subscribe(loadData);
    const unsubAudit = auditService.subscribe(loadData);
    return () => {
      unsubProp();
      unsubAudit();
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading cadastral ledger record...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Property Record Not Found</h2>
        <p className="text-xs text-slate-500">
          No cadastral record matching ID "{id}" exists in the current state ledger.
        </p>
        <Link to="/properties">
          <Button variant="primary" size="sm">
            Back to Property Ledger
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = wallet.address?.toLowerCase() === property.currentOwnerAddress.toLowerCase();
  const canTokenize = property.status === 'verified' && !property.isTokenized;

  const detailTabs = [
    { id: 'overview', label: 'Cadastral Overview' },
    { id: 'ownership', label: 'Ownership & Title' },
    { id: 'documents', label: `Documents (${property.documents.length})` },
    { id: 'timeline', label: `Chain of Title (${events.length})` },
    { id: 'verification', label: 'Blockchain Proofs' },
  ];

  const handleAddDocument = (newDoc: PropertyDocument) => {
    propertyService.attachDocument(property.id, newDoc);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <PropertyHeader
        property={property}
        actions={
          <div className="flex items-center gap-2">
            {canTokenize && (
              <Link to={`/tokenization/${property.id}`}>
                <Button variant="primary" size="sm" leftIcon={<Layers className="w-4 h-4" />}>
                  Mint Property NFT
                </Button>
              </Link>
            )}
            {property.isTokenized && (
              <Link to={`/marketplace/${property.id}`}>
                <Button variant="outline" size="sm" leftIcon={<ArrowRightLeft className="w-4 h-4" />}>
                  Transfer / Purchase
                </Button>
              </Link>
            )}
            <Link to="/verification/qr">
              <Button variant="ghost" size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
                QR Pass
              </Button>
            </Link>
          </div>
        }
      />

      {/* Officer Adjudication Panel (Shown when role is officer or pending verification) */}
      {(role === 'officer' || property.status === 'pending_verification') && (
        <GovernmentApprovalPanel
          property={property}
          onApproveSuccess={loadData}
          onRejectSuccess={loadData}
        />
      )}

      {/* Tabs */}
      <Tabs
        tabs={detailTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab Panels */}
      {activeTab === 'overview' && <PropertyDetails property={property} />}

      {activeTab === 'ownership' && <PropertyOwnership property={property} />}

      {activeTab === 'documents' && (
        <PropertyDocuments
          documents={property.documents}
          onAddDocument={handleAddDocument}
          canUpload={isOwner || role === 'officer'}
        />
      )}

      {activeTab === 'timeline' && <PropertyTimeline events={events} />}

      {activeTab === 'verification' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Cryptographic State Verification"
              subtitle="Proof of parcel integrity anchored to Polygon Amoy consensus state."
            />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Smart Contract Ledger</span>
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Synchronized
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-400">LandRegistry Contract:</span>
                      <AddressDisplay address={APP_CONFIG.contracts.landRegistry} truncateLength={4} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Property Token Contract:</span>
                      <AddressDisplay address={APP_CONFIG.contracts.propertyNFT} truncateLength={4} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Document Cryptography</span>
                    <span className="text-blue-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SHA-256 Validated
                    </span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px] pt-2 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Primary Sale Deed:</span>
                      <HashDisplay hash={property.documents[0]?.sha256Hash || '0x...'} truncateLength={4} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IPFS Root CID:</span>
                      <span className="truncate max-w-[150px]">{property.documents[0]?.ipfsCid || 'bafy...'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link to="/verification/document">
                  <Button variant="outline" size="sm" leftIcon={<FileSearch className="w-4 h-4" />}>
                    Upload Deed for SHA-256 Tamper Audit
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
