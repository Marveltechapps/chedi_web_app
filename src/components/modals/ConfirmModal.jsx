import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

export default function ConfirmModal({ title, body, cancelLabel, confirmLabel, onCancel, onConfirm, danger = false, maxWidth = 420, zIndex = 100 }) {
  return (
    <Modal onClose={onCancel} maxWidth={maxWidth} zIndex={zIndex} panelStyle={{ padding: 32 }}>
      <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.55, color: '#4b5142', margin: '12px 0 0' }}>{body}</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button variant="outline" style={{ flex: 1, padding: 13, fontSize: 15 }} onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} style={{ flex: 1, padding: 13, fontSize: 15 }} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
