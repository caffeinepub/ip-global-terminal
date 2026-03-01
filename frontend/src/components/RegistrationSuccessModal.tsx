import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { CheckCircle, Shield, ExternalLink } from 'lucide-react';

interface RegistrationSuccessModalProps {
  open: boolean;
  ipId: bigint | null;
  onClose: () => void;
}

export default function RegistrationSuccessModal({ open, ipId, onClose }: RegistrationSuccessModalProps) {
  const mockEthTxId = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const mockEthBlock = Math.floor(19_000_000 + Math.random() * 500_000);
  const mockSolSig = Array.from({ length: 88 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
  const mockSolSlot = Math.floor(250_000_000 + Math.random() * 5_000_000);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="max-w-lg"
        style={{
          backgroundColor: 'oklch(0.09 0 0)',
          border: '1px solid oklch(0.78 0.15 85 / 0.4)',
          color: 'oklch(0.97 0 0)',
        }}
      >
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-3 mb-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.15)', border: '2px solid oklch(0.78 0.15 85 / 0.5)' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: 'oklch(0.78 0.15 85)' }} />
            </div>
            <DialogTitle
              className="text-2xl font-bold"
              style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
            >
              IP Successfully Registered
            </DialogTitle>
            <DialogDescription style={{ color: 'oklch(0.60 0 0)' }}>
              Your intellectual property has been permanently recorded on the Internet Computer blockchain.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* IP ID */}
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.1)', border: '1px solid oklch(0.78 0.15 85 / 0.3)' }}
          >
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'oklch(0.78 0.15 85)' }}>
              IP Record ID
            </p>
            <p className="text-3xl font-bold" style={{ color: 'oklch(0.78 0.15 85)', fontFamily: 'Playfair Display, serif' }}>
              #{ipId?.toString() ?? '—'}
            </p>
          </div>

          {/* ICP confirmation */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'oklch(0.13 0 0)', border: '1px solid oklch(0.22 0 0)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <span className="text-sm font-semibold" style={{ color: 'oklch(0.78 0.15 85)' }}>
                Internet Computer — Confirmed
              </span>
              <div className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: 'oklch(0.78 0.15 85)' }} />
            </div>
            <p className="text-xs" style={{ color: 'oklch(0.55 0 0)' }}>
              Finalized on-chain. Immutable and tamper-proof.
            </p>
          </div>

          {/* Future integrations */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'oklch(0.11 0 0)', border: '1px solid oklch(0.20 0 0)' }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'oklch(0.45 0 0)' }}>
              Also Recorded On — Future Integration (Simulated Reference)
            </p>
            <div className="space-y-3">
              {/* Ethereum */}
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.65 0 0)' }}>Ethereum</p>
                <p className="text-xs font-mono truncate" style={{ color: 'oklch(0.45 0 0)' }}>
                  Tx: {mockEthTxId.slice(0, 20)}…
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.40 0 0)' }}>
                  Block #{mockEthBlock.toLocaleString()}
                </p>
              </div>
              {/* Solana */}
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.65 0 0)' }}>Solana</p>
                <p className="text-xs font-mono truncate" style={{ color: 'oklch(0.45 0 0)' }}>
                  Sig: {mockSolSig.slice(0, 20)}…
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.40 0 0)' }}>
                  Slot #{mockSolSlot.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: 'oklch(0.78 0.15 85)',
              color: 'oklch(0.08 0 0)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.85 0.14 85)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85)';
            }}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
