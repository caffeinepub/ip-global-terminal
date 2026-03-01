import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle2, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  ipId: bigint | null;
}

function generateMockEthTxId(): string {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateMockEthBlock(): number {
  return Math.floor(19_000_000 + Math.random() * 2_000_000);
}

function generateMockSolanaSig(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 88; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateMockSolanaSlot(): number {
  return Math.floor(250_000_000 + Math.random() * 10_000_000);
}

export default function RegistrationSuccessModal({
  open,
  onClose,
  ipId,
}: RegistrationSuccessModalProps) {
  const mockEthTxId = useMemo(() => generateMockEthTxId(), [open]);
  const mockEthBlock = useMemo(() => generateMockEthBlock(), [open]);
  const mockSolanaSig = useMemo(() => generateMockSolanaSig(), [open]);
  const mockSolanaSlot = useMemo(() => generateMockSolanaSlot(), [open]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg border border-gold/30 text-gray-100"
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
            className="flex items-center justify-between p-3 rounded-sm border border-green-500/20"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <span className="text-gray-400 text-sm">ICP Canister</span>
            <span className="text-green-400 font-semibold text-sm">Recorded ✓</span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Your IP record is now permanently stored on the Internet Computer blockchain — immutable, timestamped, and publicly verifiable.
          </p>

          {/* Simulated Cross-Chain Section */}
          <div
            className="rounded-sm border border-gold/20 overflow-hidden"
            style={{ background: 'oklch(0.10 0.025 240)' }}
          >
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gold/15"
              style={{ background: 'oklch(0.11 0.028 240)' }}
            >
              <FlaskConical className="w-3.5 h-3.5 text-gold/70" />
              <span className="text-gold/80 text-xs font-semibold uppercase tracking-wider">
                Also Recorded On
              </span>
              <span className="ml-auto text-xs text-gray-600 italic">
                Future Integration — Simulated Reference
              </span>
            </div>

            {/* Ethereum */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 text-[8px] font-bold">Ξ</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Ethereum</span>
              </div>
              <div className="space-y-1 pl-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Tx ID</span>
                  <span className="font-mono text-xs text-gray-400 break-all leading-relaxed">
                    {mockEthTxId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Block</span>
                  <span className="font-mono text-xs text-gray-400">
                    {mockEthBlock.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Solana */}
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 text-[8px] font-bold">◎</span>
                </div>
                <span className="text-gray-300 text-xs font-semibold">Solana</span>
              </div>
              <div className="space-y-1 pl-6">
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Sig</span>
                  <span className="font-mono text-xs text-gray-400 break-all leading-relaxed">
                    {mockSolanaSig}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs w-16 flex-shrink-0">Slot</span>
                  <span className="font-mono text-xs text-gray-400">
                    {mockSolanaSlot.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
