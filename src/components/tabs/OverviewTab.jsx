import Button from '../ui/Button.jsx'
import Badge from '../ui/Badge.jsx'

export default function OverviewTab({ app }) {
  return (
    <div className="ch-fade-slow">
      {/* Welcome basket (all members) */}
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <div style={{ flex: '0 0 74px', height: 74, borderRadius: 6, overflow: 'hidden', border: '1px solid #cdd5be' }}>
          <img src={app.welcomeImg} alt="Welcome basket" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#b98a2e', letterSpacing: '.06em' }}>WELCOME GIFT · INCLUDED WITH ₹500</div>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 22, color: '#1c3b2c', marginTop: 3 }}>Your complimentary welcome basket is on its way</div>
          <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>Seasonal vegetable sample box · arriving {app.welcomeEta}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <Badge tone="amber">In transit</Badge>
          <Button variant="link" onClick={app.openWelcome} style={{ fontSize: 13 }}>Track basket →</Button>
        </div>
      </div>

      {app.noPlot && (
        <div style={{ background: 'linear-gradient(150deg,#22432f,#1c3b2c)', borderRadius: 8, padding: 34, color: '#f6f3ea' }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '.14em', color: '#d9b45f', textTransform: 'uppercase' }}>Next step</span>
          <h2 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 32, margin: '12px 0 0' }}>Lease your farm plot to start weekly deliveries.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#b6c1ac', margin: '12px 0 0', maxWidth: 600 }}>
            Choose a 600 sq ft plot, pick a subscription plan for your family size, and we'll begin cultivating right away. Fresh harvest delivered to your door every week.
          </p>
          <div className="ch-grid ch-grid-3" style={{ gap: 14, margin: '26px 0' }}>
            {app.leaseTeaser.map((t) => (
              <div key={t.n} style={{ background: 'rgba(246,243,234,.06)', border: '1px solid #3a5545', borderRadius: 6, padding: 16 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#d9b45f' }}>{t.n}</div>
                <div style={{ fontSize: 14, color: '#e6ebdd', marginTop: 8, lineHeight: 1.4 }}>{t.t}</div>
              </div>
            ))}
          </div>
          <Button variant="gold" style={{ padding: '15px 30px', fontSize: 16, fontWeight: 700 }} onClick={app.goPlots}>
            Browse plots &amp; lease →
          </Button>
        </div>
      )}

      {app.hasPlotV && (
        <div>
          <div className="ch-grid ch-grid-hero" style={{ gap: 20 }}>
            <div style={{ background: '#1c3b2c', borderRadius: 8, overflow: 'hidden', position: 'relative', minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <img src={app.heroPlotImg} alt="Your plot" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#cdd5c4', background: 'rgba(28,59,44,.7)', padding: '5px 9px', borderRadius: 2 }}>
                real photo · your plot, this week
              </span>
              <div style={{ position: 'relative', padding: 24, background: 'linear-gradient(transparent,rgba(20,42,31,.85))' }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#d9b45f', letterSpacing: '.08em' }}>{app.plotName} · {app.plotSizeLabel}</div>
                <div style={{ fontFamily: "'Newsreader',serif", fontSize: 28, color: '#f6f3ea', marginTop: 6 }}>Your plot is thriving</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#b98a2e', letterSpacing: '.06em' }}>NEXT DELIVERY</div>
                <div style={{ fontFamily: "'Newsreader',serif", fontSize: 26, color: '#1c3b2c', marginTop: 6 }}>Saturday, 25 Jul</div>
                <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>~8–10 kg · 9 varieties this week</div>
                <Button variant="outline" style={{ marginTop: 14, padding: '9px 16px', fontSize: 13 }} onClick={app.goDeliveries}>Track delivery</Button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>What's growing now</h3>
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#6f7566' }}>July 2026</span>
            </div>
            <div className="ch-grid ch-grid-6" style={{ gap: 14, marginTop: 18 }}>
              {app.growing.map((g) => (
                <div key={g.name} style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ height: 78, overflow: 'hidden' }}>
                    <img src={g.img} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1c3b2c' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: '#6f7566' }}>{g.stage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 8, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 20, color: '#1c3b2c', margin: 0 }}>Feeding a bigger family?</h3>
              <p style={{ fontSize: 14, color: '#4b5142', margin: '5px 0 0' }}>Lease another plot — it runs as its own subscription with a separate cycle.</p>
            </div>
            <Button variant="primary" style={{ flex: '0 0 auto', padding: '13px 24px', fontSize: 15 }} onClick={app.leaseAnother}>
              Browse plots →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
