import { Link } from '@tanstack/react-router';
import { Shield } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'ip-global-terminal');

  return (
    <footer className="bg-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/assets/generated/ipgt-logo.dim_128x128.png" alt="IPGT Logo" className="w-8 h-8" />
              <span className="font-serif text-lg font-bold text-white">IP Global Terminal</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              A decentralized platform for registering and protecting intellectual property rights on the Internet Computer blockchain.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'IP Database', to: '/database' },
                { label: 'Whitepaper', to: '/whitepaper' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/50 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              {[
                'Blockchain IP Registration',
                'SHA-256 Document Hashing',
                'Immutable On-Chain Records',
                'Open Cryptographic Auditing',
                'Automated Filing Strategy',
                'SME-First Infrastructure',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-white/50 text-sm">
                  <Shield className="w-3 h-3 text-gold flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {year} IP Global Terminal. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Built with{' '}
            <span className="text-gold">♥</span>{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
