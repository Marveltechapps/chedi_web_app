import Button from '../../ui/Button.jsx'
import DataRow from '../../ui/DataRow.jsx'
import Badge from '../../ui/Badge.jsx'

export default function PlotDetail({ app }) {
  const pending = app.leasePlanPending

  return (
    <div>
      <Button variant="link-muted" onClick={app.backToList} style={{ fontSize: 14, marginBottom: 16 }}>← Back to plots</Button>
      <div className="ch-grid ch-grid-detail" style={{ gap: 20, alignItems: 'start' }}>
        <div>
          <div style={{ height: 300, borderRadius: 8, overflow: 'hidden', position: 'relative', border: '1px solid #cdd5be' }}>
            <img src={app.selPlotImg} alt={app.selPlotName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#fff', background: 'rgba(28,59,44,.7)', padding: '5px 9px', borderRadius: 2 }}>
              {app.selPlotName} · wide view
            </span>
          </div>
          <div className="ch-grid ch-grid-4" style={{ gap: 12, marginTop: 12 }}>
            {app.plotGallery.map((g, i) => (
              <div key={i} style={{ height: 82, borderRadius: 6, overflow: 'hidden', border: '1px solid #cdd5be' }}>
                <img src={g.img} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 24 }}>
          <Badge tone={pending ? 'amber' : 'green'} style={{ borderRadius: 20, display: 'inline-block' }}>
            {pending ? 'Awaiting activation' : 'Available now'}
          </Badge>
          <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 26, color: '#1c3b2c', margin: '14px 0 0' }}>{app.selPlotName}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
            {app.selPlotFacts.map((f, i) => <DataRow key={i} k={f.k} v={f.v} />)}
          </div>
          {pending && (
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#f7ecd4', border: '1px solid #e6d3a4', borderRadius: 6, fontSize: 13, fontWeight: 600, color: '#8a5a12', lineHeight: 1.45 }}>
              Waiting for your plan activation
            </div>
          )}
          <Button variant="primary" style={{ width: '100%', marginTop: 20, padding: 15, fontSize: 15 }} onClick={app.toPlan}>
            {pending ? 'View plan status →' : 'Lease this plot →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
