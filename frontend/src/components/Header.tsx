import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile, useGetBalance } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import { Coins, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: userProfile } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: balance } = useGetBalance(principal as Principal | undefined);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const formatBalance = (bal: bigint | undefined) => {
    if (bal === undefined) return '—';
    return Number(bal).toLocaleString();
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/database', label: 'IP Database' },
    { to: '/register', label: 'Register IP' },
    { to: '/dashboard', label: 'Coin Dashboard' },
    { to: '/whitepaper', label: 'Whitepaper' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-navy/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/ipgt-logo.dim_128x128.png"
              alt="IPGT Logo"
              className="w-10 h-10 rounded-sm object-cover"
            />
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-lg leading-tight text-gold-DEFAULT gold-text">
                IP Global Terminal
              </div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">
                IPGT Blockchain
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-gold-DEFAULT transition-colors rounded-md hover:bg-charcoal"
                activeProps={{ className: 'px-4 py-2 text-sm font-medium text-gold-DEFAULT bg-charcoal rounded-md' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth + Balance */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-charcoal border border-border">
                <Coins className="w-4 h-4 text-gold-DEFAULT" style={{ color: 'oklch(0.78 0.14 85)' }} />
                <span className="text-sm font-medium text-foreground">
                  {formatBalance(balance)} <span className="text-muted-foreground text-xs">IPGT</span>
                </span>
              </div>
            )}
            {isAuthenticated && userProfile && (
              <div className="text-sm text-muted-foreground">
                {userProfile.name}
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className={isAuthenticated
                ? 'border-border text-foreground hover:bg-charcoal'
                : 'bg-gold-DEFAULT text-navy font-semibold hover:bg-gold-light'
              }
              style={!isAuthenticated ? { backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' } : {}}
            >
              {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-charcoal rounded-md"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 px-4 flex flex-col gap-3">
              {isAuthenticated && (
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="w-4 h-4" style={{ color: 'oklch(0.78 0.14 85)' }} />
                  <span className="font-medium">{formatBalance(balance)} IPGT</span>
                  {userProfile && <span className="text-muted-foreground">· {userProfile.name}</span>}
                </div>
              )}
              <Button
                onClick={() => { handleAuth(); setMobileOpen(false); }}
                disabled={isLoggingIn}
                size="sm"
                className="w-full"
                style={!isAuthenticated ? { backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' } : {}}
              >
                {isLoggingIn ? 'Connecting...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
