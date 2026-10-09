import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/blockchain/propertyService';
import type { Property, PropertyStatus } from '../../types';
import { PropertyCard } from '../../components/property/PropertyCard';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AddressDisplay } from '../../components/ui/AddressDisplay';
import { PlusCircle, LayoutGrid, List, Search, Filter } from 'lucide-react';

export const PropertiesListPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await propertyService.getAllProperties();
      setProperties(data);
      setIsLoading(false);
    };

    load();
  }, []);

  useEffect(() => {
    let result = [...properties];

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.surveyNumber.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.id.toLowerCase().includes(term)
      );
    }

    setFilteredProperties(result);
  }, [properties, statusFilter, searchTerm]);

  const filterTabs = [
    { id: 'all', label: 'All Parcels', badge: properties.length },
    { id: 'verified', label: 'Verified', badge: properties.filter(p => p.status === 'verified').length },
    { id: 'tokenized', label: 'Tokenized (ERC-721)', badge: properties.filter(p => p.status === 'tokenized').length },
    { id: 'pending_verification', label: 'Pending Review', badge: properties.filter(p => p.status === 'pending_verification').length },
  ];

  const columns: Column<Property>[] = [
    {
      key: 'id',
      header: 'Property ID',
      render: p => <span className="font-mono font-bold text-slate-900">{p.id}</span>,
      sortable: true,
      width: '110px',
    },
    {
      key: 'title',
      header: 'Title & Location',
      render: p => (
        <div>
          <p className="font-semibold text-slate-900">{p.title}</p>
          <p className="text-[11px] text-slate-500">{p.city}, {p.state} · Survey {p.surveyNumber}</p>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'areaSqFt',
      header: 'Area (sq.ft)',
      render: p => <span className="tabular-nums font-medium">{p.areaSqFt.toLocaleString()}</span>,
      sortable: true,
      align: 'right',
    },
    {
      key: 'valuationInINR',
      header: 'Valuation',
      render: p => (
        <span className="font-mono font-semibold text-slate-900 tabular-nums">
          ₹{(p.valuationInINR / 100000).toFixed(1)} Lakh
        </span>
      ),
      sortable: true,
      align: 'right',
    },
    {
      key: 'currentOwnerAddress',
      header: 'Owner Wallet',
      render: p => <AddressDisplay address={p.currentOwnerAddress} truncateLength={4} showCopy={false} />,
    },
    {
      key: 'status',
      header: 'Status',
      render: p => <StatusBadge status={p.status} />,
      sortable: true,
    },
    {
      key: 'actions',
      header: '',
      render: p => (
        <Link
          to={`/properties/${p.id}`}
          className="text-xs font-semibold text-slate-800 hover:text-slate-900 underline"
        >
          Dossier
        </Link>
      ),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#101C3F] to-[#0A122A] text-white p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/80 mb-2">
            <span>Official Cadastral Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Cadastral Property Ledger
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Official decentralized register of surveyed parcels, validated titles, and tokenized deeds on Polygon.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/properties/register">
            <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Register New Property
            </Button>
          </Link>
        </div>
      </div>

      {/* Controls Bar: Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <Tabs tabs={filterTabs} activeTab={statusFilter} onChange={setStatusFilter} />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filter by title, survey, city..."
              className="text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center border border-slate-300 rounded-lg p-0.5 bg-white">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Display View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProperties}
          keyExtractor={p => p.id}
          searchable={false}
          pageSize={8}
        />
      )}
    </div>
  );
};
