import { useState, useEffect, useRef } from 'react';
import { Printer, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'executive-summary', title: '1. Executive Summary' },
  { id: 'the-problem', title: '2. The Problem' },
  { id: 'the-solution', title: '3. The Solution' },
  { id: 'technology-architecture', title: '4. Technology Architecture' },
  { id: 'encryption-hashing', title: '5. Encryption & Hashing' },
  { id: 'duplicate-ip-protection', title: '6. Duplicate IP Protection' },
  { id: 'global-ip-ecosystem', title: '7. Global IP Ecosystem Interoperability' },
  { id: 'automated-filing', title: '8. Automated Filing Strategy' },
  { id: 'sme-infrastructure', title: '9. SME-First Infrastructure' },
  { id: 'cryptographic-auditing', title: '10. Open Cryptographic Auditing' },
  { id: 'roadmap', title: '11. Roadmap' },
  { id: 'legal-disclaimer', title: '12. Legal Disclaimer' },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Header Banner */}
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/ipgt-hero-banner.dim_1400x500.png')" }}
      >
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2">
            IPGT Whitepaper
          </h1>
          <p className="text-white/60 text-lg">Technical & Strategic Overview</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        {/* Sticky TOC Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/40 text-xs uppercase tracking-widest font-semibold">Contents</h3>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-white/40 hover:text-gold transition-colors text-xs"
                title="Print / Save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-gold/10 text-gold border-l-2 border-gold'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 prose-content">
          {/* 1. Executive Summary */}
          <section id="executive-summary" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">01</span>
              Executive Summary
            </h2>
            <p>
              IP Global Terminal (IPGT) is a decentralized intellectual property registration and management platform built on the Internet Computer Protocol (ICP). IPGT provides creators, inventors, and enterprises with a trustless, immutable, and globally accessible system for establishing verifiable proof of IP ownership.
            </p>
            <p>
              By leveraging blockchain technology, IPGT eliminates the opacity, cost, and geographic limitations of traditional IP registration systems. Every registration is cryptographically secured, timestamped at the block level, and permanently stored on-chain — creating an auditable, tamper-proof record accessible to anyone.
            </p>
            <p>
              The platform introduces the IPGT utility token, which is burned upon each IP registration, creating a deflationary mechanism that aligns platform usage with token value. This whitepaper outlines the technical architecture, cryptographic methods, filing strategy, and long-term roadmap for the IPGT platform.
            </p>
          </section>

          {/* 2. The Problem */}
          <section id="the-problem" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">02</span>
              The Problem
            </h2>
            <p>
              Intellectual property protection is a cornerstone of the modern innovation economy. Yet the systems designed to protect IP remain largely unchanged from the 20th century — centralized, expensive, slow, and inaccessible to the majority of creators and small businesses worldwide.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Centralization Risk</h3>
            <p>
              Traditional IP registries are operated by national or regional authorities. This centralization creates single points of failure: records can be lost, corrupted, or manipulated. Disputes over ownership often devolve into costly legal battles with no neutral, verifiable source of truth.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Cost and Accessibility Barriers</h3>
            <p>
              Filing a patent through conventional channels can cost thousands of dollars in legal fees alone, before accounting for government filing fees, translation costs, and ongoing maintenance. Trademarks and copyrights, while cheaper, still require navigating complex bureaucratic processes that disadvantage individual creators and SMEs.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Lack of Transparency</h3>
            <p>
              Existing IP databases are fragmented across jurisdictions, often behind paywalls, and rarely interoperable. There is no universal, open standard for verifying IP ownership across borders — creating friction for international commerce and enforcement.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Duplicate and Fraudulent Registrations</h3>
            <p>
              Without a unified, cryptographically verifiable registry, duplicate registrations and fraudulent IP claims are difficult to detect and prevent. The burden of proof falls on the legitimate creator, who must often engage in expensive litigation to defend their rights.
            </p>
          </section>

          {/* 3. The Solution */}
          <section id="the-solution" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">03</span>
              The Solution
            </h2>
            <p>
              IPGT addresses these systemic failures by providing a blockchain-native IP registry that is open, immutable, and globally accessible. The platform is built on the Internet Computer Protocol, a next-generation blockchain that offers web-speed performance, on-chain storage, and a fully decentralized execution environment.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Immutable On-Chain Records</h3>
            <p>
              Every IP registration on IPGT is stored directly on the ICP blockchain. Records cannot be altered, deleted, or censored by any single party — including the platform operators. This creates a permanent, neutral source of truth for IP ownership.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Cryptographic Proof of Ownership</h3>
            <p>
              Each registration includes a SHA-256 hash of the original document, a block-level timestamp, and the registrant's cryptographic identity (principal). Together, these elements constitute a verifiable proof of ownership that can be independently validated by any party without relying on a trusted intermediary.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Open and Accessible</h3>
            <p>
              IPGT is designed to be accessible to individuals, startups, and enterprises alike. The registration process is streamlined, the cost is minimal (a small token burn), and the resulting records are publicly queryable without authentication.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Deflationary Token Mechanism</h3>
            <p>
              The IPGT utility token is burned upon each IP registration. This deflationary mechanism ensures that platform growth directly reduces token supply, creating a sustainable economic model aligned with long-term platform utility.
            </p>
          </section>

          {/* 4. Technology Architecture */}
          <section id="technology-architecture" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">04</span>
              Technology Architecture
            </h2>
            <p>
              IPGT is built as a canister smart contract on the Internet Computer Protocol. The ICP blockchain provides several unique capabilities that make it an ideal foundation for a decentralized IP registry.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Internet Computer Protocol</h3>
            <p>
              The Internet Computer is a blockchain network that runs at web speed and can host full-stack decentralized applications entirely on-chain. Unlike Ethereum or other EVM-compatible chains, ICP canisters can store large amounts of data directly on the blockchain, serve HTTP requests, and execute complex logic without relying on off-chain infrastructure.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Canister Architecture</h3>
            <p>
              The IPGT backend is implemented as a single Motoko canister that manages the IP record registry, the IPGT token ledger, and user profiles. The canister exposes both query methods (read-only, fast) and update methods (state-changing, finalized on-chain) through a Candid interface.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Data Model</h3>
            <p>
              Each IP record contains: a unique numeric ID, the registrant's principal, a SHA-256 document hash, a block-level timestamp, a jurisdiction field, a category (patent, trademark, or copyright), a title and description, and an optional reference to a stored document blob. Records are stored in a stable hash map keyed by ID.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Frontend Architecture</h3>
            <p>
              The IPGT frontend is a React/TypeScript application that communicates with the backend canister via the ICP agent library. The frontend is served from a dedicated asset canister, ensuring the entire application stack is hosted on-chain. State management uses React Query for server state and React hooks for local UI state.
            </p>
          </section>

          {/* 5. Encryption & Hashing */}
          <section id="encryption-hashing" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">05</span>
              Encryption & Hashing
            </h2>
            <p>
              Cryptographic integrity is central to the IPGT value proposition. The platform uses industry-standard hashing algorithms to create tamper-evident fingerprints of registered IP documents.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">SHA-256 Document Fingerprinting</h3>
            <p>
              When a user registers an IP document, the IPGT frontend computes a SHA-256 hash of the file contents in the browser before submission. This hash serves as a unique, fixed-length fingerprint of the document. Any modification to the original file — even a single bit — produces a completely different hash, making tampering immediately detectable.
            </p>
            <p>
              The SHA-256 hash is stored on-chain as part of the IP record. To verify ownership of a document, a claimant need only produce the original file; the hash can be recomputed and compared against the on-chain record in seconds.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Principal-Based Identity</h3>
            <p>
              IPGT uses the Internet Computer's native identity system. Each user is identified by a cryptographic principal derived from their Internet Identity. This principal is recorded as the owner of each IP registration, providing a cryptographically verifiable link between the registrant and their IP assets.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Block-Level Timestamps</h3>
            <p>
              Registration timestamps are recorded at the block level using the ICP system time. This provides a precise, immutable record of when each IP was registered — establishing clear priority in cases of competing claims.
            </p>
          </section>

          {/* 6. Duplicate IP Protection */}
          <section id="duplicate-ip-protection" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">06</span>
              Duplicate IP Protection
            </h2>
            <p>
              One of the most significant challenges in IP management is preventing duplicate registrations. IPGT addresses this through a combination of cryptographic hashing and on-chain record querying.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Hash-Based Deduplication</h3>
            <p>
              Because each IP document is represented by its SHA-256 hash, identical documents will always produce the same hash. The IPGT platform can detect potential duplicates by comparing incoming document hashes against the existing registry before finalizing a registration.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Priority by Timestamp</h3>
            <p>
              In cases where similar or identical IP is registered by multiple parties, the block-level timestamp provides an objective, immutable record of priority. The first registration on-chain establishes the earliest verifiable claim, regardless of subsequent disputes.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Public Queryability</h3>
            <p>
              The IPGT registry is publicly queryable without authentication. Any party can search the database by title, category, jurisdiction, or owner to identify existing registrations before submitting a new one. This transparency reduces the risk of inadvertent duplicate filings and supports due diligence processes.
            </p>
          </section>

          {/* 7. Global IP Ecosystem Interoperability */}
          <section id="global-ip-ecosystem" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">07</span>
              Global IP Ecosystem Interoperability
            </h2>
            <p>
              IPGT is designed as an open, interoperable layer within the broader global IP ecosystem. Rather than replacing existing legal frameworks, IPGT provides a neutral, cryptographically verifiable foundation that can complement and enhance existing IP management workflows.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Blockchain as Infrastructure</h3>
            <p>
              The IPGT registry functions as a neutral infrastructure layer — a shared, immutable ledger of IP registrations that any party can read, verify, and build upon. This open architecture enables integration with legal workflows, licensing platforms, and IP management tools without requiring changes to existing systems.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Jurisdiction-Aware Records</h3>
            <p>
              Each IP record includes a jurisdiction field, enabling registrants to specify the legal context of their IP. This structured metadata supports filtering, reporting, and integration with jurisdiction-specific workflows, while keeping the underlying registry neutral and globally accessible.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Open API and Candid Interface</h3>
            <p>
              The IPGT canister exposes a fully documented Candid interface that any developer or organization can query programmatically. This open API enables third-party tools, legal platforms, and enterprise systems to integrate IPGT data into their own workflows without intermediaries.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Interoperability Roadmap</h3>
            <p>
              Future development will focus on expanding interoperability through standardized data formats, cross-chain bridges, and API integrations with established IP management platforms. The goal is to position IPGT as a foundational layer that enhances the global IP ecosystem rather than operating in isolation.
            </p>
          </section>

          {/* 8. Automated Filing Strategy */}
          <section id="automated-filing" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">08</span>
              Automated Filing Strategy
            </h2>
            <p>
              IPGT's automated filing engine is designed to minimize friction in the IP registration process while maximizing the integrity and completeness of each submission.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Client-Side Hashing</h3>
            <p>
              Document hashing is performed entirely in the browser using the Web Crypto API. This means the original document never leaves the user's device — only the cryptographic hash is transmitted to the blockchain. This design preserves document confidentiality while still enabling on-chain verification.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Structured Metadata Capture</h3>
            <p>
              The registration form captures structured metadata including title, description, category (patent, trademark, or copyright), and jurisdiction. This structured approach ensures that every registration is consistently formatted and queryable, supporting downstream search and filtering operations.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Token Burn Integration</h3>
            <p>
              The registration process is atomically linked to the IPGT token burn mechanism. A fixed amount of IPGT tokens is burned from the registrant's balance as part of the registration transaction. This atomic coupling ensures that every on-chain IP record corresponds to a verifiable economic commitment by the registrant.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Instant Confirmation</h3>
            <p>
              Upon successful registration, the platform immediately returns the new IP record ID and confirms the token burn amount. The registration is finalized on-chain within seconds, providing near-instant proof of ownership without the delays associated with traditional filing systems.
            </p>
          </section>

          {/* 9. SME-First Infrastructure */}
          <section id="sme-infrastructure" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">09</span>
              SME-First Infrastructure
            </h2>
            <p>
              Small and medium enterprises (SMEs) and individual creators represent the majority of IP creators worldwide, yet they are systematically underserved by existing IP protection systems. IPGT is designed from the ground up to serve this underserved majority.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Minimal Cost</h3>
            <p>
              The cost of registering IP on IPGT is a small, fixed token burn — a fraction of the cost of traditional IP filing. This makes IP protection economically accessible to individual creators, startups, and small businesses that cannot afford conventional legal processes.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">No Legal Expertise Required</h3>
            <p>
              The IPGT registration process is designed to be completed without legal expertise. The structured form guides users through the required metadata, and the cryptographic proof of registration is generated automatically. Users receive a verifiable IP record without needing to engage lawyers or navigate complex bureaucratic procedures.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Global Accessibility</h3>
            <p>
              IPGT is accessible from anywhere in the world with an internet connection. There are no geographic restrictions, no local office requirements, and no language barriers in the core registration process. This global accessibility is particularly valuable for creators in regions where traditional IP protection is prohibitively expensive or administratively complex.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Transparent Pricing</h3>
            <p>
              The cost of registration is fixed and transparent — a defined number of IPGT tokens burned per registration. There are no hidden fees, no renewal costs, and no ongoing maintenance charges. Once registered, an IP record is permanently on-chain at no additional cost.
            </p>
          </section>

          {/* 10. Open Cryptographic Auditing */}
          <section id="cryptographic-auditing" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">10</span>
              Open Cryptographic Auditing
            </h2>
            <p>
              Transparency and auditability are foundational principles of the IPGT platform. Every aspect of the registry is designed to be independently verifiable by any party without requiring trust in the platform operators.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Public Registry</h3>
            <p>
              The IPGT registry is fully public. Any party can query the canister directly to retrieve IP records, verify document hashes, and confirm registration timestamps. This public accessibility ensures that the registry cannot be used to obscure or manipulate IP ownership records.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">On-Chain Verification</h3>
            <p>
              Because all records are stored on the ICP blockchain, verification does not require trusting the IPGT platform or its operators. Any party can independently verify a registration by querying the canister directly using the ICP agent library or the Candid UI.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Audit Trail</h3>
            <p>
              The immutable nature of blockchain storage means that every registration creates a permanent audit trail. The complete history of IP registrations — including timestamps, owners, and document hashes — is preserved on-chain indefinitely and cannot be altered or deleted.
            </p>
            <h3 className="font-serif text-xl font-bold text-white mt-8 mb-4">Token Burn Transparency</h3>
            <p>
              The total number of IPGT tokens burned is publicly queryable via the <code>getTotalBurnedTokens</code> canister method. This transparency allows any party to independently verify the deflationary mechanics of the token and the total volume of IP registrations on the platform.
            </p>
          </section>

          {/* 11. Roadmap */}
          <section id="roadmap" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">11</span>
              Roadmap
            </h2>
            <p>
              The IPGT platform is being developed in phases, with each phase building on the foundation established by the previous one.
            </p>
            <div className="space-y-6 mt-8">
              {[
                {
                  phase: 'Phase 1',
                  title: 'Core Registry',
                  status: 'Complete',
                  items: [
                    'On-chain IP registration with SHA-256 hashing',
                    'IPGT token ledger with burn mechanism',
                    'Public IP database with search and filtering',
                    'Internet Identity authentication',
                  ],
                },
                {
                  phase: 'Phase 2',
                  title: 'Enhanced Discovery',
                  status: 'In Progress',
                  items: [
                    'Advanced search and filtering capabilities',
                    'IP record analytics and reporting',
                    'Bulk registration support',
                    'Enhanced duplicate detection',
                  ],
                },
                {
                  phase: 'Phase 3',
                  title: 'Ecosystem Integration',
                  status: 'Planned',
                  items: [
                    'Open API for third-party integrations',
                    'Standardized data export formats',
                    'Cross-chain interoperability bridges',
                    'Enterprise licensing and management tools',
                  ],
                },
                {
                  phase: 'Phase 4',
                  title: 'Global Scale',
                  status: 'Planned',
                  items: [
                    'Multi-language support',
                    'Regional jurisdiction templates',
                    'Decentralized governance framework',
                    'Community-driven feature development',
                  ],
                },
              ].map((phase) => (
                <div key={phase.phase} className="bg-charcoal border border-white/10 p-6 rounded-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold font-semibold text-sm">{phase.phase}</span>
                    <ChevronRight className="w-3 h-3 text-white/30" />
                    <span className="text-white font-semibold">{phase.title}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${
                      phase.status === 'Complete'
                        ? 'border-green-500/30 text-green-400 bg-green-500/10'
                        : phase.status === 'In Progress'
                        ? 'border-gold/30 text-gold bg-gold/10'
                        : 'border-white/20 text-white/40 bg-white/5'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/60 text-sm">
                        <span className="w-1 h-1 rounded-full bg-gold mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 12. Legal Disclaimer */}
          <section id="legal-disclaimer" className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-gold text-xl">12</span>
              Legal Disclaimer
            </h2>
            <div className="bg-charcoal border border-white/10 p-8 rounded-sm">
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                This whitepaper is provided for informational purposes only and does not constitute legal advice. The IPGT platform provides a blockchain-based record of IP registrations but does not replace or supersede the legal IP registration processes of any jurisdiction.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Registration on the IPGT platform does not confer legal IP rights in any jurisdiction. Users seeking legal protection for their intellectual property should consult qualified legal counsel and pursue registration through the appropriate legal channels in their jurisdiction.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                The IPGT token is a utility token used solely for the purpose of paying registration fees on the IPGT platform. It is not a security, investment instrument, or currency. The IPGT team makes no representations regarding the future value of the IPGT token.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                The information contained in this whitepaper is subject to change without notice. The IPGT team reserves the right to modify the platform, tokenomics, and roadmap at any time. This document should not be relied upon as a binding commitment by the IPGT team.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
