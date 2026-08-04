import './ui.css'

export default function DataRow({ k, v, total = false, style }) {
  return (
    <div className={`ch-row${total ? ' ch-row-total' : ''}`} style={style}>
      <span className="ch-row-k">{k}</span>
      <span className="ch-row-v">{v}</span>
    </div>
  )
}
