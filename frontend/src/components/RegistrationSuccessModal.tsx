import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle, Shield, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  ipId: bigint | null;
  ipTitle: string;
}

export default function RegistrationSuccessModal({
  open,
  onClose,
  ipId,
  ipTitle,
}: RegistrationSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const idStr = ipId !== null ? ipId.toString() : '—';

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(idStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-black border border-gold-700/40 text-white max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gold-900/30 border border-gold-600/40 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-gold-400" />
            </div>
          </div>
          <DialogTitle className="font-serif text-2xl text-white text-center">
            Registration Successful
          </DialogTitle>
          <DialogDescription className="text-white/60 text-center text-sm">
            Your intellectual property has been registered on the blockchain.
          </DialogDescription>
        </DialogHeader>

        {/* IP Title */}
        <div className="bg-gold-900/10 border border-gold-800/30 rounded-sm px-4 py-3 text-center">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Registered Title</div>
          <div className="text-white font-medium">{ipTitle}</div>
        </div>

        {/* IP ID */}
        <div className="border border-gold-800/30 rounded-sm px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/40 uppercase tracking-wider">IP Registry ID</span>
            <button
              onClick={copyId}
              className="flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-gold-400 text-lg font-bold">#{idStr}</div>
        </div>

        {/* On-chain confirmation */}
        <div className="flex items-start gap-3 bg-gold-900/10 border border-gold-700/20 rounded-sm px-4 py-3">
          <Shield className="w-4 h-4 text-gold-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-white/70">
            <span className="text-gold-300 font-medium">On-Chain Confirmed.</span>{' '}
            Your IP record is permanently stored on the Internet Computer blockchain and cannot be altered or deleted.
          </div>
        </div>

        {/* What's next */}
        <div className="border-t border-gold-900/20 pt-4">
          <div className="text-xs text-white/40 uppercase tracking-wider mb-3">What's Next</div>
          <ul className="space-y-2 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-600 mt-0.5 flex-shrink-0" />
              Search the IP Database to verify your registration is visible
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-600 mt-0.5 flex-shrink-0" />
              Save your IP ID as proof of your registration date
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-gold-600 mt-0.5 flex-shrink-0" />
              Consult a qualified IP attorney for formal legal protection
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3 rounded-sm transition-colors mt-2"
        >
          Done
        </button>
      </DialogContent>
    </Dialog>
  );
}
