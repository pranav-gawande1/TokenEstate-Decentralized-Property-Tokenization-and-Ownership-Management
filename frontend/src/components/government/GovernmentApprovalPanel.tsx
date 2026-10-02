import React, { useState } from 'react';
import type { Property } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';
import { StatusBadge } from '../ui/StatusBadge';
import { AddressDisplay } from '../ui/AddressDisplay';
import { HashDisplay } from '../ui/HashDisplay';
import { ShieldCheck, XCircle, CheckCircle2, AlertTriangle, FileText, Database } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import { propertyService } from '../../services/blockchain/propertyService';

export const GovernmentApprovalPanel: React.FC<{
  property: Property;
  onApproveSuccess: () => void;
  onRejectSuccess: () => void;
}> = ({ property, onApproveSuccess, onRejectSuccess }) => {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fraudReport = propertyService.getFraudReport(property.id);

  const handleConfirmApproval = async () => {
    setIsLoading(true);
    try {
      await propertyService.approveProperty(
        property.id,
        '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        'Sub-Registrar verified cadastral survey, deeds & encumbrance certificate. Sanctioned on-chain.'
      );
      setIsApproveOpen(false);
      onApproveSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectReason.trim()) return;
    setIsLoading(true);
    try {
      await propertyService.rejectProperty(
        property.id,
        '0xAB309F14a601569BdB21E885B9E780c109A0191D',
        rejectReason
      );
      setIsRejectOpen(false);
      onRejectSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-300">
      <CardHeader
        title="Sub-Registrar Cadastral Adjudication & Signing Panel"
        subtitle="Government official interface for issuing immutable blockchain certification on Polygon state."
        action={<StatusBadge status={property.status} size="md" />}
      />
      <CardContent className="space-y-6">
        {/* Verification Check Matrix */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Automated Cadastral Verification Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Survey ID Unique in State Ledger</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Titleholder Identity Hash Valid</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No Active Encumbrance / Caveat</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sale Deed IPFS CID Intact</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>GIS Coordinates Inside Boundary</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Revenue Department Concordance</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            <span>Signing Authority: Sub-Registrar Haveli District (Maharashtra)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="text-red-700 border-red-200 hover:bg-red-50 flex-1 sm:flex-initial"
              onClick={() => setIsRejectOpen(true)}
              leftIcon={<XCircle className="w-4 h-4 text-red-600" />}
            >
              Reject Dossier
            </Button>
            <Button
              variant="success"
              size="md"
              className="flex-1 sm:flex-initial"
              onClick={() => setIsApproveOpen(true)}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Sign & Approve Registration
            </Button>
          </div>
        </div>

        {/* Approval Modal */}
        <ConfirmDialog
          isOpen={isApproveOpen}
          onClose={() => setIsApproveOpen(false)}
          onConfirm={handleConfirmApproval}
          title="Approve Property Registration on Blockchain"
          description="This action executes a cryptographic transaction from the authorized Registrar wallet on Polygon Amoy, certifying the survey record and enabling tokenization."
          confirmText="Confirm & Sign on Polygon"
          isLoading={isLoading}
          metaDetails={[
            { label: 'Property ID', value: property.id },
            { label: 'Survey Number', value: property.surveyNumber },
            { label: 'Applicant Wallet', value: property.currentOwnerAddress },
            { label: 'Network', value: APP_CONFIG.network.name },
            { label: 'Contract Address', value: APP_CONFIG.contracts.landRegistry },
          ]}
        />

        {/* Rejection Modal */}
        <Modal
          isOpen={isRejectOpen}
          onClose={() => setIsRejectOpen(false)}
          title="Reject Property Registration"
          subtitle="Specify statutory grounds for rejection. This rejection will be permanently recorded in the blockchain audit trail."
          maxWidth="md"
        >
          <div className="space-y-4">
            <Textarea
              label="Statutory Reason for Rejection"
              required
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g., Boundary conflict with municipal road widening reservation, or incomplete stamp duty clearance..."
            />
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmRejection}
                disabled={!rejectReason.trim()}
                isLoading={isLoading}
              >
                Record Rejection
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};
