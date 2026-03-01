# Specification

## Summary
**Goal:** Gate IP registration behind authentication and profile setup, add simulated cross-chain badges to IP records, and fully remove all IPGT Coin/token references from the application.

**Planned changes:**
- Gate `/register-ip` so unauthenticated users see a login prompt and authenticated users without a completed profile are shown a `ProfileSetupModal` before accessing the form; `/database` remains publicly accessible.
- Add an "Organisation" field (optional) to `ProfileSetupModal` alongside display name and email; persist all three fields on submission.
- Update the backend to store and retrieve user profiles with display name, organisation, and optional email fields associated with the caller's principal.
- Add a simulated "Also Recorded On" section to `RegistrationSuccessModal` showing mock Ethereum (transaction ID + block number) and Solana (signature + slot number) references, clearly labelled as a future/simulated integration.
- Add the same simulated "Also Recorded On" section to `IPDetailModal`, displayed below existing ICP blockchain metadata, with the same disclaimer.
- Remove all IPGT Coin, burn fee, token balance, token transfer, and payment references from every page, modal, component, and route — including disabling the `/coin-dashboard` route, removing `TokenStats`, removing coin balance from the `Header`, and clearing coin/token language from `Footer` and `RegistrationSuccessModal`.

**User-visible outcome:** Users must log in and complete a profile (display name, organisation, optional email) before registering IP. Registered IP records and success modals show simulated Ethereum and Solana cross-chain badges labelled as future integrations. No IPGT Coin or token-related UI appears anywhere in the application.
