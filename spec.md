# Specification

## Summary
**Goal:** Reduce the IP registration burn fee to 0.02 IPGT and persist Internet Identity login sessions across page reloads.

**Planned changes:**
- Update the backend burn fee constant from 100 IPGT to 0.02 IPGT (2 base units at 2 decimal precision), including minimum balance checks and burn logic
- Update the IP Registration page and Registration Success Modal to display "0.02 IPGT" as the burn fee instead of "100 IPGT"
- Update the Internet Identity authentication hook to persist the authenticated session in browser local storage, automatically restoring the session on page load without requiring re-authentication

**User-visible outcome:** Users are charged only 0.02 IPGT when registering an IP, all registration UI correctly reflects the new fee, and users stay logged in across page reloads until they explicitly log out.
