import { useEffect, useState } from 'react'
import './layout.css'
import Sidebar from './Sidebar.jsx'
import AppHeader from './AppHeader.jsx'
import OverviewTab from '../tabs/OverviewTab.jsx'
import PlotsTab from '../tabs/PlotsTab.jsx'
import MyPlotTab from '../tabs/MyPlotTab.jsx'
import DeliveriesTab from '../tabs/DeliveriesTab.jsx'
import SubscriptionTab from '../tabs/SubscriptionTab.jsx'
import NotificationsTab from '../tabs/NotificationsTab.jsx'
import SettingsTab from '../tabs/settings/SettingsTab.jsx'
import LegalModal from '../modals/LegalModal.jsx'
import ConfirmModal from '../modals/ConfirmModal.jsx'

const NAV_BREAKPOINT = 960

export default function AppShell({ app }) {
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
  }, [app.appTitle])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > NAV_BREAKPOINT) setNavOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!navOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [navOpen])

  const closeNav = () => setNavOpen(false)

  return (
    <div className="ch-app-shell">
      <div
        className={`ch-nav-overlay${navOpen ? ' is-open' : ''}`}
        onClick={closeNav}
        aria-hidden="true"
      />
      <Sidebar app={app} open={navOpen} onClose={closeNav} onNavigate={closeNav} />
      <main className="ch-app-main">
        <AppHeader app={app} navOpen={navOpen} onToggleNav={() => setNavOpen((v) => !v)} />
        <div className="ch-app-content ch-scroll">
          <div className="ch-app-content-inner">
            {app.tabOverview && <OverviewTab app={app} />}
            {app.tabPlots && <PlotsTab app={app} />}
            {app.tabPlot && <MyPlotTab app={app} />}
            {app.tabDeliveries && <DeliveriesTab app={app} />}
            {app.tabSub && <SubscriptionTab app={app} />}
            {app.tabNotifs && <NotificationsTab app={app} />}
            {app.tabSettings && <SettingsTab app={app} />}
          </div>

          {app.legalOpen && <LegalModal app={app} />}

          {app.showDelete && (
            <ConfirmModal
              title="Delete your account?"
              body="Your membership, leased plot and all delivery history will be permanently removed. This can't be undone."
              cancelLabel="Keep my account"
              confirmLabel="Delete permanently"
              onCancel={app.cancelDelete}
              onConfirm={app.confirmDelete}
              danger
            />
          )}

          {app.confirmOpen && (
            <ConfirmModal
              title={app.confirmTitle}
              body={app.confirmBody}
              cancelLabel="Cancel"
              confirmLabel={app.confirmLabel}
              onCancel={app.confirmNo}
              onConfirm={app.confirmYes}
              danger
            />
          )}
        </div>
      </main>
    </div>
  )
}
