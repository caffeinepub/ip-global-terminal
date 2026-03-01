import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate: saveProfile, isPending, error } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile({
      name: name.trim(),
      email: email.trim() || undefined,
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="border-border max-w-md"
        style={{ backgroundColor: 'oklch(0.16 0.025 240)' }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)' }}
            >
              <Globe className="w-5 h-5" style={{ color: 'oklch(0.78 0.14 85)' }} />
            </div>
            <DialogTitle className="font-serif text-xl text-foreground">
              Welcome to IPGT
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Set up your profile to start registering intellectual property on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Full Name <span style={{ color: 'oklch(0.78 0.14 85)' }}>*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="ipgt-input bg-charcoal border-border text-foreground placeholder:text-muted-foreground focus:border-gold-DEFAULT"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium">
              Email <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="ipgt-input bg-charcoal border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Failed to save profile'}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full font-semibold"
            style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
          >
            {isPending ? 'Saving...' : 'Create Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
