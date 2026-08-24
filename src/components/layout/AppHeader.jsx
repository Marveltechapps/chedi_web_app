import './layout.css'
import Icon from '../icons/Icon.jsx'

export default function AppHeader({ app, navOpen = false, onToggleNav }) {
  return (
    <header className="ch-header">
      <div className="ch-header-left">
        <button
          type="button"
          className="ch-hamburger"
          onClick={onToggleNav}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={navOpen}
          aria-controls="app-sidebar"
        >
          <Icon name={navOpen ? 'close' : 'menu'} stroke="#1c3b2c" size={18} strokeWidth={1.8} />
        </button>
        <div className="ch-header-title">{app.appTitle}</div>
      </div>
      <div className="ch-header-right">
        <div className="ch-header-badge">{app.plotBadge}</div>
        <button type="button" onClick={app.goNotifs} className="ch-notif-bell" aria-label="Notifications">
          <Icon name="bell" stroke="#2e5a41" size={18} strokeWidth={1.7} />
          <span className="ch-notif-dot" />
        </button>
      </div>
    </header>
  )
}
