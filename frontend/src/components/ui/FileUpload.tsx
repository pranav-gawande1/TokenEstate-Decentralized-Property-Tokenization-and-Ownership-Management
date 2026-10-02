import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { IPFSService } from '../../services/ipfs/ipfsService';
import type { DocumentType } from '../../types';

export interface UploadedFileInfo {
  file: File;
  name: string;
  type: DocumentType;
  sha256Hash: string;
  ipfsCid: string;
  size: string;
}

interface FileUploadProps {
  onFileProcessed: (info: UploadedFileInfo) => void;
  documentType?: DocumentType;
  label?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileProcessed,
  documentType = 'Sale Deed',
  label = 'Upload Cadastral Document',
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadedFileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const { cid, hash, size } = await IPFSService.uploadToIPFS(file);
      const fileInfo: UploadedFileInfo = {
        file,
        name: file.name,
        type: documentType,
        sha256Hash: hash,
        ipfsCid: cid,
        size,
      };
      setCurrentFile(fileInfo);
      onFileProcessed(fileInfo);
    } catch (err: any) {
      setError('Failed to calculate SHA-256 hash or pin to IPFS.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-slate-900 bg-slate-100/50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.json,.tiff"
          onChange={handleChange}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-3">
            <Loader2 className="w-8 h-8 text-slate-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-700">
              Generating SHA-256 checksum & IPFS CID...
            </p>
          </div>
        ) : currentFile ? (
          <div className="flex items-center justify-between text-left p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-6 h-6 text-slate-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{currentFile.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{currentFile.size}</span>
                  <span>·</span>
                  <span className="font-mono text-slate-600">{currentFile.ipfsCid.slice(0, 16)}...</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-medium text-slate-800">
              Click to upload deed/map or drag & drop file
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              PDF, TIFF, PNG, or JPEG up to 25 MB (Cryptographically hashed client-side)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
