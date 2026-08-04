import { styleObj } from '../../../logic/styleObj.js'
import Button from '../../ui/Button.jsx'
import Toggle from '../../ui/Toggle.jsx'

export default function NotificationsPanel({ app }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28, maxWidth: 600 }}>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: '0 0 6px' }}>Notifications</h3>
      <p style={{ fontSize: 14, color: '#6f7566', margin: '0 0 18px' }}>Choose what you hear about and where.</p>

      {app.notifRows.map((n, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #efe9db' }}>
          <div>
            <div style={{ fontSize: 15, color: '#1c3b2c', fontWeight: 600 }}>{n.label}</div>
            <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>{n.desc}</div>
          </div>
          <Toggle on={n.on} onToggle={n.onToggle} />
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <label style={{ fontSize: 13, color: '#6f7566', fontWeight: 600 }}>Preferred channel</label>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {app.notifChannels.map((c, i) => (
            <button key={i} type="button" onClick={c.onClick} className="ch-btn" style={styleObj(c.style)}>{c.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 22 }}>
        <Button variant="primary" style={{ padding: '13px 30px', fontSize: 15 }} onClick={app.saveNotif}>Save</Button>
        {app.savedNotif && <span style={{ fontSize: 14, color: '#2e5a41', fontWeight: 600 }}>✓ Saved</span>}
      </div>
    </div>
  )
}
