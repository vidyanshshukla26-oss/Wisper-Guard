import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Check, ChevronRight, CircleHelp, Copy, ExternalLink, LoaderCircle, LogOut, RefreshCw, Send, Sparkles, Wallet, X } from 'lucide-react'
import { connectWallet, fundWithFriendbot, getConnectedAddress, getXlmBalance, HORIZON_URL, sendXlm } from './stellar'

type Notice = { type: 'success' | 'error'; message: string; hash?: string }

const shorten = (value: string) => `${value.slice(0, 6)}…${value.slice(-6)}`

function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState<'connect' | 'balance' | 'fund' | 'send' | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { getConnectedAddress().then((saved) => saved && setAddress(saved)) }, [])
  useEffect(() => { if (address) refreshBalance() }, [address])

  const formattedBalance = useMemo(() => balance ? Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '—', [balance])

  async function refreshBalance() {
    if (!address) return
    setLoading('balance')
    try { setBalance(await getXlmBalance(address)); setNotice(null) }
    catch { setBalance(null); setNotice({ type: 'error', message: 'Could not load this account. Fund it on Testnet first.' }) }
    finally { setLoading(null) }
  }

  async function handleConnect() {
    setLoading('connect'); setNotice(null)
    try { setAddress(await connectWallet()) }
    catch (error) { setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Could not connect to Freighter.' }) }
    finally { setLoading(null) }
  }

  function disconnect() { setAddress(null); setBalance(null); setNotice(null); setRecipient(''); setAmount('') }

  async function handleFund() {
    if (!address) return
    setLoading('fund'); setNotice(null)
    try { await fundWithFriendbot(address); await refreshBalance(); setNotice({ type: 'success', message: 'Testnet XLM added to your wallet.' }) }
    catch (error) { setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Friendbot request failed.' }) }
    finally { setLoading(null) }
  }

  async function handleSend(event: React.FormEvent) {
    event.preventDefault(); if (!address) return
    setLoading('send'); setNotice(null)
    try {
      const hash = await sendXlm(address, recipient.trim(), amount)
      setNotice({ type: 'success', message: 'Payment confirmed on Stellar Testnet.', hash })
      setRecipient(''); setAmount(''); await refreshBalance()
    } catch (error) { setNotice({ type: 'error', message: error instanceof Error ? error.message : 'Transaction failed.' }) }
    finally { setLoading(null) }
  }

  async function copyAddress() { if (!address) return; await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1600) }

  return <div className="app-shell">
    <div className="aurora aurora-one" /><div className="aurora aurora-two" />
    <header className="topbar"><a className="brand" href="/"><span className="brand-mark"><Sparkles size={17} /></span><span>stellar<span className="brand-accent">spark</span></span></a><div className="network-pill"><span className="pulse" /> Stellar Testnet <ChevronRight size={14} /></div></header>

    <main>
      <section className="hero"><div className="eyebrow"><span /> WHITE BELT / FIRST FLIGHT</div><h1>Make your first<br /><em>stellar</em> payment.</h1><p className="hero-copy">A simple, friendly way to connect your Freighter wallet, explore your testnet balance, and send XLM with confidence.</p><div className="hero-links"><a href="https://developers.stellar.org/docs" target="_blank" rel="noreferrer">Learn Stellar <ArrowUpRight size={15} /></a><span>Built for the testnet</span></div></section>

      <section className="workspace">
        <div className="card wallet-card"><div className="card-label"><span className="icon-chip"><Wallet size={16} /></span><span>YOUR WALLET</span><CircleHelp size={15} className="muted" /></div>
          {!address ? <div className="connect-empty"><div className="wallet-orbit"><Wallet size={29} /></div><h2>Start with your wallet</h2><p>Connect Freighter to see your Testnet account and start sending XLM.</p><button className="primary-button wide" onClick={handleConnect} disabled={loading === 'connect'}>{loading === 'connect' ? <LoaderCircle className="spin" size={18} /> : <Wallet size={18} />} {loading === 'connect' ? 'Connecting…' : 'Connect Freighter'}<ArrowUpRight size={16} /></button><a className="install-link" href="https://www.freighter.app/" target="_blank" rel="noreferrer">Need Freighter? Install it here <ExternalLink size={13} /></a></div> : <div className="wallet-connected"><div className="account-row"><div><span className="status-label"><span className="green-dot" /> CONNECTED</span><div className="address-line">{shorten(address)} <button className="icon-button" onClick={copyAddress} title="Copy address">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div></div><button className="disconnect" onClick={disconnect}><LogOut size={15} /> Disconnect</button></div><div className="balance-box"><div><span className="balance-label">AVAILABLE BALANCE</span><strong>{formattedBalance} <small>XLM</small></strong></div><button className="refresh" onClick={refreshBalance} disabled={loading === 'balance'} title="Refresh balance"><RefreshCw className={loading === 'balance' ? 'spin' : ''} size={17} /></button></div><div className="wallet-actions"><button className="secondary-button" onClick={handleFund} disabled={loading === 'fund'}>{loading === 'fund' ? <LoaderCircle className="spin" size={16} /> : <Sparkles size={16} />} {loading === 'fund' ? 'Requesting…' : 'Get testnet XLM'}</button><a className="text-link" href={`${HORIZON_URL}/accounts/${address}`} target="_blank" rel="noreferrer">View account <ExternalLink size={13} /></a></div></div>}
        </div>

        <div className="card send-card"><div className="card-label"><span className="icon-chip purple"><Send size={16} /></span><span>SEND XLM</span><span className="testnet-tag">TESTNET</span></div><form onSubmit={handleSend}><label>RECIPIENT ADDRESS<div className="input-wrap"><input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="G…" spellCheck="false" disabled={!address || loading === 'send'} /><span className="input-suffix">Stellar</span></div></label><label>AMOUNT<div className="amount-wrap"><input type="number" min="0.0000001" step="any" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" disabled={!address || loading === 'send'} /><span>XLM</span></div></label><button className="primary-button wide send-button" type="submit" disabled={!address || !recipient || !amount || loading === 'send'}>{loading === 'send' ? <LoaderCircle className="spin" size={18} /> : <Send size={17} />} {loading === 'send' ? 'Waiting for Freighter…' : 'Review & send'}<ArrowUpRight size={16} /></button><p className="form-note">You’ll review and approve this transaction in Freighter.</p></form></div>
      </section>

      {notice && <div className={`notice ${notice.type}`}><span className="notice-icon">{notice.type === 'success' ? <Check size={16} /> : <X size={16} />}</span><div><strong>{notice.message}</strong>{notice.hash && <a href={`https://stellar.expert/explorer/testnet/tx/${notice.hash}`} target="_blank" rel="noreferrer">View transaction <ExternalLink size={13} /></a>}</div><button className="notice-close" onClick={() => setNotice(null)}><X size={16} /></button></div>}

      <section className="steps"><div className="steps-heading"><span>THE FLOW</span><p>Three small steps to your first on-chain moment.</p></div><div className="step-list"><div className="step"><span className="step-number">01</span><div><strong>Connect</strong><p>Link your Freighter wallet</p></div></div><div className="step-line" /><div className="step"><span className="step-number">02</span><div><strong>Fund</strong><p>Get free Testnet XLM</p></div></div><div className="step-line" /><div className="step"><span className="step-number">03</span><div><strong>Send</strong><p>Make a real testnet payment</p></div></div></div></section>
    </main><footer><span>STELLARSPARK / LEVEL 1</span><span>Testnet only · No real funds</span></footer>
  </div>
}

export default App
