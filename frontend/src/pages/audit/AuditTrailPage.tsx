import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/blockchain/auditService';
import type { AuditEvent, AuditEventType } from '../../types';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { HashDisplay } from '../../components/ui/HashDisplay';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { ExplorerLink } from '../../components/ui/ExplorerLink';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { History, Search, Filter, ShieldCheck, Layers, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuditTrailPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    setEvents(auditService.getAllEvents());
  };

  useEffect(() => {
    loadData();
    return auditService.subscribe(loadData);
  }, []);

  const filteredEvents = auditService.filterEvents({
    eventType: filterType === 'ALL' ? 'ALL' : (filterType as AuditEventType),
    searchTerm,
  });

  const eventTabs = [
    { id: 'ALL', label: 'All Consensus Events', badge: events.length },
    { id: 'PropertyRegistered', label: 'Registrations', badge: events.filter(e => e.eventType === 'PropertyRegistered').length },
    { id: 'PropertyApproved', label: 'Registrar Approvals', badge: events.filter(e => e.eventType === 'PropertyApproved').length },
    { id: 'NFTMinted', label: 'NFT Mints', badge: events.filter(e => e.eventType === 'NFTMinted').length },
    { id: 'TransferCompleted', label: 'Conveyance', badge: events.filter(e => e.eventType === 'TransferCompleted').length },
  ];

  const columns: Column<AuditEvent>[] = [
    {
      key: 'id',
      header: 'Event ID',
      render: e => <span className="font-mono font-bold text-slate-900">{e.id}</span>,
      sortable: true,
      width: '100px',
    },
    {
      key: 'eventType',
      header: 'Event Classification',
      render: e => (
        <div>
          <span className="font-semibold text-slate-900 text-xs">{e.eventType}</span>
          <span className="text-[11px] text-slate-400 block">{e.role}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'propertyId',
      header: 'Parcel ID',
      render: e => (
        <Link to={`/properties/${e.propertyId}`} className="font-mono text-slate-900 font-semibold hover:underline">
          {e.propertyId}
        </Link>
      ),
      sortable: true,
    },
    {
      key: 'details',
      header: 'State Transformation Description',
      render: e => (
        <p className="text-xs text-slate-600 line-clamp-1 max-w-xs">{e.details}</p>
      ),
    },
    {
      key: 'actorAddress',
      header: 'Actor Wallet',
      render: e => <AddressDisplay address={e.actorAddress} truncateLength={4} showExplorerLink />,
    },
    {
      key: 'blockNumber',
      header: 'Block Height',
      render: e => <span className="font-mono tabular-nums text-slate-700">#{e.blockNumber}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'txHash',
      header: 'Transaction Hash',
      render: e => <HashDisplay hash={e.txHash} truncateLength={4} />,
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: e => (
        <span className="text-slate-400 font-mono text-[11px]">
          {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Immutable Cadastral Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete cryptographic audit trail of all land title registrations, document hashes, approvals, and smart contract transfers.
          </p>
        </div>

        <Link to="/admin/fraud-detection">
          <Button variant="outline" size="sm" leftIcon={<ShieldCheck className="w-4 h-4" />}>
            Run Heuristic Fraud Audit
          </Button>
        </Link>
      </div>

      <div className="border-b border-slate-200 pb-3">
        <Tabs tabs={eventTabs} activeTab={filterType} onChange={setFilterType} />
      </div>

      <DataTable
        columns={columns}
        data={filteredEvents}
        keyExtractor={e => e.id}
        searchPlaceholder="Filter events by tx hash, parcel ID, actor..."
        pageSize={10}
      />
    </div>
  );
};
