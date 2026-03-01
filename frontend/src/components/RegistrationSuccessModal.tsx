import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  ipId: bigint | null;
  burnAmount: number;
}

export default function RegistrationSuccessModal({
  open,
  onClose,
  ipId,
  burnAmount,
}: RegistrationSuccessModalProps) {
  const formattedBurn = (burnAmount / 100).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md border border-gold/30 text-gray-100"
        style={{ background: 'oklch(0.13 0.03 240)' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-sm bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <DialogTitle className="font-serif text-xl text-gold">IP Registered!</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-sm">
            Your intellectual property has been successfully registered on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {ipId !== null && (
            <div
              className="flex items-center justify-between p-3 rounded-sm border border-gold/15"
              style={{ background: 'oklch(0.10 0.025 240)' }}
            >
              <span className="text-gray-400 text-sm">IP Record ID</span>
              <span className="text-gold font-mono font-semibold">
                #{String(ipId).padStart(4, '0')}
              </span>
            </div>
          )}
          <div
            className="flex items-center justify-between p-3 rounded-sm border border-gold/15"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <span className="text-gray-400 text-sm">IPGT Burned</span>
            <span className="text-orange-400 font-semibold">{formattedBurn} IPGT</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your IP record is now permanently stored on the Internet Computer blockchain. The registration fee has been burned, reducing the total IPGT supply.
          </p>
        </div>

        <div className="mt-4">
          <Button
            onClick={onClose}
            className="w-full bg-gold text-navy font-semibold hover:bg-gold/90"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
