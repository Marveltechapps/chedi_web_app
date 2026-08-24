import { styleObj } from '../../logic/styleObj.js'
import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'
import ProgressTimeline from '../ui/ProgressTimeline.jsx'

export default function DeliveriesTab({ app }) {
  return (
    <div className="ch-fade-slow">
      {app.noPlot && (
        <>
          <div className="ch-welcome-banner" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26, marginBottom: 20 }}>
            <div style={{ flex: '0 0 60px', height: 60, borderRadius: 6, background: 'repeating-linear-gradient(45deg,#dbe1d1,#dbe1d1 7px,#e6ebdd 7px,#e6ebdd 14px)', border: '1px solid #cdd5be' }} />
            <div className="ch-welcome-copy">
              <div style={{ fontFamily: "'Newsreader',serif", fontSize: 20, color: '#1c3b2c' }}>Welcome basket · in transit</div>
              <div style={{ fontSize: 13, color: '#6f7566' }}>Your complimentary sample box arrives {app.welcomeEta}.</div>
            </div>
            <div className="ch-welcome-meta">
              <Badge tone="amber">In transit</Badge>
              <Button variant="link" onClick={app.openWelcome} style={{ fontSize: 13 }}>Track basket →</Button>
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px dashed #c3bba6', borderRadius: 8, padding: 48, textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: 0 }}>Weekly deliveries start after you lease a plot.</h3>
            <Button variant="primary" style={{ marginTop: 20, padding: '14px 28px', fontSize: 15 }} onClick={app.goPlots}>Browse plots →</Button>
          </div>
        </>
      )}

      {app.hasPlotV && (
        <div>
          {app.multiPlot && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6f7566', marginRight: 4 }}>Tracking:</span>
              {app.plotSwitch.map((p, i) => (
                <button key={i} type="button" onClick={p.onClick} className="ch-btn" style={styleObj(p.style)}>{p.name}</button>
              ))}
            </div>
          )}
          <div className="ch-grid ch-grid-deliveries" style={{ gap: 20, alignItems: 'start' }}>
            <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26 }}>
              <div className="ch-page-head">
                <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: 0 }}>This week's delivery</h3>
                <Badge tone="amber" style={{ padding: '4px 10px' }}>Out for delivery soon</Badge>
              </div>
              <div style={{ marginTop: 24 }}>
                <ProgressTimeline steps={app.deliverySteps} />
              </div>
              <div style={{ background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: '14px 16px', fontSize: 13, color: '#4b5142' }}>
                Delivered in recyclable kraft packaging — no plastic. Harvested within 24 hours.
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26 }}>
              <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: '0 0 4px' }}>In your basket</h3>
              <p style={{ fontSize: 13, color: '#6f7566', margin: '0 0 18px' }}>Staples (up to 3kg) + 7 seasonal varieties (up to 7kg)</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {app.basket.map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #efe9db' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 4, overflow: 'hidden', border: '1px solid #cdd5be' }}>
                        <img src={b.img} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <span style={{ fontSize: 14, color: '#1c3b2c', fontWeight: 500 }}>{b.name}</span>
                    </div>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: '#6f7566' }}>{b.qty}</span>
                  </div>
                ))}
              </div>
              <div style={{ width: '100%', marginTop: 20, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: '12px 14px', fontSize: 13, color: '#4b5142' }}>
                Manage or cancel upcoming deliveries from the schedule below.
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 24 }}>
            <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 20, color: '#1c3b2c', margin: '0 0 4px' }}>Upcoming schedule</h3>
            <p style={{ fontSize: 13, color: '#6f7566', margin: '0 0 16px' }}>You can cancel a future delivery up to 2 weeks in advance. The next two weeks are locked as they're already being harvested.</p>
            <div className="ch-grid ch-grid-4" style={{ gap: 12 }}>
              {app.schedule.map((w, i) => (
                <div key={i} style={styleObj(w.cardStyle)}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#b98a2e' }}>{w.label}</div>
                  <div style={{ fontSize: 15, color: '#1c3b2c', fontWeight: 600, marginTop: 4 }}>{w.date}</div>
                  <div style={{ fontSize: 12, color: '#6f7566', marginTop: 2 }}>{w.note}</div>
                  <button type="button" disabled={w.locked} onClick={w.onCancel} className="ch-btn" style={styleObj(w.btnStyle)}>{w.btnLabel}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
