import React, { useState } from 'react';
import type { PropertyDocument } from '../../types';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { HashDisplay } from '../ui/HashDisplay';
import { StatusBadge } from '../ui/StatusBadge';
import { FileText, ExternalLink, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '../../constants';
import { IPFSService } from '../../services/ipfs/ipfsService';
import { FileUpload, type UploadedFileInfo } from '../ui/FileUpload';

export const PropertyDocuments: React.FC<{
  documents: PropertyDocument[];
  onAddDocument?: (doc: PropertyDocument) => void;
  canUpload?: boolean;
}> = ({ documents, onAddDocument, canUpload = false }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleFileUploaded = (info: UploadedFileInfo) => {
    if (onAddDocument) {
      const newDoc: PropertyDocument = {
        id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
        name: info.name,
        type: info.type,
        ipfsCid: info.ipfsCid,
        sha256Hash: info.sha256Hash,
        fileSize: info.size,
        uploadDate: new Date().toISOString().split('T')[0],
        verificationStatus: 'pending',
      };
      onAddDocument(newDoc);
      setShowUpload(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Decentralized Cadastral Documents & Deeds"
        subtitle="All legal instruments are stored on IPFS and cryptographically anchored to Polygon state."
        action={
          canUpload && !showUpload ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(true)}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Attach Deed / Map
            </Button>
          ) : undefined
        }
      />
      <CardContent>
        {showUpload && (
          <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-900">Upload New Cadastral Instrument</h4>
              <button
                onClick={() => setShowUpload(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <FileUpload onFileProcessed={handleFileUploaded} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Document Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">IPFS CID</th>
                <th className="py-2.5 px-3">Cryptographic SHA-256</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{doc.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {doc.fileSize} · Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <a
                      href={IPFSService.getGatewayUrl(doc.ipfsCid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-700 hover:text-slate-900 underline flex items-center gap-1"
                    >
                      <span>{doc.ipfsCid.slice(0, 12)}...{doc.ipfsCid.slice(-6)}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <HashDisplay hash={doc.sha256Hash} truncateLength={6} showExplorerLink={false} />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusBadge status={doc.verificationStatus} />
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <a
                      href={IPFSService.getGatewayUrl(doc.ipfsCid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-800 hover:text-slate-900 inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50"
                    >
                      <span>Verify CID</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
