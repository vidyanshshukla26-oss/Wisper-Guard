# How to Use WhisperGuard

## What You Need

- For the current prototype: a modern browser and the local Vite server.
- The local preview is not a reporting channel. Use fictional information only.
- There is no deployed contract, Lace connection, reviewer inbox, or real report submission.

## Step-by-Step Guide

### Local concept preview

1. Run `npm ci` and `npm run dev` from the project root.
2. Open the Vite URL printed in the terminal.
3. Choose a fictional concern category and support intent.
4. Enter fictional text. The interface warns about common email and phone patterns; this is not a guarantee that text is de-identified.
5. Optionally add fictional context.
6. Optionally select sample files. The browser calculates local SHA-256 fingerprints; no file is uploaded.
7. Review and edit the demo information.
8. Create a temporary receipt. Nothing is transmitted or saved, and refreshing clears it.

### Getting Started on Preprod

Not available yet. A Preprod contract, address, Lace integration, and deployed frontend are required first.

### Your First Transaction

Not available yet. The current frontend does not create or submit Midnight transactions.

## What Gets Proved (and What Stays Private)

The educational Compact contract proves that its caller supplied a secret and salt used to derive an opaque commitment. The ledger stores the commitment and a counter, not the witness values. The contract does not verify employment, company signatures, department membership, incident facts, or attachment contents. A chain transaction and its metadata may still be linkable to its submitting wallet.

## Troubleshooting

- On Windows, use WSL 2 with Ubuntu; the Windows program named `compact.exe` is not Midnight's compiler.
- Start Docker Desktop's Linux engine before starting the Midnight proof server.
- Check Compact/runtime compatibility against the [official matrix](https://docs.midnight.network/relnotes/support-matrix).
- If a report is important, do not use this preview; use a trusted, established reporting or emergency channel.