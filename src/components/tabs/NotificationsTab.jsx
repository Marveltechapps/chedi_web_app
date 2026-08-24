import Button from '../ui/Button.jsx'

export default function NotificationsTab({ app }) {
  return (
    <div className="ch-fade-slow" style={{ maxWidth: 680 }}>
      <div className="ch-page-head" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 14, color: '#6f7566', margin: 0 }}>Recent activity on your plot, deliveries and account.</p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {app.notifHasItems && (
            <Button variant="link" style={{ color: '#b0361f', fontSize: 13 }} onClick={app.clearNotifs}>Clear all</Button>
          )}
        </div>
      </div>

      {app.notifEmpty && (
        <div style={{ background: '#fff', border: '1px dashed #c3bba6', borderRadius: 8, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6f7566' }}>You're all caught up — no notifications.</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {app.notifFeed.map((n, i) => (
          <div
            key={i}
            onClick={n.onClick}
            className="ch-notif-row"
            style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: n.rowBg, border: '1px solid #e4ded0', borderRadius: 8, padding: '16px 18px', cursor: 'pointer' }}
          >
            <div style={{ flex: '0 0 36px', height: 36, borderRadius: '50%', background: '#eef2e9', border: '1px solid #cdd5be', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n.iconEl}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, color: '#1c3b2c', fontWeight: 600 }}>{n.title}</span>
                <span style={{ fontSize: 12, color: '#9aa08d', flex: '0 0 auto' }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 14, color: '#4b5142', marginTop: 3 }}>{n.desc}</div>
            </div>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b98a2e', flex: '0 0 auto', marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
