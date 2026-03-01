import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Shield, Globe, Lock, Zap, ArrowRight, Database, FileCheck } from 'lucide-react';
import AnimatedWorldMap from '../components/AnimatedWorldMap';

const features = [
  {
    icon: Shield,
    title: 'Immutable Registration',
    description: 'Your IP is permanently recorded on the Internet Computer blockchain — tamper-proof and sovereign.',
  },
  {
    icon: Globe,
    title: 'Global Jurisdiction',
    description: 'Register across any jurisdiction worldwide without relying on centralised WIPO infrastructure.',
  },
  {
    icon: Lock,
    title: 'SHA-256 Hashing',
    description: 'Every document is cryptographically hashed before registration, providing irrefutable proof of existence.',
  },
  {
    icon: Zap,
    title: 'Instant Finality',
    description: 'On-chain finality in seconds. No waiting for confirmations or intermediary approvals.',
  },
  {
    icon: Database,
    title: 'Open Database',
    description: 'Query the global IP registry freely. Full transparency with no gatekeepers.',
  },
  {
    icon: FileCheck,
    title: 'Document Proof',
    description: 'Attach document hashes to your registration for cryptographic proof of authorship.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'oklch(0.08 0 0)' }}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image — rendered as <img> for crisp, native-resolution display */}
        <img
          src="/assets/generated/world-map-black.dim_3840x2160.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            imageRendering: 'auto',
            // GPU-composited layer for sharpness — avoids subpixel blur from CSS transforms
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Prevent browser from applying lossy downscaling
            msInterpolationMode: 'bicubic',
          } as React.CSSProperties}
        />

        {/* Dark overlay to ensure black dominates */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.70) 100%)' }}
        />

        {/* Animated map overlay */}
        <div className="absolute inset-0 opacity-40">
          <AnimatedWorldMap />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              backgroundColor: 'oklch(0.78 0.15 85 / 0.15)',
              border: '1px solid oklch(0.78 0.15 85 / 0.4)',
              color: 'oklch(0.78 0.15 85)',
            }}
          >
            <Shield className="w-3 h-3" />
            Decentralised IP Registry on ICP
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
          >
            Protect Your{' '}
            <span style={{ color: 'oklch(0.78 0.15 85)' }}>Intellectual</span>
            <br />
            Property — Globally
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'oklch(0.75 0 0)' }}
          >
            Register patents, trademarks, and copyrights on the Internet Computer blockchain.
            Sovereign, WIPO-free, and immutable — your IP, your chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate({ to: '/register' })}
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: 'oklch(0.78 0.15 85)',
                color: 'oklch(0.08 0 0)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.85 0.14 85)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px oklch(0.78 0.15 85 / 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              Register IP Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate({ to: '/database' })}
              className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                color: 'oklch(0.97 0 0)',
                border: '1px solid oklch(0.97 0 0 / 0.3)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.6)';
                (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.78 0.15 85)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'oklch(0.97 0 0 / 0.3)';
                (e.currentTarget as HTMLButtonElement).style.color = 'oklch(0.97 0 0)';
              }}
            >
              Browse IP Database
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, oklch(0.08 0 0))' }}
        />
      </section>

      {/* Stats bar */}
      <section
        className="py-8 border-y"
        style={{
          backgroundColor: 'oklch(0.10 0 0)',
          borderColor: 'oklch(0.78 0.15 85 / 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Blockchain', value: 'Internet Computer' },
              { label: 'Finality', value: '< 2 seconds' },
              { label: 'WIPO Dependency', value: 'Zero' },
              { label: 'Immutability', value: '100%' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-xl font-bold"
                  style={{ color: 'oklch(0.78 0.15 85)', fontFamily: 'Playfair Display, serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs mt-1 tracking-wider uppercase" style={{ color: 'oklch(0.50 0 0)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
            >
              Why{' '}
              <span style={{ color: 'oklch(0.78 0.15 85)' }}>IP Global Terminal</span>?
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'oklch(0.55 0 0)' }}>
              A new paradigm for intellectual property — decentralised, borderless, and sovereign.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: 'oklch(0.11 0 0)',
                    border: '1px solid oklch(0.20 0 0)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.78 0.15 85 / 0.4)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px oklch(0.78 0.15 85 / 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.20 0 0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'oklch(0.78 0.15 85 / 0.12)', border: '1px solid oklch(0.78 0.15 85 / 0.3)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: 'oklch(0.78 0.15 85)' }} />
                  </div>
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: 'oklch(0.92 0 0)', fontFamily: 'Playfair Display, serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.55 0 0)' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'oklch(0.10 0 0)', borderTop: '1px solid oklch(0.78 0.15 85 / 0.15)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
          >
            Ready to Secure Your IP?
          </h2>
          <p className="text-base mb-8" style={{ color: 'oklch(0.55 0 0)' }}>
            Join the decentralised IP revolution. Register your intellectual property on-chain today — no intermediaries, no borders.
          </p>
          <button
            onClick={() => navigate({ to: '/register' })}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-lg font-semibold text-sm transition-all duration-200"
            style={{
              backgroundColor: 'oklch(0.78 0.15 85)',
              color: 'oklch(0.08 0 0)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.85 0.14 85)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px oklch(0.78 0.15 85 / 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'oklch(0.78 0.15 85)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
            }}
          >
            Get Started — It's Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
