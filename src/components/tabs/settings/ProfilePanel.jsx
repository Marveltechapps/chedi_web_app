import Button from '../../ui/Button.jsx'
import TextField from '../../ui/TextField.jsx'
import DataRow from '../../ui/DataRow.jsx'
import FormError from '../../ui/FormError.jsx'

export default function ProfilePanel({ app }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div>
          <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: '0 0 6px' }}>Profile</h3>
          <p style={{ fontSize: 14, color: '#6f7566', margin: 0 }}>Your personal details for your Farm Club account.</p>
        </div>
        {app.profView && (
          <Button variant="outline" style={{ flex: '0 0 auto', padding: '9px 18px', fontSize: 14 }} onClick={app.editProfile}>Edit profile</Button>
        )}
      </div>

      {app.profView && (
        <div>
          <DataRow k="Full name" v={app.form.name} style={{ padding: '13px 0', fontSize: 15 }} />
          <DataRow k="Mobile" v={app.form.phone} style={{ padding: '13px 0', fontSize: 15 }} />
          <DataRow k="Email" v={app.form.email} style={{ padding: '13px 0', fontSize: 15, borderBottom: 'none' }} />
          {app.savedProfile && <div style={{ marginTop: 16, fontSize: 14, color: '#2e5a41', fontWeight: 600 }}>✓ Profile updated</div>}
        </div>
      )}

      {app.profEdit && (
        <>
          <FormError message={app.profileFormError} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextField label="Full name" value={app.draftName} onChange={app.onDraftName} placeholder="Your name" inputStyle={{ padding: '12px 14px' }} error={app.draftErrors?.name} />
            <TextField label="Email" value={app.draftEmail} onChange={app.onDraftEmail} type="email" placeholder="you@email.com" inputStyle={{ padding: '12px 14px' }} error={app.draftErrors?.email} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button variant="outline" style={{ padding: '13px 24px', fontSize: 15 }} onClick={app.cancelProfile}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, padding: 13, fontSize: 15 }} onClick={app.submitProfile} disabled={app.actionLoading}>{app.profSaveLabel}</Button>
          </div>
        </>
      )}

      {app.profOtp && (
        <div>
          <FormError message={app.profOtpErr ? (app.profOtpError || 'Incorrect code.') : ''} />
          <div style={{ fontSize: 14, color: '#4b5142', marginBottom: 12 }}>
            Enter the code sent to <span style={{ color: '#1c3b2c', fontWeight: 600 }}>{app.draftPhone}</span> to confirm your new number.
          </div>
          <input
            className="ch-field-input"
            value={app.profOtpVal}
            onChange={app.onProfOtp}
            inputMode="numeric"
            maxLength={4}
            placeholder="••••"
            style={{ margin: 0, fontSize: 18, letterSpacing: '.3em', textAlign: 'center', background: app.profOtpErr ? '#fdf1ed' : '#faf8f2', borderColor: app.profOtpErr ? '#d38b78' : undefined }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <Button variant="outline" style={{ padding: '12px 22px', fontSize: 14 }} onClick={app.cancelProfile}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, padding: 12, fontSize: 15 }} onClick={app.verifyProfile}>Verify &amp; save changes</Button>
          </div>
        </div>
      )}
    </div>
  )
}
