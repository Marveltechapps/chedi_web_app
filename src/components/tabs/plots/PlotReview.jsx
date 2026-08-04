import Button from '../../ui/Button.jsx'
import DataRow from '../../ui/DataRow.jsx'
import Icon from '../../icons/Icon.jsx'

export default function PlotReview({ app }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <Button variant="link-muted" onClick={app.toPlan} style={{ fontSize: 14, marginBottom: 16 }}>← Back to plans</Button>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 26, color: '#1c3b2c', margin: '0 0 18px' }}>Review &amp; activate subscription</h3>
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 24 }}>
        {app.reviewRows.map((r, i) => <DataRow key={i} k={r.k} v={r.v} />)}
        <DataRow k="Total first-year payment" v={app.reviewTotal} total />
      </div>

      <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start', marginTop: 18, padding: 16, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6 }}>
        <span style={{ flex: '0 0 auto', marginTop: 1 }}>
          <Icon name="clock" stroke="#2e5a41" size={20} strokeWidth={1.7} />
        </span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1c3b2c' }}>Manual annual billing</div>
          <div style={{ fontSize: 12, color: '#6f7566' }}>A renewal bill is generated at the end of your plan year. You pay it manually to continue weekly deliveries — no auto-charge.</div>
        </div>
      </div>

      <Button variant="primary" style={{ width: '100%', marginTop: 20, padding: 16, fontSize: 16 }} onClick={app.activateSub}>
        Pay {app.reviewTotal} &amp; activate
      </Button>
    </div>
  )
}
