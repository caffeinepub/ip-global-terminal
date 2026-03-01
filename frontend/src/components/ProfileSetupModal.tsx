import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [email, setEmail] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile({
      name: name.trim(),
      organisation: organisation.trim(),
      email: email.trim() || undefined,
    });
  };

  const inputStyle = { background: 'oklch(0.10 0.025 240)' };
  const inputClass = 'border-gold/25 text-gray-100 placeholder:text-gray-600 focus:border-gold/50';

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md border border-gold/30 text-gray-100 [&>button]:hidden"
        style={{ background: 'oklch(0.13 0.03 240)' }}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-sm bg-gold/15 border border-gold/30 flex items-center justify-center">
              <User className="w-5 h-5 text-gold" />
            </div>
            <DialogTitle className="font-serif text-xl text-gold">Welcome to IPGT</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-sm">
            Set up your profile to get started with the IP registry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-gray-300 text-sm">
              Display Name <span className="text-gold">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organisation" className="text-gray-300 text-sm">
              Organisation <span className="text-gray-600 text-xs">(optional)</span>
            </Label>
            <Input
              id="organisation"
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Your company or organisation"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email <span className="text-gray-600 text-xs">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full bg-gold text-navy font-semibold hover:bg-gold/90 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving…
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
