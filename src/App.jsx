import useChediApp from './hooks/useChediApp.jsx'
import LoginScreen from './components/screens/LoginScreen.jsx'
import JoinScreen from './components/screens/JoinScreen.jsx'
import AppShell from './components/layout/AppShell.jsx'
import ConfirmModal from './components/modals/ConfirmModal.jsx'
import WelcomeTrackingModal from './components/modals/WelcomeTrackingModal.jsx'
import PaymentSheetModal from './components/modals/PaymentSheetModal.jsx'

export default function App() {
  const app = useChediApp()

  if (app.bootLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f6f3ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 28, letterSpacing: '.14em', color: '#1c3b2c' }}>CHEDI</div>
          <div style={{ marginTop: 12, fontSize: 14, color: '#6f7566' }}>Loading your Farm Club…</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f3ea', overflowX: 'hidden' }}>
      {app.globalError && (
        <div
          role="alert"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 300,
            background: '#f7efec',
            borderBottom: '1px solid #e6cfc7',
            color: '#b0361f',
            padding: '10px 20px',
            fontSize: 13,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span>{app.globalError}</span>
          <button type="button" onClick={app.clearGlobalError} className="ch-btn-plain" style={{ color: '#b0361f', fontWeight: 600 }}>
            Dismiss
          </button>
        </div>
      )}

      {app.isLogin && <LoginScreen app={app} />}
      {app.isJoin && <JoinScreen app={app} />}
      {app.isApp && <AppShell app={app} />}

      {app.logoutOpen && (
        <ConfirmModal
          title="Log out of CHEDI?"
          body="You'll need to log in again with an OTP sent to your registered email."
          cancelLabel="Stay logged in"
          confirmLabel="Log out"
          onCancel={app.cancelLogout}
          onConfirm={app.goHome}
          maxWidth={400}
          zIndex={200}
        />
      )}

      {app.welcomeOpen && <WelcomeTrackingModal app={app} />}
      {app.payOpen && <PaymentSheetModal app={app} />}
    </div>
  )
}
