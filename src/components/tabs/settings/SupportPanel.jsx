import { styleObj } from '../../../logic/styleObj.js'

export default function SupportPanel({ app }) {
  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: '0 0 12px' }}>Help topics</h3>
        {app.supportRows.map((r, i) => (
          <div key={i} style={{ borderBottom: '1px solid #efe9db' }}>
            <button
              type="button"
              onClick={r.onToggle}
              className="ch-btn-plain"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', padding: '14px 0' }}
            >
              <span style={{ fontSize: 15, color: '#1c3b2c' }}>{r.label}</span>
              <span style={{ fontSize: 20, color: '#b98a2e', flex: '0 0 auto' }}>{r.icon}</span>
            </button>
            {r.open && <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4b5142', margin: '0 0 16px', paddingRight: 20 }}>{r.body}</p>}
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 26 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: '0 0 12px' }}>Contact &amp; legal</h3>
        {app.supportContacts.map((r, i) => (
          <button key={i} type="button" onClick={r.onClick} className="ch-btn" style={styleObj(r.rowStyle)}>
            <span style={{ fontSize: 15, color: '#1c3b2c' }}>{r.label}</span>
            <span style={{ fontSize: 13, color: '#6f7566' }}>{r.meta}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
