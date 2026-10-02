import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { FileUpload, type UploadedFileInfo } from '../../components/ui/FileUpload';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { documentService, type VerificationResult } from '../../services/blockchain/documentService';
import { IPFSService } from '../../services/ipfs/ipfsService';
import { CheckCircle2, AlertTriangle, FileText, Search, ShieldCheck, ExternalLink } from 'lucide-react';

export const DocumentVerificationPage: React.FC = () => {
  const [queryInput, setQueryInput] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleFileUploaded = async (info: UploadedFileInfo) => {
    setIsChecking(true);
    setSearched(true);
    try {
      // Check if file hash exists anywhere in the repository
      const matched = await documentService.verifyByCidOrHash(info.sha256Hash);
      if (matched) {
        setResult(matched);
      } else {
        setResult({
          matches: false,
          computedHash: info.sha256Hash,
          ipfsCid: info.ipfsCid,
          verifiedAt: new Date().toISOString(),
          discrepancyNote: 'Document Integrity Warning: The calculated cryptographic SHA-256 hash does not match any registered deed or survey map in the official blockchain ledger.',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleQuerySearch = async () => {
    if (!queryInput.trim()) return;
    setIsChecking(true);
    setSearched(true);
    try {
      const res = await documentService.verifyByCidOrHash(queryInput.trim());
      if (res) {
        setResult(res);
      } else {
        setResult({
          matches: false,
          computedHash: queryInput.trim(),
          verifiedAt: new Date().toISOString(),
          discrepancyNote: 'No matching deed hash or IPFS CID found on the Polygon blockchain state.',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Cryptographic Document Hash Verification
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verify digital land titles, survey maps, and mutation certificates against immutable Polygon consensus state and IPFS records.
        </p>
      </div>

      {/* Upload File Box */}
      <Card>
        <CardHeader
          title="Upload Physical or Digital Deed for Client-Side Audit"
          subtitle="Your document never leaves your browser unencrypted. A SHA-256 checksum is calculated locally using the Web Crypto API."
        />
        <CardContent className="space-y-6">
          <FileUpload
            label="Drop deed or survey map here"
            onFileProcessed={handleFileUploaded}
          />

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Or Query by IPFS CID / Hash
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Paste IPFS CID (bafy...) or SHA-256 Hash (0x...)"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleQuerySearch}
              isLoading={isChecking}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Verify Ledger Record
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Result Card */}
      {searched && result && (
        <Card className={`border-2 ${result.matches ? 'border-emerald-300 bg-emerald-50/20' : 'border-red-300 bg-red-50/20'}`}>
          <CardHeader
            title={
              <div className="flex items-center gap-2">
                {result.matches ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-900 font-bold">Document Integrity Verified</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-900 font-bold">Integrity Discrepancy Detected</span>
                  </>
                )}
              </div>
            }
            subtitle={
              result.matches
                ? 'The cryptographic hash matches the original registered deed on the Polygon blockchain.'
                : 'The computed hash does not correspond to any approved statutory deed in the ledger.'
            }
          />
          <CardContent className="space-y-4">
            {result.matches && result.document ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">Associated Property</span>
                    <span className="font-semibold text-slate-900">{result.propertyId}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">Document Classification</span>
                    <span className="font-semibold text-slate-900">{result.document.type}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono bg-white p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <span className="text-slate-500 font-sans">Original Anchored Hash:</span>
                    <HashDisplay hash={result.expectedHash || ''} truncateLength={10} />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <span className="text-slate-500 font-sans">Computed Client Hash:</span>
                    <span className="text-emerald-700 font-bold">{result.computedHash}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                    <span className="text-slate-500 font-sans">IPFS Storage CID:</span>
                    <span className="text-slate-800 break-all">{result.ipfsCid}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
                  <span>Verified by Sub-Registrar: {result.document.verifiedBy || 'Government Official'}</span>
                  <span>{new Date(result.verifiedAt).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-red-200 text-xs space-y-2 text-red-900">
                <p className="font-semibold">{result.discrepancyNote}</p>
                <div className="font-mono text-slate-600 bg-slate-50 p-2 rounded break-all">
                  Queried Digest: {result.computedHash}
                </div>
                <p className="text-[11px] text-slate-500">
                  If this is a physical paper copy, verify whether any amendments, annotations, or alterations were made after initial registration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
