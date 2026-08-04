import Badge from '../../ui/Badge.jsx'
import Icon from '../../icons/Icon.jsx'

export default function PaymentsPanel({ app }) {
  const history = app.paymentHistoryList || []

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: '0 0 8px' }}>Payments</h3>
      <p style={{ fontSize: 14, color: '#6f7566', margin: '0 0 18px' }}>
        Card and net banking are no longer used in-app. Payments are completed via admin payment requests — our team emails you, collects payment offline, then marks the request as Paid.
      </p>

      {!history.length && (
        <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22, color: '#6f7566', fontSize: 14 }}>
          No payment requests yet.
        </div>
      )}

      {history.map((p) => (
        <div key={p.id} style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: '18px 20px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="card" stroke="#2e5a41" size={22} strokeWidth={1.7} />
            <div>
              <div style={{ fontSize: 14, color: '#1c3b2c', fontWeight: 600 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: '#6f7566' }}>{p.ref} · {p.date} · {p.amountFormatted}</div>
            </div>
          </div>
          <Badge tone={p.status === 'succeeded' ? 'green' : p.status === 'pending' ? 'amber' : 'neutral'}>
            {p.status === 'succeeded' ? 'Paid' : p.status === 'pending' ? 'Awaiting admin' : p.status}
          </Badge>
        </div>
      ))}
    </div>
  )
}
