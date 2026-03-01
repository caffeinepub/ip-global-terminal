import React, { useState, useMemo } from 'react';
import { Search, Loader2, Database } from 'lucide-react';
import { IPCategory } from '../backend';
import {
  useGetAllIPs,
  useSearchByTitleOrHash,
  useFilterByCategory,
  useFilterByJurisdiction,
} from '../hooks/useQueries';
import IPCard from '../components/IPCard';
import IPDetailModal from '../components/IPDetailModal';
import type { IPRecord } from '../backend';

const JURISDICTIONS = [
  'Global', 'United States', 'European Union', 'United Kingdom', 'China',
  'Japan', 'India', 'Australia', 'Canada', 'Brazil', 'South Korea',
  'Singapore', 'Switzerland', 'Germany', 'France', 'Netherlands',
];

export default function IPDatabase() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<IPCategory | ''>('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<IPRecord | null>(null);

  // Pass number literals — the hook converts to bigint internally
  const allIPs = useGetAllIPs(0, 200);
  const searchResults = useSearchByTitleOrHash(search);
  const categoryResults = useFilterByCategory(categoryFilter as IPCategory);
  const jurisdictionResults = useFilterByJurisdiction(jurisdictionFilter);

  const records = useMemo(() => {
    if (search.trim()) return searchResults.data ?? [];
    if (categoryFilter) return categoryResults.data ?? [];
    if (jurisdictionFilter) return jurisdictionResults.data ?? [];
    return allIPs.data ?? [];
  }, [search, categoryFilter, jurisdictionFilter, allIPs.data, searchResults.data, categoryResults.data, jurisdictionResults.data]);

  const isLoading =
    allIPs.isLoading ||
    (search.trim() ? searchResults.isLoading : false) ||
    (categoryFilter ? categoryResults.isLoading : false) ||
    (jurisdictionFilter ? jurisdictionResults.isLoading : false);

  const selectStyle: React.CSSProperties = {
    backgroundColor: 'oklch(0.13 0 0)',
    border: '1px solid oklch(0.25 0.02 85 / 0.4)',
    color: 'oklch(0.80 0 0)',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    outline: 'none',
    cursor: 'pointer',
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'oklch(0.08 0 0)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6" style={{ color: 'oklch(0.78 0.15 85)' }} />
            <h1
              className="text-3xl font-bold"
              style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
            >
              Global IP Database
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'oklch(0.55 0 0)' }}>
            Browse all intellectual property records registered on the Internet Computer blockchain.
          </p>
        </div>

        {/* Search & Filters */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{
            backgroundColor: 'oklch(0.11 0 0)',
            border: '1px solid oklch(0.22 0.02 85 / 0.4)',
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'oklch(0.50 0 0)' }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or SHA-256 hash…"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
                style={{
                  backgroundColor: 'oklch(0.09 0 0)',
                  border: '1px solid oklch(0.22 0 0)',
                  color: 'oklch(0.90 0 0)',
                  outline: 'none',
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.6)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'oklch(0.22 0 0)'; }}
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as IPCategory | '')}
              style={selectStyle}
            >
              <option value="">All Categories</option>
              <option value={IPCategory.patent}>Patent</option>
              <option value={IPCategory.trademark}>Trademark</option>
              <option value={IPCategory.copyright}>Copyright</option>
            </select>

            {/* Jurisdiction filter */}
            <select
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Jurisdictions</option>
              {JURISDICTIONS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            {/* Clear */}
            {(search || categoryFilter || jurisdictionFilter) && (
              <button
                onClick={() => { setSearch(''); setCategoryFilter(''); setJurisdictionFilter(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'oklch(0.20 0 0)',
                  color: 'oklch(0.70 0 0)',
                  border: '1px solid oklch(0.28 0 0)',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.78 0.15 85)' }} />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <Database className="w-12 h-12 mx-auto mb-4" style={{ color: 'oklch(0.30 0 0)' }} />
            <p className="text-lg font-medium" style={{ color: 'oklch(0.55 0 0)' }}>
              No IP records found
            </p>
            <p className="text-sm mt-1" style={{ color: 'oklch(0.40 0 0)' }}>
              {search || categoryFilter || jurisdictionFilter
                ? 'Try adjusting your search or filters.'
                : 'Be the first to register an IP on-chain.'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-4" style={{ color: 'oklch(0.45 0 0)' }}>
              {records.length} record{records.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {records.map((record) => (
                <IPCard
                  key={record.id.toString()}
                  record={record}
                  onClick={setSelectedRecord}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <IPDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
