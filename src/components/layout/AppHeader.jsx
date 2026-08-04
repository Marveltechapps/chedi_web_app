import './layout.css'
import Icon from '../icons/Icon.jsx'

export default function AppHeader({ app }) {
  return (
    <div style={{ flex: '0 0 auto', height: 72, background: '#f6f3ea', borderBottom: '1px solid #e0d9c6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 34px', zIndex: 20 }}>
      <div style={{ fontFamily: "'Newsreader',serif", fontSize: 22, color: '#1c3b2c' }}>{app.appTitle}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: '#6f7566' }}>{app.plotBadge}</div>
        <button
          type="button"
          onClick={app.goNotifs}
          className="ch-notif-bell"
          style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: '#eef2e9', border: '1px solid #cdd5be', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Icon name="bell" stroke="#2e5a41" size={18} strokeWidth={1.7} />
          <span style={{ position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#b98a2e', border: '1.5px solid #eef2e9' }} />
        </button>
      </div>
    </div>
  )
}
