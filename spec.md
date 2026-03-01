# Specification

## Summary
**Goal:** Remove IPGT token balance checks from IP registration and make document upload optional.

**Planned changes:**
- Remove all token balance checks, "Insufficient IPGT tokens" error messages, and related conditional logic from `frontend/src/pages/RegisterIP.tsx`
- Remove token balance validation from the `registerIP` function in `backend/main.mo`
- Make the file upload input optional in `frontend/src/pages/RegisterIP.tsx`, removing any `required` constraint or submission guard that blocks submission without an attached document
- File upload still computes and populates the document hash field when a file is provided, but the form can submit without a file or document hash

**User-visible outcome:** Users can register an IP without owning any IPGT tokens and without uploading a document — both previously blocking requirements are removed.
