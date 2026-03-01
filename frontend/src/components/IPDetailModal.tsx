import { useState, useMemo } from 'react';
import { IPRecord, IPCategory } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Copy, Check, Download, FlaskConical } from 'lucide-react';

interface IPDetailModalProps {
  record: IPRecord | null;
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  [IPCategory.patent]: 'Patent',
  [IPCategory.trademark]: 'Trademark',
  [IPCategory.copyright]: 'Copyright',
};

function seededHex(seed: string, length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < length; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    result += chars[hash % 16];
  }
  return result;
}

function seededBase58(seed: string, length: number): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < length; i++) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    result += chars[hash % chars.length];
  }
  return result;
}

export default function IPDetailModal({ record, open, onClose }: IPDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);

  const hashHex = useMemo(() => {
    if (!record) return '';
    return Array.from(record.documentHash)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }, [record]);

  const mockEthTxId = useMemo(() => {
    if (!record) return '';
    return '0x' + seededHex(String(record.id) + record.title, 64);
  }, [record]);

  const mockEthBlock = useMemo(() => {
    if (!record) return 0;
    let hash = 0;
    const s = String(record.id) + record.title;
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return 19_000_000 + (hash % 2_000_000);
  }, [record]);

  const mockSolanaSig = useMemo(() => {
    if (!record) return '';
    return seededBase58(record.title + String(record.id), 88);
  }, [record]);

  const mockSolanaSlot = useMemo(() => {
    if (!record) return 0;
    let hash = 0;
    const s = record.title + String(record.id);
    for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
    return 250_000_000 + (hash % 10_000_000);
  }, [record]);

  if (!record) return null;

  const date = new Date(Number(record.registrationDate) / 1_000_000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

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

  const fields = [
    { label: 'IP ID', value: `#${String(record.id).padStart(4, '0')}` },
    { label: 'Category', value: categoryLabels[record.category] ?? record.category },
    { label: 'Jurisdiction', value: record.jurisdiction },
    { label: 'Owner Principal', value: record.owner.toString(), mono: true },
    { label: 'Registration Date', value: date },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-2xl border border-gold/30 text-gray-100 max-h-[90vh] overflow-y-auto"
        style={{ background: 'oklch(0.13 0.03 240)' }}
      >
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-gold">{record.title}</DialogTitle>
          <DialogDescription className="text-gray-400 text-sm leading-relaxed mt-1">
            {record.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {fields.map((f) => (
            <div key={f.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <span className="text-xs text-gray-500 sm:w-36 flex-shrink-0 pt-0.5">{f.label}</span>
              <span className={`text-sm text-gray-200 break-all ${f.mono ? 'font-mono text-xs' : ''}`}>
                {f.value}
              </span>
            </div>
          ))}

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
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SHA-256 Hash (record-level hash assigned at registration) */}
          {record.hash && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">SHA-256 Hash</span>
              <div
                className="flex items-center gap-2 p-3 rounded-sm border border-gold/20"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              >
                <span className="font-mono text-xs text-gold/80 break-all flex-1">{record.hash}</span>
                <button
                  onClick={handleCopySha}
                  className="flex-shrink-0 p-1.5 rounded-sm hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                  title="Copy SHA-256 hash"
                >
                  {copiedSha ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* ICP Blockchain Metadata */}
          <div
            className="flex items-center justify-between p-3 rounded-sm border border-green-500/20"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <span className="text-gray-400 text-sm">ICP Canister</span>
            <span className="text-green-400 font-semibold text-sm">On-Chain ✓</span>
          </div>

          {/* Simulated Cross-Chain Section */}
          <div
            className="rounded-sm border border-gold/20 overflow-hidden"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 border-b border-gold/15"
              style={{ background: 'oklch(0.11 0.028 240)' }}
            >
              <FlaskConical className="w-3.5 h-3.5 text-gold/70" />
              <span className="text-gold/80 text-xs font-semibold uppercase tracking-wider">
                Also Recorded On
              </span>
              <span className="ml-auto text-xs text-gray-600 italic">
                Future Integration — Simulated Reference
              </span>
            </div>

            {/* Ethereum */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-[8px] font-bold">Ξ</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Ethereum</span>
              </div>
              <div className="space-y-1 pl-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Tx ID</span>
                  <span className="font-mono text-xs text-gray-400 break-all leading-relaxed">
                    {mockEthTxId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Block</span>
                  <span className="font-mono text-xs text-gray-400">
                    {mockEthBlock.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Solana */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-[8px] font-bold">◎</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Solana</span>
              </div>
              <div className="space-y-1 pl-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Sig</span>
                  <span className="font-mono text-xs text-gray-400 break-all leading-relaxed">
                    {mockSolanaSig}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Slot</span>
                  <span className="font-mono text-xs text-gray-400">
                    {mockSolanaSlot.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File download */}
          {record.fileBlob && (
            <div className="pt-2">
              <a
                href={record.fileBlob.getDirectURL()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Document
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
