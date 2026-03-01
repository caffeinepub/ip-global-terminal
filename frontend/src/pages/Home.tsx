import { Link } from '@tanstack/react-router';
import { Shield, Globe, FileText, Lock, ChevronRight, Database, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/generated/hero-globe-vivid.dim_1920x900.png')" }}
        />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-48">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-medium tracking-wide">Blockchain-Secured IP Registry</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              IP Global<br />
              <span className="text-gold">Terminal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-2xl">
              A decentralized platform for registering, protecting, and managing intellectual property rights on the Internet Computer blockchain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-8 py-3.5 rounded-sm hover:bg-gold/90 transition-colors"
              >
                Register IP <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/database"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-3.5 rounded-sm hover:border-gold hover:text-gold transition-colors"
              >
                Explore Database
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-navy-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Three steps to immutable, verifiable intellectual property protection on-chain.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <FileText className="w-6 h-6" />,
                title: 'Create an Account',
                desc: 'Sign up using your secure digital identity. Your account establishes your on-chain presence and ownership credentials.',
              },
              {
                step: '02',
                icon: <Lock className="w-6 h-6" />,
                title: 'Register Your IP',
                desc: 'Upload your document and fill in the details. Our system generates a cryptographic SHA-256 hash and writes your IP record to the blockchain.',
              },
              {
                step: '03',
                icon: <Shield className="w-6 h-6" />,
                title: 'Proof of Ownership',
                desc: 'Receive a unique IP ID and cryptographic proof of registration that can be independently verified by any party.',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-charcoal border border-white/10 p-8 rounded-sm group hover:border-gold/40 transition-colors">
                <div className="absolute top-6 right-6 font-serif text-5xl font-bold text-white/5 group-hover:text-gold/10 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center text-gold mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automated Filing Strategy */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
                <Zap className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-sm font-medium">Automated Filing</span>
              </div>
              <h2 className="font-serif text-4xl font-bold text-white mb-6">
                Automated Filing Strategy
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                IPGT's automated filing engine streamlines the IP registration process, reducing manual overhead and ensuring consistent, accurate submissions every time.
              </p>
              <ul className="space-y-3">
                {[
                  'Automated SHA-256 document fingerprinting',
                  'Duplicate detection before submission',
                  'Structured metadata capture and validation',
                  'Instant on-chain confirmation and receipt',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-charcoal border border-white/10 p-8 rounded-sm">
              <div className="space-y-4">
                {[
                  { label: 'Document Hash', value: 'SHA-256 fingerprint', icon: <Lock className="w-4 h-4" /> },
                  { label: 'Timestamp', value: 'Block-level precision', icon: <Database className="w-4 h-4" /> },
                  { label: 'Duplicate Check', value: 'Pre-submission scan', icon: <Shield className="w-4 h-4" /> },
                  { label: 'Confirmation', value: 'Instant on-chain receipt', icon: <FileText className="w-4 h-4" /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 p-4 bg-navy/50 border border-white/5 rounded-sm">
                    <div className="w-8 h-8 bg-gold/10 rounded-sm flex items-center justify-center text-gold flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-white/40 text-xs uppercase tracking-wider">{item.label}</div>
                      <div className="text-white font-medium text-sm">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SME-First Infrastructure */}
      <section className="py-24 bg-navy-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Users className="w-5 h-5" />, title: 'Accessible', desc: 'Designed for individuals and small businesses' },
                  { icon: <Globe className="w-5 h-5" />, title: 'Global Reach', desc: 'Register IP across multiple jurisdictions' },
                  { icon: <Shield className="w-5 h-5" />, title: 'Secure', desc: 'Cryptographic proof of ownership' },
                  { icon: <Zap className="w-5 h-5" />, title: 'Fast', desc: 'Near-instant on-chain registration' },
                ].map((item) => (
                  <div key={item.title} className="bg-charcoal border border-white/10 p-6 rounded-sm hover:border-gold/30 transition-colors">
                    <div className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center text-gold mb-4">
                      {item.icon}
                    </div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
                <Users className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-sm font-medium">SME-First</span>
              </div>
              <h2 className="font-serif text-4xl font-bold text-white mb-6">
                SME-First Infrastructure
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Traditional IP registration is expensive, slow, and inaccessible to small and medium enterprises. IPGT democratizes IP protection by bringing enterprise-grade security to every creator and innovator.
              </p>
              <p className="text-white/60 leading-relaxed">
                With a straightforward registration flow and no complex barriers, protecting your intellectual property has never been more accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Cryptographic Auditing */}
      <section className="py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
              <Database className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold text-sm font-medium">Open Auditing</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Open Cryptographic Auditing
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Every IP registration is publicly verifiable. Anyone can independently confirm the existence, ownership, and timestamp of any registered IP record.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="w-5 h-5" />,
                title: 'Immutable Records',
                desc: 'Once written to the blockchain, IP records cannot be altered or deleted.',
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: 'Public Verification',
                desc: 'Any party can verify the authenticity of an IP record using the public canister interface.',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Cryptographic Proof',
                desc: 'SHA-256 document hashes provide tamper-evident proof of the original file contents.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-charcoal border border-white/10 p-8 rounded-sm hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center text-gold mb-6">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-charcoal border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Protect Your IP Today
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Join the decentralized IP registry. Register your intellectual property on-chain and receive immutable proof of ownership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-10 py-4 rounded-sm hover:bg-gold/90 transition-colors text-lg"
            >
              Register Now <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/whitepaper"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-10 py-4 rounded-sm hover:border-gold hover:text-gold transition-colors text-lg"
            >
              Read Whitepaper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
