import PlotsList from './plots/PlotsList.jsx'
import PlotDetail from './plots/PlotDetail.jsx'
import PlotPlan from './plots/PlotPlan.jsx'
import PlotReview from './plots/PlotReview.jsx'
import PlotDone from './plots/PlotDone.jsx'

export default function PlotsTab({ app }) {
  return (
    <div className="ch-fade-slow">
      {app.leaseList && <PlotsList app={app} />}
      {app.leaseDetail && <PlotDetail app={app} />}
      {app.leasePlan && <PlotPlan app={app} />}
      {app.leaseReview && <PlotReview app={app} />}
      {app.leaseDone && <PlotDone app={app} />}
    </div>
  )
}
