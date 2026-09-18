# Stellar Spark

Stellar Spark is a beginner-friendly XLM payment dApp for the Stellar **Testnet**. It demonstrates the complete Level 1 White Belt flow: connect Freighter, view an account's XLM balance, request testnet funds from Friendbot, and sign and submit an XLM payment.

## Features

- Freighter wallet connect and disconnect
- Stellar Testnet network indicator
- Live XLM balance from Horizon
- One-click Testnet funding via Friendbot
- XLM payment form with address validation
- Freighter transaction approval and Horizon submission
- Success/failure feedback with a link to the transaction hash
- Responsive layout for desktop and mobile

## Run locally

Requirements: Node.js 18+ and the [Freighter browser extension](https://www.freighter.app/).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. In Freighter, switch to **Testnet**, connect the wallet, and use **Get testnet XLM** if the account is not funded. All transactions are testnet-only and have no real-world value.

## Build and checks

```bash
npm run lint
npm run build
```

## How the Stellar flow works

1. The app requests the active public address from Freighter; no secret key is handled by the app.
2. Horizon's Testnet server loads the account and reads the native XLM balance.
3. The app builds a payment transaction with `@stellar/stellar-sdk` and the Testnet network passphrase.
4. Freighter signs the transaction, then Horizon submits it and returns the transaction hash.

## Submission screenshots

Capture these states locally for the final submission:

- Connected wallet state with the shortened public address
- Balance displayed in the wallet card
- Successful payment notification with the **View transaction** link

## Project structure

```text
src/
  App.tsx       UI, wallet state, balance and payment interactions
  stellar.ts    Freighter, Friendbot and Horizon integration
  styles.css    Responsive visual system
```

Built for the Stellar White Belt Level 1 challenge.
