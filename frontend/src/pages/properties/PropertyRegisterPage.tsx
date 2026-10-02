import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { propertyService } from '../../services/blockchain/propertyService';
import { IPFSService } from '../../services/ipfs/ipfsService';
import type { Property, PropertyDocument, DocumentType } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { FileUpload, type UploadedFileInfo } from '../../components/ui/FileUpload';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { ExplorerLink } from '../../components/ui/ExplorerLink';
import { APP_CONFIG } from '../../constants';
import {
  CheckCircle2,
  Loader2,
  Building,
  UserCheck,
  FileText,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const PropertyRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    surveyNumber: '',
    propertyType: 'Residential' as 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    district: 'Pune',
    pinCode: '411001',
    areaSqFt: 2400,
    landType: 'Freehold Non-Agricultural (NA)',
    lat: 18.5204,
    lng: 73.8567,
    ownerWallet: wallet.address || '0x7A4F8b2d4A7C159c99Ec1c1106D9412c19e592F1',
    ownershipType: 'Sole Ownership' as 'Sole Ownership' | 'Joint Tenancy' | 'Corporate Title',
    valuationInINR: 28500000,
    valuationInMATIC: 42500,
  });

  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('Sale Deed');

  // Step 5 Blockchain execution state
  const [txState, setTxState] = useState<{
    status: 'idle' | 'preparing' | 'signing' | 'confirming' | 'confirmed' | 'failed';
    txHash?: string;
    blockNumber?: number;
    newPropertyId?: string;
    error?: string;
  }>({ status: 'idle' });

  const handleDocumentProcessed = (info: UploadedFileInfo) => {
    const newDoc: PropertyDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: info.name,
      type: selectedDocType,
      ipfsCid: info.ipfsCid,
      sha256Hash: info.sha256Hash,
      fileSize: info.size,
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'pending',
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleExecuteRegistration = async () => {
    setTxState({ status: 'preparing' });

    try {
      await new Promise(r => setTimeout(r, 600));
      setTxState(prev => ({ ...prev, status: 'signing' }));

      await new Promise(r => setTimeout(r, 800));
      setTxState(prev => ({ ...prev, status: 'confirming' }));

      // Call propertyService
      const result = await propertyService.registerProperty({
        title: formData.title || `Cadastral Parcel ${formData.surveyNumber}`,
        surveyNumber: formData.surveyNumber,
        propertyType: formData.propertyType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        district: formData.district,
        pinCode: formData.pinCode,
        areaSqFt: Number(formData.areaSqFt),
        landType: formData.landType,
        coordinates: { lat: Number(formData.lat), lng: Number(formData.lng) },
        currentOwnerAddress: formData.ownerWallet,
        ownershipType: formData.ownershipType,
        valuationInINR: Number(formData.valuationInINR),
        valuationInMATIC: Number(formData.valuationInMATIC),
        image: '/src/assets/images/property_pune_villa_1790929193894.jpg',
        documents: documents.length > 0 ? documents : [
          {
            id: 'DOC-NEW-1',
            name: 'Registered Preliminary Title Deed',
            type: 'Sale Deed',
            ipfsCid: 'bafybeicg2k3p4z6bcvx7j7w55w2t6n4f8x5z9a2q3r5t8y7u4i3o2p1m0',
            sha256Hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
            fileSize: '4.2 MB',
            uploadDate: new Date().toISOString().split('T')[0],
            verificationStatus: 'pending',
          }
        ],
      });

      setTxState({
        status: 'confirmed',
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        newPropertyId: result.property.id,
      });
    } catch (err: any) {
      setTxState({
        status: 'failed',
        error: err.message || 'Smart contract transaction rejected by user or RPC.',
      });
    }
  };

  const stepsHeader = [
    { num: 1, title: 'Parcel Details', icon: <Building className="w-4 h-4" /> },
    { num: 2, title: 'Title & Ownership', icon: <UserCheck className="w-4 h-4" /> },
    { num: 3, title: 'Cadastral Deeds (IPFS)', icon: <FileText className="w-4 h-4" /> },
    { num: 4, title: 'Review Dossier', icon: <FileCheck2 className="w-4 h-4" /> },
    { num: 5, title: 'Blockchain Anchor', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Cadastral Land Parcel Registration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Initiate statutory property intake. All geographic surveys and revenue deeds will be anchored to Polygon state.
        </p>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 pb-4">
        {stepsHeader.map(s => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div
              key={s.num}
              className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : isCurrent
                  ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className="truncate">{s.title}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Parcel Details */}
      {currentStep === 1 && (
        <Card>
          <CardHeader
            title="Step 1: Geographic & Municipal Parcel Details"
            subtitle="Enter the formal cadastral survey boundary specifications as documented by the Revenue Department."
          />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Property Dossier Title"
                placeholder="e.g., Riverside Courtyard Residence"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Cadastral Revenue Survey Number"
                placeholder="e.g., SRV-MH-PUN-512/3B"
                value={formData.surveyNumber}
                onChange={e => setFormData({ ...formData, surveyNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Property Classification"
                value={formData.propertyType}
                onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                options={[
                  { value: 'Residential', label: 'Residential' },
                  { value: 'Commercial', label: 'Commercial' },
                  { value: 'Agricultural', label: 'Agricultural' },
                  { value: 'Industrial', label: 'Industrial' },
                ]}
              />
              <Input
                label="Total Parcel Area (sq.ft)"
                type="number"
                value={formData.areaSqFt}
                onChange={e => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                required
              />
              <Input
                label="Land Tenure / Classification"
                placeholder="e.g., Freehold Non-Agricultural (NA)"
                value={formData.landType}
                onChange={e => setFormData({ ...formData, landType: e.target.value })}
              />
            </div>

            <Input
              label="Physical Postal Address"
              placeholder="e.g., Plot 14, Koregaon Park North Avenue"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input
                label="City / Taluka"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                label="District"
                value={formData.district}
                onChange={e => setFormData({ ...formData, district: e.target.value })}
              />
              <Input
                label="State"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                label="PIN Code"
                value={formData.pinCode}
                onChange={e => setFormData({ ...formData, pinCode: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="GPS Latitude"
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={e => setFormData({ ...formData, lat: Number(e.target.value) })}
              />
              <Input
                label="GPS Longitude"
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={e => setFormData({ ...formData, lng: Number(e.target.value) })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end w-full">
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                disabled={!formData.surveyNumber.trim()}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Title Information
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Ownership Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader
            title="Step 2: Legal Ownership & Beneficiary Structure"
            subtitle="Link the verified Web3 wallet address representing the statutory beneficiary."
          />
          <CardContent className="space-y-4">
            <Input
              label="Primary Owner Wallet Address (Polygon)"
              value={formData.ownerWallet}
              onChange={e => setFormData({ ...formData, ownerWallet: e.target.value })}
              helperText="The private key of this address will hold minting and conveyancing rights."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Title Ownership Type"
                value={formData.ownershipType}
                onChange={e => setFormData({ ...formData, ownershipType: e.target.value as any })}
                options={[
                  { value: 'Sole Ownership', label: 'Sole Ownership' },
                  { value: 'Joint Tenancy', label: 'Joint Tenancy' },
                  { value: 'Corporate Title', label: 'Corporate Title' },
                ]}
              />

              <Input
                label="Current Cadastral Valuation (INR)"
                type="number"
                value={formData.valuationInINR}
                onChange={e =>
                  setFormData({
                    ...formData,
                    valuationInINR: Number(e.target.value),
                    valuationInMATIC: Math.round(Number(e.target.value) / 670),
                  })
                }
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-800">Equivalent Token Valuation:</span>
              <p className="font-mono text-slate-700 text-sm">
                {formData.valuationInMATIC.toLocaleString()} MATIC (Estimated via Polygon Oracle)
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setCurrentStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Document Upload
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Documents Upload */}
      {currentStep === 3 && (
        <Card>
          <CardHeader
            title="Step 3: Cadastral Deeds & IPFS Document Anchoring"
            subtitle="Upload original stamped deeds, survey maps, and NOCs. Cryptographic SHA-256 hashes are computed locally."
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Document Classification"
                value={selectedDocType}
                onChange={e => setSelectedDocType(e.target.value as DocumentType)}
                options={[
                  { value: 'Sale Deed', label: 'Sale Deed (Registered)' },
                  { value: 'Survey Map', label: 'Cadastral Survey Map' },
                  { value: 'Tax Receipt', label: 'Property Tax Receipt / Assessment' },
                  { value: 'Mutation Certificate', label: 'Mutation Certificate (7/12)' },
                  { value: 'NOC', label: 'No Objection Certificate (NOC)' },
                  { value: 'Identity Proof', label: 'Owner Identity Proof' },
                ]}
              />
            </div>

            <FileUpload
              onFileProcessed={handleDocumentProcessed}
              documentType={selectedDocType}
            />

            {documents.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-semibold text-slate-900">
                  Ready to Pin on IPFS ({documents.length})
                </h4>
                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{doc.name}</span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">{doc.type}</span>
                          <span>·</span>
                          <span className="font-mono">{doc.ipfsCid.slice(0, 16)}...</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[11px] text-slate-600 block">
                          SHA: {doc.sha256Hash.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setCurrentStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review Dossier
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Review Dossier */}
      {currentStep === 4 && (
        <Card>
          <CardHeader
            title="Step 4: Review Registration Dossier"
            subtitle="Verify all cadastral details before generating the immutable smart contract creation transaction."
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Title</span>
                <span className="font-semibold text-slate-900">{formData.title || 'Untitled Parcel'}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Revenue Survey Number</span>
                <span className="font-mono font-semibold text-slate-900">{formData.surveyNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Location</span>
                <span className="text-slate-800">{formData.address}, {formData.city}, {formData.state} - {formData.pinCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Area & Tenure</span>
                <span className="text-slate-800">{formData.areaSqFt} sq.ft · {formData.landType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Beneficiary Wallet</span>
                <AddressDisplay address={formData.ownerWallet} truncateLength={6} />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Attached Documents</span>
                <span className="font-semibold text-slate-900">{documents.length || 1} Deeds Prepared</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <strong className="block mb-0.5">Statutory Submission Notice:</strong>
              Submitting this record commits the parcel hash to the Polygon testnet. A Sub-Registrar officer will review deeds before issuing statutory title endorsement.
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setCurrentStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setCurrentStep(5);
                handleExecuteRegistration();
              }}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Sign & Register on Blockchain
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 5: Blockchain Registration Execution */}
      {currentStep === 5 && (
        <Card>
          <CardHeader
            title="Step 5: Polygon Blockchain Registration"
            subtitle="Processing smart contract intake on LandRegistry contract."
          />
          <CardContent className="space-y-6">
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 text-xs">
                {txState.status === 'confirmed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : txState.status === 'failed' ? (
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px]">✕</div>
                ) : (
                  <Loader2 className="w-5 h-5 text-slate-800 animate-spin shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-slate-900">
                    {txState.status === 'preparing' && 'Preparing Cadastral Payload...'}
                    {txState.status === 'signing' && 'Waiting for Wallet EIP-712 Signature...'}
                    {txState.status === 'confirming' && 'Transaction Broadcast: Waiting for Block Consensus...'}
                    {txState.status === 'confirmed' && 'Property Registered Successfully on Blockchain!'}
                    {txState.status === 'failed' && 'Registration Transaction Failed'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Target Contract: {APP_CONFIG.contracts.landRegistry}
                  </p>
                </div>
              </div>

              {txState.status === 'confirmed' && txState.txHash && (
                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Property ID:</span>
                    <span className="font-mono font-bold text-slate-900">{txState.newPropertyId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction Hash:</span>
                    <HashDisplay hash={txState.txHash} truncateLength={8} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Block Height:</span>
                    <span className="font-mono font-medium text-slate-900">#{txState.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-700 font-semibold">Pending Government Review</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {txState.status === 'confirmed' ? (
              <div className="flex justify-between w-full">
                <ExplorerLink type="tx" value={txState.txHash || ''} label="View on PolygonScan" />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/properties/${txState.newPropertyId}`)}
                >
                  View Property Dossier
                </Button>
              </div>
            ) : txState.status === 'failed' ? (
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(4)}>
                Retry
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
