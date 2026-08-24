import './layout.css'
import { styleObj } from '../../logic/styleObj.js'
import Icon from '../icons/Icon.jsx'

export default function Sidebar({ app, open = false, onClose, onNavigate }) {
  const go = (fn) => () => {
    fn?.()
    onNavigate?.()
  }

  const notifActive = app.tabNotifs
  const notifStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    textAlign: 'left',
    background: notifActive ? 'rgba(217,180,95,.16)' : 'none',
    border: 'none',
    color: notifActive ? '#f6f3ea' : '#a9b8a0',
    padding: '11px 12px',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    borderLeft: `3px solid ${notifActive ? '#d9b45f' : 'transparent'}`,
  }

  return (
    <aside id="app-sidebar" className={`ch-sidebar${open ? ' is-open' : ''}`}>
      <div className="ch-sidebar-brand">
        <div>
          <div className="ch-sidebar-logo">CHEDI</div>
          <div className="ch-sidebar-tag">CSA MEMBER APP</div>
        </div>
        <button type="button" className="ch-sidebar-close" onClick={onClose} aria-label="Close menu">
          <Icon name="close" stroke="#f6f3ea" size={16} strokeWidth={1.8} />
        </button>
      </div>

      <nav className="ch-sidebar-nav" aria-label="Main">
        {app.appNav.map((n, i) => (
          <button key={i} type="button" onClick={go(n.onClick)} style={styleObj(n.style)}>
            {n.iconEl}
            <span style={{ flex: 1, textAlign: 'left' }}>{n.label}</span>
            {n.dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#d9b45f' }} />}
          </button>
        ))}
        <button type="button" className="ch-sidebar-mobile-only" onClick={go(app.goNotifs)} style={notifStyle}>
          <Icon name="bell" stroke={notifActive ? '#f6f3ea' : '#a9b8a0'} size={19} strokeWidth={1.7} />
          <span style={{ flex: 1, textAlign: 'left' }}>Notifications</span>
        </button>
      </nav>

      <div className="ch-sidebar-user">
        <div className="ch-sidebar-user-row">
          <div className="ch-sidebar-avatar" />
          <div className="ch-sidebar-user-text">
            <div className="ch-sidebar-name">{app.displayName}</div>
            <div className="ch-sidebar-status">{app.memberStatus}</div>
          </div>
        </div>
        <button type="button" onClick={go(app.askLogout)} className="ch-sidebar-logout">
          Log out
        </button>
      </div>
    </aside>
  )
}
