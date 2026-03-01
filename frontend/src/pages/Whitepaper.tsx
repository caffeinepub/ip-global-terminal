import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Printer, ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'the-problem', label: 'The Problem' },
  { id: 'the-solution', label: 'The Solution' },
  { id: 'technology-architecture', label: 'Technology Architecture' },
  { id: 'encryption-hashing', label: 'Encryption & Hashing' },
  { id: 'duplicate-protection', label: 'Duplicate IP Protection' },
  { id: 'tokenomics', label: 'IPGT Tokenomics' },
  { id: 'release-schedule', label: 'Token Release Schedule' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'legal-disclaimer', label: 'Legal Disclaimer' },
];

// Monthly vesting schedule data (months 1–48, ~1.5625B/month)
const MONTHLY_RELEASE = 1_562_500_000;
const IMMEDIATE_RELEASE = 25_000_000_000;
const TOTAL_SUPPLY = 100_000_000_000;

function formatBillions(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(4)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return n.toLocaleString();
}

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [tocOpen, setTocOpen] = useState(false);
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
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTocOpen(false);
    }
  };

  const handlePrint = () => window.print();

  // Build release schedule rows: immediate + 48 monthly
  const scheduleRows: { period: string; released: string; cumulative: string; pct: string }[] = [];
  scheduleRows.push({
    period: 'Launch (Day 0)',
    released: formatBillions(IMMEDIATE_RELEASE),
    cumulative: formatBillions(IMMEDIATE_RELEASE),
    pct: '25.00%',
  });
  let cumulative = IMMEDIATE_RELEASE;
  for (let m = 1; m <= 48; m++) {
    cumulative += MONTHLY_RELEASE;
    scheduleRows.push({
      period: `Month ${m}`,
      released: formatBillions(MONTHLY_RELEASE),
      cumulative: formatBillions(Math.min(cumulative, TOTAL_SUPPLY)),
      pct: `${((Math.min(cumulative, TOTAL_SUPPLY) / TOTAL_SUPPLY) * 100).toFixed(2)}%`,
    });
  }

  return (
    <div className="min-h-screen print:bg-white">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-content { max-width: 100% !important; margin: 0 !important; padding: 2rem !important; }
          body { background: white !important; color: black !important; }
          h1, h2, h3, h4 { color: black !important; }
          p, li, td, th { color: #333 !important; }
          .section-heading { border-bottom: 2px solid #c9a227 !important; }
        }
      `}</style>

      {/* Page Header */}
      <div
        className="no-print border-b border-border py-4"
        style={{ backgroundColor: 'oklch(0.12 0.025 240)' }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Button
            onClick={handlePrint}
            size="sm"
            className="gap-2 font-semibold"
            style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-10 relative">

          {/* Sticky TOC Sidebar */}
          <aside className="no-print hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                  Table of Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                        activeSection === s.id
                          ? 'font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-charcoal'
                      }`}
                      style={activeSection === s.id ? { color: 'oklch(0.78 0.14 85)', backgroundColor: 'oklch(0.78 0.14 85 / 0.08)' } : {}}
                    >
                      <span
                        className="text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-mono"
                        style={activeSection === s.id
                          ? { backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }
                          : { backgroundColor: 'oklch(0.22 0.03 240)', color: 'oklch(0.55 0.04 240)' }
                        }
                      >
                        {i + 1}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Mobile TOC Toggle */}
          <div className="no-print lg:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-bold text-sm"
              style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
            >
              §
            </button>
            {tocOpen && (
              <div
                className="absolute bottom-14 right-0 w-64 rounded-lg p-4 shadow-xl"
                style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Table of Contents
                </p>
                <nav className="space-y-1">
                  {sections.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm text-muted-foreground hover:text-foreground"
                    >
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      {s.label}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0 print-content">
            {/* Document Title */}
            <div className="mb-12 pb-8 border-b border-border">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-widest uppercase"
                style={{ backgroundColor: 'oklch(0.78 0.14 85 / 0.12)', color: 'oklch(0.78 0.14 85)', border: '1px solid oklch(0.78 0.14 85 / 0.25)' }}
              >
                Official Whitepaper — Version 1.0
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                IP Global Terminal
                <br />
                <span style={{ color: 'oklch(0.78 0.14 85)' }}>IPGT Protocol</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                A Decentralized Intellectual Property Registry and Deflationary Token Economy Built on the Internet Computer Protocol
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>Published: {new Date().getFullYear()}</span>
                <span>Token: IPGT</span>
                <span>Total Supply: 100,000,000,000 IPGT</span>
                <span>Blockchain: Internet Computer (ICP)</span>
              </div>
            </div>

            {/* ── Section 1: Executive Summary ── */}
            <section id="executive-summary" className="mb-16 scroll-mt-24">
              <SectionHeading number={1} title="Executive Summary" />
              <div className="prose-content">
                <p>
                  The IP Global Terminal (IPGT) is a pioneering decentralized application built on the Internet Computer Protocol (ICP) that fundamentally reimagines how intellectual property is registered, verified, and protected in the digital age. At its core, IPGT provides a tamper-proof, globally accessible, and cryptographically secured registry for patents, trademarks, and copyrights — eliminating the inefficiencies, geographic barriers, and prohibitive costs that have long plagued traditional IP protection systems.
                </p>
                <p>
                  IPGT is powered by its native utility token, IPGT Coin, a deflationary digital asset with a fixed total supply of 100 billion tokens. The token serves as the economic backbone of the platform: every IP registration requires a small burn of IPGT tokens, permanently reducing the circulating supply and creating a deflationary pressure that rewards long-term holders. The treasury holds the full initial supply and releases tokens according to a transparent, pre-programmed vesting schedule designed to ensure sustainable ecosystem growth.
                </p>
                <p>
                  The platform leverages the unique capabilities of the Internet Computer — including on-chain storage, Internet Identity authentication, and canister-based smart contracts — to deliver a user experience that is simultaneously secure, private, and accessible to anyone with an internet connection. Unlike traditional IP registries that are siloed by jurisdiction and controlled by centralized authorities, IPGT creates a single, unified, immutable ledger of intellectual property that is owned by no single entity and accessible to all.
                </p>
                <p>
                  This whitepaper outlines the technical architecture, cryptographic methodology, tokenomics, release schedule, and long-term vision of the IPGT protocol. It is intended for developers, investors, IP professionals, and anyone interested in the intersection of blockchain technology and intellectual property law.
                </p>
              </div>
            </section>

            {/* ── Section 2: The Problem ── */}
            <section id="the-problem" className="mb-16 scroll-mt-24">
              <SectionHeading number={2} title="The Problem" />
              <div className="prose-content">
                <p>
                  Intellectual property represents one of the most valuable categories of assets in the modern economy. From pharmaceutical patents worth billions of dollars to the creative works of independent artists, IP protection underpins innovation, commerce, and culture. Yet the systems we rely upon to protect these assets are fundamentally broken — fragmented, expensive, slow, and inaccessible to the vast majority of creators and innovators worldwide.
                </p>
                <h3>Geographic Fragmentation</h3>
                <p>
                  Traditional IP protection is inherently territorial. A patent granted in the United States provides no protection in the European Union, Japan, or Brazil. To achieve meaningful global protection, an inventor must file separate applications in each jurisdiction — a process that can cost tens of thousands of dollars in legal fees, translation costs, and filing fees, and take years to complete. This system effectively reserves meaningful IP protection for large corporations and wealthy individuals, leaving the vast majority of the world's innovators unprotected.
                </p>
                <h3>Centralized Control and Single Points of Failure</h3>
                <p>
                  National IP registries are controlled by government agencies that are subject to political pressures, bureaucratic inefficiencies, and technical vulnerabilities. Records can be altered, lost, or destroyed. Databases can be hacked. Governments can be pressured to invalidate or modify IP records. The centralized nature of these systems creates single points of failure that undermine the very certainty and permanence that IP protection is supposed to provide.
                </p>
                <h3>Lack of Transparency and Verifiability</h3>
                <p>
                  Verifying the authenticity and priority of an IP claim in the traditional system requires navigating complex legal databases, hiring specialized attorneys, and often waiting weeks or months for official responses. There is no universal, real-time, publicly accessible record of all registered intellectual property. This opacity creates fertile ground for disputes, infringement, and fraud.
                </p>
                <h3>Prohibitive Costs and Barriers to Entry</h3>
                <p>
                  The cost of filing a single patent application in the United States alone can range from $5,000 to $15,000 or more when attorney fees are included. International protection through the Patent Cooperation Treaty (PCT) can cost $50,000 or more. Trademark registration, while less expensive, still requires significant legal expertise and ongoing maintenance fees. Copyright registration, though theoretically automatic in many jurisdictions, provides limited practical protection without formal registration. These costs effectively exclude independent inventors, small businesses, artists, and creators in developing economies from meaningful IP protection.
                </p>
                <h3>Slow and Inefficient Processes</h3>
                <p>
                  Patent applications in the United States currently take an average of 24 to 36 months to be examined and granted. During this period, inventors have limited protection and face significant uncertainty. The backlog at major patent offices worldwide runs into the millions of applications. In a world where technology moves at the speed of software, a three-year wait for IP protection is not just inconvenient — it is commercially devastating.
                </p>
                <h3>The Digital Age Demands a Digital Solution</h3>
                <p>
                  The rise of digital content, software, AI-generated works, and global internet commerce has created entirely new categories of intellectual property that existing legal frameworks struggle to accommodate. The traditional IP system was designed for a world of physical goods and national borders — it is fundamentally ill-equipped to handle the realities of the 21st-century digital economy. A new approach is urgently needed.
                </p>
              </div>
            </section>

            {/* ── Section 3: The Solution ── */}
            <section id="the-solution" className="mb-16 scroll-mt-24">
              <SectionHeading number={3} title="The Solution" />
              <div className="prose-content">
                <p>
                  IP Global Terminal addresses each of these systemic failures through a combination of blockchain technology, cryptographic proof, decentralized identity, and a carefully designed token economy. Rather than attempting to replace existing legal frameworks — which would be both impractical and unnecessary — IPGT creates a complementary layer of cryptographic proof that establishes priority, authenticity, and ownership in a manner that is globally accessible, instantly verifiable, and permanently immutable.
                </p>
                <h3>A Universal, Borderless Registry</h3>
                <p>
                  By building on the Internet Computer Protocol, IPGT creates a single, unified IP registry that is accessible from anywhere in the world without geographic restrictions. Any creator, inventor, or business — regardless of their location, nationality, or financial resources — can register their intellectual property on the IPGT platform for a nominal fee denominated in IPGT tokens. The resulting record is immediately visible to the entire world and cannot be altered, deleted, or disputed by any single authority.
                </p>
                <h3>Cryptographic Priority Establishment</h3>
                <p>
                  When a user registers an IP on the IPGT platform, the system generates a SHA-256 cryptographic hash of the submitted document. This hash — a unique 256-bit fingerprint of the document's contents — is stored permanently on the Internet Computer blockchain along with a precise timestamp, the registrant's identity, and associated metadata. This creates an irrefutable, cryptographically verifiable record of who registered what, and when. In any subsequent dispute over IP ownership or priority, the IPGT record provides objective, tamper-proof evidence that cannot be forged or backdated.
                </p>
                <h3>Accessible and Affordable</h3>
                <p>
                  The IPGT registration fee is just 0.02 IPGT tokens — a fraction of a cent at current valuations. This makes IP registration accessible to independent creators, small businesses, and innovators in developing economies who have historically been excluded from meaningful IP protection. The platform requires only an internet connection and an Internet Identity — no attorneys, no government forms, no waiting periods.
                </p>
                <h3>Transparent and Publicly Verifiable</h3>
                <p>
                  The entire IPGT registry is publicly searchable and browsable without requiring any login or authentication. Anyone can search for registered IPs by title, category, jurisdiction, or owner. Anyone can verify the authenticity of a registration by comparing the document hash. This radical transparency eliminates the opacity that enables IP fraud and infringement in the traditional system.
                </p>
                <h3>Deflationary Token Economy</h3>
                <p>
                  Every IP registration permanently burns 0.02 IPGT tokens from the registrant's balance. These tokens are destroyed — not transferred to a fee recipient — permanently reducing the circulating supply. As adoption grows and more IPs are registered, the deflationary pressure increases, creating a natural alignment between platform usage and token value. This mechanism rewards early adopters and long-term holders while ensuring that the token has genuine utility beyond speculation.
                </p>
              </div>
            </section>

            {/* ── Section 4: Technology Architecture ── */}
            <section id="technology-architecture" className="mb-16 scroll-mt-24">
              <SectionHeading number={4} title="Technology Architecture" />
              <div className="prose-content">
                <p>
                  The IPGT platform is built entirely on the Internet Computer Protocol (ICP), a revolutionary blockchain network developed by the DFINITY Foundation that enables the deployment of fully on-chain web applications — including both frontend and backend — without reliance on traditional cloud infrastructure. This architectural choice is not incidental; it is fundamental to IPGT's core value proposition of true decentralization and permanent immutability.
                </p>
                <h3>Internet Computer Protocol (ICP)</h3>
                <p>
                  The Internet Computer is a blockchain network that runs at web speed and can serve web content directly to users' browsers without intermediaries. Unlike Ethereum or other smart contract platforms that store only small amounts of data on-chain and rely on centralized services like AWS or IPFS for storage, the Internet Computer can store gigabytes of data directly in canister smart contracts. This means that IPGT's entire application — including the IP registry, user profiles, token ledger, and frontend interface — runs entirely on-chain, with no centralized servers that can be shut down, censored, or compromised.
                </p>
                <h3>Canister Smart Contracts</h3>
                <p>
                  The IPGT backend is implemented as a Motoko canister — a WebAssembly-based smart contract that runs on the Internet Computer. The canister manages the IP registry, token ledger, user profiles, and access control logic. All state changes — IP registrations, token transfers, token burns — are finalized on-chain through the Internet Computer's consensus mechanism, providing the same security guarantees as any blockchain transaction while operating at significantly higher throughput and lower cost than Ethereum-based alternatives.
                </p>
                <h3>Internet Identity Authentication</h3>
                <p>
                  User authentication on IPGT is handled through Internet Identity, the Internet Computer's native, privacy-preserving authentication system. Internet Identity uses WebAuthn — the same standard used by hardware security keys and biometric authentication on modern devices — to provide cryptographically secure authentication without passwords. Each user receives a unique principal identifier that serves as their on-chain identity, enabling the platform to associate IP registrations, token balances, and user profiles with specific identities without exposing personally identifiable information.
                </p>
                <h3>On-Chain Storage and Blob Management</h3>
                <p>
                  IPGT supports the optional upload of supporting documents alongside IP registrations. These files are stored using the platform's blob storage system, which leverages the Internet Computer's native storage capabilities to maintain files on-chain. The system supports files of arbitrary size through chunked upload and streaming, enabling users to store complete patent applications, trademark specimens, or creative works alongside their registration records.
                </p>
                <h3>Role-Based Access Control</h3>
                <p>
                  The platform implements a three-tier role-based access control system: administrators, users, and guests. Administrators have full access to platform management functions, including treasury initialization and user role assignment. Authenticated users can register IPs, transfer tokens, and manage their profiles. Guests (unauthenticated visitors) can browse the public IP database and view token statistics without any authentication requirement. This tiered system ensures that sensitive operations are protected while maintaining the platform's commitment to public accessibility.
                </p>
                <h3>Immutable Record Architecture</h3>
                <p>
                  Once an IP record is written to the IPGT registry, it cannot be modified or deleted. This immutability is enforced at the protocol level by the Internet Computer's consensus mechanism — no single party, including the platform developers, can alter or remove a registered IP record. This permanence is a core feature, not a limitation: it provides the certainty and finality that IP protection requires, and it ensures that the historical record of IP registrations remains intact indefinitely.
                </p>
              </div>
            </section>

            {/* ── Section 5: Encryption & Hashing ── */}
            <section id="encryption-hashing" className="mb-16 scroll-mt-24">
              <SectionHeading number={5} title="Encryption & Hashing Methodology" />
              <div className="prose-content">
                <p>
                  The cryptographic foundation of IPGT's IP protection system is the SHA-256 (Secure Hash Algorithm 256-bit) hashing function, a member of the SHA-2 family of cryptographic hash functions designed by the United States National Security Agency and published by the National Institute of Standards and Technology (NIST). SHA-256 is the same algorithm used to secure Bitcoin transactions and is widely regarded as one of the most robust and well-tested cryptographic primitives in existence.
                </p>
                <h3>How Document Hashing Works</h3>
                <p>
                  When a user submits a document for IP registration on the IPGT platform, the document is processed through the SHA-256 algorithm on the client side — in the user's browser — before any data is transmitted to the blockchain. The algorithm takes the document's binary content as input and produces a fixed-length 256-bit (32-byte) output called a hash or digest. This hash is a unique mathematical fingerprint of the document: any change to the document's content — even a single character — produces a completely different hash.
                </p>
                <p>
                  The resulting hash is then transmitted to the IPGT canister along with the registration metadata (title, description, category, jurisdiction) and stored permanently on the Internet Computer blockchain. The original document is never transmitted to or stored on the blockchain unless the user explicitly chooses to upload it as a supporting file. This design preserves the privacy of sensitive IP content while still creating an irrefutable cryptographic record of the document's existence and content at the time of registration.
                </p>
                <h3>Properties of SHA-256 That Make It Ideal for IP Protection</h3>
                <p>
                  <strong>Determinism:</strong> The same document always produces the same hash. This means that anyone who possesses the original document can independently verify that it matches a registered hash, providing a reliable mechanism for proving ownership and authenticity.
                </p>
                <p>
                  <strong>Pre-image Resistance:</strong> Given a hash, it is computationally infeasible to reconstruct the original document. This means that storing a document's hash on a public blockchain does not expose the document's contents — the hash reveals nothing about the underlying IP.
                </p>
                <p>
                  <strong>Collision Resistance:</strong> It is computationally infeasible to find two different documents that produce the same hash. This property is critical for IP protection: it ensures that no one can create a fraudulent document that matches the hash of a legitimately registered IP.
                </p>
                <p>
                  <strong>Avalanche Effect:</strong> Even a tiny change to the input document — a single bit — produces a completely different hash. This makes it impossible to make minor modifications to a document and claim it matches a previously registered hash.
                </p>
                <h3>Establishing Prior Art and Priority</h3>
                <p>
                  In intellectual property law, the concept of "prior art" is fundamental: the first party to create or disclose an invention or creative work has priority over subsequent claimants. The IPGT system creates an immutable, timestamped record of document hashes that serves as objective evidence of prior art. When a user registers an IP on IPGT, the blockchain records the exact timestamp of the registration alongside the document hash. This timestamp is determined by the Internet Computer's consensus mechanism and cannot be manipulated by any party — not even the platform developers.
                </p>
                <p>
                  In a dispute over IP ownership, the IPGT record provides a powerful piece of evidence: a cryptographically verifiable proof that a specific document existed and was registered by a specific identity at a specific point in time. While IPGT registration does not replace formal legal IP protection in any jurisdiction, it provides a strong foundation for establishing priority that can be presented in legal proceedings worldwide.
                </p>
                <h3>Client-Side Hashing and Privacy</h3>
                <p>
                  A critical design decision in the IPGT architecture is that document hashing occurs entirely on the client side, in the user's browser, before any data is transmitted to the blockchain. This means that the raw content of sensitive IP documents — trade secrets, unpublished inventions, proprietary formulas — never leaves the user's device unless they explicitly choose to upload the document as a supporting file. The platform receives only the hash, which reveals nothing about the document's contents. This privacy-preserving design makes IPGT suitable for registering highly sensitive intellectual property that the owner is not yet ready to disclose publicly.
                </p>
              </div>
            </section>

            {/* ── Section 6: Duplicate Protection ── */}
            <section id="duplicate-protection" className="mb-16 scroll-mt-24">
              <SectionHeading number={6} title="Duplicate IP Protection" />
              <div className="prose-content">
                <CalloutBox>
                  <strong>Core Guarantee:</strong> The IPGT protocol enforces strict hash uniqueness at the smart contract level. The same document hash cannot be registered twice under any circumstances. Any attempt to register a document that has already been registered will be rejected by the canister, regardless of who is attempting the registration.
                </CalloutBox>
                <p>
                  One of the most critical features of any IP registry is the prevention of duplicate registrations. In the traditional IP system, duplicate filings are a persistent problem: the same invention may be independently patented in multiple jurisdictions, the same trademark may be registered by different parties in different countries, and the same creative work may be registered multiple times under different names. These duplications create legal uncertainty, enable fraud, and undermine the reliability of the registry as a whole.
                </p>
                <h3>Hash-Based Uniqueness Enforcement</h3>
                <p>
                  IPGT solves the duplicate registration problem through cryptographic hash uniqueness enforcement. When a user attempts to register an IP, the IPGT canister computes or receives the SHA-256 hash of the submitted document and checks it against all previously registered hashes in the registry. If the hash already exists in the registry — meaning an identical document has already been registered — the registration attempt is immediately rejected with an error message indicating that the IP has already been registered.
                </p>
                <p>
                  This mechanism is enforced at the smart contract level, not at the application layer. It cannot be bypassed by modifying the frontend, using a different browser, or attempting to register through a direct canister call. The uniqueness check is an immutable part of the registration logic that applies equally to all users, including platform administrators.
                </p>
                <h3>What Constitutes a Duplicate</h3>
                <p>
                  A duplicate registration is defined as any attempt to register a document whose SHA-256 hash is identical to a previously registered document's hash. Because SHA-256 is collision-resistant, two documents will only produce the same hash if they are byte-for-byte identical. This means that:
                </p>
                <ul>
                  <li>A document with even a single character changed will produce a different hash and will not be flagged as a duplicate.</li>
                  <li>The same document submitted by a different user will be flagged as a duplicate, regardless of the submitter's identity.</li>
                  <li>The same document submitted with different metadata (different title, description, or category) will still be flagged as a duplicate, because the hash is derived from the document content, not the metadata.</li>
                  <li>A document that has been reformatted (e.g., converted from PDF to Word) may produce a different hash and may not be flagged as a duplicate, depending on whether the binary content has changed.</li>
                </ul>
                <h3>Implications for IP Priority</h3>
                <p>
                  The duplicate protection mechanism has important implications for IP priority. The first party to register a document on IPGT establishes an immutable, timestamped record of their claim to that IP. Any subsequent attempt to register the same document will be rejected, providing clear evidence that the first registrant has priority. This creates a powerful incentive for creators and inventors to register their IP on IPGT as early as possible — even before formal legal protection is sought — to establish an irrefutable record of priority.
                </p>
                <h3>Transparency of the Registry</h3>
                <p>
                  Because the IPGT registry is publicly searchable, any party can verify whether a specific document has already been registered before investing in development or commercialization. This transparency reduces the risk of inadvertent infringement and enables due diligence that is simply not possible with traditional, siloed IP registries. The public nature of the registry also creates a deterrent against fraudulent registration attempts: any attempt to register a document that is already publicly known to belong to another party will be immediately visible to the entire community.
                </p>
              </div>
            </section>

            {/* ── Section 7: Tokenomics ── */}
            <section id="tokenomics" className="mb-16 scroll-mt-24">
              <SectionHeading number={7} title="IPGT Tokenomics" />
              <div className="prose-content">
                <p>
                  The IPGT token economy is designed around three core principles: accessibility, sustainability, and deflationary value accrual. The tokenomics model ensures that the platform remains affordable for users, that the ecosystem has sufficient liquidity to grow, and that long-term holders are rewarded through a systematic reduction in circulating supply driven by genuine platform usage.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                  {[
                    { label: 'Total Supply', value: '100,000,000,000', unit: 'IPGT', desc: 'Fixed, no additional minting' },
                    { label: 'Immediate Release', value: '25,000,000,000', unit: 'IPGT', desc: '25% at launch' },
                    { label: 'Vesting Supply', value: '75,000,000,000', unit: 'IPGT', desc: '75% over 48 months' },
                    { label: 'Monthly Vesting', value: '~1,562,500,000', unit: 'IPGT', desc: 'Per month for 48 months' },
                    { label: 'Registration Fee', value: '0.02', unit: 'IPGT', desc: 'Burned per registration' },
                    { label: 'Burn Mechanism', value: 'Deflationary', unit: '', desc: 'Tokens permanently destroyed' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-4"
                      style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
                    >
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="font-serif font-bold text-xl" style={{ color: 'oklch(0.78 0.14 85)' }}>
                        {item.value} <span className="text-sm font-sans font-normal text-muted-foreground">{item.unit}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <h3>Total Supply and Fixed Issuance</h3>
                <p>
                  The total supply of IPGT tokens is fixed at 100,000,000,000 (100 billion) tokens. No additional tokens can ever be minted. This hard cap is enforced at the smart contract level and cannot be changed by any party, including the platform developers. The fixed supply ensures that IPGT is not subject to inflationary dilution — the only direction the circulating supply can move is downward, as tokens are burned through IP registrations.
                </p>
                <h3>Treasury Allocation and Controlled Release</h3>
                <p>
                  The entire initial supply of 100 billion IPGT tokens is held by the treasury — a distinct account controlled by the platform's administrative principal. The treasury is separate from any individual user's wallet, including the founding team's personal holdings. This separation ensures that treasury funds are managed transparently and in accordance with the pre-programmed release schedule, rather than being subject to the discretionary decisions of any individual.
                </p>
                <p>
                  At launch, 25 billion IPGT tokens (25% of total supply) are immediately released from the treasury for distribution. This initial release provides sufficient liquidity for early adopters, exchange listings, and ecosystem development without flooding the market with the full supply. The remaining 75 billion tokens vest linearly over 48 months at a rate of approximately 1,562,500,000 IPGT per month.
                </p>
                <h3>Deflationary Burn Mechanism</h3>
                <p>
                  Every IP registration on the IPGT platform burns 0.02 IPGT tokens from the registrant's balance. These tokens are permanently destroyed — they are not transferred to the treasury, the development team, or any other recipient. They are simply removed from the total circulating supply forever. This burn mechanism creates a direct link between platform adoption and token scarcity: as more IPs are registered, more tokens are burned, and the circulating supply decreases.
                </p>
                <p>
                  To illustrate the potential deflationary impact: if 1 million IP registrations are completed, 20,000 IPGT tokens will be permanently burned. At 1 billion registrations — a realistic long-term target for a global IP registry serving billions of creators — 20 million IPGT tokens will have been burned. While these numbers are small relative to the total supply in the early stages, the cumulative effect over decades of platform operation could be substantial.
                </p>
                <h3>Token Utility</h3>
                <p>
                  IPGT tokens have clear, immediate utility within the platform ecosystem. They are required to register intellectual property (burned as a registration fee), they can be transferred between users to facilitate peer-to-peer transactions, and they serve as a store of value within the IPGT ecosystem. Future utility expansions may include governance voting rights, premium feature access, and integration with the broader ICP DeFi ecosystem through listings on decentralized exchanges such as ICPSwap and Sonic.
                </p>
              </div>
            </section>

            {/* ── Section 8: Release Schedule ── */}
            <section id="release-schedule" className="mb-16 scroll-mt-24">
              <SectionHeading number={8} title="Token Release Schedule" />
              <div className="prose-content">
                <p>
                  The IPGT token release schedule is designed to balance immediate liquidity needs with long-term ecosystem sustainability. The schedule follows a simple, transparent linear vesting model that is easy to understand and verify, avoiding the complexity and opacity of cliff-based or milestone-based vesting schemes that have been criticized in other token projects.
                </p>
                <h3>Rationale for the Release Schedule</h3>
                <p>
                  The decision to release 25% of the supply immediately at launch reflects the need for sufficient liquidity to support exchange listings, early adopter incentives, and ecosystem development activities. Without adequate initial liquidity, the token cannot be effectively traded or distributed to the community, which would undermine the platform's growth objectives.
                </p>
                <p>
                  The decision to vest the remaining 75% over 48 months (4 years) reflects industry best practices for token vesting schedules. A 4-year vesting period is long enough to demonstrate the team's long-term commitment to the project and to prevent large-scale token dumps that could destabilize the market, while being short enough to maintain meaningful incentives for continued development and ecosystem growth. The linear vesting model — releasing equal amounts each month — is preferred over cliff-based models because it provides predictable, steady supply growth that is easier for market participants to model and anticipate.
                </p>
                <p>
                  The monthly release rate of approximately 1,562,500,000 IPGT represents approximately 1.5625% of the total supply per month during the vesting period. This gradual release ensures that the market has time to absorb new supply without experiencing the sharp price dislocations that can occur when large tranches of tokens are released all at once.
                </p>

                <h3>Monthly Release Table (Selected Milestones)</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The table below shows key milestones in the 48-month vesting schedule. The full schedule releases ~1.5625B IPGT per month from Month 1 through Month 48.
                </p>
              </div>

              {/* Release Schedule Table */}
              <div
                className="rounded-lg overflow-hidden border border-border"
                style={{ backgroundColor: 'oklch(0.14 0.025 240)' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'oklch(0.16 0.025 240)', borderBottom: '1px solid oklch(0.28 0.03 240)' }}>
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Period</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Released</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Cumulative</th>
                        <th className="text-right px-4 py-3 font-semibold text-muted-foreground">% of Supply</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        scheduleRows[0],
                        scheduleRows[1],
                        scheduleRows[3],
                        scheduleRows[6],
                        scheduleRows[12],
                        scheduleRows[18],
                        scheduleRows[24],
                        scheduleRows[30],
                        scheduleRows[36],
                        scheduleRows[42],
                        scheduleRows[48],
                      ].map((row, i) => (
                        <tr
                          key={row.period}
                          style={{
                            borderBottom: '1px solid oklch(0.22 0.025 240)',
                            backgroundColor: i % 2 === 0 ? 'transparent' : 'oklch(0.15 0.025 240 / 0.5)',
                          }}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{row.period}</td>
                          <td className="px-4 py-3 text-right" style={{ color: 'oklch(0.78 0.14 85)' }}>{row.released}</td>
                          <td className="px-4 py-3 text-right text-foreground">{row.cumulative}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{row.pct}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="prose-content mt-6">
                <p className="text-sm text-muted-foreground">
                  * All figures are approximate. The full 48-month schedule releases exactly 1,562,500,000 IPGT per month. Total supply at end of vesting period: 100,000,000,000 IPGT (subject to deflationary burns from IP registrations).
                </p>
                <h3>Post-Vesting Supply Dynamics</h3>
                <p>
                  After the 48-month vesting period concludes, the treasury will have released its full allocation. From that point forward, the only supply-side dynamic is deflationary: tokens are burned through IP registrations, and no new tokens are ever created. This post-vesting phase represents the mature state of the IPGT economy — a fixed, slowly declining supply driven by genuine platform utility.
                </p>
              </div>
            </section>

            {/* ── Section 9: Use Cases ── */}
            <section id="use-cases" className="mb-16 scroll-mt-24">
              <SectionHeading number={9} title="Use Cases" />
              <div className="prose-content">
                <p>
                  The IPGT platform is designed to serve a broad range of intellectual property types and use cases. While the platform currently supports three primary IP categories — patents, trademarks, and copyrights — the underlying architecture is flexible enough to accommodate virtually any type of intellectual property that can be represented as a digital document.
                </p>
                <h3>Patents and Inventions</h3>
                <p>
                  Inventors can use IPGT to establish an immutable, timestamped record of their inventions before filing formal patent applications. This "provisional" registration on IPGT creates a cryptographic proof of prior art that can be used to establish priority in patent disputes. For inventors in jurisdictions with first-to-file patent systems, early IPGT registration can be a critical tool for protecting their priority date while they prepare their formal patent application.
                </p>
                <p>
                  IPGT is particularly valuable for inventors who are not yet ready to disclose their inventions publicly — because the platform stores only the document hash (not the document itself), inventors can register their inventions on IPGT without revealing their contents. The hash proves that the document existed at the time of registration without disclosing what it contains.
                </p>
                <h3>Trademarks and Brand Identity</h3>
                <p>
                  Businesses and entrepreneurs can use IPGT to register their brand names, logos, slogans, and other trademark assets. While IPGT registration does not replace formal trademark registration with national trademark offices, it creates a publicly accessible record of when a brand identity was first used and by whom. This record can be valuable in trademark disputes, particularly in jurisdictions that recognize common law trademark rights based on first use.
                </p>
                <p>
                  For businesses operating globally, IPGT provides a single, unified record of their trademark assets that is accessible from any jurisdiction — a significant advantage over the fragmented national trademark registries that currently exist.
                </p>
                <h3>Copyrights and Creative Works</h3>
                <p>
                  Artists, writers, musicians, filmmakers, and other creative professionals can use IPGT to register their creative works and establish an immutable record of authorship and creation date. While copyright protection is automatic in most jurisdictions upon creation of a work, formal registration provides significant legal advantages in enforcement proceedings. IPGT registration provides a blockchain-based alternative that is globally accessible and immediately verifiable.
                </p>
                <p>
                  IPGT is particularly valuable for digital creators whose works are easily copied and distributed online. By registering their works on IPGT, creators establish a clear, verifiable record of authorship that can be used to pursue infringement claims and licensing negotiations.
                </p>
                <h3>Software and Code</h3>
                <p>
                  Software developers can use IPGT to register their source code, algorithms, and software architectures. The SHA-256 hash of a codebase provides a unique fingerprint that can be used to prove that a specific version of the code existed at a specific point in time. This is particularly valuable for open-source developers who want to establish priority for their innovations while maintaining the openness of their code.
                </p>
                <h3>Trade Secrets and Confidential Information</h3>
                <p>
                  Because IPGT stores only document hashes — not the documents themselves — the platform is uniquely suited for registering trade secrets and other confidential information. A company can register the hash of a confidential formula, process, or business method on IPGT, creating a timestamped proof of possession without disclosing the secret itself. This can be valuable in trade secret litigation, where establishing the date of creation and the identity of the creator is often critical.
                </p>
                <h3>Academic Research and Scientific Priority</h3>
                <p>
                  Researchers and scientists can use IPGT to establish priority for their discoveries and inventions before formal publication. In academic research, the race to publish is intense, and the ability to prove that a discovery was made at a specific date — even before the paper was submitted for peer review — can be decisive in priority disputes. IPGT provides a simple, accessible mechanism for establishing this kind of pre-publication priority.
                </p>
                <h3>Digital Art and NFTs</h3>
                <p>
                  Digital artists and NFT creators can use IPGT to register the underlying creative works that their NFTs represent. While NFTs provide a mechanism for establishing ownership of a digital token, they do not necessarily establish ownership of the underlying creative work. IPGT registration provides a complementary layer of IP protection that establishes the creator's authorship and priority for the underlying work, independent of any NFT platform or marketplace.
                </p>
              </div>
            </section>

            {/* ── Section 10: Roadmap ── */}
            <section id="roadmap" className="mb-16 scroll-mt-24">
              <SectionHeading number={10} title="Roadmap" />
              <div className="prose-content">
                <p>
                  The IPGT development roadmap is organized into three phases, each building on the foundation established by the previous phase. The roadmap reflects the team's commitment to building a sustainable, long-term platform rather than chasing short-term metrics or hype cycles.
                </p>
              </div>

              <div className="space-y-6 mt-6">
                {[
                  {
                    phase: 'Phase 1',
                    title: 'Foundation & Launch',
                    status: 'Active',
                    color: 'oklch(0.65 0.18 145)',
                    items: [
                      'Deploy IPGT canister on Internet Computer mainnet',
                      'Launch IP registry with patent, trademark, and copyright support',
                      'Implement SHA-256 document hashing and duplicate protection',
                      'Deploy IPGT token ledger with 100B fixed supply',
                      'Launch treasury with 25B immediate release and 48-month vesting schedule',
                      'Implement Internet Identity authentication',
                      'Launch public IP database with search and filtering',
                      'Deploy frontend on Internet Computer (fully on-chain)',
                      'Publish whitepaper and technical documentation',
                      'Community building and early adopter outreach',
                    ],
                  },
                  {
                    phase: 'Phase 2',
                    title: 'Exchange Listing & Ecosystem Growth',
                    status: 'Planned',
                    color: 'oklch(0.78 0.14 85)',
                    items: [
                      'Deploy standalone ICRC-1 compliant IPGT token canister',
                      'List IPGT on ICPSwap decentralized exchange',
                      'List IPGT on Sonic DEX',
                      'Enable cross-wallet transfers between ICPSwap and IPGT Terminal',
                      'Launch IPGT staking and governance mechanisms',
                      'Implement advanced search and analytics for the IP database',
                      'Add support for additional IP categories (trade secrets, domain names)',
                      'Launch API for third-party integrations',
                      'Establish partnerships with IP law firms and legal tech companies',
                      'Expand to additional blockchain networks for cross-chain compatibility',
                    ],
                  },
                  {
                    phase: 'Phase 3',
                    title: 'Global Adoption & Protocol Maturity',
                    status: 'Future',
                    color: 'oklch(0.65 0.12 240)',
                    items: [
                      'Achieve recognition as a standard IP registration mechanism in key jurisdictions',
                      'Launch IPGT DAO for community governance of protocol parameters',
                      'Implement cross-chain IP verification with Ethereum, Solana, and other networks',
                      'Develop enterprise API and white-label solutions for IP law firms',
                      'Launch IPGT mobile application for iOS and Android',
                      'Establish IPGT Foundation as a non-profit steward of the protocol',
                      'Achieve 1 million registered IPs on the platform',
                      'Launch IPGT Academy for IP education and awareness',
                      'Develop AI-powered IP similarity detection and prior art search',
                      'Pursue formal recognition of IPGT records in international IP treaties',
                    ],
                  },
                ].map((phase) => (
                  <div
                    key={phase.phase}
                    className="rounded-lg overflow-hidden"
                    style={{ border: `1px solid ${phase.color}40` }}
                  >
                    <div
                      className="px-6 py-4 flex items-center justify-between"
                      style={{ backgroundColor: `${phase.color}12` }}
                    >
                      <div>
                        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: phase.color }}>
                          {phase.phase}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-foreground mt-0.5">{phase.title}</h3>
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${phase.color}20`, color: phase.color, border: `1px solid ${phase.color}40` }}
                      >
                        {phase.status}
                      </span>
                    </div>
                    <div className="px-6 py-4" style={{ backgroundColor: 'oklch(0.14 0.025 240)' }}>
                      <ul className="space-y-2">
                        {phase.items.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" style={{ color: phase.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 11: Legal Disclaimer ── */}
            <section id="legal-disclaimer" className="mb-16 scroll-mt-24">
              <SectionHeading number={11} title="Legal Disclaimer" />
              <div
                className="rounded-lg p-6 text-sm text-muted-foreground leading-relaxed space-y-4"
                style={{ backgroundColor: 'oklch(0.16 0.025 240)', border: '1px solid oklch(0.28 0.03 240)' }}
              >
                <p>
                  <strong className="text-foreground">Not Legal Advice.</strong> This whitepaper is provided for informational purposes only and does not constitute legal advice. The information contained herein should not be relied upon as a substitute for professional legal counsel. IP registration on the IPGT platform does not replace or substitute for formal intellectual property registration with national or international IP authorities. Users are strongly encouraged to consult qualified IP attorneys in their respective jurisdictions for advice on formal IP protection strategies.
                </p>
                <p>
                  <strong className="text-foreground">Not Financial Advice.</strong> Nothing in this whitepaper constitutes financial, investment, or trading advice. The IPGT token is a utility token designed to facilitate access to the IPGT platform's services. The purchase, holding, or trading of IPGT tokens involves significant risk, including the risk of total loss of invested capital. Past performance is not indicative of future results. Prospective token purchasers should conduct their own due diligence and consult qualified financial advisors before making any investment decisions.
                </p>
                <p>
                  <strong className="text-foreground">Regulatory Uncertainty.</strong> The regulatory status of blockchain-based tokens and decentralized applications varies significantly across jurisdictions and is subject to rapid change. The IPGT token may be classified as a security, commodity, or other regulated instrument in certain jurisdictions. Users are responsible for ensuring that their use of the IPGT platform and their holding or trading of IPGT tokens complies with all applicable laws and regulations in their jurisdiction.
                </p>
                <p>
                  <strong className="text-foreground">No Warranty.</strong> The IPGT platform is provided "as is" without warranty of any kind, express or implied. The platform developers make no representations or warranties regarding the accuracy, completeness, or reliability of the platform or its records. While the platform is designed to be immutable and tamper-proof, no technology is completely immune to bugs, exploits, or unforeseen failure modes.
                </p>
                <p>
                  <strong className="text-foreground">Forward-Looking Statements.</strong> This whitepaper contains forward-looking statements regarding the future development and adoption of the IPGT platform. These statements are based on current expectations and assumptions and are subject to significant risks and uncertainties. Actual results may differ materially from those described in forward-looking statements. The platform developers undertake no obligation to update forward-looking statements to reflect changed circumstances or new information.
                </p>
                <p>
                  <strong className="text-foreground">Intellectual Property.</strong> All content in this whitepaper, including text, graphics, and technical descriptions, is the intellectual property of the IPGT project. Reproduction or distribution of this whitepaper, in whole or in part, without prior written permission is prohibited.
                </p>
                <p className="text-xs">
                  © {new Date().getFullYear()} IP Global Terminal. All rights reserved. IPGT is built on the Internet Computer Protocol. This document is version 1.0 and may be updated as the platform evolves.
                </p>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="section-heading flex items-center gap-4 mb-6 pb-4" style={{ borderBottom: '2px solid oklch(0.78 0.14 85 / 0.3)' }}>
      <span
        className="font-mono text-sm font-bold w-8 h-8 rounded flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'oklch(0.78 0.14 85)', color: 'oklch(0.10 0.02 240)' }}
      >
        {number}
      </span>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
    </div>
  );
}

function CalloutBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-4 my-6 text-sm leading-relaxed"
      style={{
        backgroundColor: 'oklch(0.78 0.14 85 / 0.08)',
        border: '1px solid oklch(0.78 0.14 85 / 0.35)',
        color: 'oklch(0.88 0.06 85)',
      }}
    >
      {children}
    </div>
  );
}
