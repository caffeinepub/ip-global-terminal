import { useState } from 'react';
import { IPRecord, IPCategory } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Copy, Check, Download } from 'lucide-react';

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

export default function IPDetailModal({ record, open, onClose }: IPDetailModalProps) {
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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hashHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        className="max-w-2xl border border-gold/30 text-gray-100"
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
