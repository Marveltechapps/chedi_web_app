import './ui.css'

export default function Badge({ tone = 'neutral', style, children }) {
  return (
    <span className={`ch-badge ch-badge-${tone}`} style={style}>
      {children}
    </span>
  )
}
