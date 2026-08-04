import './ui.css'

/**
 * variant → color treatment (see ui.css .ch-btn-*).
 * Layout (padding/width/margin/fontSize) is passed via `style`, mirroring
 * the per-instance inline styles of the source design.
 */
export default function Button({ variant = 'primary', className = '', style, disabled, children, ...rest }) {
  const cls = `ch-btn ch-btn-${variant}${className ? ' ' + className : ''}`
  return (
    <button
      type="button"
      className={cls}
      disabled={disabled}
      style={{ padding: '13px 20px', fontSize: 15, ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}
