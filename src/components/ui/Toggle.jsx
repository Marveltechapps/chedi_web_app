import './ui.css'

export default function Toggle({ on, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className={`ch-toggle${on ? ' is-on' : ''}`}>
      <span className="ch-toggle-knob" />
    </button>
  )
}
