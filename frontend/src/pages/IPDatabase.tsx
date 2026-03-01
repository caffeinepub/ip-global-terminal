import { useState, useMemo } from 'react';
import { Search, Filter, X, Loader2, Database, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import IPCard from '../components/IPCard';
import IPDetailModal from '../components/IPDetailModal';
import {
  useGetAllIPs,
  useSearchByTitle,
  useFilterByCategory,
  useFilterByJurisdiction,
} from '../hooks/useQueries';
import { IPRecord, IPCategory } from '../backend';

const JURISDICTIONS = ['US', 'EU', 'UK', 'CN', 'JP', 'CA', 'AU', 'IN', 'BR', 'Global'];
const PAGE_SIZE = 12;

// ── Mock blockchain metadata type ────────────────────────────────────────────
interface MockIPRecord extends IPRecord {
  blockHeight?: bigint;
  canisterID?: string;
  txTimestamp?: bigint;
}

// ── Helper: hex string → Uint8Array ──────────────────────────────────────────
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

// ── Pre-seeded mock IP records ────────────────────────────────────────────────
const MOCK_RECORDS: MockIPRecord[] = [
  {
    id: BigInt(1001),
    title: 'Quantum-Resistant Cryptographic Key Exchange Protocol',
    description:
      'A novel lattice-based key exchange protocol designed to resist attacks from quantum computers, suitable for post-quantum TLS implementations.',
    category: IPCategory.patent,
    owner: { toString: () => 'rdmx6-jaaaa-aaaaa-aaadq-cai' } as any,
    registrationDate: BigInt(new Date('2025-03-12T08:14:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('a3f8c2d1e4b7091f6a5d3c8e2b1f4a7d9c0e3b6f2a5d8c1e4b7f0a3d6c9e2b5'),
    jurisdiction: 'US',
    blockHeight: BigInt(14_892_341),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-03-12T08:14:22Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1002),
    title: 'IP Global Terminal — Brand Identity & Wordmark',
    description:
      'Registered wordmark and brand identity for "IP Global Terminal" covering cryptographic IP certification services in Class 42.',
    category: IPCategory.trademark,
    owner: { toString: () => 'aaaaa-aa' } as any,
    registrationDate: BigInt(new Date('2025-04-01T10:00:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('b1e2f3a4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2'),
    jurisdiction: 'Global',
    blockHeight: BigInt(14_901_005),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-04-01T10:00:45Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1003),
    title: 'Decentralized Autonomous IP Registry — Technical Specification',
    description:
      'Comprehensive technical specification and reference implementation for a decentralized autonomous IP registry operating on the Internet Computer Protocol.',
    category: IPCategory.copyright,
    owner: { toString: () => 'un4fu-taaaa-aaaab-qadjq-cai' } as any,
    registrationDate: BigInt(new Date('2025-05-20T14:30:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3'),
    jurisdiction: 'EU',
    blockHeight: BigInt(14_955_780),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-05-20T14:30:18Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1004),
    title: 'AI-Powered Prior Art Search Engine',
    description:
      'Machine learning system for automated prior art discovery across global patent databases, utilizing transformer-based semantic similarity matching.',
    category: IPCategory.patent,
    owner: { toString: () => 'qhbym-qaaaa-aaaaa-aaafq-cai' } as any,
    registrationDate: BigInt(new Date('2025-06-08T09:45:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'),
    jurisdiction: 'JP',
    blockHeight: BigInt(14_978_234),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-06-08T09:45:33Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1005),
    title: 'Blockchain-Based Supply Chain Provenance System',
    description:
      'End-to-end supply chain provenance tracking system using distributed ledger technology to verify authenticity and origin of manufactured goods.',
    category: IPCategory.patent,
    owner: { toString: () => 'mxzaz-hqaaa-aaaar-qaada-cai' } as any,
    registrationDate: BigInt(new Date('2025-07-15T11:20:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6'),
    jurisdiction: 'CN',
    blockHeight: BigInt(15_012_667),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-07-15T11:20:09Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1006),
    title: 'NovaMesh — Distributed Mesh Networking Protocol',
    description:
      'Trademark registration for "NovaMesh" covering distributed mesh networking software and hardware products in Classes 9 and 38.',
    category: IPCategory.trademark,
    owner: { toString: () => 'renrk-eyaaa-aaaaa-aaada-cai' } as any,
    registrationDate: BigInt(new Date('2025-08-03T16:00:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7'),
    jurisdiction: 'UK',
    blockHeight: BigInt(15_045_112),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-08-03T16:00:27Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1007),
    title: 'Zero-Knowledge Proof Identity Verification Framework',
    description:
      'A privacy-preserving identity verification framework using zk-SNARKs to enable selective disclosure of personal attributes without revealing underlying data.',
    category: IPCategory.patent,
    owner: { toString: () => 'qaa6y-5yaaa-aaaaa-aaafa-cai' } as any,
    registrationDate: BigInt(new Date('2025-09-10T13:15:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8'),
    jurisdiction: 'CA',
    blockHeight: BigInt(15_089_445),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-09-10T13:15:41Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1008),
    title: 'Open Source IP Management Platform — Source Code',
    description:
      'Copyright registration for the complete source code of an open-source intellectual property management platform, including all modules and documentation.',
    category: IPCategory.copyright,
    owner: { toString: () => 'oeee4-qaaaa-aaaaa-aaa2q-cai' } as any,
    registrationDate: BigInt(new Date('2025-10-22T07:50:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9'),
    jurisdiction: 'AU',
    blockHeight: BigInt(15_134_890),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-10-22T07:50:15Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1009),
    title: 'Adaptive Neural Interface for Prosthetic Limb Control',
    description:
      'Biomedical patent for an adaptive neural interface system enabling intuitive motor control of prosthetic limbs via real-time electromyographic signal processing.',
    category: IPCategory.patent,
    owner: { toString: () => 'sgymv-yiaaa-aaaaa-aaaia-cai' } as any,
    registrationDate: BigInt(new Date('2025-11-05T15:30:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0'),
    jurisdiction: 'IN',
    blockHeight: BigInt(15_167_223),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-11-05T15:30:52Z').getTime() * 1_000_000),
  },
  {
    id: BigInt(1010),
    title: 'ClearVault — Secure Document Escrow Service',
    description:
      'Trademark for "ClearVault" covering secure digital document escrow and notarization services in Class 45, with priority claim from Brazil.',
    category: IPCategory.trademark,
    owner: { toString: () => 'tqtu6-byaaa-aaaaa-aaana-cai' } as any,
    registrationDate: BigInt(new Date('2025-12-01T09:00:00Z').getTime() * 1_000_000),
    documentHash: hexToBytes('d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1'),
    jurisdiction: 'BR',
    blockHeight: BigInt(15_201_778),
    canisterID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    txTimestamp: BigInt(new Date('2025-12-01T09:00:38Z').getTime() * 1_000_000),
  },
];

// ── Extended detail modal that shows blockchain metadata ──────────────────────
interface ExtendedDetailModalProps {
  record: MockIPRecord | null;
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  [IPCategory.patent]: 'Patent',
  [IPCategory.trademark]: 'Trademark',
  [IPCategory.copyright]: 'Copyright',
};

function ExtendedIPDetailModal({ record, open, onClose }: ExtendedDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  const hashHex = Array.from(record.documentHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const date = new Date(Number(record.registrationDate) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const txDate = record.txTimestamp
    ? new Date(Number(record.txTimestamp) / 1_000_000).toISOString()
    : '—';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hashHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${open ? '' : 'hidden'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-2xl rounded-sm border border-gold/30 p-6 overflow-y-auto max-h-[90vh]"
        style={{ background: 'oklch(0.13 0.03 240)' }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gold transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-mono">#{String(record.id).padStart(4, '0')}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: record.category === IPCategory.patent ? 'oklch(0.55 0.18 250)' : record.category === IPCategory.trademark ? 'oklch(0.55 0.18 140)' : 'oklch(0.55 0.18 30)' }}>
              {categoryLabels[record.category] ?? record.category}
            </span>
          </div>
          <h2 className="font-serif text-xl text-gold font-bold">{record.title}</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">{record.description}</p>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Jurisdiction', value: record.jurisdiction },
            { label: 'Owner Principal', value: record.owner.toString(), mono: true },
            { label: 'Registration Date', value: date },
          ].map((f) => (
            <div key={f.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <span className="text-xs text-gray-500 sm:w-36 flex-shrink-0 pt-0.5">{f.label}</span>
              <span className={`text-sm text-gray-200 break-all ${f.mono ? 'font-mono text-xs' : ''}`}>
                {f.value}
              </span>
            </div>
          ))}

          {/* Blockchain Metadata */}
          <div
            className="mt-4 p-4 rounded-sm border border-gold/20"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <div className="text-xs font-semibold tracking-widest uppercase text-gold/70 mb-3 flex items-center gap-2">
              <Database className="w-3.5 h-3.5" />
              Blockchain Metadata
            </div>
            <div className="space-y-2">
              {[
                { label: 'Block Height', value: record.blockHeight ? record.blockHeight.toLocaleString() : '—' },
                { label: 'Canister ID', value: record.canisterID ?? '—', mono: true },
                { label: 'On-Chain Timestamp', value: txDate, mono: true },
              ].map((f) => (
                <div key={f.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                  <span className="text-xs text-gray-500 sm:w-36 flex-shrink-0">{f.label}</span>
                  <span className={`text-xs text-gray-300 break-all ${f.mono ? 'font-mono' : ''}`}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Hash */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">Document Hash (SHA-256)</span>
            <div
              className="flex items-center gap-2 p-3 rounded-sm border border-gold/15"
              style={{ background: 'oklch(0.10 0.025 240)' }}
            >
              <span className="font-mono text-xs text-gray-300 break-all flex-1">{hashHex}</span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 rounded-sm hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                title="Copy hash"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IPDatabase() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MockIPRecord | null>(null);
  const [page, setPage] = useState(0);

  const hasFilters = !!activeSearch || categoryFilter !== 'all' || jurisdictionFilter !== 'all';

  // Backend queries
  const { data: allIPs, isLoading: allLoading } = useGetAllIPs(page * PAGE_SIZE, PAGE_SIZE);
  const { data: searchResults, isLoading: searchLoading } = useSearchByTitle(activeSearch);
  const { data: categoryResults, isLoading: categoryLoading } = useFilterByCategory(
    categoryFilter !== 'all' ? (categoryFilter as IPCategory) : null
  );
  const { data: jurisdictionResults, isLoading: jurisdictionLoading } = useFilterByJurisdiction(
    jurisdictionFilter !== 'all' ? jurisdictionFilter : null
  );

  const isLoading = allLoading || searchLoading || categoryLoading || jurisdictionLoading;

  // Merge mock + real records
  const combinedAll = useMemo(() => {
    const real = allIPs ?? [];
    return [...MOCK_RECORDS, ...real];
  }, [allIPs]);

  const combinedSearch = useMemo(() => {
    const real = searchResults ?? [];
    const mockFiltered = MOCK_RECORDS.filter((r) =>
      r.title.toLowerCase().includes(activeSearch.toLowerCase())
    );
    return [...mockFiltered, ...real];
  }, [searchResults, activeSearch]);

  const combinedCategory = useMemo(() => {
    const real = categoryResults ?? [];
    const mockFiltered = MOCK_RECORDS.filter((r) => r.category === categoryFilter);
    return [...mockFiltered, ...real];
  }, [categoryResults, categoryFilter]);

  const combinedJurisdiction = useMemo(() => {
    const real = jurisdictionResults ?? [];
    const mockFiltered = MOCK_RECORDS.filter((r) => r.jurisdiction === jurisdictionFilter);
    return [...mockFiltered, ...real];
  }, [jurisdictionResults, jurisdictionFilter]);

  // Compute displayed records
  let records: MockIPRecord[] = [];
  if (!hasFilters) {
    records = combinedAll;
  } else if (activeSearch) {
    records = combinedSearch;
    if (categoryFilter !== 'all') {
      records = records.filter((r) => r.category === categoryFilter);
    }
    if (jurisdictionFilter !== 'all') {
      records = records.filter((r) => r.jurisdiction === jurisdictionFilter);
    }
  } else if (categoryFilter !== 'all' && jurisdictionFilter !== 'all') {
    records = combinedCategory.filter((r) => r.jurisdiction === jurisdictionFilter);
  } else if (categoryFilter !== 'all') {
    records = combinedCategory;
  } else if (jurisdictionFilter !== 'all') {
    records = combinedJurisdiction;
  }

  const handleSearch = () => {
    setActiveSearch(search);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveSearch('');
    setCategoryFilter('all');
    setJurisdictionFilter('all');
    setPage(0);
  };

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'oklch(0.12 0.025 240)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-6 h-6 text-gold" />
            <h1 className="font-serif text-4xl font-bold text-gold">Global IP Database</h1>
          </div>
          <p className="text-gray-400">
            Browse and search all registered intellectual property records with full blockchain metadata — cryptographically timestamped and publicly verifiable.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            <span>{MOCK_RECORDS.length + (allIPs?.length ?? 0)} records on-chain</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div
          className="p-5 rounded-sm border border-gold/20 mb-8"
          style={{ background: 'oklch(0.13 0.03 240)' }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by title…"
                className="border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              />
              <Button onClick={handleSearch} className="bg-gold text-navy hover:bg-gold/90 px-4">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className="w-36 border-gold/25 text-gray-300"
                  style={{ background: 'oklch(0.10 0.025 240)' }}
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5 text-gold/60" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent
                  style={{ background: 'oklch(0.13 0.03 240)' }}
                  className="border-gold/25"
                >
                  <SelectItem value="all" className="text-gray-300">All Categories</SelectItem>
                  <SelectItem value={IPCategory.patent} className="text-gray-300">Patent</SelectItem>
                  <SelectItem value={IPCategory.trademark} className="text-gray-300">Trademark</SelectItem>
                  <SelectItem value={IPCategory.copyright} className="text-gray-300">Copyright</SelectItem>
                </SelectContent>
              </Select>

              <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
                <SelectTrigger
                  className="w-36 border-gold/25 text-gray-300"
                  style={{ background: 'oklch(0.10 0.025 240)' }}
                >
                  <SelectValue placeholder="Jurisdiction" />
                </SelectTrigger>
                <SelectContent
                  style={{ background: 'oklch(0.13 0.03 240)' }}
                  className="border-gold/25"
                >
                  <SelectItem value="all" className="text-gray-300">All Jurisdictions</SelectItem>
                  {JURISDICTIONS.map((j) => (
                    <SelectItem key={j} value={j} className="text-gray-300">{j}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="border-gold/25 text-gray-400 hover:text-gold hover:border-gold/50"
                  style={{ background: 'oklch(0.10 0.025 240)' }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No IP records found.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-gold text-sm hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {records.map((record) => (
                <div
                  key={String(record.id)}
                  onClick={() => setSelectedRecord(record)}
                  className="group cursor-pointer rounded-sm border border-gold/20 hover:border-gold/50 p-5 transition-all duration-200 hover:shadow-gold"
                  style={{ background: 'oklch(0.13 0.03 240)' }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs text-gray-500 font-mono">#{String(record.id).padStart(4, '0')}</span>
                    <div className="flex items-center gap-1.5">
                      {(record as MockIPRecord).blockHeight && (
                        <span className="text-xs text-gray-600 font-mono">
                          ⛓ {Number((record as MockIPRecord).blockHeight).toLocaleString()}
                        </span>
                      )}
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{
                          background:
                            record.category === IPCategory.patent
                              ? 'oklch(0.55 0.18 250)'
                              : record.category === IPCategory.trademark
                              ? 'oklch(0.55 0.18 140)'
                              : 'oklch(0.55 0.18 30)',
                        }}
                      >
                        {categoryLabels[record.category] ?? record.category}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-base font-semibold text-gold mb-1 line-clamp-2 group-hover:text-gold/90 transition-colors">
                    {record.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {record.description}
                  </p>

                  {/* Meta */}
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-600">Jurisdiction:</span>
                      <span className="text-gray-300">{record.jurisdiction}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-600">Registered:</span>
                      <span className="text-gray-300">
                        {new Date(Number(record.registrationDate) / 1_000_000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-gray-600 flex-shrink-0">Hash:</span>
                      <span className="text-gray-400 font-mono truncate">
                        {Array.from(record.documentHash)
                          .map((b) => b.toString(16).padStart(2, '0'))
                          .join('')
                          .slice(0, 20)}…
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination — only for unfiltered view */}
            {!hasFilters && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="border-gold/25 text-gray-300 hover:text-gold hover:border-gold/50 disabled:opacity-40"
                  style={{ background: 'oklch(0.13 0.03 240)' }}
                >
                  Previous
                </Button>
                <span className="text-gray-500 text-sm">Page {page + 1}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(allIPs?.length ?? 0) < PAGE_SIZE}
                  className="border-gold/25 text-gray-300 hover:text-gold hover:border-gold/50 disabled:opacity-40"
                  style={{ background: 'oklch(0.13 0.03 240)' }}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ExtendedIPDetailModal
        record={selectedRecord}
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
