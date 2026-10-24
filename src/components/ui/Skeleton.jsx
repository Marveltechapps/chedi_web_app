function Bone({ w = '100%', h = 12, r = 4, dark = false, style }) {
  const width = typeof w === 'number' ? `${w}px` : w
  const height = typeof h === 'number' ? `${h}px` : h
  return (
    <span
      className={dark ? 'ch-skel-dark' : 'ch-skel'}
      style={{ width, height, borderRadius: r, ...style }}
    />
  )
}

function HiddenLabel({ children }) {
  return <span className="ch-sr">{children}</span>
}

function OverviewBones() {
  return (
    <>
      <div className="ch-welcome-banner" style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22, marginBottom: 20 }}>
        <Bone w={74} h={74} r={6} style={{ flex: '0 0 74px' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Bone w={180} h={11} />
          <Bone w="72%" h={20} style={{ marginTop: 10 }} />
          <Bone w="48%" h={12} style={{ marginTop: 8 }} />
        </div>
        <Bone w={118} h={36} r={3} style={{ flex: '0 0 auto' }} />
      </div>

      <div className="ch-grid ch-grid-hero" style={{ gap: 20 }}>
        <Bone h={260} r={8} />
        <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22 }}>
          <Bone w={120} h={11} />
          <Bone w="70%" h={24} style={{ marginTop: 12 }} />
          <Bone w="55%" h={12} style={{ marginTop: 10 }} />
          <Bone w={130} h={36} r={3} style={{ marginTop: 18 }} />
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Bone w={190} h={20} />
          <Bone w={72} h={12} />
        </div>
        <div className="ch-grid ch-grid-6" style={{ gap: 14, marginTop: 18 }}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, overflow: 'hidden' }}>
              <Bone h={78} r={0} />
              <div style={{ padding: '10px 12px 14px' }}>
                <Bone w="70%" h={13} />
                <Bone w="46%" h={10} style={{ marginTop: 7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function AppBootSkeleton() {
  return (
    <div className="ch-app-shell" role="status" aria-busy="true" aria-live="polite">
      <HiddenLabel>Loading your Farm Club</HiddenLabel>
      <aside className="ch-sidebar" aria-hidden="true">
        <div className="ch-sidebar-brand">
          <div>
            <div className="ch-sidebar-logo">CHEDI</div>
            <div className="ch-sidebar-tag">CSA MEMBER APP</div>
          </div>
        </div>
        <nav className="ch-sidebar-nav">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px' }}>
              <Bone dark w={18} h={18} r={4} />
              <Bone dark w={i % 2 ? 118 : 88} h={12} />
            </div>
          ))}
        </nav>
        <div className="ch-sidebar-user" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bone dark w={38} h={38} r={19} />
          <div style={{ flex: 1 }}>
            <Bone dark w="72%" h={12} />
            <Bone dark w="48%" h={10} style={{ marginTop: 8 }} />
          </div>
        </div>
      </aside>
      <main className="ch-app-main">
        <header className="ch-header">
          <div className="ch-header-left">
            <span className="ch-hamburger" aria-hidden="true" />
            <Bone w={160} h={22} />
          </div>
          <div className="ch-header-right">
            <Bone w={110} h={14} />
            <Bone w={36} h={36} r={18} />
          </div>
        </header>
        <div className="ch-app-content ch-scroll">
          <div className="ch-app-content-inner">
            <OverviewBones />
          </div>
        </div>
      </main>
    </div>
  )
}

export function AuthBootSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      style={{ minHeight: '100dvh', background: '#eef2e9', display: 'flex', flexDirection: 'column' }}
    >
      <HiddenLabel>Loading</HiddenLabel>
      <div className="ch-auth-header">
        <span style={{ fontFamily: "'Newsreader',serif", fontSize: 24, fontWeight: 600, letterSpacing: '.14em', color: '#1c3b2c' }}>
          CHEDI
        </span>
      </div>
      <div className="ch-auth-body">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <Bone w={200} h={28} style={{ margin: '0 auto' }} />
          <Bone w={240} h={14} style={{ margin: '12px auto 26px' }} />
          <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 6, padding: 32 }}>
            <Bone w={150} h={12} />
            <Bone h={46} r={4} style={{ marginTop: 10 }} />
            <Bone h={48} r={2} style={{ marginTop: 22 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
