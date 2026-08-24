import { styleObj } from '../../logic/styleObj.js'
import Button from '../ui/Button.jsx'
import DataRow from '../ui/DataRow.jsx'
import Icon from '../icons/Icon.jsx'

export default function MyPlotTab({ app }) {
  return (
    <div className="ch-fade-slow">
      {app.noPlot && (
        <div style={{ background: '#fff', border: '1px dashed #c3bba6', borderRadius: 8, padding: 56, textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 24, color: '#1c3b2c', margin: 0 }}>You haven't leased a plot yet.</h3>
          <p style={{ fontSize: 15, color: '#6f7566', margin: '10px 0 0' }}>Browse available plots and choose a subscription to start your weekly harvest.</p>
          <Button variant="primary" style={{ marginTop: 22, padding: '14px 28px', fontSize: 15 }} onClick={app.goPlots}>Browse plots →</Button>
        </div>
      )}

      {app.hasPlotV && (
        <>
          {app.multiPlot && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#6f7566', marginRight: 4 }}>Your plots:</span>
              {app.plotSwitch.map((p, i) => (
                <button key={i} type="button" onClick={p.onClick} className="ch-btn" style={styleObj(p.style)}>{p.name}</button>
              ))}
            </div>
          )}
          <div className="ch-grid ch-grid-myplot" style={{ gap: 20, alignItems: 'start' }}>
            <div>
              <div className="ch-media-hero" style={{ height: 320, borderRadius: 8, overflow: 'hidden', position: 'relative', border: '1px solid #cdd5be' }}>
                <img src={app.heroPlotImg} alt={app.plotName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: "'Space Mono',monospace", fontSize: 11, color: '#fff', background: 'rgba(28,59,44,.7)', padding: '5px 9px', borderRadius: 2 }}>
                  {app.plotName} · wide view
                </span>
              </div>
              <div className="ch-grid ch-grid-4" style={{ gap: 12, marginTop: 12 }}>
                {app.plotGallery.map((p, i) => (
                  <div key={i} style={{ height: 96, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid #cdd5be' }}>
                    <img src={p.img} alt={p.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', bottom: 6, left: 6, fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#fff', background: 'rgba(28,59,44,.7)', padding: '2px 5px', borderRadius: 2 }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, padding: 22 }}>
                <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: '0 0 14px' }}>Plot details</h3>
                {app.myPlotFacts.map((f, i) => <DataRow key={i} k={f.k} v={f.v} />)}
              </div>
              <div style={{ background: '#fff', border: '1px solid #e4ded0', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: 120, background: 'repeating-linear-gradient(45deg,#dbe1d1,#dbe1d1 10px,#e6ebdd 10px,#e6ebdd 20px)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#7c8370', background: 'rgba(246,243,234,.85)', padding: '4px 7px', borderRadius: 2 }}>map · Periyakulam, Theni</span>
                  <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-100%)' }}>
                    <Icon name="pin" stroke="#1c3b2c" size={26} strokeWidth={1.7} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
