import { IPRecord, IPCategory } from '../backend';
import { Calendar, Globe, User, Hash } from 'lucide-react';

interface IPCardProps {
  record: IPRecord;
  onClick: (record: IPRecord) => void;
}

const categoryLabels: Record<string, string> = {
  [IPCategory.patent]: 'Patent',
  [IPCategory.trademark]: 'Trademark',
  [IPCategory.copyright]: 'Copyright',
};

const categoryColors: Record<string, string> = {
  [IPCategory.patent]: 'oklch(0.60 0.12 200)',
  [IPCategory.trademark]: 'oklch(0.65 0.14 85)',
  [IPCategory.copyright]: 'oklch(0.60 0.14 160)',
};

function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}...${principal.slice(-6)}`;
}

function truncateHash(hash: Uint8Array): string {
  const hex = Array.from(hash).map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex.length <= 16) return hex;
  return `${hex.slice(0, 12)}...${hex.slice(-6)}`;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function IPCard({ record, onClick }: IPCardProps) {
  const categoryKey = Object.keys(IPCategory).find(
    k => IPCategory[k as keyof typeof IPCategory] === record.category
  ) || '';

  const catColor = categoryColors[categoryKey] || 'oklch(0.60 0.12 200)';

  return (
    <div
      className="rounded-lg p-5 cursor-pointer transition-all duration-200 group"
      style={{
        backgroundColor: 'oklch(0.16 0.025 240)',
        border: '1px solid oklch(0.28 0.03 240)',
      }}
      onClick={() => onClick(record)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.78 0.14 85)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px oklch(0.78 0.14 85 / 0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.28 0.03 240)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{record.id.toString()}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'oklch(0.20 0.025 240)',
                color: catColor,
              }}
            >
              {categoryLabels[categoryKey] || String(record.category)}
            </span>
          </div>
          <h3
            className="font-serif font-semibold text-base leading-tight line-clamp-2 transition-colors"
            style={{ color: 'oklch(0.95 0.01 240)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'oklch(0.78 0.14 85)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'oklch(0.95 0.01 240)'; }}
          >
            {record.title}
          </h3>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{record.jurisdiction || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-mono truncate">{truncatePrincipal(record.owner.toString())}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDate(record.registrationDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-mono truncate">{truncateHash(record.documentHash)}</span>
        </div>
      </div>
    </div>
  );
}
