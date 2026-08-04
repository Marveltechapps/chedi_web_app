import './layout.css'
import { styleObj } from '../../logic/styleObj.js'

export default function Sidebar({ app }) {
  return (
    <aside className="ch-sidebar" style={{ width: 246, flex: '0 0 246px', background: '#1c3b2c', height: '100vh', padding: '26px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 8px 22px', borderBottom: '1px solid #2f4c3c' }}>
        <div style={{ fontFamily: "'Newsreader',serif", fontSize: 24, fontWeight: 600, letterSpacing: '.14em', color: '#f6f3ea' }}>CHEDI</div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#d9b45f', letterSpacing: '.08em', marginTop: 2 }}>CSA MEMBER APP</div>
      </div>

      <nav className="ch-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 20 }}>
        {app.appNav.map((n, i) => (
          <button key={i} type="button" onClick={n.onClick} style={styleObj(n.style)}>
            {n.iconEl}
            <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
            {n.dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d9b45f' }} />}
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '16px 8px 0', borderTop: '1px solid #2f4c3c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'repeating-linear-gradient(45deg,#2a4a38,#2a4a38 6px,#335640 6px,#335640 12px)',
              border: '1px solid #3a5545',
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, color: '#f6f3ea', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.displayName}</div>
            <div style={{ fontSize: 11, color: '#8fa389' }}>{app.memberStatus}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={app.askLogout}
          className="ch-sidebar-logout"
          style={{ width: '100%', marginTop: 14, background: 'none', border: '1px solid #3a5545', color: '#b6c1ac', padding: 9, borderRadius: 2, fontSize: 12, cursor: 'pointer' }}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
