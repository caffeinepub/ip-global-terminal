import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetBalance, useTransferTokens, useGetTokenStats } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, Coins, TrendingDown, BarChart3, AlertCircle, Info } from 'lucide-react';
import TokenStats from '../components/TokenStats';
import { Principal } from '@dfinity/principal';

export default function CoinDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: balance, isLoading: balanceLoading } = useGetBalance(identity?.getPrincipal());
  const { data: stats } = useGetTokenStats();
  const { mutateAsync: transfer, isPending: transferring } = useTransferTokens();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    setTransferSuccess('');

    if (!recipient.trim() || !amount) {
      setTransferError('Please enter a recipient and amount.');
      return;
    }

    let toPrincipal: Principal;
    try {
      toPrincipal = Principal.fromText(recipient.trim());
    } catch {
      setTransferError('Invalid principal ID. Please check the recipient address.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setTransferError('Please enter a valid positive amount.');
      return;
    }

    const amountBase = BigInt(Math.round(amountNum * 100));
    if (balance !== undefined && amountBase > balance) {
      setTransferError('Insufficient balance.');
      return;
    }

    try {
      await transfer({ to: toPrincipal, amount: amountBase });
      setTransferSuccess(`Successfully transferred ${amountNum.toFixed(2)} IPGT.`);
      setRecipient('');
      setAmount('');
    } catch (err: any) {
      setTransferError(err?.message ?? 'Transfer failed. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'oklch(0.12 0.025 240)' }}>
        <div
          className="text-center p-10 rounded-sm border border-gold/20 max-w-md"
          style={{ background: 'oklch(0.13 0.03 240)' }}
        >
          <Coins className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-gold mb-2">IPGT Dashboard</h2>
          <p className="text-gray-400">Please log in to view your IPGT token dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: 'oklch(0.12 0.025 240)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-gold mb-2">IPGT Dashboard</h1>
          <p className="text-gray-400">Manage your IPGT tokens and view network statistics.</p>
        </div>

        {/* Token Stats */}
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-gold mb-4">Token Statistics</h2>
          <TokenStats />
        </section>

        {/* Coin Info */}
        <section className="mb-8">
          <h2 className="font-serif text-xl font-semibold text-gold mb-4">About IPGT</h2>
          <div
            className="p-6 rounded-sm border border-gold/20 space-y-3"
            style={{ background: 'oklch(0.13 0.03 240)' }}
          >
            {[
              { label: 'Token Name', value: 'Intellectual Property Global Token' },
              { label: 'Symbol', value: 'IPGT' },
              { label: 'Total Supply', value: '1,000,000,000 IPGT' },
              { label: 'Registration Burn', value: '0.02 IPGT per registration' },
              { label: 'Blockchain', value: 'Internet Computer Protocol (ICP)' },
              { label: 'Model', value: 'Deflationary — tokens burned on each registration' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <span className="text-gray-500 text-sm sm:w-44 flex-shrink-0">{item.label}</span>
                <span className="text-gray-200 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Transfer Form */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-gold mb-4">Transfer IPGT</h2>
          <form
            onSubmit={handleTransfer}
            className="p-6 rounded-sm border border-gold/20 space-y-4"
            style={{ background: 'oklch(0.13 0.03 240)' }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="recipient" className="text-gray-300">Recipient Principal ID</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. aaaaa-aa"
                className="border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-gray-300">
                Amount (IPGT)
                {balance !== undefined && (
                  <span className="ml-2 text-gray-500 text-xs">
                    Balance: {(Number(balance) / 100).toFixed(2)} IPGT
                  </span>
                )}
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50"
                style={{ background: 'oklch(0.10 0.025 240)' }}
              />
            </div>

            {transferError && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-300">{transferError}</AlertDescription>
              </Alert>
            )}

            {transferSuccess && (
              <Alert className="border-green-500/30 bg-green-500/10">
                <AlertDescription className="text-green-300">{transferSuccess}</AlertDescription>
              </Alert>
            )}

            <div
              className="flex items-start gap-2 p-3 rounded-sm border border-gold/15"
              style={{ background: 'oklch(0.10 0.025 240)' }}
            >
              <Info className="w-4 h-4 text-gold/60 mt-0.5 flex-shrink-0" />
              <p className="text-gray-500 text-xs leading-relaxed">
                Transfers are irreversible on-chain transactions. Double-check the recipient principal before confirming.
              </p>
            </div>

            <Button
              type="submit"
              disabled={transferring}
              className="w-full bg-gold text-navy font-semibold hover:bg-gold/90 disabled:opacity-50"
            >
              {transferring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Transferring…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Transfer IPGT
                </>
              )}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
