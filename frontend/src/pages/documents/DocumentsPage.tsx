import React, { useState, useEffect } from 'react';
import { propertyService } from '../../services/blockchain/propertyService';
import type { PropertyDocument, Property } from '../../types';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { FileText, ExternalLink, ShieldCheck, Database, Search } from 'lucide-react';
import { IPFSService } from '../../services/ipfs/ipfsService';
import { Link } from 'react-router-dom';

interface FlattenedDoc extends PropertyDocument {
  propertyId: string;
  propertyTitle: string;
  surveyNumber: string;
}

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState<FlattenedDoc[]>([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      const props = await propertyService.getAllProperties();
      const list: FlattenedDoc[] = [];
      props.forEach(p => {
        p.documents.forEach(d => {
          list.push({
            ...d,
            propertyId: p.id,
            propertyTitle: p.title,
            surveyNumber: p.surveyNumber,
          });
        });
      });
      setDocs(list);
    };

    load();
    return propertyService.subscribe(load);
  }, []);

  const filtered = docs.filter(d => {
    if (activeTab !== 'ALL' && d.type !== activeTab) return false;
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      return (
        d.name.toLowerCase().includes(t) ||
        d.propertyId.toLowerCase().includes(t) ||
        d.surveyNumber.toLowerCase().includes(t) ||
        d.ipfsCid.toLowerCase().includes(t)
      );
    }
    return true;
  });

  const docTabs = [
    { id: 'ALL', label: 'All Instruments', badge: docs.length },
    { id: 'Sale Deed', label: 'Sale Deeds', badge: docs.filter(d => d.type === 'Sale Deed').length },
    { id: 'Survey Map', label: 'Survey Maps', badge: docs.filter(d => d.type === 'Survey Map').length },
    { id: 'Mutation Certificate', label: '7/12 & Mutation', badge: docs.filter(d => d.type === 'Mutation Certificate').length },
    { id: 'Tax Receipt', label: 'Tax Receipts', badge: docs.filter(d => d.type === 'Tax Receipt').length },
  ];

  const columns: Column<FlattenedDoc>[] = [
    {
      key: 'name',
      header: 'Instrument Title',
      render: d => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900 line-clamp-1">{d.name}</p>
            <p className="text-[11px] text-slate-400">{d.fileSize} · {d.uploadDate}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'propertyId',
      header: 'Cadastral Parcel',
      render: d => (
        <Link to={`/properties/${d.propertyId}`} className="hover:underline">
          <span className="font-mono font-bold text-slate-900">{d.propertyId}</span>
          <span className="text-slate-400 block text-[11px]">Survey {d.surveyNumber}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      key: 'type',
      header: 'Category',
      render: d => <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{d.type}</span>,
      sortable: true,
    },
    {
      key: 'ipfsCid',
      header: 'IPFS Content CID',
      render: d => (
        <a
          href={IPFSService.getGatewayUrl(d.ipfsCid)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-slate-700 hover:text-slate-900 underline flex items-center gap-1"
        >
          <span>{d.ipfsCid.slice(0, 10)}...{d.ipfsCid.slice(-4)}</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      ),
    },
    {
      key: 'sha256Hash',
      header: 'SHA-256 Digest',
      render: d => <HashDisplay hash={d.sha256Hash} truncateLength={4} showExplorerLink={false} />,
    },
    {
      key: 'verificationStatus',
      header: 'Provenance',
      render: d => <StatusBadge status={d.verificationStatus} />,
      sortable: true,
    },
    {
      key: 'actions',
      header: '',
      render: d => (
        <Link
          to={`/documents/${d.id}`}
          className="text-xs font-semibold text-slate-800 hover:text-slate-900 underline"
        >
          Audit
        </Link>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Decentralized Deed & Cadastral Repository
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident legal instruments stored on IPFS nodes with cryptographic SHA-256 hashes registered on Polygon.
          </p>
        </div>

        <Link to="/verification/document">
          <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-4 h-4" />}>
            Verify Deed Checksum
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <Tabs tabs={docTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={d => `${d.propertyId}-${d.id}`}
        searchPlaceholder="Filter deeds by title, CID, property..."
        pageSize={8}
      />
    </div>
  );
};
