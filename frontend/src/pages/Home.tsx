import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Globe, Lock, Zap, ArrowRight, Database, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Blockchain-Secured',
    description: 'Every IP record is immutably stored on the Internet Computer blockchain, providing tamper-proof protection.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Globally Recognized',
    description: 'Build a universally accessible IP registry that transcends borders and jurisdictions.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Cryptographic Proof',
    description: 'SHA-256 document hashing ensures the integrity and authenticity of every registered IP.',
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'IPGT Coin Economy',
    description: 'A deflationary token model where each IP registration burns IPGT coins, preserving long-term value.',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Open Database',
    description: 'The global IP database is publicly searchable and browsable — no login required.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Instant Registration',
    description: 'Register patents, trademarks, and copyrights in seconds with on-chain finality.',
  },
];

export default function Home() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] sm:h-[500px]">
          <img
            src="/assets/generated/ipgt-hero-banner.dim_1400x500.png"
            alt="IP Global Terminal — Global Blockchain Network"
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, oklch(0.10 0.02 240 / 0.92) 0%, oklch(0.10 0.02 240 / 0.65) 60%, oklch(0.10 0.02 240 / 0.3) 100%)',
            }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
                  style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.15)', color: 'oklch(0.78 0.14 85)', border: '1px solid oklch(0.78 0.14 85 / 0.3)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'oklch(0.78 0.14 85)' }} />
                  IPGT Blockchain — Live
                </div>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                  IP Global{' '}
                  <span style={{ color: 'oklch(0.78 0.14 85)' }}>Terminal</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                  Secure, Transparent, Decentralized — The world's first blockchain-powered global intellectual property registry.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/database">
                    <Button
                      size="lg"
                      className="font-semibold gap-2"
                      style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
                    >
                      <Database className="w-4 h-4" />
                      Browse IP Database
                    </Button>
                  </Link>
                  {isAuthenticated ? (
                    <Link to="/register">
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-semibold gap-2 border-border text-foreground hover:bg-charcoal"
                      >
                        Register Your IP
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard">
                      <Button
                        size="lg"
                        variant="outline"
                        className="font-semibold gap-2 border-border text-foreground hover:bg-charcoal"
                      >
                        <Coins className="w-4 h-4" />
                        Get IPGT Coins
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="border-y border-border py-6"
        style={{ backgroundColor: 'oklch(0.14 0.025 240)' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Total Supply', value: '100B', unit: 'IPGT' },
              { label: 'Blockchain', value: 'ICP', unit: 'Internet Computer' },
              { label: 'IP Categories', value: '3', unit: 'Types' },
              { label: 'Registration Fee', value: '100', unit: 'IPGT Burned' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif font-bold text-2xl" style={{ color: 'oklch(0.78 0.14 85)' }}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.unit}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose <span style={{ color: 'oklch(0.78 0.14 85)' }}>IPGT</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The IP Global Terminal combines blockchain immutability with a globally accessible registry to protect intellectual property like never before.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg p-6 transition-all duration-200 hover:shadow-gold"
                style={{
                  backgroundColor: 'oklch(0.16 0.025 240)',
                  border: '1px solid oklch(0.28 0.03 240)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.78 0.14 85 / 0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.28 0.03 240)';
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.12)', color: 'oklch(0.78 0.14 85)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-serif font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 border-t border-border"
        style={{ backgroundColor: 'oklch(0.14 0.025 240)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Protect Your{' '}
            <span style={{ color: 'oklch(0.78 0.14 85)' }}>Intellectual Property</span>?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the global IP registry. Login with Internet Identity, acquire IPGT coins, and register your patents, trademarks, and copyrights on-chain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/database">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold border-border text-foreground hover:bg-charcoal gap-2"
              >
                <Database className="w-4 h-4" />
                Explore Database
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/register">
                <Button
                  size="lg"
                  className="font-semibold gap-2"
                  style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
                >
                  Register IP Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
