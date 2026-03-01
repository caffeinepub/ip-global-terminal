import { useGetIP } from '../hooks/useQueries';
import { IPRecord, IPCategory } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Globe, User, Hash, FileText, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface IPDetailModalProps {
  recordId: bigint | null;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  [IPCategory.patent]: 'Patent',
  [IPCategory.trademark]: 'Trademark',
  [IPCategory.copyright]: 'Copyright',
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function DetailRow({ icon, label, value, mono = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-start gap-2">
        <p className={`text-sm text-foreground flex-1 break-all ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
        {mono && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function IPDetailModal({ recordId, onClose }: IPDetailModalProps) {
  const { data: record, isLoading } = useGetIP(recordId);

  const categoryKey = record
    ? Object.keys(IPCategory).find(k => IPCategory[k as keyof typeof IPCategory] === record.category) || ''
    : '';

  return (
    <Dialog open={recordId !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="border-border max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'oklch(0.16 0.025 240)' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
            >
              <FileText className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl text-foreground">
                {isLoading ? 'Loading...' : record?.title || 'IP Record'}
              </DialogTitle>
              {record && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-muted-foreground">ID #{record.id.toString()}</span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'oklch(0.20 0.025 240)', color: 'oklch(0.78 0.14 85)' }}
                  >
                    {categoryLabels[categoryKey] || record.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {isLoading && (
          <div className="py-12 text-center text-muted-foreground">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
              style={{ borderColor: 'oklch(0.78 0.14 85)', borderTopColor: 'transparent' }} />
            Loading record...
          </div>
        )}

        {!isLoading && !record && (
          <div className="py-12 text-center text-muted-foreground">
            Record not found.
          </div>
        )}

        {!isLoading && record && (
          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Description</div>
              <p className="text-sm text-foreground leading-relaxed">{record.description}</p>
            </div>

            <Separator className="bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <DetailRow
                icon={<Globe className="w-3.5 h-3.5" />}
                label="Jurisdiction"
                value={record.jurisdiction || 'N/A'}
              />
              <DetailRow
                icon={<Calendar className="w-3.5 h-3.5" />}
                label="Registration Date"
                value={formatDate(record.registrationDate)}
              />
            </div>

            <Separator className="bg-border" />

            <DetailRow
              icon={<User className="w-3.5 h-3.5" />}
              label="Owner Principal"
              value={record.owner.toString()}
              mono
            />

            <DetailRow
              icon={<Hash className="w-3.5 h-3.5" />}
              label="Document Hash (SHA-256)"
              value={toHex(record.documentHash)}
              mono
            />

            {record.fileBlob && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Attached Document
                  </div>
                  <a
                    href={record.fileBlob.getDirectURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    style={{ color: 'oklch(0.78 0.14 85)' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View / Download Document
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
