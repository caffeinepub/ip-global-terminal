import React, { useState, useEffect, useRef } from 'react';
import { Printer, ChevronRight, BookOpen } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'abstract',
    title: '1. Abstract',
    content: (
      <div className="prose-content">
        <p>
          IP Global Terminal (IPGT) is a decentralised intellectual property registration platform built on the Internet Computer Protocol (ICP). It provides a sovereign, censorship-resistant, and WIPO-independent mechanism for creators, inventors, and organisations to register patents, trademarks, and copyrights on a public blockchain.
        </p>
        <p>
          By leveraging the Internet Computer's on-chain storage and smart contract capabilities, IPGT eliminates the need for centralised intermediaries, reduces registration costs, and provides cryptographic proof of IP ownership that is globally accessible and immutable.
        </p>
      </div>
    ),
  },
  {
    id: 'introduction',
    title: '2. Introduction',
    content: (
      <div className="prose-content">
        <p>
          The global intellectual property system has long been dominated by centralised bodies such as the World Intellectual Property Organization (WIPO) and national patent offices. While these institutions have served an important role, they introduce significant friction: high costs, geographic limitations, bureaucratic delays, and single points of failure.
        </p>
        <p>
          Blockchain technology offers a compelling alternative. By recording IP registrations on a distributed ledger, we can achieve:
        </p>
        <ul>
          <li>Immutable proof of creation and ownership</li>
          <li>Timestamped registration without intermediaries</li>
          <li>Global accessibility without jurisdictional barriers</li>
          <li>Cryptographic verification of document integrity</li>
        </ul>
        <p>
          IPGT is built on the Internet Computer, a blockchain that offers web-speed smart contracts, on-chain storage, and the ability to serve web content directly — making it uniquely suited for a production-grade IP registry.
        </p>
      </div>
    ),
  },
  {
    id: 'problem',
    title: '3. Problem Statement',
    content: (
      <div className="prose-content">
        <h3>3.1 Centralisation Risk</h3>
        <p>
          Traditional IP registries are centralised databases controlled by governments and intergovernmental organisations. This creates risks of censorship, data loss, political interference, and unequal access for creators in developing nations.
        </p>
        <h3>3.2 Cost Barriers</h3>
        <p>
          Filing a patent through WIPO's PCT system can cost tens of thousands of dollars when attorney fees, filing fees, and translation costs are included. This effectively excludes independent inventors and small businesses from meaningful IP protection.
        </p>
        <h3>3.3 Lack of Transparency</h3>
        <p>
          Existing IP databases are often fragmented, difficult to search, and not publicly accessible in machine-readable formats. This makes it hard to verify ownership, detect infringement, or build on existing knowledge.
        </p>
        <h3>3.4 No Cryptographic Proof</h3>
        <p>
          Traditional registration provides a paper trail but no cryptographic proof. There is no way to verify that a document submitted to a registry has not been altered after the fact.
        </p>
      </div>
    ),
  },
  {
    id: 'solution',
    title: '4. Solution Architecture',
    content: (
      <div className="prose-content">
        <h3>4.1 Internet Computer as Foundation</h3>
        <p>
          IPGT is deployed as a canister smart contract on the Internet Computer Protocol. The ICP provides:
        </p>
        <ul>
          <li><strong>On-chain storage:</strong> IP records are stored directly in canister memory, not on external databases</li>
          <li><strong>Web-speed queries:</strong> Query calls return in milliseconds, enabling a responsive user experience</li>
          <li><strong>Tamper-proof state:</strong> All state changes are finalized through consensus and cannot be altered</li>
          <li><strong>Reverse gas model:</strong> Users do not need ICP tokens to interact with the platform</li>
        </ul>
        <h3>4.2 SHA-256 Document Hashing</h3>
        <p>
          Before registration, documents are hashed client-side using SHA-256. The hash — not the document itself — is stored on-chain. This provides:
        </p>
        <ul>
          <li>Proof that a specific document existed at registration time</li>
          <li>Privacy: the document content is never exposed</li>
          <li>Efficiency: only 32 bytes stored per document reference</li>
        </ul>
        <h3>4.3 Data Model</h3>
        <p>
          Each IP record contains: title, description, category (patent/trademark/copyright), owner principal, registration timestamp, document hash, jurisdiction, and a SHA-256 hex string for human-readable verification.
        </p>
      </div>
    ),
  },
  {
    id: 'registration',
    title: '5. Registration Process',
    content: (
      <div className="prose-content">
        <h3>5.1 Submission Flow</h3>
        <p>The registration process is designed to be simple and accessible:</p>
        <ol>
          <li>The user provides a title, description, category, and jurisdiction</li>
          <li>Optionally, the user uploads a document which is hashed client-side</li>
          <li>The registration is submitted as an update call to the ICP canister</li>
          <li>The canister assigns a unique ID and stores the record immutably</li>
          <li>The user receives a confirmation with the on-chain record ID</li>
        </ol>
        <h3>5.2 Anonymous Registration</h3>
        <p>
          IPGT supports anonymous registration — no account creation or KYC is required. The owner field records the caller's principal, which for anonymous users is the anonymous principal. This enables maximum accessibility while preserving the on-chain record.
        </p>
        <h3>5.3 Immutability Guarantee</h3>
        <p>
          Once registered, an IP record cannot be modified or deleted. The Internet Computer's consensus mechanism ensures that all registered records are permanent and tamper-proof.
        </p>
      </div>
    ),
  },
  {
    id: 'verification',
    title: '6. Verification & Search',
    content: (
      <div className="prose-content">
        <h3>6.1 Public Query Interface</h3>
        <p>
          All IP records are publicly queryable without authentication. The platform provides:
        </p>
        <ul>
          <li>Full-text search by title</li>
          <li>Hash-based lookup for document verification</li>
          <li>Category and jurisdiction filtering</li>
          <li>Paginated browsing of all records</li>
        </ul>
        <h3>6.2 Document Verification</h3>
        <p>
          To verify that a document matches a registered hash, a user can:
        </p>
        <ol>
          <li>Locate the IP record by title or ID</li>
          <li>Hash their copy of the document using SHA-256</li>
          <li>Compare the resulting hash with the stored SHA-256 field</li>
        </ol>
        <p>
          A match provides cryptographic proof that the document is identical to the one registered at the recorded timestamp.
        </p>
        <h3>6.3 Timestamp Proof</h3>
        <p>
          The <code>registrationDate</code> field stores the ICP system time in nanoseconds at the moment of registration. This provides a blockchain-anchored timestamp that can be used as evidence of prior art.
        </p>
      </div>
    ),
  },
  {
    id: 'interoperability',
    title: '7. Global IP Ecosystem Interoperability',
    content: (
      <div className="prose-content">
        <h3>7.1 Blockchain as Infrastructure</h3>
        <p>
          IPGT treats blockchain as neutral infrastructure for IP registration — analogous to how the internet provides neutral infrastructure for communication. The platform is designed to interoperate with existing legal frameworks without depending on any single jurisdiction or governing body.
        </p>
        <h3>7.2 Cross-Chain Anchoring (Roadmap)</h3>
        <p>
          Future versions of IPGT will support cross-chain anchoring, allowing IP registrations to be mirrored on Ethereum and Solana. This provides additional redundancy and enables IP holders to leverage the liquidity and tooling of multiple blockchain ecosystems.
        </p>
        <h3>7.3 Legal Recognition</h3>
        <p>
          While blockchain registration does not automatically confer legal rights in all jurisdictions, it provides strong evidence of prior art and creation date. Several jurisdictions are beginning to recognise blockchain timestamps as legally admissible evidence.
        </p>
        <h3>7.4 Open Standards</h3>
        <p>
          IPGT's data model is designed to be compatible with emerging open standards for digital IP registration, including W3C Verifiable Credentials and the emerging ISO/TC 307 blockchain standards for IP management.
        </p>
      </div>
    ),
  },
  {
    id: 'governance',
    title: '8. Governance',
    content: (
      <div className="prose-content">
        <p>
          IPGT is governed by its canister smart contract code, which is publicly auditable on the Internet Computer. The platform operates without a central authority — registrations are processed automatically by the canister logic.
        </p>
        <p>
          Future governance improvements may include:
        </p>
        <ul>
          <li>On-chain voting for protocol upgrades</li>
          <li>Community-driven dispute resolution mechanisms</li>
          <li>Decentralised autonomous organisation (DAO) structure for platform governance</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'security',
    title: '9. Security Model',
    content: (
      <div className="prose-content">
        <h3>9.1 Canister Security</h3>
        <p>
          The IPGT canister is deployed on the Internet Computer, which provides Byzantine fault-tolerant consensus. The canister code is immutable once deployed (unless upgraded by the controller), and all state transitions are publicly verifiable.
        </p>
        <h3>9.2 Client-Side Hashing</h3>
        <p>
          Document hashing is performed client-side using the Web Crypto API's SHA-256 implementation. This ensures that document contents never leave the user's browser, providing strong privacy guarantees.
        </p>
        <h3>9.3 Principal-Based Ownership</h3>
        <p>
          Each IP record is associated with the caller's ICP principal at registration time. While the platform supports anonymous registration, users who authenticate with Internet Identity receive a stable, cryptographically-secured principal that provides stronger ownership proof.
        </p>
      </div>
    ),
  },
  {
    id: 'roadmap',
    title: '10. Roadmap',
    content: (
      <div className="prose-content">
        <h3>Phase 1 — Foundation (Current)</h3>
        <ul>
          <li>Core IP registration and query functionality</li>
          <li>SHA-256 document hashing</li>
          <li>Public IP database with search and filtering</li>
          <li>Anonymous and authenticated registration</li>
        </ul>
        <h3>Phase 2 — Enhanced Verification</h3>
        <ul>
          <li>Internet Identity integration for persistent ownership</li>
          <li>Document upload and storage via ICP blob storage</li>
          <li>Enhanced search with full-text indexing</li>
          <li>API access for third-party integrations</li>
        </ul>
        <h3>Phase 3 — Cross-Chain & Legal</h3>
        <ul>
          <li>Cross-chain anchoring to Ethereum and Solana</li>
          <li>Legal jurisdiction mapping and compliance tools</li>
          <li>Verifiable Credential export for legal proceedings</li>
          <li>DAO governance implementation</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'conclusion',
    title: '11. Conclusion',
    content: (
      <div className="prose-content">
        <p>
          IP Global Terminal represents a fundamental shift in how intellectual property is registered and verified. By building on the Internet Computer Protocol, IPGT delivers a platform that is sovereign, censorship-resistant, and accessible to creators worldwide — without the cost and complexity of traditional IP systems.
        </p>
        <p>
          The combination of blockchain immutability, cryptographic document hashing, and open public access creates a new standard for IP registration that is more transparent, more equitable, and more resilient than any centralised alternative.
        </p>
        <p>
          We invite developers, creators, and legal professionals to engage with the platform, contribute to its development, and help shape the future of decentralised intellectual property.
        </p>
      </div>
    ),
  },
  {
    id: 'technical',
    title: '12. Technical Appendix',
    content: (
      <div className="prose-content">
        <h3>Smart Contract Interface</h3>
        <p>The IPGT canister exposes the following public methods:</p>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>registerIP</code></td><td>Update</td><td>Register a new IP record</td></tr>
            <tr><td><code>getIP</code></td><td>Query</td><td>Retrieve a record by ID</td></tr>
            <tr><td><code>getAllIPs</code></td><td>Query</td><td>Paginated list of all records</td></tr>
            <tr><td><code>searchByTitle</code></td><td>Query</td><td>Search by title keyword</td></tr>
            <tr><td><code>searchByTitleOrHash</code></td><td>Query</td><td>Search by title or SHA-256 hash</td></tr>
            <tr><td><code>filterByCategory</code></td><td>Query</td><td>Filter by IP category</td></tr>
            <tr><td><code>filterByJurisdiction</code></td><td>Query</td><td>Filter by jurisdiction</td></tr>
          </tbody>
        </table>
        <h3>Data Types</h3>
        <p>
          <strong>IPCategory:</strong> <code>#patent | #trademark | #copyright</code>
        </p>
        <p>
          <strong>IPRecord:</strong> id (Nat), title (Text), description (Text), category (IPCategory), owner (Principal), registrationDate (Int), documentHash (Blob), jurisdiction (Text), hash (Text)
        </p>
      </div>
    ),
  },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'oklch(0.08 0 0)' }}>
      {/* Page header */}
      <div
        className="border-b py-10 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: 'oklch(0.10 0 0)',
          borderColor: 'oklch(0.78 0.15 85 / 0.2)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5" style={{ color: 'oklch(0.78 0.15 85)' }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'oklch(0.78 0.15 85)' }}>
                Whitepaper
              </span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: 'oklch(0.97 0 0)', fontFamily: 'Playfair Display, serif' }}
            >
              IP Global Terminal
            </h1>
            <p className="text-sm" style={{ color: 'oklch(0.55 0 0)' }}>
              Decentralised Intellectual Property Registration on the Internet Computer Protocol
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
            style={{
              backgroundColor: 'oklch(0.78 0.15 85 / 0.12)',
              border: '1px solid oklch(0.78 0.15 85 / 0.35)',
              color: 'oklch(0.78 0.15 85)',
            }}
          >
            <Printer className="w-4 h-4" />
            Print PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-10">
          {/* Sticky sidebar TOC */}
          <aside className="no-print hidden lg:block w-64 shrink-0">
            <div
              className="sticky top-24 rounded-xl p-4"
              style={{
                backgroundColor: 'oklch(0.11 0 0)',
                border: '1px solid oklch(0.22 0.02 85 / 0.4)',
              }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: 'oklch(0.78 0.15 85)' }}>
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 flex items-center gap-2"
                    style={{
                      backgroundColor: activeSection === section.id ? 'oklch(0.78 0.15 85 / 0.12)' : 'transparent',
                      color: activeSection === section.id ? 'oklch(0.78 0.15 85)' : 'oklch(0.55 0 0)',
                      borderLeft: activeSection === section.id ? '2px solid oklch(0.78 0.15 85)' : '2px solid transparent',
                    }}
                  >
                    {activeSection === section.id && <ChevronRight className="w-3 h-3 shrink-0" />}
                    <span className={activeSection === section.id ? 'font-medium' : ''}>{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-14">
              {sections.map((section) => (
                <article
                  key={section.id}
                  id={section.id}
                  ref={(el) => { sectionRefs.current[section.id] = el; }}
                  className="scroll-mt-24"
                >
                  <h2
                    className="text-2xl font-bold mb-6 pb-3 border-b"
                    style={{
                      color: 'oklch(0.97 0 0)',
                      fontFamily: 'Playfair Display, serif',
                      borderColor: 'oklch(0.78 0.15 85 / 0.2)',
                    }}
                  >
                    {section.title}
                  </h2>
                  {section.content}
                </article>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
