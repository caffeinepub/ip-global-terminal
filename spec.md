# Specification

## Summary
**Goal:** Remove the admin token gate so the IP Global Terminal app is fully publicly accessible via a clean shareable URL without requiring any `caffeineAdminToken` fragment.

**Planned changes:**
- Remove any token-checking logic from `urlParams.ts` that reads, persists, or validates a `caffeineAdminToken` URL parameter
- Remove any token gate, token prompt, or access-denied component that blocks app access based on a missing admin token
- Ensure all four public routes (Home, Register IP, IP Database, Whitepaper) load normally for any visitor without a token

**User-visible outcome:** Anyone can visit the app URL directly without any token in the URL and the app loads fully with all routes accessible.
