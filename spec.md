# Specification

## Summary
**Goal:** Add a fully functional IP Database page with mock frontend data, search/filter controls, and backend persistence via a Motoko canister.

**Planned changes:**
- Add at least 20 hardcoded mock IP records on the frontend with fields: IP address, owner/organization, country, city, registration date, and status (active/flagged/blocked)
- Add search input to filter records by IP address in real-time
- Add filter controls for status, country, and organization that can be combined, with a clear/reset option
- Add Motoko backend data structure and CRUD functions: `addIPRecord`, `updateIPRecord`, `deleteIPRecord`, and `listIPRecords`, stored in stable memory
- Add an "Add IP Record" form/modal that validates and persists new records to the backend canister
- Add edit functionality per record — pre-filled modal that updates backend records via `updateIPRecord` or updates mock records in local state
- Add delete functionality per record — confirmation prompt before calling `deleteIPRecord` or removing from local state
- On page load, fetch backend-persisted records via React Query and merge with frontend mock data for a unified display

**User-visible outcome:** Users can browse a pre-loaded IP database, search and filter records, add new IP entries that are persisted to the canister, and edit or delete both mock and backend records from the UI.
