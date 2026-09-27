# WhisperGuard

[![CI](https://github.com/vidyanshshukla26-oss/Wisper-Guard/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/vidyanshshukla26-oss/Wisper-Guard/actions/workflows/ci.yml)

> A worker-controlled concept for submitting a private concern and staying in touch with an independent reviewer.

## Live Demo

Not deployed yet. The current web app is a local-only concept preview.

## Contract Address

| Network | Address |
| --- | --- |
| Preview | Not deployed |
| Preprod | Not deployed |
| Mainnet | Not deployed |

## What This Product Does

WhisperGuard is a consumer-facing concept for workers who need a safer-feeling way to document a workplace concern without using an employer-controlled HR portal. The intended user is the individual reporter; an independent reviewer would handle follow-up.

The current app is a frontend and a small Compact learning contract. It does not verify employment, accept or transmit real reports, or provide a reviewer inbox. The contract's narrow demo purpose is to show a private-witness-derived opaque commitment being disclosed to a public ledger. It is not an operational whistleblower system.

## Privacy Model

- **Public:** The demo contract exposes a report count and opaque commitments. A deployed transaction can also expose chain-level sender, timing, and network metadata.
- **Private:** The contract's report secret and salt are witnesses; they are not written to the ledger. This does not make the current frontend or the reporter's network traffic anonymous.
- **Proved without revealing:** The demo circuit proves knowledge of values used to derive a commitment. It does not prove active employment, department membership, or a signed company credential.

## Privacy Claim

The contract is designed to publish a commitment rather than report text or a witness value. It does not hide a wallet address, transaction timing, IP address, browser metadata, or facts that could identify a reporter. Do not use the prototype for real reports.

## Tech Stack

- Midnight Network and Compact compiler (target network/version must be checked against the official compatibility matrix)
- Compact runtime 0.16.0
- React, TypeScript, Vite
- Node.js 22 or later, Docker Desktop/WSL for the Midnight toolchain

## Prerequisites

- Node.js 22 or later
- WSL 2 with Ubuntu on Windows, or a supported Linux/macOS development environment
- Docker Desktop with its Linux engine running
- Compact compiler 0.31.1 and the matching Midnight runtime
- Lace wallet and funded test-network account for deployment (not needed for local UI-only preview)

## Setup & Run Locally

1. Install and start the prerequisites above using the [official Midnight toolchain guide](https://docs.midnight.network/getting-started/installation). Windows development must use WSL; native Windows `compact.exe` is not the Midnight compiler.
2. Install the web dependencies: `npm ci`.
3. Run the UI: `npm run dev`.
4. Compile the contract after installing Compact: `npm run contracts:compile`.

The UI is still a prototype. Its forms clear on refresh and do not submit or save report content.

## Run Tests

```bash
npm test
```

This compiles the Compact contract, then runs the JavaScript contract-runtime tests. The tests do not deploy to a network or generate a production transaction proof.

## CI/CD

GitHub Actions is configured to use Node.js 22, install Compact 0.31.1, compile the contract, run the contract-runtime tests, type-check, and build the frontend on pushes to `main` and pull requests.

## Usage Guide

See [docs/USAGE.md](docs/USAGE.md).

## Feedback & Iterations

No user feedback has been collected yet. See [docs/FEEDBACK.md](docs/FEEDBACK.md); add real feedback only after testing with consenting participants.

## Level 5 — User Validation

- Target: 50 Preprod users
- Current: 0 / 50; no Preprod deployment or verified participants yet
- See [USERS.md](USERS.md) for the empty participant log
- See [docs/FEEDBACK.md](docs/FEEDBACK.md) for the feedback log

## Level 6 Users

See [LAUNCH_USERS.md](LAUNCH_USERS.md). Target: 20 participants; current count: 0. No launch users are represented as real.

## Product X Profile

Not created yet.

## Brand Assets

Not created yet. See [docs/BRAND.md](docs/BRAND.md) for the written brand direction.

## Product Proposal

See [PROPOSAL.md](PROPOSAL.md); the challenge-requested initial idea and feasibility answers are intentionally left for the project owner.

## Initial Idea

[Project owner: fill this in manually, as required by the challenge.]

## Screenshots

[Project owner: add verified Compact compile output and a real deployed contract address screenshot after those steps succeed.]

## Demo Video

[Project owner: add the demo video link after a real Preprod deployment is available.]

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
