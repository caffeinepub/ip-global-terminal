import { IPCategory, type IPRecord } from "../backend";

interface IPCardProps {
  record: IPRecord;
  onClick?: () => void;
}

function categoryLabel(cat: IPCategory): string {
  switch (cat) {
    case IPCategory.patent:
      return "Patent";
    case IPCategory.trademark:
      return "Trademark";
    case IPCategory.copyright:
      return "Copyright";
    default:
      return "Unknown";
  }
}

function categoryColor(cat: IPCategory): string {
  switch (cat) {
    case IPCategory.patent:
      return "bg-gold-900/40 text-gold-300 border border-gold-700/40";
    case IPCategory.trademark:
      return "bg-black border border-gold-600/40 text-gold-400";
    case IPCategory.copyright:
      return "bg-gold-900/20 text-gold-500 border border-gold-800/40";
    default:
      return "bg-black border border-white/10 text-white/50";
  }
}

export default function IPCard({ record, onClick }: IPCardProps) {
  const date = new Date(Number(record.registrationDate) / 1_000_000);
  const dateStr = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const shortHash = record.hash ? `${record.hash.slice(0, 16)}...` : "—";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-black border border-gold-900/30 hover:border-gold-600/50 rounded-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-gold group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif text-base font-semibold text-white group-hover:text-gold-200 transition-colors line-clamp-2 flex-1">
          {record.title}
        </h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-sm flex-shrink-0 ${categoryColor(record.category)}`}
        >
          {categoryLabel(record.category)}
        </span>
      </div>

      {/* Description */}
      <p className="text-white/55 text-sm leading-relaxed line-clamp-2 mb-4">
        {record.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs text-white/40 mb-3">
        <span>{record.jurisdiction}</span>
        <span>{dateStr}</span>
      </div>

      {/* Hash row */}
      <div className="border-t border-gold-900/20 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 uppercase tracking-wider">
            SHA-256
          </span>
          <span className="font-mono text-xs text-gold-600/80 truncate">
            {shortHash}
          </span>
        </div>
      </div>
    </button>
  );
}
