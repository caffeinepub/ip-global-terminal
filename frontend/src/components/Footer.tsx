import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'ip-global-terminal');

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'oklch(0.06 0 0)',
        borderColor: 'oklch(0.78 0.15 85 / 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded flex items-center justify-center"
                style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.15)', border: '1px solid oklch(0.78 0.15 85 / 0.4)' }}
              >
                <Shield className="w-5 h-5" style={{ color: 'oklch(0.78 0.15 85)' }} />
              </div>
              <div>
                <div
                  className="text-sm font-bold tracking-widest uppercase"
                  style={{ color: 'oklch(0.78 0.15 85)', fontFamily: 'Playfair Display, serif' }}
                >
                  IPGT
                </div>
                <div className="text-xs" style={{ color: 'oklch(0.55 0 0)' }}>
                  IP Global Terminal
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.55 0 0)' }}>
              Decentralised intellectual property registration on the Internet Computer blockchain. WIPO-free, sovereign, and immutable.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'oklch(0.78 0.15 85)' }}
            >
              Platform
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', path: '/' },
                { label: 'IP Database', path: '/database' },
                { label: 'Whitepaper', path: '/whitepaper' },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate({ to: link.path })}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'oklch(0.55 0 0)' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: 'oklch(0.78 0.15 85)' }}
            >
              Features
            </h3>
            <ul className="space-y-2">
              {[
                'On-Chain Registration',
                'SHA-256 Document Hashing',
                'Global Jurisdiction Support',
                'WIPO-Free & Sovereign',
                'Immutable Blockchain Record',
              ].map((feature) => (
                <li key={feature} className="text-sm" style={{ color: 'oklch(0.55 0 0)' }}>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'oklch(0.78 0.15 85 / 0.15)' }}
        >
          <p className="text-xs" style={{ color: 'oklch(0.45 0 0)' }}>
            © {year} IP Global Terminal. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'oklch(0.45 0 0)' }}>
            Built with{' '}
            <Heart className="w-3 h-3 inline" style={{ color: 'oklch(0.78 0.15 85)' }} fill="oklch(0.78 0.15 85)" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors"
              style={{ color: 'oklch(0.78 0.15 85)' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
