import React, { useState } from 'react';
import { IPRecord, IPCategory } from '../backend';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, Globe, Tag, FileText, Hash, Copy, Check, User } from 'lucide-react';

interface IPDetailModalProps {
  record: IPRecord | null;
  onClose: () => void;
}

function categoryLabel(cat: IPCategory): string {
  switch (cat) {
    case IPCategory.patent: return 'Patent';
    case IPCategory.trademark: return 'Trademark';
    case IPCategory.copyright: return 'Copyright';
    default: return 'Unknown';
  }
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function IPDetailModal({ record, onClose }: IPDetailModalProps) {
  const [copiedDocHash, setCopiedDocHash] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);

  if (!record) return null;

  const docHashHex = toHex(record.documentHash);

  const copyToClipboard = async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={!!record} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          backgroundColor: 'oklch(0.09 0 0)',
          border: '1px solid oklch(0.78 0.15 85 / 0.3)',
          color: 'oklch(0.97 0 0)',
        }}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle
                className="text-xl font-bold leading-snug"
                style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
              >
                {record.title}
              </DialogTitle>
              <DialogDescription className="mt-1" style={{ color: 'oklch(0.55 0 0)' }}>
                IP Record #{record.id.toString()}
              </DialogDescription>
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full shrink-0 mt-1"
              style={{
                backgroundColor: 'oklch(0.78 0.15 85 / 0.15)',
                color: 'oklch(0.78 0.15 85)',
                border: '1px solid oklch(0.78 0.15 85 / 0.4)',
              }}
            >
              {categoryLabel(record.category)}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              Description
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.72 0 0)' }}>
              {record.description}
            </p>
          </div>

          {/* Metadata grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg"
            style={{ backgroundColor: 'oklch(0.13 0 0)', border: '1px solid oklch(0.22 0 0)' }}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <div>
                <p className="text-xs" style={{ color: 'oklch(0.50 0 0)' }}>Registration Date</p>
                <p className="text-sm font-medium" style={{ color: 'oklch(0.90 0 0)' }}>{formatDate(record.registrationDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <div>
                <p className="text-xs" style={{ color: 'oklch(0.50 0 0)' }}>Jurisdiction</p>
                <p className="text-sm font-medium" style={{ color: 'oklch(0.90 0 0)' }}>{record.jurisdiction}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <User className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs" style={{ color: 'oklch(0.50 0 0)' }}>Owner Principal</p>
                <p className="text-xs font-mono truncate" style={{ color: 'oklch(0.72 0 0)' }}>
                  {record.owner.toString()}
                </p>
              </div>
            </div>
          </div>

          {/* Document Hash */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
              Document Hash
            </h4>
            <div
              className="flex items-center gap-2 p-3 rounded-lg"
              style={{ backgroundColor: 'oklch(0.13 0 0)', border: '1px solid oklch(0.22 0 0)' }}
            >
              <FileText className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <code className="text-xs font-mono flex-1 break-all" style={{ color: 'oklch(0.72 0 0)' }}>
                {docHashHex}
              </code>
              <button
                onClick={() => copyToClipboard(docHashHex, setCopiedDocHash)}
                className="shrink-0 p-1 rounded transition-colors"
                style={{ color: copiedDocHash ? 'oklch(0.78 0.15 85)' : 'oklch(0.50 0 0)' }}
              >
                {copiedDocHash ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SHA-256 Hash */}
          {record.hash && (
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'oklch(0.78 0.15 85)' }}>
                SHA-256 Hash
              </h4>
              <div
                className="flex items-center gap-2 p-3 rounded-lg"
                style={{ backgroundColor: 'oklch(0.13 0 0)', border: '1px solid oklch(0.78 0.15 85 / 0.2)' }}
              >
                <Hash className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
                <code className="text-xs font-mono flex-1 break-all" style={{ color: 'oklch(0.78 0.15 85)' }}>
                  {record.hash}
                </code>
                <button
                  onClick={() => copyToClipboard(record.hash, setCopiedSha)}
                  className="shrink-0 p-1 rounded transition-colors"
                  style={{ color: copiedSha ? 'oklch(0.78 0.15 85)' : 'oklch(0.50 0 0)' }}
                >
                  {copiedSha ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* On-chain confirmation */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.08)', border: '1px solid oklch(0.78 0.15 85 / 0.25)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'oklch(0.78 0.15 85)' }} />
              <span className="text-xs font-semibold" style={{ color: 'oklch(0.78 0.15 85)' }}>
                Recorded On-Chain — Internet Computer
              </span>
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.55 0 0)' }}>
              This IP record is permanently stored on the Internet Computer blockchain and cannot be altered or deleted.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
