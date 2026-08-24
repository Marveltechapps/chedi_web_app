import { styleObj } from '../../../logic/styleObj.js'
import ProfilePanel from './ProfilePanel.jsx'
import AddressPanel from './AddressPanel.jsx'
import NotificationsPanel from './NotificationsPanel.jsx'
import PaymentsPanel from './PaymentsPanel.jsx'
import SecurityPanel from './SecurityPanel.jsx'
import SupportPanel from './SupportPanel.jsx'
import AccountPanel from './AccountPanel.jsx'

export default function SettingsTab({ app }) {
  return (
    <div className="ch-fade-slow ch-grid ch-grid-settings" style={{ gap: 24, alignItems: 'start' }}>
      <div className="ch-settings-nav">
        {app.settingsNav.map((i, idx) => (
          <button key={idx} type="button" onClick={i.onClick} className="ch-btn" style={styleObj(i.style)}>
            <span>{i.label}</span>
          </button>
        ))}
      </div>

      <div style={{ minWidth: 0 }}>
        {app.svProfile && <ProfilePanel app={app} />}
        {app.svAddress && <AddressPanel app={app} />}
        {app.svNotif && <NotificationsPanel app={app} />}
        {app.svPayments && <PaymentsPanel app={app} />}
        {app.svSecurity && <SecurityPanel app={app} />}
        {app.svSupport && <SupportPanel app={app} />}
        {app.svAccount && <AccountPanel app={app} />}
      </div>
    </div>
  )
}
