import { IPRecord, IPCategory } from '../backend';

interface IPCardProps {
  record: IPRecord;
  onClick: () => void;
}

const categoryLabels: Record<string, string> = {
  [IPCategory.patent]: 'Patent',
  [IPCategory.trademark]: 'Trademark',
  [IPCategory.copyright]: 'Copyright',
};

const categoryColors: Record<string, string> = {
  [IPCategory.patent]: 'oklch(0.55 0.18 250)',
  [IPCategory.trademark]: 'oklch(0.55 0.18 140)',
  [IPCategory.copyright]: 'oklch(0.55 0.18 30)',
};

export default function IPCard({ record, onClick }: IPCardProps) {
  const categoryKey = Object.keys(IPCategory).find(
    (k) => IPCategory[k as keyof typeof IPCategory] === record.category
  ) ?? 'patent';

  const date = new Date(Number(record.registrationDate) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const hashHex = Array.from(record.documentHash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-sm border border-gold/20 hover:border-gold/50 p-5 transition-all duration-200 hover:shadow-gold"
      style={{ background: 'oklch(0.13 0.03 240)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs text-gray-500 font-mono">#{String(record.id).padStart(4, '0')}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
          style={{ background: categoryColors[categoryKey] ?? categoryColors[IPCategory.patent] }}
        >
          {categoryLabels[record.category] ?? record.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-base font-semibold text-gold mb-1 line-clamp-2 group-hover:text-gold/90 transition-colors">
        {record.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{record.description}</p>

      {/* Meta */}
      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Jurisdiction:</span>
          <span className="text-gray-300">{record.jurisdiction}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Registered:</span>
          <span className="text-gray-300">{date}</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-gray-600 flex-shrink-0">Hash:</span>
          <span className="text-gray-400 font-mono truncate">{hashHex.slice(0, 20)}…</span>
        </div>
      </div>
    </div>
  );
}
