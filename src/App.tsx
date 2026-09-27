import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ChevronDown, CircleAlert, Copy, FileText, Fingerprint, LockKeyhole, MessageCircle, Scale, Shield, ShieldCheck, Sparkles, Trash2, Upload, X } from 'lucide-react'

type View = 'report' | 'followup' | 'receipt'
type Step = 'concern' | 'context' | 'evidence' | 'review'
type Evidence = { id: string; name: string; size: number; sha256: string; type: string }
type CaseReceipt = { reference: string; category: string; severity: string; details: string; area: string; timeframe: string; relationship: string; location: string; impact: string[]; outcomes: string[]; evidence: Evidence[]; createdAt: string }

const steps: { id: Step; number: string; label: string }[] = [
  { id: 'concern', number: '01', label: 'Your concern' },
  { id: 'context', number: '02', label: 'More context' },
  { id: 'evidence', number: '03', label: 'Evidence' },
  { id: 'review', number: '04', label: 'Review' },
]

const categories = [
  { label: 'Harassment', icon: MessageCircle },
  { label: 'Discrimination', icon: Scale },
  { label: 'Safety concern', icon: CircleAlert },
  { label: 'Fraud or ethics', icon: BadgeCheck },
  { label: 'Retaliation', icon: Shield },
  { label: 'Something else', icon: Sparkles },
]

const impactChoices = ['My wellbeing', 'My work', 'A colleague', 'Team trust', 'Customer safety']
const outcomeChoices = ['I want this documented', 'I want guidance', 'I want an investigation', 'I am not sure yet']
const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
const maxFileSize = 8 * 1024 * 1024

function toggleChoice(current: string[], value: string) {
  return current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
}

function App() {
  const [view, setView] = useState<View>('report')
  const [step, setStep] = useState<Step>('concern')
  const [category, setCategory] = useState('Harassment')
  const [severity, setSeverity] = useState('I need advice')
  const [details, setDetails] = useState('')
  const [area, setArea] = useState('')
  const [timeframe, setTimeframe] = useState('')
  const [relationship, setRelationship] = useState('')
  const [location, setLocation] = useState('')
  const [ongoing, setOngoing] = useState(false)
  const [impacts, setImpacts] = useState<string[]>([])
  const [outcomes, setOutcomes] = useState<string[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [formError, setFormError] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [receipt, setReceipt] = useState<CaseReceipt | null>(null)
  const [referenceInput, setReferenceInput] = useState('')
  const [lookupAttempted, setLookupAttempted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  const stepIndex = steps.findIndex((item) => item.id === step)
  const foundPII = useMemo(() => /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(details) || /\b(?:\+?\d[\d ().-]{7,}\d)\b/.test(details), [details])

  function goToStep(nextStep: Step) {
    setStep(nextStep)
    setFormError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function nextStep() {
    if (step === 'concern' && details.trim().length < 20) {
      setFormError('Add at least 20 characters so the demo report has enough context.')
      return
    }
    if (stepIndex < steps.length - 1) goToStep(steps[stepIndex + 1].id)
  }

  function previousStep() {
    if (stepIndex > 0) goToStep(steps[stepIndex - 1].id)
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.currentTarget.value = ''
    setFormError('')
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setFormError(`${file.name}: use a PDF, JPG, PNG, or plain text file.`)
        continue
      }
      if (file.size > maxFileSize) {
        setFormError(`${file.name}: each file must be 8 MB or smaller.`)
        continue
      }
      if (evidence.length >= 5) {
        setFormError('This demo allows up to five evidence fingerprints.')
        break
      }
      try {
        const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
        const sha256 = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
        setEvidence((current) => [...current, { id: crypto.randomUUID(), name: file.name, size: file.size, sha256, type: file.type }])
      } catch {
        setFormError('This browser could not calculate a local fingerprint for that file.')
      }
    }
  }

  function createReceipt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!acknowledged) return
    setReceipt({
      reference: `WG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      category,
      severity,
      details: details.trim(),
      area,
      timeframe: ongoing ? 'Ongoing' : timeframe,
      relationship,
      location,
      impact: [...impacts],
      outcomes: [...outcomes],
      evidence: [...evidence],
      createdAt: new Date().toLocaleString(),
    })
    setView('receipt')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
      setFormError('Clipboard access is unavailable. Select and copy the reference manually.')
    }
  }

  function resetDraft() {
    setCategory('Harassment')
    setSeverity('I need advice')
    setDetails('')
    setArea('')
    setTimeframe('')
    setRelationship('')
    setLocation('')
    setOngoing(false)
    setImpacts([])
    setOutcomes([])
    setEvidence([])
    setAcknowledged(false)
    setReceipt(null)
    setStep('concern')
    setFormError('')
    setView('report')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showReport() {
    setView('report')
    setStep('concern')
    setLookupAttempted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const appClass = `app-shell${highContrast ? ' high-contrast' : ''}${largeText ? ' large-text' : ''}`

  return <div className={appClass}>
    <header className="topbar">
      <button className="brand" onClick={showReport} aria-label="WhisperGuard home">
        <span className="brand-mark"><Shield size={19} strokeWidth={2.2} /></span>
        <span className="brand-name">whisper<span>guard</span></span>
      </button>
      <nav className="main-nav" aria-label="Main navigation">
        <button className={view !== 'followup' ? 'nav-link active' : 'nav-link'} onClick={showReport}>Make a report</button>
        <button className={view === 'followup' ? 'nav-link active' : 'nav-link'} onClick={() => { setLookupAttempted(false); setView('followup') }}>Follow-up inbox</button>
      </nav>
      <div className="access-controls" aria-label="Display settings">
        <button className="access-button" aria-pressed={largeText} onClick={() => setLargeText(!largeText)} title="Toggle larger text">A+</button>
        <button className="access-button contrast-button" aria-pressed={highContrast} onClick={() => setHighContrast(!highContrast)} title="Toggle high contrast">◐</button>
      </div>
      <div className="demo-mark"><span /> Prototype</div>
    </header>

    <main>
      <section className="intro">
        <div className="intro-copy">
          <div className="eyebrow"><span className="eyebrow-rule" /> INDEPENDENT WORKPLACE REPORTING</div>
          <h1>{view === 'followup' ? <>Continue the<br /><em>conversation.</em></> : view === 'receipt' ? <>Your voice<br /><em>is heard.</em></> : <>Speak up.<br /><em>Stay in control.</em></>}</h1>
          <p>{view === 'followup' ? 'A calmer, more private way to check for questions and updates.' : view === 'receipt' ? 'Your demo reference is ready. Keep it somewhere private.' : 'A calmer, more private way to raise a concern at work, on your terms.'}</p>
        </div>
        <div className="intro-note">
          <div className="note-icon"><LockKeyhole size={17} /></div>
          <div><strong>Prototype only</strong><p>Do not enter real names, incidents, or identifying details. This demo does not send or protect reports.</p></div>
        </div>
      </section>

      <section className="content-grid">
        <div className="main-column">
          {view === 'report' && <section className="form-panel" aria-labelledby="report-heading">
            <div className="panel-heading">
              <div><span className="step-kicker">{steps[stepIndex].number} <span>/</span> {steps[stepIndex].label.toUpperCase()}</span><h2 id="report-heading">{step === 'concern' ? 'What would you like to report?' : step === 'context' ? 'Add only what feels useful.' : step === 'evidence' ? 'Add evidence fingerprints.' : 'Review your demo report.'}</h2></div>
              <span className="panel-icon">{step === 'evidence' ? <Fingerprint size={19} /> : step === 'review' ? <ShieldCheck size={19} /> : <FileText size={19} />}</span>
            </div>

            <div className="step-progress" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
              {steps.map((item, index) => <button key={item.id} className={`progress-step${index <= stepIndex ? ' complete' : ''}${item.id === step ? ' current' : ''}`} onClick={() => index < stepIndex && goToStep(item.id)} disabled={index >= stepIndex} aria-current={item.id === step ? 'step' : undefined}><span>{index < stepIndex ? <Check size={12} /> : item.number}</span><small>{item.label}</small></button>)}
            </div>

            <form onSubmit={createReceipt}>
              {step === 'concern' && <>
                <fieldset className="category-field">
                  <legend>Choose the closest fit</legend>
                  <div className="category-grid">{categories.map(({ label, icon: Icon }) => <button className={category === label ? 'category-option selected' : 'category-option'} type="button" key={label} aria-pressed={category === label} onClick={() => setCategory(label)}><Icon size={17} /><span>{label}</span>{category === label && <Check className="category-check" size={14} />}</button>)}</div>
                </fieldset>
                <fieldset className="choice-field"><legend>What kind of support do you want?</legend><div className="choice-row">{['I need advice', 'I want to report', 'I am not sure'].map((item) => <button key={item} type="button" className={severity === item ? 'choice-chip selected' : 'choice-chip'} aria-pressed={severity === item} onClick={() => setSeverity(item)}>{item}</button>)}</div></fieldset>
                <label className="field-label" htmlFor="report-details">Tell us what happened <span>Required</span></label>
                <textarea id="report-details" value={details} onChange={(event) => setDetails(event.target.value)} maxLength={2000} placeholder="Use fictional details only. Avoid names, exact dates, or identifying information." minLength={20} required />
                <div className="field-foot"><span>Share only what is needed to explain the concern.</span><span>{details.length} / 2,000</span></div>
                {foundPII && <div className="pii-warning" role="status"><CircleAlert size={16} /><span>This text may contain an email address or phone number. Remove identifying details before continuing.</span></div>}
              </>}

              {step === 'context' && <>
                <div className="field-row">
                  <label className="field-label" htmlFor="department">Area of work <span>Optional</span><div className="select-wrap"><select id="department" value={area} onChange={(event) => setArea(event.target.value)}><option value="">Choose an area</option><option>Customer support</option><option>Engineering</option><option>Finance</option><option>Operations</option><option>People team</option><option>Other / prefer not to say</option></select><ChevronDown size={16} /></div></label>
                  <label className="field-label" htmlFor="timeframe">Approximate timeframe <span>Optional</span><div className="select-wrap"><select id="timeframe" value={timeframe} onChange={(event) => setTimeframe(event.target.value)} disabled={ongoing}><option value="">Choose a timeframe</option><option>In the past week</option><option>In the past month</option><option>More than a month ago</option><option>Not sure</option></select><ChevronDown size={16} /></div></label>
                </div>
                <label className="toggle-row"><input type="checkbox" checked={ongoing} onChange={(event) => setOngoing(event.target.checked)} /><span className="custom-check"><Check size={13} /></span><span>This is ongoing</span></label>
                <div className="field-row">
                  <label className="field-label" htmlFor="relationship">Your relationship to this concern <span>Optional</span><div className="select-wrap"><select id="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)}><option value="">Prefer not to say</option><option>It happened to me</option><option>I witnessed it</option><option>Someone shared it with me</option></select><ChevronDown size={16} /></div></label>
                  <label className="field-label" htmlFor="work-location">General work location <span>Optional</span><input id="work-location" className="text-input" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={80} placeholder="e.g. Remote or regional office" /></label>
                </div>
                <fieldset className="choice-field"><legend>What was affected? <span>Select any</span></legend><div className="choice-row wrap">{impactChoices.map((item) => <button key={item} type="button" className={impacts.includes(item) ? 'choice-chip selected' : 'choice-chip'} aria-pressed={impacts.includes(item)} onClick={() => setImpacts((current) => toggleChoice(current, item))}>{item}</button>)}</div></fieldset>
                <fieldset className="choice-field"><legend>What outcome would help? <span>Select any</span></legend><div className="choice-row wrap">{outcomeChoices.map((item) => <button key={item} type="button" className={outcomes.includes(item) ? 'choice-chip selected' : 'choice-chip'} aria-pressed={outcomes.includes(item)} onClick={() => setOutcomes((current) => toggleChoice(current, item))}>{item}</button>)}</div></fieldset>
              </>}

              {step === 'evidence' && <>
                <div className="evidence-callout"><Fingerprint size={19} /><p><strong>Files stay in this tab.</strong> The browser calculates a SHA-256 fingerprint locally. File contents are not uploaded or saved, and fingerprints are not anchored on Midnight.</p></div>
                <label className="upload-zone" htmlFor="evidence-files"><Upload size={20} /><strong>Select evidence files</strong><span>PDF, JPG, PNG, or TXT. Up to 5 files, 8 MB each.</span><input id="evidence-files" type="file" accept="application/pdf,image/jpeg,image/png,text/plain" multiple onChange={handleFiles} disabled={evidence.length >= 5} /></label>
                {evidence.length > 0 ? <ul className="evidence-list">{evidence.map((item) => <li key={item.id}><div className="evidence-file-icon"><FileText size={17} /></div><div className="evidence-file-info"><strong>{item.name}</strong><span>{(item.size / 1024).toFixed(1)} KB · SHA-256 {item.sha256.slice(0, 16)}…</span></div><button type="button" className="remove-button" aria-label={`Remove ${item.name}`} onClick={() => setEvidence((current) => current.filter((file) => file.id !== item.id))}><Trash2 size={16} /></button></li>)}</ul> : <p className="empty-evidence">No evidence selected. You can continue without attachments.</p>}
                <details className="privacy-detail"><summary>What does a file fingerprint prove?</summary><p>A hash can help detect whether the exact same file changes later. By itself, it does not prove when a file existed, who created it, or that it is authentic.</p></details>
              </>}

              {step === 'review' && <>
                <div className="review-banner"><ShieldCheck size={18} /><span>Review the details before creating a local-only demo receipt.</span></div>
                <dl className="review-list">
                  <div><dt>Concern type</dt><dd>{category} <button type="button" onClick={() => goToStep('concern')}>Edit</button></dd></div>
                  <div><dt>Support requested</dt><dd>{severity}</dd></div>
                  <div><dt>Description</dt><dd className="review-details">{details || 'No description provided.'}</dd></div>
                  <div><dt>Context</dt><dd>{[area, ongoing ? 'Ongoing' : timeframe, relationship, location].filter(Boolean).join(' · ') || 'No optional context added'} <button type="button" onClick={() => goToStep('context')}>Edit</button></dd></div>
                  <div><dt>Impact</dt><dd>{impacts.join(', ') || 'Not specified'}</dd></div>
                  <div><dt>Preferred outcome</dt><dd>{outcomes.join(', ') || 'Not specified'}</dd></div>
                  <div><dt>Evidence</dt><dd>{evidence.length ? `${evidence.length} file fingerprint${evidence.length === 1 ? '' : 's'} calculated locally` : 'None attached'} <button type="button" onClick={() => goToStep('evidence')}>Edit</button></dd></div>
                </dl>
                <label className="consent-row"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} /><span className="custom-check"><Check size={13} /></span><span>I understand this is a prototype, nothing will be transmitted, and I have used fictional details only.</span></label>
              </>}

              {formError && <div className="form-error" role="alert"><CircleAlert size={16} /><span>{formError}</span><button type="button" aria-label="Dismiss message" onClick={() => setFormError('')}><X size={14} /></button></div>}

              <div className="form-actions">
                {stepIndex > 0 && <button className="back-button" type="button" onClick={previousStep}><ArrowLeft size={16} /> Back</button>}
                {step !== 'review' ? <button className="submit-button" type="button" onClick={nextStep} disabled={step === 'concern' && (details.trim().length < 20 || foundPII)}>Continue <ArrowRight size={17} /></button> : <button className="submit-button" type="submit" disabled={!acknowledged}>Create local demo receipt <ArrowRight size={17} /></button>}
              </div>
              <p className="submit-caption"><LockKeyhole size={13} /> Draft data is held in memory and cleared when you refresh.</p>
            </form>
          </section>}

          {view === 'receipt' && receipt && <section className="form-panel receipt-panel" aria-labelledby="receipt-heading">
            <div className="receipt-symbol"><Check size={26} /></div>
            <span className="step-kicker">LOCAL DEMO RECEIPT · {receipt.createdAt}</span>
            <h2 id="receipt-heading">Nothing was sent.</h2>
            <p className="receipt-copy">Your report was not transmitted, encrypted, stored, or anchored on-chain. This reference exists only in this browser tab.</p>
            <div className="reference-box"><div><span>YOUR TEMPORARY REFERENCE</span><strong>{receipt.reference}</strong></div><button type="button" onClick={() => copyText(receipt.reference)} aria-label="Copy temporary reference" title="Copy reference">{copied ? <Check size={18} /> : <Copy size={18} />}</button></div>
            <dl className="review-list receipt-summary"><div><dt>Concern</dt><dd>{receipt.category} · {receipt.severity}</dd></div><div><dt>Evidence</dt><dd>{receipt.evidence.length} local fingerprint{receipt.evidence.length === 1 ? '' : 's'}</dd></div></dl>
            <div className="receipt-warning"><CircleAlert size={17} /><span>This reference has no connected inbox and is lost when you refresh. Do not use it for a real concern.</span></div>
            <div className="form-actions"><button className="back-button" onClick={showReport}><ArrowLeft size={16} /> Return to report</button><button className="submit-button" onClick={() => window.print()}>Print this receipt <FileText size={16} /></button></div>
            <button className="text-button clear-button" onClick={resetDraft}><Trash2 size={15} /> Clear this demo from the page</button>
          </section>}

          {view === 'followup' && <section className="form-panel followup-panel" aria-labelledby="followup-heading">
            <div className="panel-heading"><div><span className="step-kicker">FOLLOW-UP INBOX</span><h2 id="followup-heading">Check for a reply</h2></div><span className="panel-icon"><MessageCircle size={19} /></span></div>
            <p className="followup-copy">A live service would use a private reference for encrypted reviewer messages. This demo has no server or reviewer inbox.</p>
            <label className="field-label" htmlFor="reference-code">Report reference</label>
            <input className="reference-input" id="reference-code" value={referenceInput} onChange={(event) => { setReferenceInput(event.target.value.toUpperCase()); setLookupAttempted(false) }} placeholder="WG-XXXXXXXX" autoComplete="off" maxLength={11} />
            <button className="submit-button" type="button" disabled={!referenceInput.trim()} onClick={() => setLookupAttempted(true)}>Check demo inbox <ArrowRight size={17} /></button>
            {lookupAttempted && <div className="inbox-unavailable" role="status"><CircleAlert size={17} /><p><strong>{receipt?.reference === referenceInput ? 'This receipt has no reviewer messages.' : 'No report was found in this tab.'}</strong><br />References and reports are not stored by this prototype.</p></div>}
            <p className="submit-caption"><LockKeyhole size={13} /> No account or contact details are requested.</p>
          </section>}
        </div>

        <aside className="side-column">
          <section className="principles-panel">
            <div className="side-heading"><span>THE WHISPERGUARD APPROACH</span><ShieldCheck size={18} /></div>
            <h2>Built around the person reporting.</h2>
            <div className="principle-list">
              <div className="principle"><span className="principle-number">01</span><div><strong>Prove eligibility privately</strong><p>Planned: prove a valid work credential without sharing a name.</p></div></div>
              <div className="principle"><span className="principle-number">02</span><div><strong>Keep a verifiable record</strong><p>Planned: timestamped evidence hashes, not public copies of sensitive files.</p></div></div>
              <div className="principle"><span className="principle-number">03</span><div><strong>Stay in the conversation</strong><p>Planned: encrypted follow-up with an independent reviewer, without an account.</p></div></div>
            </div>
            <div className="planned-label"><span /> Product direction, not active protections</div>
          </section>

          <details className="safety-panel privacy-detail"><summary><span className="safety-icon"><CircleAlert size={18} /></span><span><strong>Need help right now?</strong><small>Open urgent support guidance</small></span></summary><p>WhisperGuard is not an emergency service. If someone is in immediate danger, contact local emergency support or a trusted person nearby.</p></details>
          <details className="safety-panel privacy-detail"><summary><span className="safety-icon"><LockKeyhole size={18} /></span><span><strong>What is planned privacy tech?</strong><small>Understand the current limits</small></span></summary><p>Zero-knowledge credentials, Midnight contracts, encrypted messaging, and reviewer verification are not implemented in this prototype.</p></details>
          <button className="quiet-button" onClick={resetDraft}><Trash2 size={15} /> Clear report draft</button>
        </aside>
      </section>
    </main>

    <footer className="footer"><span>WHISPERGUARD <i>·</i> CONCEPT PREVIEW</span><span>No real reports are collected by this page.</span></footer>
  </div>
}

export default App