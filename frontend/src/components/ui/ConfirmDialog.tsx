import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'success';
  isLoading?: boolean;
  metaDetails?: { label: string; value: string }[];
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm & Sign',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
  metaDetails,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

        {metaDetails && metaDetails.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 text-xs space-y-2">
            {metaDetails.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">{item.label}</span>
                <span className="font-mono font-medium text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={variant === 'primary' ? <ShieldCheck className="w-4 h-4" /> : undefined}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
