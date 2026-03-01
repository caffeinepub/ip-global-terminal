# Specification

## Summary
**Goal:** Remove all WIPO references, Sovereign IP integration mentions, and hypothetical/unverified statistics from every page and component of the IP Global Terminal frontend.

**Planned changes:**
- In `Home.tsx`, remove any section titled "Integration with WIPO & Sovereign IP" or similar, remove hero/subtitle copy mentioning WIPO or Sovereign IP, and remove hypothetical statistics such as "180+ jurisdictions served".
- In `Whitepaper.tsx`, remove the "WIPO & Sovereign IP Integration" section (section 7) and all inline WIPO/Sovereign IP mentions and unverified statistics; replace with a neutral "Global IP Ecosystem Interoperability" section framed as blockchain-as-infrastructure; update the sticky TOC sidebar anchor links to reflect the section title change.
- In `Footer.tsx`, remove any copy, taglines, or links referencing WIPO, Sovereign IP integration, or hypothetical statistics.
- Audit `Header.tsx`, `IPDatabase.tsx`, `RegisterIP.tsx`, and any other frontend files for remaining WIPO, Sovereign IP, or hypothetical statistic references and remove them all.
- Preserve all Mock IP records, all other content sections, visual theme, layout, spacing, and functionality throughout.

**User-visible outcome:** The application contains no references to WIPO, Sovereign IP integration, or unverified statistics on any page or in any component, while all other content, mock data, and the dark navy/gold theme remain unchanged.
