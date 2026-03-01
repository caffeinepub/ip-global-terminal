import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useTransferTokens } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import TokenStats from '../components/TokenStats';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Coins, Send, Lock, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function CoinDashboard() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { mutateAsync: transferTokens, isPending } = useTransferTokens();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePrincipal = (p: string): boolean => {
    try {
      Principal.fromText(p);
      return true;
    } catch {
      return false;
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!recipient.trim()) {
      setError('Recipient principal is required.');
      return;
    }
    if (!validatePrincipal(recipient.trim())) {
      setError('Invalid principal format. Please enter a valid ICP principal ID.');
      return;
    }
    const amountNum = parseInt(amount, 10);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      await transferTokens({
        to: Principal.fromText(recipient.trim()),
        amount: BigInt(amountNum),
      });
      setSuccess(`Successfully transferred ${amountNum.toLocaleString()} IPGT to ${recipient.slice(0, 12)}...`);
      setRecipient('');
      setAmount('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Insufficient')) {
        setError('Insufficient IPGT balance for this transfer.');
      } else if (msg.includes('Unauthorized')) {
        setError('You must be logged in to transfer tokens.');
      } else {
        setError(msg || 'Transfer failed. Please try again.');
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.12)' }}
        >
          <Lock className="w-8 h-8" style={{ color: 'oklch(0.78 0.14 85)' }} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-8">
          Connect with Internet Identity to view your IPGT balance and manage your coins.
        </p>
        <Link to="/">
          <Button variant="outline" className="border-border text-foreground hover:bg-charcoal">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
          >
            <Coins className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">IPGT Coin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your IPGT tokens</p>
          </div>
        </div>
      </div>

      {/* Token Stats */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Token Overview</h2>
        <TokenStats showAll />
      </section>

      <Separator className="bg-border mb-10" />

      {/* Coin Info */}
      <section className="mb-10">
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">About IPGT Coin</h2>
        <div
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Total Supply', value: '100,000,000,000 IPGT' },
              { label: 'Registration Burn', value: '0.02 IPGT per IP' },
              { label: 'Blockchain', value: 'Internet Computer (ICP)' },
              { label: 'Token Model', value: 'Deflationary (burn-on-use)' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <div
            className="flex items-start gap-3 p-3 rounded-lg text-sm"
            style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.08)', border: '1px solid oklch(0.78 0.14 85 / 0.2)' }}
          >
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'oklch(0.78 0.14 85)' }} />
            <p className="text-muted-foreground">
              IPGT coins are required to register intellectual property. Each registration permanently burns 0.02 IPGT, creating a deflationary pressure that preserves long-term coin value.
            </p>
          </div>
        </div>
      </section>

      <Separator className="bg-border mb-10" />

      {/* Transfer Form */}
      <section>
        <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Transfer IPGT</h2>
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
        >
          <form onSubmit={handleTransfer} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-foreground font-medium">
                Recipient Principal <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g., aaaaa-aa or full principal ID"
                className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter the ICP principal ID of the recipient.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground font-medium">
                Amount (IPGT) <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 1000"
                className="bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <div
                className="flex items-center gap-3 p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'oklch(0.50 0.14 160 / 0.12)', border: '1px solid oklch(0.50 0.14 160 / 0.3)' }}
              >
                <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'oklch(0.65 0.14 160)' }} />
                <span className="text-foreground">{success}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full font-semibold h-11 gap-2"
              style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Transferring...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Transfer IPGT
                </>
              )}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
