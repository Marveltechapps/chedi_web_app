import './ui.css'

export default function TextField({
  label,
  as = 'input',
  background,
  style,
  inputStyle,
  wrapStyle,
  error,
  children,
  ...rest
}) {
  const Tag = as
  return (
    <div style={wrapStyle}>
      {label && <label className="ch-field-label">{label}</label>}
      <Tag
        className="ch-field-input"
        style={{
          background: background || '#faf8f2',
          borderColor: error ? '#d38b78' : undefined,
          ...inputStyle,
          ...style,
        }}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        {children}
      </Tag>
      {error ? (
        <div style={{ marginTop: 6, fontSize: 12, color: '#b0361f' }}>{error}</div>
      ) : null}
    </div>
  )
}
