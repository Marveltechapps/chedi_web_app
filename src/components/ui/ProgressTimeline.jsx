import './ui.css'

// steps: [{ title, time, done, active }]
export default function ProgressTimeline({ steps, accent = '#b98a2e', tickColor = '#f6f3ea' }) {
  return (
    <div>
      {steps.map((d, i) => {
        const dotBg = d.done ? '#1c3b2c' : d.active ? '#fdf3dc' : '#f0ece0'
        const dotBorder = d.done ? '#1c3b2c' : d.active ? accent : '#d4d9c9'
        const line = i === steps.length - 1 ? 'transparent' : d.done ? '#1c3b2c' : '#d4d9c9'
        const textColor = d.done || d.active ? '#1c3b2c' : '#9aa08d'
        return (
          <div className="ch-timeline-row" key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="ch-timeline-dot" style={{ background: dotBg, borderColor: dotBorder, color: tickColor }}>
                {d.done ? '✓' : ''}
              </div>
              <div className="ch-timeline-line" style={{ background: line }} />
            </div>
            <div className="ch-timeline-body">
              <div style={{ fontSize: 15, fontWeight: 600, color: textColor }}>{d.title}</div>
              <div style={{ fontSize: 13, color: '#6f7566', marginTop: 2 }}>{d.time}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
