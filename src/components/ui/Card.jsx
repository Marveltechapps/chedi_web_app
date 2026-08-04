import './ui.css'

export default function Card({ padding = 22, className = '', style, children, ...rest }) {
  return (
    <div className={`ch-card${className ? ' ' + className : ''}`} style={{ padding, ...style }} {...rest}>
      {children}
    </div>
  )
}
