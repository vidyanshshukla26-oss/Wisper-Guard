import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as RT from '@midnight-ntwrk/compact-runtime'
import { Contract, ledger } from '../managed/whisperguard/contract/index.js'

const coinPublicKey = '0'.repeat(64)
const contractAddress = RT.sampleContractAddress()

function bytes(value) {
  return new Uint8Array(32).fill(value)
}

function setup(secret = bytes(17), salt = bytes(29)) {
  const privateState = { secret, salt }
  const witnesses = {
    reportSecret: ({ privateState: state }) => [state, state.secret],
    reportSalt: ({ privateState: state }) => [state, state.salt],
  }
  const contract = new Contract(witnesses)
  const initial = contract.initialState(RT.createConstructorContext(privateState, coinPublicKey))
  const context = RT.createCircuitContext(contractAddress, coinPublicKey, initial.currentContractState, privateState)

  return { contract, context, privateState }
}

test('initializes an empty public registry', () => {
  const { context } = setup()
  const publicState = ledger(context.currentQueryContext.state)

  assert.equal(publicState.reportCount, 0n)
  assert.equal(publicState.reportCommitments.size(), 0n)
})

test('anchors one disclosed commitment and increments public state', () => {
  const { contract, context } = setup()
  const result = contract.impureCircuits.anchorReport(context)
  const publicState = ledger(result.context.currentQueryContext.state)

  assert.equal(result.result.length, 0)
  assert.equal(publicState.reportCount, 1n)
  assert.equal(publicState.reportCommitments.size(), 1n)
})

test('rejects duplicate commitments without exposing witness fields in public state', () => {
  const { contract, context, privateState } = setup()
  const first = contract.impureCircuits.anchorReport(context)
  const publicState = ledger(first.context.currentQueryContext.state)

  assert.throws(
    () => contract.impureCircuits.anchorReport(first.context),
    /This report commitment was already recorded/,
  )
  assert.equal(publicState.reportCommitments.member(privateState.secret), false)
  assert.equal(publicState.reportCommitments.member(privateState.salt), false)
  assert.equal('reportSecret' in publicState, false)
  assert.equal('reportSalt' in publicState, false)
})