import Button from '../../ui/Button.jsx'

export default function PlotDone({ app }) {
  if (app.leaseAwaitingPayment) {
    return (
      <div className="ch-fade" style={{ maxWidth: 640, background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 44, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f7ecd4', border: '1px solid #e6d3a4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 30, color: '#8a5a12' }}>…</div>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 30, color: '#1c3b2c', margin: '22px 0 0' }}>Waiting for your plan activation</h3>
        <p style={{ fontSize: 15, color: '#4b5142', margin: '12px 0 0' }}>
          Request {app.pendingPaymentRef || ''} for {app.pendingPlanName || 'your plan'} on {app.selPlotName} is with the admin team. You cannot book this plan again until they collect payment and activate it.
        </p>
        <div className="ch-actions" style={{ justifyContent: 'center', marginTop: 26 }}>
          <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }} onClick={app.goPlots}>Back to plots</Button>
          <Button variant="outline" style={{ padding: '14px 24px', fontSize: 15 }} onClick={app.goOverview}>Overview</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="ch-fade" style={{ maxWidth: 640, background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 44, textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef2e9', border: '1px solid #cdd5be', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 30, color: '#2e5a41' }}>✓</div>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 30, color: '#1c3b2c', margin: '22px 0 0' }}>Your plot is active.</h3>
      <p style={{ fontSize: 15, color: '#4b5142', margin: '12px 0 0' }}>
        {app.selPlotName} is leased to your family and our farmers are starting cultivation. Your first weekly delivery is scheduled — track it any time.
      </p>
      <div className="ch-actions" style={{ justifyContent: 'center', marginTop: 26 }}>
        <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }} onClick={app.goMyPlot}>View my plot</Button>
        <Button variant="outline" style={{ padding: '14px 24px', fontSize: 15 }} onClick={app.goDeliveries}>See delivery schedule</Button>
      </div>
    </div>
  )
}
