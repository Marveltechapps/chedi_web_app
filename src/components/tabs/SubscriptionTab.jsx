import { styleObj } from '../../logic/styleObj.js'
import Button from '../ui/Button.jsx'
import DataRow from '../ui/DataRow.jsx'
import Icon from '../icons/Icon.jsx'

export default function SubscriptionTab({ app }) {
  return (
    <div className="ch-fade-slow" style={{ maxWidth: 760 }}>
      {/* membership card */}
      <div style={{ background: 'linear-gradient(150deg,#2a4a38,#1c3b2c)', border: '1px solid #3a5545', borderRadius: 10, padding: 26, boxShadow: '0 20px 50px -28px rgba(0,0,0,.6)', marginBottom: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 22, fontWeight: 600, letterSpacing: '.12em', color: '#f6f3ea' }}>CHEDI</div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#d9b45f', letterSpacing: '.08em', textAlign: 'right' }}>FARM CLUB<br />MEMBER</div>
        </div>
        <div style={{ height: 30 }} />
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, letterSpacing: '.16em', color: '#cdd5c4' }}>•••• •••• •••• {app.memberId}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: '#8fa389', letterSpacing: '.1em' }}>MEMBER</div>
            <div style={{ fontSize: 15, color: '#f6f3ea', fontWeight: 600 }}>{app.displayName}</div>
          </div>
          <div style={{ fontSize: 12, color: '#8fa389' }}>Member since Jul 2026</div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: 0 }}>{app.subHeading}</h3>
          {app.hasPlotV && (
            <Button variant="outline" style={{ padding: '9px 16px', fontSize: 13 }} onClick={app.leaseAnother}>+ Lease another plot</Button>
          )}
        </div>

        {app.hasPlotV && (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 13, color: '#6f7566', margin: '0 0 16px' }}>Each plot is a separate subscription with its own cycle and renewal bill.</p>
            {app.subCards.map((c) => (
              <div key={c.id} style={styleObj(c.cardStyle)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontFamily: "'Newsreader',serif", fontSize: 20, color: '#1c3b2c' }}>{c.title}</span>
                      {c.isActive && (
                        <span style={{ fontSize: 10, background: '#eef2e9', color: '#2e5a41', border: '1px solid #cdd5be', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>VIEWING</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>{c.sub}</div>
                  </div>
                  <Button variant="outline-dark" style={{ padding: '7px 14px', fontSize: 12 }} onClick={c.onView}>View plot</Button>
                </div>
                <div style={{ marginTop: 14 }}>
                  {c.rows.map((r, i) => <DataRow key={i} k={r.k} v={r.v} />)}
                </div>
                {(c.billPaid || c.canRequestPayment) && (
                  <div style={{ marginTop: 16, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 13, color: '#4b5142' }}>Renewal bill for this cycle</div>
                    <button
                      type="button"
                      onClick={c.onPayBill}
                      disabled={Boolean(c.billPaid)}
                      className="ch-btn"
                      style={styleObj(c.payStyle)}
                    >{c.payLabel}</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {app.noPlot && (
          <div style={{ marginTop: 10 }}>
            <p style={{ fontSize: 15, color: '#6f7566', margin: '0 0 18px' }}>You're a member, but no plot is leased yet. Lease a plot to start an annual subscription.</p>
            <Button variant="primary" style={{ padding: '14px 28px', fontSize: 15 }} onClick={app.goPlots}>Browse plots →</Button>
          </div>
        )}
      </div>

      {/* payment history */}
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28, marginTop: 20 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 20, color: '#1c3b2c', margin: '0 0 14px' }}>Payment history</h3>
        {!app.payments.length && (
          <p style={{ fontSize: 14, color: '#6f7566', margin: 0 }}>No completed payments yet.</p>
        )}
        {app.payments.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #efe9db', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, color: '#1c3b2c', fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: '#6f7566' }}>{p.date} · {p.ref}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontFamily: "'Newsreader',serif", fontSize: 18, color: '#1c3b2c' }}>{p.amount}</div>
              <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', fontSize: 12 }} onClick={p.onReceipt}>
                <Icon name="download" stroke="#1c3b2c" size={13} strokeWidth={1.8} />
                Receipt
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
