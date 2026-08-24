import { styleObj } from '../../../logic/styleObj.js'
import Button from '../../ui/Button.jsx'

function ShareTable({ eyebrow, title, desc, rows, note }) {
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '.14em', color: '#b98a2e', textTransform: 'uppercase' }}>{eyebrow}</div>
      <h4 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: '6px 0 2px' }}>{title}</h4>
      <p style={{ fontSize: 14, color: '#6f7566', margin: '0 0 16px' }}>{desc}</p>
      <div className="ch-share-table" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', background: '#eef2e9', padding: '12px 18px', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '.06em', color: '#6f7566', textTransform: 'uppercase', borderBottom: '1px solid #dbe0d1' }}>
          <span style={{ flex: '0 0 40px' }}>#</span>
          <span style={{ flex: 1 }}>Vegetable</span>
          <span style={{ flex: '0 0 120px', textAlign: 'right' }}>Quantity</span>
        </div>
        {rows.map((v) => (
          <div key={v.no} style={styleObj(v.rowStyle)}>
            <span style={{ flex: '0 0 40px', color: '#9aa08d' }}>{v.no}</span>
            <span style={{ flex: 1, color: '#1c3b2c', fontWeight: 500 }}>{v.name}</span>
            <span style={{ flex: '0 0 120px', textAlign: 'right', color: '#6f7566' }}>{v.qty}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: '14px 16px', fontSize: 14, color: '#4b5142' }}>
        <span style={{ color: '#1c3b2c', fontWeight: 700 }}>Note:</span> {note}
      </div>
    </div>
  )
}

export default function PlotPlan({ app }) {
  const pending = app.leasePlanPending

  return (
    <div>
      <Button variant="link-muted" onClick={pending ? app.backToList : app.toDetail} style={{ fontSize: 14, marginBottom: 16 }}>
        {pending ? '← Back to plots' : `← Back to ${app.selPlotName}`}
      </Button>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 26, color: '#1c3b2c', margin: '0 0 6px' }}>
        {pending ? 'Plan activation pending' : 'Choose a subscription plan'}
      </h3>
      <p style={{ fontSize: 14, color: '#6f7566', margin: '0 0 22px' }}>
        {pending
          ? 'Your payment request is with the admin team. This plan cannot be booked again until they approve and activate it.'
          : 'Larger plans lease additional 600 sq ft plots for bigger families. All add ₹10,000/yr delivery.'}
      </p>

      <div className="ch-grid ch-grid-3" style={{ gap: 18, alignItems: 'start' }}>
        {app.leasePlanCards.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={p.onSelect}
            className="ch-btn"
            style={styleObj(p.cardStyle)}
            disabled={pending}
            aria-disabled={pending}
          >
            {p.featured && !p.awaitingActivation && (
              <div style={{ position: 'absolute', top: -11, left: 22, background: '#b98a2e', color: '#1c3b2c', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '.08em', padding: '4px 11px', borderRadius: 2, textTransform: 'uppercase' }}>
                Most popular
              </div>
            )}
            {p.awaitingActivation && (
              <div style={{ position: 'absolute', top: -11, left: 22, background: '#8a5a12', color: '#fff8e8', fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '.08em', padding: '4px 11px', borderRadius: 2, textTransform: 'uppercase' }}>
                Pending
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: "'Newsreader',serif", fontSize: 21, color: '#1c3b2c' }}>{p.name}</div>
              {!pending && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${p.radio}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {p.checked && <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#1c3b2c' }} />}
                </div>
              )}
            </div>
            <div style={{ fontFamily: "'Newsreader',serif", fontSize: 30, fontWeight: 600, color: '#1c3b2c', marginTop: 12 }}>
              {p.price}<span style={{ fontSize: 14, fontWeight: 400, color: '#6f7566' }}> /yr</span>
            </div>
            <div style={{ fontSize: 13, color: '#6f7566', marginTop: 4 }}>{p.plots} · {p.size}</div>
            {p.awaitingActivation && (
              <div style={{ marginTop: 14, padding: '12px 14px', background: '#f7ecd4', border: '1px solid #e6d3a4', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#8a5a12', lineHeight: 1.45 }}>
                Waiting for your plan activation
              </div>
            )}
            <div style={{ height: 1, background: '#e4ded0', margin: '16px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, fontSize: 13, color: '#3a4033', lineHeight: 1.4 }}>
                  <span style={{ color: '#2e5a41', fontWeight: 700 }}>✓</span><span>{f}</span>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {!pending && (
        <>
          <ShareTable eyebrow="Weekly staples" title="Your weekly share" desc="Fixed every week — the essentials your kitchen needs." rows={app.staplesShare} note="Weekly delivery of up to 3kg of everyday kitchen essentials." />
          <ShareTable eyebrow="Seasonal vegetables" title="What's growing now" desc="Rotates with each season for nutritional variety — your basket changes with nature." rows={app.seasonalShare} note="Weekly delivery of 7 seasonal vegetable varieties, totaling up to 7kg." />

          <Button variant="primary" style={{ marginTop: 22, padding: '15px 30px', fontSize: 16 }} onClick={app.toReview}>
            Continue to review
          </Button>
        </>
      )}

      {pending && (
        <div className="ch-actions" style={{ marginTop: 22 }}>
          <Button variant="primary" style={{ padding: '15px 30px', fontSize: 16 }} onClick={app.goPlots}>
            Back to plots
          </Button>
          <Button variant="outline" style={{ padding: '15px 24px', fontSize: 16 }} onClick={app.goOverview}>
            Overview
          </Button>
        </div>
      )}
    </div>
  )
}
