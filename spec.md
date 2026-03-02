# Specification

## Summary
**Goal:** Add persistent on-chain IP record storage, auth-gated submission, and public search to the IPGT Platform.

**Planned changes:**
- Store all IP registration form fields in stable backend storage (survives canister upgrades, accumulates over time)
- Expose public backend query functions for listing and searching all IP records by title, category, jurisdiction, description, etc.
- Require Internet Identity authentication to access the Register IP form; show a sign-in prompt to unauthenticated users
- Allow the IP Database page to load and search all records without any login requirement
- Wire the IP Database search and filter UI to live on-chain data from the backend

**User-visible outcome:** Authenticated users can register new IP records that are permanently stored on-chain. Anyone with the link can browse, search, and filter all submitted IP records on the IP Database page without logging in.
