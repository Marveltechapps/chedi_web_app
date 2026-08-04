import Modal from '../ui/Modal.jsx'
import Icon from '../icons/Icon.jsx'
import ProgressTimeline from '../ui/ProgressTimeline.jsx'

export default function WelcomeTrackingModal({ app }) {
  return (
    <Modal onClose={app.closeWelcome} maxWidth={440} zIndex={200} panelStyle={{ overflow: 'hidden' }}>
      <div style={{ background: '#1c3b2c', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#d9b45f', letterSpacing: '.1em' }}>WELCOME BASKET</div>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 22, color: '#f6f3ea', marginTop: 2 }}>Arriving {app.welcomeEta}</div>
          <div style={{ fontSize: 12, color: '#b6c1ac', marginTop: 2 }}>Order #CHEDI-WB-0500 · to {app.welcomeAddr}</div>
        </div>
        <button type="button" onClick={app.closeWelcome} className="ch-btn-plain">
          <Icon name="close" stroke="#b6c1ac" size={18} strokeWidth={1.8} />
        </button>
      </div>
      <div style={{ padding: '24px 26px' }}>
        <ProgressTimeline steps={app.welcomeSteps} />
        <div style={{ background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: '14px 16px', fontSize: 13, color: '#4b5142', marginTop: 4 }}>
          A seasonal sample box — onion, tomato, greens &amp; more from our farms. No plastic packaging.
        </div>
      </div>
    </Modal>
  )
}
