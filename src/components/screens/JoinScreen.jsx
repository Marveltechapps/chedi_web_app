import Button from '../ui/Button.jsx'
import TextField from '../ui/TextField.jsx'
import FormError from '../ui/FormError.jsx'
import Icon from '../icons/Icon.jsx'

export default function JoinScreen({ app }) {
  return (
    <div style={{ minHeight: '100vh', background: '#eef2e9', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 74, borderBottom: '1px solid #dbe0d1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: '#f6f3ea' }}>
        <span style={{ fontFamily: "'Newsreader',serif", fontSize: 24, fontWeight: 600, letterSpacing: '.14em', color: '#1c3b2c' }}>CHEDI</span>
        <button
          type="button"
          onClick={() => {
            window.location.href = 'https://chedi.in/main.html'
          }}
          className="ch-btn-plain"
          style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#6f7566', fontSize: 14 }}
        >
          <Icon name="close" stroke="#6f7566" size={15} strokeWidth={1.8} />
          Cancel
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 34 }}>
            {app.joinProgress.map((s, i) => (
              <div style={{ flex: 1 }} key={i}>
                <div style={{ height: 4, borderRadius: 2, background: s.bar }} />
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: s.color, marginTop: 8, letterSpacing: '.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {app.joinStep1 && (
            <div className="ch-fade" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, padding: 34 }}>
              <h2 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 30, color: '#1c3b2c', margin: 0 }}>Create your Farm Club account</h2>
              <p style={{ fontSize: 15, color: '#6f7566', margin: '8px 0 24px' }}>We'll use these to send your welcome basket and schedule deliveries.</p>
              <FormError message={app.joinFormError} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TextField label="Full name" value={app.form.name} onChange={app.onName} placeholder="Priya Balan" error={app.joinErrors?.name} autoComplete="name" />
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Mobile"
                      value={app.form.phone}
                      onChange={app.onPhone}
                      placeholder="+91 98xxx xxxxx"
                      error={app.joinErrors?.phone}
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      label="Email"
                      value={app.form.email}
                      onChange={app.onEmail}
                      placeholder="you@email.com"
                      error={app.joinErrors?.email}
                      type="email"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <TextField label="Delivery address" value={app.form.address} onChange={app.onAddress} placeholder="Flat, street, neighborhood" error={app.joinErrors?.address} autoComplete="street-address" />
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ flex: 2 }}>
                    <TextField label="City" value={app.form.city} onChange={app.onCity} placeholder="Chennai" error={app.joinErrors?.city} autoComplete="address-level2" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField label="PIN" value={app.form.pin} onChange={app.onPin} placeholder="600020" error={app.joinErrors?.pin} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
                  </div>
                </div>
              </div>
              <Button variant="primary" style={{ width: '100%', marginTop: 24, padding: 16, fontSize: 16 }} onClick={app.nextJoin} disabled={app.actionLoading}>
                {app.actionLoading ? 'Saving…' : 'Continue to payment'}
              </Button>
              <p style={{ textAlign: 'center', fontSize: 14, color: '#6f7566', margin: '18px 0 0' }}>
                Already a member? <Button variant="link" onClick={app.goLogin} style={{ fontSize: 14 }}>Log in</Button>
              </p>
            </div>
          )}

          {app.joinStep2 && (
            <div className="ch-fade" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, padding: 34 }}>
              <h2 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 30, color: '#1c3b2c', margin: 0 }}>Membership payment</h2>
              <p style={{ fontSize: 15, color: '#6f7566', margin: '8px 0 24px' }}>₹500 membership is collected offline. Submit a payment request and our team will email you to complete payment.</p>
              <div style={{ background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 5, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 15, color: '#3a4033' }}>
                  <span>Farm Club membership (one-time)</span><span style={{ fontWeight: 600 }}>₹500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, color: '#2e5a41', fontWeight: 600 }}>
                  <span>Complimentary welcome basket · 5&nbsp;kg fresh vegetables</span><span>Included</span>
                </div>
                <div style={{ height: 1, background: '#cdd5be', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, color: '#1c3b2c', fontWeight: 700 }}>
                  <span>Total due</span><span>₹500</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <Button variant="outline" style={{ padding: '15px 24px', fontSize: 15 }} onClick={app.prevJoin}>Back</Button>
                <Button variant="primary" style={{ flex: 1, padding: 15, fontSize: 16 }} onClick={app.payMembership} disabled={app.actionLoading}>
                  Request payment — ₹500
                </Button>
              </div>
            </div>
          )}

          {app.joinStep3 && (
            <div className="ch-fade" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, padding: 44, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef2e9', border: '1px solid #cdd5be', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 30, color: '#2e5a41' }}>✓</div>
              <h2 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 32, color: '#1c3b2c', margin: '22px 0 0' }}>Payment request sent</h2>
              <p style={{ fontSize: 16, color: '#4b5142', margin: '12px 0 0' }}>
                Our admin team will email <strong>{app.form.email}</strong> to collect your ₹500 membership fee. Once marked Paid, log in with that email and OTP to open your dashboard.
              </p>
              <Button variant="primary" style={{ padding: '16px 34px', fontSize: 16, marginTop: 26 }} onClick={app.goLogin}>
                Go to login →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
