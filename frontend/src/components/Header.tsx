import { Link, useLocation } from '@tanstack/react-router';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/register', label: 'Register IP' },
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

        {/* Mobile nav placeholder — keeps layout balanced */}
        <div className="md:hidden" />
      </div>
    </header>
  );
}
