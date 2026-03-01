import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface RegistrationSuccessModalProps {
  ipId: bigint;
  burnAmount: number;
  onClose: () => void;
}

export default function RegistrationSuccessModal({ ipId, burnAmount, onClose }: RegistrationSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(ipId.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewDatabase = () => {
    onClose();
    navigate({ to: '/database' });
  };

  // Format the burn amount to avoid trailing zeros (e.g. 0.02 not 0.020000)
  const burnAmountDisplay = Number.isInteger(burnAmount)
    ? burnAmount.toLocaleString()
    : burnAmount.toFixed(2).replace(/\.?0+$/, '') || burnAmount.toString();

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="border-border max-w-md"
        style={{ backgroundColor: 'oklch(0.16 0.025 240)' }}
      >
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'oklch(0.78 0.14 85)' }} />
            </div>
            <div>
              <DialogTitle className="font-serif text-2xl text-foreground mb-2">
                IP Registered Successfully
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Your intellectual property has been secured on the IPGT blockchain.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ backgroundColor: 'oklch(0.20 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">IP Record ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-foreground">#{ipId.toString()}</span>
                <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">IPGT Burned</span>
              <span className="font-semibold" style={{ color: 'oklch(0.78 0.14 85)' }}>
                {burnAmountDisplay} IPGT
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-charcoal"
              onClick={onClose}
            >
              Register Another
            </Button>
            <Button
              className="flex-1 font-semibold"
              style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
              onClick={handleViewDatabase}
            >
              View Database
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
