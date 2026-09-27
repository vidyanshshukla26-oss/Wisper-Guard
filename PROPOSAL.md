# Product Proposal

## What is the product, and who uses it?

[Project owner: describe the product idea and intended users.]

## Why Midnight specifically?

[Project owner: explain which data should remain private and which facts need public verification.]

## Data Model

| Data Point | Type | Disclosed To |
| --- | --- | --- |
| Report count | Public ledger state | Everyone |
| Opaque report commitment | Public ledger state | Everyone |
| Commitment secret | Private witness | Used in the local proof; not stored in ledger |
| Commitment salt | Private witness | Used in the local proof; not stored in ledger |
| Report narrative and evidence | Not handled by this contract | Not submitted by this prototype |
| Employment credential | Not implemented | No employment claim is currently proven |

## Mainnet Feasibility

[Project owner: assess auditing, credential issuance/revocation, abuse response, metadata privacy, secure messaging, legal obligations, operating costs, and a realistic launch timeline.]