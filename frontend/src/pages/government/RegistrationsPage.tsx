import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/blockchain/propertyService';
import type { Property } from '../../types';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, FileText } from 'lucide-react';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { APP_CONFIG } from '../../constants';

export const GovernmentRegistrationsPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [selectedToApprove, setSelectedToApprove] = useState<Property | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const loadData = async () => {
    const all = await propertyService.getAllProperties();
    setProperties(all);
  };

  useEffect(() => {
    loadData();
    return propertyService.subscribe(loadData);
  }, []);

  const displayed = pendingOnly
    ? properties.filter(p => p.status === 'pending_verification')
    : properties;

  const handleConfirmApproval = async () => {
    if (!selectedToApprove) return;
    setIsApproving(true);
    try {
      await propertyService.approveProperty(
        selectedToApprove.id,
        '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        'Cadastral survey & statutory deeds verified and approved on Polygon blockchain.'
      );
      setSelectedToApprove(null);
      loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsApproving(false);
    }
  };

  const columns: Column<Property>[] = [
    {
      key: 'id',
      header: 'Parcel ID',
      render: p => <span className="font-mono font-bold text-slate-900">{p.id}</span>,
      sortable: true,
      width: '100px',
    },
    {
      key: 'surveyNumber',
      header: 'Survey Number',
      render: p => (
        <div>
          <span className="font-mono font-semibold text-slate-900 text-xs">{p.surveyNumber}</span>
          <span className="text-[11px] text-slate-400 block">{p.landType}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'title',
      header: 'Title & Location',
      render: p => (
        <div>
          <p className="font-semibold text-slate-900">{p.title}</p>
          <p className="text-[11px] text-slate-500">{p.city}, {p.state} · {p.district}</p>
        </div>
      ),
    },
    {
      key: 'currentOwnerAddress',
      header: 'Applicant Wallet',
      render: p => <AddressDisplay address={p.currentOwnerAddress} truncateLength={4} showExplorerLink />,
    },
    {
      key: 'documents',
      header: 'Deeds Attached',
      render: p => (
        <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          {p.documents.length} Instruments
        </span>
      ),
    },
    {
      key: 'registrationDate',
      header: 'Submitted',
      render: p => <span className="text-slate-500 font-mono text-[11px]">{p.registrationDate}</span>,
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: p => <StatusBadge status={p.status} />,
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Adjudication',
      render: p => (
        <div className="flex items-center justify-end gap-2">
          <Link to={`/properties/${p.id}`}>
            <Button variant="outline" size="sm">
              Review
            </Button>
          </Link>
          {p.status === 'pending_verification' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => setSelectedToApprove(p)}
              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
            >
              Sign
            </Button>
          )}
        </div>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#061D15] via-[#0B2C21] to-[#061D15] text-white p-6 rounded-2xl border border-emerald-900/70 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800/80 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Registrar Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cadastral Registrations Intake Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Official Sub-Registrar desk for adjudicating survey numbers, revenue indices, and executing Polygon consensus approval.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 shadow-sm font-semibold"
            onClick={() => setPendingOnly(!pendingOnly)}
          >
            {pendingOnly ? 'Showing Pending Only' : 'Show All Dossiers'}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayed}
        keyExtractor={p => p.id}
        searchPlaceholder="Filter dossiers by survey, parcel ID, applicant..."
        pageSize={8}
      />

      {/* Approval Confirmation Dialog */}
      {selectedToApprove && (
        <ConfirmDialog
          isOpen={!!selectedToApprove}
          onClose={() => setSelectedToApprove(null)}
          onConfirm={handleConfirmApproval}
          title="Sign & Approve Cadastral Record"
          description="You are issuing official Department certification for this land parcel. This will generate an on-chain transaction from the Registrar authority on Polygon Amoy, certifying boundaries and enabling tokenization."
          confirmText="Confirm & Sign on Blockchain"
          isLoading={isApproving}
          metaDetails={[
            { label: 'Parcel ID', value: selectedToApprove.id },
            { label: 'Survey Number', value: selectedToApprove.surveyNumber },
            { label: 'Applicant Wallet', value: selectedToApprove.currentOwnerAddress },
            { label: 'Attached Deeds', value: `${selectedToApprove.documents.length} Verified` },
            { label: 'Target Network', value: APP_CONFIG.network.name },
          ]}
        />
      )}
    </div>
  );
};
