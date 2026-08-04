import './ui.css'

export default function Modal({ onClose, maxWidth = 420, zIndex = 100, panelStyle, children }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div className="ch-modal-overlay" style={{ zIndex }} onClick={onClose}>
      <div className="ch-modal-panel" style={{ maxWidth, ...panelStyle }} onClick={stop}>
        {children}
      </div>
    </div>
  )
}
