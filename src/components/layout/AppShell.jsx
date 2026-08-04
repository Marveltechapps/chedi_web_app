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

export default function AppShell({ app }) {
  return (
    <div className="ch-app-shell">
      <Sidebar app={app} />
      <main className="ch-app-main">
        <AppHeader app={app} />
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
