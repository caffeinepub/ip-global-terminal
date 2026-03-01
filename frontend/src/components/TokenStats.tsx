import { Coins, TrendingDown, BarChart3 } from 'lucide-react';
import { useGetTokenStats, useGetBalance } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface TokenStatsProps {
  compact?: boolean;
}

export default function TokenStats({ compact = false }: TokenStatsProps) {
  const { identity } = useInternetIdentity();
  const { data: stats, isLoading: statsLoading } = useGetTokenStats();
  const { data: balance, isLoading: balanceLoading } = useGetBalance(identity?.getPrincipal());

  const items = [
    {
      icon: Coins,
      label: 'Your Balance',
      value: balanceLoading ? '…' : balance !== undefined ? `${(Number(balance) / 100).toFixed(2)} IPGT` : '—',
    },
    {
      icon: BarChart3,
      label: 'Circulating Supply',
      value: statsLoading ? '…' : stats ? `${(Number(stats.circulatingSupply) / 100).toLocaleString()} IPGT` : '—',
    },
    {
      icon: TrendingDown,
      label: 'Total Burned',
      value: statsLoading ? '…' : stats ? `${(Number(stats.totalBurned) / 100).toFixed(4)} IPGT` : '—',
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 px-3 py-2 rounded-sm border border-gold/20"
              style={{ background: 'oklch(0.13 0.03 240)' }}
            >
              <Icon className="w-4 h-4 text-gold" />
              <div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold text-gray-100">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="p-5 rounded-sm border border-gold/20"
            style={{ background: 'oklch(0.13 0.03 240)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-sm bg-gold/15 border border-gold/25 flex items-center justify-center">
                <Icon className="w-4 h-4 text-gold" />
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</span>
            </div>
            <div className="text-xl font-bold text-gray-100 font-serif">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
