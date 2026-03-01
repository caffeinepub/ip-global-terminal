import { Link, useLocation } from '@tanstack/react-router';
import { Shield, LogIn, LogOut, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: userProfile } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/database', label: 'IP Database' },
    { to: '/whitepaper', label: 'Whitepaper' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-gold/20 backdrop-blur-md"
      style={{ background: 'oklch(0.10 0.025 240 / 0.95)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img
            src="/assets/generated/ipgt-logo.dim_128x128.png"
            alt="IPGT Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-serif text-xl font-bold text-gold tracking-wide">IP Global Terminal</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-gold bg-gold/10'
                  : 'text-gray-300 hover:text-gold hover:bg-gold/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <span className="hidden sm:block text-gray-300 text-sm">
              {userProfile.name}
            </span>
          )}
          <button
            onClick={handleAuth}
            disabled={isLoggingIn}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 ${
              isAuthenticated
                ? 'border border-gold/30 text-gray-300 hover:text-gold hover:border-gold/60'
                : 'bg-gold text-navy hover:bg-gold/90'
            }`}
          >
            {isLoggingIn ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isAuthenticated ? (
              <LogOut className="w-3.5 h-3.5" />
            ) : (
              <LogIn className="w-3.5 h-3.5" />
            )}
            {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </header>
  );
}
