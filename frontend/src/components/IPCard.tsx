import React from 'react';
import { IPRecord, IPCategory } from '../backend';
import { Calendar, Globe, Tag, FileText, Hash } from 'lucide-react';

interface IPCardProps {
  record: IPRecord;
  onClick: (record: IPRecord) => void;
}

function categoryLabel(cat: IPCategory): string {
  switch (cat) {
    case IPCategory.patent: return 'Patent';
    case IPCategory.trademark: return 'Trademark';
    case IPCategory.copyright: return 'Copyright';
    default: return 'Unknown';
  }
}

function categoryColor(cat: IPCategory): React.CSSProperties {
  switch (cat) {
    case IPCategory.patent:
      return { backgroundColor: 'oklch(0.78 0.15 85 / 0.15)', color: 'oklch(0.78 0.15 85)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' };
    case IPCategory.trademark:
      return { backgroundColor: 'oklch(0.70 0.12 85 / 0.15)', color: 'oklch(0.85 0.10 85)', border: '1px solid oklch(0.70 0.12 85 / 0.4)' };
    case IPCategory.copyright:
      return { backgroundColor: 'oklch(0.60 0.10 85 / 0.15)', color: 'oklch(0.80 0.08 85)', border: '1px solid oklch(0.60 0.10 85 / 0.4)' };
    default:
      return { backgroundColor: 'oklch(0.20 0 0)', color: 'oklch(0.65 0 0)', border: '1px solid oklch(0.30 0 0)' };
  }
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function truncateHash(hash: string): string {
  if (!hash || hash.length < 16) return hash;
  return `${hash.slice(0, 8)}…${hash.slice(-8)}`;
}

export default function IPCard({ record, onClick }: IPCardProps) {
  return (
    <div
      className="rounded-lg p-5 cursor-pointer transition-all duration-200 group"
      style={{
        backgroundColor: 'oklch(0.11 0 0)',
        border: '1px solid oklch(0.22 0.02 85 / 0.5)',
      }}
      onClick={() => onClick(record)}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.5)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'oklch(0.13 0.01 85)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px oklch(0.78 0.15 85 / 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.22 0.02 85 / 0.5)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'oklch(0.11 0 0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-sm leading-snug truncate group-hover:text-white transition-colors"
            style={{ color: 'oklch(0.92 0 0)', fontFamily: 'Playfair Display, serif' }}
          >
            {record.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0 0)' }}>
            ID #{record.id.toString()}
          </p>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0"
          style={categoryColor(record.category)}
        >
          {categoryLabel(record.category)}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-xs leading-relaxed mb-4 line-clamp-2"
        style={{ color: 'oklch(0.58 0 0)' }}
      >
        {record.description}
      </p>

      {/* Metadata rows */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
          <span className="text-xs" style={{ color: 'oklch(0.55 0 0)' }}>
            {formatDate(record.registrationDate)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
          <span className="text-xs" style={{ color: 'oklch(0.55 0 0)' }}>
            {record.jurisdiction}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-3 h-3 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
          <span className="text-xs font-mono truncate" style={{ color: 'oklch(0.55 0 0)' }}>
            {Array.from(record.documentHash).slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('')}…
          </span>
        </div>
        {record.hash && (
          <div className="flex items-center gap-2">
            <Hash className="w-3 h-3 shrink-0" style={{ color: 'oklch(0.78 0.15 85)' }} />
            <span className="text-xs font-mono" style={{ color: 'oklch(0.78 0.15 85)' }}>
              SHA-256: {truncateHash(record.hash)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
