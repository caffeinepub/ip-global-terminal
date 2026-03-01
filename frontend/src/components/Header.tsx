import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Register IP', path: '/register' },
  { label: 'IP Database', path: '/database' },
  { label: 'Whitepaper', path: '/whitepaper' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'oklch(0.06 0 0)',
        borderColor: 'oklch(0.78 0.15 85 / 0.25)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.15)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' }}
            >
              <Shield className="w-5 h-5" style={{ color: 'oklch(0.78 0.15 85)' }} />
            </div>
            <div className="text-left">
              <div
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: 'oklch(0.78 0.15 85)', fontFamily: 'Playfair Display, serif' }}
              >
                IPGT
              </div>
              <div className="text-xs tracking-wider" style={{ color: 'oklch(0.65 0 0)' }}>
                IP Global Terminal
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate({ to: link.path })}
                className="px-4 py-2 text-sm font-medium rounded transition-all duration-200"
                style={{
                  color: isActive(link.path) ? 'oklch(0.78 0.15 85)' : 'oklch(0.80 0 0)',
                  backgroundColor: isActive(link.path) ? 'oklch(0.78 0.15 85 / 0.12)' : 'transparent',
                  borderBottom: isActive(link.path) ? '2px solid oklch(0.78 0.15 85)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    (e.target as HTMLButtonElement).style.color = 'oklch(0.78 0.15 85)';
                    (e.target as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85 / 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    (e.target as HTMLButtonElement).style.color = 'oklch(0.80 0 0)';
                    (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded"
            style={{ color: 'oklch(0.78 0.15 85)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            className="md:hidden border-t py-3 space-y-1"
            style={{ borderColor: 'oklch(0.78 0.15 85 / 0.2)' }}
          >
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate({ to: link.path });
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm font-medium rounded transition-colors"
                style={{
                  color: isActive(link.path) ? 'oklch(0.78 0.15 85)' : 'oklch(0.80 0 0)',
                  backgroundColor: isActive(link.path) ? 'oklch(0.78 0.15 85 / 0.12)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
