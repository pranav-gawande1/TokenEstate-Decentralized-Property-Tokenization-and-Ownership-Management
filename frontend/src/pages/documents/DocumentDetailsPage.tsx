import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyService } from '../../services/blockchain/propertyService';
import type { PropertyDocument, Property } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { IPFSService } from '../../services/ipfs/ipfsService';
import { FileText, ExternalLink, ShieldCheck, ArrowLeft, CheckCircle2, Download } from 'lucide-react';

export const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<PropertyDocument | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const load = async () => {
      const all = await propertyService.getAllProperties();
      for (const p of all) {
        const found = p.documents.find(d => d.id === id);
        if (found) {
          setDoc(found);
          setProperty(p);
          break;
        }
      }
    };
    load();
  }, [id]);

  if (!doc || !property) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Document Record Not Found</h2>
        <p className="text-xs text-slate-500">No instrument matching ID "{id}" exists in the IPFS ledger.</p>
        <Link to="/documents">
          <Button variant="primary" size="sm">
            Back to Documents
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-slate-500">{doc.id} · {doc.type}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            {doc.name}
          </h1>
        </div>
        <StatusBadge status={doc.verificationStatus} size="md" />
      </div>

      <Card>
        <CardHeader
          title="Cryptographic Instrument Specifications"
          subtitle={`Associated with Cadastral Record ${property.id} (${property.title})`}
          action={
            <a
              href={IPFSService.getGatewayUrl(doc.ipfsCid)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>Inspect IPFS Node</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          }
        />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 block">Content Addressed CID (IPFS v1)</span>
              <span className="font-mono text-slate-900 font-semibold break-all text-xs">
                {doc.ipfsCid}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-400 block">Cryptographic Checksum (SHA-256)</span>
              <span className="font-mono text-slate-900 font-semibold break-all text-xs">
                {doc.sha256Hash}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">File Size</span>
              <span className="font-semibold text-slate-900">{doc.fileSize}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Upload Date</span>
              <span className="font-semibold text-slate-900">{doc.uploadDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Revenue Survey</span>
              <span className="font-mono font-semibold text-slate-900">{property.surveyNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Verification Agent</span>
              <span className="font-semibold text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sub-Registrar
              </span>
            </div>
          </div>

          {doc.notes && (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-slate-700">Official Endorsement Note:</span>
              <p className="text-slate-600">{doc.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Link to="/documents">
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Documents Repository
              </Button>
            </Link>
            <Link to={`/properties/${property.id}`}>
              <Button variant="primary" size="sm">
                View Parent Cadastral Dossier
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
