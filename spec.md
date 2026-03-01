# Specification

## Summary
**Goal:** Restore all non-whitepaper pages to their original dark navy/gold visual state while keeping the whitepaper feature intact, and add a "Read the Whitepaper" CTA to the homepage.

**Planned changes:**
- Restore `Home.tsx` to its pre-whitepaper layout (hero banner, feature grid, CTAs, color scheme, typography, spacing), while adding a "Read the Whitepaper" button/card linking to `/whitepaper` using the existing gold accent button style.
- Restore `Header.tsx` to its original dark navy/gold design (logo, nav link styling, balance display, mobile menu) while keeping the existing "Whitepaper" nav link.
- Restore `IPDatabase.tsx`, `RegisterIP.tsx`, and `CoinDashboard.tsx` to their pre-whitepaper visual state (card layouts, form styling, gold-accented buttons, dark navy theme).
- Restore `Layout.tsx` and `Footer.tsx` to their pre-whitepaper structural and visual state while preserving the `/whitepaper` route in `App.tsx`.
- Audit and revert any global changes in `index.css` and `tailwind.config.js` that affect non-whitepaper pages, while preserving whitepaper-specific print styles and prose utilities.

**User-visible outcome:** All non-whitepaper pages look exactly as they did before the whitepaper feature was added. The homepage includes a gold-accented "Read the Whitepaper" CTA, and the whitepaper page and its navigation link remain fully functional.
