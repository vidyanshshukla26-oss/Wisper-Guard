# WhisperGuard

WhisperGuard is a consumer-facing concept for private workplace reporting and anonymous follow-up. It is designed around the employee reporting a concern, not an employer's internal HR workflow.

## Prototype status

This repository currently contains a frontend prototype only. It does not submit, store, encrypt, or anchor reports; it does not verify employment credentials or provide a working follow-up inbox. The report form creates a temporary demo reference in the browser. Do not enter real incidents or identifying details.

The planned product direction includes zero-knowledge proofs of valid work credentials, on-chain evidence hashes using Midnight, and encrypted two-way messaging with independent reviewers. Those protections require audited contracts, cryptographic key management, credential issuance and revocation, and a secure service that are not present in this repository.

## Prototype features

These are frontend capabilities, not claims of production privacy or security:

1. Six workplace concern categories
2. Reporter intent selection
3. Four-step report wizard
4. Back navigation between completed steps
5. Required narrative validation
6. Narrative length limit
7. Live character counter
8. Email-pattern warning
9. Phone-pattern warning
10. Progress blocked when likely contact details are detected
11. Optional work-area selection
12. Approximate timeframe selection
13. Ongoing-incident toggle
14. Reporter relationship selection
15. Optional general work location
16. Multi-select impact tags
17. Multi-select preferred outcomes
18. Multi-file evidence selection
19. Evidence file-type validation
20. Per-file size validation
21. Evidence count limit
22. Browser-local SHA-256 fingerprinting
23. Remove evidence before review
24. Evidence handling disclosure
25. Report review summary
26. Edit links back to report sections
27. Fictional-data acknowledgment gate
28. Temporary in-tab report receipt
29. Unique demo reference generation
30. Copy reference control
31. Printable demo receipt
32. Clear report draft action
33. Follow-up reference entry
34. Current-tab reference lookup
35. Explicit no-inbox response
36. High-contrast display toggle
37. Larger-text toggle
38. Expandable privacy technology explanation
39. Expandable urgent-support guidance
40. Responsive mobile and desktop layouts

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run lint
npm run build
```
