import { getAddress, requestAccess, signTransaction } from '@stellar/freighter-api'
import {
  Asset,
  BASE_FEE,
  Horizon,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from '@stellar/stellar-sdk'

export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const FRIENDBOT_URL = 'https://friendbot.stellar.org'
export const NETWORK_PASSPHRASE = Networks.TESTNET
export const server = new Horizon.Server(HORIZON_URL)

type FreighterResult<T> = { value?: T; error?: string } | T

function resultValue<T>(result: FreighterResult<T>): T {
  if (typeof result === 'object' && result !== null && 'error' in result && result.error) {
    throw new Error(result.error)
  }
  if (typeof result === 'object' && result !== null && 'value' in result) {
    return result.value as T
  }
  return result as T
}

export async function connectWallet(): Promise<string> {
  const response = await requestAccess()
  const address = resultValue(response as FreighterResult<string>)
  if (!address) throw new Error('Freighter did not return a wallet address.')
  return address
}

export async function getConnectedAddress(): Promise<string | null> {
  try {
    const response = await getAddress()
    const address = resultValue(response as FreighterResult<string>)
    return address || null
  } catch {
    return null
  }
}

export async function getXlmBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey)
  const nativeBalance = account.balances.find((balance) => balance.asset_type === 'native')
  return nativeBalance?.balance ?? '0'
}

export async function fundWithFriendbot(publicKey: string): Promise<void> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`)
  if (!response.ok) throw new Error('Friendbot could not fund this account right now.')
}

export async function sendXlm(sender: string, recipient: string, amount: string): Promise<string> {
  if (!StrKey.isValidEd25519PublicKey(recipient)) throw new Error('Enter a valid Stellar public address.')
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) throw new Error('Enter an amount greater than 0.')

  const account = await server.loadAccount(sender)
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.payment({ destination: recipient, asset: Asset.native(), amount }))
    .setTimeout(180)
    .build()

  const signed = await signTransaction(transaction.toXDR(), { networkPassphrase: NETWORK_PASSPHRASE })
  const signedXdr = resultValue(signed as FreighterResult<string>)
  if (!signedXdr) throw new Error('Freighter did not return a signed transaction.')
  const result = await server.submitTransaction(TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE))
  return result.hash
}
