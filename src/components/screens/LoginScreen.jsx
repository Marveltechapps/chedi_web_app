import Button from '../ui/Button.jsx'
import TextField from '../ui/TextField.jsx'
import Icon from '../icons/Icon.jsx'
import { styleObj } from '../../logic/styleObj.js'

export default function LoginScreen({ app }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#eef2e9', display: 'flex', flexDirection: 'column' }}>
      <div className="ch-auth-header">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Newsreader',serif", fontSize: 24, fontWeight: 600, letterSpacing: '.14em', color: '#1c3b2c' }}>CHEDI</span>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '.14em', color: '#b98a2e', textTransform: 'uppercase' }}>CSA Member App</span>
        </div>
      </div>
      <div className="ch-auth-body">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <h2 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 32, color: '#1c3b2c', margin: 0 }}>Welcome back</h2>
            <p style={{ fontSize: 15, color: '#6f7566', margin: '8px 0 0' }}>Log in to your Farm Club account.</p>
          </div>
          <div className="ch-fade" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, padding: 32 }}>
            {app.otpStepEmail && (
              <div>
                <TextField
                  label="Registered email address"
                  value={app.login.email}
                  onChange={app.onLoginEmail}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  error={app.otpError}
                />
                <Button variant="primary" style={{ width: '100%', marginTop: 20, padding: 15, fontSize: 16 }} onClick={app.sendOtp} disabled={app.actionLoading}>
                  {app.actionLoading ? 'Sending…' : 'Send OTP'}
                </Button>
              </div>
            )}
            {app.otpStepCode && (
              <div>
                <div style={{ fontSize: 14, color: '#4b5142', marginBottom: 14 }}>
                  We sent a 4-digit code to <span style={{ color: '#1c3b2c', fontWeight: 600 }}>{app.otpTarget}</span>.{' '}
                  <Button variant="link" onClick={app.backToEmail} style={{ fontSize: 14 }}>Change</Button>
                </div>
                <div style={{ background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 5, padding: '10px 12px', fontSize: 12, color: '#3a5140', marginBottom: 16 }}>
                  Check your inbox for the 4-digit code. It may take a few seconds to arrive.
                </div>
                <label className="ch-field-label">Enter OTP</label>
                <input
                  className="ch-field-input"
                  value={app.login.otp}
                  onChange={app.onLoginOtp}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  style={styleObj(app.otpInputStyle)}
                />
                {app.otpError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, fontSize: 13, color: '#b0361f' }}>
                    <Icon name="alert" stroke="#b0361f" size={15} strokeWidth={1.8} />
                    <span>{app.otpError}</span>
                  </div>
                )}
                {app.otpNotice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, fontSize: 13, color: '#2e5a41' }}>
                    <Icon name="check" stroke="#2e5a41" size={15} strokeWidth={1.8} />
                    <span>{app.otpNotice}</span>
                  </div>
                )}
                <button
                  type="button"
                  disabled={app.otpLocked}
                  onClick={app.doLogin}
                  className="ch-btn"
                  style={styleObj(app.verifyStyle)}
                >
                  {app.actionLoading ? 'Verifying…' : 'Verify & log in'}
                </button>
                <div style={{ textAlign: 'center', fontSize: 13, color: '#9aa08d', marginTop: 16 }}>
                  {app.resendWaiting && <span>Resend available in {app.resendIn}s</span>}
                  {app.resendReady && (
                    <span>
                      Didn't get it? <Button variant="link" onClick={app.resendOtp} style={{ fontSize: 13 }}>Resend OTP</Button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#6f7566', margin: '22px 0 0' }}>
            New to CHEDI? <Button variant="link" onClick={app.goJoin} style={{ fontSize: 14 }}>Become a member — ₹500</Button>
          </p>
        </div>
      </div>
    </div>
  )
}
