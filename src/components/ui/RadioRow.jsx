import './ui.css'
import Icon from '../icons/Icon.jsx'

export default function RadioRow({ selected, onSelect, icon, label, meta, style }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`ch-radio-row${selected ? ' is-selected' : ''}`}
      style={style}
    >
      <span className="ch-radio-dot">{selected && <span className="ch-radio-dot-fill" />}</span>
      {icon === 'card' && <Icon name="card" stroke="#2e5a41" size={20} />}
      <span style={{ minWidth: 0 }}>{label}</span>
      {meta && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6f7566', fontWeight: 400 }}>{meta}</span>}
    </button>
  )
}
