import Button from '../../ui/Button.jsx'
import TextField from '../../ui/TextField.jsx'
import FormError from '../../ui/FormError.jsx'

export default function AddressPanel({ app }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>Addresses</h3>
        {app.savedAddress && <span style={{ fontSize: 14, color: '#2e5a41', fontWeight: 600 }}>✓ Saved</span>}
      </div>

      {app.addrEditing && (
        <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26, marginBottom: 16 }}>
          <h4 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 19, color: '#1c3b2c', margin: '0 0 4px' }}>{app.addrTitle}</h4>
          <p style={{ fontSize: 13, color: '#6f7566', margin: '0 0 16px' }}>Please select an address within city limits — deliveries are available inside the city only.</p>
          <FormError message={app.addrFormError} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <TextField label="Label" value={app.addrForm.label} onChange={app.onAddrLabel} placeholder="Home / Work" inputStyle={{ padding: '12px 14px' }} />
            <TextField label="Address" value={app.addrForm.line} onChange={app.onAddrLine} placeholder="Flat, street, area" inputStyle={{ padding: '12px 14px' }} error={app.addrErrors?.line} />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 2 }}>
                <TextField label="City" value={app.addrForm.city} onChange={app.onAddrCity} placeholder="Chennai" inputStyle={{ padding: '12px 14px' }} error={app.addrErrors?.city} />
              </div>
              <div style={{ flex: 1 }}>
                <TextField label="PIN" value={app.addrForm.pin} onChange={app.onAddrPin} placeholder="600020" inputStyle={{ padding: '12px 14px' }} error={app.addrErrors?.pin} inputMode="numeric" maxLength={6} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <Button variant="outline" style={{ padding: '12px 22px', fontSize: 14 }} onClick={app.addrCancel}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, padding: 12, fontSize: 15 }} onClick={app.addrSave}>Save address</Button>
          </div>
        </div>
      )}

      {app.addressList.map((a) => (
        <div key={a.id} style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: '20px 22px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ fontSize: 16, color: '#1c3b2c', fontWeight: 700 }}>{a.label}</span>
                {a.def && <span style={{ fontSize: 10, background: '#eef2e9', color: '#2e5a41', border: '1px solid #cdd5be', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>DEFAULT</span>}
              </div>
              <div style={{ fontSize: 14, color: '#4b5142', marginTop: 5 }}>{a.line}</div>
              <div style={{ fontSize: 13, color: '#6f7566' }}>{a.city} · {a.pin}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flex: '0 0 auto' }}>
              <Button variant="outline-muted" style={{ padding: '7px 12px', fontSize: 12 }} onClick={a.onDefault}>Set default</Button>
              <Button variant="outline-dark" style={{ padding: '7px 12px', fontSize: 12 }} onClick={a.onEdit}>Edit</Button>
              <Button variant="danger-outline" style={{ padding: '7px 12px', fontSize: 12 }} onClick={a.onDelete}>Delete</Button>
            </div>
          </div>
        </div>
      ))}

      <Button variant="dashed" style={{ width: '100%', padding: 14, fontSize: 14 }} onClick={app.addrNew}>+ Add a new address</Button>
    </div>
  )
}
