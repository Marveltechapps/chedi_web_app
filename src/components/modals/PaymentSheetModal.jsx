
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../icons/Icon.jsx'

export default function PaymentSheetModal({ app }) {
  return (
    <Modal onClose={app.payCancel} maxWidth={440} zIndex={200} panelStyle={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 'min(90vh, 720px)' }}>
      <div style={{ background: '#1c3b2c', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '0 0 auto' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#d9b45f', letterSpacing: '.1em' }}>CHEDI PAYMENT REQUEST</div>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 24, color: '#f6f3ea', marginTop: 2 }}>{app.payAmount}</div>
        </div>
        <button type="button" onClick={app.payCancel} className="ch-btn-plain">
          <Icon name="close" stroke="#b6c1ac" size={18} strokeWidth={1.8} />
        </button>
      </div>

      {app.payForm && (
        <>
          <div style={{ padding: 24, overflowY: 'auto', flex: '1 1 auto' }}>
            <p style={{ fontSize: 15, color: '#4b5142', margin: 0, lineHeight: 1.55 }}>
              Submit a payment request to the CHEDI admin team. An admin will email you, collect the payment offline, then mark it as paid from the Admin Dashboard.
            </p>
            <div style={{ marginTop: 18, background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 6, padding: 16 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '.08em', color: '#6f7566' }}>HOW IT WORKS</div>
              <ol style={{ margin: '10px 0 0', paddingLeft: 18, color: '#1c3b2c', fontSize: 14, lineHeight: 1.55 }}>
                <li>You send this payment request</li>
                <li>Admin contacts you by email</li>
                <li>You pay manually (bank transfer / offline)</li>
                <li>Admin marks the request as Paid — your account updates automatically</li>
              </ol>
            </div>
            {app.payError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 14, fontSize: 13, color: '#b0361f' }}>
                <Icon name="alert" stroke="#b0361f" size={15} strokeWidth={1.8} />
                <span>{app.payError}</span>
              </div>
            )}
          </div>

          <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #efe9db', flex: '0 0 auto', background: '#fff' }}>
            <Button variant="primary" style={{ width: '100%', padding: 15, fontSize: 16 }} onClick={app.submitPay} disabled={app.actionLoading}>
              Send payment request
            </Button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, fontSize: 12, color: '#8a8f7f' }}>
              <Icon name="lock" stroke="#8a8f7f" size={13} strokeWidth={1.8} />
              No card details collected in-app
            </div>
          </div>
        </>
      )}

      {app.payProcessing && (
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div className="ch-spin" style={{ width: 46, height: 46, border: '3px solid #dbe0d1', borderTopColor: '#1c3b2c', borderRadius: '50%', margin: '0 auto' }} />
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 22, color: '#1c3b2c', marginTop: 22 }}>Sending request…</div>
          <p style={{ fontSize: 14, color: '#6f7566', margin: '8px 0 0' }}>Creating your payment request for the admin team.</p>
        </div>
      )}

      {app.paySuccess && (
        <div style={{ padding: '44px 24px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#eef2e9', border: '1px solid #cdd5be', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 28, color: '#2e5a41' }}>✓</div>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 24, color: '#1c3b2c', marginTop: 20 }}>Request submitted</div>
          <p style={{ fontSize: 14, color: '#6f7566', margin: '8px 0 0', lineHeight: 1.5 }}>
            {app.paySuccessMessage || `${app.payAmount} payment request sent. Our team will email you to complete payment, then mark it as Paid.`}
          </p>
          <Button variant="primary" style={{ width: '100%', marginTop: 24, padding: 15, fontSize: 16 }} onClick={app.payContinue}>
            Continue
          </Button>
        </div>
      )}
    </Modal>
  )
}
