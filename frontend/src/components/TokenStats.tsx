import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBalance, useGetCirculatingSupply, useGetTotalBurnedTokens } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Coins, TrendingDown, Activity } from 'lucide-react';

interface TokenStatsProps {
  showAll?: boolean;
}

function formatNumber(n: bigint | undefined): string {
  if (n === undefined) return '—';
  return Number(n).toLocaleString();
}

export default function TokenStats({ showAll = false }: TokenStatsProps) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal() as Principal | undefined;
  const { data: balance, isLoading: balanceLoading } = useGetBalance(principal);
  const { data: circulating, isLoading: circulatingLoading } = useGetCirculatingSupply();
  const { data: burned, isLoading: burnedLoading } = useGetTotalBurnedTokens();

  if (!showAll) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-charcoal border border-border">
        <Coins className="w-4 h-4" style={{ color: 'oklch(0.78 0.14 85)' }} />
        <span className="text-sm font-medium">
          {balanceLoading ? '...' : formatNumber(balance)}{' '}
          <span className="text-muted-foreground text-xs">IPGT</span>
        </span>
      </div>
    );
  }

  const stats = [
    {
      label: 'Your Balance',
      value: balanceLoading ? '...' : formatNumber(balance),
      unit: 'IPGT',
      icon: <Coins className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />,
      highlight: true,
    },
    {
      label: 'Circulating Supply',
      value: circulatingLoading ? '...' : formatNumber(circulating),
      unit: 'IPGT',
      icon: <Activity className="w-5 h-5" style={{ color: 'oklch(0.60 0.12 200)' }} />,
      highlight: false,
    },
    {
      label: 'Total Burned',
      value: burnedLoading ? '...' : formatNumber(burned),
      unit: 'IPGT',
      icon: <TrendingDown className="w-5 h-5" style={{ color: 'oklch(0.65 0.18 30)' }} />,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg p-5"
          style={{
            backgroundColor: 'oklch(0.16 0.025 240)',
            border: stat.highlight ? '1px solid oklch(0.78 0.14 85 / 0.4)' : '1px solid oklch(0.28 0.03 240)',
            boxShadow: stat.highlight ? '0 0 20px oklch(0.78 0.14 85 / 0.08)' : 'none',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.20 0.025 240)' }}
            >
              {stat.icon}
            </div>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-bold font-mono"
              style={{ color: stat.highlight ? 'oklch(0.78 0.14 85)' : 'oklch(0.95 0.01 240)' }}
            >
              {stat.value}
            </span>
            <span className="text-sm text-muted-foreground">{stat.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
