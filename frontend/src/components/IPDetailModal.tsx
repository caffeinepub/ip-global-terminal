import { useState } from 'react';
import { IPRecord, IPCategory } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Copy, CheckCircle, Shield, Calendar, Globe, Tag, FileText, Hash } from 'lucide-react';

interface IPDetailModalProps {
  record: IPRecord | null;
  open: boolean;
  onClose: () => void;
}

function categoryLabel(cat: IPCategory): string {
  switch (cat) {
    case IPCategory.patent:
      return 'Patent';
    case IPCategory.trademark:
      return 'Trademark';
    case IPCategory.copyright:
      return 'Copyright';
    default:
      return 'Unknown';
  }
}

export default function IPDetailModal({ record, open, onClose }: IPDetailModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedDocHash, setCopiedDocHash] = useState(false);

  if (!record) return null;

  const date = new Date(Number(record.registrationDate) / 1_000_000);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const docHashHex = Array.from(record.documentHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-black border border-gold-800/40 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-gold-900/40 text-gold-300 border border-gold-700/40">
              {categoryLabel(record.category)}
            </span>
            <span className="text-xs text-white/40">ID #{record.id.toString()}</span>
          </div>
          <DialogTitle className="font-serif text-xl text-white text-left">{record.title}</DialogTitle>
          <DialogDescription className="text-white/55 text-sm text-left leading-relaxed">
            {record.description}
          </DialogDescription>
        </DialogHeader>

        {/* On-chain confirmation banner */}
        <div className="flex items-center gap-2 bg-gold-900/20 border border-gold-700/30 rounded-sm px-4 py-2.5 text-sm text-gold-300">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <span>Registered and confirmed on the Internet Computer blockchain</span>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Registration Date</div>
              <div className="text-sm text-white">{dateStr}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Jurisdiction</div>
              <div className="text-sm text-white">{record.jurisdiction}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Tag className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Category</div>
              <div className="text-sm text-white">{categoryLabel(record.category)}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">Record ID</div>
              <div className="text-sm text-white font-mono">#{record.id.toString()}</div>
            </div>
          </div>
        </div>

        {/* Owner */}
        <div className="border-t border-gold-900/20 pt-4">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1.5">Owner Principal</div>
          <div className="font-mono text-xs text-white/60 break-all bg-white/5 rounded-sm px-3 py-2">
            {record.owner.toString()}
          </div>
        </div>

        {/* SHA-256 Hash */}
        <div className="border-t border-gold-900/20 pt-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gold-500" />
              <span className="text-xs text-white/40 uppercase tracking-wider">SHA-256 Hash</span>
            </div>
            <button
              onClick={() => copyToClipboard(record.hash, setCopiedHash)}
              className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              {copiedHash ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHash ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-xs text-gold-600/80 break-all bg-gold-900/10 border border-gold-900/20 rounded-sm px-3 py-2">
            {record.hash}
          </div>
        </div>

        {/* Document Hash */}
        {docHashHex && (
          <div className="border-t border-gold-900/20 pt-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gold-500" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Document Hash</span>
              </div>
              <button
                onClick={() => copyToClipboard(docHashHex, setCopiedDocHash)}
                className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
              >
                {copiedDocHash ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedDocHash ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-xs text-white/50 break-all bg-white/5 rounded-sm px-3 py-2">
              {docHashHex}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
