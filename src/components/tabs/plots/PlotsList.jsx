import { styleObj } from '../../../logic/styleObj.js'
import Icon from '../../icons/Icon.jsx'
import Button from '../../ui/Button.jsx'

export default function PlotsList({ app }) {
  return (
    <div>
      <div style={{ background: '#eef2e9', border: '1px solid #dbe0d1', borderRadius: 8, padding: '20px 24px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: "'Newsreader',serif", fontWeight: 500, fontSize: 22, color: '#1c3b2c', margin: 0 }}>Choose your organic farm plot</h3>
          <p style={{ fontSize: 14, color: '#4b5142', margin: '4px 0 0' }}>Each plot is 600 sq ft of certified organic land across Tamil Nadu. Lease one, we farm it for you.</p>
        </div>
        <div style={{ display: 'flex', gap: 22 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Newsreader',serif", fontSize: 24, color: '#1c3b2c' }}>{app.geoTotal}</div>
            <div style={{ fontSize: 11, color: '#6f7566' }}>total plots</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Newsreader',serif", fontSize: 24, color: '#2e5a41' }}>{app.geoAvail}</div>
            <div style={{ fontSize: 11, color: '#6f7566' }}>available</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', top: '50%', left: 13, transform: 'translateY(-50%)' }}>
            <Icon name="search" stroke="#8a8f7f" size={17} strokeWidth={1.8} />
          </span>
          <input
            value={app.plotSearch}
            onChange={app.onPlotSearch}
            placeholder="Search by name, region or crop"
            className="ch-field-input"
            style={{ margin: 0, padding: '12px 14px 12px 38px', borderRadius: 6, background: '#fff' }}
          />
        </div>
      </div>

      <div className="ch-grid ch-grid-3" style={{ gap: 12, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, color: '#6f7566', fontWeight: 600 }}>State</label>
          <select value={app.filterState} onChange={app.onFilterState} className="ch-field-input" style={{ marginTop: 5, padding: '11px 12px', borderRadius: 6, background: '#fff' }}>
            {app.stateOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#6f7566', fontWeight: 600 }}>District</label>
          <select value={app.filterDistrict} onChange={app.onFilterDistrict} className="ch-field-input" style={{ marginTop: 5, padding: '11px 12px', borderRadius: 6, background: '#fff' }}>
            {app.districtOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#6f7566', fontWeight: 600 }}>City</label>
          <select value={app.filterCity} onChange={app.onFilterCity} className="ch-field-input" style={{ marginTop: 5, padding: '11px 12px', borderRadius: 6, background: '#fff' }}>
            {app.cityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {app.statusFilters.map((f, i) => (
          <button key={i} type="button" onClick={f.onClick} className="ch-btn" style={styleObj(f.style)}>{f.label}</button>
        ))}
      </div>

      {app.plotEmpty && (
        <div style={{ background: '#fff', border: '1px dashed #c3bba6', borderRadius: 8, padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 15, color: '#6f7566' }}>No plots match your search.</div>
          <Button variant="outline" style={{ marginTop: 14, padding: '10px 22px', fontSize: 14 }} onClick={app.clearPlotSearch}>
            Clear search &amp; filters
          </Button>
        </div>
      )}

      <div className="ch-grid ch-grid-2" style={{ gap: 18 }}>
        {app.plotList.map((p) => (
          <div key={p.key} style={styleObj(p.cardStyle)}>
            <div style={{ height: 150, position: 'relative', overflow: 'hidden' }}>
              <img src={p.img} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={styleObj(p.badgeStyle)}>{p.statusLabel}</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Icon name="pin" stroke="#b98a2e" size={15} strokeWidth={1.8} />
                <span style={{ fontFamily: "'Newsreader',serif", fontSize: 21, color: '#1c3b2c' }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6f7566', marginTop: 4 }}>{p.region} · {p.size} · {p.crop}</div>
              <button type="button" onClick={p.onSelect} className="ch-btn" style={styleObj(p.btnStyle)}>{p.btnLabel}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
