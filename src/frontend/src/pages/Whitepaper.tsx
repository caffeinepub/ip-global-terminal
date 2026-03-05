import { ChevronRight, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

const sections: Section[] = [
  {
    id: "abstract",
    title: "1. Abstract",
    content: (
      <div className="prose-content">
        <p>
          The Intellectual Property Global Token (IPGT) platform presents a
          decentralized, blockchain-based registry for intellectual property
          (IP) rights. By leveraging the Internet Computer Protocol (ICP), IPGT
          provides an immutable, transparent, and globally accessible ledger for
          patents, trademarks, and copyrights. This whitepaper outlines the
          technical architecture, governance model, and economic framework
          underpinning the IPGT ecosystem.
        </p>
        <p>
          Traditional IP registration systems are fragmented,
          jurisdiction-dependent, and susceptible to administrative
          inefficiencies. IPGT addresses these limitations by providing a
          unified, cryptographically secured registry that transcends national
          boundaries while maintaining compliance with international IP
          frameworks.
        </p>
      </div>
    ),
  },
  {
    id: "introduction",
    title: "2. Introduction",
    content: (
      <div className="prose-content">
        <p>
          Intellectual property represents one of the most valuable asset
          classes in the modern economy. Yet the systems designed to protect
          these assets remain largely unchanged from their 19th-century origins
          — paper-based, siloed by jurisdiction, and vulnerable to fraud, loss,
          and administrative error.
        </p>
        <p>
          The emergence of blockchain technology offers a transformative
          opportunity: a single, immutable record of IP ownership that is
          accessible to anyone, anywhere, at any time. IPGT is built on this
          premise, utilizing the Internet Computer Protocol to deliver a
          next-generation IP registry that is secure, transparent, and globally
          interoperable.
        </p>
        <h3>2.1 Vision</h3>
        <p>
          Our vision is a world where creators, inventors, and innovators can
          instantly establish and prove ownership of their intellectual property
          without relying on slow, expensive, or geographically limited
          registration authorities.
        </p>
        <h3>2.2 Mission</h3>
        <p>
          To build the world's most trusted, accessible, and technologically
          advanced intellectual property registry — one that empowers
          individuals and organizations to protect their innovations on a global
          scale.
        </p>
      </div>
    ),
  },
  {
    id: "problem",
    title: "3. Problem Statement",
    content: (
      <div className="prose-content">
        <p>
          The current global IP landscape suffers from several critical
          deficiencies:
        </p>
        <h3>3.1 Fragmentation</h3>
        <p>
          IP rights are registered and enforced on a
          jurisdiction-by-jurisdiction basis. A patent granted in one country
          provides no automatic protection in another. This fragmentation
          creates enormous complexity and cost for innovators seeking global
          protection.
        </p>
        <h3>3.2 Opacity</h3>
        <p>
          Existing registries are often difficult to search, poorly indexed, and
          not interoperable. Determining whether a particular IP right exists,
          who owns it, and what its current status is can require significant
          legal expertise and expense.
        </p>
        <h3>3.3 Vulnerability to Fraud</h3>
        <p>
          Centralized databases are vulnerable to tampering, data loss, and
          administrative error. The integrity of IP records depends entirely on
          the trustworthiness of the administering authority.
        </p>
        <h3>3.4 Slow Registration Processes</h3>
        <p>
          Traditional IP registration can take months or years. During this
          period, innovators lack formal protection and may be unable to enforce
          their rights or attract investment.
        </p>
        <h3>3.5 High Costs</h3>
        <p>
          Filing fees, attorney costs, and maintenance fees make comprehensive
          IP protection prohibitively expensive for individual inventors and
          small enterprises, particularly in developing economies.
        </p>
      </div>
    ),
  },
  {
    id: "solution",
    title: "4. Solution Architecture",
    content: (
      <div className="prose-content">
        <p>
          IPGT addresses these challenges through a multi-layered technical
          architecture built on the Internet Computer Protocol.
        </p>
        <h3>4.1 Blockchain Foundation</h3>
        <p>
          The Internet Computer Protocol provides a decentralized compute
          platform with unique properties ideally suited for IP registry
          applications: web-speed transaction finality, on-chain storage of
          arbitrary data, and native support for complex smart contract logic
          via Motoko canisters.
        </p>
        <h3>4.2 Cryptographic Hashing</h3>
        <p>
          Every IP document submitted to the IPGT registry is processed through
          a SHA-256 cryptographic hash function. This hash serves as a unique
          digital fingerprint of the document, enabling verification of document
          integrity without requiring storage of the full document on-chain.
        </p>
        <h3>4.3 Immutable Record Storage</h3>
        <p>
          IP records are stored in canister smart contracts on the Internet
          Computer. Once written, these records cannot be altered or deleted,
          providing a permanent, tamper-proof history of IP registrations.
        </p>
        <h3>4.4 Decentralized Identity</h3>
        <p>
          IPGT integrates with Internet Identity, the ICP's native
          authentication system, to provide secure, privacy-preserving identity
          verification for IP registrants without relying on centralized
          identity providers.
        </p>
      </div>
    ),
  },
  {
    id: "registry",
    title: "5. IP Registry System",
    content: (
      <div className="prose-content">
        <p>
          The IPGT registry supports three primary categories of intellectual
          property, each with tailored registration workflows and metadata
          schemas.
        </p>
        <h3>5.1 Patents</h3>
        <p>
          Patent registrations capture invention disclosures, claims, and
          technical specifications. The registry records the filing date,
          inventor identity, and document hash, establishing a clear priority
          date for the invention.
        </p>
        <h3>5.2 Trademarks</h3>
        <p>
          Trademark registrations record brand identifiers including word marks,
          logos, and trade dress. The registry captures the goods and services
          associated with the mark and the jurisdiction of use.
        </p>
        <h3>5.3 Copyrights</h3>
        <p>
          Copyright registrations establish authorship and creation date for
          literary, artistic, musical, and software works. The cryptographic
          hash of the work provides irrefutable proof of the work's content at
          the time of registration.
        </p>
        <h3>5.4 Jurisdiction Support</h3>
        <p>
          The registry supports multi-jurisdiction filings, allowing registrants
          to specify the geographic scope of their IP protection. This enables a
          single registration to establish priority across multiple
          jurisdictions simultaneously.
        </p>
      </div>
    ),
  },
  {
    id: "technical",
    title: "6. Technical Implementation",
    content: (
      <div className="prose-content">
        <p>
          The IPGT platform is implemented as a set of Motoko canister smart
          contracts deployed on the Internet Computer Protocol mainnet.
        </p>
        <h3>6.1 Data Model</h3>
        <p>
          Each IP record contains: a unique identifier, title, description,
          category, owner principal, registration timestamp, document hash
          (SHA-256), optional file blob reference, jurisdiction, and a
          human-readable hash string for verification purposes.
        </p>
        <h3>6.2 Query Interface</h3>
        <p>
          The registry exposes a comprehensive query interface supporting:
          retrieval by ID, full-text search by title, search by document hash,
          filtering by category, filtering by jurisdiction, and filtering by
          owner principal. All queries are served as ICP query calls for maximum
          performance.
        </p>
        <h3>6.3 Update Interface</h3>
        <p>
          IP registration is performed via ICP update calls, ensuring that new
          records are finalized on the blockchain with full consensus. The
          registration function returns the unique IP ID assigned to the new
          record.
        </p>
        <h3>6.4 Storage Architecture</h3>
        <p>
          IP records are stored in a stable Map data structure within the
          canister, ensuring persistence across canister upgrades. Large file
          blobs are stored via the integrated blob storage system, with
          references maintained in the IP record.
        </p>
        <h3>6.5 Security Model</h3>
        <p>
          The canister implements role-based access control with three roles:
          admin, user, and guest. IP registration is open to all authenticated
          users. Administrative functions are restricted to designated admin
          principals.
        </p>
      </div>
    ),
  },
  {
    id: "governance",
    title: "7. Governance",
    content: (
      <div className="prose-content">
        <p>
          The IPGT platform is governed by a decentralized model that ensures
          the registry remains neutral, accessible, and resistant to capture by
          any single entity.
        </p>
        <h3>7.1 Protocol Governance</h3>
        <p>
          Protocol upgrades and parameter changes are subject to community
          governance processes. Major changes require broad consensus among
          stakeholders before implementation.
        </p>
        <h3>7.2 Registry Integrity</h3>
        <p>
          The immutability of the blockchain ensures that no single party —
          including the platform developers — can alter or delete existing IP
          records. This provides strong guarantees of registry integrity to all
          participants.
        </p>
        <h3>7.3 Dispute Resolution</h3>
        <p>
          While the registry itself is immutable, the platform provides
          mechanisms for flagging disputed records and recording the outcomes of
          legal proceedings. This allows the registry to reflect the current
          legal status of IP rights without compromising historical integrity.
        </p>
      </div>
    ),
  },
  {
    id: "legal",
    title: "8. Legal Framework",
    content: (
      <div className="prose-content">
        <p>
          IPGT operates within the existing international IP legal framework
          while providing technological enhancements that complement traditional
          registration systems.
        </p>
        <h3>8.1 Complementary Registration</h3>
        <p>
          IPGT registration provides cryptographic proof of creation date and
          ownership that can supplement traditional IP filings. The blockchain
          timestamp establishes a clear priority date that can be referenced in
          legal proceedings.
        </p>
        <h3>8.2 International Frameworks</h3>
        <p>
          The platform is designed to be compatible with major international IP
          frameworks and conventions. Registrants are encouraged to pursue
          formal registration through appropriate national and international
          authorities in addition to their IPGT registration.
        </p>
        <h3>8.3 Evidence of Ownership</h3>
        <p>
          The cryptographic proof provided by IPGT registration — including the
          SHA-256 document hash, blockchain timestamp, and owner principal —
          constitutes strong evidence of IP ownership and creation date that can
          be presented in legal and commercial contexts.
        </p>
        <h3>8.4 Disclaimer</h3>
        <p>
          IPGT registration does not constitute legal IP protection in any
          jurisdiction. Users are advised to consult qualified IP attorneys
          regarding the legal status of their intellectual property rights.
        </p>
      </div>
    ),
  },
  {
    id: "roadmap",
    title: "9. Roadmap",
    content: (
      <div className="prose-content">
        <h3>Phase 1 — Foundation (Current)</h3>
        <ul>
          <li>Core IP registry canister deployment on ICP mainnet</li>
          <li>Patent, trademark, and copyright registration</li>
          <li>SHA-256 document hashing and verification</li>
          <li>Global search and filter capabilities</li>
          <li>Internet Identity authentication integration</li>
        </ul>
        <h3>Phase 2 — Enhancement</h3>
        <ul>
          <li>Multi-signature ownership support</li>
          <li>IP licensing and transfer mechanisms</li>
          <li>Enhanced search with semantic capabilities</li>
          <li>API access for third-party integrations</li>
          <li>Mobile application development</li>
        </ul>
        <h3>Phase 3 — Ecosystem</h3>
        <ul>
          <li>Cross-chain IP verification bridges</li>
          <li>Integration with legal document management systems</li>
          <li>Automated conflict detection and notification</li>
          <li>IP marketplace and licensing platform</li>
          <li>Institutional partnership program</li>
        </ul>
      </div>
    ),
  },
  {
    id: "tokenomics",
    title: "10. Economic Model",
    content: (
      <div className="prose-content">
        <p>
          The IPGT platform is designed with a sustainable economic model that
          aligns incentives across all participants in the ecosystem.
        </p>
        <h3>10.1 Registration Fees</h3>
        <p>
          IP registration fees are structured to be accessible to individual
          inventors while providing sustainable revenue for platform maintenance
          and development. Fee structures vary by IP category and jurisdiction
          scope.
        </p>
        <h3>10.2 Platform Sustainability</h3>
        <p>
          Platform operations are funded through registration fees and
          institutional partnership agreements. A portion of fees is allocated
          to a development fund for ongoing platform improvements and security
          audits.
        </p>
        <h3>10.3 Incentive Alignment</h3>
        <p>
          The economic model is designed to incentivize high-quality
          registrations, accurate metadata, and active participation in the
          governance process. Participants who contribute to the health of the
          registry are rewarded accordingly.
        </p>
      </div>
    ),
  },
  {
    id: "security",
    title: "11. Security Considerations",
    content: (
      <div className="prose-content">
        <p>
          Security is a foundational concern for any IP registry. IPGT employs
          multiple layers of security to protect the integrity of the registry
          and the privacy of registrants.
        </p>
        <h3>11.1 Cryptographic Security</h3>
        <p>
          All IP records are secured by the cryptographic guarantees of the
          Internet Computer Protocol. The SHA-256 hashing of documents provides
          tamper-evident proof of document content. Private keys are managed by
          Internet Identity, which uses hardware security modules for key
          storage.
        </p>
        <h3>11.2 Smart Contract Auditing</h3>
        <p>
          The IPGT canister smart contracts undergo regular security audits by
          independent third-party security researchers. Audit reports are
          published publicly to maintain transparency.
        </p>
        <h3>11.3 Access Control</h3>
        <p>
          Role-based access control ensures that only authorized principals can
          perform administrative functions. All access control decisions are
          enforced at the canister level and cannot be bypassed by frontend
          modifications.
        </p>
        <h3>11.4 Data Privacy</h3>
        <p>
          While IP records are publicly accessible by design, the platform
          provides options for registrants to control the visibility of
          sensitive metadata. Document content is never stored on-chain — only
          the cryptographic hash is recorded.
        </p>
      </div>
    ),
  },
  {
    id: "conclusion",
    title: "12. Conclusion",
    content: (
      <div className="prose-content">
        <p>
          The IPGT platform represents a significant advancement in the global
          management of intellectual property rights. By combining the
          immutability and transparency of blockchain technology with the
          performance and scalability of the Internet Computer Protocol, IPGT
          delivers a registry that is more secure, more accessible, and more
          trustworthy than any existing alternative.
        </p>
        <p>
          The fragmentation, opacity, and vulnerability of traditional IP
          systems impose enormous costs on innovators worldwide. IPGT offers a
          path to a more efficient, equitable, and effective global IP ecosystem
          — one where creators can protect their innovations instantly,
          affordably, and with cryptographic certainty.
        </p>
        <p>
          We invite inventors, creators, legal professionals, and institutions
          to join us in building this new foundation for global intellectual
          property protection. The future of innovation deserves infrastructure
          worthy of it.
        </p>
      </div>
    ),
  },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState("abstract");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gold-900/30 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-gold-500 text-sm font-medium uppercase tracking-widest mb-3">
            Technical Whitepaper
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            IPGT Platform
          </h1>
          <p className="text-white/60 text-lg mb-6">
            Decentralized Intellectual Property Registry on the Internet
            Computer Protocol
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/40">
            <span>Version 1.0</span>
            <span>•</span>
            <span>March 2026</span>
            <span>•</span>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-gold-500 hover:text-gold-400 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    sectionRefs.current[section.id]?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors ${
                    activeSection === section.id
                      ? "text-gold-400 bg-gold-900/20 border-l-2 border-gold-500"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {activeSection === section.id && (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span>{section.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
              className="mb-16 scroll-mt-24"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6 pb-3 border-b border-gold-900/30">
                {section.title}
              </h2>
              <div className="text-white/70 leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
