import Button from '../../ui/Button.jsx'
import TextField from '../../ui/TextField.jsx'
import FormError from '../../ui/FormError.jsx'

export default function SecurityPanel({ app }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28, maxWidth: 600 }}>
      <div className="ch-page-head" style={{ marginBottom: 6 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>Login &amp; security</h3>
        {app.savedSecurity && <span style={{ fontSize: 14, color: '#2e5a41', fontWeight: 600 }}>✓ Updated</span>}
      </div>
      <p style={{ fontSize: 14, color: '#6f7566', margin: '0 0 20px' }}>You log in with a one-time code sent to your registered email. You can also update the mobile number on your account.</p>

      {app.secIdle && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #e4ded0', borderRadius: 6, background: '#faf8f2', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: '#6f7566' }}>Login email</div>
              <div style={{ fontSize: 16, color: '#1c3b2c', fontWeight: 600, marginTop: 2 }}>{app.form.email || '—'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #e4ded0', borderRadius: 6, background: '#faf8f2', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: '#6f7566' }}>Registered mobile</div>
              <div style={{ fontSize: 16, color: '#1c3b2c', fontWeight: 600, marginTop: 2 }}>{app.secMobile}</div>
            </div>
            <Button variant="outline" style={{ padding: '10px 18px', fontSize: 14 }} onClick={app.secStart}>Change number</Button>
          </div>
        </div>
      )}

      {app.secEnter && (
        <div>
          <TextField
            label="New mobile number"
            value={app.secNewMobile}
            onChange={app.onSecNew}
            placeholder="+91 98xxx xxxxx"
            inputStyle={{ padding: '12px 14px' }}
            error={app.secError}
            inputMode="tel"
            autoComplete="tel"
          />
          <div className="ch-actions" style={{ marginTop: 16 }}>
            <Button variant="outline" style={{ padding: '11px 20px', fontSize: 14 }} onClick={app.secCancel}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, padding: 11, fontSize: 14 }} onClick={app.secSend}>Send OTP</Button>
          </div>
        </div>
      )}

      {app.secOtpStep && (
        <div>
          <FormError message={app.secError} />
          <div style={{ fontSize: 14, color: '#4b5142', marginBottom: 12 }}>
            Enter the code sent to your login email
            {app.form?.email ? (
              <>
                {' '}
                (<span style={{ color: '#1c3b2c', fontWeight: 600 }}>{app.form.email}</span>)
              </>
            ) : null}{' '}
            to confirm <span style={{ color: '#1c3b2c', fontWeight: 600 }}>{app.secNewMobile}</span>.
          </div>
          <input
            className="ch-field-input"
            value={app.secOtp}
            onChange={app.onSecOtp}
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            style={{ margin: 0, fontSize: 18, letterSpacing: '.3em', textAlign: 'center' }}
          />
          <div className="ch-actions" style={{ marginTop: 16 }}>
            <Button variant="outline" style={{ padding: '11px 20px', fontSize: 14 }} onClick={app.secCancel}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, padding: 11, fontSize: 14 }} onClick={app.secVerify}>Verify &amp; update</Button>
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid #efe9db', marginTop: 24, paddingTop: 20 }}>
        <div style={{ fontSize: 15, color: '#1c3b2c', fontWeight: 600 }}>Active session</div>
        <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>This device · Chennai · just now</div>
        <Button variant="outline" style={{ marginTop: 14, padding: '11px 20px', fontSize: 14 }} onClick={app.logoutAll}>Log out of all devices</Button>
      </div>
    </div>
  )
}
