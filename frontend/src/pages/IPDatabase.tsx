import { useState, useMemo } from 'react';
import { Search, Filter, X, Loader2, Database } from 'lucide-react';
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
  useSearchByTitleOrHash,
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
    hash: 'a3f8c2d1e4b7091f6a5d3c8e2b1f4a7d9c0e3b6f2a5d8c1e4b7f0a3d6c9e2b5f8',
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
    hash: 'b1e2f3a4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
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
    hash: 'c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
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
    hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
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
    hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
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
    hash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
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
    hash: 'a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
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
    hash: 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
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
    hash: 'c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
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
    hash: 'd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
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
  const [copiedSha, setCopiedSha] = useState(false);

  if (!record) return null;

  const hashHex = Array.from(record.documentHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const date = new Date(Number(record.registrationDate) / 1_000_000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const txDate = record.txTimestamp
    ? new Date(Number(record.txTimestamp) / 1_000_000).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '—';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hashHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySha = async () => {
    if (!record.hash) return;
    await navigator.clipboard.writeText(record.hash);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
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
                { label: 'On-Chain Timestamp', value: txDate, mono: false },
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
                title="Copy document hash"
              >
                {copied ? (
                  <span className="text-green-400 text-xs">✓</span>
                ) : (
                  <span className="text-xs">⎘</span>
                )}
              </button>
            </div>
          </div>

          {/* SHA-256 Hash */}
          {record.hash && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">SHA-256 Hash</span>
              <div
                className="flex items-center gap-2 p-3 rounded-sm border border-gold/15"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              >
                <span className="font-mono text-xs text-gold/80 break-all flex-1">{record.hash}</span>
                <button
                  onClick={handleCopySha}
                  className="flex-shrink-0 p-1.5 rounded-sm hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                  title="Copy SHA-256 hash"
                >
                  {copiedSha ? (
                    <span className="text-green-400 text-xs">✓</span>
                  ) : (
                    <span className="text-xs">⎘</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Cross-chain simulated section */}
          <div
            className="rounded-sm border border-gold/20 overflow-hidden"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 border-b border-gold/15"
              style={{ background: 'oklch(0.11 0.028 240)' }}
            >
              <span className="text-gold/80 text-xs font-semibold uppercase tracking-wider">
                Also Recorded On
              </span>
              <span className="ml-auto text-xs text-gray-600 italic">
                Future Integration — Simulated Reference
              </span>
            </div>
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-[8px] font-bold">Ξ</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Ethereum</span>
              </div>
              <span className="text-gray-600 text-xs pl-6">Simulated reference only</span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-[8px] font-bold">◎</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Solana</span>
              </div>
              <span className="text-gray-600 text-xs pl-6">Simulated reference only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main IPDatabase page ──────────────────────────────────────────────────────
export default function IPDatabase() {
  const [searchQuery, setSearchQuery] = useState('');
  // Use '' instead of null so types match hook signatures (IPCategory | '' and string)
  const [categoryFilter, setCategoryFilter] = useState<IPCategory | ''>('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState<MockIPRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const isSearching = searchQuery.trim().length > 0;
  const isCategoryFiltering = categoryFilter !== '';
  const isJurisdictionFiltering = jurisdictionFilter !== '';
  const isFiltering = isCategoryFiltering || isJurisdictionFiltering;

  const { data: allIPs, isLoading: allLoading } = useGetAllIPs(page * PAGE_SIZE, PAGE_SIZE);
  const { data: searchResults, isLoading: searchLoading } = useSearchByTitleOrHash(searchQuery.trim());
  const { data: categoryResults, isLoading: categoryLoading } = useFilterByCategory(categoryFilter);
  const { data: jurisdictionResults, isLoading: jurisdictionLoading } = useFilterByJurisdiction(jurisdictionFilter);

  const isLoading = allLoading || searchLoading || categoryLoading || jurisdictionLoading;

  // Merge backend records with mock records, deduplicating by id
  const mergedRecords = useMemo(() => {
    const backendRecords: MockIPRecord[] = (allIPs ?? []).map((r) => ({ ...r }));
    const backendIds = new Set(backendRecords.map((r) => String(r.id)));
    const uniqueMocks = MOCK_RECORDS.filter((m) => !backendIds.has(String(m.id)));
    return [...backendRecords, ...uniqueMocks];
  }, [allIPs]);

  // Apply client-side filtering on merged records when filters are active
  const displayRecords = useMemo((): MockIPRecord[] => {
    if (isSearching) {
      const backendSearch: MockIPRecord[] = (searchResults ?? []).map((r) => ({ ...r }));
      const backendIds = new Set(backendSearch.map((r) => String(r.id)));
      const q = searchQuery.trim().toLowerCase();
      const mockSearch = MOCK_RECORDS.filter(
        (m) =>
          !backendIds.has(String(m.id)) &&
          (m.title.toLowerCase().includes(q) || m.hash.toLowerCase().includes(q))
      );
      return [...backendSearch, ...mockSearch];
    }

    if (isCategoryFiltering && isJurisdictionFiltering) {
      const backendCat: MockIPRecord[] = (categoryResults ?? []).map((r) => ({ ...r }));
      const backendIds = new Set(backendCat.map((r) => String(r.id)));
      const mockFiltered = MOCK_RECORDS.filter(
        (m) =>
          !backendIds.has(String(m.id)) &&
          m.category === categoryFilter &&
          m.jurisdiction === jurisdictionFilter
      );
      const combined = [...backendCat, ...mockFiltered];
      return combined.filter((r) => r.jurisdiction === jurisdictionFilter);
    }

    if (isCategoryFiltering) {
      const backendCat: MockIPRecord[] = (categoryResults ?? []).map((r) => ({ ...r }));
      const backendIds = new Set(backendCat.map((r) => String(r.id)));
      const mockFiltered = MOCK_RECORDS.filter(
        (m) => !backendIds.has(String(m.id)) && m.category === categoryFilter
      );
      return [...backendCat, ...mockFiltered];
    }

    if (isJurisdictionFiltering) {
      const backendJur: MockIPRecord[] = (jurisdictionResults ?? []).map((r) => ({ ...r }));
      const backendIds = new Set(backendJur.map((r) => String(r.id)));
      const mockFiltered = MOCK_RECORDS.filter(
        (m) => !backendIds.has(String(m.id)) && m.jurisdiction === jurisdictionFilter
      );
      return [...backendJur, ...mockFiltered];
    }

    return mergedRecords;
  }, [
    isSearching,
    isCategoryFiltering,
    isJurisdictionFiltering,
    searchQuery,
    searchResults,
    categoryResults,
    jurisdictionResults,
    categoryFilter,
    jurisdictionFilter,
    mergedRecords,
  ]);

  const handleCardClick = (record: MockIPRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setJurisdictionFilter('');
    setPage(0);
  };

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    isCategoryFiltering,
    isJurisdictionFiltering,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'oklch(0.12 0.025 240)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">IP Database</h1>
          <p className="text-gray-400">
            Browse and search all registered intellectual property records on the blockchain.
          </p>
        </div>

        {/* Search & filter bar */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Search by title or SHA-256 hash…"
                className="pl-9 border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              className={`border-gold/25 text-gray-300 hover:text-gold hover:border-gold/50 gap-1.5 ${showFilters ? 'bg-gold/10 text-gold border-gold/40' : ''}`}
              style={{ background: showFilters ? undefined : 'oklch(0.10 0.025 240)' }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-gold text-navy text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {(isSearching || isFiltering) && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="text-gray-400 hover:text-gold gap-1.5"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 p-4 rounded-sm border border-gold/15" style={{ background: 'oklch(0.11 0.028 240)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Category:</span>
                <Select
                  value={categoryFilter}
                  onValueChange={(v) => { setCategoryFilter(v as IPCategory | ''); setPage(0); }}
                >
                  <SelectTrigger
                    className="w-36 h-8 text-xs border-gold/25 text-gray-300"
                    style={{ background: 'oklch(0.10 0.025 240)' }}
                  >
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent style={{ background: 'oklch(0.13 0.03 240)' }} className="border-gold/25">
                    <SelectItem value="" className="text-gray-300 text-xs">All Categories</SelectItem>
                    <SelectItem value={IPCategory.patent} className="text-gray-300 text-xs">Patent</SelectItem>
                    <SelectItem value={IPCategory.trademark} className="text-gray-300 text-xs">Trademark</SelectItem>
                    <SelectItem value={IPCategory.copyright} className="text-gray-300 text-xs">Copyright</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Jurisdiction:</span>
                <Select
                  value={jurisdictionFilter}
                  onValueChange={(v) => { setJurisdictionFilter(v); setPage(0); }}
                >
                  <SelectTrigger
                    className="w-36 h-8 text-xs border-gold/25 text-gray-300"
                    style={{ background: 'oklch(0.10 0.025 240)' }}
                  >
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent style={{ background: 'oklch(0.13 0.03 240)' }} className="border-gold/25">
                    <SelectItem value="" className="text-gray-300 text-xs">All Jurisdictions</SelectItem>
                    {JURISDICTIONS.map((j) => (
                      <SelectItem key={j} value={j} className="text-gray-300 text-xs">{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-500 text-sm">
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading…
              </span>
            ) : (
              `${displayRecords.length} record${displayRecords.length !== 1 ? 's' : ''} found`
            )}
          </span>
          {!isSearching && !isFiltering && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-gray-400 hover:text-gold disabled:opacity-30 h-7 px-2 text-xs"
              >
                ← Prev
              </Button>
              <span className="text-gray-600 text-xs">Page {page + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={(allIPs?.length ?? 0) < PAGE_SIZE}
                className="text-gray-400 hover:text-gold disabled:opacity-30 h-7 px-2 text-xs"
              >
                Next →
              </Button>
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
          </div>
        ) : displayRecords.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg mb-2">No records found</p>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayRecords.map((record) => (
              <IPCard
                key={String(record.id)}
                record={record}
                onClick={() => handleCardClick(record)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal — uses the extended version for mock records, standard for backend records */}
      {selectedRecord && (
        selectedRecord.blockHeight !== undefined ? (
          <ExtendedIPDetailModal
            record={selectedRecord}
            open={modalOpen}
            onClose={() => { setModalOpen(false); setSelectedRecord(null); }}
          />
        ) : (
          <IPDetailModal
            record={selectedRecord}
            open={modalOpen}
            onClose={() => { setModalOpen(false); setSelectedRecord(null); }}
          />
        )
      )}
    </div>
  );
}
