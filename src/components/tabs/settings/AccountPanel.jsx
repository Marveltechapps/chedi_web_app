import Button from '../../ui/Button.jsx'
import DataRow from '../../ui/DataRow.jsx'

export default function AccountPanel({ app }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 28 }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: '0 0 16px' }}>Account</h3>
        <DataRow k="Member ID" v="CHEDI-0500" style={{ padding: '11px 0' }} />
        <DataRow k="Member since" v="Jul 2026" style={{ padding: '11px 0' }} />
        <DataRow k="Language" v="English" style={{ padding: '11px 0' }} />
        <DataRow k="Billing" v="Manual · pay bill each renewal" style={{ padding: '11px 0', borderBottom: 'none' }} />
        <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
          <Button variant="outline" style={{ flex: 1, padding: 13, fontSize: 14 }}>Download my data</Button>
          <Button variant="outline" style={{ flex: 1, padding: 13, fontSize: 14 }} onClick={app.askLogout}>Log out</Button>
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid #e3b7ab', borderRadius: 8, padding: 24, marginTop: 16 }}>
        <div style={{ fontSize: 16, color: '#b0361f', fontWeight: 700 }}>Delete account</div>
        <p style={{ fontSize: 14, color: '#6f7566', margin: '6px 0 16px' }}>This permanently removes your membership, plot lease and delivery history. This cannot be undone.</p>
        <Button variant="danger-outline" style={{ padding: '12px 22px', fontSize: 14 }} onClick={app.askDelete}>Delete my account</Button>
      </div>
    </div>
  )
}
