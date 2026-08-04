import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../icons/Icon.jsx'

export default function LegalModal({ app }) {
  return (
    <Modal onClose={app.closeLegal} maxWidth={560} zIndex={110} panelStyle={{ maxHeight: '82vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 26px', borderBottom: '1px solid #e4ded0' }}>
        <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>{app.legalTitle}</h3>
        <button type="button" onClick={app.closeLegal} className="ch-btn-plain">
          <Icon name="close" stroke="#6f7566" size={18} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ padding: '24px 26px', overflowY: 'auto' }}>
        <div style={{ fontSize: 12, color: '#9aa08d', fontFamily: "'Space Mono',monospace", marginBottom: 16 }}>Last updated · July 2026</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {app.legalBody.map((para, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.65, color: '#3a4033', margin: 0 }}>{para}</p>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 26px', borderTop: '1px solid #e4ded0' }}>
        <Button variant="primary" style={{ width: '100%', padding: 13, fontSize: 15 }} onClick={app.closeLegal}>
          Close
        </Button>
      </div>
    </Modal>
  )
}
