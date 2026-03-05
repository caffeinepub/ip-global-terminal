import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  FileCheck,
  Globe,
  Lock,
  PenLine,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import type React from "react";

const panelStyle: React.CSSProperties = {
  backgroundColor: "rgba(0, 0, 0, 0.40)",
  border: "1.5px solid oklch(0.78 0.15 85 / 0.30)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 0 20px oklch(0.78 0.15 85 / 0.15)",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "90vh" }}
      >
        {/* 4K AI-generated hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/homepage-hero.dim_3840x2160.png"
            alt="IPGT Hero Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-32 min-h-[90vh]">
          <div className="inline-flex items-center gap-2 bg-gold-900/30 border border-gold-700/40 rounded-full px-4 py-1.5 mb-6 text-gold-300 text-sm font-medium">
            <Shield className="w-4 h-4" />
            Blockchain-Secured Intellectual Property Registry
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
            Protect Your{" "}
            <span className="text-gold-400">Intellectual Property</span>{" "}
            Globally
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
            Register, verify, and protect your patents, trademarks, and
            copyrights on an immutable blockchain ledger. Instant global
            recognition with cryptographic proof of ownership.
          </p>

          {/* CTA Panels — Register IP above Search Database, matching gold glass panel style */}
          <div className="w-full max-w-md flex flex-col gap-3 mb-12">
            {/* Register IP Panel */}
            <Link
              to="/register"
              className="group flex items-center justify-between rounded-xl px-6 py-4 transition-all duration-200"
              style={{
                ...panelStyle,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1.5px solid oklch(0.78 0.15 85 / 0.65)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 28px oklch(0.78 0.15 85 / 0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1.5px solid oklch(0.78 0.15 85 / 0.30)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 20px oklch(0.78 0.15 85 / 0.15)";
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{
                    backgroundColor: "oklch(0.78 0.15 85 / 0.15)",
                    border: "1px solid oklch(0.78 0.15 85 / 0.35)",
                  }}
                >
                  <PenLine
                    className="w-4 h-4"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  />
                </div>
                <div className="text-left">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  >
                    Register IP
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Secure your IP on-chain
                  </p>
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                style={{ color: "oklch(0.78 0.15 85)" }}
              />
            </Link>

            {/* Search Database Panel */}
            <Link
              to="/database"
              className="group flex items-center justify-between rounded-xl px-6 py-4 transition-all duration-200"
              style={{
                ...panelStyle,
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1.5px solid oklch(0.78 0.15 85 / 0.65)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 28px oklch(0.78 0.15 85 / 0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.border =
                  "1.5px solid oklch(0.78 0.15 85 / 0.30)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 20px oklch(0.78 0.15 85 / 0.15)";
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{
                    backgroundColor: "oklch(0.78 0.15 85 / 0.15)",
                    border: "1px solid oklch(0.78 0.15 85 / 0.35)",
                  }}
                >
                  <Search
                    className="w-4 h-4"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  />
                </div>
                <div className="text-left">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  >
                    Search Database
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Browse global IP records
                  </p>
                </div>
              </div>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                style={{ color: "oklch(0.78 0.15 85)" }}
              />
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16 text-center">
            {[
              { value: "100%", label: "On-Chain" },
              { value: "SHA-256", label: "Cryptographic Proof" },
              { value: "Global", label: "Recognition" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-gold-400">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-black border-t border-gold-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-gold-400">IPGT</span>?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              The most secure and transparent intellectual property registry,
              powered by Internet Computer blockchain technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: "Immutable Records",
                desc: "Once registered, your IP record is permanently stored on-chain. No alterations, no deletions — your proof of ownership is forever.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Your registration is instantly accessible worldwide. Establish international priority and protect your innovations across all jurisdictions.",
              },
              {
                icon: FileCheck,
                title: "Cryptographic Proof",
                desc: "Every document is hashed with SHA-256 and anchored to the blockchain, providing irrefutable cryptographic evidence of your IP.",
              },
              {
                icon: Zap,
                title: "Instant Registration",
                desc: "Register your intellectual property in minutes, not months. No bureaucratic delays — your IP is protected the moment you submit.",
              },
              {
                icon: Search,
                title: "Searchable Database",
                desc: "Browse and search the global IP registry to verify ownership, check for conflicts, and discover existing registrations.",
              },
              {
                icon: Shield,
                title: "Decentralized Security",
                desc: "Built on the Internet Computer Protocol — no single point of failure, no central authority, no censorship.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-black border border-gold-900/30 hover:border-gold-600/50 p-6 rounded-sm transition-colors group"
              >
                <feature.icon className="w-8 h-8 text-gold-400 mb-4 group-hover:text-gold-300 transition-colors" />
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-black/80 border-t border-gold-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              How It <span className="text-gold-400">Works</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Three simple steps to secure your intellectual property on the
              blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Document",
                desc: "Upload your IP document. Our system generates a unique SHA-256 cryptographic hash that uniquely identifies your work.",
              },
              {
                step: "02",
                title: "Register On-Chain",
                desc: "Submit your registration with title, description, category, and jurisdiction. The record is permanently anchored to the blockchain.",
              },
              {
                step: "03",
                title: "Receive Proof",
                desc: "Get your unique IP ID and on-chain confirmation. Use this as irrefutable proof of your registration date and ownership.",
              },
            ].map((step) => (
              <div key={step.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-gold-600/50 text-gold-400 font-serif text-xl font-bold mb-5">
                  {step.step}
                </div>
                <h3 className="font-serif text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IP Categories */}
      <section className="py-24 px-4 bg-black border-t border-gold-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Supported IP <span className="text-gold-400">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Patents",
                desc: "Protect your inventions, processes, and technical innovations with blockchain-anchored patent registrations.",
                items: [
                  "Utility Patents",
                  "Design Patents",
                  "Process Patents",
                  "Software Patents",
                ],
              },
              {
                title: "Trademarks",
                desc: "Secure your brand identity, logos, and distinctive marks with immutable on-chain trademark records.",
                items: [
                  "Word Marks",
                  "Logo Marks",
                  "Service Marks",
                  "Trade Dress",
                ],
              },
              {
                title: "Copyrights",
                desc: "Register your creative works and establish clear ownership with cryptographic proof of authorship.",
                items: [
                  "Literary Works",
                  "Musical Works",
                  "Artistic Works",
                  "Software Code",
                ],
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className="bg-black border border-gold-900/30 hover:border-gold-600/40 p-7 rounded-sm transition-colors"
              >
                <h3 className="font-serif text-xl font-bold text-gold-400 mb-3">
                  {cat.title}
                </h3>
                <p className="text-white/55 text-sm mb-5 leading-relaxed">
                  {cat.desc}
                </p>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/70"
                    >
                      <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-black border-t border-gold-900/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-5">
            Ready to Protect Your{" "}
            <span className="text-gold-400">Innovation</span>?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join the global IP registry and secure your intellectual property on
            the blockchain today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-semibold px-10 py-4 rounded-sm transition-colors text-base"
          >
            Start Registration
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
